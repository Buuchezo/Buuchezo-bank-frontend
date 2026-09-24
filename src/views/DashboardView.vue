<template>
  
  <BankingShell
    page-title="Overview"
    page-section="BANKING"
    :user="user"
  >
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

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/dashboard"
        >
          <LayoutDashboard :size="18" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/accounts"
        >
          <WalletCards :size="18" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/transactions"
        >
          <ArrowLeftRight :size="18" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/cards"
        >
          <CreditCard :size="18" />
          <span>Cards</span>
        </RouterLink>

        <span class="nav-section-title second-nav-title"> SERVICES </span>

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/transfers"
        >
          <Send :size="18" />
          <span>Transfers</span>
        </RouterLink>

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/investments"
        >
          <ChartCandlestick :size="18" />
          <span>Investments</span>
        </RouterLink>

        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/market"
        >
          <TrendingUp :size="18" />
          <span>Market Data</span>
        </RouterLink>
        <RouterLink
          class="dashboard-nav-link"
          active-class="active"
          to="/settings"
        >
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

  </BankingShell>
</template>

<script lang="ts" setup>
import BankingShell from '@/components/BankingShell.vue'

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

/* ============================================================
   BUUCHEZO BANK — PREMIUM APPLICATION SHELL
   ============================================================ */

.dashboard-page {
  min-height: 100vh;
  display: flex;
  background: var(--bz-surface-page, #f4f7fb);
  color: var(--bz-text-primary, #071b38);
}

.dashboard-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  width: 258px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 14px 18px;
  background:
    radial-gradient(circle at 20% 0%, rgba(45, 212, 191, 0.08), transparent 28%),
    linear-gradient(180deg, #071b38 0%, #06172f 100%);
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 12px 0 35px rgba(7, 27, 56, 0.08);
  transition: transform 220ms ease;
}

.dashboard-logo {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 48px;
  margin: 0 8px 30px;
  color: #fff;
  text-decoration: none;
}

.dashboard-logo > span {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #1597ff 0%, #19c6b4 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
  box-shadow: 0 8px 22px rgba(21, 151, 255, 0.25);
}

.dashboard-logo strong {
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-section-title {
  margin: 4px 12px 9px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.14em;
}

.second-nav-title {
  margin-top: 24px;
}

.dashboard-nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 13px;
  border-radius: 11px;
  color: rgba(255, 255, 255, 0.64);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  transform: translateX(0);
  transition:
    color 200ms ease,
    background-color 220ms ease,
    box-shadow 220ms ease,
    transform 200ms ease;
}

.dashboard-nav-link::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 50%;
  width: 3px;
  height: 0;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, #1597ff, #19c6b4);
  opacity: 0;
  transform: translateY(-50%);
  transition: height 220ms ease, opacity 180ms ease;
}

.dashboard-nav-link svg {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.54);
  stroke-width: 1.9;
  transition: color 200ms ease, transform 200ms ease;
}

.dashboard-nav-link span {
  transition: color 200ms ease, transform 200ms ease;
}

.dashboard-nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.065);
  transform: translateX(2px);
}

.dashboard-nav-link:hover svg {
  color: #9fd8ff;
  transform: translateX(1px);
}

.dashboard-nav-link.active {
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(21, 151, 255, 0.19),
    rgba(25, 198, 180, 0.075)
  );
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.055),
    0 6px 18px rgba(0, 0, 0, 0.08);
}

.dashboard-nav-link.active::before {
  height: 24px;
  opacity: 1;
}

.dashboard-nav-link.active svg {
  color: #55c9ff;
}

.dashboard-nav-link.active span {
  color: #fff;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.support-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.045);
}

.support-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #8ddcff;
  background: rgba(21, 151, 255, 0.12);
}

.support-box > div:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.support-box strong {
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  font-weight: 700;
}

.support-box span {
  color: rgba(255, 255, 255, 0.45);
  font-size: 10px;
}

.logout-button {
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: rgba(255, 255, 255, 0.56);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  transition: color 180ms ease, background-color 180ms ease, transform 180ms ease;
}

.logout-button:hover {
  color: #fff;
  background: rgba(239, 68, 68, 0.09);
  transform: translateX(2px);
}

.dashboard-main {
  min-width: 0;
  min-height: 100vh;
  flex: 1;
  margin-left: 258px;
}

