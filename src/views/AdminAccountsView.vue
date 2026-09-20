<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Snowflake,
  UserRound,
  Users,
  WalletCards,
  X,
  XCircle,
} from 'lucide-vue-next'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

interface Role {
  id: number
  name: string
}

interface CurrentUser {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles: Role[]
}

const router = useRouter()

const accounts = ref<Account[]>([])
const currentUser = ref<CurrentUser | null>(null)

const loading = ref(true)
const refreshing = ref(false)
const changingStatusId = ref<number | null>(null)

const error = ref('')
const mobileMenuOpen = ref(false)

const searchQuery = ref('')
const statusFilter = ref('ALL')

const currentPage = ref(0)
const pageSize = ref(20)

const totalElements = ref(0)
const totalPages = ref(0)

const selectedAccount = ref<Account | null>(null)
const showStatusModal = ref(false)

const statusOptions = [
  'ALL',
  'ACTIVE',
  'INACTIVE',
  'FROZEN',
]

const sidebarItems = [
  {
    label: 'Overview',
    to: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: Users,
  },
  {
    label: 'Accounts',
    to: '/admin/accounts',
    icon: WalletCards,
  },
  {
    label: 'Transactions',
    to: '/admin/transactions',
    icon: FileText,
  },
]

const serviceItems = [
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

const filteredAccounts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return accounts.value
  }

  return accounts.value.filter((account) => {
    return (
      account.accountNumber?.toLowerCase().includes(query) ||
      account.ownerEmail?.toLowerCase().includes(query) ||
      account.accountType?.toLowerCase().includes(query)
    )
  })
})

const pageStart = computed(() => {
  if (totalElements.value === 0) {
    return 0
  }

  return currentPage.value * pageSize.value + 1
})

const pageEnd = computed(() => {
  return Math.min(
    (currentPage.value + 1) * pageSize.value,
    totalElements.value,
  )
})

const activeAccounts = computed(() => {
  return accounts.value.filter(
    (account) => account.accountStatus === 'ACTIVE',
  ).length
})

const frozenAccounts = computed(() => {
  return accounts.value.filter(
    (account) => account.accountStatus === 'FROZEN',
  ).length
})

const inactiveAccounts = computed(() => {
  return accounts.value.filter(
    (account) => account.accountStatus === 'INACTIVE',
  ).length
})

const visibleBalance = computed(() => {
  return accounts.value.reduce((total, account) => {
    return total + Number(account.balance || 0)
  }, 0)
})

function getToken(): string | null {
  return (
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  )
}

function getStoredUser(): CurrentUser | null {
  const storedUser =
    localStorage.getItem('user') ||
    sessionStorage.getItem('user')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

function formatCurrency(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency || ''}`
  }
}

function formatDate(date: string): string {
  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

function formatAccountType(accountType: string): string {
  if (!accountType) {
    return '—'
  }

  return accountType
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'status-active'

    case 'FROZEN':
      return 'status-frozen'

    case 'INACTIVE':
      return 'status-inactive'

    case 'CLOSED':
      return 'status-closed'

    default:
      return 'status-default'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active'

    case 'FROZEN':
      return 'Frozen'

    case 'INACTIVE':
      return 'Inactive'

    case 'CLOSED':
      return 'Closed'

    default:
      return status || 'Unknown'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'ACTIVE':
      return CheckCircle2

    case 'FROZEN':
      return Snowflake

    case 'INACTIVE':
      return XCircle

    case 'CLOSED':
      return XCircle

    default:
      return Clock3
  }
}

async function loadCurrentUser() {
  const token = getToken()

  if (!token) {
    await router.push('/login')
    return
  }

  const response = await fetch(
    `${API_BASE_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error('Unable to load your profile.')
  }

  const result = await response.json()

  currentUser.value = result?.data?.user ?? null

  const isAdmin = currentUser.value?.roles?.some(
    (role) => role.name === 'ADMIN',
  )

  if (!isAdmin) {
    await router.push('/dashboard')
  }
}

