<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  RefreshCw,
  WalletCards,
} from 'lucide-vue-next'

import BankingShell from '@/components/BankingShell.vue'

import {
  getMyBusinesses,
  getBusinessAccounts,
  getBusinessTransactions,
  type Business,
  type BusinessAccount,
  type BusinessTransaction,
} from '../../service/businessService.ts'

interface User {
  firstName?: string
  lastName?: string
  email?: string
}

const currentUser = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
})

const business = ref<Business | null>(null)
const accounts = ref<BusinessAccount[]>([])
const transactions = ref<BusinessTransaction[]>([])

const selectedAccountNumber = ref('')

const loading = ref(true)
const transactionsLoading = ref(false)
const errorMessage = ref('')
const transactionsError = ref('')

const pageUser = computed(() => currentUser.value)

const businessName = computed(() => {
  return business.value?.tradingName || business.value?.legalName || 'Business Banking'
})

const selectedAccount = computed(() => {
  return (
    accounts.value.find((account) => account.accountNumber === selectedAccountNumber.value) || null
  )
})

const accountBalance = computed(() => {
  if (!selectedAccount.value) {
    return 0
  }

  return selectedAccount.value.balance
})

const accountCurrency = computed(() => {
  return selectedAccount.value?.currency || 'EUR'
})

function loadStoredUser() {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

  if (!storedUser) {
    return
  }

  try {
    currentUser.value = JSON.parse(storedUser) as User
  } catch {
    currentUser.value = {
      firstName: '',
      lastName: '',
      email: '',
    }
  }
}

async function loadTransactions() {
  if (!selectedAccountNumber.value) {
    transactions.value = []
    return
  }

  transactionsLoading.value = true
  transactionsError.value = ''

  try {
    transactions.value = await getBusinessTransactions(selectedAccountNumber.value)
  } catch (error) {
    console.error('Failed to load business transactions:', error)

    transactionsError.value =
      error instanceof Error ? error.message : 'Unable to load business transactions.'

    transactions.value = []
  } finally {
    transactionsLoading.value = false
  }
}

async function handleAccountChange() {
  await loadTransactions()
}

