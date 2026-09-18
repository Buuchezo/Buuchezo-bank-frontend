<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Copy,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Send,
  Settings,
  WalletCards,
  Wifi,
} from 'lucide-vue-next'

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

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

const API_BASE_URL = 'http://13.48.104.209:8084'

const router = useRouter()

const mobileMenuOpen = ref(false)
const loading = ref(true)
const errorMessage = ref('')
const copied = ref(false)

const account = ref<Account>({
  id: 0,
  accountNumber: '',
  balance: 0,
  currency: 'EUR',
  accountType: '',
  accountStatus: '',
  ownerEmail: '',
  createdAt: '',
})

const user = ref({
  firstName: '',
  lastName: '',
  email: '',
})

const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`.trim()
})

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase() || 'U'
})

const maskedAccountNumber = computed(() => {
  const number = account.value.accountNumber || ''

  if (!number) {
    return '•••• ••••'
  }

  if (number.length <= 4) {
    return `•••• ${number}`
  }

  return `•••• •••• ${number.slice(-4)}`
})

const accountTypeLabel = computed(() => {
  if (!account.value.accountType) {
    return 'Bank Account'
  }

  return account.value.accountType
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const accountStatusLabel = computed(() => {
  if (!account.value.accountStatus) {
    return 'Unknown'
  }

  return account.value.accountStatus
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const formattedBalance = computed(() => {
  return formatMoney(account.value.balance)
})

const formattedCreatedAt = computed(() => {
  if (!account.value.createdAt) {
    return '—'
  }

  const date = new Date(account.value.createdAt)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
})

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: account.value.currency || 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function navigateTo(path: string) {
  mobileMenuOpen.value = false
  router.push(path)
}

async function copyAccountNumber() {
  if (!account.value.accountNumber) {
    return
  }

  try {
    await navigator.clipboard.writeText(account.value.accountNumber)

    copied.value = true

    window.setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch (error) {
    console.error('Could not copy account number:', error)
  }
}

async function loadAccount() {
  loading.value = true
  errorMessage.value = ''

  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')

  if (!token) {
    await router.push('/login')
    return
  }

  try {
    /*
     * We first load /api/users/me because it gives us
     * both the logged-in user and their account.
     */
    const response = await fetch(
      `${API_BASE_URL}/api/users/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('user')

      await router.push('/login')
      return
    }

    const result: ApiResponse<{
      user: {
        id: number
        email: string
        firstName: string
        lastName: string
        enabled: boolean
        roles: {
          id: number
          name: string
        }[]
        createdAt: string
      }
      account: Account
    }> = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || 'Unable to load your account.'
      )
    }

    user.value = {
      firstName: result.data.user.firstName,
      lastName: result.data.user.lastName,
      email: result.data.user.email,
    }

    account.value = result.data.account
  } catch (error) {
    console.error('Account loading failed:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to load your account.'
  } finally {
    loading.value = false
  }
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}

onMounted(loadAccount)
</script>

