<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BankingShell from '@/components/BankingShell.vue'

import {
  WalletCards,
  Search,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  CalendarDays,
  ShieldCheck,
  Lock,
  Unlock,
  CircleAlert,
} from 'lucide-vue-next'

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/*
 * Change ONLY this value if your backend uses a different
 * endpoint for finding a user by email.
 *
 * Current assumption:
 * GET /api/users/email/{email}
 */
const USER_BY_EMAIL_ENDPOINT = '/api/users/email'

/* --------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  createdAt: string
}

interface Account {
  id: number
  accountNumber: string
  balance: number
  currency: string
  accountType: string
  accountStatus: string
  ownerEmail?: string
  createdAt: string
}

interface PaginatedAccounts {
  content: Account[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

/* --------------------------------------------------------------------------
 * State
 * -------------------------------------------------------------------------- */

const accounts = ref<Account[]>([])

const currentUser = ref<User | null>(null)

/*
 * Maps:
 *
 * email -> full customer name
 *
 * Example:
 *
 * {
 *   "john@example.com": "John Doe"
 * }
 */
const ownerNames = ref<Record<string, string>>({})

const loading = ref(true)
const refreshing = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const searchQuery = ref('')
const statusFilter = ref('')

const currentPage = ref(0)
const pageSize = ref(10)

const totalElements = ref(0)
const totalPages = ref(0)

const changingStatusAccount = ref<string | null>(null)

/* --------------------------------------------------------------------------
 * Computed
 * -------------------------------------------------------------------------- */

const filteredAccounts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const status = statusFilter.value.toUpperCase()

  return accounts.value.filter((account) => {
    const ownerName = getOwnerName(account).toLowerCase()
    const ownerEmail = account.ownerEmail?.toLowerCase() || ''

    const matchesSearch =
      !query ||
      account.accountNumber?.toLowerCase().includes(query) ||
      ownerName.includes(query) ||
      ownerEmail.includes(query) ||
      account.accountType?.toLowerCase().includes(query)

    const matchesStatus = !status || account.accountStatus?.toUpperCase() === status

    return matchesSearch && matchesStatus
  })
})

const activeAccounts = computed(() => {
  return accounts.value.filter((account) => account.accountStatus?.toUpperCase() === 'ACTIVE')
    .length
})

const frozenAccounts = computed(() => {
  return accounts.value.filter((account) => account.accountStatus?.toUpperCase() === 'FROZEN')
    .length
})

const inactiveAccounts = computed(() => {
  return accounts.value.filter((account) => account.accountStatus?.toUpperCase() === 'INACTIVE')
    .length
})

const visiblePages = computed(() => {
  const pages: number[] = []

  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 0; i < total; i += 1) {
      pages.push(i)
    }

    return pages
  }

  pages.push(0)

  if (current > 3) {
    pages.push(-1)
  }

  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  if (current < total - 4) {
    pages.push(-1)
  }

  pages.push(total - 1)

  return pages
})

/* --------------------------------------------------------------------------
 * Owner helpers
 * -------------------------------------------------------------------------- */

function getOwnerName(account: Account): string {
  const email = account.ownerEmail

  if (!email) {
    return 'Unknown owner'
  }

  const ownerName = ownerNames.value[email]

  if (ownerName) {
    return ownerName
  }

  return email
}

