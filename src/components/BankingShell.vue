<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  CreditCard,
  Send,
  ChartCandlestick,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  RefreshCw,
  Users,
} from 'lucide-vue-next'

import NotificationDropdown from './layout/NotificationDropdownView.vue'
import buuchezoBankLogo from '@/assets/images/buuchezobank-logo.png'

interface User {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  authType?: string
  authorities?: string[]
}

const props = withDefaults(
  defineProps<{
    user?: User
    pageTitle: string
    pageSection?: string
    showRefresh?: boolean
    refreshing?: boolean

    /*
     * When true, this shell renders the administration
     * navigation instead of the customer navigation.
     */
    admin?: boolean
  }>(),
  {
    user: () => ({}),
    pageSection: 'BANKING',
    showRefresh: false,
    refreshing: false,
    admin: false,
  },
)

const emit = defineEmits<{
  refresh: []
}>()

const route = useRoute()
const router = useRouter()
const mobileMenuOpen = ref(false)

const storedAdminUser = computed<User>(() => {
  const stored = localStorage.getItem('adminUser')

  if (!stored) {
    return {}
  }

  try {
    return JSON.parse(stored)
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
    return JSON.parse(stored)
  } catch {
    return {}
  }
})

const storedUserIsAdmin = computed(() => {
  const user = storedAdminUser.value

  return (
    user.role === 'ADMIN' ||
    user.authType === 'ADMIN' ||
    user.authorities?.includes?.('ADMIN') === true
  )
})

const isAdminMode = computed(() => {
  return props.admin || storedUserIsAdmin.value
})

const displayUser = computed<User>(() => {
  /*
   * Explicitly supplied user always wins.
   *
   * Admin pages can simply use :admin="true" and the shell
   * will automatically use adminUser from localStorage.
   */
  if (props.user.firstName || props.user.lastName || props.user.email) {
    return props.user
  }

  if (isAdminMode.value) {
    return storedAdminUser.value
  }

  return storedCustomerUser.value
})

