<template>
  
  <BankingShell
    page-title="Market Data"
    page-section="BANKING"
  >
<div class="market-page">
    <!-- Mobile overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside :class="{ 'sidebar-open': mobileMenuOpen }" class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-mark">
          <span>B</span>
        </div>

        <div class="brand-name">
          <strong>Buuchezo</strong>
          <span>Bank</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-label">MAIN</div>

          <router-link class="nav-item" to="/dashboard">
            <LayoutDashboard :size="19" />
            <span>Dashboard</span>
          </router-link>

          <router-link class="nav-item" to="/accounts">
            <Wallet :size="19" />
            <span>Accounts</span>
          </router-link>

          <router-link class="nav-item" to="/transfers">
            <ArrowLeftRight :size="19" />
            <span>Transfers</span>
          </router-link>

          <router-link class="nav-item" to="/transactions">
            <ReceiptText :size="19" />
            <span>Transactions</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-label">SERVICES</div>

          <router-link class="nav-item" to="/cards">
            <CreditCard :size="19" />
            <span>Cards</span>
          </router-link>

          <router-link class="nav-item" to="/investments">
            <BarChart3 :size="19" />
            <span>Investments</span>
          </router-link>

          <router-link class="nav-item active" to="/market">
            <TrendingUp :size="19" />
            <span>Market Data</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-label">ACCOUNT</div>

          <router-link class="nav-item" to="/settings">
            <Settings :size="19" />
            <span>Settings</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="support-card">
          <div class="support-icon">
            <Headphones :size="18" />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>Contact support</span>
          </div>
        </div>

        <button class="logout-button" @click="logout">
          <LogOut :size="18" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-menu-button" @click="mobileMenuOpen = !mobileMenuOpen">
            <Menu :size="23" />
          </button>

          <div>
            <h1>Market Data</h1>
            <p>Explore markets and track stock performance</p>
          </div>
        </div>

        <div class="header-right">
          <NotificationDropdown />

          <div class="profile">
            <div class="profile-avatar">
              {{ userInitial }}
            </div>

            <div class="profile-details">
              <strong>{{ userName }}</strong>
              <span>{{ userEmail }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <div class="page-content">
        <!-- Search -->
        <section class="market-search">
          <div class="search-icon">
            <Search :size="20" />
          </div>

          <input
            v-model="searchQuery"
            placeholder="Search for a stock, company or symbol..."
            type="text"
            @keyup.enter="performSearch"
          />

          <button
            :disabled="searching || !searchQuery.trim()"
            class="search-button"
            @click="performSearch"
          >
            <Loader2 v-if="searching" :size="17" class="spin" />
            <span v-else>Search</span>
          </button>
        </section>

        <!-- Search results -->
        <div v-if="searchPerformed" class="search-results">
          <div class="search-results-header">
            <div>
              <span class="eyebrow">SEARCH</span>
              <h3>Search results</h3>
            </div>

            <button @click="clearSearch">
              <X :size="16" />
            </button>
          </div>

          <div v-if="searchResults.length" class="results-list">
            <button
              v-for="result in searchResults"
              :key="`${result.symbol}-${result.displaySymbol}`"
              class="result-row"
              @click="selectSearchResult(result)"
            >
              <div class="result-symbol">
                {{ result.displaySymbol || result.symbol }}
              </div>

              <div class="result-information">
                <strong>{{ result.description }}</strong>

                <span>
                  {{ result.type || 'Stock' }}
                  <template v-if="result.symbol"> · {{ result.symbol }} </template>
                </span>
              </div>

              <ChevronRight :size="18" />
            </button>
          </div>

          <div v-else-if="!searching" class="no-results">
            <SearchX :size="22" />
            <div>
              <strong>No results found</strong>
              <span> Try searching with another company name or symbol. </span>
            </div>
          </div>
        </div>

        <!-- Global error -->
        <div v-if="errorMessage" class="error-message">
          <AlertCircle :size="19" />

          <span>{{ errorMessage }}</span>

          <button @click="loadFeaturedStocks">Try again</button>
        </div>

        <!-- Market overview -->
        <section class="section">
          <div class="section-header">
            <div>
              <span class="eyebrow">MARKETS</span>

              <h2>Market Overview</h2>

              <p>Popular stocks and their latest market prices</p>
            </div>

            <button :disabled="loadingFeatured" class="outline-button" @click="loadFeaturedStocks">
              <RefreshCw :class="{ spin: loadingFeatured }" :size="16" />
              Refresh
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loadingFeatured" class="stocks-grid">
            <div v-for="index in 8" :key="index" class="stock-card skeleton-card">
              <div class="skeleton skeleton-small"></div>
              <div class="skeleton skeleton-name"></div>
              <div class="skeleton skeleton-price"></div>
              <div class="skeleton skeleton-line"></div>
            </div>
          </div>

          <!-- Stocks -->
          <div v-else-if="featuredStocks.length" class="stocks-grid">
            <button
              v-for="stock in featuredStocks"
              :key="stock.symbol"
              :class="{
                selected: selectedSymbol === stock.symbol,
              }"
              class="stock-card"
              @click="selectStock(stock.symbol)"
            >
              <div class="stock-top">
                <div class="stock-identity">
                  <div class="stock-logo">
                    {{ stock.symbol.charAt(0) }}
                  </div>

                  <div>
                    <strong>{{ stock.symbol }}</strong>
                    <span>{{ stock.name }}</span>
                  </div>
                </div>

                <div :class="getChangeClass(stock.quote.change)" class="change-badge">
                  <TrendingUp v-if="stock.quote.change >= 0" :size="12" />

                  <TrendingDown v-else :size="12" />

                  {{ formatPercent(stock.quote.percentChange) }}
                </div>
              </div>

              <div class="stock-price">
                {{ formatCurrency(stock.quote.currentPrice) }}
              </div>

              <div class="stock-bottom">
                <span>Today</span>

                <strong :class="getTextChangeClass(stock.quote.change)">
                  {{ formatChange(stock.quote.change) }}
                </strong>

                <ChevronRight :size="16" />
              </div>
            </button>
          </div>

          <!-- Empty -->
          <div v-else class="empty-state">
            <div class="empty-icon">
              <TrendingUp :size="27" />
            </div>

            <h3>No market data available</h3>

            <p>We couldn't retrieve the featured markets right now.</p>

            <button class="primary-button" @click="loadFeaturedStocks">Try again</button>
          </div>
        </section>

        <!-- Selected stock -->
        <section v-if="selectedSymbol" class="stock-detail-section">
          <!-- Detail header -->
          <div class="detail-header">
            <div class="detail-company">
              <div class="company-symbol">
                {{ selectedSymbol.charAt(0) }}
              </div>

              <div>
                <span class="eyebrow">
                  {{ selectedProfile?.exchange || 'MARKET DATA' }}
                </span>

                <h2>
                  {{ selectedProfile?.name || selectedSymbol }}
                </h2>

                <p>
                  {{ selectedSymbol }}
                  <template v-if="selectedProfile?.industry">
                    · {{ selectedProfile.industry }}
                  </template>
                </p>
              </div>
            </div>

            <button
              :disabled="loadingDetails"
              class="outline-button"
              @click="loadStockDetails(selectedSymbol)"
            >
              <RefreshCw :class="{ spin: loadingDetails }" :size="16" />
              Refresh
            </button>
          </div>

          <!-- Detail loading -->
          <div v-if="loadingDetails" class="detail-loading">
            <Loader2 :size="28" class="spin" />
            <span>Loading market information...</span>
          </div>

          <template v-else>
            <!-- Quote hero -->
            <div v-if="selectedQuote" class="quote-card">
              <div class="quote-main">
                <span class="eyebrow">CURRENT PRICE</span>

                <div class="quote-price">
                  {{ formatCurrency(selectedQuote.currentPrice) }}
                </div>

                <div :class="getTextChangeClass(selectedQuote.change)" class="quote-change">
                  <TrendingUp v-if="selectedQuote.change >= 0" :size="18" />

                  <TrendingDown v-else :size="18" />

                  <strong>
                    {{ formatChange(selectedQuote.change) }}
                  </strong>

                  <span>
                    {{ formatPercent(selectedQuote.percentChange) }}
                  </span>
                </div>

                <span class="quote-updated">
                  Updated
                  {{ formatDateTime(selectedQuote.timestamp) }}
                </span>
              </div>

              <div class="quote-summary">
                <div class="summary-item">
                  <span>Open</span>
                  <strong>
                    {{ formatCurrency(selectedQuote.open) }}
                  </strong>
                </div>

                <div class="summary-item">
                  <span>Previous Close</span>
                  <strong>
                    {{ formatCurrency(selectedQuote.previousClose) }}
                  </strong>
                </div>

                <div class="summary-item">
                  <span>Day High</span>
                  <strong>
                    {{ formatCurrency(selectedQuote.high) }}
                  </strong>
                </div>

                <div class="summary-item">
                  <span>Day Low</span>
                  <strong>
                    {{ formatCurrency(selectedQuote.low) }}
                  </strong>
                </div>
              </div>
            </div>

            <!-- Chart -->
            <div class="chart-card">
              <div class="chart-header">
                <div>
                  <span class="eyebrow">PERFORMANCE</span>

                  <h3>Price History</h3>

                  <p>
                    Historical closing prices for
                    {{ selectedSymbol }}
                  </p>
                </div>

                <div class="range-selector">
                  <button
                    v-for="range in historyRanges"
                    :key="range.label"
                    :class="{
                      active: selectedRange === range.days,
                    }"
                    @click="changeHistoryRange(range.days)"
                  >
                    {{ range.label }}
                  </button>
                </div>
              </div>

              <div v-if="loadingHistory" class="chart-loading">
                <Loader2 :size="28" class="spin" />
                <span>Loading price history...</span>
              </div>

              <div v-else-if="historyPrices.length" class="chart-container">
                <div class="chart-values">
                  <span>
                    {{ formatCurrency(historyHigh) }}
                  </span>

                  <span>
                    {{ formatCurrency((historyHigh + historyLow) / 2) }}
                  </span>

                  <span>
                    {{ formatCurrency(historyLow) }}
                  </span>
                </div>

                <svg class="price-chart" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <line
                    v-for="line in 5"
                    :key="line"
                    :y1="line * 60"
                    :y2="line * 60"
                    class="grid-line"
                    x1="0"
                    x2="1000"
                  />

                  <path :d="chartAreaPath" class="chart-area" />

                  <path :d="chartPath" class="chart-line" />

                  <circle
                    v-if="latestChartPoint"
                    :cx="latestChartPoint.x"
                    :cy="latestChartPoint.y"
                    class="chart-point"
                    r="5"
                  />
                </svg>

                <div class="chart-dates">
                  <span>
                    {{ formatChartDate(historyPrices[0]?.timestamp) }}
                  </span>

                  <span>
                    {{
                      formatChartDate(
                        historyPrices[Math.floor(historyPrices.length / 2)]?.timestamp,
                      )
                    }}
                  </span>

                  <span>
                    {{ formatChartDate(historyPrices[historyPrices.length - 1]?.timestamp) }}
                  </span>
                </div>

                <div class="history-summary">
                  <div>
                    <span>Period Low</span>
                    <strong>
                      {{ formatCurrency(historyLow) }}
                    </strong>
                  </div>

                  <div>
                    <span>Period High</span>
                    <strong>
                      {{ formatCurrency(historyHigh) }}
                    </strong>
                  </div>

                  <div>
                    <span>Latest Close</span>
                    <strong>
                      {{ formatCurrency(historyLatest) }}
                    </strong>
                  </div>

                  <div>
                    <span>Data Points</span>
                    <strong>
                      {{ historyPrices.length }}
                    </strong>
                  </div>
                </div>
              </div>

              <div v-else class="chart-empty">
                <BarChart3 :size="27" />
                <strong>No historical data available</strong>
                <span> Historical prices could not be loaded. </span>
              </div>
            </div>

            <!-- Bottom information -->
            <div class="information-grid">
              <!-- Company -->
              <div v-if="selectedProfile" class="information-card">
                <div class="information-header">
                  <div class="information-icon">
                    <Building2 :size="18" />
                  </div>

                  <div>
                    <span class="eyebrow">COMPANY</span>
                    <h3>Company Information</h3>
                  </div>
                </div>

                <div class="company-details">
                  <div>
                    <span>Company</span>
                    <strong>
                      {{ selectedProfile.name || '—' }}
                    </strong>
                  </div>

                  <div>
                    <span>Industry</span>
                    <strong>
                      {{ selectedProfile.industry || '—' }}
                    </strong>
                  </div>

                  <div>
                    <span>Country</span>
                    <strong>
                      {{ selectedProfile.country || '—' }}
                    </strong>
                  </div>

                  <div>
                    <span>Exchange</span>
                    <strong>
                      {{ selectedProfile.exchange || '—' }}
                    </strong>
                  </div>

                  <div>
                    <span>Currency</span>
                    <strong>
                      {{ selectedProfile.currency || '—' }}
                    </strong>
                  </div>
                </div>

                <a
                  v-if="selectedProfile.webUrl"
                  :href="selectedProfile.webUrl"
                  class="company-website"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit company website
                  <ExternalLink :size="14" />
                </a>
              </div>

              <!-- Market information -->
              <div class="information-card">
                <div class="information-header">
                  <div class="information-icon blue">
                    <Activity :size="18" />
                  </div>

                  <div>
                    <span class="eyebrow">MARKET</span>
                    <h3>Market Statistics</h3>
                  </div>
                </div>

                <div v-if="selectedQuote" class="company-details">
                  <div>
                    <span>Symbol</span>
                    <strong>{{ selectedQuote.symbol }}</strong>
                  </div>

                  <div>
                    <span>Current Price</span>
                    <strong>
                      {{ formatCurrency(selectedQuote.currentPrice) }}
                    </strong>
                  </div>

                  <div>
                    <span>Daily Change</span>
                    <strong :class="getTextChangeClass(selectedQuote.change)">
                      {{ formatChange(selectedQuote.change) }}
                    </strong>
                  </div>

                  <div>
                    <span>Daily Change %</span>
                    <strong :class="getTextChangeClass(selectedQuote.percentChange)">
                      {{ formatPercent(selectedQuote.percentChange) }}
                    </strong>
                  </div>

                  <div>
                    <span>Previous Close</span>
                    <strong>
                      {{ formatCurrency(selectedQuote.previousClose) }}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Disclaimer -->
            <div class="market-disclaimer">
              <ShieldCheck :size="17" />

              <div>
                <strong>Market information</strong>
                <span>
                  Prices and market information are provided for informational purposes only and do
                  not constitute financial advice.
                </span>
              </div>
            </div>
          </template>
        </section>
      </div>
    </main>
  </div>

  </BankingShell>