function getOwnerInitials(account: Account): string {
  const name = getOwnerName(account).trim()

  if (!name || name === 'Unknown owner') {
    return 'U'
  }

  const parts = name.split(/\s+/)

  if (parts.length >= 2) {
    const firstInitial = parts[0]?.charAt(0) ?? ''
    const lastInitial = parts[parts.length - 1]?.charAt(0) ?? ''

    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  return name.substring(0, 2).toUpperCase()
}

/* --------------------------------------------------------------------------
 * Authentication
 * -------------------------------------------------------------------------- */

function getAccessToken(): string | null {
  return localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken')
}

function logout() {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('adminUser')
  localStorage.removeItem('user')

  sessionStorage.removeItem('adminAccessToken')
  sessionStorage.removeItem('adminUser')
  sessionStorage.removeItem('user')

  router.push('/admin/login')
}

/* --------------------------------------------------------------------------
 * Current administrator
 * -------------------------------------------------------------------------- */

async function loadCurrentUser(): Promise<boolean> {
  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      logout()
      return false
    }

    if (response.status === 403) {
      errorMessage.value = 'You do not have permission to access the administration area.'

      return false
    }

    if (!response.ok) {
      throw new Error('Could not load your administrator profile.')
    }

    const result = await response.json()

    if (!result?.data?.user) {
      throw new Error('The server returned no administrator profile.')
    }

    currentUser.value = result.data.user

    return true
  } catch (error) {
    console.error('Failed to load current administrator:', error)

    throw error
  }
}

/* --------------------------------------------------------------------------
 * Load owner names
 * -------------------------------------------------------------------------- */

/**
 * Uses the ownerEmail from each account to retrieve the
 * corresponding user.
 *
 * The result is cached in ownerNames so we don't repeatedly
 * request the same user.
 */
