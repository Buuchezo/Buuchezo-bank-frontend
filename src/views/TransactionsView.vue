<template>
  <main class="transactions-page">
    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <aside class="transactions-sidebar" :class="{ open: mobileMenuOpen }">
      <RouterLink to="/" class="dashboard-logo">
        <span>B</span>
        <strong>Buuchezo Bank</strong>
      </RouterLink>

      <nav class="dashboard-nav">
        <span class="nav-section-title">MAIN</span>

        <RouterLink to="/dashboard" class="dashboard-nav-link">
          <LayoutDashboard :size="18" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink to="/accounts" class="dashboard-nav-link">
          <WalletCards :size="18" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink to="/transactions" class="dashboard-nav-link active">
          <ArrowLeftRight :size="18" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink to="/cards" class="dashboard-nav-link">
          <CreditCard :size="18" />
          <span>Cards</span>
        </RouterLink>

        <span class="nav-section-title second-nav-title"> SERVICES </span>

        <RouterLink to="/transfers" class="dashboard-nav-link">
          <Send :size="18" />
          <span>Transfers</span>
        </RouterLink>

        <RouterLink to="/settings" class="dashboard-nav-link">
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

        <button type="button" class="logout-button" @click="logout">
          <LogOut :size="17" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <!-- =====================================================
         MAIN
    ====================================================== -->

    <div class="transactions-main">
      <!-- HEADER -->

      <header class="transactions-header">
        <button type="button" class="mobile-menu-button" @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu :size="21" />
        </button>

        <div class="header-title">
          <span>TRANSACTIONS</span>
          <h1>Transaction history</h1>
        </div>

        <div class="header-actions">
          <NotificationDropdown />

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

      <!-- CONTENT -->

      <div class="transactions-content">
        <!-- =================================================
             LOADING
        ================================================== -->

        <div v-if="loading" class="page-state">
          <strong>Loading transactions...</strong>

          <span> Fetching your transaction history securely. </span>
        </div>

        <!-- =================================================
             ERROR
        ================================================== -->

        <div v-else-if="errorMessage" class="page-state page-state-error">
          <strong> Unable to load transactions </strong>

          <span>
            {{ errorMessage }}
          </span>

          <button type="button" @click="loadTransactions">Try again</button>
        </div>

        <template v-else>
          <!-- =================================================
               PAGE INTRO
          ================================================== -->

          <section class="page-intro">
            <div>
              <span>YOUR MONEY</span>

              <h2>Keep track of every transaction.</h2>

              <p>Review money coming into and leaving your account.</p>
            </div>

            <div class="account-reference">
              <span>ACCOUNT</span>

              <strong> •••• {{ maskedAccountNumber }} </strong>
            </div>
          </section>

          <!-- =================================================
               STATISTICS
          ================================================== -->

          <section class="transaction-stats">
            <div class="transaction-stat-card">
              <div class="transaction-stat-icon">
                <ArrowLeftRight :size="18" />
              </div>

              <div>
                <span>Total transactions</span>

                <strong>
                  {{ filteredTransactions.length }}
                </strong>

                <small> Matching current filters </small>
              </div>
            </div>

            <div class="transaction-stat-card">
              <div class="transaction-stat-icon income">
                <ArrowDownLeft :size="18" />
              </div>

              <div>
                <span>Total income</span>

                <strong>
                  {{ formatMoney(totalIncome) }}
                </strong>

                <small> Money received </small>
              </div>
            </div>

            <div class="transaction-stat-card">
              <div class="transaction-stat-icon expense">
                <ArrowUpRight :size="18" />
              </div>

              <div>
                <span>Total expenses</span>

                <strong>
                  {{ formatMoney(totalExpenses) }}
                </strong>

                <small> Money sent or spent </small>
              </div>
            </div>
          </section>

          <!-- =================================================
               FILTERS
          ================================================== -->

          <section class="transactions-panel">
            <div class="transactions-panel-header">
              <div>
                <span>ACTIVITY</span>

                <h2>All transactions</h2>
              </div>

              <div class="transaction-count">
                {{ filteredTransactions.length }}
                transaction<span v-if="filteredTransactions.length !== 1">s</span>
              </div>
            </div>

            <div class="filters">
              <!-- SEARCH -->

              <div class="search-field">
                <Search :size="16" />

                <input v-model="searchQuery" type="text" placeholder="Search transactions..." />
              </div>

              <!-- DIRECTION -->

              <div class="filter-field">
                <label>Direction</label>

                <select v-model="directionFilter">
                  <option value="ALL">All transactions</option>

                  <option value="CREDIT">Income</option>

                  <option value="DEBIT">Expenses</option>
                </select>

                <ChevronDown :size="13" class="select-icon" />
              </div>

              <!-- TYPE -->

              <div class="filter-field">
                <label>Type</label>

                <select v-model="typeFilter">
                  <option value="ALL">All types</option>

                  <option value="DEPOSIT">Deposits</option>

                  <option value="TRANSFER">Transfers</option>

                  <option value="PAYMENT">Payments</option>

                  <option value="WITHDRAWAL">Withdrawals</option>
                </select>

                <ChevronDown :size="13" class="select-icon" />
              </div>

              <!-- RESET -->

              <button
                v-if="hasActiveFilters"
                type="button"
                class="clear-filters"
                @click="clearFilters"
              >
                Clear filters
              </button>
            </div>

            <!-- =================================================
                 TABLE
            ================================================== -->

            <div class="transaction-table-wrapper">
              <table class="transaction-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th class="amount-column">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <!-- EMPTY -->

                  <tr v-if="filteredTransactions.length === 0">
                    <td colspan="5" class="empty-table">
                      <div class="empty-icon">
                        <ArrowLeftRight :size="21" />
                      </div>

                      <strong> No transactions found </strong>

                      <span> Try changing your filters or make your first transaction. </span>
                    </td>
                  </tr>

                  <!-- TRANSACTIONS -->

                  <tr
                    v-for="transaction in filteredTransactions"
                    :key="transaction.id || transaction.reference"
                    class="transaction-row"
                    @click="selectTransaction(transaction)"
                  >
                    <!-- TRANSACTION -->

                    <td>
                      <div class="table-transaction">
                        <div
                          class="table-transaction-icon"
                          :class="{
                            credit: transaction.transactionDirection === 'CREDIT',
                          }"
                        >
                          <component :is="getTransactionIcon(transaction)" :size="17" />
                        </div>

                        <div>
                          <strong>
                            {{ transactionDescription(transaction) }}
                          </strong>

                          <span>
                            {{ transaction.reference }}
                          </span>
                        </div>
                      </div>
                    </td>

                    <!-- DATE -->

                    <td>
                      <div class="table-date">
                        <strong>
                          {{ formatTransactionDate(transaction.createdAt) }}
                        </strong>

                        <span>
                          {{ formatTransactionTime(transaction.createdAt) }}
                        </span>
                      </div>
                    </td>

                    <!-- TYPE -->

                    <td>
                      <span class="transaction-type">
                        {{ transactionLabel(transaction) }}
                      </span>
                    </td>

                    <!-- STATUS -->

                    <td>
                      <span
                        class="status-badge"
                        :class="statusClass(transaction.transactionStatus)"
                      >
                        {{ formatStatus(transaction.transactionStatus) }}
                      </span>
                    </td>

                    <!-- AMOUNT -->

                    <td class="amount-column">
                      <strong
                        class="table-amount"
                        :class="transaction.transactionDirection === 'CREDIT' ? 'credit' : 'debit'"
                      >
                        {{ transaction.transactionDirection === 'CREDIT' ? '+' : '−'
                        }}{{ formatMoney(Math.abs(Number(transaction.amount))) }}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- =================================================
               TRANSACTION DETAIL
          ================================================== -->

          <div
            v-if="selectedTransaction"
            class="transaction-overlay"
            @click.self="selectedTransaction = null"
          >
            <section class="transaction-detail">
              <button
                type="button"
                class="close-detail"
                aria-label="Close transaction details"
                @click="selectedTransaction = null"
              >
                ×
              </button>

              <div class="detail-heading">
                <div
                  class="detail-icon"
                  :class="{
                    credit: selectedTransaction.transactionDirection === 'CREDIT',
                  }"
                >
                  <component :is="getTransactionIcon(selectedTransaction)" :size="21" />
                </div>

                <div>
                  <span>TRANSACTION DETAILS</span>

                  <h2>
                    {{ transactionDescription(selectedTransaction) }}
                  </h2>
                </div>
              </div>

              <div
                class="detail-amount"
                :class="selectedTransaction.transactionDirection === 'CREDIT' ? 'credit' : 'debit'"
              >
                {{ selectedTransaction.transactionDirection === 'CREDIT' ? '+' : '−'
                }}{{ formatMoney(Math.abs(Number(selectedTransaction.amount))) }}
              </div>

              <div class="detail-list">
                <div>
                  <span>Reference</span>

                  <strong>
                    {{ selectedTransaction.reference }}
                  </strong>
                </div>

                <div>
                  <span>Date</span>

                  <strong>
                    {{ formatFullDate(selectedTransaction.createdAt) }}
                  </strong>
                </div>

                <div>
                  <span>Transaction type</span>

                  <strong>
                    {{ transactionLabel(selectedTransaction) }}
                  </strong>
                </div>

                <div>
                  <span>Direction</span>

                  <strong>
                    {{ selectedTransaction.transactionDirection === 'CREDIT' ? 'Credit' : 'Debit' }}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {{ formatStatus(selectedTransaction.transactionStatus) }}
                  </strong>
                </div>

                <div>
                  <span>Channel</span>

                  <strong>
                    {{ selectedTransaction.channel || 'Not specified' }}
                  </strong>
                </div>

                <div v-if="selectedTransaction.fromAccountNumber">
                  <span>From account</span>

                  <strong>
                    {{ selectedTransaction.fromAccountNumber }}
                  </strong>
                </div>

                <div v-if="selectedTransaction.toAccountNumber">
                  <span>To account</span>

                  <strong>
                    {{ selectedTransaction.toAccountNumber }}
                  </strong>
                </div>

                <div v-if="selectedTransaction.description">
                  <span>Description</span>

                  <strong>
                    {{ selectedTransaction.description }}
                  </strong>
                </div>
              </div>
            </section>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