.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 34px;
  border-bottom: 1px solid rgba(7, 27, 56, 0.07);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.mobile-menu-button {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bz-border, #dbe4ef);
  border-radius: 11px;
  background: #fff;
  color: var(--bz-text-primary, #071b38);
  cursor: pointer;
  transition: background-color 180ms ease, transform 180ms ease;
}

.mobile-menu-button:hover {
  background: #f4f8fc;
  transform: translateY(-1px);
}

@media (max-width: 1100px) {
  .dashboard-sidebar {
    width: 230px;
  }

  .dashboard-main {
    margin-left: 230px;
  }

  .dashboard-header {
    padding-inline: 24px;
  }
}

@media (max-width: 820px) {
  .dashboard-sidebar {
    width: 258px;
    transform: translateX(-100%);
    box-shadow: 18px 0 45px rgba(7, 27, 56, 0.22);
  }

  .dashboard-sidebar.open {
    transform: translateX(0);
  }

  .dashboard-main {
    margin-left: 0;
  }

  .mobile-menu-button {
    display: inline-flex;
  }

  .dashboard-header {
    min-height: 72px;
    padding: 12px 18px;
  }
}

@media (max-width: 560px) {
  .dashboard-header {
    gap: 12px;
    padding-inline: 14px;
  }

  .header-title {
    min-width: 0;
  }

  .header-title h1 {
    font-size: 18px;
  }

  .header-actions {
    gap: 6px;
  }

  .profile-info {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-sidebar,
  .dashboard-nav-link,
  .dashboard-nav-link::before,
  .dashboard-nav-link svg,
  .dashboard-nav-link span,
  .logout-button,
  .mobile-menu-button {
    transition: none;
  }
}



/* ============================================================
   BUUCHEZO BANK — PREMIUM HEADER / TOP BAR
   ============================================================ */

.dashboard-header {
  min-height: 84px;
  padding: 16px 34px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(7, 27, 56, 0.065);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.header-title > span {
  color: #7a8ba3;
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.14em;
}

.header-title h1 {
  margin: 0;
  color: #071b38;
  font-size: 21px;
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.035em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 9px;
}

.admin-dashboard-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 13px;
  border: 1px solid rgba(21, 151, 255, 0.16);
  border-radius: 10px;
  background: rgba(21, 151, 255, 0.065);
  color: #126eb9;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.admin-dashboard-button svg {
  color: #1597ff;
}

.admin-dashboard-button:hover {
  background: rgba(21, 151, 255, 0.11);
  border-color: rgba(21, 151, 255, 0.28);
  color: #0b5e9f;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(21, 151, 255, 0.09);
}

.header-icon {
  position: relative;
  width: 39px;
  height: 39px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #e1e8f0;
  border-radius: 11px;
  background: #fff;
  color: #53667f;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.header-icon:hover {
  background: #f7faff;
  border-color: #cbd8e6;
  color: #126eb9;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(7, 27, 56, 0.07);
}

.header-icon:active {
  transform: translateY(0);
}

.header-icon:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}

.header-icon .spinning {
  animation: bz-header-spin 800ms linear infinite;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  border: 1.5px solid #fff;
  border-radius: 50%;
  background: #19c6b4;
  box-shadow: 0 0 0 2px rgba(25, 198, 180, 0.12);
}

/*
 * NotificationDropdown already owns its notification UI.
 * Keep the surrounding header control visually neutral so
 * the dropdown remains fully functional.
 */
.header-icon > :deep(button),
.header-icon > :deep(.notification-trigger) {
  border: 0;
  background: transparent;
}

.header-profile {
  min-height: 43px;
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: 4px;
  padding: 3px 7px 3px 4px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: default;
  transition:
    background-color 180ms ease,
    border-color 180ms ease;
}

.header-profile:hover {
  background: #f7faff;
  border-color: #e5ebf2;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d447d, #1597ff);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.03em;
  box-shadow: 0 5px 14px rgba(21, 151, 255, 0.18);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 82px;
}

.profile-info strong {
  overflow: hidden;
  color: #132945;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-info span {
  color: #8a99ac;
  font-size: 10px;
  font-weight: 600;
}

.header-profile > svg {
  color: #8a99ac;
  transition: transform 180ms ease;
}

.header-profile:hover > svg {
  transform: translateY(1px);
}

@keyframes bz-header-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .dashboard-header {
    padding-inline: 22px;
  }

  .admin-dashboard-button span {
    display: none;
  }

  .admin-dashboard-button {
    width: 39px;
    justify-content: center;
    padding: 0;
  }
}

@media (max-width: 700px) {
  .dashboard-header {
    min-height: 72px;
    padding: 12px 18px;
  }

  .header-title h1 {
    font-size: 18px;
  }

  .header-title > span {
    font-size: 9px;
  }

  .profile-info,
  .header-profile > svg {
    display: none;
  }

  .header-profile {
    margin-left: 0;
    padding: 2px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    gap: 8px;
    padding-inline: 12px;
  }

  .header-actions {
    gap: 5px;
  }

  .header-icon,
  .admin-dashboard-button {
    width: 36px;
    height: 36px;
    min-height: 36px;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-dashboard-button,
  .header-icon,
  .header-profile,
  .header-profile > svg {
    transition: none;
  }

  .header-icon .spinning {
    animation: none;
  }
}



/* ============================================================
   BUUCHEZO BANK — DASHBOARD CONTENT / BALANCE HERO
   ============================================================ */

.dashboard-content {
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  padding: 30px 34px 48px;
}

/* ------------------------------------------------------------
   LOADING / ERROR STATES
   ------------------------------------------------------------ */

.dashboard-state {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  padding: 40px;
  border: 1px solid #e1e8f0;
  border-radius: 18px;
  background: #fff;
  color: #6e7f95;
  text-align: center;
  box-shadow: 0 8px 30px rgba(7, 27, 56, 0.045);
}

.dashboard-state strong {
  color: #132945;
  font-size: 15px;
  font-weight: 750;
}

.dashboard-state span {
  max-width: 480px;
  font-size: 12px;
  line-height: 1.6;
}

.dashboard-state button {
  margin-top: 8px;
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  background: #0d447d;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.dashboard-state button:hover {
  background: #1264a6;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(13, 68, 125, 0.18);
}

/* ------------------------------------------------------------
   BALANCE SECTION
   ------------------------------------------------------------ */

.balance-section {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr);
  gap: 20px;
  margin-bottom: 24px;
}