async function loadOwnerNames(accountList: Account[]) {
  const token = getAccessToken()

  if (!token) {
    return
  }

  const emails = [
    ...new Set(
      accountList
        .map((account) => account.ownerEmail)
        .filter((email): email is string => Boolean(email && email.trim())),
    ),
  ]

  await Promise.all(
    emails.map(async (email) => {
      if (ownerNames.value[email]) {
        return
      }

      try {
        const params = new URLSearchParams()
        params.set('email', email)

        const response = await fetch(
          `${API_BASE_URL}/api/users/admin/search?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        )

        if (response.status === 401) {
          return
        }

        if (response.status === 403) {
          console.error('You do not have permission to search users.')
          return
        }

        if (response.status === 404) {
          console.warn(`No user found for email: ${email}`)
          return
        }

        if (!response.ok) {
          console.error(`Could not find user for email: ${email}`, response.status)
          return
        }

        const result = await response.json()

        /*
         * /api/users/admin/search returns UserWithAccountDto.
         *
         * The actual user is inside:
         *
         * result.data.user
         */
        const user = result?.data?.user

        if (!user) {
          console.warn(`No user data returned for email: ${email}`)
          return
        }

        const firstName = typeof user.firstName === 'string' ? user.firstName.trim() : ''

        const lastName = typeof user.lastName === 'string' ? user.lastName.trim() : ''

        const fullName = `${firstName} ${lastName}`.trim()

        if (fullName) {
          ownerNames.value[email] = fullName
        }
      } catch (error) {
        console.error(`Failed to load owner for ${email}:`, error)
      }
    }),
  )
}
/* --------------------------------------------------------------------------
 * Load accounts
 * -------------------------------------------------------------------------- */

async function loadAccounts() {
  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const params = new URLSearchParams()

    params.set('page', String(currentPage.value))
    params.set('size', String(pageSize.value))

    const response = await fetch(`${API_BASE_URL}/api/accounts/admin/all?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      logout()
      return
    }

    if (response.status === 403) {
      errorMessage.value = 'You do not have permission to view banking accounts.'

      return
    }

    if (!response.ok) {
      let message = 'Could not load banking accounts.'

      try {
        const result = await response.json()

        if (result?.message) {
          message = result.message
        }
      } catch {
        // Ignore invalid error response.
      }

      throw new Error(message)
    }

    const result: ApiResponse<PaginatedAccounts> = await response.json()

    if (!result?.data) {
      throw new Error('The server returned no account data.')
    }

    accounts.value = result.data.content ?? []

    totalElements.value = Number(result.data.totalElements ?? 0)

    totalPages.value = Number(result.data.totalPages ?? 0)

    currentPage.value = Number(result.data.number ?? currentPage.value)

    /*
     * Now that we have the accounts and their
     * owner emails, resolve the customer names.
     */
    await loadOwnerNames(accounts.value)
  } catch (error) {
    console.error('Failed to load accounts:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Something went wrong while loading accounts.'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

/* --------------------------------------------------------------------------
 * Search / filters
 * -------------------------------------------------------------------------- */

function clearSearch() {
  searchQuery.value = ''
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
}

/* --------------------------------------------------------------------------
 * Status management
 * -------------------------------------------------------------------------- */

async function changeAccountStatus(account: Account, status: 'ACTIVE' | 'INACTIVE' | 'FROZEN') {
  if (changingStatusAccount.value !== null) {
    return
  }

  if (account.accountStatus?.toUpperCase() === status) {
    return
  }

  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return
  }

  changingStatusAccount.value = account.accountNumber

  errorMessage.value = ''
  successMessage.value = ''

  try {
    const params = new URLSearchParams()

    params.set('accountNumber', account.accountNumber)

    params.set('status', status)

    const response = await fetch(`${API_BASE_URL}/api/accounts/admin/status?${params.toString()}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      logout()
      return
    }

    if (response.status === 403) {
      errorMessage.value = 'You do not have permission to change account status.'

      return
    }

    if (!response.ok) {
      let message = 'Could not change account status.'

      try {
        const result = await response.json()

        if (result?.message) {
          message = result.message
        }
      } catch {
        // Ignore invalid error response.
      }

      throw new Error(message)
    }

    const result: ApiResponse<Account> = await response.json()

    const updatedAccount = result?.data

    if (updatedAccount) {
      const index = accounts.value.findIndex((item) => item.accountNumber === account.accountNumber)

      if (index !== -1) {
        accounts.value[index] = updatedAccount

        /*
         * If the status endpoint doesn't return ownerEmail,
         * preserve it from the original account.
         */
        if (!accounts.value[index].ownerEmail && account.ownerEmail) {
          accounts.value[index].ownerEmail = account.ownerEmail
        }
      }
    } else {
      account.accountStatus = status
    }

    successMessage.value = `Account ${account.accountNumber} is now ${formatStatus(status)}.`
  } catch (error) {
    console.error('Failed to change account status:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Something went wrong while changing account status.'
  } finally {
    changingStatusAccount.value = null
  }
}

/* --------------------------------------------------------------------------
 * Refresh
 * -------------------------------------------------------------------------- */

async function refreshAccounts() {
  if (refreshing.value) {
    return
  }

  refreshing.value = true

  await loadAccounts()
}

/* --------------------------------------------------------------------------
 * Pagination
 * -------------------------------------------------------------------------- */

async function goToPage(page: number) {
  if (page < 0 || page >= totalPages.value || page === currentPage.value) {
    return
  }

  currentPage.value = page

  await loadAccounts()
}

async function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    await goToPage(currentPage.value + 1)
  }
}

async function previousPage() {
  if (currentPage.value > 0) {
    await goToPage(currentPage.value - 1)
  }
}

/* --------------------------------------------------------------------------
 * Formatting
 * -------------------------------------------------------------------------- */

function formatMoney(amount: number, currency: string): string {
  const numericAmount = Number(amount ?? 0)

  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

function formatDate(date: string): string {
  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

function formatAccountType(type: string): string {
  if (!type) {
    return 'Bank Account'
  }

  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatStatus(status: string): string {
  if (!status) {
    return 'Unknown'
  }

  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getStatusClass(status: string): string {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'status-active'

    case 'FROZEN':
      return 'status-frozen'

    case 'INACTIVE':
      return 'status-inactive'

    default:
      return 'status-unknown'
  }
}

/* --------------------------------------------------------------------------
 * Initial load
 * -------------------------------------------------------------------------- */

onMounted(async () => {
  try {
    const authenticated = await loadCurrentUser()

    if (!authenticated) {
      loading.value = false
      return
    }

    await loadAccounts()
  } catch (error) {
    console.error('Failed to initialize accounts page:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading the accounts page.'

    loading.value = false
  }
})
</script>

<template>
  <BankingShell
    :admin="true"
    :user="currentUser || undefined"
    page-title="Accounts"
    page-section="ADMINISTRATION"
  >
    <section class="admin-content">
      <!-- Page introduction -->
      <section class="page-introduction">
        <div>
          <span class="section-kicker"> ACCOUNT MANAGEMENT </span>

          <h2>Manage accounts</h2>

          <p>Review customer banking accounts, balances, ownership and access status.</p>
        </div>

        <div class="account-summary">
          <div class="summary-item">
            <span>Total accounts</span>
            <strong>
              {{ totalElements }}
            </strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span>Active</span>
            <strong>
              {{ activeAccounts }}
            </strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span>Frozen</span>
            <strong>
              {{ frozenAccounts }}
            </strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span>Inactive</span>
            <strong>
              {{ inactiveAccounts }}
            </strong>
          </div>
        </div>
      </section>

      <!-- Error -->
      <div v-if="errorMessage && !loading" class="message-banner error-banner">
        <div class="message-icon">
          <CircleAlert :size="18" />
        </div>

        <div class="message-content">
          <strong> Something went wrong </strong>

          <span>
            {{ errorMessage }}
          </span>
        </div>

        <button type="button" @click="loadAccounts">Try again</button>
      </div>

      <!-- Success -->
      <div v-if="successMessage" class="message-banner success-banner">
        <div class="message-icon">
          <ShieldCheck :size="18" />
        </div>

        <div class="message-content">
          <strong> Account updated </strong>

          <span>
            {{ successMessage }}
          </span>
        </div>

        <button type="button" aria-label="Dismiss success message" @click="successMessage = ''">
          <X :size="16" />
        </button>
      </div>

      <!-- Toolbar -->
      <section class="accounts-toolbar">
        <div class="search-box">
          <Search :size="18" />

          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search account, customer name, email or type..."
            aria-label="Search accounts"
          />

          <button
            v-if="searchQuery"
            type="button"
            class="clear-search"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <X :size="15" />
          </button>
        </div>

        <div class="toolbar-actions">
          <label class="filter-control">
            <span>Status</span>

            <select v-model="statusFilter">
              <option value="">All statuses</option>

              <option value="ACTIVE">Active</option>

              <option value="FROZEN">Frozen</option>

              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <button
            v-if="searchQuery || statusFilter"
            type="button"
            class="clear-filter-button"
            @click="clearFilters"
          >
            Clear
          </button>

          <button
            type="button"
            class="refresh-button"
            :disabled="refreshing"
            @click="refreshAccounts"
          >
            <RefreshCw
              :size="16"
              :class="{
                spinning: refreshing,
              }"
            />

            <span> Refresh </span>
          </button>
        </div>
      </section>

      <!-- Loading -->
      <section v-if="loading" class="table-loading">
        <div class="loading-spinner"></div>

        <h3>Loading accounts</h3>

        <p>Retrieving the latest banking account information...</p>
      </section>

      <!-- Accounts -->
      <section v-else class="accounts-panel">
        <!-- Table header -->
        <div class="table-header">
          <div>
            <span class="panel-kicker"> BANKING ACCOUNTS </span>

            <h3>Account directory</h3>
          </div>

          <span class="result-count">
            {{ filteredAccounts.length }}

            {{ filteredAccounts.length === 1 ? 'account' : 'accounts' }}
          </span>
        </div>

        <!-- Empty -->
        <div v-if="filteredAccounts.length === 0" class="empty-state">
          <div class="empty-icon">
            <WalletCards :size="25" />
          </div>

          <h3>No accounts found</h3>

          <p>No accounts match the current search or filter.</p>

          <button v-if="searchQuery || statusFilter" type="button" @click="clearFilters">
            Clear filters
          </button>
        </div>

        <!-- Table -->
        <div v-else class="table-wrapper">
          <table class="accounts-table">
            <thead>
              <tr>
                <th>Account</th>

                <th>Customer</th>

                <th>Type</th>

                <th>Balance</th>

                <th>Status</th>

                <th>Created</th>

                <th class="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="account in filteredAccounts" :key="account.id">
                <!-- Account -->
                <td>
                  <div class="account-cell">
                    <div class="account-icon">
                      <WalletCards :size="18" />
                    </div>

                    <div class="account-details">
                      <strong>
                        {{ account.accountNumber }}
                      </strong>

                      <span> #{{ account.id }} </span>
                    </div>
                  </div>
                </td>

                <!-- Customer -->
                <td>
                  <div class="owner-cell">
                    <div class="owner-avatar">
                      {{ getOwnerInitials(account) }}
                    </div>

                    <div class="owner-details">
                      <strong>
                        {{ getOwnerName(account) }}
                      </strong>

                      <span v-if="account.ownerEmail">
                        <Mail :size="12" />

                        {{ account.ownerEmail }}
                      </span>

                      <span v-else> Account holder </span>
                    </div>
                  </div>
                </td>

                <!-- Type -->
                <td>
                  <span class="account-type">
                    {{ formatAccountType(account.accountType) }}
                  </span>
                </td>

                <!-- Balance -->
                <td>
                  <div class="balance-cell">
                    <strong>
                      {{ formatMoney(account.balance, account.currency) }}
                    </strong>

                    <span>
                      {{ account.currency }}
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td>
                  <span class="status-badge" :class="getStatusClass(account.accountStatus)">
                    <span class="status-dot"></span>

                    {{ formatStatus(account.accountStatus) }}
                  </span>
                </td>

                <!-- Created -->
                <td>
                  <div class="created-cell">
                    <CalendarDays :size="14" />

                    <span>
                      {{ formatDate(account.createdAt) }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="actions-column">
                  <div class="account-actions">
                    <!-- Activate -->
                    <button
                      v-if="account.accountStatus?.toUpperCase() !== 'ACTIVE'"
                      type="button"
                      class="action-button activate-button"
                      title="Activate account"
                      :disabled="changingStatusAccount === account.accountNumber"
                      @click="changeAccountStatus(account, 'ACTIVE')"
                    >
                      <Unlock :size="15" />

                      <span v-if="changingStatusAccount === account.accountNumber">
                        Updating...
                      </span>

                      <span v-else> Activate </span>
                    </button>

                    <!-- Freeze -->
                    <button
                      v-if="account.accountStatus?.toUpperCase() === 'ACTIVE'"
                      type="button"
                      class="action-button freeze-button"
                      title="Freeze account"
                      :disabled="changingStatusAccount === account.accountNumber"
                      @click="changeAccountStatus(account, 'FROZEN')"
                    >
                      <Lock :size="15" />

                      <span v-if="changingStatusAccount === account.accountNumber">
                        Updating...
                      </span>

                      <span v-else> Freeze </span>
                    </button>

                    <!-- More -->
                    <details class="action-menu">
                      <summary class="more-button" title="More account actions">
                        <MoreHorizontal :size="17" />
                      </summary>

                      <div class="action-menu-content">
                        <button
                          v-if="account.accountStatus?.toUpperCase() !== 'INACTIVE'"
                          type="button"
                          @click="changeAccountStatus(account, 'INACTIVE')"
                        >
                          Set inactive
                        </button>

                        <button
                          v-if="account.accountStatus?.toUpperCase() !== 'FROZEN'"
                          type="button"
                          @click="changeAccountStatus(account, 'FROZEN')"
                        >
                          Freeze account
                        </button>

                        <button
                          v-if="account.accountStatus?.toUpperCase() !== 'ACTIVE'"
                          type="button"
                          @click="changeAccountStatus(account, 'ACTIVE')"
                        >
                          Activate account
                        </button>
                      </div>
                    </details>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <div class="pagination-info">
            Showing

            <strong>
              {{ totalElements === 0 ? 0 : currentPage * pageSize + 1 }}
            </strong>

            to

            <strong>
              {{ Math.min((currentPage + 1) * pageSize, totalElements) }}
            </strong>

            of

            <strong>
              {{ totalElements }}
            </strong>

            accounts
          </div>

          <div class="pagination-controls">
            <button
              type="button"
              :disabled="currentPage === 0"
              aria-label="Previous page"
              @click="previousPage"
            >
              <ChevronLeft :size="17" />
            </button>

            <template v-for="(page, index) in visiblePages" :key="`${page}-${index}`">
              <span v-if="page === -1" class="pagination-ellipsis">
                <MoreHorizontal :size="16" />
              </span>

              <button
                v-else
                type="button"
                :class="{
                  active: page === currentPage,
                }"
                @click="goToPage(page)"
              >
                {{ page + 1 }}
              </button>
            </template>

            <button
              type="button"
              :disabled="currentPage >= totalPages - 1"
              aria-label="Next page"
              @click="nextPage"
            >
              <ChevronRight :size="17" />
            </button>
          </div>
        </div>
      </section>
    </section>
  </BankingShell>
</template>

<style scoped>
.admin-content {
  width: 100%;
}

.page-introduction {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 28px;
}

.section-kicker,
.panel-kicker {
  display: block;
  margin-bottom: 7px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
}

.page-introduction h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
}

.page-introduction p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

/* --------------------------------------------------------------------------
 * Summary
 * -------------------------------------------------------------------------- */

.account-summary {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 70px;
}

.summary-item span {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
}

.summary-item strong {
  font-size: 20px;
  line-height: 1;
  color: #111827;
}

.summary-divider {
  width: 1px;
  height: 34px;
  background: #e5e7eb;
}

/* --------------------------------------------------------------------------
 * Messages
 * -------------------------------------------------------------------------- */

.message-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  margin-bottom: 18px;
  border-radius: 12px;
  border: 1px solid;
}

.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.message-content strong {
  font-size: 13px;
}

.message-content span {
  font-size: 13px;
}

.message-banner button {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
}

.error-banner {
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
}

.success-banner {
  color: #166534;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

/* --------------------------------------------------------------------------
 * Toolbar
 * -------------------------------------------------------------------------- */

.accounts-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(560px, 100%);
  height: 44px;
  padding: 0 13px;
  border: 1px solid #dfe3e8;
  border-radius: 11px;
  background: #ffffff;
  color: #6b7280;
}

.search-box:focus-within {
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  color: #111827;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.clear-search {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-control span {
  font-size: 12px;
  color: #6b7280;
}

.filter-control select {
  height: 40px;
  padding: 0 34px 0 11px;
  border: 1px solid #dfe3e8;
  border-radius: 9px;
  background: #ffffff;
  color: #111827;
  cursor: pointer;
}

.refresh-button,
.clear-filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 40px;
  padding: 0 13px;
  border: 1px solid #dfe3e8;
  border-radius: 9px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.refresh-button:hover,
.clear-filter-button:hover {
  background: #f9fafb;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinning {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --------------------------------------------------------------------------
 * Loading
 * -------------------------------------------------------------------------- */

.table-loading {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  margin-bottom: 18px;
  border: 3px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.table-loading h3 {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.table-loading p {
  margin: 7px 0 0;
  color: #6b7280;
  font-size: 13px;
}

/* --------------------------------------------------------------------------
 * Accounts panel
 * -------------------------------------------------------------------------- */

.accounts-panel {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 5px 24px rgba(15, 23, 42, 0.035);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border-bottom: 1px solid #eef0f2;
}

.table-header h3 {
  margin: 0;
  font-size: 17px;
  color: #111827;
}

.result-count {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 12px;
  font-weight: 600;
}

/* --------------------------------------------------------------------------
 * Table
 * -------------------------------------------------------------------------- */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.accounts-table {
  width: 100%;
  min-width: 1120px;
  border-collapse: collapse;
}

.accounts-table th {
  padding: 12px 18px;
  border-bottom: 1px solid #eef0f2;
  background: #fafafa;
  color: #6b7280;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.accounts-table td {
  padding: 15px 18px;
  border-bottom: 1px solid #f0f1f3;
  vertical-align: middle;
}

.accounts-table tbody tr:last-child td {
  border-bottom: 0;
}

.accounts-table tbody tr:hover {
  background: #fafbfc;
}

/* --------------------------------------------------------------------------
 * Account / Owner
 * -------------------------------------------------------------------------- */

.account-cell,
.owner-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}

.account-icon,
.owner-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f3f4f6;
  color: #374151;
}

.owner-avatar {
  border-radius: 50%;
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.account-details,
.owner-details,
.balance-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.account-details strong,
.owner-details strong,
.balance-cell strong {
  color: #111827;
  font-size: 13px;
  font-weight: 650;
}

.owner-details strong {
  white-space: nowrap;
}

.account-details span,
.owner-details span,
.balance-cell span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
  font-size: 11px;
}

.owner-details span {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-type {
  color: #374151;
  font-size: 13px;
  font-weight: 550;
  white-space: nowrap;
}

.balance-cell strong {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.balance-cell span {
  display: block;
}

/* --------------------------------------------------------------------------
 * Status
 * -------------------------------------------------------------------------- */

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-active {
  background: #ecfdf3;
  color: #166534;
}

.status-active .status-dot {
  background: #22c55e;
}

.status-frozen {
  background: #fff7ed;
  color: #9a3412;
}

.status-frozen .status-dot {
  background: #f97316;
}

.status-inactive {
  background: #f3f4f6;
  color: #4b5563;
}

.status-inactive .status-dot {
  background: #9ca3af;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

.status-unknown .status-dot {
  background: #9ca3af;
}

/* --------------------------------------------------------------------------
 * Created
 * -------------------------------------------------------------------------- */

.created-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
  white-space: nowrap;
}

/* --------------------------------------------------------------------------
 * Actions
 * -------------------------------------------------------------------------- */

.actions-column {
  text-align: right !important;
}

.account-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.action-button,
.more-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 32px;
  padding: 0 9px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.action-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.activate-button:hover {
  border-color: #86efac;
  background: #f0fdf4;
  color: #166534;
}

.freeze-button:hover {
  border-color: #fdba74;
  background: #fff7ed;
  color: #9a3412;
}

.action-menu {
  position: relative;
}

.action-menu summary {
  list-style: none;
}

.action-menu summary::-webkit-details-marker {
  display: none;
}

.more-button {
  width: 32px;
  padding: 0;
}

.action-menu-content {
  position: absolute;
  z-index: 20;
  right: 0;
  top: calc(100% + 6px);
  min-width: 160px;
  padding: 5px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.12);
}

.action-menu-content button {
  display: block;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #374151;
  text-align: left;
  cursor: pointer;
  font-size: 12px;
}

.action-menu-content button:hover {
  background: #f3f4f6;
}

/* --------------------------------------------------------------------------
 * Empty
 * -------------------------------------------------------------------------- */

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: #f3f4f6;
  color: #6b7280;
}

.empty-state h3 {
  margin: 0;
  color: #111827;
  font-size: 16px;
}

.empty-state p {
  margin: 7px 0 16px;
  color: #6b7280;
  font-size: 13px;
}

.empty-state button {
  padding: 8px 13px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 650;
}

/* --------------------------------------------------------------------------
 * Pagination
 * -------------------------------------------------------------------------- */

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 20px;
  border-top: 1px solid #eef0f2;
}

.pagination-info {
  color: #6b7280;
  font-size: 12px;
}

.pagination-info strong {
  color: #374151;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-controls button,
.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.pagination-controls button:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-controls button.active {
  background: #111827;
  border-color: #111827;
  color: #ffffff;
}

.pagination-controls button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination-ellipsis {
  border-color: transparent;
  cursor: default;
}

/* --------------------------------------------------------------------------
 * Responsive
 * -------------------------------------------------------------------------- */

@media (max-width: 1100px) {
  .page-introduction {
    align-items: flex-start;
    flex-direction: column;
  }

  .account-summary {
    width: 100%;
    justify-content: space-between;
  }

  .accounts-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .toolbar-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 700px) {
  .page-introduction h2 {
    font-size: 23px;
  }

  .account-summary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .summary-divider {
    display: none;
  }

  .toolbar-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .filter-control {
    width: 100%;
  }

  .filter-control select {
    flex: 1;
  }

  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-controls {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
