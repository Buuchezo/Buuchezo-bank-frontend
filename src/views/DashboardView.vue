<template>
  <main class="dashboard-page">
    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <aside :class="{ open: mobileMenuOpen }" class="dashboard-sidebar">
      <RouterLink class="dashboard-logo" to="/">
        <span>B</span>
        <strong>Buuchezo Bank</strong>
      </RouterLink>

      <nav class="dashboard-nav">
        <span class="nav-section-title"> MAIN </span>

        <RouterLink class="dashboard-nav-link active" to="/dashboard">
          <LayoutDashboard :size="18" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink class="dashboard-nav-link" to="/accounts">
          <WalletCards :size="18" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink class="dashboard-nav-link" to="/transactions">
          <ArrowLeftRight :size="18" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink class="dashboard-nav-link" to="/cards">
          <CreditCard :size="18" />
          <span>Cards</span>
        </RouterLink>

        <span class="nav-section-title second-nav-title"> SERVICES </span>

        <RouterLink class="dashboard-nav-link" to="/transfers">
          <Send :size="18" />
          <span>Transfers</span>
        </RouterLink>

        <RouterLink class="dashboard-nav-link" to="/investments">
          <ChartCandlestick :size="18" />
          <span>Investments</span>
        </RouterLink>

        <RouterLink class="dashboard-nav-link" to="/market">
          <TrendingUp :size="18" />
          <span>Market Data</span>
        </RouterLink>
        <RouterLink class="dashboard-nav-link" to="/settings">
          <Settings :size="18" />
          <span>Settings</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="support-box">
          <div class="support-icon">
            <HelpCircle :size="16" />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>
        </div>

        <button class="logout-button" type="button" @click="logout">
          <LogOut :size="17" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <!-- =====================================================
         MAIN
    ====================================================== -->

    <div class="dashboard-main">
      <header class="dashboard-header">
        <button class="mobile-menu-button" type="button" @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu :size="21" />
        </button>

        <div class="header-title">
          <span>OVERVIEW</span>
          <h1>{{ greeting }}, {{ user.firstName || 'there' }}.</h1>
        </div>

        <div class="header-actions">
          <RouterLink v-if="isAdmin" class="admin-dashboard-button" to="/admin/dashboard">
            <ShieldCheck :size="16" />
            <span>Admin Dashboard</span>
          </RouterLink>

          <button
            :disabled="refreshing"
            aria-label="Refresh dashboard"
            class="header-icon"
            type="button"
            @click="refreshDashboard"
          >
            <RefreshCw :class="{ spinning: refreshing }" :size="17" />
          </button>

          <button aria-label="Notifications" class="header-icon" type="button">
            <NotificationDropdown />
            <span class="notification-dot"></span>
          </button>

          <div class="header-profile">
            <div class="profile-avatar">
              {{ userInitials }}
            </div>

            <div class="profile-info">
              <strong>{{ fullName }}</strong>
              <span>Personal</span>
            </div>

            <ChevronDown :size="15" />
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <!-- =================================================
             LOADING
        ================================================== -->

        <div v-if="loading" class="dashboard-state">
          <strong>Loading your dashboard...</strong>
          <span> Fetching your account and transaction information securely. </span>
        </div>

        <!-- =================================================
             ERROR
        ================================================== -->

        <div v-else-if="errorMessage" class="dashboard-state dashboard-state-error">
          <strong>Unable to load your dashboard</strong>

          <span>
            {{ errorMessage }}
          </span>

          <button type="button" @click="loadDashboard">Try again</button>
        </div>

        <!-- =================================================
             DASHBOARD
        ================================================== -->

        <template v-else>
          <!-- =================================================
               BALANCE
          ================================================== -->

          <section class="balance-section">
            <div class="balance-main-card">
              <div class="balance-card-header">
                <div>
                  <span>AVAILABLE BALANCE</span>

                  <div class="balance-value-row">
                    <h2>
                      {{ showBalance ? formatMoney(account.balance) : '••••••' }}
                    </h2>

                    <button
                      :aria-label="showBalance ? 'Hide balance' : 'Show balance'"
                      class="balance-visibility-button"
                      type="button"
                      @click="showBalance = !showBalance"
                    >
                      <Eye v-if="showBalance" :size="17" />
                      <EyeOff v-else :size="17" />
                    </button>
                  </div>
                </div>

                <div class="balance-card-icon">
                  <WalletCards :size="21" />
                </div>
              </div>

              <div class="balance-card-footer">
                <span>
                  {{ account.accountType || 'Account' }}
                </span>

                <span> •••• {{ maskedAccountNumber }} </span>

                <span :class="account.accountStatus?.toLowerCase()" class="account-status">
                  <span class="status-dot"></span>
                  {{ account.accountStatus || 'ACTIVE' }}
                </span>
              </div>
            </div>

            <!-- INCOME -->

            <div class="balance-stat">
              <div class="stat-icon income">
                <ArrowDownLeft :size="17" />
              </div>

              <div>
                <span>Income</span>

                <strong>
                  {{ formatMoney(monthlyIncome) }}
                </strong>

                <small>This month</small>
              </div>
            </div>

            <!-- EXPENSES -->

            <div class="balance-stat">
              <div class="stat-icon expense">
                <ArrowUpRight :size="17" />
              </div>

              <div>
                <span>Expenses</span>

                <strong>
                  {{ formatMoney(monthlyExpenses) }}
                </strong>

                <small>This month</small>
              </div>
            </div>
          </section>

          <!-- =================================================
               QUICK ACTIONS
          ================================================== -->

          <section class="quick-section">
            <div class="section-heading">
              <div>
                <span>QUICK ACTIONS</span>
                <h2>What would you like to do?</h2>
              </div>
            </div>

            <div class="dashboard-actions">
              <button class="action-card" type="button" @click="router.push('/transfers')">
                <div class="action-icon">
                  <Send :size="19" />
                </div>

                <strong>Send money</strong>

                <span> Make a transfer </span>

                <ArrowUpRight :size="17" class="action-arrow" />
              </button>

              <button class="action-card" type="button" @click="router.push('/accounts')">
                <div class="action-icon">
                  <ArrowDownLeft :size="19" />
                </div>

                <strong>Receive money</strong>

                <span> View your details </span>

                <ArrowUpRight :size="17" class="action-arrow" />
              </button>

              <button class="action-card" type="button" @click="router.push('/cards')">
                <div class="action-icon">
                  <CreditCard :size="19" />
                </div>

                <strong>Manage cards</strong>

                <span> View your cards </span>

                <ArrowUpRight :size="17" class="action-arrow" />
              </button>

              <button class="action-card" type="button" @click="router.push('/transactions')">
                <div class="action-icon">
                  <BarChart3 :size="19" />
                </div>

                <strong>Spending</strong>

                <span> See your activity </span>

                <ArrowUpRight :size="17" class="action-arrow" />
              </button>
            </div>
          </section>

          <!-- =================================================
               LOWER AREA
          ================================================== -->

          <div class="dashboard-lower">
            <!-- =================================================
                 TRANSACTIONS
            ================================================== -->

            <section class="dashboard-panel transactions-panel">
              <div class="panel-heading">
                <div>
                  <span>RECENT ACTIVITY</span>
                  <h2>Transactions</h2>
                </div>

                <RouterLink to="/transactions">
                  View all
                  <ArrowRight :size="14" />
                </RouterLink>
              </div>

              <div class="transaction-list">
                <!-- NO TRANSACTIONS -->

                <div v-if="recentTransactions.length === 0" class="dashboard-transaction">
                  <div class="transaction-symbol">
                    <ArrowLeftRight :size="17" />
                  </div>

                  <div class="transaction-description">
                    <strong> No transactions yet </strong>

                    <span> Your recent activity will appear here. </span>
                  </div>
                </div>

                <!-- REAL TRANSACTIONS -->

                <div
                  v-for="transaction in recentTransactions"
                  :key="transaction.id || transaction.reference"
                  class="dashboard-transaction"
                >
                  <div
                    :class="{
                      'income-symbol': transaction.transactionDirection === 'CREDIT',
                    }"
                    class="transaction-symbol"
                  >
                    <component :is="getTransactionIcon(transaction)" :size="17" />
                  </div>

                  <div class="transaction-description">
                    <strong>
                      {{ transactionDescription(transaction) }}
                    </strong>

                    <span>
                      {{ formatTransactionDate(transaction.createdAt) }}
                      ·
                      {{ transactionLabel(transaction) }}
                    </span>
                  </div>

                  <strong
                    :class="transaction.transactionDirection === 'CREDIT' ? 'positive' : 'negative'"
                    class="transaction-value"
                  >
                    {{ transaction.transactionDirection === 'CREDIT' ? '+' : '−'
                    }}{{ formatMoney(Math.abs(Number(transaction.amount))) }}
                  </strong>
                </div>
              </div>
            </section>

            <!-- =================================================
                 SPENDING
            ================================================== -->

            <section class="dashboard-panel spending-panel">
              <div class="panel-heading">
                <div>
                  <span>MONTHLY OVERVIEW</span>
                  <h2>Spending</h2>
                </div>

                <button class="period-button" type="button">
                  {{ currentMonthName }}

                  <ChevronDown :size="13" />
                </button>
              </div>

              <div class="spending-number">
                {{ formatMoney(spendingTotal) }}
              </div>

              <div class="spending-change">
                <BarChart3 :size="14" />

                Based on your activity this month
              </div>

              <div class="spending-chart">
                <div class="chart-grid">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div class="chart-bars">
                  <div
                    v-for="day in spendingDays"
                    :key="day.dateKey"
                    :style="{
                      height: `${spendingBarHeight(day.amount)}%`,
                    }"
                    :title="`${day.label}: ${formatMoney(day.amount)}`"
                  ></div>
                </div>

                <div class="chart-labels">
                  <span v-for="day in spendingDays" :key="`${day.dateKey}-label`">
                    {{ day.label }}
                  </span>
                </div>
              </div>

              <div class="spending-categories">
                <div v-for="category in spendingCategories" :key="category.name">
                  <span class="category-dot"></span>

                  <span>
                    {{ category.name }}
                  </span>

                  <strong> {{ category.percentage }}% </strong>
                </div>
              </div>
            </section>
          </div>

          <!-- =================================================
               ACCOUNT CARD
          ================================================== -->

          <section class="dashboard-card-section">
            <div class="dashboard-card-heading">
              <div>
                <span>YOUR CARD</span>
                <h2>Manage your card</h2>
              </div>

              <RouterLink to="/cards">
                Manage
                <ArrowUpRight :size="15" />
              </RouterLink>
            </div>

            <!--
              CARD DATA IS CURRENTLY MOCK DATA.
              We do not have a Card API yet.
            -->

            <div class="dashboard-bank-card">
              <div class="bank-card-top">
                <div class="bank-card-brand">
                  <div>B</div>
                  <strong>Buuchezo Bank</strong>
                </div>

                <Wifi :size="22" />
              </div>

              <div class="bank-card-chip"></div>

              <div class="bank-card-number">
                5432&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;3456
              </div>

              <div class="bank-card-bottom">
                <div>
                  <span>CARD HOLDER</span>
                  <strong>{{ fullName }}</strong>
                </div>

                <div class="card-type">VISA</div>
              </div>
            </div>
          </section>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NotificationDropdown from '../components/layout/NotificationDropdownView.vue'

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChartCandlestick,
  ChevronDown,
  CreditCard,
  Eye,
  EyeOff,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  WalletCards,
  Wifi
} from 'lucide-vue-next'

