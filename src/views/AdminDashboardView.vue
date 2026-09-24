<script lang="ts" setup>
import BankingShell from '../components/BankingShell.vue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  Activity,
  ArrowLeftRight,
  ChevronRight,
  CreditCard,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Unlock,
  UserCheck,
  UserRound,
  Users,
  WalletCards,
  XCircle
} from 'lucide-vue-next'
import { getPendingCardApplications } from '../service/cardApplicationService'
import { activateCard, blockCard, cancelCard, type Card, getAllCards } from '../service/cardService'

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface AdminStatistics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  totalAccounts: number
  averageAccountPerUser: number
  customersCount: number
  adminsCount: number
}

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles?: Array<{
    id: number
    name: string
  }>
  createdAt: string
}

const statistics = ref<AdminStatistics>({
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  totalAccounts: 0,
  averageAccountPerUser: 0,
  customersCount: 0,
  adminsCount: 0,
})

const currentUser = ref<User | null>(null)

const loading = ref(true)
const errorMessage = ref('')
const searchOpen = ref(false)
const searchQuery = ref('')

const pendingCardApplications = ref(0)
const adminCards = ref<Card[]>([])
const loadingCards = ref(false)
const cardActionLoadingId = ref<number | null>(null)
const cardActionError = ref('')


const activePercentage = computed(() => {
  if (statistics.value.totalUsers === 0) {
    return 0
  }

  return Math.round((statistics.value.activeUsers / statistics.value.totalUsers) * 100)
})

const inactivePercentage = computed(() => {
  if (statistics.value.totalUsers === 0) {
    return 0
  }

  return Math.round((statistics.value.inactiveUsers / statistics.value.totalUsers) * 100)
})

const customerPercentage = computed(() => {
  if (statistics.value.totalUsers === 0) {
    return 0
  }

  return Math.round((statistics.value.customersCount / statistics.value.totalUsers) * 100)
})

function getAccessToken(): string | null {
  return localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken')
}

function openSearch() {
  searchOpen.value = true

  requestAnimationFrame(() => {
    const input = document.querySelector<HTMLInputElement>(
      '.admin-header-search input',
    )

    input?.focus()
  })
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function executeSearch() {
  const query = searchQuery.value.trim()

  if (!query) {
    return
  }

  router.push({
    path: '/admin/users',
    query: {
      search: query,
    },
  })

  closeSearch()
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeSearch()
  }
}

function logout() {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('adminAccessToken')
  sessionStorage.removeItem('user')

  router.push('/admin/login')
}

async function loadCurrentUser() {
  const token = getAccessToken()

  if (!token) {
    router.push('/admin/login')
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401 || response.status === 403) {
      logout()
      return false
    }

    if (!response.ok) {
      throw new Error('Could not load your profile.')
    }

    const result = await response.json()

    currentUser.value = result.data.user

    return true
  } catch (error) {
    console.error('Failed to load current user:', error)
    throw error
  }
}