<template>
  <div class="accounts-page">
    <!-- Mobile overlay -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="mobileMenuOpen = false"
    />

    <!-- SIDEBAR -->
    <aside
      class="sidebar"
      :class="{ 'sidebar-open': mobileMenuOpen }"
    >
      <div class="sidebar-top">
        <RouterLink
          to="/"
          class="dashboard-logo"
          @click="mobileMenuOpen = false"
        >
          <span>B</span>
          <strong>Buuchezo Bank</strong>
        </RouterLink>

        <button
          class="mobile-close"
          type="button"
          aria-label="Close menu"
          @click="mobileMenuOpen = false"
        >
          ×
        </button>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section-title">MAIN</p>

        <RouterLink
          to="/dashboard"
          class="nav-item"
          @click="mobileMenuOpen = false"
        >
          <LayoutDashboard :size="19" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink
          to="/accounts"
          class="nav-item active"
          @click="mobileMenuOpen = false"
        >
          <WalletCards :size="19" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink
          to="/transactions"
          class="nav-item"
          @click="mobileMenuOpen = false"
        >
          <ArrowLeftRight :size="19" />
          <span>Transactions</span>
        </RouterLink>

        <a
          href="#"
          class="nav-item"
          @click.prevent
        >
          <CreditCard :size="19" />
          <span>Cards</span>
        </a>

        <p class="nav-section-title second">SERVICES</p>

        <RouterLink
          to="/transfers"
          class="nav-item"
          @click="mobileMenuOpen = false"
        >
          <Send :size="19" />
          <span>Transfers</span>
        </RouterLink>

        <a
          href="#"
          class="nav-item"
          @click.prevent
        >
          <Settings :size="19" />
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-bottom">
        <div class="support-box">
          <div class="support-icon">
            <HelpCircle :size="18" />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>
        </div>

        <button
          type="button"
          class="logout-button"
          @click="logout"
        >
          <LogOut :size="18" />
          <span>Log out</span>
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main-content">
      <!-- HEADER -->
      <header class="dashboard-header">
        <div class="header-left">
          <button
            type="button"
            class="mobile-menu-button"
            aria-label="Open menu"
            @click="mobileMenuOpen = true"
          >
            <Menu :size="22" />
          </button>

          <div>
            <span class="page-label">BANKING</span>
            <h1>Accounts</h1>
          </div>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="notification-button"
            aria-label="Notifications"
          >
            <Bell :size="20" />
            <span class="notification-dot" />
          </button>

          <div class="profile">
            <div class="avatar">
              {{ userInitials }}
            </div>

            <div class="profile-info">
              <strong>{{ fullName || 'Account holder' }}</strong>
              <span>{{ user.email || '—' }}</span>
            </div>

            <ChevronDown
              :size="16"
              class="profile-chevron"
            />
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <section class="content">
        <div class="page-intro">
          <div>
            <p class="eyebrow">YOUR ACCOUNTS</p>
            <h2>Manage your money</h2>
            <p class="intro-text">
              View your account details, balance and account status.
            </p>
          </div>

          <RouterLink
            to="/transfers"
            class="primary-action"
          >
            <Send :size="17" />
            Make a transfer
          </RouterLink>
        </div>

        <!-- ERROR -->
        <div
          v-if="errorMessage"
          class="error-box"
        >
          <strong>Something went wrong</strong>
          <span>{{ errorMessage }}</span>

          <button
            type="button"
            @click="loadAccount"
          >
            Try again
          </button>
        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="loading-card"
        >
          <div class="spinner" />
          <p>Loading your account...</p>
        </div>

        <template v-else-if="!errorMessage">
          <!-- ACCOUNT HERO CARD -->
          <section class="account-hero-card">
            <div class="account-hero-content">
              <div class="account-heading">
                <div class="account-icon">
                  <WalletCards :size="23" />
                </div>

                <div>
                  <span class="small-label">
                    {{ accountTypeLabel }}
                  </span>

                  <h3>{{ maskedAccountNumber }}</h3>
                </div>
              </div>

              <div class="account-balance">
                <span>Available balance</span>
                <strong>{{ formattedBalance }}</strong>
              </div>
            </div>

            <div class="account-hero-bottom">
              <div class="status-wrapper">
                <span
                  class="status-dot"
                  :class="{
                    active:
                      account.accountStatus === 'ACTIVE',
                  }"
                />

                <span>
                  {{ accountStatusLabel }}
                </span>
              </div>

              <span>
                {{ account.currency || 'EUR' }}
              </span>
            </div>
          </section>

          <!-- INFORMATION CARDS -->
          <section class="information-grid">
            <article class="information-card">
              <div class="information-card-top">
                <div class="information-icon blue">
                  <WalletCards :size="20" />
                </div>

                <span class="card-label">ACCOUNT NUMBER</span>
              </div>

              <div class="account-number-row">
                <strong>
                  {{ account.accountNumber || '—' }}
                </strong>

                <button
                  type="button"
                  class="copy-button"
                  :aria-label="
                    copied
                      ? 'Account number copied'
                      : 'Copy account number'
                  "
                  @click="copyAccountNumber"
                >
                  <Copy :size="16" />
                </button>
              </div>

              <span class="card-description">
                Your unique account number.
              </span>

              <span
                v-if="copied"
                class="copied-message"
              >
                Account number copied
              </span>
            </article>

            <article class="information-card">
              <div class="information-card-top">
                <div class="information-icon green">
                  <ArrowDownLeft :size="20" />
                </div>

                <span class="card-label">ACCOUNT STATUS</span>
              </div>

              <strong class="large-value">
                {{ accountStatusLabel }}
              </strong>

              <span class="card-description">
                Current status of your bank account.
              </span>
            </article>

            <article class="information-card">
              <div class="information-card-top">
                <div class="information-icon purple">
                  <CreditCard :size="20" />
                </div>

                <span class="card-label">ACCOUNT TYPE</span>
              </div>

              <strong class="large-value">
                {{ accountTypeLabel }}
              </strong>

              <span class="card-description">
                Your registered account type.
              </span>
            </article>

            <article class="information-card">
              <div class="information-card-top">
                <div class="information-icon orange">
                  <ArrowUpRight :size="20" />
                </div>

                <span class="card-label">OPENED</span>
              </div>

              <strong class="large-value date-value">
                {{ formattedCreatedAt }}
              </strong>

              <span class="card-description">
                Account creation date.
              </span>
            </article>
          </section>

          <!-- QUICK ACTIONS -->
          <section class="quick-actions-section">
            <div class="section-heading">
              <div>
                <p class="eyebrow">QUICK ACTIONS</p>
                <h2>What would you like to do?</h2>
              </div>
            </div>

            <div class="quick-actions">
              <RouterLink
                to="/transfers"
                class="quick-action"
              >
                <div class="quick-action-icon blue-icon">
                  <Send :size="21" />
                </div>

                <div>
                  <strong>Send money</strong>
                  <span>
                    Transfer money to another account.
                  </span>
                </div>

                <ArrowUpRight :size="18" />
              </RouterLink>

              <RouterLink
                to="/transactions"
                class="quick-action"
              >
                <div class="quick-action-icon purple-icon">
                  <ArrowLeftRight :size="21" />
                </div>

                <div>
                  <strong>View transactions</strong>
                  <span>
                    Review your transaction history.
                  </span>
                </div>

                <ArrowUpRight :size="18" />
              </RouterLink>

              <RouterLink
                to="/dashboard"
                class="quick-action"
              >
                <div class="quick-action-icon green-icon">
                  <LayoutDashboard :size="21" />
                </div>

                <div>
                  <strong>Back to overview</strong>
                  <span>
                    Return to your banking dashboard.
                  </span>
                </div>

                <ArrowUpRight :size="18" />
              </RouterLink>
            </div>
          </section>

          <!-- CARD PREVIEW -->
          <section class="bank-card-section">
            <div class="section-heading">
              <div>
                <p class="eyebrow">CARD</p>
                <h2>Your bank card</h2>
              </div>
            </div>

            <div class="bank-card">
              <div class="card-top">
                <div class="card-brand">
                  <span>B</span>
                  <strong>Buuchezo</strong>
                </div>

                <Wifi
                  :size="24"
                  class="contactless"
                />
              </div>

              <div class="chip">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div class="card-number">
                •••• &nbsp; •••• &nbsp; •••• &nbsp; 3456
              </div>

              <div class="card-bottom">
                <div>
                  <span>ACCOUNT HOLDER</span>
                  <strong>
                    {{ fullName || 'ACCOUNT HOLDER' }}
                  </strong>
                </div>

                <div>
                  <span>VALID THRU</span>
                  <strong>12/29</strong>
                </div>

                <div class="visa">
                  VISA
                </div>
              </div>
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