/* =========================================================
   TYPES
========================================================= */

interface Role {
  id: number
  name: string
}

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles: Role[]
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

interface UserWithAccount {
  user: User
  account: Account
}

interface Transaction {
  id: number
  reference: string
  fromAccountNumber: string
  fromBankCode?: string
  toAccountNumber: string
  toBankCode?: string
  amount: number
  description?: string
  currency?: string
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT'
  transactionStatus?: string
  transactionDirection: 'DEBIT' | 'CREDIT'
  channel?: string
  createdAt: string
}

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

interface SpendingDay {
  dateKey: string
  label: string
  amount: number
}

interface SpendingCategory {
  name: string
  percentage: number
}

/* =========================================================
   CONFIGURATION
========================================================= */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const router = useRouter()

/* =========================================================
   STATE
========================================================= */

const mobileMenuOpen = ref(false)

const loading = ref(true)

const errorMessage = ref('')

const user = ref<User>({
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  enabled: false,
  roles: [],
  createdAt: '',
})

const account = ref<Account>({
  id: 0,
  accountNumber: '',
  balance: 0,
  currency: 'EUR',
  accountType: '',
  accountStatus: '',
  createdAt: '',
})

const transactions = ref<Transaction[]>([])

const showBalance = ref(true)
const refreshing = ref(false)

