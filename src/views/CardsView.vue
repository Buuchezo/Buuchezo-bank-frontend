<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NotificationDropdown from '../components/layout/NotificationDropdownView.vue'

import {
  ArrowLeftRight,
  BarChart3,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Send,
  Settings,
  WalletCards,
  Wifi
} from 'lucide-vue-next'

import { type Card, getCardsByAccount } from '../service/cardService'
import { type CardApplication, createCardApplication, getMyCardApplications } from '../service/cardApplicationService'

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

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

const mobileMenuOpen = ref(false)
const loading = ref(true)
const errorMessage = ref('')

const cards = ref<Card[]>([])
const selectedCardIndex = ref(0)

const applications = ref<CardApplication[]>([])
const applicationModalOpen = ref(false)
const applicationSubmitting = ref(false)
const applicationError = ref('')
const applicationSuccess = ref('')
const selectedApplicationType = ref<'DEBIT' | 'CREDIT'>('DEBIT')

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

const fullName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`.trim()
})

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase() || 'U'
})

const selectedCard = computed<Card | null>(() => {
  return cards.value[selectedCardIndex.value] ?? cards.value[0] ?? null
})

const cardHolderName = computed(() => {
  return selectedCard.value?.holderName || fullName.value || 'ACCOUNT HOLDER'
})

const cardTypeLabel = computed(() => {
  const type = selectedCard.value?.cardType || 'CARD'

  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const cardStatusLabel = computed(() => {
  const status = selectedCard.value?.cardStatus || 'UNKNOWN'

  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const cardIsActive = computed(() => {
  return selectedCard.value?.cardStatus?.toUpperCase() === 'ACTIVE'
})

const cardIsBlocked = computed(() => {
  return selectedCard.value?.cardStatus?.toUpperCase() === 'BLOCKED'
})

const cardStatusClass = computed(() => {
  if (cardIsActive.value) {
    return 'active'
  }

  if (cardIsBlocked.value) {
    return 'blocked'
  }

  return 'other'
})

const maskedCardNumber = computed(() => {
  return selectedCard.value?.maskedCardNumber || '•••• •••• •••• ••••'
})

const expiryDate = computed(() => {
  const date = selectedCard.value?.expiryDate

  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('en-GB', {
    month: '2-digit',
    year: '2-digit',
  })
})

const expiryDateLong = computed(() => {
  const date = selectedCard.value?.expiryDate

  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('en-GB', {
    month: '2-digit',
    year: 'numeric',
  })
})

const cardNumberSuffix = computed(() => {
  const value = selectedCard.value?.maskedCardNumber || ''
  const digits = value.replace(/\D/g, '')

  return digits.slice(-4) || '••••'
})

const pendingApplication = computed<CardApplication | null>(
  () =>
    applications.value.find(
      (a) => a.applicationStatus === 'PENDING' && a.accountNumber === account.value.accountNumber,
    ) ?? null,
)

const latestApplication = computed<CardApplication | null>(
  () => applications.value.find((a) => a.accountNumber === account.value.accountNumber) ?? null,
)

const applicationStatusLabel = computed(() => {
  const status = latestApplication.value?.applicationStatus
  if (!status) return ''
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const applicationStatusClass = computed(
  () => latestApplication.value?.applicationStatus?.toLowerCase() ?? 'pending',
)

async function loadUserAndCards() {
  loading.value = true
  errorMessage.value = ''

  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

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
      throw new Error(result.message || 'Unable to load your account information.')
    }

    user.value = result.data.user
    account.value = result.data.account

    cards.value = await getCardsByAccount(account.value.accountNumber)
    selectedCardIndex.value = 0

    try {
      applications.value = await getMyCardApplications()
    } catch (applicationError) {
      console.error('Failed to load card applications:', applicationError)
      applications.value = []
    }
  } catch (error) {
    console.error('Failed to load user and cards:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load your card information.'
  } finally {
    loading.value = false
  }
}

function openApplicationModal(type: 'DEBIT' | 'CREDIT' = 'DEBIT') {
  applicationError.value = ''
  applicationSuccess.value = ''
  selectedApplicationType.value = type
  applicationModalOpen.value = true
}

function closeApplicationModal() {
  if (!applicationSubmitting.value) applicationModalOpen.value = false
  applicationError.value = ''
}

async function submitCardApplication() {
  if (pendingApplication.value) {
    applicationError.value = 'You already have a pending card application for this account.'
    return
  }
  applicationSubmitting.value = true
  applicationError.value = ''
  applicationSuccess.value = ''
  try {
    const application = await createCardApplication({
      accountNumber: account.value.accountNumber,
      cardType: selectedApplicationType.value,
      holderName: fullName.value,
    })
    applications.value = [
      application,
      ...applications.value.filter((item) => item.id !== application.id),
    ]
    applicationModalOpen.value = false
    applicationSuccess.value = `${selectedApplicationType.value === 'DEBIT' ? 'Debit' : 'Credit'} card application submitted successfully.`
  } catch (error) {
    applicationError.value =
      error instanceof Error ? error.message : 'Unable to submit your card application.'
  } finally {
    applicationSubmitting.value = false
  }
}

function selectCard(index: number) {
  selectedCardIndex.value = index
}

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')

  router.push('/login')
}

onMounted(loadUserAndCards)
</script>

<template>
  <div class="cards-page">
    <!-- MOBILE OVERLAY -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false" />

    <!-- SIDEBAR -->
    <aside :class="{ 'sidebar-open': mobileMenuOpen }" class="sidebar">
      <div class="sidebar-top">
        <RouterLink class="dashboard-logo" to="/" @click="mobileMenuOpen = false">
          <span>B</span>
          <strong>Buuchezo Bank</strong>
        </RouterLink>

        <button
          aria-label="Close menu"
          class="mobile-close"
          type="button"
          @click="mobileMenuOpen = false"
        >
          ×
        </button>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section-title">MAIN</p>

        <RouterLink class="nav-item" to="/dashboard" @click="mobileMenuOpen = false">
          <LayoutDashboard :size="19" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink class="nav-item" to="/accounts" @click="mobileMenuOpen = false">
          <WalletCards :size="19" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink class="nav-item" to="/transactions" @click="mobileMenuOpen = false">
          <ArrowLeftRight :size="19" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink class="nav-item active" to="/cards" @click="mobileMenuOpen = false">
          <CreditCard :size="19" />
          <span>Cards</span>
        </RouterLink>

        <p class="nav-section-title second">SERVICES</p>

        <RouterLink class="nav-item" to="/transfers" @click="mobileMenuOpen = false">
          <Send :size="19" />
          <span>Transfers</span>
        </RouterLink>

        <a class="nav-item" href="#" @click.prevent>
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

        <button class="logout-button" type="button" @click="logout">
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
            aria-label="Open menu"
            class="mobile-menu-button"
            type="button"
            @click="mobileMenuOpen = true"
          >
            <Menu :size="22" />
          </button>

          <div>
            <span class="page-label">BANKING</span>
            <h1>Cards</h1>
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
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <section class="content">
        <div class="page-intro">
          <div>
            <p class="eyebrow">YOUR CARDS</p>

            <h2>Cards made simple.</h2>

            <p class="intro-text">Manage your Buuchezo Bank cards and card security.</p>
          </div>
        </div>

        <!-- ERROR -->
        <div v-if="errorMessage" class="error-box">
          <strong>Something went wrong</strong>

          <span>{{ errorMessage }}</span>

          <button type="button" @click="loadUserAndCards">Try again</button>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="loading-card">
          <div class="spinner" />

          <p>Loading your card...</p>
        </div>

        <template v-else-if="!errorMessage">
          <!-- NO CARD STATE -->
          <section v-if="cards.length === 0" class="no-card-state">
            <div class="no-card-icon">
              <CreditCard :size="26" />
            </div>

            <div>
              <p class="eyebrow">YOUR CARDS</p>
              <h2>No card yet</h2>
              <p>You don't have a Buuchezo Bank card linked to your account yet.</p>
            </div>

            <button
              :disabled="!!pendingApplication"
              class="apply-card-button"
              type="button"
              @click="openApplicationModal('DEBIT')"
            >
              <CreditCard :size="17" />
              {{ pendingApplication ? 'Application pending' : 'Apply for a card' }}
            </button>
          </section>

          <!-- CARD + DETAILS -->
          <template v-else>
            <section class="cards-layout">
              <!-- VISUAL BANK CARD -->
              <div class="card-column">
                <div class="bank-card">
                  <div class="card-top">
                    <div class="card-brand">
                      <span>B</span>
                      <strong>Buuchezo</strong>
                    </div>

                    <Wifi :size="25" class="contactless" />
                  </div>

                  <div class="chip">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div class="card-number">
                    {{ maskedCardNumber }}
                  </div>

                  <div class="card-bottom">
                    <div>
                      <span>CARD HOLDER</span>

                      <strong>
                        {{ cardHolderName }}
                      </strong>
                    </div>

                    <div>
                      <span>VALID THRU</span>

                      <strong>{{ expiryDate }}</strong>
                    </div>

                    <div class="visa">VISA</div>
                  </div>
                </div>

                <div v-if="cards.length > 1" class="card-selector">
                  <button
                    v-for="(card, index) in cards"
                    :key="card.id"
                    :class="{ selected: selectedCardIndex === index }"
                    type="button"
                    @click="selectCard(index)"
                  >
                    <CreditCard :size="15" />
                    {{ card.maskedCardNumber }}
                  </button>
                </div>
              </div>

              <!-- CARD DETAILS -->
              <div class="card-details">
                <div class="details-header">
                  <div>
                    <p class="eyebrow">
                      {{ cardTypeLabel.toUpperCase() }}
                    </p>

                    <h3>Personal Card</h3>
                  </div>

                  <span :class="cardStatusClass" class="card-status">
                    <span />

                    {{ cardStatusLabel }}
                  </span>
                </div>

                <div class="details-list">
                  <div class="detail-row">
                    <span>Card holder</span>

                    <strong>
                      {{ cardHolderName }}
                    </strong>
                  </div>

                  <div class="detail-row">
                    <span>Card type</span>

                    <strong>{{ cardTypeLabel }}</strong>
                  </div>

                  <div class="detail-row">
                    <span>Card number</span>

                    <strong>•••• {{ cardNumberSuffix }}</strong>
                  </div>

                  <div class="detail-row">
                    <span>Expiration</span>

                    <strong>{{ expiryDateLong }}</strong>
                  </div>

                  <div class="detail-row">
                    <span>Account</span>

                    <strong>{{ account.accountNumber }}</strong>
                  </div>

                  <div class="detail-row">
                    <span>Currency</span>

                    <strong>
                      {{ account.currency || 'EUR' }}
                    </strong>
                  </div>
                </div>

                <div class="security-note">
                  <CreditCard :size="14" />

                  <span>
                    Your card number is protected. Buuchezo Bank only provides the masked card
                    number through the customer API.
                  </span>
                </div>
              </div>
            </section>

            <!-- CARD FEATURES -->
            <section class="features-section">
              <div class="section-heading">
                <p class="eyebrow">CARD SERVICES</p>

                <h2>Everything in one place.</h2>
              </div>

              <div class="features-grid">
                <article class="feature-card">
                  <div class="feature-icon blue">
                    <CreditCard :size="20" />
                  </div>

                  <h3>Card status</h3>

                  <p>
                    Your current card status is
                    <strong>{{ cardStatusLabel.toLowerCase() }}</strong
                    >.
                  </p>

                  <span class="feature-status">
                    {{ cardIsActive ? 'Active' : 'See status above' }}
                  </span>
                </article>

                <article class="feature-card">
                  <div class="feature-icon purple">
                    <BarChart3 :size="20" />
                  </div>

                  <h3>Manage your finances</h3>

                  <p>
                    Use your card together with your Buuchezo Bank account and transaction tools.
                  </p>

                  <span class="feature-status"> Available </span>
                </article>

                <article class="feature-card">
                  <div class="feature-icon green">
                    <Wifi :size="20" />
                  </div>

                  <h3>Contactless payments</h3>

                  <p>Use contactless payments wherever your card is accepted.</p>

                  <span class="feature-status"> Available </span>
                </article>
              </div>
            </section>

            <!-- CARD APPLICATION -->
            <section class="coming-soon">
              <div class="coming-soon-content">
                <div class="coming-icon"><CreditCard :size="22" /></div>
                <div class="application-copy">
                  <p class="eyebrow">ADDITIONAL CARDS</p>
                  <h3>Need another card?</h3>
                  <p>
                    Apply for an additional debit or credit card. Your application will be reviewed
                    by Buuchezo Bank before a card is issued.
                  </p>
                  <div v-if="latestApplication" class="application-status-row">
                    <span>Latest application</span>
                    <strong :class="applicationStatusClass">{{ applicationStatusLabel }}</strong>
                  </div>
                  <p
                    v-if="
                      latestApplication?.applicationStatus === 'REJECTED' &&
                      latestApplication.rejectionReason
                    "
                    class="application-rejection"
                  >
                    {{ latestApplication.rejectionReason }}
                  </p>
                  <p v-if="applicationSuccess" class="application-success">
                    {{ applicationSuccess }}
                  </p>
                </div>
                <div class="application-actions">
                  <button
                    :disabled="!!pendingApplication"
                    class="secondary-card-button"
                    type="button"
                    @click="openApplicationModal('DEBIT')"
                  >
                    Debit card
                  </button>
                  <button
                    :disabled="!!pendingApplication"
                    class="secondary-card-button secondary"
                    type="button"
                    @click="openApplicationModal('CREDIT')"
                  >
                    Credit card
                  </button>
                </div>
              </div>
            </section>
          </template>
        </template>
      </section>

      <div
        v-if="applicationModalOpen"
        class="application-modal-backdrop"
        @click.self="closeApplicationModal"
      >
        <section
          aria-labelledby="application-modal-title"
          aria-modal="true"
          class="application-modal"
          role="dialog"
        >
          <div class="application-modal-header">
            <div>
              <p class="eyebrow">CARD APPLICATION</p>
              <h2 id="application-modal-title">Apply for a card</h2>
            </div>
            <button
              :disabled="applicationSubmitting"
              aria-label="Close application"
              class="application-close"
              type="button"
              @click="closeApplicationModal"
            >
              ×
            </button>
          </div>
          <p class="application-modal-text">
            Choose the card type you would like to request. Your application will be reviewed by
            Buuchezo Bank.
          </p>
          <div class="application-type-grid">
            <button
              :class="{ selected: selectedApplicationType === 'DEBIT' }"
              type="button"
              @click="selectedApplicationType = 'DEBIT'"
            >
              <CreditCard :size="20" /><span
                ><strong>Debit Card</strong
                ><small>Use your bank account for everyday payments.</small></span
              >
            </button>
            <button
              :class="{ selected: selectedApplicationType === 'CREDIT' }"
              type="button"
              @click="selectedApplicationType = 'CREDIT'"
            >
              <CreditCard :size="20" /><span
                ><strong>Credit Card</strong
                ><small>Request a credit card for eligible purchases.</small></span
              >
            </button>
          </div>
          <div class="application-summary">
            <div>
              <span>Card holder</span><strong>{{ fullName }}</strong>
            </div>
            <div>
              <span>Account</span><strong>{{ account.accountNumber }}</strong>
            </div>
            <div>
              <span>Card type</span
              ><strong>{{ selectedApplicationType === 'DEBIT' ? 'Debit' : 'Credit' }}</strong>
            </div>
          </div>
          <div v-if="applicationError" class="application-modal-error">{{ applicationError }}</div>
          <div class="application-modal-actions">
            <button
              :disabled="applicationSubmitting"
              class="application-cancel"
              type="button"
              @click="closeApplicationModal"
            >
              Cancel
            </button>
            <button
              :disabled="applicationSubmitting"
              class="application-submit"
              type="button"
              @click="submitCardApplication"
            >
              <span v-if="applicationSubmitting" class="small-spinner" />{{
                applicationSubmitting ? 'Submitting...' : 'Submit application'
              }}
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.cards-page {
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
   CARDS LAYOUT
========================= */

.cards-layout {
  display: grid;
  grid-template-columns:
    minmax(400px, 1.1fr)
    minmax(350px, 0.9fr);
  gap: 25px;
  margin-bottom: 42px;
}

.card-column {
  min-width: 0;
}

.bank-card {
  width: min(100%, 500px);
  min-height: 285px;
  border-radius: 21px;
  padding: 28px 30px 25px;
  background:
    radial-gradient(circle at 88% 15%, rgba(85, 164, 231, 0.34), transparent 27%),
    linear-gradient(130deg, #063d74 0%, #07559b 50%, #143fbd 100%);
  color: #ffffff;
  box-shadow: 0 22px 45px rgba(8, 57, 103, 0.19);
  position: relative;
  overflow: hidden;
  transition: filter 0.2s ease;
}

.bank-card::before {
  content: '';
  position: absolute;
  width: 250px;
  height: 250px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  right: -80px;
  top: -120px;
}

.bank-card::after {
  content: '';
  position: absolute;
  width: 170px;
  height: 170px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  left: -100px;
  bottom: -100px;
}

.bank-card.locked {
  filter: grayscale(0.35);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.card-brand {
  display: flex;
  align-items: center;
  gap: 9px;
}

.card-brand span {
  width: 31px;
  height: 31px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.15);
  font-size: 16px;
  font-weight: 800;
}

.card-brand strong {
  font-size: 13px;
}

.contactless {
  transform: rotate(90deg);
  opacity: 0.85;
}

.chip {
  width: 43px;
  height: 32px;
  border-radius: 6px;
  background: #d7b66e;
  margin-top: 39px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  padding: 5px;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.chip span {
  border: 1px solid rgba(72, 58, 24, 0.38);
  border-radius: 2px;
}

.card-number {
  margin-top: 22px;
  font-family: 'Courier New', monospace;
  font-size: 19px;
  letter-spacing: 1.3px;
  position: relative;
  z-index: 2;
}

.card-bottom {
  display: flex;
  align-items: flex-end;
  gap: 28px;
  margin-top: 23px;
  position: relative;
  z-index: 2;
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
  font-size: 21px;
  font-style: italic;
  font-weight: 800;
}

.card-lock-overlay {
  display: none;
}

.bank-card.locked .card-lock-overlay {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(5, 26, 50, 0.47);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
}

.card-number-control {
  margin-top: 13px;
}

.card-number-control button {
  border: 0;
  background: transparent;
  color: #6f8094;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 0;
  cursor: pointer;
}

.card-number-control button:hover {
  color: #07559b;
}

/* =========================
   DETAILS
========================= */

.card-details {
  background: #ffffff;
  border: 1px solid #e7edf4;
  border-radius: 17px;
  padding: 25px;
  box-shadow: 0 7px 20px rgba(29, 59, 89, 0.035);
  align-self: start;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  padding-bottom: 21px;
  border-bottom: 1px solid #edf1f5;
}

.details-header h3 {
  margin: 0;
  color: #193550;
  font-size: 20px;
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  background: #eaf8f2;
  color: #2a8e67;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.card-status span {
  width: 6px;
  height: 6px;
  background: #35a874;
  border-radius: 50%;
}

.card-status.locked {
  background: #fff1f1;
  color: #b04f4f;
}

.card-status.locked span {
  background: #d55b5b;
}

.details-list {
  padding: 5px 0;
}

.detail-row {
  min-height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #f0f3f6;
}

.detail-row:last-child {
  border-bottom: 0;
}

.detail-row span {
  color: #8e9cad;
  font-size: 11px;
}

.detail-row strong {
  color: #304860;
  font-size: 11px;
  text-align: right;
}

/* =========================
   BUTTON
========================= */

.lock-card-button {
  width: 100%;
  height: 44px;
  margin-top: 17px;
  border: 1px solid #dce5ee;
  border-radius: 9px;
  background: #ffffff;
  color: #34506b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.lock-card-button:hover {
  background: #f5f8fb;
}

.lock-card-button.unlock {
  border-color: #bfe3d2;
  background: #eefaf4;
  color: #27855e;
}

.security-note {
  margin: 14px 0 0;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: #9aa8b6;
  font-size: 9px;
  line-height: 1.5;
}

/* =========================
   FEATURES
========================= */

.features-section {
  margin-bottom: 38px;
}

.section-heading {
  margin-bottom: 17px;
}

.section-heading h2 {
  margin: 0;
  color: #122a45;
  font-size: 22px;
  letter-spacing: -0.5px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.feature-card {
  background: #ffffff;
  border: 1px solid #e7edf4;
  border-radius: 14px;
  padding: 20px;
  min-height: 180px;
}

.feature-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  margin-bottom: 15px;
}

.feature-icon.blue {
  color: #07559b;
  background: #eaf3fb;
}

.feature-icon.purple {
  color: #7356a9;
  background: #f2edfa;
}

.feature-icon.green {
  color: #299267;
  background: #eaf8f2;
}

.feature-card h3 {
  margin: 0 0 7px;
  color: #263f58;
  font-size: 13px;
}

.feature-card p {
  margin: 0;
  color: #94a2b0;
  font-size: 10px;
  line-height: 1.6;
}

.feature-status {
  display: inline-block;
  margin-top: 14px;
  color: #07559b;
  font-size: 9px;
  font-weight: 700;
}

/* =========================
   COMING SOON
========================= */

.coming-soon {
  border: 1px solid #dce8f2;
  background: linear-gradient(135deg, #f4f9fd, #ffffff);
  border-radius: 15px;
  padding: 20px 23px;
}

.coming-soon-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.coming-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  background: #eaf3fb;
  color: #07559b;
  border-radius: 11px;
  display: grid;
  place-items: center;
}

.coming-soon h3 {
  margin: 0 0 6px;
  color: #243d57;
  font-size: 14px;
}

.coming-soon p:last-child {
  margin: 0;
  color: #8e9dab;
  font-size: 10px;
  line-height: 1.6;
  max-width: 720px;
}

/* =========================
   MOBILE
========================= */

.mobile-overlay {
  display: none;
}

@media (max-width: 1000px) {
  .cards-layout {
    grid-template-columns: 1fr;
  }

  .bank-card {
    width: min(100%, 520px);
  }

  .card-details {
    max-width: 650px;
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

  .profile-info {
    display: none;
  }

  .header-right {
    gap: 10px;
  }

  .page-intro h2 {
    font-size: 23px;
  }

  .cards-layout {
    gap: 18px;
  }

  .bank-card {
    min-height: 240px;
    padding: 22px 22px 20px;
  }

  .chip {
    margin-top: 27px;
  }

  .card-number {
    margin-top: 17px;
    font-size: 15px;
  }

  .card-bottom {
    margin-top: 17px;
    gap: 17px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .coming-soon-content {
    flex-direction: column;
  }

  .application-actions {
    margin-left: 0;
    width: 100%;
  }
  .application-actions .secondary-card-button {
    flex: 1;
  }
  .application-type-grid {
    grid-template-columns: 1fr;
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

  .bank-card {
    min-height: 220px;
  }

  .card-number {
    font-size: 13px;
    letter-spacing: 0.7px;
  }

  .card-bottom {
    gap: 11px;
  }
}

/* =========================
   BACKEND CARD STATES
========================= */

.no-card-state {
  background: #ffffff;
  border: 1px solid #e7edf4;
  border-radius: 17px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
  box-shadow: 0 7px 20px rgba(29, 59, 89, 0.035);
}

.no-card-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #eaf3fb;
  color: #07559b;
  display: grid;
  place-items: center;
}

.no-card-state h2 {
  margin: 0;
  color: #193550;
  font-size: 20px;
}

.no-card-state p:not(.eyebrow) {
  margin: 6px 0 0;
  color: #8e9cad;
  font-size: 11px;
  line-height: 1.6;
}

.apply-card-button,
.secondary-card-button {
  border: 0;
  border-radius: 9px;
  background: #07559b;
  color: #ffffff;
  height: 42px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  margin-left: auto;
}

.apply-card-button:hover,
.secondary-card-button:hover {
  background: #063f75;
}

.card-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.card-selector button {
  border: 1px solid #dfe7ef;
  background: #ffffff;
  color: #63768a;
  border-radius: 8px;
  min-height: 34px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 650;
  cursor: pointer;
}

.card-selector button.selected {
  border-color: #07559b;
  background: #eaf3fb;
  color: #07559b;
}

.card-status.active {
  background: #eaf8f2;
  color: #2a8e67;
}

.card-status.active span {
  background: #35a874;
}

.card-status.blocked {
  background: #fff1e8;
  color: #b7682d;
}

.card-status.blocked span {
  background: #d67b35;
}

.card-status.other {
  background: #eef2f6;
  color: #66788b;
}

.card-status.other span {
  background: #8998a8;
}

.security-note {
  align-items: flex-start;
}

.security-note span {
  display: block;
}

.secondary-card-button {
  margin-left: auto;
  align-self: center;
}

/* =========================
   CARD APPLICATION
========================= */
.application-copy {
  min-width: 0;
  flex: 1;
}
.application-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 11px;
  font-size: 10px;
  color: #8e9dab;
}
.application-status-row strong {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 9px;
  font-weight: 800;
  text-transform: capitalize;
}
.application-status-row strong.pending {
  background: #fff5df;
  color: #a76d19;
}
.application-status-row strong.approved {
  background: #eaf8f2;
  color: #2a8e67;
}
.application-status-row strong.rejected {
  background: #fff1f1;
  color: #b04f4f;
}
.application-rejection {
  margin-top: 8px !important;
  color: #b04f4f !important;
}
.application-success {
  margin-top: 8px !important;
  color: #2a8e67 !important;
  font-weight: 600;
}
.application-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-self: center;
}
.secondary-card-button:disabled,
.apply-card-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.secondary-card-button.secondary {
  background: #fff;
  color: #07559b;
  border: 1px solid #cddceb;
}
.secondary-card-button.secondary:hover:not(:disabled) {
  background: #eaf3fb;
}
.application-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(12, 31, 50, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.application-modal {
  width: min(100%, 520px);
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e3eaf1;
  box-shadow: 0 24px 70px rgba(13, 39, 65, 0.2);
  padding: 25px;
}
.application-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}
.application-modal-header h2 {
  margin: 0;
  color: #193550;
  font-size: 21px;
}
.application-close {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 9px;
  background: #f3f6f9;
  color: #61758a;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.application-modal-text {
  margin: 13px 0 18px;
  color: #8e9dab;
  font-size: 11px;
  line-height: 1.6;
}
.application-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.application-type-grid button {
  border: 1px solid #dfe7ef;
  border-radius: 12px;
  background: #fff;
  padding: 14px;
  color: #5e7287;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  text-align: left;
  cursor: pointer;
}
.application-type-grid button.selected {
  border-color: #07559b;
  background: #eaf3fb;
  color: #07559b;
}
.application-type-grid strong,
.application-type-grid small {
  display: block;
}
.application-type-grid strong {
  color: #29455f;
  font-size: 11px;
  margin-bottom: 4px;
}
.application-type-grid small {
  color: #8e9dab;
  font-size: 9px;
  line-height: 1.45;
}
.application-summary {
  margin-top: 16px;
  border: 1px solid #e7edf4;
  border-radius: 12px;
  padding: 13px 14px;
  background: #f8fafc;
}
.application-summary > div {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  min-height: 32px;
  align-items: center;
  border-bottom: 1px solid #e9eef3;
}
.application-summary > div:last-child {
  border-bottom: 0;
}
.application-summary span {
  color: #8e9dab;
  font-size: 10px;
}
.application-summary strong {
  color: #304860;
  font-size: 10px;
  text-align: right;
}
.application-modal-error {
  margin-top: 13px;
  padding: 10px 12px;
  border-radius: 9px;
  background: #fff3f3;
  border: 1px solid #f2d3d3;
  color: #a34e4e;
  font-size: 10px;
  line-height: 1.5;
}
.application-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 20px;
}
.application-cancel,
.application-submit {
  height: 40px;
  padding: 0 15px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.application-cancel {
  border: 1px solid #dce5ee;
  background: #fff;
  color: #50657b;
}
.application-submit {
  border: 0;
  background: #07559b;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.small-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@media (max-width: 750px) {
  .no-card-state {
    align-items: flex-start;
    flex-direction: column;
  }

  .apply-card-button {
    margin-left: 0;
  }

  .coming-soon-content .secondary-card-button {
    margin-left: 0;
  }
}
</style>
