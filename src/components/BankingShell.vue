<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  ArrowLeftRight,
  BarChart3,
  ChartCandlestick,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X
} from 'lucide-vue-next'

import NotificationDropdown from './layout/NotificationDropdownView.vue'

import buuchezoBankLogo from '../assets/images/buuchezobank-logo.png'

interface User {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  authType?: string
  authorities?: string[]
}

type NavigationMode = 'customer' | 'business' | 'admin' | 'business-onboarding'

const props = withDefaults(
  defineProps<{
    user?: User
    pageTitle: string
    pageSection?: string
    showRefresh?: boolean
    refreshing?: boolean
    admin?: boolean
    navigationMode?: NavigationMode
  }>(),
  {
    user: () => ({}),
    pageSection: 'BANKING',
    showRefresh: false,
    refreshing: false,
    admin: false,
    navigationMode: undefined,
  },
)

const emit = defineEmits<{
  refresh: []
}>()

const route = useRoute()
const router = useRouter()

const mobileMenuOpen = ref(false)

/*
 * ============================================================
 * STORED USERS
 * ============================================================
 */

const storedAdminUser = computed<User>(() => {
  const stored = localStorage.getItem('adminUser')

  if (!stored) {
    return {}
  }

  try {
    return JSON.parse(stored) as User
  } catch {
    return {}
  }
})

const storedCustomerUser = computed<User>(() => {
  const stored = localStorage.getItem('user')

  if (!stored) {
    return {}
  }

  try {
    return JSON.parse(stored) as User
  } catch {
    return {}
  }
})

/*
 * ============================================================
 * ADMIN MODE
 * ============================================================
 */

const isAdminMode = computed(() => {
  /*
   * Business routes always use the business shell,
   * even when an admin session exists in the browser.
   */
  if (isBusiness.value) {
    return false
  }

  /*
   * Explicit admin pages and /admin/* routes use
   * the administrator shell.
   */
  return props.admin || isAdminRoute.value
})

/*
 * ============================================================
 * NAVIGATION MODE
 * ============================================================
 */

const isBusiness = computed(() => {
  return route.path === '/business' || route.path.startsWith('/business/')
})

const isAdminRoute = computed(() => {
  return route.path === '/admin' || route.path.startsWith('/admin/')
})

const effectiveNavigationMode = computed<NavigationMode>(() => {
  if (props.navigationMode) {
    return props.navigationMode
  }

  if (isAdminMode.value) {
    return 'admin'
  }

  if (isBusiness.value) {
    return 'business'
  }

  return 'customer'
})

/*
 * ============================================================
 * DISPLAY USER
 * ============================================================
 */

const displayUser = computed<User>(() => {
  /*
   * Explicit user passed by the page has priority.
   */
  if (props.user.firstName || props.user.lastName || props.user.email) {
    return props.user
  }

  /*
   * Admin session.
   */
  if (effectiveNavigationMode.value === 'admin') {
    return storedAdminUser.value
  }

  /*
   * Normal customer/business session.
   */
  return storedCustomerUser.value
})

const fullName = computed(() => {
  const name = `${displayUser.value.firstName || ''} ${displayUser.value.lastName || ''}`.trim()

  if (name) {
    return name
  }

  if (effectiveNavigationMode.value === 'admin') {
    return 'Administrator'
  }

  return 'Account holder'
})

const userInitials = computed(() => {
  const first = displayUser.value.firstName?.charAt(0) || ''
  const last = displayUser.value.lastName?.charAt(0) || ''

  const initials = `${first}${last}`.trim()

  if (initials) {
    return initials.toUpperCase()
  }

  return displayUser.value.email?.charAt(0).toUpperCase() || 'U'
})

/*
 * ============================================================
 * CUSTOMER NAVIGATION
 * ============================================================
 */

