<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
  XCircle,
  Eye,
  CreditCard,
  CircleDollarSign,
} from 'lucide-vue-next'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Transaction {
  id: number
  reference: string
  fromAccountNumber?: string
  fromBankCode?: string
  toAccountNumber?: string
  toBankCode?: string
  amount: number
  description?: string
  currency?: string
  transactionType?: string
  transactionStatus?: string
  transactionDirection?: string
  channel?: string
  createdAt: string
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

const transactions = ref<Transaction[]>([])
const currentUser = ref<CurrentUser | null>(null)

const loadingProfile = ref(true)
const loadingTransactions = ref(false)
const refreshing = ref(false)

const error = ref('')
const accountNumber = ref('')
const searchedAccountNumber = ref('')

const transactionFilter = ref('ALL')
const directionFilter = ref('ALL')

const mobileMenuOpen = ref(false)

const selectedTransaction = ref<Transaction | null>(null)
const showTransactionModal = ref(false)

const depositAccountNumber = ref('')
const depositAmount = ref('')
const depositDescription = ref('')
const depositLoading = ref(false)
const depositMessage = ref('')
const depositError = ref('')

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

const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const typeMatches =
      transactionFilter.value === 'ALL' ||
      transaction.transactionType === transactionFilter.value

    const directionMatches =
      directionFilter.value === 'ALL' ||
      transaction.transactionDirection === directionFilter.value

    return typeMatches && directionMatches
  })
})

const totalVolume = computed(() => {
  return transactions.value.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0,
  )
})

const creditCount = computed(() => {
  return transactions.value.filter(
    (transaction) =>
      transaction.transactionDirection === 'CREDIT',
  ).length
})

const debitCount = computed(() => {
  return transactions.value.filter(
    (transaction) =>
      transaction.transactionDirection === 'DEBIT',
  ).length
})

const uniqueTransactionTypes = computed(() => {
  const types = new Set<string>()

  transactions.value.forEach((transaction) => {
    if (transaction.transactionType) {
      types.add(transaction.transactionType)
    }
  })

  return Array.from(types)
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
  currency = 'EUR',
): string {
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(amount)
  } catch {
    return `${Number(amount || 0).toFixed(2)} ${
      currency || 'EUR'
    }`
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
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate)
}

function formatType(type?: string): string {
  if (!type) {
    return 'Unknown'
  }

  return type
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

function formatDirection(direction?: string): string {
  if (!direction) {
    return 'Unknown'
  }

  return direction === 'CREDIT'
    ? 'Credit'
    : direction === 'DEBIT'
      ? 'Debit'
      : direction
}

function formatStatus(status?: string): string {
  if (!status) {
    return 'Unknown'
  }

  return status
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

function formatChannel(channel?: string): string {
  if (!channel) {
    return '—'
  }

  return channel
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
}

function getDirectionClass(direction?: string): string {
  if (direction === 'CREDIT') {
    return 'direction-credit'
  }

  if (direction === 'DEBIT') {
    return 'direction-debit'
  }

  return 'direction-default'
}

function getStatusClass(status?: string): string {
  if (!status) {
    return 'status-default'
  }

  const normalized = status.toUpperCase()

  if (
    normalized === 'COMPLETED' ||
    normalized === 'SUCCESS' ||
    normalized === 'SUCCESSFUL'
  ) {
    return 'status-success'
  }

  if (
    normalized === 'PENDING' ||
    normalized === 'PROCESSING'
  ) {
    return 'status-pending'
  }

  if (
    normalized === 'FAILED' ||
    normalized === 'REJECTED' ||
    normalized === 'CANCELLED'
  ) {
    return 'status-failed'
  }

  return 'status-default'
}

function getDirectionIcon(direction?: string) {
  return direction === 'CREDIT'
    ? ArrowDownLeft
    : ArrowUpRight
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
    if (response.status === 401) {
      await router.push('/login')
      return
    }

    throw new Error(
      'Unable to load your administrator profile.',
    )
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

async function loadTransactions(
  requestedAccountNumber = searchedAccountNumber.value,
) {
  const token = getToken()

  if (!token) {
    await router.push('/login')
    return
  }

  if (!requestedAccountNumber.trim()) {
    transactions.value = []
    searchedAccountNumber.value = ''
    return
  }

  loadingTransactions.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()

    params.set(
      'accountNumber',
      requestedAccountNumber.trim(),
    )

    const response = await fetch(
      `${API_BASE_URL}/api/transactions/history?${params.toString()}`,
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
          'You do not have permission to view transaction history.',
        )
      }

      const result = await response.json().catch(() => null)

      throw new Error(
        result?.message ||
        `Failed to load transactions. Server returned ${response.status}.`,
      )
    }

    const result = await response.json()

    transactions.value = result?.data ?? []
    searchedAccountNumber.value =
      requestedAccountNumber.trim()
  } catch (err) {
    transactions.value = []

    error.value =
      err instanceof Error
        ? err.message
        : 'Unable to load transaction history.'
  } finally {
    loadingTransactions.value = false
  }
}