/* =========================================================
   USER INFORMATION
========================================================= */

const fullName = computed(() => {
  const name = `${user.value.firstName} ${user.value.lastName}`.trim()

  return name || 'User'
})

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''

  const last = user.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase() || 'U'
})

const isAdmin = computed(() => {
  return user.value.roles?.some((role) => role.name === 'ADMIN') ?? false
})

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
})

const maskedAccountNumber = computed(() => {
  const number = account.value.accountNumber || ''

  if (number.length <= 4) {
    return number
  }

  return number.slice(-4)
})

/* =========================================================
   MONEY
========================================================= */

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: account.value.currency || 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

/* =========================================================
   DATE FORMATTING
========================================================= */

function formatTransactionDate(dateString: string) {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)

  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return `Today · ${formatTransactionTime(date)}`
  }

  const yesterday = new Date(now)

  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  if (isYesterday) {
    return `Yesterday · ${formatTransactionTime(date)}`
  }

  return `${date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })} · ${formatTransactionTime(date)}`
}

function formatTransactionTime(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* =========================================================
   TRANSACTION DESCRIPTION
========================================================= */

function transactionDescription(transaction: Transaction) {
  if (transaction.description && transaction.description.trim()) {
    return transaction.description
  }

  switch (transaction.transactionType) {
    case 'DEPOSIT':
      return 'Deposit'

    case 'WITHDRAWAL':
      return 'Cash withdrawal'

    case 'TRANSFER':
      return 'Bank transfer'

    case 'PAYMENT':
      return 'Payment'

    default:
      return 'Transaction'
  }
}

/* =========================================================
   TRANSACTION LABEL
========================================================= */

function transactionLabel(transaction: Transaction) {
  switch (transaction.transactionType) {
    case 'DEPOSIT':
      return 'Deposit'

    case 'WITHDRAWAL':
      return 'Withdrawal'

    case 'TRANSFER':
      return 'Transfer'

    case 'PAYMENT':
      return 'Payment'

    default:
      return 'Transaction'
  }
}

/* =========================================================
   TRANSACTION ICON
========================================================= */

function getTransactionIcon(transaction: Transaction) {
  if (transaction.transactionDirection === 'CREDIT') {
    return ArrowDownLeft
  }

  switch (transaction.transactionType) {
    case 'PAYMENT':
      return ShoppingBag

    case 'WITHDRAWAL':
      return ArrowUpRight

    case 'TRANSFER':
      return ArrowLeftRight

    default:
      return ArrowUpRight
  }
}

/* =========================================================
   CURRENT MONTH TRANSACTIONS
========================================================= */

const currentMonthTransactions = computed(() => {
  const now = new Date()

  return transactions.value.filter((transaction) => {
    const date = new Date(transaction.createdAt)

    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
})

/* =========================================================
   MONTHLY INCOME
========================================================= */

const monthlyIncome = computed(() => {
  return currentMonthTransactions.value
    .filter((transaction) => transaction.transactionDirection === 'CREDIT')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
})

/* =========================================================
   MONTHLY EXPENSES
========================================================= */

const monthlyExpenses = computed(() => {
  return currentMonthTransactions.value
    .filter((transaction) => transaction.transactionDirection === 'DEBIT')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
})

/* =========================================================
   RECENT TRANSACTIONS
========================================================= */

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

/* =========================================================
   SPENDING TOTAL
========================================================= */

const spendingTotal = computed(() => {
  return monthlyExpenses.value
})

/* =========================================================
   CURRENT MONTH NAME
========================================================= */

const currentMonthName = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
  })
})