const customerNavigation = [
  {
    label: 'Overview',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Accounts',
    to: '/accounts',
    icon: WalletCards,
  },
  {
    label: 'Transactions',
    to: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    label: 'Cards',
    to: '/cards',
    icon: CreditCard,
  },
]

const customerServices = [
  {
    label: 'Transfers',
    to: '/transfers',
    icon: Send,
  },
  {
    label: 'Investments',
    to: '/investments',
    icon: ChartCandlestick,
  },
  {
    label: 'Market Data',
    to: '/market',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

/*
 * ============================================================
 * BUSINESS NAVIGATION
 * ============================================================
 *
 * This is the navigation for an already authenticated
 * business owner/member.
 */

const businessNavigation = [
  {
    label: 'Overview',
    to: '/business/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Accounts',
    to: '/business/accounts',
    icon: WalletCards,
  },
  {
    label: 'Transactions',
    to: '/business/transactions',
    icon: ArrowLeftRight,
  },
  {
    label: 'Cards',
    to: '/business/cards',
    icon: CreditCard,
  },
]

const businessServices = [
  {
    label: 'Transfers',
    to: '/business/transfers',
    icon: Send,
  },
  {
    label: 'Team Members',
    to: '/business/members',
    icon: Users,
  },
  {
    label: 'Settings',
    to: '/business/settings',
    icon: Settings,
  },
]

/*
 * ============================================================
 * ADMIN NAVIGATION
 * ============================================================
 */

const adminNavigation = [
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
    icon: ArrowLeftRight,
  },
  {
    label: 'Card Applications',
    to: '/admin/card-applications',
    icon: CreditCard,
  },
]

const adminServices = [
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
]

/*
 * ============================================================
 * BUSINESS ONBOARDING NAVIGATION
 * ============================================================
 */

const businessOnboardingNavigation = [
  {
    label: 'Business account',
    to: '/business/onboarding',
    icon: WalletCards,
  },
]

/*
 * ============================================================
 * ACTIVE NAVIGATION
 * ============================================================
 */

const mainNavigation = computed(() => {
  switch (effectiveNavigationMode.value) {
    case 'admin':
      return adminNavigation

    case 'business':
      return businessNavigation

    case 'business-onboarding':
      return businessOnboardingNavigation

    case 'customer':
    default:
      return customerNavigation
  }
})

const serviceNavigation = computed(() => {
  switch (effectiveNavigationMode.value) {
    case 'admin':
      return adminServices

    case 'business':
      return businessServices

    case 'business-onboarding':
      return []

    case 'customer':
    default:
      return customerServices
  }
})

const navigationLabel = computed(() => {
  switch (effectiveNavigationMode.value) {
    case 'admin':
      return 'ADMINISTRATION'

    case 'business':
    case 'business-onboarding':
      return 'BUSINESS BANKING'

    case 'customer':
    default:
      return 'MAIN'
  }
})

const servicesLabel = computed(() => {
  if (effectiveNavigationMode.value === 'admin') {
    return 'SYSTEM'
  }

  return 'SERVICES'
})

/*
 * ============================================================
 * ADMIN BUTTON
 * ============================================================
 *
 * We calculate this in script instead of accessing
 * localStorage directly from the template.
 */

const showAdminDashboardButton = computed(() => {
  if (
    effectiveNavigationMode.value === 'admin' ||
    effectiveNavigationMode.value === 'business' ||
    effectiveNavigationMode.value === 'business-onboarding'
  ) {
    return false
  }

  return Boolean(
    localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken'),
  )
})

/*
 * ============================================================
 * ROUTING
 * ============================================================
 */

function isActive(path: string): boolean {
  return route.path === path
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function openMobileMenu() {
  mobileMenuOpen.value = true
}

function handleRefresh() {
  emit('refresh')
}

function goToAdminDashboard() {
  closeMobileMenu()

  router.push('/admin/dashboard')
}

/*
 * ============================================================
 * LOGOUT
 * ============================================================
 */

function logout() {
  /*
   * ADMIN SESSION
   */

  if (effectiveNavigationMode.value === 'admin') {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminUser')

    sessionStorage.removeItem('adminAccessToken')
    sessionStorage.removeItem('adminUser')

    router.push('/admin/login')

    return
  }

  /*
   * CUSTOMER / BUSINESS SESSION
   */

  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  localStorage.removeItem('business')
  localStorage.removeItem('businessAccount')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('business')
  sessionStorage.removeItem('businessAccount')

  /*
   * Business users and customers both use the normal
   * authentication session.
   */
  router.push('/login')
}

/*
 * ============================================================
 * LOGO ROUTE
 * ============================================================
 */

const logoRoute = computed(() => {
  if (effectiveNavigationMode.value === 'admin') {
    return '/admin/dashboard'
  }

  if (
    effectiveNavigationMode.value === 'business' ||
    effectiveNavigationMode.value === 'business-onboarding'
  ) {
    return '/business'
  }

  return '/'
})

/*
 * ============================================================
 * HEADER BACK ROUTE
 * ============================================================
 */

const headerBackRoute = computed(() => {
  if (
    effectiveNavigationMode.value === 'business' ||
    effectiveNavigationMode.value === 'business-onboarding'
  ) {
    return '/business'
  }

  if (effectiveNavigationMode.value === 'admin') {
    return '/admin/dashboard'
  }

  return '/'
})

const headerBackLabel = computed(() => {
  if (
    effectiveNavigationMode.value === 'business' ||
    effectiveNavigationMode.value === 'business-onboarding'
  ) {
    return 'Back to Business'
  }

  if (effectiveNavigationMode.value === 'admin') {
    return 'Admin Dashboard'
  }

  return 'Home'
})
</script>

<template>
  <div class="banking-shell">
    <!-- =====================================================
         MOBILE OVERLAY
    ====================================================== -->

    <div v-if="mobileMenuOpen" class="banking-mobile-overlay" @click="closeMobileMenu" />

    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <aside :class="{ 'is-open': mobileMenuOpen }" class="banking-sidebar">
      <!-- ===================================================
           SIDEBAR TOP
      ==================================================== -->

      <div class="banking-sidebar-top">
        <RouterLink :to="logoRoute" class="banking-logo" @click="closeMobileMenu">
          <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="banking-logo-image" />

          <div class="banking-logo-text">
            <strong>Buuchezo Bank</strong>

            <small
              v-if="
                effectiveNavigationMode === 'business' ||
                effectiveNavigationMode === 'business-onboarding'
              "
            >
              Business Banking
            </small>

            <small v-else-if="effectiveNavigationMode === 'admin'"> Administration </small>
          </div>
        </RouterLink>

        <button
          aria-label="Close navigation"
          class="banking-mobile-close"
          type="button"
          @click="closeMobileMenu"
        >
          <X :size="21" />
        </button>
      </div>

      <!-- ===================================================
           NAVIGATION
      ==================================================== -->

      <nav class="banking-navigation">
        <!-- MAIN NAVIGATION -->

        <div class="banking-navigation-group">
          <p class="banking-navigation-label">
            {{ navigationLabel }}
          </p>

          <RouterLink
            v-for="item in mainNavigation"
            :key="item.to"
            :class="{ active: isActive(item.to) }"
            :to="item.to"
            class="banking-navigation-item"
            @click="closeMobileMenu"
          >
            <component :is="item.icon" :size="18" />

            <span>{{ item.label }}</span>
          </RouterLink>
        </div>

        <!-- SERVICES -->

        <div
          v-if="serviceNavigation.length > 0"
          class="banking-navigation-group banking-services-group"
        >
          <p class="banking-navigation-label">
            {{ servicesLabel }}
          </p>

          <RouterLink
            v-for="item in serviceNavigation"
            :key="item.to"
            :class="{ active: isActive(item.to) }"
            :to="item.to"
            class="banking-navigation-item"
            @click="closeMobileMenu"
          >
            <component :is="item.icon" :size="18" />

            <span>{{ item.label }}</span>
          </RouterLink>
        </div>
      </nav>

      <!-- ===================================================
           SIDEBAR BOTTOM
      ==================================================== -->

      <div class="banking-sidebar-bottom">
        <!-- SUPPORT -->

        <div class="banking-support-box">
          <div class="banking-support-icon">
            <HelpCircle :size="17" />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>
        </div>

        <!-- ADMIN SWITCH -->

        <button
          v-if="showAdminDashboardButton"
          class="banking-bottom-button"
          type="button"
          @click="goToAdminDashboard"
        >
          <ShieldCheck :size="17" />

          <span>Admin Dashboard</span>
        </button>

        <!-- LOGOUT -->

        <button class="banking-bottom-button logout-button" type="button" @click="logout">
          <LogOut :size="17" />

          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <!-- =====================================================
         MAIN APPLICATION
    ====================================================== -->

    <main class="banking-main">
      <!-- ===================================================
           HEADER
      ==================================================== -->

      <header class="banking-header">
        <div class="banking-header-left">
          <button
            aria-label="Open navigation"
            class="banking-mobile-menu"
            type="button"
            @click="openMobileMenu"
          >
            <Menu :size="21" />
          </button>

          <div class="banking-page-heading">
            <span class="banking-page-section">
              {{ props.pageSection }}
            </span>

            <h1>
              {{ props.pageTitle }}
            </h1>
          </div>
        </div>

        <div class="banking-header-actions">
          <!-- REFRESH -->

          <button
            v-if="showRefresh"
            :disabled="refreshing"
            aria-label="Refresh"
            class="banking-header-button"
            type="button"
            @click="handleRefresh"
          >
            <RefreshCw :class="{ 'is-spinning': refreshing }" :size="17" />
          </button>

          <!-- NOTIFICATIONS -->

          <NotificationDropdown />

          <!-- PROFILE -->

          <div class="banking-profile">
            <div class="banking-profile-avatar">
              {{ userInitials }}
            </div>

            <div class="banking-profile-info">
              <strong>{{ fullName }}</strong>

              <span>
                {{ displayUser.email || 'Authenticated user' }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- ===================================================
           CONTENT
      ==================================================== -->

      <section class="banking-content">
        <slot />
      </section>

      <!-- ===================================================
           MOBILE BOTTOM / FOOTER
      ==================================================== -->

      <footer class="banking-footer">
        <RouterLink :to="headerBackRoute" class="banking-footer-link">
          {{ headerBackLabel }}
        </RouterLink>

        <span class="banking-footer-separator">•</span>

        <span>Buuchezo Bank</span>
      </footer>
    </main>
  </div>
</template>

<style scoped>
/* ============================================================
   BUUCHEZO BANK — BANKING SHELL
============================================================ */

* {
  box-sizing: border-box;
}

.banking-shell {
  min-height: 100vh;
  width: 100%;

  display: flex;

  background: #f5f8fc;

  color: #132945;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* ============================================================
   SIDEBAR
============================================================ */

.banking-sidebar {
  position: fixed;
  inset: 0 auto 0 0;

  z-index: 1000;

  width: 258px;
  height: 100vh;

  display: flex;
  flex-direction: column;

  padding: 22px 14px 18px;

  background: linear-gradient(180deg, #0b1f38 0%, #0b1f38 65%, #091b31 100%);

  color: #ffffff;

  box-shadow: 8px 0 30px rgba(9, 27, 49, 0.12);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

/* ============================================================
   LOGO
============================================================ */

.banking-sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 10px;

  margin-bottom: 30px;
}

.banking-logo {
  display: flex;
  align-items: center;

  gap: 11px;

  color: #ffffff;

  text-decoration: none;
}

.banking-logo-image {
  width: 35px;
  height: 35px;

  display: block;

  object-fit: contain;
  object-position: center;

  flex-shrink: 0;
}

.banking-logo-text {
  display: flex;
  flex-direction: column;

  color: #ffffff;

  white-space: nowrap;
}

.banking-logo-text strong {
  font-size: 15px;
  font-weight: 750;

  line-height: 1.2;

  letter-spacing: -0.2px;
}

.banking-logo-text small {
  margin-top: 3px;

  color: rgba(255, 255, 255, 0.55);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

/* ============================================================
   NAVIGATION
============================================================ */

.banking-navigation {
  flex: 1;

  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: thin;
}

.banking-navigation-group {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.banking-services-group {
  margin-top: 27px;
}

.banking-navigation-label {
  margin: 0 11px 8px;

  color: rgba(255, 255, 255, 0.42);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 1.2px;
}

.banking-navigation-item {
  min-height: 43px;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 0 12px;

  border-radius: 9px;

  color: rgba(255, 255, 255, 0.68);

  font-size: 11px;
  font-weight: 650;

  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.banking-navigation-item svg {
  flex-shrink: 0;

  opacity: 0.8;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.banking-navigation-item:hover {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.07);

  transform: translateX(1px);
}

.banking-navigation-item:hover svg {
  opacity: 1;
}

.banking-navigation-item.active {
  color: #ffffff;

  background: linear-gradient(135deg, rgba(21, 151, 255, 0.23), rgba(21, 151, 255, 0.1));

  box-shadow: inset 0 0 0 1px rgba(21, 151, 255, 0.12);
}

.banking-navigation-item.active svg {
  opacity: 1;
}

/* ============================================================
   SIDEBAR BOTTOM
============================================================ */

.banking-sidebar-bottom {
  display: flex;
  flex-direction: column;

  gap: 8px;

  padding-top: 18px;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.banking-support-box {
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 11px;

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.055);
}

.banking-support-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 8px;

  background: rgba(21, 151, 255, 0.13);

  color: #72c3ff;
}

.banking-support-box > div:last-child {
  display: flex;
  flex-direction: column;

  gap: 2px;
}

.banking-support-box strong {
  color: #ffffff;

  font-size: 9px;
  font-weight: 700;
}

.banking-support-box span {
  color: rgba(255, 255, 255, 0.45);

  font-size: 8px;
}

.banking-bottom-button {
  width: 100%;
  min-height: 38px;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 0 11px;

  border: 0;
  border-radius: 8px;

  background: transparent;

  color: rgba(255, 255, 255, 0.58);

  font-family: inherit;

  font-size: 10px;
  font-weight: 650;

  text-align: left;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.banking-bottom-button:hover {
  color: #ffffff;

  background: rgba(255, 255, 255, 0.07);
}

.logout-button:hover {
  color: #ffffff;

  background: rgba(220, 70, 70, 0.12);
}

/* ============================================================
   MAIN
============================================================ */

.banking-main {
  min-height: 100vh;

  width: calc(100% - 258px);

  margin-left: 258px;

  display: flex;
  flex-direction: column;
}

/* ============================================================
   HEADER
============================================================ */

.banking-header {
  min-height: 76px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 25px;

  padding: 0 32px;

  background: #ffffff;

  border-bottom: 1px solid #e6edf4;

  position: sticky;
  top: 0;

  z-index: 100;
}

.banking-header-left {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 14px;
}

.banking-page-heading {
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.banking-page-section {
  margin-bottom: 4px;

  color: #0d6fbd;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 0.16em;
}

.banking-page-heading h1 {
  margin: 0;

  overflow: hidden;

  color: #0b1f38;

  font-size: 17px;
  font-weight: 750;

  line-height: 1.2;

  letter-spacing: -0.02em;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.banking-header-actions {
  display: flex;
  align-items: center;

  gap: 12px;
}

.banking-header-button {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: 1px solid #e1e8f0;
  border-radius: 8px;

  background: #ffffff;

  color: #52657d;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.banking-header-button:hover:not(:disabled) {
  color: #0d6fbd;

  border-color: #bcd9ed;

  background: #f7fbff;
}

.banking-header-button:disabled {
  cursor: not-allowed;

  opacity: 0.55;
}

.is-spinning {
  animation: banking-spin 0.9s linear infinite;
}

@keyframes banking-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================
   PROFILE
============================================================ */

.banking-profile {
  display: flex;
  align-items: center;

  gap: 9px;

  padding-left: 10px;

  border-left: 1px solid #e6edf4;
}

.banking-profile-avatar {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: #0b1f38;

  color: #ffffff;

  font-size: 10px;
  font-weight: 800;
}

.banking-profile-info {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.banking-profile-info strong {
  max-width: 145px;

  overflow: hidden;

  color: #132945;

  font-size: 10px;
  font-weight: 750;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.banking-profile-info span {
  max-width: 145px;

  overflow: hidden;

  color: #8a98a9;

  font-size: 8px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================================
   CONTENT
============================================================ */

.banking-content {
  flex: 1;

  width: 100%;

  padding: 30px 32px 40px;
}

/* ============================================================
   FOOTER
============================================================ */

.banking-footer {
  min-height: 46px;

  display: flex;
  align-items: center;

  justify-content: center;

  gap: 9px;

  padding: 0 20px;

  color: #98a5b4;

  border-top: 1px solid #e6edf4;

  background: #ffffff;

  font-size: 8px;
}

.banking-footer-link {
  color: #718096;

  text-decoration: none;
}

.banking-footer-link:hover {
  color: #0d6fbd;
}

.banking-footer-separator {
  color: #c4ccd5;
}

/* ============================================================
   MOBILE
============================================================ */

.banking-mobile-menu,
.banking-mobile-close {
  display: none;
}

.banking-mobile-overlay {
  display: none;
}

/* ============================================================
   TABLET
============================================================ */

@media (max-width: 1000px) {
  .banking-sidebar {
    transform: translateX(-100%);

    box-shadow: none;
  }

  .banking-sidebar.is-open {
    transform: translateX(0);

    box-shadow: 12px 0 40px rgba(9, 27, 49, 0.2);
  }

  .banking-mobile-overlay {
    position: fixed;
    inset: 0;

    z-index: 999;

    display: block;

    background: rgba(7, 22, 39, 0.45);

    backdrop-filter: blur(2px);
  }

  .banking-mobile-menu {
    width: 36px;
    height: 36px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    padding: 0;

    border: 1px solid #e1e8f0;
    border-radius: 8px;

    background: #ffffff;

    color: #132945;

    cursor: pointer;
  }

  .banking-mobile-close {
    width: 34px;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    border: 0;
    border-radius: 8px;

    background: rgba(255, 255, 255, 0.06);

    color: #ffffff;

    cursor: pointer;
  }

  .banking-main {
    width: 100%;

    margin-left: 0;
  }
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 700px) {
  .banking-header {
    min-height: 68px;

    padding: 0 16px;
  }

  .banking-content {
    padding: 22px 16px 32px;
  }

  .banking-header-actions {
    gap: 6px;
  }

  .banking-profile {
    display: none;
  }

  .banking-page-heading h1 {
    font-size: 15px;
  }

  .banking-page-section {
    font-size: 7px;
  }

  .banking-footer {
    font-size: 7px;
  }
}

@media (max-width: 450px) {
  .banking-header {
    gap: 10px;
  }

  .banking-header-actions {
    margin-left: auto;
  }

  .banking-header-button {
    width: 33px;
    height: 33px;
  }

  .banking-page-heading {
    max-width: 150px;
  }

  .banking-content {
    padding: 18px 12px 28px;
  }
}
</style>