.accounts-page {
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

/* =========================
   SIDEBAR
========================= */

.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e8edf4;
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 50;
}

.sidebar-top {
  padding: 27px 24px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-logo {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: #10243e;
}

.dashboard-logo span {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: #07559b;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 19px;
  font-weight: 800;
}

.dashboard-logo strong {
  font-size: 16px;
  letter-spacing: -0.3px;
}

.mobile-close {
  display: none;
  border: 0;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
  color: #50647b;
}

.sidebar-nav {
  flex: 1;
  padding: 15px 14px;
}

.nav-section-title {
  margin: 0 12px 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #9aa8b8;
}

.nav-section-title.second {
  margin-top: 29px;
}

.nav-item {
  min-height: 45px;
  padding: 0 13px;
  margin: 4px 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: #64758a;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.nav-item:hover {
  background: #f1f6fb;
  color: #07559b;
}

.nav-item.active {
  background: #eaf3fb;
  color: #07559b;
}

.sidebar-bottom {
  padding: 18px 15px 21px;
}

.support-box {
  background: #f4f8fc;
  border-radius: 13px;
  padding: 14px 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.support-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #ffffff;
  color: #07559b;
  display: grid;
  place-items: center;
}

.support-box strong,
.support-box span {
  display: block;
}

.support-box strong {
  color: #243b55;
  font-size: 11px;
  margin-bottom: 3px;
}

.support-box span {
  color: #8998a9;
  font-size: 10px;
}

.logout-button {
  width: 100%;
  height: 43px;
  border: 0;
  background: transparent;
  color: #718198;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 13px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.logout-button:hover {
  background: #f7f9fb;
  color: #d34d4d;
}

/* =========================
   MAIN
========================= */

.main-content {
  flex: 1;
  margin-left: 250px;
  min-width: 0;
}

.dashboard-header {
  height: 88px;
  background: #ffffff;
  border-bottom: 1px solid #e9eef4;
  padding: 0 39px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-label {
  display: block;
  color: #99a8b8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.header-left h1 {
  margin: 0;
  color: #122a45;
  font-size: 22px;
  letter-spacing: -0.5px;
}

.mobile-menu-button {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid #e4eaf1;
  border-radius: 9px;
  background: #ffffff;
  color: #28445f;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 22px;
}

.notification-button {
  width: 40px;
  height: 40px;
  border: 1px solid #e7ecf2;
  border-radius: 50%;
  background: #ffffff;
  color: #64778d;
  position: relative;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.notification-dot {
  width: 7px;
  height: 7px;
  background: #ef5c5c;
  border: 2px solid #ffffff;
  border-radius: 50%;
  position: absolute;
  right: 7px;
  top: 6px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background: #07559b;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
}

.profile-info strong,
.profile-info span {
  display: block;
}

.profile-info strong {
  color: #253c55;
  font-size: 12px;
  margin-bottom: 2px;
}

.profile-info span {
  color: #9aa7b5;
  font-size: 10px;
}

.profile-chevron {
  color: #9aa8b8;
}

/* =========================
   CONTENT
========================= */

.content {
  padding: 34px 39px 60px;
  max-width: 1400px;
}

.page-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 25px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 7px;
  color: #07559b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.page-intro h2,
.section-heading h2 {
  margin: 0;
  color: #122a45;
  font-size: 25px;
  letter-spacing: -0.7px;
}

.intro-text {
  margin: 8px 0 0;
  color: #8b9bad;
  font-size: 13px;
}

.primary-action {
  min-height: 43px;
  padding: 0 17px;
  background: #07559b;
  color: #ffffff;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 7px 17px rgba(7, 85, 155, 0.16);
}

.primary-action:hover {
  background: #06477f;
}

/* =========================
   ERROR / LOADING
========================= */

.error-box {
  padding: 18px 20px;
  background: #fff3f3;
  border: 1px solid #f2d3d3;
  border-radius: 12px;
  margin-bottom: 22px;
  color: #9e4545;
}

.error-box strong,
.error-box span {
  display: block;
}

.error-box strong {
  font-size: 13px;
  margin-bottom: 5px;
}

.error-box span {
  font-size: 12px;
  margin-bottom: 13px;
}

.error-box button {
  border: 0;
  background: #a94b4b;
  color: #ffffff;
  padding: 8px 13px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.loading-card {
  min-height: 260px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e7edf4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8796a7;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #dce7f1;
  border-top-color: #07559b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 13px;
}

.loading-card p {
  margin: 0;
  font-size: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   ACCOUNT HERO
========================= */

.account-hero-card {
  border-radius: 18px;
  padding: 28px 30px 22px;
  background:
    radial-gradient(
      circle at 80% 15%,
      rgba(61, 141, 219, 0.3),
      transparent 28%
    ),
    linear-gradient(
      130deg,
      #063d74 0%,
      #07559b 52%,
      #143fbd 100%
    );
  color: #ffffff;
  box-shadow: 0 15px 35px rgba(8, 57, 103, 0.16);
  margin-bottom: 23px;
  overflow: hidden;
  position: relative;
}

.account-hero-card::after {
  content: "";
  width: 270px;
  height: 270px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  position: absolute;
  right: -90px;
  bottom: -150px;
}

.account-hero-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.account-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.account-icon {
  width: 49px;
  height: 49px;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.13);
  display: grid;
  place-items: center;
}

.small-label {
  display: block;
  color: rgba(255, 255, 255, 0.66);
  font-size: 9px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1.4px;
  margin-bottom: 7px;
}

.account-heading h3 {
  margin: 0;
  font-size: 21px;
  letter-spacing: 1px;
}

.account-balance {
  text-align: right;
}

.account-balance span {
  display: block;
  color: rgba(255, 255, 255, 0.67);
  font-size: 10px;
  margin-bottom: 7px;
}

.account-balance strong {
  font-size: 31px;
  letter-spacing: -1px;
}

.account-hero-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.13);
  margin-top: 26px;
  padding-top: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.67);
  font-size: 10px;
  position: relative;
  z-index: 1;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 7px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f0b14a;
}

.status-dot.active {
  background: #65d695;
}

/* =========================
   INFORMATION GRID
========================= */

.information-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 37px;
}