</template>

<script lang="ts" setup>
import BankingShell from '@/components/BankingShell.vue'

import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import {
  Activity,
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  Building2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Headphones,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  ReceiptText,
  RefreshCw,
  Search,
  SearchX,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
  X
} from 'lucide-vue-next'

import NotificationDropdown from '../components/layout/NotificationDropdownView.vue'

import {
  type FeaturedStock,
  getFeaturedStocks,
  getHistory,
  getProfile,
  getQuote,
  type HistoricalPrice,
  searchStocks,
  type StockProfile,
  type StockQuote,
  type StockSearchResult
} from '../service/marketDataService'

const router = useRouter()

const mobileMenuOpen = ref(false)

const userName = ref('User')
const userEmail = ref('')

const featuredStocks = ref<FeaturedStock[]>([])

const selectedSymbol = ref('')

const selectedQuote = ref<StockQuote | null>(null)
const selectedProfile = ref<StockProfile | null>(null)
const historyPrices = ref<HistoricalPrice[]>([])

const loadingFeatured = ref(false)
const loadingDetails = ref(false)
const loadingHistory = ref(false)

const errorMessage = ref('')

const searchQuery = ref('')
const searchResults = ref<StockSearchResult[]>([])
const searching = ref(false)
const searchPerformed = ref(false)