async function loadPage() {
  loading.value = true
  errorMessage.value = ''

  try {
    const businesses = await getMyBusinesses()

    if (businesses.length === 0) {
      throw new Error('No business is associated with your account.')
    }

    const selectedBusiness = businesses[0]

    if (!selectedBusiness) {
      throw new Error('No business is associated with your account.')
    }

    business.value = selectedBusiness

    accounts.value = await getBusinessAccounts(selectedBusiness.id)

    if (accounts.value.length > 0) {
      selectedAccountNumber.value = accounts.value[0]?.accountNumber || ''

      await loadTransactions()
    }
  } catch (error) {
    console.error('Failed to load business transactions page:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load business transactions.'
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}

function formatTransactionDate(createdAt: string) {
  if (!createdAt) {
    return '—'
  }

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getTransactionLabel(transaction: BusinessTransaction) {
  if (transaction.transactionType === 'TRANSFER') {
    return transaction.transactionDirection === 'CREDIT' ? 'Incoming transfer' : 'Outgoing transfer'
  }

  if (transaction.transactionType === 'DEPOSIT') {
    return 'Deposit'
  }

  if (transaction.transactionType === 'WITHDRAWAL') {
    return 'Withdrawal'
  }

  if (transaction.transactionType === 'PAYMENT') {
    return 'Payment'
  }

  return transaction.transactionType
}

function getTransactionDescription(transaction: BusinessTransaction) {
  if (transaction.description?.trim()) {
    return transaction.description
  }

  if (transaction.transactionType === 'TRANSFER') {
    return transaction.transactionDirection === 'CREDIT'
      ? `From ${transaction.fromAccountNumber}`
      : `To ${transaction.toAccountNumber}`
  }

  return transaction.reference || 'Business transaction'
}

function getTransactionIcon(transaction: BusinessTransaction) {
  if (transaction.transactionDirection === 'CREDIT') {
    return ArrowDownLeft
  }

  if (transaction.transactionType === 'TRANSFER') {
    return ArrowUpRight
  }

  return ArrowLeftRight
}

onMounted(() => {
  loadStoredUser()
  loadPage()
})
</script>

<template>
  <BankingShell page-title="Business Transactions" page-section="BUSINESS" :user="pageUser">
    <main class="business-transactions-page">
      <section class="page-header">
        <div>
          <p class="eyebrow">BUSINESS BANKING</p>

          <h1>
            {{ businessName }}
          </h1>

          <p class="subtitle">View and review transactions across your business accounts.</p>
        </div>

        <RouterLink to="/business/dashboard" class="back-link">
          Back to business dashboard
        </RouterLink>
      </section>

      <!-- LOADING -->
      <section v-if="loading" class="state-card">
        <div class="spinner" />

        <strong> Loading business transactions... </strong>
      </section>

      <!-- ERROR -->
      <section v-else-if="errorMessage" class="state-card error-card">
        <strong> Unable to load business transactions </strong>

        <span>
          {{ errorMessage }}
        </span>

        <button type="button" class="primary-button" @click="loadPage">
          <RefreshCw :size="17" />
          Try again
        </button>
      </section>

      <template v-else>
        <!-- ACCOUNT SELECTOR -->
        <section class="account-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">BUSINESS ACCOUNT</p>

              <h2>Select an account</h2>
            </div>
          </div>

          <div v-if="accounts.length === 0" class="state-card">
            <WalletCards :size="32" />

            <strong> No business accounts found </strong>

            <span> There are currently no accounts associated with this business. </span>
          </div>

          <div v-else class="account-selector-wrapper">
            <select
              v-model="selectedAccountNumber"
              class="account-select"
              @change="handleAccountChange"
            >
              <option
                v-for="account in accounts"
                :key="account.accountNumber"
                :value="account.accountNumber"
              >
                {{ account.accountType }}
                ·
                {{ account.accountNumber }}
                ·
                {{ formatCurrency(account.balance, account.currency) }}
              </option>
            </select>
          </div>
        </section>

        <!-- ACCOUNT SUMMARY -->
        <section v-if="selectedAccount" class="summary-grid">
          <article class="summary-card">
            <div class="summary-icon">
              <WalletCards :size="21" />
            </div>

            <div>
              <span> Available balance </span>

              <strong>
                {{ formatCurrency(accountBalance, accountCurrency) }}
              </strong>
            </div>
          </article>

          <article class="summary-card">
            <div class="summary-icon">
              <ArrowLeftRight :size="21" />
            </div>

            <div>
              <span> Transactions </span>

              <strong>
                {{ transactions.length }}
              </strong>
            </div>
          </article>

          <article class="summary-card">
            <div class="summary-icon">
              <WalletCards :size="21" />
            </div>

            <div>
              <span> Account </span>

              <strong class="account-number">
                {{ selectedAccount.accountNumber }}
              </strong>
            </div>
          </article>
        </section>

        <!-- TRANSACTIONS -->
        <section class="transactions-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">ACTIVITY</p>

              <h2>Transaction history</h2>
            </div>

            <button
              type="button"
              class="refresh-button"
              :disabled="transactionsLoading"
              @click="loadTransactions"
            >
              <RefreshCw
                :size="17"
                :class="{
                  spinning: transactionsLoading,
                }"
              />

              Refresh
            </button>
          </div>

          <!-- TRANSACTION LOADING -->
          <div v-if="transactionsLoading" class="state-card">
            <div class="spinner" />

            <strong> Loading transactions... </strong>
          </div>

          <!-- TRANSACTION ERROR -->
          <div v-else-if="transactionsError" class="state-card error-card">
            <strong> Unable to load transactions </strong>

            <span>
              {{ transactionsError }}
            </span>

            <button type="button" class="primary-button" @click="loadTransactions">
              Try again
            </button>
          </div>

          <!-- EMPTY -->
          <div v-else-if="transactions.length === 0" class="state-card">
            <ArrowLeftRight :size="32" />

            <strong> No transactions yet </strong>

            <span> Transaction activity for this business account will appear here. </span>
          </div>

          <!-- TRANSACTION TABLE -->
          <div v-else class="transactions-card">
            <div class="table-header">
              <span>TRANSACTION</span>
              <span>REFERENCE</span>
              <span>STATUS</span>
              <span>DATE</span>
              <span class="amount-column"> AMOUNT </span>
            </div>

            <div v-for="transaction in transactions" :key="transaction.id" class="transaction-row">
              <div class="transaction-main">
                <div
                  class="transaction-icon"
                  :class="{
                    credit: transaction.transactionDirection === 'CREDIT',
                    debit: transaction.transactionDirection === 'DEBIT',
                  }"
                >
                  <component :is="getTransactionIcon(transaction)" :size="18" />
                </div>

                <div>
                  <strong>
                    {{ getTransactionLabel(transaction) }}
                  </strong>

                  <span>
                    {{ getTransactionDescription(transaction) }}
                  </span>
                </div>
              </div>

              <span class="reference">
                {{ transaction.reference || '—' }}
              </span>

              <span class="status" :class="transaction.transactionStatus?.toLowerCase()">
                {{ transaction.transactionStatus || '—' }}
              </span>

              <span class="date">
                {{ formatTransactionDate(transaction.createdAt) }}
              </span>

              <strong
                class="amount"
                :class="{
                  credit: transaction.transactionDirection === 'CREDIT',
                  debit: transaction.transactionDirection === 'DEBIT',
                }"
              >
                {{ transaction.transactionDirection === 'CREDIT' ? '+' : '−'
                }}{{
                  formatCurrency(
                    Math.abs(Number(transaction.amount)),
                    transaction.currency || accountCurrency,
                  )
                }}
              </strong>
            </div>
          </div>
        </section>
      </template>
    </main>
  </BankingShell>