/* =========================================================
   LAST 7 DAYS SPENDING
========================================================= */

const spendingDays = computed<SpendingDay[]>(() => {
  const today = new Date()

  const days: SpendingDay[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)

    date.setHours(0, 0, 0, 0)

    date.setDate(today.getDate() - i)

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`

    const amount = transactions.value
      .filter((transaction) => {
        if (transaction.transactionDirection !== 'DEBIT') {
          return false
        }

        const transactionDate = new Date(transaction.createdAt)

        return (
          transactionDate.getFullYear() === date.getFullYear() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getDate() === date.getDate()
        )
      })
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)

    days.push({
      dateKey,

      label: date.toLocaleDateString('en-US', {
        weekday: 'short',
      }),

      amount,
    })
  }

  return days
})

/* =========================================================
   MAXIMUM DAILY SPENDING
========================================================= */

const maximumSpendingDay = computed(() => {
  return Math.max(...spendingDays.value.map((day) => day.amount), 1)
})

/* =========================================================
   SPENDING BAR HEIGHT
========================================================= */

function spendingBarHeight(amount: number) {
  if (amount <= 0) {
    return 4
  }

  return Math.max(8, Math.round((amount / maximumSpendingDay.value) * 100))
}

/* =========================================================
   SPENDING CATEGORIES
========================================================= */

const spendingCategories = computed<SpendingCategory[]>(() => {
  const debitTransactions = currentMonthTransactions.value.filter(
    (transaction) => transaction.transactionDirection === 'DEBIT',
  )

  if (debitTransactions.length === 0) {
    return [
      {
        name: 'Payments',
        percentage: 0,
      },
      {
        name: 'Transfers',
        percentage: 0,
      },
      {
        name: 'Withdrawals',
        percentage: 0,
      },
    ]
  }

  const totals: {
    PAYMENT: number
    TRANSFER: number
    WITHDRAWAL: number
    DEPOSIT: number
  } = {
    PAYMENT: 0,
    TRANSFER: 0,
    WITHDRAWAL: 0,
    DEPOSIT: 0,
  }

  debitTransactions.forEach((transaction) => {
    totals[transaction.transactionType] =
      (totals[transaction.transactionType] || 0) + Number(transaction.amount || 0)
  })

  const total = debitTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0,
  )

  if (total <= 0) {
    return [
      {
        name: 'Payments',
        percentage: 0,
      },
      {
        name: 'Transfers',
        percentage: 0,
      },
      {
        name: 'Withdrawals',
        percentage: 0,
      },
    ]
  }

  return [
    {
      name: 'Payments',
      percentage: Math.round((totals.PAYMENT / total) * 100),
    },

    {
      name: 'Transfers',
      percentage: Math.round((totals.TRANSFER / total) * 100),
    },

    {
      name: 'Withdrawals',
      percentage: Math.round((totals.WITHDRAWAL / total) * 100),
    },
  ]
})

/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

  if (!token) {
    await router.push('/login')
    return
  }

  try {
    /* =====================================================
       1. LOAD USER + ACCOUNT
    ====================================================== */

    const accountResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (accountResponse.status === 401) {
      logout()
      return
    }

    const accountResult: ApiResponse<UserWithAccount> = await accountResponse.json()

    if (!accountResponse.ok) {
      throw new Error(accountResult.message || 'Unable to load your account information.')
    }

    if (!accountResult.data || !accountResult.data.user || !accountResult.data.account) {
      throw new Error('The server returned incomplete account information.')
    }

    user.value = accountResult.data.user

    account.value = accountResult.data.account

    /* =====================================================
       2. LOAD TRANSACTION HISTORY
    ====================================================== */

    const transactionResponse = await fetch(
      `${API_BASE_URL}/api/transactions/history?accountNumber=${encodeURIComponent(
        account.value.accountNumber,
      )}`,
      {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (transactionResponse.status === 401) {
      logout()
      return
    }

    const transactionResult: ApiResponse<Transaction[]> = await transactionResponse.json()

    if (!transactionResponse.ok) {
      throw new Error(transactionResult.message || 'Unable to load your transaction history.')
    }

    transactions.value = transactionResult.data || []
  } catch (error) {
    console.error('Dashboard loading failed:', error)

    errorMessage.value = error instanceof Error ? error.message : 'Unable to load your dashboard.'
  } finally {
    loading.value = false
  }
}
/* =========================================================
   REFRESH DASHBOARD
========================================================= */

async function refreshDashboard() {
  if (refreshing.value) {
    return
  }

  refreshing.value = true

  try {
    await loadDashboard()
  } finally {
    refreshing.value = false
  }
}
/* =========================================================
   LOGOUT
========================================================= */

function logout() {
  localStorage.removeItem('accessToken')

  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')

  sessionStorage.removeItem('user')

  router.push('/login')
}

/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(loadDashboard)
</script>

<style scoped>
.dashboard-state {
  padding: 30px;
  margin-bottom: 30px;

  display: flex;
  flex-direction: column;
  gap: 6px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;

  color: #082f56;
}

.dashboard-state span {
  color: #8998a3;

  font-size: 12px;
}

.dashboard-state-error {
  color: #7b2d2d;
}

.dashboard-state button {
  width: fit-content;

  margin-top: 10px;

  padding: 9px 14px;

  color: white;

  background: #0b4878;

  border: 0;

  border-radius: 6px;

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}

.dashboard-page {
  min-height: 100vh;

  display: flex;

  color: #29465a;

  background: #f5f8fb;
}

/* =========================================================
   SIDEBAR
========================================================= */

.dashboard-sidebar {
  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;

  width: 245px;

  padding: 28px 18px;

  display: flex;
  flex-direction: column;

  background: #ffffff;

  border-right: 1px solid #e3ebf0;

  z-index: 100;
}

.dashboard-logo {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 0 10px;

  color: #082f56;

  text-decoration: none;
}

.dashboard-logo span {
  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 8px;

  font-size: 16px;

  font-weight: 900;
}

.dashboard-logo strong {
  font-size: 15px;

  letter-spacing: -0.02em;
}

/* =========================================================
   NAVIGATION
========================================================= */

.dashboard-nav {
  display: flex;

  flex-direction: column;

  gap: 5px;

  margin-top: 50px;
}

.nav-section-title {
  padding: 0 13px;

  margin-bottom: 9px;

  color: #a0adb7;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.15em;
}

.second-nav-title {
  margin-top: 30px;
}

.dashboard-nav-link {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 13px;

  color: #7d8d99;

  border-radius: 7px;

  font-size: 11px;

  font-weight: 600;

  text-decoration: none;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.dashboard-nav-link:hover {
  color: #0b4878;

  background: #f1f7fa;
}

.dashboard-nav-link.active {
  color: #0b4878;

  background: #eaf4fa;

  font-weight: 800;
}

/* =========================================================
   SIDEBAR BOTTOM
========================================================= */

.sidebar-bottom {
  margin-top: auto;
}

.support-box {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 13px;

  margin-bottom: 18px;

  background: #f5f9fb;

  border-radius: 8px;
}

.support-icon {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: white;

  border-radius: 6px;
}

.support-box strong {
  display: block;

  color: #425c6e;

  font-size: 9px;
}

.support-box span {
  display: block;

  margin-top: 2px;

  color: #9aa8b2;

  font-size: 8px;
}

.logout-button {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 13px;

  color: #84929c;

  background: none;

  border: 0;

  border-radius: 7px;

  font-family: inherit;

  font-size: 11px;

  cursor: pointer;

  text-align: left;
}

.logout-button:hover {
  color: #0b4878;

  background: #f4f8fa;
}

/* =========================================================
   MAIN
========================================================= */

.dashboard-main {
  width: calc(100% - 245px);

  margin-left: 245px;
}

/* =========================================================
   HEADER
========================================================= */

.dashboard-header {
  height: 82px;

  padding: 0 45px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: white;

  border-bottom: 1px solid #e4ebf0;
}

.header-title span {
  display: block;

  margin-bottom: 5px;

  color: #a0adb6;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.header-title h1 {
  margin: 0;

  color: #082f56;

  font-size: 18px;

  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;

  align-items: center;

  gap: 25px;
}

.header-icon {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #627888;

  background: #f4f8fa;

  border: 0;

  border-radius: 50%;

  cursor: pointer;
}

.notification-dot {
  position: absolute;

  top: 7px;
  right: 8px;

  width: 6px;
  height: 6px;

  background: #0b5da7;

  border: 2px solid white;

  border-radius: 50%;
}

.header-profile {
  display: flex;

  align-items: center;

  gap: 9px;
}

.profile-avatar {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 50%;

  font-size: 9px;

  font-weight: 800;
}

.profile-info strong {
  display: block;

  color: #40586a;

  font-size: 10px;
}

.profile-info span {
  display: block;

  margin-top: 2px;

  color: #9ba8b2;

  font-size: 8px;
}

.mobile-menu-button {
  display: none;
}

/* =========================================================
   CONTENT
========================================================= */

.dashboard-content {
  max-width: 1400px;

  padding: 40px 45px 70px;

  margin: 0 auto;
}

/* =========================================================
   BALANCE
========================================================= */

.balance-section {
  display: grid;

  grid-template-columns: 1.6fr 1fr 1fr;

  gap: 15px;
}

.balance-main-card {
  min-height: 170px;

  padding: 25px;

  color: white;

  background: linear-gradient(135deg, #063d74, #07559b 55%, #143fbd);

  border-radius: 12px;

  box-shadow: 0 15px 30px rgba(8, 47, 86, 0.13);
}

.balance-card-header {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;
}

.balance-card-header > div:first-child span {
  color: rgba(255, 255, 255, 0.58);

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.1em;
}

.balance-card-header h2 {
  margin: 10px 0 0;

  font-size: 30px;

  line-height: 1;

  letter-spacing: -0.04em;
}

.balance-card-icon {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.12);

  border-radius: 7px;
}

.balance-card-footer {
  display: flex;

  justify-content: space-between;

  padding-top: 20px;

  margin-top: 25px;

  border-top: 1px solid rgba(255, 255, 255, 0.14);

  color: rgba(255, 255, 255, 0.6);

  font-size: 9px;
}

.balance-stat {
  min-height: 170px;

  padding: 25px;

  display: flex;

  align-items: flex-start;

  gap: 13px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;
}

.stat-icon {
  width: 37px;
  height: 37px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 8px;
}

.stat-icon.income {
  color: #27825f;

  background: #eaf7f1;
}

.stat-icon.expense {
  color: #0b4878;

  background: #edf6fb;
}

.balance-stat > div:last-child span {
  display: block;

  color: #94a1ab;

  font-size: 9px;
}

.balance-stat strong {
  display: block;

  margin-top: 9px;

  color: #29465a;

  font-size: 20px;

  letter-spacing: -0.03em;
}

.balance-stat small {
  display: block;

  margin-top: 7px;

  color: #a2adb5;

  font-size: 8px;
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

.quick-section {
  margin-top: 45px;
}

.section-heading > div span {
  display: block;

  margin-bottom: 6px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.section-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 20px;

  letter-spacing: -0.025em;
}

.dashboard-actions {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 13px;

  margin-top: 18px;
}

.action-card {
  position: relative;

  min-height: 140px;

  padding: 18px;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 10px;

  font-family: inherit;

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.action-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 12px 30px rgba(8, 47, 86, 0.07);
}

.action-icon {
  width: 35px;
  height: 35px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 7px;

  margin-bottom: auto;
}

.action-card strong {
  color: #314b5f;

  font-size: 11px;
}

.action-card > span {
  margin-top: 4px;

  color: #9aa7b1;

  font-size: 8px;
}

.action-arrow {
  position: absolute;

  top: 19px;
  right: 19px;

  color: #9ba9b3;
}

/* =========================================================
   LOWER AREA
========================================================= */

.dashboard-lower {
  display: grid;

  grid-template-columns: 1.2fr 0.8fr;

  gap: 15px;

  margin-top: 40px;
}

.dashboard-panel {
  min-width: 0;

  padding: 25px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;
}

.panel-heading {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  margin-bottom: 22px;
}

.panel-heading > div span {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.panel-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 17px;
}

.panel-heading a {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #0b5da7;

  font-size: 9px;

  font-weight: 700;

  text-decoration: none;
}

.period-button {
  display: flex;

  align-items: center;

  gap: 5px;

  padding: 7px 9px;

  color: #728491;

  background: #f5f8fa;

  border: 0;

  border-radius: 5px;

  font-family: inherit;

  font-size: 8px;

  cursor: pointer;
}

/* =========================================================
   TRANSACTIONS
========================================================= */

.transaction-list {
  display: flex;

  flex-direction: column;
}

.dashboard-transaction {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 13px 0;

  border-bottom: 1px solid #eef2f5;
}

.dashboard-transaction:last-child {
  border-bottom: 0;
}

.transaction-symbol {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 8px;
}

.income-symbol {
  color: #25825d;

  background: #eaf7f1;
}

.transaction-description {
  min-width: 0;

  flex: 1;
}

.transaction-description strong {
  display: block;

  color: #415a6b;

  font-size: 10px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.transaction-description span {
  display: block;

  margin-top: 3px;

  color: #9ca9b2;

  font-size: 8px;
}

.transaction-value {
  flex-shrink: 0;

  font-size: 10px;
}

.transaction-value.negative {
  color: #506777;
}

.transaction-value.positive {
  color: #27815d;
}

/* =========================================================
   SPENDING
========================================================= */

.spending-number {
  color: #082f56;

  font-size: 29px;

  font-weight: 700;

  letter-spacing: -0.04em;
}

.spending-change {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 6px;

  color: #2b875f;

  font-size: 8px;
}

.spending-chart {
  position: relative;

  height: 150px;

  margin-top: 30px;
}

.chart-grid {
  position: absolute;

  inset: 0 0 20px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
}

.chart-grid span {
  width: 100%;

  height: 1px;

  background: #edf1f4;
}

.chart-bars {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 20px;

  height: 120px;

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 8px;
}

.chart-bars div {
  width: 100%;

  min-height: 4px;

  background: #0b5da7;

  border-radius: 4px 4px 0 0;

  opacity: 0.78;

  transition: height 0.3s ease;
}

.chart-labels {
  position: absolute;

  bottom: 0;
  left: 0;
  right: 0;

  display: flex;

  justify-content: space-between;

  color: #a1adb5;

  font-size: 7px;
}

.spending-categories {
  display: flex;

  justify-content: space-between;

  gap: 12px;

  padding-top: 18px;

  border-top: 1px solid #edf1f4;
}

.spending-categories div {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #8998a3;

  font-size: 8px;
}

.spending-categories strong {
  margin-left: 3px;

  color: #425b6c;
}

.category-dot {
  width: 6px;
  height: 6px;

  flex-shrink: 0;

  background: #0b5da7;

  border-radius: 50%;
}

/* =========================================================
   CARD
========================================================= */

.dashboard-card-section {
  margin-top: 40px;
}

.dashboard-card-heading {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 18px;
}

.dashboard-card-heading span {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.dashboard-card-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 18px;
}

.dashboard-card-heading a {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #0b5da7;

  font-size: 9px;

  font-weight: 700;

  text-decoration: none;
}

.dashboard-bank-card {
  width: min(470px, 100%);

  aspect-ratio: 410 / 247;

  padding: 25px;

  color: white;

  background: linear-gradient(145deg, #063d74, #07559b 55%, #143fbd);

  border-radius: 16px;

  box-shadow: 0 25px 50px rgba(8, 47, 86, 0.17);

  overflow: hidden;
}

.bank-card-top {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.bank-card-brand {
  display: flex;

  align-items: center;

  gap: 8px;
}

.bank-card-brand div {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.13);

  border-radius: 6px;

  font-weight: 800;
}

.bank-card-brand strong {
  font-size: 12px;
}

.bank-card-chip {
  width: 45px;
  height: 32px;

  margin-top: 35px;

  background: #d1b06c;

  border-radius: 5px;
}

.bank-card-number {
  margin-top: 22px;

  font-size: 17px;

  letter-spacing: 0.11em;
}

.bank-card-bottom {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-top: 27px;
}

.bank-card-bottom span {
  display: block;

  margin-bottom: 4px;

  color: rgba(255, 255, 255, 0.45);

  font-size: 6px;

  letter-spacing: 0.13em;
}

.bank-card-bottom strong {
  font-size: 9px;

  letter-spacing: 0.08em;
}

.card-type {
  font-size: 17px;

  font-weight: 800;

  font-style: italic;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .dashboard-sidebar {
    width: 215px;
  }

  .dashboard-main {
    width: calc(100% - 215px);

    margin-left: 215px;
  }

  .dashboard-content {
    padding-left: 30px;
    padding-right: 30px;
  }

  .dashboard-header {
    padding-left: 30px;
    padding-right: 30px;
  }

  .balance-section {
    grid-template-columns: 1.4fr 1fr 1fr;
  }

  .dashboard-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 850px) {
  .dashboard-sidebar {
    transform: translateX(-100%);

    transition: transform 0.25s ease;

    box-shadow: 10px 0 35px rgba(8, 47, 86, 0.1);
  }

  .dashboard-sidebar.open {
    transform: translateX(0);
  }

  .dashboard-main {
    width: 100%;

    margin-left: 0;
  }

  .mobile-menu-button {
    width: 38px;
    height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #526a7a;

    background: #f4f8fa;

    border: 0;

    border-radius: 7px;

    cursor: pointer;
  }

  .dashboard-header {
    gap: 15px;
  }

  .header-title {
    flex: 1;
  }

  .profile-info {
    display: none;
  }

  .balance-section {
    grid-template-columns: 1fr 1fr;
  }

  .balance-main-card {
    grid-column: span 2;
  }

  .dashboard-lower {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .dashboard-header {
    height: 72px;

    padding: 0 16px;
  }

  .header-title h1 {
    font-size: 15px;
  }

  .header-actions {
    gap: 9px;
  }

  .header-icon {
    width: 34px;
    height: 34px;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .dashboard-content {
    padding: 25px 16px 50px;
  }

  .balance-section {
    grid-template-columns: 1fr;
  }

  .balance-main-card {
    grid-column: auto;

    min-height: 160px;
  }

  .balance-stat {
    min-height: auto;
  }

  .dashboard-actions {
    grid-template-columns: 1fr 1fr;
  }

  .action-card {
    min-height: 130px;
  }

  .dashboard-panel {
    padding: 20px;
  }

  .spending-categories {
    gap: 10px;

    flex-wrap: wrap;
  }

  .dashboard-bank-card {
    padding: 19px;
  }

  .bank-card-number {
    font-size: 13px;
  }

  .transaction-value {
    font-size: 9px;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .dashboard-content {
    padding-left: 12px;
    padding-right: 12px;
  }

  .header-title h1 {
    font-size: 14px;
  }

  .balance-card-header h2 {
    font-size: 27px;
  }

  .dashboard-actions {
    gap: 9px;
  }

  .action-card {
    padding: 14px;
  }

  .action-card strong {
    font-size: 10px;
  }

  .dashboard-bank-card {
    padding: 16px;
  }

  .bank-card-chip {
    margin-top: 25px;
  }

  .bank-card-number {
    margin-top: 16px;

    font-size: 11px;
  }
}
/* =========================================================
   ENHANCED HEADER ACTIONS
========================================================= */

.admin-dashboard-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 13px;
  color: #0b4878;
  background: #edf6fb;
  border: 1px solid #dcecf5;
  border-radius: 7px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 800;
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.admin-dashboard-button:hover {
  background: #e3f1f9;
  border-color: #cbdfea;
  transform: translateY(-1px);
}

.header-icon:disabled {
  opacity: 0.55;
  cursor: wait;
}

.spinning {
  animation: dashboard-spin 0.8s linear infinite;
}

@keyframes dashboard-spin {
  to {
    transform: rotate(360deg);
  }
}

.balance-value-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

.balance-visibility-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.balance-visibility-button:hover {
  background: rgba(255, 255, 255, 0.18);
}

.account-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-dot {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #5b9d7d;
}

.account-status.frozen .status-dot {
  background: #d08a3a;
}

.account-status.inactive .status-dot,
.account-status.closed .status-dot {
  background: #a1adb5;
}

@media (max-width: 900px) {
  .admin-dashboard-button span {
    display: none;
  }

  .admin-dashboard-button {
    width: 36px;
    height: 36px;
    padding: 0;
    justify-content: center;
  }
}
</style>