async function loadStatistics() {
  const token = getAccessToken()

  if (!token) {
    router.push('/admin/login')
    return
  }

  const response = await fetch(`${API_BASE_URL}/api/users/admin/stats`, {
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
    errorMessage.value = 'You do not have permission to access the administration area.'
    return
  }

  if (!response.ok) {
    throw new Error('Could not load administration statistics.')
  }

  const result = await response.json()

  if (!result.data) {
    throw new Error('The server returned no statistics.')
  }

  statistics.value = {
    totalUsers: Number(result.data.totalUsers ?? 0),
    activeUsers: Number(result.data.activeUsers ?? 0),
    inactiveUsers: Number(result.data.inactiveUsers ?? 0),
    totalAccounts: Number(result.data.totalAccounts ?? 0),
    averageAccountPerUser: Number(result.data.averageAccountPerUser ?? 0),
    customersCount: Number(result.data.customersCount ?? 0),
    adminsCount: Number(result.data.adminsCount ?? 0),
  }
}

async function loadPendingCardApplications() {
  try {
    const applications = await getPendingCardApplications()
    pendingCardApplications.value = applications.length
  } catch (error) {
    console.error('Failed to load pending card applications:', error)
    pendingCardApplications.value = 0
  }
}

async function loadAdminCards() {
  loadingCards.value = true
  cardActionError.value = ''

  try {
    adminCards.value = await getAllCards()
  } catch (error) {
    console.error('Failed to load admin cards:', error)
    cardActionError.value =
      error instanceof Error ? error.message : 'Could not load customer cards.'
  } finally {
    loadingCards.value = false
  }
}

async function handleCardAction(card: Card, action: 'BLOCK' | 'ACTIVATE' | 'CANCEL') {
  if (cardActionLoadingId.value !== null) {
    return
  }

  const actionText = action === 'BLOCK' ? 'freeze' : action === 'ACTIVATE' ? 'unfreeze' : 'cancel'

  const confirmation = window.confirm(
    action === 'CANCEL'
      ? `Cancel card ${card.maskedCardNumber}? This action is permanent and the card cannot be activated again.`
      : `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} card ${card.maskedCardNumber}?`,
  )

  if (!confirmation) {
    return
  }

  cardActionLoadingId.value = card.id
  cardActionError.value = ''

  try {
    let updatedCard: Card

    if (action === 'BLOCK') {
      updatedCard = await blockCard(card.id)
    } else if (action === 'ACTIVATE') {
      updatedCard = await activateCard(card.id)
    } else {
      updatedCard = await cancelCard(card.id)
    }

    const index = adminCards.value.findIndex((item) => item.id === updatedCard.id)

    if (index !== -1) {
      adminCards.value[index] = updatedCard
    }
  } catch (error) {
    console.error(`Failed to ${actionText} card:`, error)
    cardActionError.value =
      error instanceof Error ? error.message : 'Could not update the card status.'
  } finally {
    cardActionLoadingId.value = null
  }
}

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    const authenticated = await loadCurrentUser()

    if (!authenticated) {
      return
    }

    await Promise.all([loadStatistics(), loadPendingCardApplications(), loadAdminCards()])
  } catch (error) {
    console.error('Failed to load admin dashboard:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Something went wrong while loading the dashboard.'
  } finally {
    loading.value = false
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatDecimal(value: number): string {
  return value.toFixed(2)
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <BankingShell
    :admin="true"
    :user="currentUser || undefined"
    page-title="Overview"
    page-section="ADMINISTRATION"
  >
    <div class="admin-dashboard-page">
      <div class="admin-dashboard-toolbar">
        <div v-if="searchOpen" class="admin-header-search">
          <Search :size="17" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search users, email or account..."
            autocomplete="off"
            @keydown="handleSearchKeydown"
            @keyup.enter="executeSearch"
          />
          <button
            class="search-close-button"
            title="Close search"
            type="button"
            @click="closeSearch"
          >×</button>
        </div>
        <button
          v-else
          class="header-icon-button"
          title="Search users"
          type="button"
          @click="openSearch"
        >
          <Search :size="19" />
        </button>
      </div>
      <section class="admin-content">
        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <h2>Loading administration dashboard</h2>
          <p>Retrieving the latest bank statistics...</p>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="error-state">
          <div class="error-icon">
            <ShieldCheck :size="25" />
          </div>

          <h2>Unable to load dashboard</h2>
          <p>{{ errorMessage }}</p>

          <button class="retry-button" type="button" @click="loadDashboard">Try again</button>
        </div>

        <!-- Dashboard -->
        <template v-else>
          <!-- Welcome -->
          <section class="welcome-section">
            <div>
              <span class="section-kicker">BANK OPERATIONS</span>

              <h2>Good morning, {{ currentUser?.firstName }}.</h2>

              <p>Monitor your banking platform, users and accounts from one central workspace.</p>
            </div>

            <div class="system-status">
              <span class="status-pulse"></span>
              <span>System operational</span>
            </div>
          </section>

          <!-- Main Statistics -->
          <section class="statistics-grid">
            <article class="stat-card primary-stat">
              <div class="stat-card-top">
                <div class="stat-icon">
                  <Users :size="21" />
                </div>

                <span class="stat-label">TOTAL USERS</span>
              </div>

              <div class="stat-value">
                {{ formatNumber(statistics.totalUsers) }}
              </div>

              <div class="stat-footer">
                <span> Registered users </span>

                <UserRound :size="15" />
              </div>
            </article>

            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon green-icon">
                  <UserCheck :size="21" />
                </div>

                <span class="stat-label">ACTIVE USERS</span>
              </div>

              <div class="stat-value">
                {{ formatNumber(statistics.activeUsers) }}
              </div>

              <div class="stat-footer">
                <span>{{ activePercentage }}% of users</span>
                <span class="positive-value"> Active </span>
              </div>
            </article>

            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon orange-icon">
                  <CreditCard :size="21" />
                </div>

                <span class="stat-label">TOTAL ACCOUNTS</span>
              </div>

              <div class="stat-value">
                {{ formatNumber(statistics.totalAccounts) }}
              </div>

              <div class="stat-footer">
                <span>Customer accounts</span>
                <WalletCards :size="15" />
              </div>
            </article>

            <article class="stat-card">
              <div class="stat-card-top">
                <div class="stat-icon purple-icon">
                  <Activity :size="21" />
                </div>

                <span class="stat-label">AVG. ACCOUNTS / USER</span>
              </div>

              <div class="stat-value">
                {{ formatDecimal(statistics.averageAccountPerUser) }}
              </div>

              <div class="stat-footer">
                <span>Platform average</span>
                <Activity :size="15" />
              </div>
            </article>
          </section>

          <!-- Secondary Statistics -->
          <section class="dashboard-columns">
            <!-- User Status -->
            <article class="dashboard-panel">
              <div class="panel-heading">
                <div>
                  <span class="panel-kicker">USER STATUS</span>
                  <h3>Account activity</h3>
                </div>

                <Users :size="20" />
              </div>

              <div class="activity-summary">
                <div class="activity-total">
                  <strong>
                    {{ formatNumber(statistics.totalUsers) }}
                  </strong>

                  <span>Total users</span>
                </div>

                <div class="activity-chart">
                  <div class="chart-ring">
                    <div class="ring-content">
                      <strong>{{ activePercentage }}%</strong>
                      <span>active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="status-list">
                <div class="status-row">
                  <div class="status-row-label">
                    <span class="status-indicator active"></span>
                    <span>Active users</span>
                  </div>

                  <strong>
                    {{ formatNumber(statistics.activeUsers) }}
                  </strong>
                </div>

                <div class="status-progress">
                  <div
                    :style="{ width: `${activePercentage}%` }"
                    class="progress-fill active-fill"
                  ></div>
                </div>

                <div class="status-row">
                  <div class="status-row-label">
                    <span class="status-indicator inactive"></span>
                    <span>Inactive users</span>
                  </div>

                  <strong>
                    {{ formatNumber(statistics.inactiveUsers) }}
                  </strong>
                </div>

                <div class="status-progress">
                  <div
                    :style="{ width: `${inactivePercentage}%` }"
                    class="progress-fill inactive-fill"
                  ></div>
                </div>
              </div>
            </article>

            <!-- User Composition -->
            <article class="dashboard-panel">
              <div class="panel-heading">
                <div>
                  <span class="panel-kicker">USER COMPOSITION</span>
                  <h3>Platform users</h3>
                </div>

                <ShieldCheck :size="20" />
              </div>

              <div class="composition-list">
                <div class="composition-item">
                  <div class="composition-icon customer">
                    <UserCheck :size="20" />
                  </div>

                  <div class="composition-details">
                    <strong>Customers</strong>
                    <span> {{ customerPercentage }}% of all users </span>
                  </div>

                  <strong class="composition-number">
                    {{ formatNumber(statistics.customersCount) }}
                  </strong>
                </div>

                <div class="composition-divider"></div>

                <div class="composition-item">
                  <div class="composition-icon admin">
                    <ShieldCheck :size="20" />
                  </div>

                  <div class="composition-details">
                    <strong>Administrators</strong>
                    <span> Privileged platform users </span>
                  </div>

                  <strong class="composition-number">
                    {{ formatNumber(statistics.adminsCount) }}
                  </strong>
                </div>
              </div>

              <div class="admin-notice">
                <ShieldCheck :size="17" />

                <div>
                  <strong>Protected administration</strong>
                  <span> Administrative actions require authorized access. </span>
                </div>
              </div>
            </article>
          </section>

          <!-- Quick Actions -->
          <section class="quick-section">
            <div class="section-heading-row">
              <div>
                <span class="section-kicker">MANAGEMENT</span>
                <h3>Quick actions</h3>
              </div>
            </div>

            <div class="quick-actions">
              <RouterLink class="quick-action" to="/admin/users">
                <div class="quick-action-icon">
                  <Users :size="21" />
                </div>

                <div>
                  <strong>Manage users</strong>
                  <span> Search and manage customer accounts </span>
                </div>

                <ChevronRight :size="19" />
              </RouterLink>

              <RouterLink class="quick-action" to="/admin/accounts">
                <div class="quick-action-icon">
                  <WalletCards :size="21" />
                </div>

                <div>
                  <strong>Manage accounts</strong>
                  <span> Review banking accounts and statuses </span>
                </div>

                <ChevronRight :size="19" />
              </RouterLink>

              <RouterLink class="quick-action" to="/admin/transactions">
                <div class="quick-action-icon">
                  <ArrowLeftRight :size="21" />
                </div>

                <div>
                  <strong>Transactions</strong>
                  <span> Review account transaction activity </span>
                </div>

                <ChevronRight :size="19" />
              </RouterLink>

              <RouterLink
                class="quick-action card-application-action"
                to="/admin/card-applications"
              >
                <div class="quick-action-icon">
                  <CreditCard :size="21" />
                </div>

                <div>
                  <strong>Card applications</strong>
                  <span>
                    {{
                      pendingCardApplications > 0
                        ? `${pendingCardApplications} pending application${pendingCardApplications === 1 ? '' : 's'} to review`
                        : 'Review customer card applications'
                    }}
                  </span>
                </div>

                <span v-if="pendingCardApplications > 0" class="quick-action-count">
                  {{ pendingCardApplications }}
                </span>

                <ChevronRight :size="19" />
              </RouterLink>
            </div>
          </section>

          <!-- CARD MANAGEMENT -->
          <section class="card-management-section">
            <div class="section-heading-row">
              <div>
                <span class="section-kicker">CARD MANAGEMENT</span>
                <h3>Customer cards</h3>
                <p class="section-description">
                  Freeze, unfreeze or permanently cancel customer cards.
                </p>
              </div>

              <button
                :disabled="loadingCards"
                class="refresh-cards-button"
                type="button"
                @click="loadAdminCards"
              >
                <RefreshCw :class="{ spinning: loadingCards }" :size="16" />
                <span>Refresh</span>
              </button>
            </div>

            <div v-if="cardActionError" class="card-action-error">
              <XCircle :size="17" />
              <span>{{ cardActionError }}</span>
              <button type="button" @click="cardActionError = ''">×</button>
            </div>

            <div v-if="loadingCards" class="cards-management-loading">
              <div class="loading-spinner small"></div>
              <span>Loading customer cards...</span>
            </div>

            <div v-else-if="adminCards.length === 0" class="cards-management-empty">
              <div class="empty-card-icon">
                <CreditCard :size="22" />
              </div>
              <div>
                <strong>No customer cards found</strong>
                <span>Approved customer cards will appear here.</span>
              </div>
            </div>

            <div v-else class="admin-card-list">
              <article v-for="card in adminCards" :key="card.id" class="admin-card-row">
                <div class="admin-card-main">
                  <div class="admin-card-icon">
                    <CreditCard :size="20" />
                  </div>

                  <div class="admin-card-details">
                    <div class="admin-card-title-row">
                      <strong>{{ card.maskedCardNumber }}</strong>

                      <span :class="card.cardStatus.toLowerCase()" class="admin-card-status">
                        <span class="status-dot"></span>
                        {{ card.cardStatus }}
                      </span>
                    </div>

                    <div class="admin-card-meta">
                      <span>{{ card.holderName }}</span>
                      <span>{{ card.cardType }}</span>
                      <span>Account {{ card.accountNumber }}</span>
                      <span>Card #{{ card.id }}</span>
                    </div>
                  </div>
                </div>

                <div class="admin-card-actions">
                  <template v-if="card.cardStatus === 'ACTIVE'">
                    <button
                      :disabled="cardActionLoadingId === card.id"
                      class="card-control-button freeze"
                      type="button"
                      @click="handleCardAction(card, 'BLOCK')"
                    >
                      <Lock :size="15" />
                      <span>{{ cardActionLoadingId === card.id ? 'Freezing...' : 'Freeze' }}</span>
                    </button>

                    <button
                      :disabled="cardActionLoadingId === card.id"
                      class="card-control-button cancel"
                      type="button"
                      @click="handleCardAction(card, 'CANCEL')"
                    >
                      <XCircle :size="15" />
                      <span>Cancel</span>
                    </button>
                  </template>

                  <template v-else-if="card.cardStatus === 'BLOCKED'">
                    <button
                      :disabled="cardActionLoadingId === card.id"
                      class="card-control-button activate"
                      type="button"
                      @click="handleCardAction(card, 'ACTIVATE')"
                    >
                      <Unlock :size="15" />
                      <span>{{
                          cardActionLoadingId === card.id ? 'Unfreezing...' : 'Unfreeze'
                        }}</span>
                    </button>

                    <button
                      :disabled="cardActionLoadingId === card.id"
                      class="card-control-button cancel"
                      type="button"
                      @click="handleCardAction(card, 'CANCEL')"
                    >
                      <XCircle :size="15" />
                      <span>Cancel</span>
                    </button>
                  </template>

                  <template v-else-if="card.cardStatus === 'EXPIRED'">
                    <button
                      :disabled="cardActionLoadingId === card.id"
                      class="card-control-button cancel"
                      type="button"
                      @click="handleCardAction(card, 'CANCEL')"
                    >
                      <XCircle :size="15" />
                      <span>Cancel</span>
                    </button>
                  </template>

                  <span v-else class="card-no-actions">No actions available</span>
                </div>
              </article>
            </div>
          </section>
        </template>
      </section>
    </div>
  </BankingShell>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* Shared BankingShell owns the application shell. This page owns only dashboard content. */
.admin-dashboard-page {
  width: 100%;
}

.admin-dashboard-toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 14px;
}

.admin-header-search {
  height: 38px;
  width: min(360px, 100%);
  padding: 0 8px 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dce4ec;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 5px 18px rgba(15, 35, 55, 0.08);
}

.admin-header-search svg {
  flex-shrink: 0;
  color: #7c8b9b;
}

.admin-header-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #17324d;
  font-family: inherit;
  font-size: 12px;
}

.admin-header-search input::placeholder {
  color: #9aa7b4;
}

.search-close-button {
  width: 25px;
  height: 25px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #7c8b9b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.search-close-button:hover {
  background: #f1f5f8;
  color: #17324d;
}

.admin-content {
  padding: 34px 39px 55px;
  max-width: 1500px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 29px;
}

.section-kicker,
.panel-kicker {
  color: #5680a7;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.welcome-section h2 {
  margin: 7px 0 6px;
  color: #12304f;
  font-size: 27px;
  line-height: 1.2;
  letter-spacing: -0.7px;
}

.welcome-section p {
  margin: 0;
  color: #77899d;
  font-size: 12px;
  line-height: 1.7;
}

.system-status {
  height: 36px;
  padding: 0 13px;
  border-radius: 18px;
  background: #f0f9f5;
  color: #398267;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pulse {
  width: 7px;
  height: 7px;
  background: #48a47c;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(72, 164, 124, 0.1);
}

/* ============================================
   STATISTICS
============================================ */

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 17px;
}