async function searchTransactions() {
  const value = accountNumber.value.trim()

  if (!value) {
    error.value =
      'Please enter an account number before searching.'
    return
  }

  await loadTransactions(value)
}

async function refreshTransactions() {
  if (refreshing.value) {
    return
  }

  if (!searchedAccountNumber.value) {
    return
  }

  refreshing.value = true

  try {
    await loadTransactions(
      searchedAccountNumber.value,
    )
  } finally {
    refreshing.value = false
  }
}

function clearSearch() {
  accountNumber.value = ''
  searchedAccountNumber.value = ''
  transactions.value = []
  error.value = ''
}

function openTransaction(transaction: Transaction) {
  selectedTransaction.value = transaction
  showTransactionModal.value = true
}

function closeTransaction() {
  showTransactionModal.value = false
  selectedTransaction.value = null
}

async function makeDeposit() {
  depositMessage.value = ''
  depositError.value = ''

  const token = getToken()

  if (!token) {
    await router.push('/login')
    return
  }

  const targetAccount = depositAccountNumber.value.trim()
  const amount = Number(depositAmount.value)

  if (!targetAccount) {
    depositError.value =
      'Please enter the destination account number.'
    return
  }

  if (!depositAmount.value || Number.isNaN(amount)) {
    depositError.value =
      'Please enter a valid deposit amount.'
    return
  }

  if (amount <= 0) {
    depositError.value =
      'Deposit amount must be greater than zero.'
    return
  }

  depositLoading.value = true

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/transactions/admin/deposit`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          toAccountNumber: targetAccount,
          amount,
          description:
            depositDescription.value.trim() ||
            'Admin deposit',
        }),
      },
    )

    if (!response.ok) {
      if (response.status === 401) {
        await router.push('/login')
        return
      }

      if (response.status === 403) {
        throw new Error(
          'You do not have permission to make admin deposits.',
        )
      }

      const result = await response.json().catch(() => null)

      throw new Error(
        result?.message ||
        `Deposit failed. Server returned ${response.status}.`,
      )
    }

    const result = await response.json()

    depositMessage.value =
      result?.message ||
      'Deposit completed successfully.'

    depositAccountNumber.value = ''
    depositAmount.value = ''
    depositDescription.value = ''

    if (searchedAccountNumber.value) {
      await loadTransactions(
        searchedAccountNumber.value,
      )
    }
  } catch (err) {
    depositError.value =
      err instanceof Error
        ? err.message
        : 'Unable to complete the deposit.'
  } finally {
    depositLoading.value = false
  }
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}

onMounted(async () => {
  loadingProfile.value = true

  try {
    currentUser.value = getStoredUser()

    await loadCurrentUser()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Unable to load administrator profile.'
  } finally {
    loadingProfile.value = false
  }
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
            :class="{
              active: item.to === '/admin/transactions',
            }"
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
              Transactions
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

        <!-- Heading -->
        <div class="page-heading">

          <div class="heading-content">

            <div class="heading-icon">
              <FileText :size="24" />
            </div>

            <div>
              <h2>
                Transaction management
              </h2>

              <p>
                Search an account and review its transaction history.
              </p>
            </div>

          </div>

          <button
            class="refresh-button"
            type="button"
            :disabled="
              refreshing ||
              !searchedAccountNumber
            "
            @click="refreshTransactions"
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
            @click="error = ''"
          >
            Dismiss
          </button>
        </div>

        <!-- Search -->
        <section class="search-panel">

          <div class="search-panel-heading">

            <div class="search-panel-icon">
              <Search :size="20" />
            </div>

            <div>
              <h3>
                Find transaction history
              </h3>

              <p>
                Enter a customer's account number to retrieve transactions.
              </p>
            </div>

          </div>

          <form
            class="account-search-form"
            @submit.prevent="searchTransactions"
          >

            <div class="account-input">

              <CreditCard :size="18" />

              <input
                v-model="accountNumber"
                type="text"
                placeholder="Enter account number"
                autocomplete="off"
              />

              <button
                v-if="accountNumber"
                type="button"
                class="clear-input"
                aria-label="Clear account number"
                @click="accountNumber = ''"
              >
                <X :size="15" />
              </button>

            </div>

            <button
              class="search-button"
              type="submit"
              :disabled="loadingTransactions"
            >
              <Search :size="17" />
              <span>
                {{ loadingTransactions ? 'Searching...' : 'Search' }}
              </span>
            </button>

            <button
              v-if="searchedAccountNumber"
              type="button"
              class="reset-button"
              @click="clearSearch"
            >
              Clear
            </button>

          </form>

          <div
            v-if="searchedAccountNumber"
            class="searched-account"
          >
            <span>
              Showing history for
            </span>

            <strong>
              {{ searchedAccountNumber }}
            </strong>
          </div>

        </section>

        <!-- Stats -->
        <div
          v-if="searchedAccountNumber && !loadingTransactions"
          class="stats-grid"
        >

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Transactions
              </span>

              <div class="stat-icon blue">
                <FileText :size="19" />
              </div>
            </div>

            <strong class="stat-value">
              {{ transactions.length }}
            </strong>

            <span class="stat-description">
              Transactions returned
            </span>

          </article>

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Credits
              </span>

              <div class="stat-icon green">
                <ArrowDownLeft :size="19" />
              </div>
            </div>

            <strong class="stat-value">
              {{ creditCount }}
            </strong>

            <span class="stat-description">
              Incoming transactions
            </span>

          </article>

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Debits
              </span>

              <div class="stat-icon orange">
                <ArrowUpRight :size="19" />
              </div>
            </div>

            <strong class="stat-value">
              {{ debitCount }}
            </strong>

            <span class="stat-description">
              Outgoing transactions
            </span>

          </article>

          <article class="stat-card">

            <div class="stat-top">
              <span class="stat-label">
                Page volume
              </span>

              <div class="stat-icon purple">
                <CircleDollarSign :size="19" />
              </div>
            </div>

            <strong class="stat-value stat-balance">
              €{{ totalVolume.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) }}
            </strong>

            <span class="stat-description">
              Sum of returned transactions
            </span>

          </article>

        </div>

        <!-- Transactions -->
        <section
          v-if="searchedAccountNumber"
          class="transactions-panel"
        >

          <div class="panel-toolbar">

            <div class="toolbar-heading">

              <div class="toolbar-icon">
                <FileText :size="19" />
              </div>

              <div>
                <h3>
                  Transaction history
                </h3>

                <span>
                  {{
                    filteredTransactions.length
                  }}
                  transactions displayed
                </span>
              </div>

            </div>

            <div class="toolbar-controls">

              <div class="select-wrapper">

                <select
                  v-model="transactionFilter"
                  class="filter-select"
                >
                  <option value="ALL">
                    All types
                  </option>

                  <option
                    v-for="type in uniqueTransactionTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ formatType(type) }}
                  </option>
                </select>

                <ChevronDown :size="14" />

              </div>

              <div class="select-wrapper">

                <select
                  v-model="directionFilter"
                  class="filter-select"
                >
                  <option value="ALL">
                    All directions
                  </option>

                  <option value="CREDIT">
                    Credit
                  </option>

                  <option value="DEBIT">
                    Debit
                  </option>
                </select>

                <ChevronDown :size="14" />

              </div>

            </div>

          </div>

          <!-- Loading -->
          <div
            v-if="loadingTransactions"
            class="loading-state"
          >
            <RefreshCw
              :size="28"
              class="spinning"
            />

            <strong>
              Loading transactions...
            </strong>

            <span>
              Retrieving transaction history from the bank system.
            </span>
          </div>

          <!-- Empty -->
          <div
            v-else-if="filteredTransactions.length === 0"
            class="empty-state"
          >

            <div class="empty-icon">
              <FileText :size="28" />
            </div>

            <h3>
              No transactions found
            </h3>

            <p>
              {{
                transactions.length > 0
                  ? 'Try changing the transaction filters.'
                  : 'This account has no transaction history available.'
              }}
            </p>

          </div>

          <!-- Table -->
          <div
            v-else
            class="table-wrapper"
          >

            <table class="transactions-table">

              <thead>
              <tr>
                <th>
                  Transaction
                </th>

                <th>
                  Direction
                </th>

                <th>
                  Type
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

                <th>
                  Channel
                </th>

                <th>
                  Date
                </th>

                <th class="action-column">
                  Details
                </th>
              </tr>
              </thead>

              <tbody>

              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
              >

                <!-- Transaction -->
                <td>

                  <div class="transaction-cell">

                    <div
                      class="transaction-icon"
                      :class="
                          getDirectionClass(
                            transaction.transactionDirection,
                          )
                        "
                    >
                      <component
                        :is="
                            getDirectionIcon(
                              transaction.transactionDirection,
                            )
                          "
                        :size="17"
                      />
                    </div>

                    <div class="transaction-info">

                      <strong>
                        {{
                          transaction.reference ||
                          `Transaction #${transaction.id}`
                        }}
                      </strong>

                      <span>
                          {{
                          transaction.description ||
                          'No description'
                        }}
                        </span>

                    </div>

                  </div>

                </td>

                <!-- Direction -->
                <td>

                    <span
                      class="direction-badge"
                      :class="
                        getDirectionClass(
                          transaction.transactionDirection,
                        )
                      "
                    >
                      <component
                        :is="
                          getDirectionIcon(
                            transaction.transactionDirection,
                          )
                        "
                        :size="13"
                      />

                      {{
                        formatDirection(
                          transaction.transactionDirection,
                        )
                      }}
                    </span>

                </td>

                <!-- Type -->
                <td>

                    <span class="type-badge">
                      {{
                        formatType(
                          transaction.transactionType,
                        )
                      }}
                    </span>

                </td>

                <!-- Amount -->
                <td>

                  <strong
                    class="amount-value"
                    :class="
                        transaction.transactionDirection ===
                        'CREDIT'
                          ? 'amount-credit'
                          : 'amount-debit'
                      "
                  >
                    {{
                      transaction.transactionDirection ===
                      'CREDIT'
                        ? '+'
                        : '-'
                    }}{{
                      formatCurrency(
                        Number(transaction.amount || 0),
                        transaction.currency,
                      )
                    }}
                  </strong>

                </td>

                <!-- Status -->
                <td>

                    <span
                      class="status-badge"
                      :class="
                        getStatusClass(
                          transaction.transactionStatus,
                        )
                      "
                    >
                      <CheckCircle2
                        v-if="
                          transaction.transactionStatus ===
                            'COMPLETED' ||
                          transaction.transactionStatus ===
                            'SUCCESS' ||
                          transaction.transactionStatus ===
                            'SUCCESSFUL'
                        "
                        :size="13"
                      />

                      <Clock3
                        v-else-if="
                          transaction.transactionStatus ===
                            'PENDING' ||
                          transaction.transactionStatus ===
                            'PROCESSING'
                        "
                        :size="13"
                      />

                      <XCircle
                        v-else
                        :size="13"
                      />

                      {{
                        formatStatus(
                          transaction.transactionStatus,
                        )
                      }}
                    </span>

                </td>

                <!-- Channel -->
                <td>

                    <span class="channel-cell">
                      {{
                        formatChannel(
                          transaction.channel,
                        )
                      }}
                    </span>

                </td>

                <!-- Date -->
                <td>

                    <span class="date-cell">
                      <Clock3 :size="13" />

                      {{
                        formatDate(
                          transaction.createdAt,
                        )
                      }}
                    </span>

                </td>

                <!-- Details -->
                <td class="action-column">

                  <button
                    class="details-button"
                    type="button"
                    @click="
                        openTransaction(transaction)
                      "
                  >
                    <Eye :size="15" />
                    <span>View</span>
                  </button>

                </td>

              </tr>

              </tbody>

            </table>

          </div>

        </section>

        <!-- Admin deposit -->
        <section class="deposit-panel">

          <div class="deposit-header">

            <div class="deposit-heading">

              <div class="deposit-icon">
                <CircleDollarSign :size="21" />
              </div>

              <div>
                <h3>
                  Admin deposit
                </h3>

                <p>
                  Add funds to a customer account.
                </p>
              </div>

            </div>

            <span class="admin-only-badge">
              <ShieldCheck :size="13" />
              Admin only
            </span>

          </div>

          <div
            v-if="depositMessage"
            class="success-message"
          >
            <CheckCircle2 :size="17" />

            <span>
              {{ depositMessage }}
            </span>

            <button
              type="button"
              @click="depositMessage = ''"
            >
              <X :size="15" />
            </button>
          </div>

          <div
            v-if="depositError"
            class="deposit-error"
          >
            <XCircle :size="17" />

            <span>
              {{ depositError }}
            </span>

            <button
              type="button"
              @click="depositError = ''"
            >
              <X :size="15" />
            </button>
          </div>

          <form
            class="deposit-form"
            @submit.prevent="makeDeposit"
          >

            <div class="form-field">

              <label>
                Account number
              </label>

              <input
                v-model="depositAccountNumber"
                type="text"
                placeholder="0000000000"
                autocomplete="off"
              />

            </div>

            <div class="form-field">

              <label>
                Amount
              </label>

              <div class="amount-input">

                <span>
                  €
                </span>

                <input
                  v-model="depositAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                />

              </div>

            </div>

            <div class="form-field description-field">

              <label>
                Description
              </label>

              <input
                v-model="depositDescription"
                type="text"
                placeholder="Optional description"
              />

            </div>

            <button
              class="deposit-button"
              type="submit"
              :disabled="depositLoading"
            >
              <RefreshCw
                v-if="depositLoading"
                :size="16"
                class="spinning"
              />

              <CircleDollarSign
                v-else
                :size="16"
              />

              {{
                depositLoading
                  ? 'Processing...'
                  : 'Make deposit'
              }}
            </button>

          </form>

        </section>

        <RouterLink
          to="/admin/dashboard"
          class="back-link"
        >
          <ArrowLeft :size="17" />
          Back to Admin Dashboard
        </RouterLink>

      </section>

    </main>

    <!-- Transaction detail modal -->
    <div
      v-if="showTransactionModal && selectedTransaction"
      class="modal-backdrop"
      @click.self="closeTransaction"
    >

      <div class="transaction-modal">

        <div class="modal-header">

          <div class="modal-title-group">

            <div
              class="modal-transaction-icon"
              :class="
                getDirectionClass(
                  selectedTransaction.transactionDirection,
                )
              "
            >
              <component
                :is="
                  getDirectionIcon(
                    selectedTransaction.transactionDirection,
                  )
                "
                :size="21"
              />
            </div>

            <div>
              <h3>
                Transaction details
              </h3>

              <span>
                {{
                  selectedTransaction.reference ||
                  `Transaction #${selectedTransaction.id}`
                }}
              </span>
            </div>

          </div>

          <button
            type="button"
            class="modal-close"
            @click="closeTransaction"
          >
            <X :size="19" />
          </button>

        </div>

        <div class="modal-body">

          <div class="modal-amount">

            <span>
              {{
                formatDirection(
                  selectedTransaction.transactionDirection,
                )
              }}
            </span>

            <strong
              :class="
                selectedTransaction.transactionDirection ===
                'CREDIT'
                  ? 'amount-credit'
                  : 'amount-debit'
              "
            >
              {{
                selectedTransaction.transactionDirection ===
                'CREDIT'
                  ? '+'
                  : '-'
              }}{{
                formatCurrency(
                  Number(
                    selectedTransaction.amount || 0,
                  ),
                  selectedTransaction.currency,
                )
              }}
            </strong>

          </div>

          <div class="detail-grid">

            <div class="detail-item">
              <span>
                Reference
              </span>

              <strong>
                {{
                  selectedTransaction.reference || '—'
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                Transaction ID
              </span>

              <strong>
                #{{ selectedTransaction.id }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                From account
              </span>

              <strong>
                {{
                  selectedTransaction.fromAccountNumber ||
                  '—'
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                To account
              </span>

              <strong>
                {{
                  selectedTransaction.toAccountNumber ||
                  '—'
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                Type
              </span>

              <strong>
                {{
                  formatType(
                    selectedTransaction.transactionType,
                  )
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                Status
              </span>

              <strong>
                {{
                  formatStatus(
                    selectedTransaction.transactionStatus,
                  )
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                Direction
              </span>

              <strong>
                {{
                  formatDirection(
                    selectedTransaction.transactionDirection,
                  )
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                Channel
              </span>

              <strong>
                {{
                  formatChannel(
                    selectedTransaction.channel,
                  )
                }}
              </strong>
            </div>

            <div class="detail-item">
              <span>
                Created
              </span>

              <strong>
                {{
                  formatDate(
                    selectedTransaction.createdAt,
                  )
                }}
              </strong>
            </div>

            <div class="detail-item detail-wide">
              <span>
                Description
              </span>

              <strong>
                {{
                  selectedTransaction.description ||
                  'No description'
                }}
              </strong>
            </div>

          </div>

        </div>

        <div class="modal-footer">

          <button
            type="button"
            class="cancel-button"
            @click="closeTransaction"
          >
            Close
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

.heading-content {
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
  opacity: 0.55;
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
   SEARCH
========================= */

.search-panel {
  background: #ffffff;
  border: 1px solid #e4eaf1;
  border-radius: 14px;
  padding: 19px;
  margin-bottom: 21px;
  box-shadow: 0 4px 18px rgba(26, 59, 94, 0.025);
}

.search-panel-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 16px;
}

.search-panel-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eaf4fb;
  color: #07559b;
  display: grid;
  place-items: center;
}

.search-panel-heading h3 {
  margin: 0 0 3px;
  color: #183653;
  font-size: 13px;
  font-weight: 800;
}

.search-panel-heading p {
  margin: 0;
  color: #93a0af;
  font-size: 10px;
}

.account-search-form {
  display: flex;
  align-items: stretch;
  gap: 9px;
}

.account-input {
  flex: 1;
  height: 42px;
  min-width: 0;
  border: 1px solid #dbe4ed;
  border-radius: 9px;
  background: #ffffff;
  color: #8292a5;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
}

.account-input:focus-within {
  border-color: #9bbbd5;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.07);
}

.account-input input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #294662;
  font-size: 11px;
}

.account-input input::placeholder {
  color: #a3aebb;
}

.clear-input {
  border: 0;
  background: transparent;
  color: #8998a9;
  display: grid;
  place-items: center;
  padding: 3px;
  cursor: pointer;
}

.search-button {
  height: 42px;
  padding: 0 17px;
  border: 0;
  border-radius: 9px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

.search-button:hover:not(:disabled) {
  background: #06467f;
}

.search-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.reset-button {
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dbe4ed;
  border-radius: 9px;
  background: #ffffff;
  color: #61758b;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

.reset-button:hover {
  background: #f6f8fa;
}

.searched-account {
  margin-top: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8c99aa;
  font-size: 10px;
}

.searched-account strong {
  color: #07559b;
  font-size: 11px;
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
  font-size: 19px;
}

.stat-description {
  display: block;
  color: #98a4b4;
  font-size: 10px;
  margin-top: 7px;
}

/* =========================
   TRANSACTIONS
========================= */

.transactions-panel {
  background: #ffffff;
  border: 1px solid #e4eaf1;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(26, 59, 94, 0.025);
  margin-bottom: 21px;
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
  gap: 8px;
}

.select-wrapper {
  position: relative;
}

.filter-select {
  height: 36px;
  min-width: 120px;
  appearance: none;
  border: 1px solid #dce5ee;
  border-radius: 8px;
  background: #ffffff;
  color: #60738a;
  padding: 0 28px 0 10px;
  outline: 0;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
}

.select-wrapper > svg {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #8391a2;
}

/* =========================
   TABLE
========================= */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1120px;
}

.transactions-table th {
  height: 45px;
  background: #fafbfd;
  border-bottom: 1px solid #edf1f5;
  color: #8a98a9;
  text-align: left;
  padding: 0 14px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
}

.transactions-table td {
  height: 70px;
  border-bottom: 1px solid #f0f3f6;
  padding: 0 14px;
  color: #53667d;
  font-size: 10px;
  vertical-align: middle;
}

.transactions-table tbody tr:last-child td {
  border-bottom: 0;
}

.transactions-table tbody tr:hover {
  background: #fbfdff;
}

.transaction-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.transaction-icon {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.direction-credit {
  background: #e9f7ef;
  color: #23855a;
}

.direction-debit {
  background: #fff0ee;
  color: #c25445;
}

.direction-default {
  background: #eef2f6;
  color: #687a8f;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.transaction-info strong {
  color: #24425f;
  font-size: 10px;
  font-weight: 800;
}

.transaction-info span {
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #9ba7b5;
  font-size: 9px;
  margin-top: 3px;
}

.direction-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 25px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 0 8px;
  border-radius: 7px;
  background: #f2f5f8;
  color: #63758a;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.amount-value {
  white-space: nowrap;
  font-size: 10px;
  font-weight: 800;
}

.amount-credit {
  color: #22865a;
}

.amount-debit {
  color: #b84d43;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 25px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.status-success {
  background: #e9f7ef;
  color: #22865a;
}

.status-pending {
  background: #fff3df;
  color: #aa701f;
}

.status-failed {
  background: #fbeaea;
  color: #b94b4b;
}

.status-default {
  background: #eef1f5;
  color: #6c7c90;
}

.channel-cell {
  color: #718399;
  font-size: 9px;
  white-space: nowrap;
}

.date-cell {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #7a899b;
  font-size: 9px;
  white-space: nowrap;
}

.action-column {
  text-align: right !important;
}

.details-button {
  height: 30px;
  padding: 0 9px;
  border: 1px solid #d8e3ed;
  border-radius: 7px;
  background: #ffffff;
  color: #07559b;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 9px;
  font-weight: 800;
}

.details-button:hover {
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

/* =========================
   DEPOSIT
========================= */

.deposit-panel {
  background: #ffffff;
  border: 1px solid #e4eaf1;
  border-radius: 14px;
  padding: 19px;
  box-shadow: 0 4px 18px rgba(26, 59, 94, 0.025);
}

.deposit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 17px;
}

.deposit-heading {
  display: flex;
  align-items: center;
  gap: 11px;
}

.deposit-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  background: #eaf5ef;
  color: #24865a;
  display: grid;
  place-items: center;
}

.deposit-heading h3 {
  margin: 0 0 3px;
  color: #183653;
  font-size: 13px;
  font-weight: 800;
}

.deposit-heading p {
  margin: 0;
  color: #93a0af;
  font-size: 10px;
}

.admin-only-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 25px;
  padding: 0 9px;
  border-radius: 999px;
  background: #edf4fb;
  color: #07559b;
  font-size: 9px;
  font-weight: 800;
}

.deposit-form {
  display: grid;
  grid-template-columns: 1fr 0.7fr 1.2fr auto;
  gap: 10px;
  align-items: end;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  color: #6d8095;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-field input {
  width: 100%;
  height: 40px;
  border: 1px solid #dce5ee;
  border-radius: 8px;
  background: #ffffff;
  color: #294662;
  padding: 0 10px;
  outline: 0;
  font-size: 10px;
}

.form-field input:focus {
  border-color: #9bbbd5;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.06);
}

.form-field input::placeholder {
  color: #a4aebb;
}

.amount-input {
  position: relative;
}

.amount-input > span {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7d8da1;
  font-size: 11px;
  font-weight: 700;
}

.amount-input input {
  padding-left: 25px;
}

.deposit-button {
  height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 8px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.deposit-button:hover:not(:disabled) {
  background: #06467f;
}

.deposit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.success-message,
.deposit-error {
  min-height: 42px;
  border-radius: 8px;
  margin-bottom: 13px;
  padding: 0 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
}

.success-message {
  background: #eaf7ef;
  border: 1px solid #d4eddf;
  color: #24865a;
}

.deposit-error {
  background: #fff4f4;
  border: 1px solid #f1d8d8;
  color: #a54242;
}

.success-message span,
.deposit-error span {
  flex: 1;
}

.success-message button,
.deposit-error button {
  border: 0;
  background: transparent;
  color: inherit;
  display: grid;
  place-items: center;
  padding: 3px;
  cursor: pointer;
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

.transaction-modal {
  width: min(650px, 100%);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 24px 70px rgba(16, 45, 80, 0.22);
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

.modal-transaction-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
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

.modal-close:hover {
  background: #eaf0f5;
  color: #294662;
}

.modal-body {
  padding: 19px;
}

.modal-amount {
  padding: 17px;
  border-radius: 11px;
  background: #f7fafd;
  border: 1px solid #e8eef4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 17px;
}

.modal-amount span {
  color: #8090a3;
  font-size: 10px;
  font-weight: 700;
}

.modal-amount strong {
  font-size: 22px;
  letter-spacing: -0.5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.detail-item {
  min-height: 63px;
  padding: 11px 12px;
  border: 1px solid #e8edf3;
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.detail-item span {
  color: #96a2b1;
  font-size: 9px;
  font-weight: 700;
}

.detail-item strong {
  color: #304c68;
  font-size: 10px;
  word-break: break-word;
}

.detail-wide {
  grid-column: 1 / -1;
}

.modal-footer {
  padding: 12px 18px;
  border-top: 1px solid #edf1f5;
  display: flex;
  justify-content: flex-end;
}

.cancel-button {
  height: 34px;
  padding: 0 14px;
  border: 1px solid #dce4ec;
  border-radius: 8px;
  background: #ffffff;
  color: #60738a;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
}

.cancel-button:hover {
  background: #f6f8fa;
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

@media (max-width: 1200px) {
  .deposit-form {
    grid-template-columns: 1fr 1fr;
  }

  .description-field {
    grid-column: 1 / 2;
  }

  .deposit-button {
    grid-column: 2;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
    padding-left: 25px;
    padding-right: 25px;
  }

  .topbar {
    padding-left: 25px;
    padding-right: 25px;
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

  .refresh-button {
    align-self: stretch;
    justify-content: center;
  }

  .account-search-form {
    flex-direction: column;
  }

  .search-button,
  .reset-button {
    width: 100%;
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
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .select-wrapper,
  .filter-select {
    width: 100%;
  }

  .deposit-form {
    grid-template-columns: 1fr;
  }

  .description-field {
    grid-column: auto;
  }

  .deposit-button {
    grid-column: auto;
    width: 100%;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-wide {
    grid-column: auto;
  }
}

@media (max-width: 470px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .heading-content {
    align-items: flex-start;
  }

  .heading-icon {
    width: 43px;
    height: 43px;
  }

  .page-heading h2 {
    font-size: 18px;
  }

  .topbar h1 {
    font-size: 21px;
  }

  .toolbar-controls {
    grid-template-columns: 1fr;
  }

  .deposit-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .modal-amount {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>cd
