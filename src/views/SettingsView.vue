```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import QRCode from 'qrcode'
import { useRouter } from 'vue-router'
import NotificationDropdown from '../components/layout/NotificationDropdownView.vue'

import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Mail,
  Save,
  Send,
  Settings,
  ShieldCheck,
  User,
  WalletCards,
} from 'lucide-vue-next'

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
  twoFactorEnabled?: boolean
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

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const router = useRouter()

const mobileMenuOpen = ref(false)
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const twoFactorEnabled = ref(false)
const twoFactorSetupOpen = ref(false)
const twoFactorLoading = ref(false)
const twoFactorVerifying = ref(false)
const twoFactorDisabling = ref(false)

const twoFactorDisableOpen = ref(false)
const twoFactorDisableCode = ref('')
const twoFactorDisableError = ref('')

const twoFactorCode = ref('')
const twoFactorSecret = ref('')
const twoFactorOtpAuthUri = ref('')
const twoFactorQrCode = ref('')

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
  ownerEmail: '',
  createdAt: '',
})

const settings = ref({
  transactionNotifications: true,
  securityNotifications: true,
  marketingEmails: false,
})

const profileForm = ref({
  firstName: '',
  lastName: '',
})

const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`.trim()
})

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase() || 'U'
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

const accountTypeLabel = computed(() => {
  if (!account.value.accountType) {
    return 'Bank Account'
  }

  return account.value.accountType
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const formattedCreatedAt = computed(() => {
  if (!user.value.createdAt) {
    return '—'
  }

  const date = new Date(user.value.createdAt)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
})

async function loadSettings() {
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
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('user')

      await router.push('/login')
      return
    }

    const result: ApiResponse<UserWithAccount> = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || 'Unable to load your account settings.',
      )
    }

    user.value = result.data.user
    account.value = result.data.account

    twoFactorEnabled.value = Boolean(
      result.data.user.twoFactorEnabled,
    )

    profileForm.value = {
      firstName: result.data.user.firstName,
      lastName: result.data.user.lastName,
    }
  } catch (error) {
    console.error('Settings loading failed:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to load your account settings.'
  } finally {
    loading.value = false
  }
}

function savePreferences() {
  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  /*
   * These preferences are currently frontend-only.
   *
   * Later we can persist them through the backend,
   * for example:
   *
   * PATCH /api/users/me/preferences
   */

  window.setTimeout(() => {
    saving.value = false
    successMessage.value =
      'Your preferences have been saved on this device.'

    window.setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }, 500)
}

