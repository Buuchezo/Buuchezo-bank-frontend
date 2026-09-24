<template>
  
  <BankingShell
    page-title="Investments"
    page-section="BANKING"
  >
<div class="investments-page">
    <!-- =====================================================
         PAGE HEADER
    ====================================================== -->
    <header class="page-header">
      <div class="page-title">
        <div class="title-icon">
          <ChartCandlestick :size="20" />
        </div>

        <div>
          <span class="eyebrow">BUUCHEZO INVESTMENTS</span>
          <h1>Investments</h1>
          <p class="subtitle">
            Manage your investment account, monitor your portfolio and trade stocks.
          </p>
        </div>
      </div>

      <button :disabled="loading" class="refresh-button" type="button" @click="loadInvestmentData">
        <RefreshCw :class="{ spinning: loading }" :size="15" />
        <span>{{ loading ? 'Refreshing...' : 'Refresh' }}</span>
      </button>
    </header>

    <!-- =====================================================
         ALERTS
    ====================================================== -->

    <div v-if="errorMessage" class="alert error-alert">
      <div class="alert-icon">
        <XCircle :size="16" />
      </div>

      <span>{{ errorMessage }}</span>
    </div>

    <div v-if="successMessage" class="alert success-alert">
      <div class="alert-icon">
        <CheckCircle :size="16" />
      </div>

      <span>{{ successMessage }}</span>
    </div>

    <!-- =====================================================
         LOADING
    ====================================================== -->

    <div v-if="loading && !account" class="loading-state">
      <div class="spinner"></div>
      <strong>Loading investment account...</strong>
      <span>Fetching your portfolio securely.</span>
    </div>

    <!-- =====================================================
         NO INVESTMENT ACCOUNT
    ====================================================== -->

    <section v-else-if="!account" class="empty-state">
      <div class="empty-icon">
        <ChartCandlestick :size="30" />
      </div>

      <span class="empty-eyebrow">BUUCHEZO INVESTMENTS</span>

      <h2>Open your investment account</h2>

      <p>Start investing in stocks directly from your Buuchezo Bank account.</p>

      <form class="account-form" @submit.prevent="handleCreateAccount">
        <label for="bankAccountNumber"> Bank account number </label>

        <input
          id="bankAccountNumber"
          v-model="newAccountBankNumber"
          autocomplete="off"
          placeholder="Enter your bank account number"
          required
          type="text"
        />

        <button :disabled="actionLoading" class="primary-button" type="submit">
          {{ actionLoading ? 'Creating...' : 'Open Investment Account' }}
        </button>
      </form>
    </section>

    <!-- =====================================================
         INVESTMENT DASHBOARD
    ====================================================== -->

    <template v-else>
      <!-- ===================================================
           PORTFOLIO HERO
      ==================================================== -->

      <section class="portfolio-hero">
        <div class="portfolio-hero-content">
          <div>
            <span class="hero-label">TOTAL PORTFOLIO VALUE</span>

            <strong class="hero-value">
              {{ formatCurrency(portfolio?.totalValue ?? 0) }}
            </strong>

            <div
              :class="getProfitClass(portfolio?.unrealizedProfitLoss ?? 0)"
              class="hero-performance"
            >
              <TrendingUp v-if="(portfolio?.unrealizedProfitLoss ?? 0) >= 0" :size="15" />

              <TrendingDown v-else :size="15" />

              <span>
                {{ formatSignedCurrency(portfolio?.unrealizedProfitLoss ?? 0) }}
              </span>

              <span class="hero-performance-percent">
                {{ formatPercent(portfolio?.unrealizedProfitLossPercent ?? 0) }}
              </span>

              <span class="hero-performance-label"> unrealized </span>
            </div>
          </div>

          <div class="hero-icon">
            <ChartCandlestick :size="25" />
          </div>
        </div>

        <div class="portfolio-hero-footer">
          <span> Investment account #{{ account.id }} </span>

          <span class="hero-divider">•</span>

          <span>
            {{ account.bankAccountNumber }}
          </span>

          <span :class="getAccountStatusClass(account.status)" class="hero-status">
            <span class="status-dot"></span>
            {{ account.status }}
          </span>
        </div>
      </section>

      <!-- ===================================================
           SUMMARY CARDS
      ==================================================== -->

      <section class="summary-grid">
        <article class="summary-card">
          <div class="summary-icon blue">
            <WalletCards :size="17" />
          </div>

          <div class="summary-content">
            <span class="summary-label">Cash available</span>

            <strong>
              {{ formatCurrency(portfolio?.cashBalance ?? 0) }}
            </strong>

            <small>Available for trading</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon blue">
            <BarChart3 :size="17" />
          </div>

          <div class="summary-content">
            <span class="summary-label">Invested</span>

            <strong>
              {{ formatCurrency(portfolio?.totalInvested ?? 0) }}
            </strong>

            <small>Current cost basis</small>
          </div>
        </article>

        <article class="summary-card">
          <div class="summary-icon blue">
            <TrendingUp :size="17" />
          </div>

          <div class="summary-content">
            <span class="summary-label">Holdings value</span>

            <strong>
              {{ formatCurrency(portfolio?.holdingsValue ?? 0) }}
            </strong>

            <small>
              {{ portfolio?.holdings.length ?? 0 }} position{{
                (portfolio?.holdings.length ?? 0) === 1 ? '' : 's'
              }}
            </small>
          </div>
        </article>

        <article
          :class="getProfitClass(portfolio?.unrealizedProfitLoss ?? 0)"
          class="summary-card performance-card"
        >
          <div class="summary-icon">
            <TrendingUp v-if="(portfolio?.unrealizedProfitLoss ?? 0) >= 0" :size="17" />

            <TrendingDown v-else :size="17" />
          </div>

          <div class="summary-content">
            <span class="summary-label">Unrealized P/L</span>

            <strong>
              {{ formatSignedCurrency(portfolio?.unrealizedProfitLoss ?? 0) }}
            </strong>

            <small>
              {{ formatPercent(portfolio?.unrealizedProfitLossPercent ?? 0) }}
            </small>
          </div>
        </article>
      </section>

      <!-- ===================================================
           ACCOUNT
      ==================================================== -->

      <section class="panel account-panel">
        <div class="panel-header">
          <div>
            <span class="panel-eyebrow">ACCOUNT</span>
            <h2>Investment account</h2>
            <p>Your Buuchezo investment account details.</p>
          </div>

          <span :class="getAccountStatusClass(account.status)" class="status-badge">
            <span class="status-dot"></span>
            {{ account.status }}
          </span>
        </div>

        <div class="account-details">
          <div class="account-detail">
            <span>Bank account</span>
            <strong>{{ account.bankAccountNumber }}</strong>
          </div>

          <div class="account-detail">
            <span>Owner</span>
            <strong>{{ account.ownerEmail }}</strong>
          </div>

          <div class="account-detail">
            <span>Cash balance</span>
            <strong>{{ formatCurrency(account.cashBalance) }}</strong>
          </div>

          <div class="account-detail">
            <span>Opened</span>
            <strong>{{ formatDate(account.createdAt) }}</strong>
          </div>
        </div>
      </section>

      <!-- ===================================================
           ACTIONS
      ==================================================== -->

      <section class="action-grid">
        <!-- FUNDING -->

        <article class="panel action-card">
          <div class="panel-header">
            <div class="action-heading">
              <div class="action-heading-icon">
                <ArrowDownLeft :size="17" />
              </div>

              <div>
                <span class="panel-eyebrow">FUND ACCOUNT</span>
                <h2>Add investment cash</h2>
                <p>Fund your investment account.</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleFunding">
            <label for="fundAmount"> Amount </label>

            <div class="input-with-prefix">
              <span>€</span>

              <input
                id="fundAmount"
                v-model.number="fundAmount"
                min="0.01"
                placeholder="1000"
                required
                step="0.01"
                type="number"
              />
            </div>

            <button :disabled="actionLoading" class="primary-button full-width" type="submit">
              {{ actionLoading ? 'Processing...' : 'Add Cash' }}
            </button>
          </form>
        </article>

        <!-- TRADING -->

        <article class="panel action-card">
          <div class="panel-header">
            <div class="action-heading">
              <div class="action-heading-icon">
                <BarChart3 :size="17" />
              </div>

              <div>
                <span class="panel-eyebrow">MARKET TRADING</span>
                <h2>Trade</h2>
                <p>Buy or sell a stock.</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleBuy">
            <label for="tradeSymbol"> Symbol </label>

            <input
              id="tradeSymbol"
              v-model="tradeSymbol"
              autocomplete="off"
              maxlength="10"
              placeholder="AAPL"
              required
              type="text"
            />

            <label for="tradeQuantity"> Quantity </label>

            <input
              id="tradeQuantity"
              v-model.number="tradeQuantity"
              min="0.000001"
              placeholder="1"
              required
              step="0.000001"
              type="number"
            />

            <div class="trade-buttons">
              <button :disabled="actionLoading" class="buy-button" type="submit">
                <TrendingUp :size="15" />
                Buy
              </button>

              <button
                :disabled="actionLoading"
                class="sell-button"
                type="button"
                @click="handleSell"
              >
                <TrendingDown :size="15" />
                Sell
              </button>
            </div>
          </form>
        </article>
      </section>

      <!-- ===================================================
           HOLDINGS
      ==================================================== -->

      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="panel-eyebrow">PORTFOLIO</span>
            <h2>Portfolio holdings</h2>
            <p>Your current stock positions.</p>
          </div>

          <span class="count-badge">
            {{ portfolio?.holdings.length ?? 0 }}
          </span>
        </div>

        <div v-if="!portfolio?.holdings.length" class="table-empty">
          <div class="table-empty-icon">
            <BarChart3 :size="24" />
          </div>

          <h3>No holdings</h3>

          <p>You currently don't own any stocks.</p>
        </div>

        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Average price</th>
                <th>Current price</th>
                <th>Market value</th>
                <th>P/L</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="holding in portfolio.holdings" :key="holding.id">
                <td>
                  <div class="symbol-cell">
                    <div class="symbol-icon">
                      <BarChart3 :size="14" />
                    </div>

                    <strong>{{ holding.symbol }}</strong>
                  </div>
                </td>

                <td>
                  {{ formatNumber(holding.quantity) }}
                </td>

                <td>
                  {{ formatCurrency(holding.averagePrice) }}
                </td>

                <td>
                  {{ formatCurrency(holding.currentPrice) }}
                </td>

                <td>
                  <strong>
                    {{ formatCurrency(holding.marketValue) }}
                  </strong>
                </td>

                <td :class="getProfitClass(holding.profitLoss)" class="profit-cell">
                  <strong>
                    {{ formatSignedCurrency(holding.profitLoss) }}
                  </strong>

                  <small>
                    {{ formatPercent(holding.profitLossPercent) }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===================================================
           ORDERS
      ==================================================== -->

      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="panel-eyebrow">ACTIVITY</span>
            <h2>Order history</h2>
            <p>Your executed and rejected trades.</p>
          </div>

          <span class="count-badge">
            {{ orders.length }}
          </span>
        </div>

        <div v-if="!orders.length" class="table-empty">
          <div class="table-empty-icon">
            <ArrowLeftRight :size="24" />
          </div>

          <h3>No orders yet</h3>

          <p>Your investment orders will appear here.</p>
        </div>

        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Execution price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>
                  {{ order.executedAt ? formatDate(order.executedAt) : '-' }}
                </td>

                <td>
                  <span :class="order.type.toLowerCase()" class="order-type">
                    {{ order.type }}
                  </span>
                </td>

                <td>
                  <strong>{{ order.symbol }}</strong>
                </td>

                <td>
                  {{ formatNumber(order.quantity) }}
                </td>

                <td>
                  {{ formatCurrency(order.executionPrice) }}
                </td>

                <td>
                  <strong>
                    {{ formatCurrency(order.totalAmount) }}
                  </strong>
                </td>

                <td>
                  <span :class="getOrderStatusClass(order.status)" class="status-badge">
                    <span class="status-dot"></span>
                    {{ order.status }}
                  </span>

                  <small v-if="order.rejectionReason" class="rejection-reason">
                    {{ order.rejectionReason }}
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===================================================
           DANGER ZONE
      ==================================================== -->

      <section class="danger-zone">
        <div class="danger-content">
          <div class="danger-icon">
            <XCircle :size="17" />
          </div>

          <div>
            <span class="panel-eyebrow">ACCOUNT MANAGEMENT</span>

            <h2>Close investment account</h2>

            <p>Your account must have zero cash and no holdings before it can be closed.</p>
          </div>
        </div>

        <button
          :disabled="actionLoading"
          class="danger-button"
          type="button"
          @click="handleCloseAccount"
        >
          Close Account
        </button>
      </section>
    </template>
  </div>

  </BankingShell>
</template>

<script lang="ts" setup>
import BankingShell from '@/components/BankingShell.vue'

import { onMounted, ref } from 'vue'

import {
  ArrowDownLeft,
  ArrowLeftRight,
  BarChart3,
  ChartCandlestick,
  CheckCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  WalletCards,
  XCircle
} from 'lucide-vue-next'

import {
  buyStock,
  closeInvestmentAccount,
  createInvestmentAccount,
  fundInvestmentAccount,
  getInvestmentAccounts,
  getInvestmentOrders,
  getPortfolio,
  type InvestmentAccount,
  type InvestmentOrder,
  type Portfolio,
  sellStock
} from '@/service/investmentService'

const account = ref<InvestmentAccount | null>(null)
const portfolio = ref<Portfolio | null>(null)
const orders = ref<InvestmentOrder[]>([])

const loading = ref(false)
const actionLoading = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const newAccountBankNumber = ref('')
const fundAmount = ref<number | null>(null)

const tradeSymbol = ref('')
const tradeQuantity = ref<number | null>(null)

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

async function loadInvestmentData() {
  clearMessages()
  loading.value = true

  try {
    const accounts = await getInvestmentAccounts()

    account.value = accounts[0] ?? null

    if (!account.value) {
      portfolio.value = null
      orders.value = []
      return
    }

    const [portfolioData, ordersData] = await Promise.all([
      getPortfolio(account.value.id),
      getInvestmentOrders(account.value.id),
    ])

    portfolio.value = portfolioData
    orders.value = ordersData
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load investment data.'
  } finally {
    loading.value = false
  }
}

async function handleCreateAccount() {
  clearMessages()

  if (!newAccountBankNumber.value.trim()) {
    errorMessage.value = 'Please enter your bank account number.'
    return
  }

  actionLoading.value = true

  try {
    account.value = await createInvestmentAccount({
      bankAccountNumber: newAccountBankNumber.value.trim(),
    })

    newAccountBankNumber.value = ''

    await loadInvestmentData()

    successMessage.value = 'Investment account created successfully.'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to create investment account.'
  } finally {
    actionLoading.value = false
  }
}

async function handleFunding() {
  clearMessages()

  if (!account.value) {
    errorMessage.value = 'Investment account not found.'
    return
  }

  if (!fundAmount.value || fundAmount.value <= 0) {
    errorMessage.value = 'Enter a valid funding amount.'
    return
  }

  actionLoading.value = true

  try {
    await fundInvestmentAccount(account.value.id, {
      amount: fundAmount.value,
    })

    fundAmount.value = null

    await loadInvestmentData()

    successMessage.value = 'Investment account funded successfully.'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to fund investment account.'
  } finally {
    actionLoading.value = false
  }
}

async function handleBuy() {
  await executeTrade('BUY')
}

async function handleSell() {
  await executeTrade('SELL')
}

async function executeTrade(tradeType: 'BUY' | 'SELL') {
  clearMessages()

  if (!account.value) {
    errorMessage.value = 'Investment account not found.'
    return
  }

  const symbol = tradeSymbol.value.trim().toUpperCase()

  if (!symbol) {
    errorMessage.value = 'Enter a stock symbol.'
    return
  }

  if (!tradeQuantity.value || tradeQuantity.value <= 0) {
    errorMessage.value = 'Enter a valid quantity.'
    return
  }

  actionLoading.value = true

  try {
    const request = {
      symbol,
      quantity: tradeQuantity.value,
    }

    const order =
      tradeType === 'BUY'
        ? await buyStock(account.value.id, request)
        : await sellStock(account.value.id, request)

    tradeSymbol.value = ''
    tradeQuantity.value = null

    await loadInvestmentData()

    if (order.status === 'REJECTED') {
      errorMessage.value = order.rejectionReason || `${tradeType} order was rejected.`
    } else {
      successMessage.value = `${tradeType} order for ${symbol} executed successfully.`
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to execute trade.'
  } finally {
    actionLoading.value = false
  }
}

async function handleCloseAccount() {
  clearMessages()

  if (!account.value) {
    return
  }

  const confirmed = window.confirm(
    'Are you sure you want to close your investment account? This action cannot be undone.',
  )

  if (!confirmed) {
    return
  }

  actionLoading.value = true

  try {
    await closeInvestmentAccount(account.value.id)

    account.value = null
    portfolio.value = null
    orders.value = []

    successMessage.value = 'Investment account closed successfully.'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to close investment account.'
  } finally {
    actionLoading.value = false
  }
}

function getProfitClass(value: number): string {
  if (value > 0) {
    return 'positive'
  }

  if (value < 0) {
    return 'negative'
  }

  return ''
}

function getAccountStatusClass(status: InvestmentAccount['status']): string {
  return status.toLowerCase()
}

function getOrderStatusClass(status: InvestmentOrder['status']): string {
  return status.toLowerCase()
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function formatSignedCurrency(value: number): string {
  if (value > 0) {
    return `+${formatCurrency(value)}`
  }

  return formatCurrency(value)
}

function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''

  return `${sign}${value.toFixed(2)}%`
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 6,
  }).format(value)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

onMounted(() => {
  loadInvestmentData()
})
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */

.investments-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 45px 70px;
  box-sizing: border-box;

  color: #29465a;
  background: #f5f8fb;
}

