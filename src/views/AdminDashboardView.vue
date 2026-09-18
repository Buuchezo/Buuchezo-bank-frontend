<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  WalletCards,
  ArrowLeftRight,
  Settings,
  LogOut,
  Menu,
  X,
  UserRound,
  Bell,
  Search,
  UserCheck,
  CreditCard,
  ShieldCheck,
  Activity,
  ChevronRight,
} from 'lucide-vue-next'

const router = useRouter()

const API_BASE_URL = 'http://13.48.104.209:8084'

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
const mobileMenuOpen = ref(false)

const fullName = computed(() => {
  if (!currentUser.value) {
    return 'Administrator'
  }

  return `${currentUser.value.firstName} ${currentUser.value.lastName}`
})

const initials = computed(() => {
  if (!currentUser.value) {
    return 'A'
  }

  const first = currentUser.value.firstName?.charAt(0) || ''
  const last = currentUser.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase()
})

const activePercentage = computed(() => {
  if (statistics.value.totalUsers === 0) {
    return 0
  }

  return Math.round(
    (statistics.value.activeUsers / statistics.value.totalUsers) * 100,
  )
})

const inactivePercentage = computed(() => {
  if (statistics.value.totalUsers === 0) {
    return 0
  }

  return Math.round(
    (statistics.value.inactiveUsers / statistics.value.totalUsers) * 100,
  )
})

const customerPercentage = computed(() => {
  if (statistics.value.totalUsers === 0) {
    return 0
  }

  return Math.round(
    (statistics.value.customersCount / statistics.value.totalUsers) * 100,
  )
})

function getAccessToken(): string | null {
  return (
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')
  )
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}