function requestProfileChange() {
  successMessage.value = ''
  errorMessage.value = ''

  successMessage.value =
    'Profile changes will be connected when the profile update API is implemented.'

  window.setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

async function setupTwoFactor() {
  twoFactorLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')

  if (!token) {
    await router.push('/login')
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/2fa/setup`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 401) {
      logout()
      return
    }

    const result: ApiResponse<{
      secret: string
      otpAuthUri: string
    }> = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Unable to start two-factor authentication setup.',
      )
    }

    twoFactorSecret.value = result.data.secret
    twoFactorOtpAuthUri.value = result.data.otpAuthUri

    twoFactorQrCode.value = await QRCode.toDataURL(
      result.data.otpAuthUri,
      {
        width: 220,
        margin: 2,
      },
    )

    twoFactorCode.value = ''
    twoFactorSetupOpen.value = true
  } catch (error) {
    console.error('2FA setup failed:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to start two-factor authentication setup.'
  } finally {
    twoFactorLoading.value = false
  }
}

async function verifyTwoFactor() {
  if (!/^\d{6}$/.test(twoFactorCode.value)) {
    errorMessage.value =
      'Enter the 6-digit code from your authenticator app.'
    return
  }

  twoFactorVerifying.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')

  if (!token) {
    await router.push('/login')
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/2fa/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: twoFactorCode.value,
        }),
      },
    )

    if (response.status === 401) {
      logout()
      return
    }

    const result: ApiResponse<{
      secret?: string
      otpAuthUri?: string
    }> = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'The authenticator code could not be verified.',
      )
    }

    twoFactorEnabled.value = true
    twoFactorSetupOpen.value = false
    twoFactorCode.value = ''

    successMessage.value =
      'Two-factor authentication has been enabled successfully.'
  } catch (error) {
    console.error('2FA verification failed:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'The authenticator code could not be verified.'
  } finally {
    twoFactorVerifying.value = false
  }
}

/* =========================================================
   DISABLE 2FA MODAL
========================================================= */

function openDisableTwoFactor() {
  twoFactorDisableCode.value = ''
  twoFactorDisableError.value = ''
  errorMessage.value = ''
  twoFactorDisableOpen.value = true
}

function cancelDisableTwoFactor() {
  if (twoFactorDisabling.value) {
    return
  }

  twoFactorDisableOpen.value = false
  twoFactorDisableCode.value = ''
  twoFactorDisableError.value = ''
}

async function confirmDisableTwoFactor() {
  const code = twoFactorDisableCode.value.trim()

  if (!/^\d{6}$/.test(code)) {
    twoFactorDisableError.value =
      'Enter the 6-digit code from your authenticator app.'
    return
  }

  twoFactorDisabling.value = true
  twoFactorDisableError.value = ''
  errorMessage.value = ''
  successMessage.value = ''

  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')

  if (!token) {
    twoFactorDisabling.value = false
    await router.push('/login')
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/2fa/disable`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
        }),
      },
    )

    if (response.status === 401) {
      logout()
      return
    }

    const result: ApiResponse<null> = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Unable to disable two-factor authentication.',
      )
    }

    twoFactorEnabled.value = false
    twoFactorDisableOpen.value = false
    twoFactorDisableCode.value = ''
    twoFactorDisableError.value = ''

    successMessage.value =
      'Two-factor authentication has been disabled successfully.'
  } catch (error) {
    console.error('2FA disable failed:', error)

    twoFactorDisableError.value =
      error instanceof Error
        ? error.message
        : 'Unable to disable two-factor authentication.'
  } finally {
    twoFactorDisabling.value = false
  }
}

function cancelTwoFactorSetup() {
  twoFactorSetupOpen.value = false
  twoFactorCode.value = ''
  twoFactorSecret.value = ''
  twoFactorOtpAuthUri.value = ''
  twoFactorQrCode.value = ''
}