.information-card {
  min-height: 158px;
  background: #ffffff;
  border: 1px solid #e7edf4;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 5px 16px rgba(29, 59, 89, 0.035);
}

.information-card-top {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 18px;
}

.information-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
}

.information-icon.blue {
  color: #07559b;
  background: #eaf3fb;
}

.information-icon.green {
  color: #299267;
  background: #eaf8f2;
}

.information-icon.purple {
  color: #7356a9;
  background: #f2edfa;
}

.information-icon.orange {
  color: #c17a32;
  background: #fff4e7;
}

.card-label {
  color: #9ba8b6;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.account-number-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.account-number-row strong {
  color: #243b55;
  font-size: 15px;
  letter-spacing: 0.8px;
  word-break: break-all;
}

.copy-button {
  width: 30px;
  height: 30px;
  border: 1px solid #e5ebf1;
  border-radius: 7px;
  background: #ffffff;
  color: #718399;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.copy-button:hover {
  color: #07559b;
  border-color: #c9ddec;
  background: #f6faff;
}

.large-value {
  display: block;
  color: #243b55;
  font-size: 17px;
  line-height: 1.25;
}

.date-value {
  font-size: 14px;
}

.card-description {
  display: block;
  color: #9aa7b5;
  font-size: 10px;
  margin-top: 8px;
  line-height: 1.5;
}