</template>

<style scoped>
.business-transactions-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 5% 100px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 35px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #0b4878;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.page-header h1 {
  margin: 0;
  color: #102a43;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.1;
}

.subtitle {
  margin: 12px 0 0;
  color: #6b7c93;
  font-size: 15px;
}

.back-link {
  color: #0b4878;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.back-link:hover {
  text-decoration: underline;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 0;
  color: #102a43;
  font-size: 23px;
}

.account-section,
.transactions-section {
  margin-top: 30px;
}

.account-selector-wrapper {
  width: 100%;
  max-width: 560px;
}

.account-select {
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid #d9e2ec;
  border-radius: 12px;
  background: #ffffff;
  color: #102a43;
  font-size: 15px;
  font-weight: 600;
  outline: none;
}

.account-select:focus {
  border-color: #0b4878;
  box-shadow: 0 0 0 3px rgba(11, 72, 120, 0.1);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 25px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border: 1px solid #e5edf4;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 25px rgba(16, 42, 67, 0.05);
}

.summary-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: #edf5fb;
  color: #0b4878;
}

.summary-card span {
  display: block;
  margin-bottom: 5px;
  color: #829ab1;
  font-size: 12px;
}

.summary-card strong {
  display: block;
  color: #102a43;
  font-size: 20px;
}

.summary-card .account-number {
  font-size: 15px;
  letter-spacing: 0.04em;
}

.transactions-card {
  overflow: hidden;
  border: 1px solid #e5edf4;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 25px rgba(16, 42, 67, 0.05);
}

.table-header,
.transaction-row {
  display: grid;
  grid-template-columns: minmax(250px, 1.6fr) minmax(130px, 0.8fr) 110px minmax(150px, 1fr) 130px;
  gap: 20px;
  align-items: center;
}

.table-header {
  padding: 15px 22px;
  border-bottom: 1px solid #e9eff5;
  background: #f8fafc;
  color: #829ab1;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.transaction-row {
  min-height: 82px;
  padding: 16px 22px;
  border-bottom: 1px solid #edf2f7;
}

.transaction-row:last-child {
  border-bottom: none;
}

.transaction-main {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.transaction-main > div:last-child {
  min-width: 0;
}

.transaction-main strong {
  display: block;
  overflow: hidden;
  color: #102a43;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-main span {
  display: block;
  overflow: hidden;
  margin-top: 4px;
  color: #829ab1;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
}

.transaction-icon.credit {
  background: #eaf8f0;
  color: #16834b;
}

.transaction-icon.debit {
  background: #fff1f1;
  color: #c0392b;
}

.reference,
.date {
  overflow: hidden;
  color: #52667a;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  display: inline-flex;
  width: fit-content;
  padding: 5px 9px;
  border-radius: 999px;
  background: #edf2f7;
  color: #52667a;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.status.completed,
.status.success,
.status.successful {
  background: #eaf8f0;
  color: #16834b;
}

.status.pending {
  background: #fff7e6;
  color: #a15c00;
}

.status.failed,
.status.rejected,
.status.cancelled {
  background: #fff1f1;
  color: #c0392b;
}

.amount {
  text-align: right;
  font-size: 14px;
}

.amount.credit {
  color: #16834b;
}

.amount.debit {
  color: #c0392b;
}

.amount-column {
  text-align: right;
}

.state-card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px;
  border: 1px solid #e5edf4;
  border-radius: 16px;
  background: #ffffff;
  color: #829ab1;
  text-align: center;
}

.state-card strong {
  color: #102a43;
  font-size: 15px;
}

.state-card span {
  max-width: 500px;
  font-size: 13px;
}

.error-card {
  border-color: #f0d5d5;
  background: #fffafa;
}

.primary-button,
.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 15px;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}

.primary-button {
  margin-top: 8px;
  background: #0b4878;
  color: #ffffff;
}

.refresh-button {
  border: 1px solid #d9e2ec;
  background: #ffffff;
  color: #0b4878;
}

.refresh-button:hover {
  background: #f5f9fc;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #d9e2ec;
  border-top-color: #0b4878;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1000px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    display: none;
  }

  .transaction-row {
    grid-template-columns: 1fr auto;
    gap: 10px 20px;
    padding: 18px;
  }

  .transaction-main {
    grid-column: 1 / -1;
  }

  .reference,
  .status,
  .date {
    grid-column: 1;
  }

  .amount {
    grid-column: 2;
    grid-row: 2 / span 3;
  }
}

@media (max-width: 650px) {
  .business-transactions-page {
    padding: 25px 18px 70px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .back-link {
    white-space: normal;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }

  .account-select {
    font-size: 14px;
  }

  .transaction-row {
    grid-template-columns: 1fr;
  }

  .amount {
    grid-column: 1;
    grid-row: auto;
    text-align: left;
  }
}
</style>