function requestPasswordChange() {
  successMessage.value = ''
  errorMessage.value = ''

  successMessage.value =
    'Password management will be connected when the password update API is implemented.'

  window.setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

function navigateTo(path: string) {
  mobileMenuOpen.value = false
  router.push(path)
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}

onMounted(loadSettings)
</script>

<template>
  <div class="settings-page">
    <!-- MOBILE OVERLAY -->
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
          type="button"
          class="mobile-close"
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
          class="nav-item"
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

        <RouterLink
          to="/cards"
          class="nav-item"
          @click="mobileMenuOpen = false"
        >
          <CreditCard :size="19" />
          <span>Cards</span>
        </RouterLink>

        <p class="nav-section-title second">SERVICES</p>

        <RouterLink
          to="/transfers"
          class="nav-item"
          @click="mobileMenuOpen = false"
        >
          <Send :size="19" />
          <span>Transfers</span>
        </RouterLink>

        <RouterLink
          to="/settings"
          class="nav-item active"
          @click="mobileMenuOpen = false"
        >
          <Settings :size="19" />
          <span>Settings</span>
        </RouterLink>
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
            <span class="page-label">ACCOUNT</span>
            <h1>Settings</h1>
          </div>
        </div>

        <div class="header-right">
          <NotificationDropdown />

          <div class="profile">
            <div class="avatar">
              {{ userInitials }}
            </div>

            <div class="profile-info">
              <strong>
                {{ fullName || 'Account holder' }}
              </strong>

              <span>
                {{ user.email || '—' }}
              </span>
            </div>

            <ChevronDown
              :size="16"
              class="profile-chevron"
            />
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <section class="content">
        <div class="page-intro">
          <div>
            <p class="eyebrow">ACCOUNT SETTINGS</p>

            <h2>Manage your account.</h2>

            <p class="intro-text">
              Review your profile, security and notification
              preferences.
            </p>
          </div>
        </div>

        <!-- ERROR -->
        <div v-if="errorMessage" class="error-box">
          <strong>Something went wrong</strong>

          <span>{{ errorMessage }}</span>

          <button
            type="button"
            @click="loadSettings"
          >
            Try again
          </button>
        </div>

        <!-- SUCCESS -->
        <div
          v-if="successMessage"
          class="success-box"
        >
          <div class="success-icon">
            <Check :size="16" />
          </div>

          <span>{{ successMessage }}</span>
        </div>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="loading-card"
        >
          <div class="spinner" />

          <p>Loading your settings...</p>
        </div>

        <template v-else-if="!errorMessage">
          <!-- PROFILE -->
          <section class="settings-section">
            <div class="section-heading">
              <div class="section-icon blue">
                <User :size="20" />
              </div>

              <div>
                <p class="eyebrow">PROFILE</p>

                <h2>Personal information</h2>

                <p>
                  Your registered Buuchezo Bank profile.
                </p>
              </div>
            </div>

            <div class="settings-card">
              <div class="profile-header">
                <div class="large-avatar">
                  {{ userInitials }}
                </div>

                <div>
                  <h3>{{ fullName }}</h3>

                  <span>
                    Buuchezo Bank customer
                  </span>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="firstName">
                    First name
                  </label>

                  <input
                    id="firstName"
                    v-model="profileForm.firstName"
                    type="text"
                    disabled
                  />
                </div>

                <div class="form-group">
                  <label for="lastName">
                    Last name
                  </label>

                  <input
                    id="lastName"
                    v-model="profileForm.lastName"
                    type="text"
                    disabled
                  />
                </div>

                <div class="form-group full">
                  <label for="email">
                    Email address
                  </label>

                  <div class="input-with-icon">
                    <Mail :size="16" />

                    <input
                      id="email"
                      :value="user.email"
                      type="email"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div class="settings-card-footer">
                <span>
                  Profile information is managed by your bank
                  account.
                </span>

                <button
                  type="button"
                  class="secondary-button"
                  @click="requestProfileChange"
                >
                  Request a change
                </button>
              </div>
            </div>
          </section>

          <!-- ACCOUNT -->
          <section class="settings-section">
            <div class="section-heading">
              <div class="section-icon purple">
                <WalletCards :size="20" />
              </div>

              <div>
                <p class="eyebrow">ACCOUNT</p>

                <h2>Account information</h2>

                <p>
                  Information associated with your bank account.
                </p>
              </div>
            </div>

            <div class="settings-card">
              <div class="account-information-grid">
                <div class="account-information">
                  <span>Account number</span>

                  <strong>
                    {{ account.accountNumber || '—' }}
                  </strong>
                </div>

                <div class="account-information">
                  <span>Account type</span>

                  <strong>
                    {{ accountTypeLabel }}
                  </strong>
                </div>

                <div class="account-information">
                  <span>Account status</span>

                  <strong class="status-value">
                    <span
                      class="status-dot"
                      :class="{
                        active:
                          account.accountStatus === 'ACTIVE',
                      }"
                    />

                    {{ accountStatusLabel }}
                  </strong>
                </div>

                <div class="account-information">
                  <span>Member since</span>

                  <strong>
                    {{ formattedCreatedAt }}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <!-- SECURITY -->
          <section class="settings-section">
            <div class="section-heading">
              <div class="section-icon green">
                <ShieldCheck :size="20" />
              </div>

              <div>
                <p class="eyebrow">SECURITY</p>

                <h2>Security settings</h2>

                <p>
                  Keep your account protected.
                </p>
              </div>
            </div>

            <div class="settings-card">
              <!-- PASSWORD -->
              <div class="security-row">
                <div class="security-row-icon">
                  <Lock :size="19" />
                </div>

                <div class="security-row-content">
                  <strong>Password</strong>

                  <span>
                    Your password is securely stored by the
                    backend.
                  </span>
                </div>

                <button
                  type="button"
                  class="secondary-button"
                  @click="requestPasswordChange"
                >
                  Change password
                </button>
              </div>

              <div class="security-divider" />

              <!-- 2FA -->
              <div class="security-row two-factor-row">
                <div class="security-row-icon">
                  <ShieldCheck :size="19" />
                </div>

                <div class="security-row-content">
                  <strong>
                    Two-factor authentication
                  </strong>

                  <span v-if="twoFactorEnabled">
                    Your account requires an authenticator
                    code when you sign in.
                  </span>

                  <span v-else>
                    Add an extra layer of security with an
                    authenticator app.
                  </span>
                </div>

                <span
                  v-if="twoFactorEnabled"
                  class="verified-badge"
                >
                  <Check :size="13" />
                  Enabled
                </span>

                <button
                  v-else
                  type="button"
                  class="secondary-button"
                  :disabled="twoFactorLoading"
                  @click="setupTwoFactor"
                >
                  {{
                    twoFactorLoading
                      ? 'Preparing...'
                      : 'Enable 2FA'
                  }}
                </button>

                <button
                  v-if="twoFactorEnabled"
                  type="button"
                  class="danger-button"
                  @click="openDisableTwoFactor"
                >
                  Disable
                </button>
              </div>

              <!-- 2FA SETUP -->
              <div
                v-if="twoFactorSetupOpen"
                class="two-factor-setup"
              >
                <div class="two-factor-setup-header">
                  <div>
                    <strong>
                      Set up your authenticator app
                    </strong>

                    <span>
                      Scan the QR code with Google Authenticator,
                      Microsoft Authenticator, Authy or another
                      TOTP app.
                    </span>
                  </div>

                  <button
                    type="button"
                    class="setup-close"
                    @click="cancelTwoFactorSetup"
                  >
                    ×
                  </button>
                </div>

                <div class="two-factor-setup-body">
                  <div class="qr-wrapper">
                    <img
                      v-if="twoFactorQrCode"
                      :src="twoFactorQrCode"
                      alt="Two-factor authentication QR code"
                    />
                  </div>

                  <div class="two-factor-instructions">
                    <p>
                      After scanning, enter the 6-digit code
                      currently shown in your authenticator app.
                    </p>

                    <label for="two-factor-code">
                      Authenticator code
                    </label>

                    <input
                      id="two-factor-code"
                      v-model="twoFactorCode"
                      type="text"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      maxlength="6"
                      placeholder="000000"
                      @input="
                        twoFactorCode =
                          twoFactorCode
                            .replace(/\D/g, '')
                            .slice(0, 6)
                      "
                    />

                    <div class="manual-secret">
                      <span>
                        Can't scan the QR code?
                      </span>

                      <code>
                        {{ twoFactorSecret }}
                      </code>
                    </div>

                    <div class="two-factor-actions">
                      <button
                        type="button"
                        class="secondary-button"
                        @click="cancelTwoFactorSetup"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        class="primary-button"
                        :disabled="
                          twoFactorVerifying ||
                          twoFactorCode.length !== 6
                        "
                        @click="verifyTwoFactor"
                      >
                        {{
                          twoFactorVerifying
                            ? 'Verifying...'
                            : 'Verify & enable'
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="security-divider" />

              <!-- EMAIL -->
              <div class="security-row">
                <div class="security-row-icon">
                  <Mail :size="19" />
                </div>

                <div class="security-row-content">
                  <strong>
                    Email verification
                  </strong>

                  <span>
                    Your account is associated with
                    {{ user.email }}.
                  </span>
                </div>

                <span class="verified-badge">
                  <Check :size="13" />
                  Account email
                </span>
              </div>
            </div>
          </section>

          <!-- NOTIFICATIONS -->
          <section class="settings-section">
            <div class="section-heading">
              <div class="section-icon orange">
                <Bell :size="20" />
              </div>

              <div>
                <p class="eyebrow">NOTIFICATIONS</p>

                <h2>Notification preferences</h2>

                <p>
                  Choose which notifications you want to receive.
                </p>
              </div>
            </div>

            <div class="settings-card">
              <div class="preference-row">
                <div>
                  <strong>
                    Transaction notifications
                  </strong>

                  <span>
                    Receive notifications when money moves in or
                    out of your account.
                  </span>
                </div>

                <label class="toggle">
                  <input
                    v-model="settings.transactionNotifications"
                    type="checkbox"
                  />

                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="preference-divider" />

              <div class="preference-row">
                <div>
                  <strong>
                    Security notifications
                  </strong>

                  <span>
                    Receive important account security alerts.
                  </span>
                </div>

                <label class="toggle">
                  <input
                    v-model="settings.securityNotifications"
                    type="checkbox"
                  />

                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="preference-divider" />

              <div class="preference-row">
                <div>
                  <strong>
                    Product and marketing emails
                  </strong>

                  <span>
                    Receive optional product updates and
                    information.
                  </span>
                </div>

                <label class="toggle">
                  <input
                    v-model="settings.marketingEmails"
                    type="checkbox"
                  />

                  <span class="toggle-slider" />
                </label>
              </div>

              <div class="preferences-footer">
                <button
                  type="button"
                  class="primary-button"
                  :disabled="saving"
                  @click="savePreferences"
                >
                  <Save :size="16" />

                  {{
                    saving
                      ? 'Saving...'
                      : 'Save preferences'
                  }}
                </button>
              </div>
            </div>
          </section>

          <!-- HELP -->
          <section class="help-card">
            <div class="help-card-icon">
              <HelpCircle :size="23" />
            </div>

            <div>
              <p class="eyebrow">
                NEED ASSISTANCE?
              </p>

              <h3>We're here to help.</h3>

              <p>
                If you need to change information that cannot
                currently be edited here, contact Buuchezo Bank
                support.
              </p>
            </div>
          </section>
        </template>
      </section>
    </main>

    <!-- DISABLE 2FA MODAL -->
    <div
      v-if="twoFactorDisableOpen"
      class="modal-overlay"
      @click.self="cancelDisableTwoFactor"
    >
      <div
        class="disable-2fa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disable-2fa-title"
      >
        <div class="modal-icon">
          <ShieldCheck :size="23" />
        </div>

        <div class="modal-content">
          <h3 id="disable-2fa-title">
            Disable two-factor authentication?
          </h3>

          <p>
            This will remove the additional authentication step
            from your account. You will only need your email and
            password to sign in again.
          </p>

          <div class="modal-warning">
            <ShieldCheck :size="16" />

            <span>
              For your security, enter the current code from your
              authenticator app to continue.
            </span>
          </div>

          <div class="modal-form-group">
            <label for="disable-2fa-code">
              Authenticator code
            </label>

            <input
              id="disable-2fa-code"
              v-model="twoFactorDisableCode"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="000000"
              :disabled="twoFactorDisabling"
              @input="
                twoFactorDisableCode =
                  twoFactorDisableCode
                    .replace(/\D/g, '')
                    .slice(0, 6)
              "
              @keyup.enter="confirmDisableTwoFactor"
            />

            <span
              v-if="twoFactorDisableError"
              class="modal-error"
            >
              {{ twoFactorDisableError }}
            </span>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="modal-cancel-button"
              :disabled="twoFactorDisabling"
              @click="cancelDisableTwoFactor"
            >
              Cancel
            </button>

            <button
              type="button"
              class="modal-confirm-button"
              :disabled="
                twoFactorDisabling ||
                twoFactorDisableCode.length !== 6
              "
              @click="confirmDisableTwoFactor"
            >
              {{
                twoFactorDisabling
                  ? 'Disabling...'
                  : 'Disable 2FA'
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.settings-page {
  min-height: 100vh;
  background: #f5f8fc;
  color: #10243e;
  display: flex;
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

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar,
.large-avatar {
  border-radius: 50%;
  background: #07559b;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.avatar {
  width: 39px;
  height: 39px;
  font-size: 12px;
}

.large-avatar {
  width: 52px;
  height: 52px;
  font-size: 15px;
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
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 7px;
  color: #07559b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.page-intro h2 {
  margin: 0;
  color: #122a45;
  font-size: 27px;
  letter-spacing: -0.8px;
}

.intro-text {
  margin: 8px 0 0;
  color: #8b9bad;
  font-size: 13px;
}

/* =========================
   FEEDBACK
========================= */

.error-box,
.success-box {
  margin-bottom: 20px;
  border-radius: 12px;
  padding: 15px 18px;
  display: flex;
  align-items: center;
  gap: 11px;
}

.error-box {
  background: #fff3f3;
  border: 1px solid #f2d3d3;
  color: #9e4545;
}

.error-box strong {
  font-size: 12px;
}

.error-box span {
  font-size: 11px;
  flex: 1;
}

.error-box button {
  border: 0;
  background: #a94b4b;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.success-box {
  background: #eefaf4;
  border: 1px solid #d0ecdd;
  color: #27855e;
  font-size: 11px;
}

.success-icon {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #d9f1e4;
  display: grid;
  place-items: center;
  flex-shrink: 0;
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
   SETTINGS SECTION
========================= */

.settings-section {
  margin-bottom: 31px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 15px;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.section-icon.blue {
  background: #eaf3fb;
  color: #07559b;
}

.section-icon.purple {
  background: #f2edfa;
  color: #7356a9;
}

.section-icon.green {
  background: #eaf8f2;
  color: #299267;
}

.section-icon.orange {
  background: #fff4e7;
  color: #c17a32;
}

.section-heading h2 {
  margin: 0;
  color: #193550;
  font-size: 18px;
}

.section-heading p:last-child {
  margin: 4px 0 0;
  color: #96a3b1;
  font-size: 10px;
}

/* =========================
   SETTINGS CARD
========================= */

.settings-card {
  background: #ffffff;
  border: 1px solid #e7edf4;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(29, 59, 89, 0.035);
  padding: 23px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 22px;
  margin-bottom: 21px;
  border-bottom: 1px solid #edf1f5;
}

.profile-header h3 {
  margin: 0 0 4px;
  color: #263e56;
  font-size: 15px;
}

.profile-header span {
  color: #98a5b2;
  font-size: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  color: #697c90;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 7px;
}

.form-group input {
  width: 100%;
  height: 43px;
  padding: 0 13px;
  border: 1px solid #e1e8ef;
  border-radius: 8px;
  background: #f8fafc;
  color: #52677c;
  outline: none;
  font-size: 11px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ba9b8;
  z-index: 1;
}

.input-with-icon input {
  padding-left: 38px;
}

.settings-card-footer {
  margin-top: 20px;
  padding-top: 17px;
  border-top: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.settings-card-footer span {
  color: #9aa7b5;
  font-size: 9px;
}

/* =========================
   BUTTONS
========================= */

.primary-button,
.secondary-button {
  height: 39px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.primary-button {
  border: 0;
  background: #07559b;
  color: #ffffff;
}

.primary-button:hover {
  background: #06477f;
}

.primary-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.secondary-button {
  border: 1px solid #dce5ee;
  background: #ffffff;
  color: #526b82;
}

.secondary-button:hover {
  background: #f6f9fc;
  color: #07559b;
}

/* =========================
   ACCOUNT INFO
========================= */

.account-information-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.account-information {
  padding: 4px 20px;
  border-right: 1px solid #edf1f5;
}

.account-information:first-child {
  padding-left: 0;
}

.account-information:last-child {
  border-right: 0;
}

.account-information span {
  display: block;
  color: #98a5b3;
  font-size: 9px;
  margin-bottom: 7px;
}

.account-information strong {
  color: #304860;
  font-size: 11px;
}

.status-value {
  display: flex !important;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #efb34d;
}

.status-dot.active {
  background: #38aa74;
}

/* =========================
   SECURITY
========================= */

.security-row {
  min-height: 63px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.security-row-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: #f3f7fa;
  color: #60768b;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.security-row-content {
  flex: 1;
}

.security-row-content strong,
.security-row-content span {
  display: block;
}

.security-row-content strong {
  color: #304860;
  font-size: 12px;
  margin-bottom: 4px;
}

.security-row-content span {
  color: #99a6b3;
  font-size: 9px;
}

.security-divider,
.preference-divider {
  height: 1px;
  background: #edf1f5;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #2a8e67;
  background: #eaf8f2;
  padding: 7px 10px;
  border-radius: 15px;
  font-size: 9px;
  font-weight: 700;
}

.two-factor-row {
  flex-wrap: wrap;
}

.danger-button {
  height: 39px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid #f0d1d1;
  background: #fff6f6;
  color: #ad4b4b;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.danger-button:hover {
  background: #fff0f0;
}

.two-factor-setup {
  margin: 4px 0 8px;
  padding: 20px;
  border-radius: 12px;
  background: #f8fbfe;
  border: 1px solid #e1eaf2;
}

.two-factor-setup-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.two-factor-setup-header strong,
.two-factor-setup-header span {
  display: block;
}

.two-factor-setup-header strong {
  color: #304860;
  font-size: 13px;
  margin-bottom: 5px;
}

.two-factor-setup-header span {
  color: #8c9baa;
  font-size: 9px;
  line-height: 1.6;
}

.setup-close {
  width: 30px;
  height: 30px;
  border: 1px solid #dce5ee;
  border-radius: 7px;
  background: #ffffff;
  color: #718397;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
}

.two-factor-setup-body {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 28px;
  align-items: center;
}

.qr-wrapper {
  width: 230px;
  height: 230px;
  background: #ffffff;
  border: 1px solid #e1e8ef;
  border-radius: 10px;
  display: grid;
  place-items: center;
}

.qr-wrapper img {
  width: 210px;
  height: 210px;
}

.two-factor-instructions p {
  margin: 0 0 16px;
  color: #687b8e;
  font-size: 10px;
  line-height: 1.65;
}

.two-factor-instructions label {
  display: block;
  color: #697c90;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 7px;
}

.two-factor-instructions input {
  width: 100%;
  max-width: 230px;
  height: 43px;
  padding: 0 13px;
  border: 1px solid #dce5ee;
  border-radius: 8px;
  background: #ffffff;
  color: #304860;
  outline: none;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 5px;
}

.two-factor-instructions input:focus {
  border-color: #07559b;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.08);
}

.manual-secret {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.manual-secret span {
  color: #8c9baa;
  font-size: 9px;
}

.manual-secret code {
  display: block;
  width: fit-content;
  max-width: 100%;
  overflow-wrap: anywhere;
  padding: 8px 10px;
  border-radius: 6px;
  background: #eef3f7;
  color: #526b82;
  font-size: 10px;
  letter-spacing: 1px;
}

.two-factor-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 9px;
}

/* =========================
   DISABLE 2FA MODAL
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(10, 28, 48, 0.48);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: modalOverlayIn 0.18s ease-out;
}

.disable-2fa-modal {
  width: 100%;
  max-width: 455px;
  background: #ffffff;
  border: 1px solid #e4ebf2;
  border-radius: 17px;
  padding: 26px;
  box-shadow: 0 24px 70px rgba(20, 45, 70, 0.2);
  animation: modalIn 0.2s ease-out;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: #fff2f2;
  color: #ad4b4b;
  display: grid;
  place-items: center;
  margin-bottom: 17px;
}

.modal-content h3 {
  margin: 0 0 9px;
  color: #203952;
  font-size: 17px;
  letter-spacing: -0.3px;
}

.modal-content > p {
  margin: 0;
  color: #7f90a0;
  font-size: 11px;
  line-height: 1.65;
}

.modal-warning {
  margin-top: 18px;
  padding: 12px 13px;
  border-radius: 9px;
  background: #f8fafc;
  border: 1px solid #e7edf3;
  color: #687c90;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 9px;
  line-height: 1.55;
}

.modal-warning svg {
  flex-shrink: 0;
  color: #07559b;
  margin-top: 1px;
}

.modal-form-group {
  margin-top: 19px;
}

.modal-form-group label {
  display: block;
  margin-bottom: 7px;
  color: #60758a;
  font-size: 10px;
  font-weight: 700;
}

.modal-form-group input {
  width: 100%;
  height: 47px;
  padding: 0 14px;
  border: 1px solid #dce5ee;
  border-radius: 9px;
  background: #ffffff;
  color: #203952;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 6px;
  text-align: center;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.modal-form-group input::placeholder {
  color: #c2ccd6;
  letter-spacing: 5px;
}

.modal-form-group input:focus {
  border-color: #07559b;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.08);
}

.modal-form-group input:disabled {
  background: #f5f7f9;
  cursor: not-allowed;
}

.modal-error {
  display: block;
  margin-top: 7px;
  color: #b14d4d;
  font-size: 9px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 22px;
}

.modal-cancel-button,
.modal-confirm-button {
  height: 40px;
  padding: 0 15px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    opacity 0.2s ease;
}

.modal-cancel-button {
  border: 1px solid #dce5ee;
  background: #ffffff;
  color: #60758a;
}

.modal-cancel-button:hover:not(:disabled) {
  background: #f6f9fc;
}

.modal-confirm-button {
  border: 0;
  background: #ad4b4b;
  color: #ffffff;
}

.modal-confirm-button:hover:not(:disabled) {
  background: #963f3f;
}

.modal-confirm-button:disabled,
.modal-cancel-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@keyframes modalOverlayIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================
   PREFERENCES
========================= */

.preference-row {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.preference-row > div {
  flex: 1;
}

.preference-row strong,
.preference-row span {
  display: block;
}

.preference-row strong {
  color: #304860;
  font-size: 12px;
  margin-bottom: 5px;
}

.preference-row span {
  color: #99a6b3;
  font-size: 9px;
}

.toggle {
  width: 42px;
  height: 23px;
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #d7e0e8;
  border-radius: 20px;
  transition: background 0.2s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 17px;
  height: 17px;
  left: 3px;
  top: 3px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(20, 40, 60, 0.18);
  transition: transform 0.2s ease;
}

.toggle input:checked + .toggle-slider {
  background: #07559b;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(19px);
}

.preferences-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 18px;
  margin-top: 5px;
  border-top: 1px solid #edf1f5;
}

/* =========================
   HELP
========================= */

.help-card {
  background:
    radial-gradient(
      circle at 95% 10%,
      rgba(54, 135, 211, 0.25),
      transparent 25%
    ),
    linear-gradient(130deg, #063d74, #07559b);
  color: #ffffff;
  border-radius: 15px;
  padding: 22px 24px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.help-card-icon {
  width: 43px;
  height: 43px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.13);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.help-card .eyebrow {
  color: rgba(255, 255, 255, 0.62);
}

.help-card h3 {
  margin: 0 0 6px;
  font-size: 15px;
}

.help-card p:last-child {
  margin: 0;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  line-height: 1.6;
}

/* =========================
   MOBILE
========================= */

.mobile-overlay {
  display: none;
}

@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 12px 0 30px rgba(25, 50, 75, 0.08);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 45;
    display: block;
    background: rgba(20, 40, 60, 0.35);
  }

  .mobile-close {
    display: block;
  }

  .main-content {
    margin-left: 0;
  }

  .mobile-menu-button {
    display: inline-flex;
  }

  .dashboard-header {
    padding: 0 24px;
  }

  .content {
    padding: 28px 24px 50px;
  }

  .account-information-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .account-information {
    border-right: 0;
    padding: 4px 0;
  }
}

@media (max-width: 650px) {
  .dashboard-header {
    height: 76px;
    padding: 0 17px;
  }

  .header-right {
    gap: 10px;
  }

  .profile-info,
  .profile-chevron {
    display: none;
  }

  .content {
    padding: 24px 16px 40px;
  }

  .page-intro h2 {
    font-size: 23px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: auto;
  }

  .settings-card {
    padding: 17px;
  }

  .settings-card-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .account-information-grid {
    grid-template-columns: 1fr 1fr;
  }

  .security-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .security-row-content {
    min-width: calc(100% - 51px);
  }

  .security-row > .secondary-button,
  .security-row > .danger-button,
  .security-row > .verified-badge {
    margin-left: 51px;
  }

  .two-factor-setup-body {
    grid-template-columns: 1fr;
  }

  .qr-wrapper {
    width: 230px;
    height: 230px;
    margin: 0 auto;
  }

  .two-factor-instructions input {
    max-width: none;
  }

  .two-factor-actions {
    justify-content: stretch;
  }

  .two-factor-actions button {
    flex: 1;
  }

  .preference-row {
    align-items: flex-start;
    padding: 17px 0;
  }

  .help-card {
    padding: 19px;
  }
}

@media (max-width: 520px) {
  .disable-2fa-modal {
    padding: 21px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-cancel-button,
  .modal-confirm-button {
    width: 100%;
  }
}
</style>
```