.stat-card {
  min-height: 158px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(30, 64, 96, 0.025);
}

.stat-card.primary-stat {
  background: #07559b;
  border-color: #07559b;
  color: #ffffff;
}

.stat-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-stat .stat-icon {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.green-icon {
  color: #3d9472;
  background: #edf8f4;
}

.orange-icon {
  color: #bd7b35;
  background: #fbf4e9;
}

.purple-icon {
  color: #755da4;
  background: #f3effa;
}

.stat-label {
  color: #91a0b0;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.primary-stat .stat-label {
  color: rgba(255, 255, 255, 0.68);
}

.stat-value {
  margin-top: 20px;
  color: #183652;
  font-size: 27px;
  line-height: 1;
  font-weight: 780;
  letter-spacing: -0.8px;
}

.primary-stat .stat-value {
  color: #ffffff;
}

.stat-footer {
  margin-top: 15px;
  color: #91a0b0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
}

.primary-stat .stat-footer {
  color: rgba(255, 255, 255, 0.68);
}

.positive-value {
  color: #4a9978;
  font-weight: 700;
}

/* ============================================
   PANELS
============================================ */

.dashboard-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
  margin-bottom: 29px;
}

.dashboard-panel {
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 15px;
  padding: 23px;
  min-height: 286px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #71869c;
}