const selectedRange = ref(30)

const historyRanges = [
  {
    label: '7D',
    days: 7,
  },
  {
    label: '30D',
    days: 30,
  },
  {
    label: '90D',
    days: 90,
  },
  {
    label: '1Y',
    days: 365,
  },
]

const userInitial = computed(() => {
  const name = userName.value.trim()

  return name ? name.charAt(0).toUpperCase() : 'U'
})

const historyLow = computed(() => {
  if (!historyPrices.value.length) {
    return 0
  }

  return Math.min(...historyPrices.value.map((price) => Number(price.low)))
})

const historyHigh = computed(() => {
  if (!historyPrices.value.length) {
    return 0
  }

  return Math.max(...historyPrices.value.map((price) => Number(price.high)))
})

const historyLatest = computed(() => {
  const last = historyPrices.value[historyPrices.value.length - 1]

  return last ? Number(last.close) : 0
})

const chartPoints = computed(() => {
  const prices = historyPrices.value

  if (!prices.length) {
    return []
  }

  const values = prices.map((price) => Number(price.close))

  const min = Math.min(...values)
  const max = Math.max(...values)

  const range = max - min || 1

  return values.map((value, index) => {
    const x = prices.length === 1 ? 500 : (index / (prices.length - 1)) * 1000

    const y = 265 - ((value - min) / range) * 225

    return {
      x,
      y,
      value,
    }
  })
})