import NotificationDropdown from '../components/layout/NotificationDropdownView.vue'

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Send,
  Settings,
  ShoppingBag,
  WalletCards,
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

/* =========================================================
   CONFIG
========================================================= */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const router = useRouter()

/* =========================================================
   STATE
========================================================= */

const mobileMenuOpen = ref(false)

const loading = ref(true)

const errorMessage = ref('')

const transactions = ref<Transaction[]>([])

const selectedTransaction = ref<Transaction | null>(null)

const searchQuery = ref('')

const directionFilter = ref<'ALL' | 'CREDIT' | 'DEBIT'>('ALL')

const typeFilter = ref<'ALL' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT'>('ALL')

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

/* =========================================================
   USER
========================================================= */

const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`.trim() || 'User'
})

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''

  const last = user.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase() || 'U'
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
   DATE
========================================================= */

function formatTransactionDate(dateString: string) {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTransactionTime(dateString: string) {
  if (!dateString) {
    return ''
  }

  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFullDate(dateString: string) {
  if (!dateString) {
    return ''
  }

  return new Date(dateString).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* =========================================================
   TRANSACTION HELPERS
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

function getTransactionIcon(transaction: Transaction) {
  if (transaction.transactionDirection === 'CREDIT') {
    return ArrowDownLeft
  }

  switch (transaction.transactionType) {
    case 'PAYMENT':
      return ShoppingBag

    case 'TRANSFER':
      return ArrowLeftRight

    case 'WITHDRAWAL':
      return ArrowUpRight

    default:
      return ArrowUpRight
  }
}

/* =========================================================
   STATUS
========================================================= */

function formatStatus(status?: string) {
  if (!status) {
    return 'Unknown'
  }

  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusClass(status?: string) {
  if (!status) {
    return 'unknown'
  }

  const normalized = status.toUpperCase()

  if (normalized === 'SUCCESS' || normalized === 'COMPLETED' || normalized === 'SUCCESSFUL') {
    return 'success'
  }

  if (normalized === 'PENDING' || normalized === 'PROCESSING') {
    return 'pending'
  }

  if (normalized === 'FAILED' || normalized === 'CANCELLED' || normalized === 'REJECTED') {
    return 'failed'
  }

  return 'unknown'
}

/* =========================================================
   FILTERING
========================================================= */

const filteredTransactions = computed(() => {
  const search = searchQuery.value.trim().toLowerCase()

  return [...transactions.value]
    .filter((transaction) => {
      if (directionFilter.value !== 'ALL') {
        if (transaction.transactionDirection !== directionFilter.value) {
          return false
        }
      }

      if (typeFilter.value !== 'ALL') {
        if (transaction.transactionType !== typeFilter.value) {
          return false
        }
      }

      if (!search) {
        return true
      }

      return [
        transaction.reference,
        transaction.description,
        transaction.transactionType,
        transaction.transactionStatus,
        transaction.fromAccountNumber,
        transaction.toAccountNumber,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

/* =========================================================
   TOTAL INCOME
========================================================= */

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter((transaction) => transaction.transactionDirection === 'CREDIT')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
})

/* =========================================================
   TOTAL EXPENSES
========================================================= */

const totalExpenses = computed(() => {
  return filteredTransactions.value
    .filter((transaction) => transaction.transactionDirection === 'DEBIT')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0)
})

/* =========================================================
   ACTIVE FILTERS
========================================================= */

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' || directionFilter.value !== 'ALL' || typeFilter.value !== 'ALL'
  )
})

function clearFilters() {
  searchQuery.value = ''

  directionFilter.value = 'ALL'

  typeFilter.value = 'ALL'
}

/* =========================================================
   SELECT TRANSACTION
========================================================= */

function selectTransaction(transaction: Transaction) {
  selectedTransaction.value = transaction
}

/* =========================================================
   LOAD TRANSACTIONS
========================================================= */

async function loadTransactions() {
  loading.value = true

  errorMessage.value = ''

  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

  if (!token) {
    await router.push('/login')
    return
  }

  try {
    /* =====================================================
       LOAD USER + ACCOUNT
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
      throw new Error(accountResult.message || 'Unable to load your account.')
    }

    user.value = accountResult.data.user

    account.value = accountResult.data.account

    /* =====================================================
       LOAD TRANSACTION HISTORY
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
      throw new Error(transactionResult.message || 'Unable to load transaction history.')
    }

    transactions.value = transactionResult.data || []
  } catch (error) {
    console.error('Transaction loading failed:', error)

    errorMessage.value = error instanceof Error ? error.message : 'Unable to load transactions.'
  } finally {
    loading.value = false
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

onMounted(loadTransactions)
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */

.transactions-page {
  min-height: 100vh;

  display: flex;

  color: #29465a;

  background: #f5f8fb;
}

/* =========================================================
   SIDEBAR
========================================================= */

.transactions-sidebar {
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

.transactions-main {
  width: calc(100% - 245px);

  margin-left: 245px;
}

/* =========================================================
   HEADER
========================================================= */

.transactions-header {
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

.transactions-content {
  max-width: 1400px;

  padding: 40px 45px 70px;

  margin: 0 auto;
}

/* =========================================================
   PAGE STATE
========================================================= */

.page-state {
  padding: 30px;

  display: flex;

  flex-direction: column;

  gap: 6px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;

  color: #082f56;
}

.page-state span {
  color: #8998a3;

  font-size: 12px;
}

.page-state-error {
  color: #7b2d2d;
}

.page-state button {
  width: fit-content;

  padding: 9px 14px;

  margin-top: 10px;

  color: white;

  background: #0b4878;

  border: 0;

  border-radius: 6px;

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}

/* =========================================================
   INTRO
========================================================= */

.page-intro {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 28px;
}

.page-intro span {
  display: block;

  margin-bottom: 7px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.page-intro h2 {
  margin: 0;

  color: #082f56;

  font-size: 25px;

  letter-spacing: -0.035em;
}

.page-intro p {
  margin: 8px 0 0;

  color: #8c9ba5;

  font-size: 10px;
}

.account-reference {
  padding: 14px 18px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 8px;

  text-align: right;
}

.account-reference span {
  margin-bottom: 5px;
}

.account-reference strong {
  color: #29465a;

  font-size: 12px;

  letter-spacing: 0.05em;
}

/* =========================================================
   STATISTICS
========================================================= */

.transaction-stats {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 15px;

  margin-bottom: 30px;
}

.transaction-stat-card {
  min-height: 105px;

  padding: 20px;

  display: flex;

  align-items: flex-start;

  gap: 13px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 11px;
}

.transaction-stat-icon {
  width: 37px;
  height: 37px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 8px;
}

.transaction-stat-icon.income {
  color: #27825f;

  background: #eaf7f1;
}

.transaction-stat-icon.expense {
  color: #0b4878;

  background: #edf6fb;
}

.transaction-stat-card span {
  display: block;

  color: #94a1ab;

  font-size: 9px;
}

.transaction-stat-card strong {
  display: block;

  margin-top: 7px;

  color: #29465a;

  font-size: 18px;

  letter-spacing: -0.025em;
}

.transaction-stat-card small {
  display: block;

  margin-top: 4px;

  color: #a2adb5;

  font-size: 8px;
}

/* =========================================================
   TRANSACTIONS PANEL
========================================================= */

.transactions-panel {
  padding: 25px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;
}

.transactions-panel-header {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 22px;
}

.transactions-panel-header span {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.transactions-panel-header h2 {
  margin: 0;

  color: #082f56;

  font-size: 18px;
}

.transaction-count {
  padding: 7px 10px;

  color: #7d8d99;

  background: #f5f8fa;

  border-radius: 5px;

  font-size: 8px;

  font-weight: 700;
}

/* =========================================================
   FILTERS
========================================================= */

.filters {
  display: flex;

  align-items: flex-end;

  gap: 10px;

  padding: 15px;

  margin-bottom: 22px;

  background: #f7fafc;

  border: 1px solid #edf1f4;

  border-radius: 9px;
}

.search-field {
  position: relative;

  flex: 1;

  min-width: 180px;

  height: 38px;
}

.search-field svg {
  position: absolute;

  top: 50%;
  left: 12px;

  color: #9aa8b2;

  transform: translateY(-50%);
}

.search-field input {
  width: 100%;
  height: 100%;

  padding: 0 12px 0 37px;

  color: #40586a;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 6px;

  outline: none;

  font-family: inherit;

  font-size: 9px;
}

.search-field input::placeholder {
  color: #a4afb7;
}

.search-field input:focus {
  border-color: #8bb6d3;
}

.filter-field {
  position: relative;

  width: 150px;
}

.filter-field label {
  display: block;

  margin-bottom: 5px;

  color: #8e9ca6;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.08em;
}

.filter-field select {
  width: 100%;

  height: 38px;

  padding: 0 28px 0 11px;

  color: #526b7b;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 6px;

  outline: none;

  appearance: none;

  font-family: inherit;

  font-size: 9px;

  cursor: pointer;
}

.select-icon {
  position: absolute;

  right: 10px;
  bottom: 12px;

  color: #8e9ca6;

  pointer-events: none;
}

.clear-filters {
  height: 38px;

  padding: 0 12px;

  color: #0b5da7;

  background: white;

  border: 1px solid #dce7ed;

  border-radius: 6px;

  font-family: inherit;

  font-size: 8px;

  font-weight: 700;

  cursor: pointer;

  white-space: nowrap;
}

.clear-filters:hover {
  background: #edf6fb;
}

/* =========================================================
   TABLE
========================================================= */

.transaction-table-wrapper {
  width: 100%;

  overflow-x: auto;
}

.transaction-table {
  width: 100%;

  border-collapse: collapse;

  min-width: 720px;
}

.transaction-table th {
  padding: 0 12px 12px;

  color: #9aa7b1;

  border-bottom: 1px solid #e8eef2;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.1em;

  text-align: left;
}

.transaction-table td {
  padding: 15px 12px;

  border-bottom: 1px solid #edf1f4;

  vertical-align: middle;
}

.transaction-row {
  cursor: pointer;

  transition: background 0.15s ease;
}

.transaction-row:hover {
  background: #f8fbfd;
}

.transaction-row:last-child td {
  border-bottom: 0;
}

.table-transaction {
  display: flex;

  align-items: center;

  gap: 11px;
}

.table-transaction-icon {
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

.table-transaction-icon.credit {
  color: #27825f;

  background: #eaf7f1;
}

.table-transaction strong {
  display: block;

  max-width: 230px;

  overflow: hidden;

  color: #425a6b;

  font-size: 9px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.table-transaction span {
  display: block;

  max-width: 230px;

  margin-top: 3px;

  overflow: hidden;

  color: #a0acb4;

  font-family: monospace;

  font-size: 7px;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.table-date strong {
  display: block;

  color: #536b7b;

  font-size: 8px;

  font-weight: 700;
}

.table-date span {
  display: block;

  margin-top: 3px;

  color: #a0acb4;

  font-size: 7px;
}

.transaction-type {
  display: inline-block;

  padding: 5px 8px;

  color: #657b89;

  background: #f3f7f9;

  border-radius: 4px;

  font-size: 7px;

  font-weight: 700;
}

.status-badge {
  display: inline-block;

  padding: 5px 8px;

  border-radius: 4px;

  font-size: 7px;

  font-weight: 700;
}

.status-badge.success {
  color: #27825f;

  background: #eaf7f1;
}

.status-badge.pending {
  color: #8a6b28;

  background: #fff8e7;
}

.status-badge.failed {
  color: #9a4545;

  background: #fceeee;
}

.status-badge.unknown {
  color: #6e7f8b;

  background: #f1f4f6;
}

.amount-column {
  text-align: right !important;
}

.table-amount {
  font-size: 10px;

  white-space: nowrap;
}

.table-amount.credit {
  color: #27825f;
}

.table-amount.debit {
  color: #536b7b;
}

/* =========================================================
   EMPTY TABLE
========================================================= */

.empty-table {
  padding: 65px 20px !important;

  text-align: center !important;
}

.empty-icon {
  width: 46px;
  height: 46px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin: 0 auto 12px;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 10px;
}

.empty-table strong {
  display: block;

  color: #425a6b;

  font-size: 11px;
}

.empty-table span {
  display: block;

  margin-top: 5px;

  color: #9ca9b2;

  font-size: 8px;
}

/* =========================================================
   DETAIL OVERLAY
========================================================= */

.transaction-overlay {
  position: fixed;

  inset: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(8, 47, 86, 0.35);

  z-index: 200;

  backdrop-filter: blur(4px);
}

.transaction-detail {
  position: relative;

  width: min(500px, 100%);

  max-height: 90vh;

  padding: 28px;

  overflow-y: auto;

  background: white;

  border-radius: 14px;

  box-shadow: 0 25px 70px rgba(8, 47, 86, 0.2);
}

.close-detail {
  position: absolute;

  top: 17px;
  right: 19px;

  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #83929c;

  background: #f4f8fa;

  border: 0;

  border-radius: 50%;

  font-size: 20px;

  line-height: 1;

  cursor: pointer;
}

.detail-heading {
  display: flex;

  align-items: center;

  gap: 13px;
}

.detail-icon {
  width: 43px;
  height: 43px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 10px;
}

.detail-icon.credit {
  color: #27825f;

  background: #eaf7f1;
}

.detail-heading span {
  display: block;

  margin-bottom: 4px;

  color: #9aa7b1;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.detail-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 17px;
}

.detail-amount {
  margin: 28px 0;

  color: #536b7b;

  font-size: 30px;

  font-weight: 700;

  letter-spacing: -0.04em;
}

.detail-amount.credit {
  color: #27825f;
}

.detail-list {
  display: flex;

  flex-direction: column;

  border-top: 1px solid #edf1f4;
}

.detail-list > div {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  padding: 12px 0;

  border-bottom: 1px solid #edf1f4;
}

.detail-list span {
  color: #94a1ab;

  font-size: 8px;
}

.detail-list strong {
  max-width: 60%;

  color: #536b7b;

  font-size: 8px;

  text-align: right;

  word-break: break-word;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {
  .transactions-sidebar {
    width: 215px;
  }

  .transactions-main {
    width: calc(100% - 215px);

    margin-left: 215px;
  }

  .transactions-content {
    padding-left: 30px;
    padding-right: 30px;
  }

  .transactions-header {
    padding-left: 30px;
    padding-right: 30px;
  }

  .filters {
    flex-wrap: wrap;
  }

  .search-field {
    flex-basis: 100%;
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 850px) {
  .transactions-sidebar {
    transform: translateX(-100%);

    transition: transform 0.25s ease;

    box-shadow: 10px 0 35px rgba(8, 47, 86, 0.1);
  }

  .transactions-sidebar.open {
    transform: translateX(0);
  }

  .transactions-main {
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

  .transactions-header {
    gap: 15px;
  }

  .header-title {
    flex: 1;
  }

  .profile-info {
    display: none;
  }

  .transaction-stats {
    grid-template-columns: 1fr 1fr;
  }

  .transaction-stat-card:last-child {
    grid-column: span 2;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .transactions-header {
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

  .transactions-content {
    padding: 25px 16px 50px;
  }

  .page-intro {
    display: block;
  }

  .page-intro h2 {
    font-size: 21px;
  }

  .account-reference {
    width: fit-content;

    margin-top: 18px;

    text-align: left;
  }

  .transaction-stats {
    grid-template-columns: 1fr;

    gap: 10px;
  }

  .transaction-stat-card:last-child {
    grid-column: auto;
  }

  .transactions-panel {
    padding: 18px;
  }

  .transactions-panel-header {
    align-items: flex-start;
  }

  .filters {
    display: grid;

    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: span 2;

    min-width: 0;
  }

  .filter-field {
    width: 100%;
  }

  .clear-filters {
    width: 100%;
  }

  .transaction-detail {
    padding: 22px;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .transactions-content {
    padding-left: 12px;
    padding-right: 12px;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .search-field {
    grid-column: auto;
  }

  .transactions-panel {
    padding: 15px;
  }

  .page-intro h2 {
    font-size: 19px;
  }
}
</style>