async function loadCurrentUser() {
  const token = getAccessToken()

  if (!token) {
    router.push('/login')
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
    router.push('/login')
    return
  }

  const response = await fetch(
    `${API_BASE_URL}/api/users/admin/stats`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (response.status === 401) {
    logout()
    return
  }

  if (response.status === 403) {
    errorMessage.value =
      'You do not have permission to access the administration area.'
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
    averageAccountPerUser: Number(
      result.data.averageAccountPerUser ?? 0,
    ),
    customersCount: Number(result.data.customersCount ?? 0),
    adminsCount: Number(result.data.adminsCount ?? 0),
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

    await loadStatistics()
  } catch (error) {
    console.error('Failed to load admin dashboard:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading the dashboard.'
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
  <div class="admin-layout">
    <!-- Mobile Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="admin-sidebar"
      :class="{ 'sidebar-open': mobileMenuOpen }"
    >
      <div class="sidebar-top">
        <!-- Logo -->
        <RouterLink to="/" class="admin-logo">
          <span class="logo-mark">B</span>

          <div class="logo-text">
            <strong>Buuchezo</strong>
            <span>Bank</span>
          </div>
        </RouterLink>

        <!-- Mobile Close -->
        <button
          class="mobile-close"
          type="button"
          @click="mobileMenuOpen = false"
        >
          <X :size="22" />
        </button>

        <!-- Navigation -->
        <nav class="admin-navigation">
          <p class="navigation-label">ADMINISTRATION</p>

          <RouterLink
            to="/admin/dashboard"
            class="admin-nav-link active"
            @click="mobileMenuOpen = false"
          >
            <LayoutDashboard :size="19" />
            <span>Overview</span>
          </RouterLink>

          <RouterLink
            to="/admin/users"
            class="admin-nav-link"
            @click="mobileMenuOpen = false"
          >
            <Users :size="19" />
            <span>Users</span>
          </RouterLink>

          <RouterLink
            to="/admin/accounts"
            class="admin-nav-link"
            @click="mobileMenuOpen = false"
          >
            <WalletCards :size="19" />
            <span>Accounts</span>
          </RouterLink>

          <RouterLink
            to="/admin/transactions"
            class="admin-nav-link"
            @click="mobileMenuOpen = false"
          >
            <ArrowLeftRight :size="19" />
            <span>Transactions</span>
          </RouterLink>

          <p class="navigation-label second-label">SYSTEM</p>

          <RouterLink
            to="/settings"
            class="admin-nav-link"
            @click="mobileMenuOpen = false"
          >
            <Settings :size="19" />
            <span>Settings</span>
          </RouterLink>
        </nav>
      </div>

      <!-- Sidebar Bottom -->
      <div class="sidebar-bottom">
        <div class="admin-support">
          <div class="support-icon">
            <ShieldCheck :size="18" />
          </div>

          <div>
            <strong>Admin Area</strong>
            <span>Secure access</span>
          </div>
        </div>

        <button
          type="button"
          class="logout-button"
          @click="logout"
        >
          <LogOut :size="18" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="admin-main">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <button
            type="button"
            class="mobile-menu-button"
            @click="mobileMenuOpen = true"
          >
            <Menu :size="23" />
          </button>

          <div>
            <span class="page-overline">ADMINISTRATION</span>
            <h1>Overview</h1>
          </div>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="header-icon-button"
            title="Search"
          >
            <Search :size="19" />
          </button>

          <button
            type="button"
            class="header-icon-button notification-button"
            title="Notifications"
          >
            <Bell :size="19" />
            <span class="notification-dot"></span>
          </button>

          <div class="header-profile">
            <div class="profile-avatar">
              {{ initials }}
            </div>

            <div class="profile-info">
              <strong>{{ fullName }}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
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

          <button
            type="button"
            class="retry-button"
            @click="loadDashboard"
          >
            Try again
          </button>
        </div>

        <!-- Dashboard -->
        <template v-else>
          <!-- Welcome -->
          <section class="welcome-section">
            <div>
              <span class="section-kicker">BANK OPERATIONS</span>

              <h2>Good morning, {{ currentUser?.firstName }}.</h2>

              <p>
                Monitor your banking platform, users and accounts
                from one central workspace.
              </p>
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
                <span>
                  Registered users
                </span>

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
                <span class="positive-value">
                  Active
                </span>
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
                    class="progress-fill active-fill"
                    :style="{ width: `${activePercentage}%` }"
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
                    class="progress-fill inactive-fill"
                    :style="{ width: `${inactivePercentage}%` }"
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
                    <span>
                      {{ customerPercentage }}% of all users
                    </span>
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
                    <span>
                      Privileged platform users
                    </span>
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
                  <span>
                    Administrative actions require authorized
                    access.
                  </span>
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
              <RouterLink
                to="/admin/users"
                class="quick-action"
              >
                <div class="quick-action-icon">
                  <Users :size="21" />
                </div>

                <div>
                  <strong>Manage users</strong>
                  <span>
                    Search and manage customer accounts
                  </span>
                </div>

                <ChevronRight :size="19" />
              </RouterLink>

              <RouterLink
                to="/admin/accounts"
                class="quick-action"
              >
                <div class="quick-action-icon">
                  <WalletCards :size="21" />
                </div>

                <div>
                  <strong>Manage accounts</strong>
                  <span>
                    Review banking accounts and statuses
                  </span>
                </div>

                <ChevronRight :size="19" />
              </RouterLink>

              <RouterLink
                to="/admin/transactions"
                class="quick-action"
              >
                <div class="quick-action-icon">
                  <ArrowLeftRight :size="21" />
                </div>

                <div>
                  <strong>Transactions</strong>
                  <span>
                    Review account transaction activity
                  </span>
                </div>

                <ChevronRight :size="19" />
              </RouterLink>
            </div>
          </section>
        </template>
      </section>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-layout {
  min-height: 100vh;
  background: #f5f8fc;
  color: #10243e;
  display: flex;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* ============================================
   SIDEBAR
============================================ */

.admin-sidebar {
  width: 258px;
  min-width: 258px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e6edf5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 26px 18px 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar-top {
  width: 100%;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: #0b2848;
  margin-bottom: 43px;
  padding: 0 7px;
}

.logo-mark {
  width: 39px;
  height: 39px;
  border-radius: 11px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-text strong {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.logo-text span {
  color: #73859a;
  font-size: 11px;
  margin-top: 4px;
}

.mobile-close {
  display: none;
}

.navigation-label {
  padding: 0 12px;
  margin: 0 0 11px;
  color: #9aa9ba;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.second-label {
  margin-top: 31px;
}

.admin-navigation {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.admin-nav-link {
  min-height: 47px;
  padding: 0 13px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  color: #6c7e91;
  font-size: 13px;
  font-weight: 650;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.admin-nav-link:hover {
  background: #f2f7fc;
  color: #07559b;
}

.admin-nav-link.active {
  background: #eaf3fb;
  color: #07559b;
  font-weight: 750;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.admin-support {
  border: 1px solid #e5edf5;
  border-radius: 13px;
  padding: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fbfdff;
}

.support-icon {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-support div:last-child {
  display: flex;
  flex-direction: column;
}

.admin-support strong {
  font-size: 11px;
  color: #1d3652;
}

.admin-support span {
  margin-top: 3px;
  color: #91a0b0;
  font-size: 9px;
}

.logout-button {
  border: 0;
  background: transparent;
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #7d8d9e;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  border-radius: 10px;
  text-align: left;
}

.logout-button:hover {
  background: #f6f8fb;
  color: #d14e4e;
}

/* ============================================
   MAIN
============================================ */

.admin-main {
  flex: 1;
  min-width: 0;
}

.admin-header {
  height: 84px;
  background: #ffffff;
  border-bottom: 1px solid #e7edf4;
  padding: 0 39px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-overline {
  color: #8b9bac;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.header-left h1 {
  margin: 4px 0 0;
  color: #12304f;
  font-size: 25px;
  font-weight: 750;
  letter-spacing: -0.7px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 11px;
}

.header-icon-button {
  width: 39px;
  height: 39px;
  border: 1px solid #e4ebf3;
  background: #ffffff;
  color: #60748a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.header-icon-button:hover {
  color: #07559b;
  background: #f7faff;
}

.notification-dot {
  width: 6px;
  height: 6px;
  background: #e15757;
  border: 1.5px solid #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  right: 8px;
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 8px;
}

.profile-avatar {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info strong {
  color: #213a55;
  font-size: 11px;
  font-weight: 750;
}

.profile-info span {
  color: #8a9bad;
  font-size: 9px;
  margin-top: 3px;
}

.mobile-menu-button {
  display: none;
}

/* ============================================
   CONTENT
============================================ */

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
  background: conic-gradient(
    #07559b 0% var(--active, 0%),
    #e9eef4 var(--active, 0%) 100%
  );
  position: relative;
}

.chart-ring::after {
  content: "";
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
   MOBILE
============================================ */

.mobile-overlay {
  display: none;
}

@media (max-width: 1100px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 850px) {
  .admin-sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    transition: left 0.25s ease;
    box-shadow: 12px 0 30px rgba(20, 48, 78, 0.1);
  }

  .admin-sidebar.sidebar-open {
    left: 0;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(13, 36, 59, 0.35);
    z-index: 90;
  }

  .mobile-close {
    position: absolute;
    top: 24px;
    right: 17px;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 9px;
    background: #f4f7fa;
    color: #6c7e91;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .mobile-menu-button {
    width: 39px;
    height: 39px;
    border: 1px solid #e4ebf3;
    border-radius: 10px;
    background: #ffffff;
    color: #526b83;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .admin-header {
    padding: 0 22px;
  }

  .admin-content {
    padding: 29px 22px 45px;
  }

  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .admin-header {
    height: 74px;
    padding: 0 15px;
  }

  .admin-header h1 {
    font-size: 20px;
  }

  .header-right {
    gap: 6px;
  }

  .header-profile {
    margin-left: 2px;
  }

  .profile-info {
    display: none;
  }

  .header-icon-button {
    width: 35px;
    height: 35px;
  }

  .profile-avatar {
    width: 35px;
    height: 35px;
  }

  .admin-content {
    padding: 24px 15px 40px;
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
</style>