async function loadAccounts() {
  const token = getToken()

  if (!token) {
    await router.push('/login')
    return
  }

  const params = new URLSearchParams()

  params.set('page', String(currentPage.value))
  params.set('size', String(pageSize.value))
  params.set('sort', 'createdAt,desc')

  const response = await fetch(
    `${API_BASE_URL}/api/accounts/admin/all?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    if (response.status === 401) {
      await router.push('/login')
      return
    }

    if (response.status === 403) {
      throw new Error(
        'You do not have permission to view admin accounts.',
      )
    }

    throw new Error(
      `Failed to load accounts. Server returned ${response.status}.`,
    )
  }

  const result = await response.json()

  const data: PaginatedAccounts = result?.data

  accounts.value = data?.content ?? []
  totalElements.value = data?.totalElements ?? 0
  totalPages.value = data?.totalPages ?? 0
}

async function loadPage() {
  loading.value = true
  error.value = ''

  try {
    await loadCurrentUser()

    if (!currentUser.value) {
      return
    }

    await loadAccounts()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Something went wrong while loading accounts.'
  } finally {
    loading.value = false
  }
}

async function refreshAccounts() {
  if (refreshing.value) {
    return
  }

  refreshing.value = true
  error.value = ''

  try {
    await loadAccounts()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Unable to refresh accounts.'
  } finally {
    refreshing.value = false
  }
}

async function goToPage(page: number) {
  if (
    page < 0 ||
    page >= totalPages.value ||
    page === currentPage.value
  ) {
    return
  }

  currentPage.value = page

  loading.value = true
  error.value = ''

  try {
    await loadAccounts()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Unable to load this page.'
  } finally {
    loading.value = false
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function openStatusModal(account: Account) {
  selectedAccount.value = account
  showStatusModal.value = true
}

function closeStatusModal() {
  if (changingStatusId.value !== null) {
    return
  }

  showStatusModal.value = false
  selectedAccount.value = null
}

async function changeAccountStatus(status: string) {
  const account = selectedAccount.value

  if (!account) {
    return
  }

  if (account.accountStatus === status) {
    closeStatusModal()
    return
  }

  const token = getToken()

  if (!token) {
    await router.push('/login')
    return
  }

  changingStatusId.value = account.id
  error.value = ''

  try {
    const params = new URLSearchParams()

    params.set('accountNumber', account.accountNumber)
    params.set('status', status)

    const response = await fetch(
      `${API_BASE_URL}/api/accounts/admin/status?${params.toString()}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      if (response.status === 401) {
        await router.push('/login')
        return
      }

      if (response.status === 403) {
        throw new Error(
          'You do not have permission to change account status.',
        )
      }

      const result = await response.json().catch(() => null)

      throw new Error(
        result?.message ||
        `Failed to change account status. Server returned ${response.status}.`,
      )
    }

    const result = await response.json()

    const updatedAccount: Account | undefined =
      result?.data

    if (updatedAccount) {
      const index = accounts.value.findIndex(
        (item) => item.id === updatedAccount.id,
      )

      if (index !== -1) {
        accounts.value[index] = updatedAccount
      }
    } else {
      account.accountStatus = status
    }

    closeStatusModal()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Unable to change account status.'
  } finally {
    changingStatusId.value = null
  }
}

function clearSearch() {
  searchQuery.value = ''
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}

onMounted(() => {
  loadPage()
})
</script>