.copied-message {
  display: block;
  color: #299267;
  font-size: 10px;
  margin-top: 7px;
}

/* =========================
   QUICK ACTIONS
========================= */

.quick-actions-section {
  margin-bottom: 38px;
}

.section-heading {
  margin-bottom: 17px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.quick-action {
  min-height: 82px;
  padding: 15px;
  border-radius: 13px;
  background: #ffffff;
  border: 1px solid #e7edf4;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #203a54;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(28, 60, 90, 0.07);
}

.quick-action > div:nth-child(2) {
  flex: 1;
}

.quick-action strong,
.quick-action span {
  display: block;
}

.quick-action strong {
  font-size: 12px;
  margin-bottom: 4px;
}

.quick-action span {
  color: #9aa7b5;
  font-size: 10px;
  line-height: 1.4;
}

.quick-action > svg:last-child {
  color: #9ba9b8;
}

.quick-action-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  display: grid;
  place-items: center;
}

.blue-icon {
  color: #07559b;
  background: #eaf3fb;
}

.purple-icon {
  color: #7356a9;
  background: #f2edfa;
}

.green-icon {
  color: #299267;
  background: #eaf8f2;
}

/* =========================
   CARD
========================= */

.bank-card-section {
  padding-bottom: 20px;
}

.bank-card {
  width: min(100%, 450px);
  min-height: 255px;
  border-radius: 19px;
  padding: 25px 27px 23px;
  background:
    radial-gradient(
      circle at 88% 15%,
      rgba(85, 164, 231, 0.34),
      transparent 27%
    ),
    linear-gradient(
      130deg,
      #063d74 0%,
      #07559b 50%,
      #143fbd 100%
    );
  color: #ffffff;
  box-shadow: 0 18px 35px rgba(8, 57, 103, 0.18);
  position: relative;
  overflow: hidden;
}