const fullName = computed(() => {
  const name = `${displayUser.value.firstName || ''} ${displayUser.value.lastName || ''}`.trim()

  return name || (isAdminMode.value ? 'Administrator' : 'Account holder')
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

const mainNavigation = computed(() => {
  return isAdminMode.value ? adminNavigation : customerNavigation
})

const serviceNavigation = computed(() => {
  return isAdminMode.value ? adminServices : customerServices
})

const navigationLabel = computed(() => {
  return isAdminMode.value ? 'ADMINISTRATION' : 'MAIN'
})

const servicesLabel = computed(() => {
  return isAdminMode.value ? 'SYSTEM' : 'SERVICES'
})

function isActive(path: string) {
  return route.path === path
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function goToAdminDashboard() {
  closeMobileMenu()
  router.push('/admin/dashboard')
}

function logout() {
  if (isAdminMode.value) {
    localStorage.removeItem('adminAccessToken')
    localStorage.removeItem('adminUser')

    sessionStorage.removeItem('adminAccessToken')
    sessionStorage.removeItem('adminUser')

    router.push('/admin/login')
    return
  }

  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}
</script>

<template>
  <div class="banking-shell">
    <!-- MOBILE OVERLAY -->
    <div v-if="mobileMenuOpen" class="banking-mobile-overlay" @click="closeMobileMenu" />

    <!-- SIDEBAR -->
    <aside class="banking-sidebar" :class="{ 'is-open': mobileMenuOpen }">
      <!-- LOGO -->
      <div class="banking-sidebar-top">
        <RouterLink
          :to="isAdminMode ? '/admin/dashboard' : '/'"
          class="banking-logo"
          @click="closeMobileMenu"
        >
          <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="banking-logo-image" />

          <span class="banking-logo-text"> Buuchezo Bank </span>
        </RouterLink>

        <button
          type="button"
          class="banking-mobile-close"
          aria-label="Close navigation"
          @click="closeMobileMenu"
        >
          <X :size="21" />
        </button>
      </div>

      <!-- NAVIGATION -->
      <nav class="banking-navigation">
        <!-- MAIN / ADMINISTRATION -->
        <div class="banking-navigation-group">
          <p class="banking-navigation-label">
            {{ navigationLabel }}
          </p>

          <RouterLink
            v-for="item in mainNavigation"
            :key="item.to"
            :to="item.to"
            class="banking-navigation-item"
            :class="{ active: isActive(item.to) }"
            @click="closeMobileMenu"
          >
            <component :is="item.icon" :size="19" :stroke-width="2" />

            <span>{{ item.label }}</span>
          </RouterLink>
        </div>

        <!-- SERVICES / SYSTEM -->
        <div class="banking-navigation-group banking-services-group">
          <p class="banking-navigation-label">
            {{ servicesLabel }}
          </p>

          <RouterLink
            v-for="item in serviceNavigation"
            :key="item.to"
            :to="item.to"
            class="banking-navigation-item"
            :class="{ active: isActive(item.to) }"
            @click="closeMobileMenu"
          >
            <component :is="item.icon" :size="19" :stroke-width="2" />

            <span>{{ item.label }}</span>
          </RouterLink>
        </div>
      </nav>

      <!-- SIDEBAR BOTTOM -->
      <div class="banking-sidebar-bottom">
        <!-- CUSTOMER ONLY -->
        <button
          v-if="!isAdminMode && storedUserIsAdmin"
          type="button"
          class="banking-admin-button"
          @click="goToAdminDashboard"
        >
          <ShieldCheck :size="17" />
          <span>Admin Dashboard</span>
        </button>

        <!-- ADMIN SUPPORT -->
        <div v-if="isAdminMode" class="banking-support">
          <div class="banking-support-icon">
            <ShieldCheck :size="17" />
          </div>

          <div class="banking-support-text">
            <strong>Admin Area</strong>
            <span>Secure administration</span>
          </div>
        </div>

        <!-- CUSTOMER SUPPORT -->
        <div v-else class="banking-support">
          <div class="banking-support-icon">
            <HelpCircle :size="17" />
          </div>

          <div class="banking-support-text">
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>
        </div>

        <button type="button" class="banking-logout" @click="logout">
          <LogOut :size="18" />

          <span>
            {{ isAdminMode ? 'Sign out' : 'Sign out' }}
          </span>
        </button>
      </div>
    </aside>

    <!-- MAIN AREA -->
    <main class="banking-main">
      <!-- HEADER -->
      <header class="banking-header">
        <div class="banking-header-left">
          <button
            type="button"
            class="banking-mobile-menu"
            aria-label="Open navigation"
            @click="mobileMenuOpen = true"
          >
            <Menu :size="22" />
          </button>

          <div class="banking-page-heading">
            <span class="banking-page-section">
              {{ pageSection }}
            </span>

            <h1>
              {{ pageTitle }}
            </h1>
          </div>
        </div>

        <div class="banking-header-right">
          <button
            v-if="showRefresh"
            type="button"
            class="banking-header-button"
            :disabled="refreshing"
            aria-label="Refresh"
            @click="emit('refresh')"
          >
            <RefreshCw :size="18" :class="{ spinning: refreshing }" />
          </button>

          <div class="banking-notification">
            <NotificationDropdown />
          </div>

          <div class="banking-profile">
            <div class="banking-avatar">
              {{ userInitials }}
            </div>

            <div class="banking-profile-info">
              <strong>
                {{ fullName }}
              </strong>

              <span>
                {{ displayUser.email || (isAdminMode ? 'Administrator' : 'Personal account') }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <section class="banking-content">
        <slot />
      </section>
    </main>
  </div>
</template>

<style>
/* ============================================================
   BUUCHEZO BANK — SHARED CUSTOMER APPLICATION SHELL
   ============================================================ */

.banking-shell {
  --banking-navy: #0b1f38;
  --banking-navy-light: #132d4d;
  --banking-blue: #1597ff;
  --banking-blue-dark: #0d6fbd;
  --banking-text: #132945;
  --banking-muted: #718096;
  --banking-border: #e1e8f0;
  --banking-background: #f5f8fc;
  --banking-white: #ffffff;

  min-height: 100vh;
  width: 100%;
  display: flex;
  background: var(--banking-background);
  color: var(--banking-text);
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
  width: 38px;
  height: 38px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}

.banking-logo-mark {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: linear-gradient(135deg, #1597ff 0%, #0d6fbd 100%);

  color: #ffffff;

  font-size: 17px;
  font-weight: 800;

  box-shadow: 0 7px 18px rgba(21, 151, 255, 0.24);
}

.banking-logo-text {
  font-size: 15px;
  font-weight: 750;
  letter-spacing: -0.2px;
  white-space: nowrap;
}

.banking-mobile-close {
  display: none;

  width: 34px;
  height: 34px;

  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;

  cursor: pointer;
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
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
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
  font-weight: 800;

  letter-spacing: 1.2px;
  line-height: 1;
}

.banking-navigation-item {
  position: relative;

  min-height: 44px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 0 13px;

  border-radius: 10px;

  color: rgba(255, 255, 255, 0.68);
  text-decoration: none;

  font-size: 13px;
  font-weight: 650;

  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.banking-navigation-item svg {
  flex: 0 0 auto;
}

.banking-navigation-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.banking-navigation-item.active {
  background: linear-gradient(135deg, #0d6fbd 0%, #1597ff 100%);

  color: #ffffff;

  box-shadow: 0 8px 20px rgba(21, 151, 255, 0.18);
}

.banking-navigation-item.active::before {
  content: '';

  position: absolute;
  left: -14px;
  top: 8px;
  bottom: 8px;

  width: 3px;

  border-radius: 0 4px 4px 0;

  background: #5eb9ff;
}

/* ============================================================
   SIDEBAR BOTTOM
   ============================================================ */

.banking-sidebar-bottom {
  margin-top: 20px;
}

.banking-support {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 0 4px 12px;
  padding: 11px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 11px;

  background: rgba(255, 255, 255, 0.045);
}

.banking-support-icon {
  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  border-radius: 8px;

  background: rgba(21, 151, 255, 0.16);
  color: #69beff;
}

.banking-support-text {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.banking-support-text strong {
  color: #ffffff;

  font-size: 11px;
  font-weight: 700;
}

.banking-support-text span {
  color: rgba(255, 255, 255, 0.42);

  font-size: 10px;
}

.banking-admin-button {
  width: calc(100% - 8px);
  min-height: 40px;

  margin: 0 4px 10px;
  padding: 0 11px;

  display: flex;
  align-items: center;
  gap: 9px;

  border: 1px solid rgba(21, 151, 255, 0.24);
  border-radius: 9px;

  background: rgba(21, 151, 255, 0.1);
  color: #79c8ff;

  font: inherit;
  font-size: 11px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease;
}

.banking-admin-button:hover {
  background: rgba(21, 151, 255, 0.18);
  border-color: rgba(21, 151, 255, 0.4);
  color: #ffffff;
}

.banking-logout {
  width: 100%;
  min-height: 43px;

  display: flex;
  align-items: center;
  gap: 11px;

  padding: 0 13px;

  border: 0;
  border-radius: 10px;

  background: transparent;
  color: rgba(255, 255, 255, 0.6);

  font: inherit;
  font-size: 12px;
  font-weight: 650;

  cursor: pointer;

  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.banking-logout:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

/* ============================================================
   MAIN
   ============================================================ */

.banking-main {
  min-width: 0;
  width: calc(100% - 258px);
  min-height: 100vh;

  margin-left: 258px;

  display: flex;
  flex-direction: column;
}

/* ============================================================
   HEADER
   ============================================================ */

.banking-header {
  position: sticky;
  top: 0;
  z-index: 900;

  height: 76px;
  min-height: 76px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 30px;

  border-bottom: 1px solid rgba(225, 232, 240, 0.9);

  background: rgba(255, 255, 255, 0.94);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.banking-header-left {
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 14px;
}

.banking-mobile-menu {
  display: none;

  width: 38px;
  height: 38px;

  align-items: center;
  justify-content: center;

  border: 1px solid var(--banking-border);
  border-radius: 9px;

  background: #ffffff;
  color: var(--banking-text);

  cursor: pointer;
}

.banking-page-heading {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.banking-page-section {
  color: #8b98a8;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 1.15px;
  line-height: 1;
}

.banking-page-heading h1 {
  margin: 0;

  color: #132945;

  font-size: 20px;
  font-weight: 750;

  letter-spacing: -0.35px;
  line-height: 1.2;
}

.banking-header-right {
  display: flex;
  align-items: center;
  gap: 13px;
}

.banking-header-button {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--banking-border);
  border-radius: 9px;

  background: #ffffff;
  color: #60748a;

  cursor: pointer;

  transition:
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease;
}

.banking-header-button:hover:not(:disabled) {
  background: #f4f8fc;
  border-color: #cfdbe7;
  color: #0d6fbd;
}

.banking-header-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.banking-notification {
  display: flex;
  align-items: center;
}

.banking-profile {
  display: flex;
  align-items: center;
  gap: 10px;

  padding-left: 13px;

  border-left: 1px solid var(--banking-border);
}

.banking-avatar {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(135deg, #0d6fbd 0%, #1597ff 100%);

  color: #ffffff;

  font-size: 11px;
  font-weight: 800;

  box-shadow: 0 5px 14px rgba(21, 151, 255, 0.2);
}

.banking-profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  min-width: 0;
}

.banking-profile-info strong {
  max-width: 170px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: #132945;

  font-size: 12px;
  font-weight: 750;
}

.banking-profile-info span {
  max-width: 190px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: #8a98a8;

  font-size: 10px;
}

/* ============================================================
   PAGE CONTENT
   ============================================================ */

.banking-content {
  flex: 1;

  width: 100%;
  min-width: 0;

  padding: 30px;
}

/* ============================================================
   GENERIC CONTENT RULES
   These establish one typography scale across every page.
   ============================================================ */

.banking-content > h1,
.banking-content > h2,
.banking-content section > h1,
.banking-content section > h2 {
  color: #132945;
}

.banking-content h1 {
  font-size: 26px;
  line-height: 1.2;
}

.banking-content h2 {
  font-size: 22px;
  line-height: 1.25;
}

.banking-content h3 {
  font-size: 16px;
  line-height: 1.3;
}

.banking-content p {
  color: #718096;
}

/* ============================================================
   SHARED CARDS
   ============================================================ */

.banking-content .bz-card,
.banking-content .card,
.banking-content .content-card {
  border: 1px solid #e1e8f0;
  border-radius: 16px;

  background: #ffffff;

  box-shadow: 0 8px 28px rgba(15, 35, 55, 0.055);
}

/* ============================================================
   ANIMATION
   ============================================================ */

.banking-navigation-item,
.banking-header-button,
.banking-admin-button,
.banking-logout {
  will-change: background-color, color, transform;
}

.spinning {
  animation: banking-spin 0.8s linear infinite;
}

@keyframes banking-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================
   MOBILE
   ============================================================ */

.banking-mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;

  background: rgba(5, 19, 35, 0.48);

  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

@media (max-width: 900px) {
  .banking-sidebar {
    transform: translateX(-100%);
    transition: transform 220ms ease;
  }

  .banking-sidebar.is-open {
    transform: translateX(0);
  }

  .banking-mobile-close {
    display: flex;
  }

  .banking-main {
    width: 100%;
    margin-left: 0;
  }

  .banking-mobile-menu {
    display: flex;
  }

  .banking-header {
    padding: 0 20px;
  }

  .banking-content {
    padding: 24px 20px;
  }
}

@media (max-width: 640px) {
  .banking-header {
    height: 68px;
    min-height: 68px;
    padding: 0 14px;
  }

  .banking-content {
    padding: 20px 14px;
  }

  .banking-page-heading h1 {
    font-size: 18px;
  }

  .banking-header-right {
    gap: 7px;
  }

  .banking-profile {
    padding-left: 7px;
  }

  .banking-profile-info {
    display: none;
  }

  .banking-avatar {
    width: 34px;
    height: 34px;
  }

  .banking-header-button {
    width: 34px;
    height: 34px;
  }

  .banking-content h1 {
    font-size: 23px;
  }

  .banking-content h2 {
    font-size: 20px;
  }
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  .banking-sidebar,
  .banking-navigation-item,
  .banking-header-button,
  .banking-admin-button,
  .banking-logout {
    transition: none;
  }

  .spinning {
    animation: none;
  }
}
</style>