<template>
  <div class="admin-page">

    <!-- Mobile overlay -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': mobileMenuOpen }"
    >
      <div class="sidebar-top">

        <RouterLink
          to="/"
          class="brand"
          @click="mobileMenuOpen = false"
        >
          <span class="brand-mark">B</span>

          <span class="brand-text">
            <strong>Buuchezo</strong>
            <small>Bank</small>
          </span>
        </RouterLink>

        <button
          class="mobile-close"
          type="button"
          aria-label="Close navigation"
          @click="mobileMenuOpen = false"
        >
          <X :size="22" />
        </button>

        <div class="admin-label">
          <ShieldCheck :size="15" />
          <span>ADMINISTRATION</span>
        </div>

        <nav class="navigation">

          <RouterLink
            v-for="item in sidebarItems"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ active: item.to === '/admin/accounts' }"
            @click="mobileMenuOpen = false"
          >
            <component
              :is="item.icon"
              :size="19"
            />

            <span>{{ item.label }}</span>
          </RouterLink>

        </nav>

        <div class="nav-divider"></div>

        <div class="nav-section-title">
          SERVICES
        </div>

        <nav class="navigation">

          <RouterLink
            v-for="item in serviceItems"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            @click="mobileMenuOpen = false"
          >
            <component
              :is="item.icon"
              :size="19"
            />

            <span>{{ item.label }}</span>
          </RouterLink>

        </nav>
      </div>

      <div class="sidebar-bottom">

        <div class="admin-profile">

          <div class="profile-avatar">
            {{ currentUser?.firstName?.charAt(0) || 'A' }}
          </div>

          <div class="profile-details">
            <strong>
              {{
                currentUser
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : 'Administrator'
              }}
            </strong>

            <span>
              Administrator
            </span>
          </div>

        </div>

        <button
          class="logout-button"
          type="button"
          @click="logout"
        >
          <LogOut :size="18" />
          <span>Sign out</span>
        </button>

      </div>
    </aside>

    <!-- Main -->
    <main class="main-content">

      <!-- Header -->
      <header class="topbar">

        <div class="topbar-left">

          <button
            class="mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            @click="mobileMenuOpen = true"
          >
            <Menu :size="22" />
          </button>

          <div>
            <span class="eyebrow">
              ADMINISTRATION
            </span>

            <h1>
              Accounts
            </h1>
          </div>

        </div>

        <div class="topbar-right">

          <div class="admin-status">
            <span class="status-dot"></span>
            <span>System operational</span>
          </div>

          <div class="header-avatar">
            {{
              currentUser?.firstName?.charAt(0) || 'A'
            }}
          </div>

        </div>

      </header>

      <!-- Content -->
      <section class="content">

        <!-- Intro -->
        <div class="page-heading">

          <div>
            <div class="heading-icon">
              <WalletCards :size="24" />
            </div>

            <div>
              <h2>
                Account management
              </h2>

              <p>
                Review customer accounts and manage their current status.
              </p>
            </div>
          </div>

          <button
            class="refresh-button"
            type="button"
            :disabled="refreshing"
            @click="refreshAccounts"
          >
            <RefreshCw
              :size="17"
              :class="{ spinning: refreshing }"
            />

            <span>
              {{ refreshing ? 'Refreshing...' : 'Refresh' }}
            </span>
          </button>

        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="error-banner"
        >
          <div class="error-icon">
            <XCircle :size="20" />
          </div>

          <div class="error-content">
            <strong>
              Something went wrong
            </strong>

            <span>
              {{ error }}
            </span>
          </div>

          <button
            type="button"
            @click="loadPage"
          >
            Try again
          </button>
        </div>

        <!-- Statistics -->
        <div class="stats-grid">

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Total accounts
              </span>

              <div class="stat-icon blue">
                <WalletCards :size="19" />
              </div>
            </div>

            <strong class="stat-value">
              {{ totalElements }}
            </strong>

            <span class="stat-description">
              Registered bank accounts
            </span>

          </article>

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Active
              </span>

              <div class="stat-icon green">
                <CheckCircle2 :size="19" />
              </div>
            </div>

            <strong class="stat-value">
              {{ activeAccounts }}
            </strong>

            <span class="stat-description">
              Accounts currently active
            </span>

          </article>

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Frozen
              </span>

              <div class="stat-icon orange">
                <Snowflake :size="19" />
              </div>
            </div>

            <strong class="stat-value">
              {{ frozenAccounts }}
            </strong>

            <span class="stat-description">
              Accounts requiring attention
            </span>

          </article>

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Page balance
              </span>

              <div class="stat-icon purple">
                <CircleDollarSign :size="19" />
              </div>
            </div>

            <strong class="stat-value stat-balance">
              €{{ visibleBalance.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) }}
            </strong>

            <span class="stat-description">
              Combined balance on this page
            </span>

          </article>

        </div>

        <!-- Accounts panel -->
        <section class="accounts-panel">

          <!-- Toolbar -->
          <div class="panel-toolbar">

            <div class="toolbar-heading">

              <div class="toolbar-icon">
                <CreditCard :size="19" />
              </div>

              <div>
                <h3>
                  All accounts
                </h3>

                <span>
                  {{ totalElements }} accounts in the system
                </span>
              </div>

            </div>

            <div class="toolbar-controls">

              <!-- Search -->
              <div class="search-box">

                <Search :size="17" />

                <input
                  v-model="searchQuery"
                  type="search"
                  placeholder="Search account or owner..."
                />

                <button
                  v-if="searchQuery"
                  type="button"
                  aria-label="Clear search"
                  @click="clearSearch"
                >
                  <X :size="15" />
                </button>

              </div>

              <!-- Status filter -->
              <select
                v-model="statusFilter"
                class="status-filter"
              >
                <option
                  v-for="status in statusOptions"
                  :key="status"
                  :value="status"
                >
                  {{
                    status === 'ALL'
                      ? 'All statuses'
                      : getStatusLabel(status)
                  }}
                </option>
              </select>

            </div>

          </div>

          <!-- Loading -->
          <div
            v-if="loading"
            class="loading-state"
          >
            <RefreshCw
              :size="28"
              class="spinning"
            />

            <strong>
              Loading accounts...
            </strong>

            <span>
              Retrieving account information from the bank system.
            </span>
          </div>

          <!-- Empty -->
          <div
            v-else-if="filteredAccounts.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">
              <WalletCards :size="28" />
            </div>

            <h3>
              No accounts found
            </h3>

            <p>
              {{
                searchQuery || statusFilter !== 'ALL'
                  ? 'Try changing your search or filter.'
                  : 'There are currently no accounts to display.'
              }}
            </p>

            <button
              v-if="searchQuery || statusFilter !== 'ALL'"
              type="button"
              class="clear-filters-button"
              @click="
                searchQuery = '';
                statusFilter = 'ALL'
              "
            >
              Clear filters
            </button>
          </div>

          <!-- Desktop table -->
          <div
            v-else
            class="table-wrapper"
          >

            <table class="accounts-table">

              <thead>
              <tr>
                <th>
                  Account
                </th>

                <th>
                  Owner
                </th>

                <th>
                  Type
                </th>

                <th>
                  Balance
                </th>

                <th>
                  Status
                </th>

                <th>
                  Created
                </th>

                <th class="action-column">
                  Action
                </th>
              </tr>
              </thead>

              <tbody>

              <tr
                v-for="account in filteredAccounts.filter(
                    (item) =>
                      statusFilter === 'ALL' ||
                      item.accountStatus === statusFilter
                  )"
                :key="account.id"
              >

                <td>
                  <div class="account-cell">

                    <div class="account-icon">
                      <Building2 :size="18" />
                    </div>

                    <div>
                      <strong>
                        {{ account.accountNumber }}
                      </strong>

                      <span>
                          ID #{{ account.id }}
                        </span>
                    </div>

                  </div>
                </td>

                <td>
                  <div class="owner-cell">

                    <div class="owner-avatar">
                      <UserRound :size="15" />
                    </div>

                    <span>
                        {{ account.ownerEmail || '—' }}
                      </span>

                  </div>
                </td>

                <td>
                    <span class="type-badge">
                      {{ formatAccountType(account.accountType) }}
                    </span>
                </td>

                <td>
                  <strong class="balance-value">
                    {{
                      formatCurrency(
                        Number(account.balance || 0),
                        account.currency,
                      )
                    }}
                  </strong>
                </td>

                <td>

                    <span
                      class="status-badge"
                      :class="getStatusClass(account.accountStatus)"
                    >
                      <component
                        :is="getStatusIcon(account.accountStatus)"
                        :size="14"
                      />

                      {{
                        getStatusLabel(
                          account.accountStatus,
                        )
                      }}
                    </span>

                </td>

                <td>
                    <span class="date-cell">
                      <Clock3 :size="14" />
                      {{ formatDate(account.createdAt) }}
                    </span>
                </td>

                <td class="action-column">

                  <button
                    class="manage-button"
                    type="button"
                    @click="openStatusModal(account)"
                  >
                    Manage
                  </button>

                </td>

              </tr>

              </tbody>

            </table>

          </div>

          <!-- Pagination -->
          <div
            v-if="!loading && totalElements > 0"
            class="pagination"
          >

            <div class="pagination-info">
              Showing
              <strong>{{ pageStart }}</strong>
              –
              <strong>{{ pageEnd }}</strong>
              of
              <strong>{{ totalElements }}</strong>
              accounts
            </div>

            <div class="pagination-controls">

              <button
                type="button"
                :disabled="currentPage === 0"
                @click="goToPage(currentPage - 1)"
              >
                <ChevronLeft :size="17" />
                <span>Previous</span>
              </button>

              <span class="page-number">
                Page {{ currentPage + 1 }}
                of
                {{ Math.max(totalPages, 1) }}
              </span>

              <button
                type="button"
                :disabled="
                  currentPage >= totalPages - 1 ||
                  totalPages === 0
                "
                @click="goToPage(currentPage + 1)"
              >
                <span>Next</span>
                <ChevronRight :size="17" />
              </button>

            </div>

          </div>

        </section>

        <!-- Back -->
        <RouterLink
          to="/admin/dashboard"
          class="back-link"
        >
          <ArrowLeft :size="17" />
          Back to Admin Dashboard
        </RouterLink>

      </section>

    </main>

    <!-- Status modal -->
    <div
      v-if="showStatusModal && selectedAccount"
      class="modal-backdrop"
      @click.self="closeStatusModal"
    >

      <div class="status-modal">

        <div class="modal-header">

          <div class="modal-title-group">

            <div class="modal-icon">
              <ShieldCheck :size="21" />
            </div>

            <div>
              <h3>
                Manage account
              </h3>

              <span>
                {{ selectedAccount.accountNumber }}
              </span>
            </div>

          </div>

          <button
            type="button"
            class="modal-close"
            :disabled="changingStatusId !== null"
            @click="closeStatusModal"
          >
            <X :size="19" />
          </button>

        </div>

        <div class="modal-body">

          <div class="current-status">

            <span>
              Current status
            </span>

            <span
              class="status-badge"
              :class="
                getStatusClass(
                  selectedAccount.accountStatus,
                )
              "
            >
              <component
                :is="
                  getStatusIcon(
                    selectedAccount.accountStatus,
                  )
                "
                :size="14"
              />

              {{
                getStatusLabel(
                  selectedAccount.accountStatus,
                )
              }}
            </span>

          </div>

          <p class="modal-description">
            Select the new status for this account.
            Changing the status affects how the account
            can be used by the customer.
          </p>

          <div class="status-options">

            <button
              v-for="status in statusOptions.slice(1)"
              :key="status"
              type="button"
              class="status-option"
              :class="{
                selected:
                  selectedAccount.accountStatus === status,
              }"
              :disabled="changingStatusId !== null"
              @click="changeAccountStatus(status)"
            >

              <div
                class="status-option-icon"
                :class="getStatusClass(status)"
              >
                <component
                  :is="getStatusIcon(status)"
                  :size="18"
                />
              </div>

              <div class="status-option-text">
                <strong>
                  {{ getStatusLabel(status) }}
                </strong>

                <span v-if="status === 'ACTIVE'">
                  Account can be used normally.
                </span>

                <span v-else-if="status === 'FROZEN'">
                  Account is temporarily restricted.
                </span>

                <span v-else>
                  Account is not active.
                </span>
              </div>

              <CheckCircle2
                v-if="
                  selectedAccount.accountStatus === status
                "
                :size="19"
                class="selected-check"
              />

            </button>

          </div>

        </div>

        <div class="modal-footer">

          <button
            type="button"
            class="cancel-button"
            :disabled="changingStatusId !== null"
            @click="closeStatusModal"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #10233f;
  display: flex;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* =========================
   SIDEBAR