const chartPath = computed(() => {
  if (!chartPoints.value.length) {
    return ''
  }

  return chartPoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
})

const chartAreaPath = computed(() => {
  if (!chartPoints.value.length) {
    return ''
  }

  const points = chartPoints.value

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const first = points[0]
  const last = points[points.length - 1]

  if (!first || !last) {
    return ''
  }

  return `${line} L ${last.x} 285 L ${first.x} 285 Z`
})

const latestChartPoint = computed(() => {
  return chartPoints.value[chartPoints.value.length - 1] || null
})

function getToken(): string | null {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
}

async function loadUser() {
  const token = getToken()

  if (!token) {
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return
    }

    const result = await response.json()

    const user = result?.data?.user

    if (!user) {
      return
    }

    userName.value =
      user.fullName ||
      user.name ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      'User'

    userEmail.value = user.email || ''
  } catch {
    // Keep fallback user information.
  }
}

async function loadFeaturedStocks() {
  loadingFeatured.value = true
  errorMessage.value = ''

  try {
    const stocks = await getFeaturedStocks()

    featuredStocks.value = stocks

    if (selectedSymbol.value) {
      return
    }

    const firstStock = stocks[0]

    if (!firstStock) {
      return
    }

    try {
      await selectStock(firstStock.symbol)
    } catch (error) {
      console.warn(`Unable to load details for ${firstStock.symbol}:`, error)

      selectedSymbol.value = ''
      selectedQuote.value = null
      selectedProfile.value = null
      historyPrices.value = []

      errorMessage.value = ''
    }
  } catch (error) {
    featuredStocks.value = []

    errorMessage.value = error instanceof Error ? error.message : 'Unable to load market data.'
  } finally {
    loadingFeatured.value = false
  }
}