.panel-heading h3 {
  margin: 5px 0 0;
  color: #183652;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.2px;
}

.activity-summary {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-total {
  display: flex;
  flex-direction: column;
}

.activity-total strong {
  color: #183652;
  font-size: 27px;
  letter-spacing: -0.7px;
}

.activity-total span {
  margin-top: 5px;
  color: #91a0b0;
  font-size: 10px;
}

.activity-chart {
  width: 91px;
  height: 91px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: conic-gradient(#07559b 0% 65%, #e9eef4 65% 100%);
  position: relative;
}

.chart-ring::after {
  content: '';
  position: absolute;
  inset: 9px;
  background: #ffffff;
  border-radius: 50%;
}

.ring-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.ring-content strong {
  color: #173652;
  font-size: 15px;
}

.ring-content span {
  color: #91a0b0;
  font-size: 8px;
  margin-top: 2px;
}

.status-list {
  margin-top: 22px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #708399;
  font-size: 10px;
}

.status-row strong {
  color: #27445f;
  font-size: 11px;
}

.status-row-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-indicator.active {
  background: #4ba47c;
}

.status-indicator.inactive {
  background: #b9c3cd;
}

.status-progress {
  height: 5px;
  background: #edf1f5;
  border-radius: 5px;
  overflow: hidden;
  margin: 7px 0 13px;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
}

.active-fill {
  background: #4ba47c;
}

.inactive-fill {
  background: #b8c1ca;
}

.composition-list {
  margin-top: 26px;
}

.composition-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.composition-icon {
  width: 41px;
  height: 41px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.composition-icon.customer {
  background: #eaf3fb;
  color: #07559b;
}

.composition-icon.admin {
  background: #f3effa;
  color: #755da4;
}

.composition-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.composition-details strong {
  color: #29445e;
  font-size: 11px;
}

.composition-details span {
  color: #93a1af;
  font-size: 9px;
  margin-top: 4px;
}

.composition-number {
  color: #173652;
  font-size: 17px;
}

.composition-divider {
  height: 1px;
  background: #edf1f5;
  margin: 18px 0;
}

.admin-notice {
  margin-top: 20px;
  border-radius: 10px;
  background: #f6f9fc;
  padding: 11px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #07559b;
}

.admin-notice div {
  display: flex;
  flex-direction: column;
}

.admin-notice strong {
  color: #36536e;
  font-size: 9px;
}

.admin-notice span {
  color: #8b9aaa;
  font-size: 8px;
  margin-top: 3px;
  line-height: 1.4;
}

/* ============================================
   QUICK ACTIONS
============================================ */

.quick-section {
  margin-top: 3px;
}

.section-heading-row {
  margin-bottom: 13px;
}

.section-heading-row h3 {
  margin: 5px 0 0;
  color: #183652;
  font-size: 17px;
  font-weight: 750;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.quick-action {
  min-height: 82px;
  padding: 14px 15px;
  border: 1px solid #e5edf5;
  background: #ffffff;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.quick-action:hover {
  transform: translateY(-2px);
  border-color: #cdddeb;
  box-shadow: 0 7px 20px rgba(30, 64, 96, 0.06);
}

.quick-action-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-action div:nth-child(2) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.quick-action strong {
  color: #29445e;
  font-size: 10px;
}

.quick-action span {
  color: #91a0b0;
  font-size: 8px;
  margin-top: 4px;
  line-height: 1.35;
}

.quick-action > svg {
  color: #a3b1bf;
  flex-shrink: 0;
}

.quick-action-count {
  min-width: 23px;
  height: 23px;
  padding: 0 7px;
  border-radius: 12px;
  background: #eaf3fb;
  color: #07559b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
  flex-shrink: 0;
}

/* ============================================
   LOADING / ERROR
============================================ */

.loading-state,
.error-state {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-spinner {
  width: 38px;
  height: 38px;
  border: 3px solid #e4edf5;
  border-top-color: #07559b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state h2,
.error-state h2 {
  margin: 20px 0 6px;
  color: #183652;
  font-size: 18px;
}

.loading-state p,
.error-state p {
  margin: 0;
  max-width: 430px;
  color: #8a9bad;
  font-size: 11px;
  line-height: 1.6;
}

.error-icon {
  width: 53px;
  height: 53px;
  border-radius: 15px;
  background: #fdf0f0;
  color: #d15b5b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.retry-button {
  margin-top: 20px;
  border: 0;
  background: #07559b;
  color: #ffffff;
  border-radius: 9px;
  padding: 11px 19px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* ============================================
   RESPONSIVE
============================================ */

@media (max-width: 1100px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 850px) {
  .admin-content {
    padding: 29px 22px 45px;
  }

  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .admin-content {
    padding: 24px 15px 40px;
  }

  .admin-dashboard-toolbar {
    justify-content: stretch;
  }

  .admin-header-search {
    width: 100%;
  }

  .welcome-section {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .welcome-section h2 {
    font-size: 23px;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    min-height: 145px;
  }

  .dashboard-panel {
    padding: 19px;
  }

  .system-status {
    height: 33px;
  }
}

/* ============================================
   CARD MANAGEMENT
============================================ */

.card-management-section {
  margin-top: 26px;
  padding: 26px;
  background: #ffffff;
  border: 1px solid #e4ebf3;
  border-radius: 16px;
}

.section-description {
  margin: 6px 0 0;
  color: #8191a3;
  font-size: 12px;
  line-height: 1.5;
}

.refresh-cards-button {
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid #dfe7ef;
  border-radius: 9px;
  background: #ffffff;
  color: #526a82;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.refresh-cards-button:hover {
  background: #f5f9fd;
  color: #07559b;
}

.refresh-cards-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: card-refresh-spin 0.9s linear infinite;
}

@keyframes card-refresh-spin {
  to {
    transform: rotate(360deg);
  }
}

.card-action-error {
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid #f2caca;
  border-radius: 10px;
  background: #fff6f6;
  color: #b74343;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
}

.card-action-error span {
  flex: 1;
}

.card-action-error button {
  width: 25px;
  height: 25px;
  border: 0;
  background: transparent;
  color: #b74343;
  font-size: 18px;
  cursor: pointer;
}

.cards-management-loading,
.cards-management-empty {
  margin-top: 18px;
  min-height: 90px;
  border: 1px dashed #dce5ee;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  color: #8191a3;
  font-size: 12px;
}

.cards-management-empty {
  justify-content: flex-start;
  padding: 18px;
}

.cards-management-empty > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cards-management-empty strong {
  color: #314b65;
  font-size: 12px;
}
.cards-management-empty span {
  color: #8797a8;
  font-size: 11px;
}

.admin-card-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-card-row {
  padding: 16px;
  border: 1px solid #e5ecf3;
  border-radius: 12px;
  background: #fbfdff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.admin-card-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 13px;
}

.admin-card-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 10px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-card-details {
  min-width: 0;
}

.admin-card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-card-title-row strong {
  color: #203b57;
  font-size: 13px;
  letter-spacing: 0.2px;
}

.admin-card-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.admin-card-status.active {
  background: #eaf8f0;
  color: #278152;
}
.admin-card-status.blocked {
  background: #fff5e8;
  color: #b56a18;
}
.admin-card-status.expired {
  background: #f1f3f6;
  color: #7a8795;
}
.admin-card-status.cancelled {
  background: #fff0f0;
  color: #b44b4b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.admin-card-meta {
  margin-top: 7px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px 14px;
  color: #8292a4;
  font-size: 10px;
}

.admin-card-meta span:not(:last-child)::after {
  content: '•';
  margin-left: 14px;
  color: #c2ccd6;
}

.admin-card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  flex-shrink: 0;
}

.card-control-button {
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 750;
  cursor: pointer;
}

.card-control-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.card-control-button.freeze {
  border: 1px solid #e7cfae;
  background: #fffaf3;
  color: #9a651f;
}
.card-control-button.freeze:hover:not(:disabled) {
  background: #fff1dc;
}
.card-control-button.activate {
  border: 1px solid #bfe3cd;
  background: #f2fbf6;
  color: #287c50;
}
.card-control-button.activate:hover:not(:disabled) {
  background: #e5f7ed;
}
.card-control-button.cancel {
  border: 1px solid #efc9c9;
  background: #fff7f7;
  color: #b34a4a;
}
.card-control-button.cancel:hover:not(:disabled) {
  background: #ffeded;
}
.card-no-actions {
  color: #9aa7b4;
  font-size: 10px;
  font-weight: 650;
}

@media (max-width: 900px) {
  .admin-header-search {
    min-width: 220px;
  }

  .admin-card-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .admin-card-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .card-management-section {
    padding: 18px;
  }
  .card-management-section .section-heading-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
  .admin-card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .admin-card-meta span:not(:last-child)::after {
    display: none;
  }
  .admin-card-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .card-control-button {
    width: 100%;
  }
}
</style>