========================= */

.sidebar {
  width: 258px;
  min-width: 258px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e4eaf2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px 16px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar-top {
  min-width: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: #082c55;
  padding: 4px 10px 26px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(
    145deg,
    #07559b,
    #063d74
  );
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 21px;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(6, 61, 116, 0.2);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-text strong {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.brand-text small {
  color: #71819a;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  margin-top: 4px;
}

.admin-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8190a6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  padding: 0 12px 10px;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 13px;
  border-radius: 10px;
  color: #68788f;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.nav-item:hover {
  background: #f2f6fb;
  color: #07559b;
}

.nav-item.active {
  background: #eaf3fb;
  color: #07559b;
  font-weight: 700;
}

.nav-divider {
  height: 1px;
  background: #edf1f6;
  margin: 21px 12px 17px;
}

.nav-section-title {
  color: #a0acbc;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  padding: 0 13px 8px;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 9px;
  border-radius: 12px;
  background: #f7f9fc;
}

.profile-avatar,
.header-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #dcecf9;
  color: #07559b;
  font-weight: 800;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  font-size: 13px;
}

.profile-details {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.profile-details strong {
  font-size: 12px;
  color: #17304f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-details span {
  color: #8492a6;
  font-size: 10px;
  margin-top: 3px;
}

.logout-button {
  border: 0;
  background: transparent;
  color: #7b899c;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 11px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
}

.logout-button:hover {
  background: #f8eaea;
  color: #b53b3b;
}

.mobile-close,
.mobile-menu-button {
  display: none;
}

/* =========================
   MAIN
========================= */

.main-content {
  flex: 1;
  min-width: 0;
}

.topbar {
  height: 82px;
  background: #ffffff;
  border-bottom: 1px solid #e6ebf2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 38px;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
}

.topbar-left {
  gap: 16px;
}

.eyebrow {
  display: block;
  color: #7d8da3;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  margin-bottom: 4px;
}

.topbar h1 {
  margin: 0;
  color: #102d50;
  font-size: 24px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.6px;
}

.topbar-right {
  gap: 18px;
}

.admin-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #718097;
  font-size: 11px;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #27a56a;
  box-shadow: 0 0 0 4px #e7f6ee;
}

.header-avatar {
  width: 38px;
  height: 38px;
  font-size: 13px;
}

/* =========================
   CONTENT
========================= */

.content {
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  padding: 31px 38px 48px;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.page-heading > div:first-child {
  display: flex;
  align-items: center;
  gap: 14px;
}

.heading-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: #e6f2fb;
  color: #07559b;
  display: grid;
  place-items: center;
}

.page-heading h2 {
  margin: 0 0 5px;
  color: #122f51;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.page-heading p {
  margin: 0;
  color: #7a899d;
  font-size: 12px;
}

.refresh-button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #dce5ef;
  border-radius: 9px;
  background: #ffffff;
  color: #31506f;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.refresh-button:hover:not(:disabled) {
  border-color: #b7cee2;
  color: #07559b;
  background: #f8fbfe;
}