.bank-card::before {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  right: -65px;
  top: -95px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-brand span {
  width: 27px;
  height: 27px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.15);
  font-size: 14px;
  font-weight: 800;
}

.card-brand strong {
  font-size: 12px;
  letter-spacing: 0.2px;
}

.contactless {
  transform: rotate(90deg);
  opacity: 0.85;
}

.chip {
  width: 39px;
  height: 29px;
  border-radius: 6px;
  background: #d7b66e;
  margin-top: 34px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  padding: 5px;
  overflow: hidden;
}

.chip span {
  border: 1px solid rgba(72, 58, 24, 0.38);
  border-radius: 2px;
}

.card-number {
  margin-top: 20px;
  font-family: "Courier New", monospace;
  font-size: 17px;
  letter-spacing: 1.2px;
}

.card-bottom {
  display: flex;
  align-items: flex-end;
  gap: 27px;
  margin-top: 20px;
}

.card-bottom span,
.card-bottom strong {
  display: block;
}

.card-bottom span {
  color: rgba(255, 255, 255, 0.52);
  font-size: 6px;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.card-bottom strong {
  font-size: 8px;
  letter-spacing: 0.8px;
}

.visa {
  margin-left: auto;
  font-size: 19px;
  font-style: italic;
  font-weight: 800;
}

/* =========================
   MOBILE
========================= */

.mobile-overlay {
  display: none;
}

@media (max-width: 1100px) {
  .information-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 850px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 15px 0 40px rgba(20, 45, 72, 0.12);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(11, 31, 52, 0.35);
    z-index: 40;
  }

  .mobile-close {
    display: block;
  }

  .main-content {
    margin-left: 0;
  }

  .mobile-menu-button {
    display: flex;
  }

  .dashboard-header {
    padding: 0 22px;
  }

  .content {
    padding: 28px 22px 50px;
  }
}

@media (max-width: 650px) {
  .dashboard-header {
    height: 75px;
  }

  .header-left h1 {
    font-size: 19px;
  }

  .profile-info,
  .profile-chevron {
    display: none;
  }

  .header-right {
    gap: 10px;
  }

  .page-intro {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-intro h2,
  .section-heading h2 {
    font-size: 22px;
  }

  .primary-action {
    width: 100%;
    justify-content: center;
  }

  .account-hero-card {
    padding: 23px 20px 19px;
  }

  .account-hero-content {
    flex-direction: column;
  }

  .account-balance {
    text-align: left;
  }

  .account-balance strong {
    font-size: 27px;
  }

  .information-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .bank-card {
    min-height: 230px;
    padding: 21px 22px;
  }

  .card-number {
    font-size: 14px;
  }

  .card-bottom {
    gap: 15px;
  }
}

@media (max-width: 430px) {
  .content {
    padding-left: 16px;
    padding-right: 16px;
  }

  .dashboard-header {
    padding: 0 16px;
  }

  .account-heading h3 {
    font-size: 17px;
  }

  .account-balance strong {
    font-size: 24px;
  }

  .bank-card {
    min-height: 210px;
  }

  .chip {
    margin-top: 25px;
  }

  .card-number {
    margin-top: 14px;
  }

  .card-bottom {
    margin-top: 15px;
  }
}
</style>