async function selectStock(symbol: string) {
  selectedSymbol.value = symbol.toUpperCase()

  mobileMenuOpen.value = false

  await loadStockDetails(selectedSymbol.value)
}

async function loadStockDetails(symbol: string) {
  loadingDetails.value = true
  errorMessage.value = ''

  try {
    const [quote, profile] = await Promise.all([getQuote(symbol), getProfile(symbol)])

    selectedQuote.value = quote
    selectedProfile.value = profile

    await loadHistory(symbol, selectedRange.value)
  } catch (error) {
    selectedQuote.value = null
    selectedProfile.value = null
    historyPrices.value = []

    throw error
  } finally {
    loadingDetails.value = false
  }
}

async function loadHistory(symbol: string, days: number) {
  loadingHistory.value = true

  try {
    const now = Math.floor(Date.now() / 1000)

    const from = now - days * 24 * 60 * 60

    const response = await getHistory(symbol, 'D', from, now)

    historyPrices.value = [...response.prices].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
  } catch (error) {
    historyPrices.value = []

    throw error
  } finally {
    loadingHistory.value = false
  }
}

async function changeHistoryRange(days: number) {
  selectedRange.value = days

  if (!selectedSymbol.value) {
    return
  }

  try {
    await loadHistory(selectedSymbol.value, days)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load historical prices.'
  }
}

async function performSearch() {
  const query = searchQuery.value.trim()

  if (!query) {
    return
  }

  searching.value = true
  searchPerformed.value = true
  searchResults.value = []

  try {
    const response = await searchStocks(query)

    searchResults.value = response.results || []
  } catch (error) {
    searchResults.value = []

    errorMessage.value = error instanceof Error ? error.message : 'Unable to search for stocks.'
  } finally {
    searching.value = false
  }
}

async function selectSearchResult(result: StockSearchResult) {
  const symbol = result.symbol || result.displaySymbol

  if (!symbol) {
    return
  }

  searchQuery.value = result.description || symbol

  searchResults.value = []
  searchPerformed.value = false

  try {
    await selectStock(symbol)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : `Unable to load ${symbol}.`
  }
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  searchPerformed.value = false
}

function getChangeClass(change: number) {
  return Number(change) >= 0 ? 'positive' : 'negative'
}

function getTextChangeClass(change: number) {
  return Number(change) >= 0 ? 'text-positive' : 'text-negative'
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

function formatChange(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }

  const number = Number(value)

  return `${number >= 0 ? '+' : ''}${number.toFixed(2)}`
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }

  const number = Number(value)

  return `${number >= 0 ? '+' : ''}${number.toFixed(2)}%`
}

function formatDateTime(value: string) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatChartDate(value: string | undefined) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-DE', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function logout() {
  localStorage.removeItem('accessToken')

  sessionStorage.removeItem('accessToken')

  router.push('/login')
}