.balance-main-card {
  position: relative;
  min-height: 245px;
  overflow: hidden;
  padding: 28px 30px;
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 90% 15%,
      rgba(25, 198, 180, 0.18),
      transparent 28%
    ),
    radial-gradient(
      circle at 15% 100%,
      rgba(21, 151, 255, 0.20),
      transparent 35%
    ),
    linear-gradient(135deg, #071b38 0%, #0a315b 58%, #0b426e 100%);
  color: #fff;
  box-shadow:
    0 16px 38px rgba(7, 27, 56, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.balance-main-card::before {
  content: "";
  position: absolute;
  width: 230px;
  height: 230px;
  right: -80px;
  bottom: -130px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  pointer-events: none;
}

.balance-main-card::after {
  content: "";
  position: absolute;
  width: 150px;
  height: 150px;
  right: 35px;
  top: -90px;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 50%;
  pointer-events: none;
}

.balance-card-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.balance-card-header > div:first-child {
  min-width: 0;
}

.balance-card-header span {
  color: rgba(255, 255, 255, 0.58);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.balance-value-row {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 9px;
}

.balance-value-row h2 {
  margin: 0;
  color: #fff;
  font-size: clamp(30px, 4vw, 42px);
  font-weight: 760;
  line-height: 1;
  letter-spacing: -0.055em;
}

.balance-visibility-button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.balance-visibility-button:hover {
  background: rgba(255, 255, 255, 0.13);
  color: #fff;
  transform: translateY(-1px);
}

.balance-main-card .balance-meta,
.balance-main-card .balance-subtitle {
  color: rgba(255, 255, 255, 0.56);
}

.balance-card-footer {
  position: absolute;
  z-index: 1;
  right: 30px;
  bottom: 27px;
  left: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.balance-card-footer span {
  color: rgba(255, 255, 255, 0.48);
  font-size: 10px;
}

.balance-card-footer strong {
  display: block;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 650;
}

/* ------------------------------------------------------------
   BALANCE SUPPORT / SUMMARY CARDS
   ------------------------------------------------------------ */

.balance-section > * {
  min-width: 0;
}

.balance-section .summary-card,
.balance-section .balance-summary,
.balance-section .balance-side-card {
  min-height: 245px;
  padding: 24px;
  border: 1px solid #e1e8f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(7, 27, 56, 0.045);
}

/* Generic visual treatment for existing dashboard cards */
.dashboard-content section:not(.balance-section) {
  min-width: 0;
}

.dashboard-content .card,
.dashboard-content .dashboard-card,
.dashboard-content .summary-card,
.dashboard-content .transaction-card,
.dashboard-content .insight-card {
  border-color: #e1e8f0;
  border-radius: 16px;
  box-shadow: 0 7px 25px rgba(7, 27, 56, 0.04);
}

/* ------------------------------------------------------------
   SECTION HEADINGS
   ------------------------------------------------------------ */

.dashboard-content section > .section-header,
.dashboard-content section > .section-title,
.dashboard-content section > header {
  margin-bottom: 15px;
}

.dashboard-content h2,
.dashboard-content h3 {
  color: #132945;
  letter-spacing: -0.025em;
}

.dashboard-content h2 {
  font-size: 18px;
  font-weight: 750;
}

.dashboard-content h3 {
  font-size: 14px;
  font-weight: 700;
}

/* ------------------------------------------------------------
   CARD INTERACTION
   ------------------------------------------------------------ */

.dashboard-content .card,
.dashboard-content .dashboard-card,
.dashboard-content .summary-card,
.dashboard-content .transaction-card,
.dashboard-content .insight-card,
.dashboard-content .account-card {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.dashboard-content .card:hover,
.dashboard-content .dashboard-card:hover,
.dashboard-content .summary-card:hover,
.dashboard-content .transaction-card:hover,
.dashboard-content .insight-card:hover,
.dashboard-content .account-card:hover {
  transform: translateY(-2px);
  border-color: #d2deeb;
  box-shadow: 0 12px 30px rgba(7, 27, 56, 0.07);
}

/* ------------------------------------------------------------
   RESPONSIVE
   ------------------------------------------------------------ */

@media (max-width: 1100px) {
  .dashboard-content {
    padding-inline: 24px;
  }

  .balance-section {
    grid-template-columns: 1fr;
  }

  .balance-main-card {
    min-height: 230px;
  }
}

@media (max-width: 820px) {
  .dashboard-content {
    padding: 24px 18px 40px;
  }

  .balance-main-card {
    min-height: 220px;
    padding: 24px;
  }

  .balance-card-footer {
    right: 24px;
    bottom: 22px;
    left: 24px;
  }
}

@media (max-width: 560px) {
  .dashboard-content {
    padding: 18px 14px 32px;
  }

  .balance-main-card {
    min-height: 210px;
    padding: 21px;
    border-radius: 17px;
  }

  .balance-value-row {
    gap: 8px;
  }

  .balance-value-row h2 {
    font-size: 31px;
  }

  .balance-card-footer {
    right: 21px;
    bottom: 19px;
    left: 21px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-state button,
  .balance-visibility-button,
  .dashboard-content .card,
  .dashboard-content .dashboard-card,
  .dashboard-content .summary-card,
  .dashboard-content .transaction-card,
  .dashboard-content .insight-card,
  .dashboard-content .account-card {
    transition: none;
  }
}



/* Balance value must remain clearly visible on the dark hero */
.balance-main-card .balance-value-row h2 {
  color: #ffffff !important;
  opacity: 1;
}

.balance-main-card .balance-value-row h2::selection {
  background: rgba(255, 255, 255, 0.2);
}

.balance-main-card .balance-visibility-button {
  color: rgba(255, 255, 255, 0.78);
}

.balance-main-card .balance-visibility-button:hover {
  color: #ffffff;
}



/* ============================================================
   BUUCHEZO BANK — QUICK ACTIONS / ACCOUNTS / TRANSACTIONS
   ============================================================ */

/* ------------------------------------------------------------
   QUICK ACTIONS
   ------------------------------------------------------------ */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.quick-action,
.quick-action-button {
  position: relative;
  min-height: 76px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e1e8f0;
  border-radius: 14px;
  background: #ffffff;
  color: #132945;
  text-decoration: none;
  cursor: pointer;
  font: inherit;
  text-align: left;
  box-shadow: 0 5px 18px rgba(7, 27, 56, 0.035);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.quick-action:hover,
.quick-action-button:hover {
  transform: translateY(-2px);
  border-color: #cbd9e8;
  background: #fbfdff;
  box-shadow: 0 10px 25px rgba(7, 27, 56, 0.07);
}

.quick-action:active,
.quick-action-button:active {
  transform: translateY(0);
}

.quick-action-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(21, 151, 255, 0.08);
  color: #1597ff;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.quick-action:hover .quick-action-icon,
.quick-action-button:hover .quick-action-icon {
  background: rgba(21, 151, 255, 0.13);
  color: #0b78c9;
  transform: scale(1.04);
}

.quick-action-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.quick-action-content strong {
  color: #172f4d;
  font-size: 12px;
  font-weight: 750;
}

.quick-action-content span {
  overflow: hidden;
  color: #8998aa;
  font-size: 10px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ------------------------------------------------------------
   COMMON DASHBOARD SECTION HEADER
   ------------------------------------------------------------ */

.dashboard-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.dashboard-section-header > div {
  min-width: 0;
}

.dashboard-section-header h2 {
  margin: 0;
  color: #132945;
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.025em;
}

.dashboard-section-header p {
  margin: 4px 0 0;
  color: #8a99ac;
  font-size: 11px;
}

.dashboard-section-header a,
.dashboard-section-header button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #1479c5;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 160ms ease,
    transform 160ms ease;
}

.dashboard-section-header a:hover,
.dashboard-section-header button:hover {
  color: #0b5d9a;
  transform: translateX(2px);
}

/* ------------------------------------------------------------
   ACCOUNT CARDS
   ------------------------------------------------------------ */

.accounts-grid,
.account-grid,
.accounts-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.account-card {
  position: relative;
  overflow: hidden;
  min-width: 0;
  padding: 20px;
  border: 1px solid #e1e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 6px 22px rgba(7, 27, 56, 0.04);
}

.account-card::after {
  content: "";
  position: absolute;
  width: 100px;
  height: 100px;
  right: -48px;
  bottom: -58px;
  border-radius: 50%;
  background: rgba(21, 151, 255, 0.045);
  pointer-events: none;
}

.account-card-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.account-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.account-card-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f0f7fd;
  color: #1479c5;
}

.account-card-title strong {
  display: block;
  overflow: hidden;
  color: #172f4d;
  font-size: 12px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-card-title span {
  display: block;
  margin-top: 3px;
  color: #8a99ac;
  font-size: 10px;
}

.account-card-balance {
  position: relative;
  z-index: 1;
  margin-bottom: 18px;
}

.account-card-balance span {
  color: #8a99ac;
  font-size: 10px;
  font-weight: 600;
}

.account-card-balance strong {
  display: block;
  margin-top: 5px;
  color: #0b2441;
  font-size: 24px;
  font-weight: 760;
  letter-spacing: -0.04em;
}

.account-card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 13px;
  border-top: 1px solid #edf1f5;
}

.account-card-footer span {
  color: #8a99ac;
  font-size: 10px;
}

.account-card-footer strong {
  color: #53667f;
  font-size: 10px;
  font-weight: 700;
}

/* ------------------------------------------------------------
   TRANSACTION LIST
   ------------------------------------------------------------ */

.transactions-list,
.transaction-list {
  overflow: hidden;
  border: 1px solid #e1e8f0;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 6px 22px rgba(7, 27, 56, 0.035);
}

.transaction-row,
.transaction-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 68px;
  padding: 11px 17px;
  border-bottom: 1px solid #edf1f5;
  transition:
    background-color 160ms ease,
    transform 160ms ease;
}

.transaction-row:last-child,
.transaction-item:last-child {
  border-bottom: 0;
}

.transaction-row:hover,
.transaction-item:hover {
  background: #fafcff;
}

.transaction-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #f1f6fb;
  color: #52708e;
}

.transaction-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.transaction-info strong {
  overflow: hidden;
  color: #172f4d;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-info span {
  overflow: hidden;
  color: #8a99ac;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-amount {
  flex: 0 0 auto;
  text-align: right;
}

.transaction-amount strong {
  display: block;
  color: #172f4d;
  font-size: 12px;
  font-weight: 750;
}

.transaction-amount span {
  display: block;
  margin-top: 3px;
  color: #8a99ac;
  font-size: 9px;
}

.transaction-amount .positive {
  color: #159477;
}

.transaction-amount .negative {
  color: #c45151;
}

/* ------------------------------------------------------------
   STATUS BADGES
   ------------------------------------------------------------ */

.status-badge,
.transaction-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 23px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.02em;
}

.status-badge.active,
.status-badge.success,
.transaction-status.completed,
.transaction-status.success {
  color: #13765e;
  background: #e9f8f3;
}

.status-badge.pending,
.transaction-status.pending {
  color: #996c17;
  background: #fff6df;
}

.status-badge.failed,
.status-badge.error,
.transaction-status.failed,
.transaction-status.error {
  color: #a84646;
  background: #fceeee;
}

/* ------------------------------------------------------------
   DASHBOARD TWO-COLUMN CONTENT
   ------------------------------------------------------------ */

.dashboard-two-column {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
  gap: 20px;
  margin-top: 24px;
}

.dashboard-panel {
  min-width: 0;
  border: 1px solid #e1e8f0;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 22px rgba(7, 27, 56, 0.035);
}

.dashboard-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 19px;
  border-bottom: 1px solid #edf1f5;
}

.dashboard-panel-header h2,
.dashboard-panel-header h3 {
  margin: 0;
  color: #132945;
  font-size: 14px;
  font-weight: 750;
}

.dashboard-panel-body {
  padding: 0;
}

/* ------------------------------------------------------------
   RESPONSIVE
   ------------------------------------------------------------ */

@media (max-width: 1100px) {
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-two-column {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .accounts-grid,
  .account-grid,
  .accounts-list {
    grid-template-columns: 1fr;
  }

  .dashboard-section-header {
    align-items: flex-end;
  }

  .transaction-row,
  .transaction-item {
    padding-inline: 13px;
  }
}

@media (max-width: 500px) {
  .quick-actions {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .quick-action,
  .quick-action-button {
    min-height: 68px;
    padding: 11px;
    gap: 8px;
  }

  .quick-action-icon {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
  }

  .quick-action-content strong {
    font-size: 11px;
  }

  .quick-action-content span {
    display: none;
  }

  .transaction-icon {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }

  .transaction-amount strong {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quick-action,
  .quick-action-button,
  .quick-action-icon,
  .dashboard-section-header a,
  .dashboard-section-header button,
  .dashboard-content .account-card,
  .transaction-row,
  .transaction-item {
    transition: none;
  }
}



/* QUICK ACTION — FULL COLOR INTERACTION */

.quick-action,
.quick-action-button {
  border-color: #dfe7f0;
  background: #ffffff;
  color: #132945;
  transform: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}

.quick-action .quick-action-icon,
.quick-action-button .quick-action-icon {
  background: rgba(21, 151, 255, 0.08);
  color: #1597ff;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.quick-action-content strong,
.quick-action-content span {
  transition: color 180ms ease;
}

/* Full-color hover state */
.quick-action:hover,
.quick-action-button:hover {
  background: linear-gradient(135deg, #0d6fbd 0%, #1597ff 100%);
  border-color: #1597ff;
  color: #ffffff;
  transform: none;
  box-shadow: 0 10px 24px rgba(21, 151, 255, 0.22);
}

.quick-action:hover .quick-action-icon,
.quick-action-button:hover .quick-action-icon {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  transform: none;
}

.quick-action:hover .quick-action-content strong,
.quick-action-button:hover .quick-action-content strong {
  color: #ffffff;
}

.quick-action:hover .quick-action-content span,
.quick-action-button:hover .quick-action-content span {
  color: rgba(255, 255, 255, 0.72);
}

/* Selected / active state */
.quick-action.active,
.quick-action-button.active,
.quick-action[aria-current="page"],
.quick-action-button[aria-current="page"],
.quick-action[aria-pressed="true"],
.quick-action-button[aria-pressed="true"] {
  background: linear-gradient(135deg, #0d6fbd 0%, #1597ff 100%);
  border-color: #1597ff;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(21, 151, 255, 0.20);
}

.quick-action.active .quick-action-icon,
.quick-action-button.active .quick-action-icon,
.quick-action[aria-current="page"] .quick-action-icon,
.quick-action-button[aria-current="page"] .quick-action-icon,
.quick-action[aria-pressed="true"] .quick-action-icon,
.quick-action-button[aria-pressed="true"] .quick-action-icon {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.quick-action.active .quick-action-content strong,
.quick-action-button.active .quick-action-content strong,
.quick-action[aria-current="page"] .quick-action-content strong,
.quick-action-button[aria-current="page"] .quick-action-content strong,
.quick-action[aria-pressed="true"] .quick-action-content strong,
.quick-action-button[aria-pressed="true"] .quick-action-content strong {
  color: #ffffff;
}

.quick-action.active .quick-action-content span,
.quick-action-button.active .quick-action-content span,
.quick-action[aria-current="page"] .quick-action-content span,
.quick-action-button[aria-current="page"] .quick-action-content span,
.quick-action[aria-pressed="true"] .quick-action-content span,
.quick-action-button[aria-pressed="true"] .quick-action-content span {
  color: rgba(255, 255, 255, 0.72);
}

/* Keyboard accessibility */
.quick-action:focus-visible,
.quick-action-button:focus-visible {
  outline: 3px solid rgba(21, 151, 255, 0.24);
  outline-offset: 2px;
}

/* Press state */
.quick-action:active,
.quick-action-button:active {
  transform: scale(0.985);
  box-shadow: 0 5px 14px rgba(21, 151, 255, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  .quick-action,
  .quick-action-button,
  .quick-action .quick-action-icon,
  .quick-action-button .quick-action-icon,
  .quick-action-content strong,
  .quick-action-content span {
    transition: none;
  }
}

</style>

<style>
/* =========================================================
   QUICK ACTIONS — FULL COLOR HOVER
   ========================================================= */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.quick-action,
.quick-action-button,
a.quick-action,
button.quick-action {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;

  min-height: 86px !important;
  padding: 18px !important;

  background: #ffffff !important;
  color: #132945 !important;

  border: 1px solid #dfe7f0 !important;
  border-radius: 16px !important;

  box-shadow: 0 4px 14px rgba(15, 35, 65, 0.05) !important;

  transform: none !important;

  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease !important;

  cursor: pointer !important;
}

/* ICON CONTAINER */
.quick-action .icon,
.quick-action .quick-action-icon,
.quick-action-button .icon,
.quick-action-button .quick-action-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;

  border-radius: 12px !important;

  background: #edf6ff !important;
  color: #0d6fbd !important;

  transition:
    background 180ms ease,
    color 180ms ease !important;
}

/* TEXT */
.quick-action h3,
.quick-action h4,
.quick-action strong,
.quick-action-title,
.quick-action-label,
.quick-action span,
.quick-action-button h3,
.quick-action-button h4,
.quick-action-button strong,
.quick-action-button span {
  color: #132945 !important;

  transition: color 180ms ease !important;
}

/* =========================================================
   HOVER — WHOLE TILE BECOMES BLUE
   ========================================================= */

.quick-action:hover,
.quick-action-button:hover,
a.quick-action:hover,
button.quick-action:hover {
  background: linear-gradient(
    135deg,
    #0d6fbd 0%,
    #1597ff 100%
  ) !important;

  border-color: #1597ff !important;

  color: #ffffff !important;

  box-shadow:
    0 12px 28px rgba(21, 151, 255, 0.28) !important;

  transform: none !important;
}

/* EVERYTHING INSIDE BECOMES WHITE */
.quick-action:hover h3,
.quick-action:hover h4,
.quick-action:hover strong,
.quick-action:hover span,
.quick-action:hover .quick-action-title,
.quick-action:hover .quick-action-label,
.quick-action-button:hover h3,
.quick-action-button:hover h4,
.quick-action-button:hover strong,
.quick-action-button:hover span {
  color: #ffffff !important;
}

/* ICON ALSO CHANGES */
.quick-action:hover .icon,
.quick-action:hover .quick-action-icon,
.quick-action-button:hover .icon,
.quick-action-button:hover .quick-action-icon {
  background: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
}

/* SVG ICONS */
.quick-action:hover svg,
.quick-action-button:hover svg {
  color: #ffffff !important;
  stroke: #ffffff !important;
}

/* =========================================================
   ACTIVE / SELECTED STATE
   ========================================================= */

.quick-action.active,
.quick-action-button.active,
.quick-action[aria-current="page"],
.quick-action[aria-pressed="true"],
.quick-action-button[aria-current="page"],
.quick-action-button[aria-pressed="true"] {
  background: linear-gradient(
    135deg,
    #0d6fbd 0%,
    #1597ff 100%
  ) !important;

  border-color: #1597ff !important;
  color: #ffffff !important;

  box-shadow:
    0 10px 26px rgba(21, 151, 255, 0.25) !important;
}

.quick-action.active h3,
.quick-action.active h4,
.quick-action.active strong,
.quick-action.active span,
.quick-action-button.active h3,
.quick-action-button.active h4,
.quick-action-button.active strong,
.quick-action-button.active span {
  color: #ffffff !important;
}

.quick-action.active .icon,
.quick-action.active .quick-action-icon,
.quick-action-button.active .icon,
.quick-action-button.active .quick-action-icon {
  background: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 900px) {
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
}


/* =========================================================
   CUSTOMER DASHBOARD QUICK ACTIONS
   FULL COLOR HOVER
   ========================================================= */

.dashboard-actions .action-card {
  background: #ffffff !important;
  color: #132945 !important;
  border: 1px solid #dfe7f0 !important;
  border-radius: 18px !important;
  box-shadow: 0 4px 14px rgba(15, 35, 65, 0.05) !important;

  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease !important;

  transform: none !important;
}

/* ICON */
.dashboard-actions .action-card .action-icon {
  background: #edf6ff !important;
  color: #0d6fbd !important;

  transition:
    background 180ms ease,
    color 180ms ease !important;
}

/* TITLE */
.dashboard-actions .action-card strong {
  color: #132945 !important;
  transition: color 180ms ease !important;
}

/* DESCRIPTION */
.dashboard-actions .action-card span {
  color: #6b7d91 !important;
  transition: color 180ms ease !important;
}

/* ARROW */
.dashboard-actions .action-card .action-arrow {
  color: #7b8da1 !important;
  transition: color 180ms ease !important;
}

/* =========================================================
   HOVER — THE ENTIRE CARD TURNS BLUE
   ========================================================= */

.dashboard-actions .action-card:hover {
  background: linear-gradient(
    135deg,
    #0d6fbd 0%,
    #1597ff 100%
  ) !important;

  border-color: #1597ff !important;

  color: #ffffff !important;

  box-shadow:
    0 14px 30px rgba(21, 151, 255, 0.28) !important;

  transform: none !important;
}

/* TITLE → WHITE */
.dashboard-actions .action-card:hover strong {
  color: #ffffff !important;
}

/* DESCRIPTION → WHITE */
.dashboard-actions .action-card:hover span {
  color: rgba(255, 255, 255, 0.82) !important;
}

/* ICON → WHITE */
.dashboard-actions .action-card:hover .action-icon {
  background: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
}

/* ARROW → WHITE */
.dashboard-actions .action-card:hover .action-arrow {
  color: #ffffff !important;
}

/* SVG → WHITE */
.dashboard-actions .action-card:hover svg {
  color: #ffffff !important;
  stroke: #ffffff !important;
}

/* =========================================================
   CLICK / ACTIVE
   ========================================================= */

.dashboard-actions .action-card:active {
  background: #0b63aa !important;
  border-color: #0b63aa !important;
  color: #ffffff !important;
}

.dashboard-actions .action-card:active strong,
.dashboard-actions .action-card:active span,
.dashboard-actions .action-card:active .action-arrow {
  color: #ffffff !important;
}

.dashboard-actions .action-card:active .action-icon {
  background: rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
}

</style>

<style>
/* =========================================================
   2E — RECENT TRANSACTIONS
   Premium banking transaction panel
   ========================================================= */

.dashboard-lower {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.85fr);
  gap: 22px;
  align-items: start;
}

/* Transaction section/card */
.transactions-section,
.recent-transactions,
.transaction-section {
  background: #ffffff;
  border: 1px solid #e3eaf2;
  border-radius: 20px;
  box-shadow: 0 5px 18px rgba(15, 35, 65, 0.045);
  overflow: hidden;
}

/* Section header */
.dashboard-lower .section-heading,
.transactions-section .section-heading,
.recent-transactions .section-heading,
.transaction-section .section-heading {
  padding: 22px 24px 18px;
  margin: 0;
  border-bottom: 1px solid #edf1f5;
}

/* Kicker */
.dashboard-lower .section-heading > div > span:first-child,
.transactions-section .section-heading > div > span:first-child,
.recent-transactions .section-heading > div > span:first-child,
.transaction-section .section-heading > div > span:first-child {
  display: block;
  margin-bottom: 5px;

  color: #718399;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Heading */
.dashboard-lower .section-heading h2,
.transactions-section .section-heading h2,
.recent-transactions .section-heading h2,
.transaction-section .section-heading h2 {
  margin: 0;

  color: #132945;
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.02em;
}

/* View all / section action */
.dashboard-lower .section-heading a,
.transactions-section .section-heading a,
.recent-transactions .section-heading a,
.transaction-section .section-heading a {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: #0d6fbd;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  transition:
    color 180ms ease,
    gap 180ms ease;
}

.dashboard-lower .section-heading a:hover,
.transactions-section .section-heading a:hover,
.recent-transactions .section-heading a:hover,
.transaction-section .section-heading a:hover {
  color: #07548f;
  gap: 9px;
}

/* Transaction list */
.dashboard-lower .transaction-list,
.transactions-section .transaction-list,
.recent-transactions .transaction-list,
.transaction-section .transaction-list {
  padding: 4px 24px;
}

/* Individual transaction */
.dashboard-lower .transaction-item,
.transactions-section .transaction-item,
.recent-transactions .transaction-item,
.transaction-section .transaction-item {
  display: flex;
  align-items: center;
  gap: 14px;

  min-height: 74px;
  padding: 14px 0;

  border-bottom: 1px solid #edf1f5;

  transition:
    background-color 180ms ease,
    padding 180ms ease;
}

.dashboard-lower .transaction-item:last-child,
.transactions-section .transaction-item:last-child,
.recent-transactions .transaction-item:last-child,
.transaction-section .transaction-item:last-child {
  border-bottom: none;
}

/* Transaction hover */
.dashboard-lower .transaction-item:hover,
.transactions-section .transaction-item:hover,
.recent-transactions .transaction-item:hover,
.transaction-section .transaction-item:hover {
  background: #f8fbfe;
}

/* Transaction icon */
.dashboard-lower .transaction-icon,
.transactions-section .transaction-icon,
.recent-transactions .transaction-icon,
.transaction-section .transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;
  min-width: 42px;

  border-radius: 13px;

  background: #edf6ff;
  color: #0d6fbd;
}

/* Transaction information */
.dashboard-lower .transaction-info,
.transactions-section .transaction-info,
.recent-transactions .transaction-info,
.transaction-section .transaction-info {
  min-width: 0;
  flex: 1;
}

.dashboard-lower .transaction-info strong,
.transactions-section .transaction-info strong,
.recent-transactions .transaction-info strong,
.transaction-section .transaction-info strong {
  display: block;

  overflow: hidden;

  color: #172f4c;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-lower .transaction-info span,
.transactions-section .transaction-info span,
.recent-transactions .transaction-info span,
.transaction-section .transaction-info span {
  display: block;
  margin-top: 4px;

  overflow: hidden;

  color: #8190a1;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Transaction amount */
.dashboard-lower .transaction-amount,
.transactions-section .transaction-amount,
.recent-transactions .transaction-amount,
.transaction-section .transaction-amount {
  text-align: right;
  white-space: nowrap;
}

.dashboard-lower .transaction-amount strong,
.transactions-section .transaction-amount strong,
.recent-transactions .transaction-amount strong,
.transaction-section .transaction-amount strong {
  display: block;

  color: #132945;
  font-size: 14px;
  font-weight: 750;
}

.dashboard-lower .transaction-amount .positive,
.transactions-section .transaction-amount .positive,
.recent-transactions .transaction-amount .positive,
.transaction-section .transaction-amount .positive {
  color: #07856b;
}

.dashboard-lower .transaction-amount .negative,
.transactions-section .transaction-amount .negative,
.recent-transactions .transaction-amount .negative,
.transaction-section .transaction-amount .negative {
  color: #d64b57;
}

/* Status */
.dashboard-lower .transaction-status,
.transactions-section .transaction-status,
.recent-transactions .transaction-status,
.transaction-section .transaction-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  margin-top: 4px;

  color: #718399;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.dashboard-lower .transaction-status::before,
.transactions-section .transaction-status::before,
.recent-transactions .transaction-status::before,
.transaction-section .transaction-status::before {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #0aa681;

  content: "";
}

/* Empty transaction state */
.dashboard-lower .empty-state,
.transactions-section .empty-state,
.recent-transactions .empty-state,
.transaction-section .empty-state {
  padding: 42px 24px;

  text-align: center;
}

.dashboard-lower .empty-state strong,
.transactions-section .empty-state strong,
.recent-transactions .empty-state strong,
.transaction-section .empty-state strong {
  display: block;

  color: #263d58;
  font-size: 14px;
}

.dashboard-lower .empty-state span,
.transactions-section .empty-state span,
.recent-transactions .empty-state span,
.transaction-section .empty-state span {
  display: block;
  margin-top: 5px;

  color: #8493a5;
  font-size: 12px;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1050px) {
  .dashboard-lower {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dashboard-lower {
    gap: 16px;
  }

  .dashboard-lower .section-heading,
  .transactions-section .section-heading,
  .recent-transactions .section-heading,
  .transaction-section .section-heading {
    padding: 18px;
  }

  .dashboard-lower .transaction-list,
  .transactions-section .transaction-list,
  .recent-transactions .transaction-list,
  .transaction-section .transaction-list {
    padding: 4px 18px;
  }

  .dashboard-lower .transaction-item,
  .transactions-section .transaction-item,
  .recent-transactions .transaction-item,
  .transaction-section .transaction-item {
    gap: 10px;
  }

  .dashboard-lower .transaction-icon,
  .transactions-section .transaction-icon,
  .recent-transactions .transaction-icon,
  .transaction-section .transaction-icon {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }

  .dashboard-lower .transaction-amount strong,
  .transactions-section .transaction-amount strong,
  .recent-transactions .transaction-amount strong,
  .transaction-section .transaction-amount strong {
    font-size: 13px;
  }
}


/* ============================================================
   BUUCHEZO BANK — LEGACY CUSTOMER SHELL DISABLED
   BankingShell.vue is now the single customer application shell.
   ============================================================ */

/* ----------------------------
   Legacy sidebars
---------------------------- */

.banking-content .dashboard-sidebar,
.banking-content .sidebar,
.banking-content .transfers-sidebar,
.banking-content .accounts-sidebar,
.banking-content .transactions-sidebar,
.banking-content .investments-sidebar,
.banking-content .market-sidebar,
.banking-content .settings-sidebar,
.banking-content .mobile-overlay {
  display: none !important;
}

/* ----------------------------
   Legacy headers
---------------------------- */

.banking-content .dashboard-header,
.banking-content .transfers-header,
.banking-content .accounts-header,
.banking-content .transactions-header,
.banking-content .cards-page .dashboard-header,
.banking-content .investments-header,
.banking-content .market-header,
.banking-content .settings-header {
  display: none !important;
}

/* ----------------------------
   Legacy shell containers
---------------------------- */

.banking-content .dashboard-page,
.banking-content .cards-page,
.banking-content .transfers-page,
.banking-content .accounts-page,
.banking-content .transactions-page,
.banking-content .investments-page,
.banking-content .market-page,
.banking-content .settings-page {
  width: 100% !important;
  min-height: 0 !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  background: transparent !important;
  color: inherit !important;
}

/* ----------------------------
   Legacy main containers
---------------------------- */

.banking-content .dashboard-main,
.banking-content .main-content,
.banking-content .transfers-main,
.banking-content .accounts-main,
.banking-content .transactions-main,
.banking-content .investments-main,
.banking-content .market-main,
.banking-content .settings-main {
  width: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  background: transparent !important;
}

/* ----------------------------
   Legacy content wrappers
---------------------------- */

.banking-content .dashboard-content,
.banking-content .transfers-content,
.banking-content .content {
  width: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}

/* ----------------------------
   Legacy mobile controls
---------------------------- */

.banking-content .mobile-menu-button,
.banking-content .mobile-close {
  display: none !important;
}

/* ----------------------------
   Legacy page-level typography
---------------------------- */

.banking-content .dashboard-main > h1,
.banking-content .dashboard-main > h2,
.banking-content .main-content > h1,
.banking-content .main-content > h2 {
  font-family: inherit !important;
}

/* ----------------------------
   Investments / standalone pages
---------------------------- */

.banking-content > .investments-page,
.banking-content > .market-page,
.banking-content > .settings-page {
  box-sizing: border-box !important;
}

/* ----------------------------
   Shared customer page spacing
---------------------------- */

.banking-content > .dashboard-page,
.banking-content > .cards-page,
.banking-content > .transfers-page,
.banking-content > .accounts-page,
.banking-content > .transactions-page,
.banking-content > .investments-page,
.banking-content > .market-page,
.banking-content > .settings-page {
  box-sizing: border-box !important;
}

/* ============================================================
   FORCE CONSISTENT CUSTOMER TYPOGRAPHY
   ============================================================ */

.banking-content > .dashboard-page h1,
.banking-content > .cards-page h1,
.banking-content > .transfers-page h1,
.banking-content > .accounts-page h1,
.banking-content > .transactions-page h1,
.banking-content > .investments-page h1,
.banking-content > .market-page h1,
.banking-content > .settings-page h1 {
  color: #132945;
}

.banking-content > .dashboard-page p,
.banking-content > .cards-page p,
.banking-content > .transfers-page p,
.banking-content > .accounts-page p,
.banking-content > .transactions-page p,
.banking-content > .investments-page p,
.banking-content > .market-page p,
.banking-content > .settings-page p {
  color: #718096;
}

/* ============================================================
   IMPORTANT:
   Existing page-specific cards/buttons remain intact.
   Only the outer application shell is centralized.
   ============================================================ */

</style>