.refresh-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* =========================
   ERROR
========================= */

.error-banner {
  background: #fff7f7;
  border: 1px solid #f2d2d2;
  border-radius: 12px;
  min-height: 66px;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.error-icon {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #fbe8e8;
  color: #bd4a4a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.error-content strong {
  color: #8e3030;
  font-size: 12px;
}

.error-content span {
  color: #a26767;
  font-size: 11px;
}

.error-banner > button {
  border: 0;
  background: transparent;
  color: #9c3e3e;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

/* =========================
   STATS
========================= */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 22px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e4eaf1;
  border-radius: 13px;
  padding: 17px 18px;
  box-shadow: 0 4px 16px rgba(26, 59, 94, 0.025);
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.stat-label {
  color: #75859b;
  font-size: 11px;
  font-weight: 700;
}

.stat-icon {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  display: grid;
  place-items: center;
}

.stat-icon.blue {
  background: #e9f3fb;
  color: #07559b;
}

.stat-icon.green {
  background: #e8f7ef;
  color: #23855a;
}

.stat-icon.orange {
  background: #fff1df;
  color: #bc7622;
}

.stat-icon.purple {
  background: #eeeafd;
  color: #6650ae;
}

.stat-value {
  display: block;
  color: #102f53;
  font-size: 25px;
  line-height: 1;
  margin-top: 17px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

.stat-balance {
  font-size: 20px;
  letter-spacing: -0.5px;
}

.stat-description {
  display: block;
  color: #98a4b4;
  font-size: 10px;
  margin-top: 7px;
}

/* =========================
   ACCOUNTS PANEL
========================= */

.accounts-panel {
  background: #ffffff;
  border: 1px solid #e4eaf1;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(26, 59, 94, 0.025);
}

.panel-toolbar {
  min-height: 76px;
  padding: 15px 18px;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.toolbar-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #eef5fa;
  color: #07559b;
  display: grid;
  place-items: center;
}

.toolbar-heading h3 {
  margin: 0 0 3px;
  color: #183653;
  font-size: 13px;
  font-weight: 800;
}

.toolbar-heading span {
  color: #9aa6b5;
  font-size: 10px;
}

.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}

.search-box {
  width: 260px;
  height: 38px;
  border: 1px solid #dce5ee;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  color: #8493a5;
}

.search-box:focus-within {
  border-color: #9bbbd5;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.07);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #294662;
  font-size: 11px;
}

.search-box input::placeholder {
  color: #a2adba;
}

.search-box button {
  border: 0;
  background: transparent;
  color: #8c99aa;
  display: grid;
  place-items: center;
  padding: 3px;
  cursor: pointer;
}

.status-filter {
  height: 38px;
  min-width: 132px;
  border: 1px solid #dce5ee;
  border-radius: 8px;
  background: #ffffff;
  color: #49617a;
  padding: 0 10px;
  outline: 0;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}

.status-filter:focus {
  border-color: #9bbbd5;
}

/* =========================
   TABLE
========================= */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.accounts-table th {
  height: 45px;
  background: #fafbfd;
  border-bottom: 1px solid #edf1f5;
  color: #8a98a9;
  text-align: left;
  padding: 0 15px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
}

.accounts-table td {
  height: 68px;
  border-bottom: 1px solid #f0f3f6;
  padding: 0 15px;
  color: #53667d;
  font-size: 11px;
  vertical-align: middle;
}

.accounts-table tbody tr:last-child td {
  border-bottom: 0;
}

.accounts-table tbody tr:hover {
  background: #fbfdff;
}

.account-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.account-icon {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #edf5fb;
  color: #07559b;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.account-cell > div:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.account-cell strong {
  color: #24425f;
  font-size: 11px;
  letter-spacing: 0.2px;
}

.account-cell span {
  color: #a0aab8;
  font-size: 9px;
  margin-top: 3px;
}

.owner-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 210px;
}

.owner-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0f4f8;
  color: #6d8198;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.owner-cell > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 0 9px;
  border-radius: 7px;
  background: #f2f5f8;
  color: #64758a;
  font-size: 9px;
  font-weight: 700;
}