onMounted(async () => {
  await loadUser()
  await loadFeaturedStocks()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.market-page {
  min-height: 100vh;
  display: flex;
  background: #f5f8fc;
  color: #1e293b;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* =========================
   SIDEBAR
========================= */

.sidebar {
  width: 250px;
  min-width: 250px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e6edf4;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 100;
}

.sidebar-brand {
  height: 88px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 11px;
  border-bottom: 1px solid #edf2f6;
}

.brand-mark {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  background: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  box-shadow: 0 5px 13px rgba(7, 85, 155, 0.2);
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-name strong {
  color: #07559b;
  font-size: 17px;
}

.brand-name span {
  margin-top: 5px;
  color: #8492a6;
  font-size: 10px;
}

.sidebar-nav {
  flex: 1;
  padding: 25px 13px;
}

.nav-group {
  margin-bottom: 26px;
}

.nav-label {
  padding: 0 13px;
  margin-bottom: 8px;
  color: #9aa7b7;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.nav-item {
  height: 43px;
  margin-bottom: 3px;
  padding: 0 13px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.nav-item:hover {
  background: #f4f8fc;
  color: #07559b;
}

.nav-item.active {
  background: #eaf3fb;
  color: #07559b;
  font-weight: 700;
}

.sidebar-footer {
  padding: 17px 13px 20px;
  border-top: 1px solid #edf2f6;
}

.support-card {
  padding: 12px;
  margin-bottom: 11px;
  background: #f5f9fd;
  border: 1px solid #e3edf6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.support-icon {
  width: 33px;
  height: 33px;
  border-radius: 8px;
  background: #e5f0f9;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.support-card strong {
  display: block;
  color: #334155;
  font-size: 11px;
}

.support-card span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 9px;
}

.logout-button {
  width: 100%;
  height: 41px;
  padding: 0 13px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 12px;
  cursor: pointer;
}

.logout-button:hover {
  color: #dc2626;
  background: #fef2f2;
}

/* =========================
   HEADER
========================= */

.main-content {
  flex: 1;
  min-width: 0;
}

.top-header {
  height: 88px;
  padding: 0 34px;
  background: #ffffff;
  border-bottom: 1px solid #e6edf4;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-left h1 {
  margin: 0;
  color: #172033;
  font-size: 23px;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.header-left p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 11px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e7f1fa;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 750;
}

.profile-details {
  display: flex;
  flex-direction: column;
}

.profile-details strong {
  color: #334155;
  font-size: 12px;
}

.profile-details span {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 9px;
}

.mobile-menu-button {
  display: none;
  border: none;
  background: transparent;
  color: #334155;
  cursor: pointer;
}

/* =========================
   PAGE
========================= */

.page-content {
  max-width: 1600px;
  padding: 30px 34px 55px;
}

/* =========================
   SEARCH
========================= */

.market-search {
  height: 55px;
  padding: 0 7px 0 17px;
  background: #ffffff;
  border: 1px solid #dce5ee;
  border-radius: 11px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.025);
}

.search-icon {
  color: #94a3b8;
  display: flex;
}

.market-search input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 13px;
  border: none;
  outline: none;
  background: transparent;
  color: #334155;
  font-size: 13px;
}

.market-search input::placeholder {
  color: #a0adbc;
}

.search-button {
  height: 40px;
  min-width: 88px;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.search-button:hover:not(:disabled) {
  background: #064b88;
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Search results */

.search-results {
  margin-top: 10px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.07);
}

.search-results-header {
  padding: 14px 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #edf2f6;
}

.search-results-header h3 {
  margin: 3px 0 0;
  color: #334155;
  font-size: 13px;
}

.search-results-header button {
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-row {
  width: 100%;
  padding: 13px 17px;
  border: none;
  border-bottom: 1px solid #f0f3f6;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  cursor: pointer;
}

.result-row:last-child {
  border-bottom: none;
}

.result-row:hover {
  background: #f8fbfe;
}

.result-symbol {
  min-width: 65px;
  color: #07559b;
  font-size: 13px;
  font-weight: 750;
}

.result-information {
  flex: 1;
  min-width: 0;
}

.result-information strong {
  display: block;
  overflow: hidden;
  color: #334155;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.result-information span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 10px;
}

.no-results {
  padding: 23px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.no-results strong {
  display: block;
  color: #475569;
  font-size: 12px;
}

.no-results span {
  display: block;
  margin-top: 3px;
  font-size: 10px;
}

/* =========================
   COMMON
========================= */

.eyebrow {
  display: block;
  color: #94a3b8;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.1em;
}

.section {
  margin-top: 31px;
}

.section-header {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.section-header h2 {
  margin: 4px 0 0;
  color: #172033;
  font-size: 18px;
  font-weight: 750;
}

.section-header p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 11px;
}

.outline-button {
  height: 37px;
  padding: 0 13px;
  border: 1px solid #d8e2ec;
  border-radius: 8px;
  background: #ffffff;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.outline-button:hover:not(:disabled) {
  border-color: #b9cde0;
  color: #07559b;
}

.outline-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.primary-button {
  height: 38px;
  padding: 0 15px;
  border: none;
  border-radius: 8px;
  background: #07559b;
  color: #ffffff;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}

.error-message {
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 9px;
  background: #fef2f2;
  color: #b91c1c;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
}

.error-message span {
  flex: 1;
}

.error-message button {
  border: none;
  background: transparent;
  color: #b91c1c;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

/* =========================
   STOCK GRID
========================= */

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stock-card {
  min-height: 163px;
  padding: 17px;
  border: 1px solid #dfe7ef;
  border-radius: 11px;
  background: #ffffff;
  color: #334155;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.stock-card:hover {
  transform: translateY(-2px);
  border-color: #c0d4e7;
  box-shadow: 0 7px 18px rgba(15, 23, 42, 0.06);
}

.stock-card.selected {
  border-color: #07559b;
  box-shadow:
    0 0 0 1px #07559b,
    0 7px 18px rgba(7, 85, 155, 0.07);
}

.stock-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.stock-identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
}

.stock-logo {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #edf5fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.stock-identity strong {
  display: block;
  color: #07559b;
  font-size: 13px;
}

.stock-identity span {
  display: block;
  max-width: 145px;
  margin-top: 3px;
  overflow: hidden;
  color: #94a3b8;
  font-size: 9px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.change-badge {
  padding: 5px 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 700;
}

.change-badge.positive {
  background: #ecfdf3;
  color: #15803d;
}

.change-badge.negative {
  background: #fef2f2;
  color: #dc2626;
}

.stock-price {
  margin-top: 23px;
  color: #172033;
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -0.03em;
}

.stock-bottom {
  margin-top: 13px;
  padding-top: 10px;
  border-top: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9aa7b7;
  font-size: 9px;
}

.stock-bottom strong {
  font-size: 10px;
}

.stock-bottom svg {
  margin-left: auto;
  color: #a6b3c1;
}

/* =========================
   STOCK DETAIL
========================= */

.stock-detail-section {
  margin-top: 38px;
}

.detail-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.detail-company {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-symbol {
  width: 47px;
  height: 47px;
  border-radius: 11px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 800;
  box-shadow: 0 5px 13px rgba(7, 85, 155, 0.18);
}

.detail-company h2 {
  margin: 4px 0 0;
  color: #172033;
  font-size: 19px;
  font-weight: 750;
}

.detail-company p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 10px;
}

.detail-loading {
  min-height: 180px;
  background: #ffffff;
  border: 1px solid #dfe7ef;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #94a3b8;
  font-size: 11px;
}

/* Quote */

.quote-card {
  padding: 23px;
  border: 1px solid #dfe7ef;
  border-radius: 12px;
  background: #ffffff;
  display: grid;
  grid-template-columns:
    minmax(270px, 0.9fr)
    minmax(420px, 1.1fr);
  gap: 25px;
}

.quote-main {
  padding-right: 25px;
  border-right: 1px solid #edf1f5;
}

.quote-price {
  margin-top: 8px;
  color: #172033;
  font-size: 35px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.quote-change {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quote-change strong {
  font-size: 14px;
}

.quote-change span {
  font-size: 11px;
}

.quote-updated {
  display: block;
  margin-top: 9px;
  color: #a0acb9;
  font-size: 9px;
}

.quote-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
}

.summary-item {
  padding: 13px 15px;
  border-bottom: 1px solid #edf1f5;
}

.summary-item:nth-child(odd) {
  border-right: 1px solid #edf1f5;
}

.summary-item:nth-child(3),
.summary-item:nth-child(4) {
  border-bottom: none;
}

.summary-item span {
  display: block;
  color: #94a3b8;
  font-size: 9px;
}

.summary-item strong {
  display: block;
  margin-top: 5px;
  color: #334155;
  font-size: 12px;
}

/* =========================
   CHART
========================= */

.chart-card {
  margin-top: 15px;
  padding: 21px;
  border: 1px solid #dfe7ef;
  border-radius: 12px;
  background: #ffffff;
}

.chart-header {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.chart-header h3 {
  margin: 4px 0 0;
  color: #334155;
  font-size: 14px;
}

.chart-header p {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 10px;
}

.range-selector {
  padding: 3px;
  border-radius: 7px;
  background: #f3f6f9;
  display: flex;
  gap: 3px;
}

.range-selector button {
  min-width: 38px;
  height: 28px;
  padding: 0 7px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #94a3b8;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

.range-selector button.active {
  background: #ffffff;
  color: #07559b;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.chart-container {
  position: relative;
}

.chart-values {
  position: absolute;
  top: 3px;
  right: 0;
  height: 265px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #a0acb9;
  font-size: 8px;
}

.price-chart {
  width: calc(100% - 60px);
  height: 280px;
  margin-right: 60px;
  display: block;
}

.grid-line {
  stroke: #edf2f6;
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke: #07559b;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-area {
  fill: rgba(7, 85, 155, 0.08);
}

.chart-point {
  fill: #ffffff;
  stroke: #07559b;
  stroke-width: 3;
}

.chart-dates {
  width: calc(100% - 60px);
  margin-right: 60px;
  display: flex;
  justify-content: space-between;
  color: #a0acb9;
  font-size: 8px;
}

.history-summary {
  margin-top: 18px;
  padding-top: 15px;
  border-top: 1px solid #edf1f5;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.history-summary div {
  padding: 0 15px;
  border-right: 1px solid #edf1f5;
}

.history-summary div:first-child {
  padding-left: 0;
}

.history-summary div:last-child {
  border-right: none;
}

.history-summary span {
  display: block;
  color: #94a3b8;
  font-size: 9px;
}

.history-summary strong {
  display: block;
  margin-top: 5px;
  color: #334155;
  font-size: 12px;
}

.chart-loading,
.chart-empty {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.chart-loading {
  gap: 9px;
  font-size: 11px;
}

.chart-empty {
  gap: 5px;
}

.chart-empty strong {
  margin-top: 5px;
  color: #475569;
  font-size: 12px;
}

.chart-empty span {
  font-size: 10px;
}

/* =========================
   INFORMATION
========================= */

.information-grid {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.information-card {
  padding: 20px;
  border: 1px solid #dfe7ef;
  border-radius: 12px;
  background: #ffffff;
}

.information-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  gap: 10px;
}

.information-icon {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.information-icon.blue {
  background: #eaf3fb;
  color: #07559b;
}

.information-header h3 {
  margin: 4px 0 0;
  color: #334155;
  font-size: 13px;
}

.company-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.company-details div {
  padding: 12px 10px;
  border-bottom: 1px solid #f0f3f6;
}

.company-details div:nth-child(odd) {
  border-right: 1px solid #f0f3f6;
  padding-left: 0;
}

.company-details div:nth-child(even) {
  padding-right: 0;
}

.company-details span {
  display: block;
  color: #94a3b8;
  font-size: 9px;
}

.company-details strong {
  display: block;
  margin-top: 4px;
  color: #475569;
  font-size: 11px;
  text-align: right;
}

.company-details div:nth-child(odd) strong {
  text-align: left;
}

.company-website {
  margin-top: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #07559b;
  font-size: 10px;
  font-weight: 650;
  text-decoration: none;
}

.company-website:hover {
  text-decoration: underline;
}

/* Disclaimer */

.market-disclaimer {
  margin-top: 15px;
  padding: 13px 15px;
  border: 1px solid #dce9e2;
  border-radius: 9px;
  background: #f7fcf9;
  color: #15803d;
  display: flex;
  align-items: flex-start;
  gap: 9px;
}

.market-disclaimer strong {
  display: block;
  color: #166534;
  font-size: 10px;
}

.market-disclaimer span {
  display: block;
  margin-top: 3px;
  color: #71917c;
  font-size: 9px;
}

/* =========================
   EMPTY
========================= */

.empty-state {
  min-height: 260px;
  padding: 30px;
  border: 1px solid #dfe7ef;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 51px;
  height: 51px;
  border-radius: 12px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state h3 {
  margin: 13px 0 5px;
  color: #334155;
  font-size: 14px;
}

.empty-state p {
  margin: 0 0 15px;
  color: #94a3b8;
  font-size: 10px;
}

/* =========================
   SKELETON
========================= */

.skeleton-card {
  cursor: default;
}

.skeleton-card:hover {
  transform: none;
  box-shadow: none;
}

.skeleton {
  background: linear-gradient(90deg, #eef2f6 25%, #f7f9fb 50%, #eef2f6 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite;
  border-radius: 5px;
}

.skeleton-small {
  width: 35px;
  height: 31px;
}

.skeleton-name {
  width: 120px;
  height: 12px;
  margin-top: 9px;
}

.skeleton-price {
  width: 105px;
  height: 25px;
  margin-top: 23px;
}

.skeleton-line {
  width: 100%;
  height: 1px;
  margin-top: 16px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* =========================
   UTILITY
========================= */

.text-positive {
  color: #15803d !important;
}

.text-negative {
  color: #dc2626 !important;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   MOBILE
========================= */

.mobile-overlay {
  display: none;
}

@media (max-width: 1200px) {
  .stocks-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quote-card {
    grid-template-columns: 1fr;
  }

  .quote-main {
    padding-right: 0;
    padding-bottom: 20px;
    border-right: none;
    border-bottom: 1px solid #edf1f5;
  }
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: -270px;
    top: 0;
    bottom: 0;
    transition: left 0.25s ease;
    box-shadow: 10px 0 30px rgba(15, 23, 42, 0.12);
  }

  .sidebar.sidebar-open {
    left: 0;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    display: block;
    background: rgba(15, 23, 42, 0.35);
    z-index: 90;
  }

  .mobile-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top-header {
    padding: 0 20px;
  }

  .page-content {
    padding: 25px 20px 45px;
  }

  .profile-details {
    display: none;
  }

  .information-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .top-header {
    height: 76px;
  }

  .header-left h1 {
    font-size: 20px;
  }

  .header-left p {
    font-size: 9px;
  }

  .header-right {
    gap: 8px;
  }

  .page-content {
    padding: 20px 14px 35px;
  }

  .market-search {
    height: 51px;
  }

  .search-button {
    min-width: 70px;
  }

  .stocks-grid {
    grid-template-columns: 1fr;
  }

  .section-header,
  .detail-header,
  .chart-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .quote-price {
    font-size: 31px;
  }

  .quote-summary {
    grid-template-columns: 1fr 1fr;
  }

  .summary-item:nth-child(odd) {
    border-right: 1px solid #edf1f5;
  }

  .chart-header {
    gap: 12px;
  }

  .range-selector {
    width: 100%;
  }

  .range-selector button {
    flex: 1;
  }

  .price-chart {
    width: calc(100% - 48px);
    margin-right: 48px;
  }

  .chart-dates {
    width: calc(100% - 48px);
    margin-right: 48px;
  }

  .chart-values {
    height: 265px;
    font-size: 7px;
  }

  .history-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px 0;
  }

  .history-summary div:nth-child(2) {
    border-right: none;
  }

  .history-summary div:nth-child(3) {
    padding-left: 0;
  }

  .company-details {
    grid-template-columns: 1fr;
  }

  .company-details div:nth-child(odd),
  .company-details div:nth-child(even) {
    padding-left: 0;
    padding-right: 0;
    border-right: none;
  }

  .company-details div strong,
  .company-details div:nth-child(odd) strong {
    text-align: left;
  }

  .information-card {
    padding: 16px;
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