/* =========================================================
   HEADER
========================================================= */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 25px;
  margin-bottom: 30px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: white;
  background: #0b4878;

  border-radius: 9px;
  box-shadow: 0 8px 20px rgba(8, 47, 86, 0.12);
}

.eyebrow {
  display: block;

  margin-bottom: 5px;

  color: #a0adb6;

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.page-header h1 {
  margin: 0;

  color: #082f56;

  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.subtitle {
  margin: 7px 0 0;

  color: #8998a3;

  font-size: 10px;
}

/* =========================================================
   BUTTONS
========================================================= */

.refresh-button,
.primary-button,
.buy-button,
.sell-button,
.danger-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  border: 0;
  border-radius: 7px;

  padding: 11px 16px;

  font-family: inherit;
  font-size: 10px;
  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.refresh-button:hover,
.primary-button:hover,
.buy-button:hover,
.sell-button:hover,
.danger-button:hover {
  transform: translateY(-1px);
}

.refresh-button:disabled,
.primary-button:disabled,
.buy-button:disabled,
.sell-button:disabled,
.danger-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.refresh-button {
  color: #526a7a;
  background: #edf3f7;
}

.refresh-button:hover {
  color: #0b4878;
  background: #e5eff5;
}

.primary-button {
  color: white;
  background: #0b4878;

  box-shadow: 0 7px 18px rgba(11, 72, 120, 0.15);
}

.primary-button:hover {
  background: #0b5da7;
}

.full-width {
  width: 100%;
}

.buy-button {
  color: white;
  background: #27825f;
}

.buy-button:hover {
  background: #237453;
}

.sell-button {
  color: white;
  background: #0b4878;
}

.sell-button:hover {
  background: #0b5da7;
}

/* =========================================================
   ALERTS
========================================================= */

.alert {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 18px;
  padding: 12px 15px;

  border-radius: 8px;

  font-size: 10px;
  font-weight: 700;
}

.alert-icon {
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 6px;
}

.error-alert {
  color: #7b2d2d;
  background: #fff3f3;
  border: 1px solid #f1d3d3;
}

.error-alert .alert-icon {
  color: #9b3d3d;
  background: #fbe3e3;
}

.success-alert {
  color: #277051;
  background: #f0faf5;
  border: 1px solid #d4eee1;
}

.success-alert .alert-icon {
  color: #27825f;
  background: #e1f4ea;
}

/* =========================================================
   PORTFOLIO HERO
========================================================= */

.portfolio-hero {
  padding: 25px;

  color: white;

  background: linear-gradient(135deg, #063d74, #07559b 55%, #143fbd);

  border-radius: 12px;

  box-shadow: 0 15px 30px rgba(8, 47, 86, 0.13);

  margin-bottom: 15px;
}

.portfolio-hero-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.hero-label {
  display: block;

  color: rgba(255, 255, 255, 0.58);

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.hero-value {
  display: block;

  margin-top: 9px;

  font-size: 32px;
  line-height: 1;

  letter-spacing: -0.04em;
}

.hero-performance {
  display: flex;
  align-items: center;
  gap: 5px;

  margin-top: 11px;

  font-size: 10px;
  font-weight: 800;
}

.hero-performance.positive {
  color: #b9efd2;
}

.hero-performance.negative {
  color: #ffd0d0;
}

.hero-performance-percent {
  padding-left: 3px;
}

.hero-performance-label {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.hero-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background: rgba(255, 255, 255, 0.12);

  border-radius: 8px;
}

.portfolio-hero-footer {
  display: flex;
  align-items: center;
  gap: 9px;

  padding-top: 18px;
  margin-top: 23px;

  border-top: 1px solid rgba(255, 255, 255, 0.14);

  color: rgba(255, 255, 255, 0.58);

  font-size: 8px;
}

.hero-divider {
  color: rgba(255, 255, 255, 0.28);
}

.hero-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  margin-left: auto;

  color: rgba(255, 255, 255, 0.8);

  font-weight: 700;
}

/* =========================================================
   STATUS DOT
========================================================= */

.status-dot {
  width: 6px;
  height: 6px;

  display: inline-block;

  border-radius: 50%;
}

.active .status-dot,
.executed .status-dot {
  background: #4fc58a;
}

.frozen .status-dot {
  background: #e2b64d;
}

.closed .status-dot,
.rejected .status-dot {
  background: #e07171;
}

/* =========================================================
   SUMMARY
========================================================= */

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 15px;

  margin-bottom: 15px;
}

.summary-card {
  min-height: 125px;

  padding: 20px;

  display: flex;
  align-items: flex-start;
  gap: 12px;

  background: white;

  border: 1px solid #e1e9ee;
  border-radius: 12px;

  box-sizing: border-box;
}

.summary-icon {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 7px;
}

.summary-icon.blue {
  color: #0b4878;
  background: #edf6fb;
}

.summary-card.positive {
  border-color: #d7ece1;
}

.summary-card.positive .summary-icon {
  color: #27825f;
  background: #eaf7f1;
}

.summary-card.negative {
  border-color: #eed8d8;
}

.summary-card.negative .summary-icon {
  color: #9d4d4d;
  background: #fbeeee;
}

.summary-content {
  min-width: 0;
}

.summary-label {
  display: block;

  color: #94a1ab;

  font-size: 9px;
}

.summary-card strong {
  display: block;

  margin-top: 8px;

  color: #29465a;

  font-size: 18px;
  letter-spacing: -0.03em;
}

.summary-card.positive strong {
  color: #27825f;
}

.summary-card.negative strong {
  color: #a14c4c;
}

.summary-card small {
  display: block;

  margin-top: 6px;

  color: #a2adb5;

  font-size: 8px;
}

/* =========================================================
   PANELS
========================================================= */

.panel {
  min-width: 0;

  padding: 24px;

  margin-bottom: 15px;

  background: white;

  border: 1px solid #e1e9ee;
  border-radius: 12px;

  box-sizing: border-box;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 16px;

  margin-bottom: 22px;
}

.panel-eyebrow {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.panel-header h2 {
  margin: 0;

  color: #082f56;

  font-size: 17px;
  letter-spacing: -0.02em;
}

.panel-header p {
  margin: 5px 0 0;

  color: #9aa7b1;

  font-size: 9px;
}

/* =========================================================
   ACCOUNT
========================================================= */

.account-details {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 20px;

  padding-top: 3px;
}

.account-detail span {
  display: block;

  margin-bottom: 6px;

  color: #94a1ab;

  font-size: 8px;
}

.account-detail strong {
  display: block;

  color: #415a6b;

  font-size: 10px;

  word-break: break-word;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;

  border-radius: 999px;

  font-size: 8px;
  font-weight: 800;
}

.status-badge.active,
.status-badge.executed {
  color: #277051;
  background: #eaf7f1;
}

.status-badge.frozen {
  color: #8c6b24;
  background: #fbf4df;
}

.status-badge.closed,
.status-badge.rejected {
  color: #974848;
  background: #fbeeee;
}

/* =========================================================
   ACTIONS
========================================================= */

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 15px;
}

.action-card {
  margin-bottom: 0;
}

.action-heading {
  display: flex;
  align-items: flex-start;

  gap: 11px;
}

.action-heading-icon {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #0b4878;
  background: #edf6fb;

  border-radius: 7px;
}

.action-card form {
  display: flex;
  flex-direction: column;

  gap: 9px;
}

.action-card label,
.account-form label {
  color: #425b6c;

  font-size: 9px;
  font-weight: 700;
}

.action-card input,
.account-form input {
  width: 100%;

  box-sizing: border-box;

  border: 1px solid #dbe4ea;
  border-radius: 7px;

  padding: 11px 12px;

  color: #314b5f;
  background: white;

  font-family: inherit;
  font-size: 10px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.action-card input::placeholder,
.account-form input::placeholder {
  color: #a7b1b8;
}

.action-card input:focus,
.account-form input:focus {
  border-color: #0b5da7;

  box-shadow: 0 0 0 3px rgba(11, 93, 167, 0.08);
}

.input-with-prefix {
  display: flex;
  align-items: center;

  overflow: hidden;

  border: 1px solid #dbe4ea;
  border-radius: 7px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-with-prefix:focus-within {
  border-color: #0b5da7;

  box-shadow: 0 0 0 3px rgba(11, 93, 167, 0.08);
}

.input-with-prefix span {
  padding-left: 12px;

  color: #7d8d99;

  font-size: 10px;
  font-weight: 800;
}

.input-with-prefix input {
  border: 0;
  box-shadow: none;
}

.input-with-prefix input:focus {
  box-shadow: none;
}

.trade-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 9px;

  margin-top: 5px;
}

/* =========================================================
   TABLES
========================================================= */

.table-wrapper {
  width: 100%;

  overflow-x: auto;
}

table {
  width: 100%;

  min-width: 800px;

  border-collapse: collapse;
}

th,
td {
  padding: 13px 10px;

  text-align: left;

  border-bottom: 1px solid #edf1f4;

  white-space: nowrap;
}

th {
  color: #9aa7b1;

  font-size: 7px;
  font-weight: 800;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

td {
  color: #506777;

  font-size: 9px;
}

tbody tr {
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: #f8fafc;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.symbol-cell {
  display: flex;
  align-items: center;

  gap: 9px;
}

.symbol-icon {
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;
  background: #edf6fb;

  border-radius: 6px;
}

.symbol-cell strong {
  color: #29465a;

  font-size: 10px;
}

.profit-cell strong {
  display: block;
}

.profit-cell small {
  display: block;

  margin-top: 3px;

  font-size: 8px;
}

.positive {
  color: #27825f;
}

.negative {
  color: #a14c4c;
}

.order-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 43px;

  padding: 5px 8px;

  border-radius: 5px;

  font-size: 7px;
  font-weight: 800;
}

.order-type.buy {
  color: #277051;
  background: #eaf7f1;
}

.order-type.sell {
  color: #974848;
  background: #fbeeee;
}

.rejection-reason {
  display: block;

  max-width: 220px;

  margin-top: 4px;

  color: #a14c4c;

  white-space: normal;
  font-size: 8px;
}

/* =========================================================
   EMPTY TABLE
========================================================= */

.table-empty {
  padding: 45px 20px;

  text-align: center;
}

.table-empty-icon {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 12px;

  color: #0b4878;
  background: #edf6fb;

  border-radius: 9px;
}

.table-empty h3 {
  margin: 0;

  color: #425b6c;

  font-size: 12px;
}

.table-empty p {
  margin: 6px 0 0;

  color: #9aa7b1;

  font-size: 9px;
}

/* =========================================================
   EMPTY ACCOUNT
========================================================= */

.empty-state {
  max-width: 600px;

  margin: 75px auto;

  padding: 42px;

  text-align: center;

  background: white;

  border: 1px solid #e1e9ee;
  border-radius: 12px;

  box-shadow: 0 15px 35px rgba(8, 47, 86, 0.06);
}

.empty-icon {
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 17px;

  color: white;
  background: linear-gradient(135deg, #063d74, #07559b);

  border-radius: 12px;

  box-shadow: 0 12px 25px rgba(8, 47, 86, 0.14);
}

.empty-eyebrow {
  display: block;

  margin-bottom: 7px;

  color: #9aa7b1;

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.empty-state h2 {
  margin: 0;

  color: #082f56;

  font-size: 22px;
  letter-spacing: -0.03em;
}

.empty-state > p {
  max-width: 420px;

  margin: 9px auto 25px;

  color: #8998a3;

  font-size: 10px;
  line-height: 1.6;
}

.account-form {
  display: flex;
  flex-direction: column;

  gap: 9px;

  text-align: left;
}

/* =========================================================
   LOADING
========================================================= */

.loading-state {
  min-height: 360px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #8998a3;
}

.loading-state strong {
  margin-top: 2px;

  color: #425b6c;

  font-size: 11px;
}

.loading-state span {
  margin-top: 5px;

  font-size: 9px;
}

.spinner {
  width: 27px;
  height: 27px;

  margin-bottom: 13px;

  border: 3px solid #e5edf2;
  border-top-color: #0b4878;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

/* =========================================================
   DANGER ZONE
========================================================= */

.danger-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 20px;

  background: #fffafa;

  border: 1px solid #efdcdc;
  border-radius: 12px;
}

.danger-content {
  display: flex;
  align-items: flex-start;

  gap: 11px;
}

.danger-icon {
  width: 33px;
  height: 33px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #9d4d4d;
  background: #fbeeee;

  border-radius: 7px;
}

.danger-zone h2 {
  margin: 0;

  color: #6f3f3f;

  font-size: 13px;
}

.danger-zone p {
  margin: 5px 0 0;

  color: #9b7c7c;

  font-size: 9px;
}

.danger-button {
  flex-shrink: 0;

  color: white;
  background: #a14c4c;
}

.danger-button:hover {
  background: #8d4141;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .investments-page {
    padding-left: 30px;
    padding-right: 30px;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .account-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 850px) {
  .investments-page {
    padding: 30px;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .investments-page {
    padding: 25px 16px 50px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .account-details {
    grid-template-columns: 1fr;
  }

  .portfolio-hero {
    padding: 20px;
  }

  .hero-value {
    font-size: 27px;
  }

  .portfolio-hero-footer {
    flex-wrap: wrap;
  }

  .hero-status {
    width: 100%;
    margin-left: 0;
    margin-top: 4px;
  }

  .danger-zone {
    align-items: flex-start;
    flex-direction: column;
  }

  .danger-button {
    width: 100%;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
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