.balance-value {
  color: #183c60;
  font-size: 11px;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 25px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.status-active {
  background: #e9f7ef;
  color: #22865a;
}

.status-frozen {
  background: #fff2df;
  color: #ad6b1b;
}

.status-inactive,
.status-closed {
  background: #fbeaea;
  color: #b94b4b;
}

.status-default {
  background: #eef1f5;
  color: #69788c;
}

.date-cell {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #78889c;
  white-space: nowrap;
}

.action-column {
  text-align: right !important;
}

.manage-button {
  height: 31px;
  padding: 0 11px;
  border: 1px solid #d5e2ed;
  border-radius: 7px;
  background: #ffffff;
  color: #07559b;
  cursor: pointer;
  font-size: 9px;
  font-weight: 800;
}

.manage-button:hover {
  background: #edf6fc;
  border-color: #b7d0e3;
}

/* =========================
   LOADING / EMPTY
========================= */

.loading-state,
.empty-state {
  min-height: 290px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 40px 20px;
}

.loading-state {
  color: #07559b;
}

.loading-state strong {
  color: #34516e;
  font-size: 13px;
  margin-top: 13px;
}

.loading-state span {
  color: #98a5b5;
  font-size: 11px;
  margin-top: 5px;
}

.empty-icon {
  width: 58px;
  height: 58px;
  border-radius: 15px;
  background: #edf5fb;
  color: #07559b;
  display: grid;
  place-items: center;
}

.empty-state h3 {
  color: #294662;
  margin: 15px 0 5px;
  font-size: 15px;
}

.empty-state p {
  color: #8d9aaa;
  font-size: 11px;
  margin: 0;
}

.clear-filters-button {
  margin-top: 15px;
  height: 35px;
  padding: 0 13px;
  border: 1px solid #d6e2ed;
  border-radius: 8px;
  background: #ffffff;
  color: #07559b;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

/* =========================
   PAGINATION
========================= */

.pagination {
  min-height: 63px;
  padding: 12px 18px;
  border-top: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.pagination-info {
  color: #8b98a8;
  font-size: 10px;
}

.pagination-info strong {
  color: #556a82;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-controls button {
  min-height: 31px;
  padding: 0 9px;
  border: 1px solid #dce5ee;
  border-radius: 7px;
  background: #ffffff;
  color: #5d7088;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 9px;
  font-weight: 700;
}

.pagination-controls button:hover:not(:disabled) {
  border-color: #b7ccdf;
  color: #07559b;
}

.pagination-controls button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-number {
  color: #74849a;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

/* =========================
   BACK
========================= */

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #6d8096;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  margin-top: 20px;
}

.back-link:hover {
  color: #07559b;
}

/* =========================
   MODAL
========================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 31, 53, 0.38);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 500;
}

.status-modal {
  width: min(470px, 100%);
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 24px 70px rgba(16, 45, 80, 0.22);
  overflow: hidden;
}

.modal-header {
  padding: 17px 18px;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  background: #e8f3fb;
  color: #07559b;
  display: grid;
  place-items: center;
}

.modal-title-group h3 {
  margin: 0 0 3px;
  color: #183653;
  font-size: 14px;
  font-weight: 800;
}

.modal-title-group span {
  color: #94a0af;
  font-size: 10px;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: #f4f6f8;
  color: #728198;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.modal-close:hover:not(:disabled) {
  background: #eaf0f5;
  color: #294662;
}

.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-body {
  padding: 18px;
}

.current-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #edf1f5;
  border-radius: 10px;
}

.current-status > span:first-child {
  color: #6f8197;
  font-size: 10px;
  font-weight: 700;
}

.modal-description {
  color: #7d8c9e;
  font-size: 11px;
  line-height: 1.6;
  margin: 14px 2px;
}

.status-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-option {
  width: 100%;
  min-height: 62px;
  border: 1px solid #e2e8ef;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 11px;
  text-align: left;
  cursor: pointer;
}

.status-option:hover:not(:disabled) {
  border-color: #b9cfe0;
  background: #fbfdff;
}

.status-option.selected {
  border-color: #9fc1da;
  background: #f3f8fc;
}

.status-option:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.status-option-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.status-option-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.status-option-text strong {
  color: #294662;
  font-size: 11px;
}

.status-option-text span {
  color: #8b98a9;
  font-size: 9px;
}

.selected-check {
  color: #07559b;
}

.modal-footer {
  padding: 12px 18px;
  border-top: 1px solid #edf1f5;
  display: flex;
  justify-content: flex-end;
}

.cancel-button {
  height: 34px;
  padding: 0 13px;
  border: 1px solid #dce4ec;
  border-radius: 8px;
  background: #ffffff;
  color: #60738a;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

.cancel-button:hover:not(:disabled) {
  background: #f6f8fa;
}

.cancel-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================
   ANIMATION
========================= */

.spinning {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1180px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content {
    padding-left: 25px;
    padding-right: 25px;
  }

  .topbar {
    padding-left: 25px;
    padding-right: 25px;
  }
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    transform: translateX(-105%);
    transition: transform 0.25s ease;
    box-shadow: 15px 0 35px rgba(17, 46, 76, 0.12);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .mobile-close {
    display: grid;
    place-items: center;
    position: absolute;
    top: 25px;
    right: 15px;
    width: 35px;
    height: 35px;
    border: 0;
    border-radius: 8px;
    background: #f1f4f7;
    color: #62758b;
    cursor: pointer;
  }

  .mobile-menu-button {
    width: 38px;
    height: 38px;
    border: 1px solid #dde6ef;
    border-radius: 9px;
    background: #ffffff;
    color: #34526f;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(12, 33, 54, 0.32);
    z-index: 90;
  }

  .topbar {
    height: 74px;
  }

  .content {
    padding-top: 25px;
  }
}

@media (max-width: 700px) {
  .topbar-right .admin-status {
    display: none;
  }

  .topbar {
    padding: 0 17px;
  }

  .content {
    padding: 22px 15px 35px;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-heading > div:first-child {
    align-items: flex-start;
  }

  .refresh-button {
    align-self: stretch;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-value {
    font-size: 21px;
  }

  .stat-balance {
    font-size: 16px;
  }

  .panel-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .toolbar-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box,
  .status-filter {
    width: 100%;
  }

  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }

  .error-banner {
    align-items: flex-start;
  }
}

@media (max-width: 470px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .page-heading h2 {
    font-size: 18px;
  }

  .page-heading p {
    line-height: 1.5;
  }

  .topbar h1 {
    font-size: 21px;
  }

  .pagination-info {
    font-size: 9px;
  }

  .pagination-controls {
    gap: 5px;
  }

  .pagination-controls button {
    padding: 0 7px;
  }
}
</style>
