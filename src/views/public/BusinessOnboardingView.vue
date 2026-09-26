<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import buuchezoBankLogo from '@/assets/images/buuchezobank-logo.png'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Building2,
  UserRound,
  WalletCards,
  AlertCircle,
} from 'lucide-vue-next'

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084'

type Step = 1 | 2 | 3

const step = ref<Step>(1)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  owner: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },

  business: {
    legalName: '',
    tradingName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Germany',
  },

  account: {
    accountType: 'CURRENT',
    currency: 'EUR',
  },
})

const stepTitles = {
  1: 'Your details',
  2: 'Business details',
  3: 'Business account',
}

const stepDescriptions = {
  1: 'Tell us who will own and manage the business account.',
  2: 'Enter the legal information for your business.',
  3: 'Choose the account you want to open.',
}

const progress = computed(() => `${(step.value / 3) * 100}%`)

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

function validateStep(): boolean {
  clearMessages()

  if (step.value === 1) {
    if (!form.value.owner.firstName.trim()) {
      errorMessage.value = 'First name is required.'
      return false
    }

    if (!form.value.owner.lastName.trim()) {
      errorMessage.value = 'Last name is required.'
      return false
    }

    if (!form.value.owner.email.trim()) {
      errorMessage.value = 'Email address is required.'
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.owner.email)) {
      errorMessage.value = 'Enter a valid email address.'
      return false
    }

    if (form.value.owner.password.length < 8) {
      errorMessage.value = 'Password must contain at least 8 characters.'
      return false
    }

    if (form.value.owner.password !== form.value.owner.confirmPassword) {
      errorMessage.value = 'Passwords do not match.'
      return false
    }
  }

  if (step.value === 2) {
    if (!form.value.business.legalName.trim()) {
      errorMessage.value = 'Legal business name is required.'
      return false
    }

    if (!form.value.business.registrationNumber.trim()) {
      errorMessage.value = 'Registration number is required.'
      return false
    }

    if (!form.value.business.email.trim()) {
      errorMessage.value = 'Business email is required.'
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.business.email)) {
      errorMessage.value = 'Enter a valid business email address.'
      return false
    }

    if (!form.value.business.phone.trim()) {
      errorMessage.value = 'Business phone number is required.'
      return false
    }

    if (!form.value.business.address.trim()) {
      errorMessage.value = 'Business address is required.'
      return false
    }

    if (!form.value.business.city.trim()) {
      errorMessage.value = 'Business city is required.'
      return false
    }

    if (!form.value.business.country.trim()) {
      errorMessage.value = 'Business country is required.'
      return false
    }
  }

  if (step.value === 3) {
    if (!form.value.account.accountType) {
      errorMessage.value = 'Select an account type.'
      return false
    }

    if (!form.value.account.currency) {
      errorMessage.value = 'Select a currency.'
      return false
    }
  }

  return true
}

function nextStep() {
  if (!validateStep()) {
    return
  }

  if (step.value < 3) {
    step.value = (step.value + 1) as Step
    clearMessages()
  }
}

function previousStep() {
  clearMessages()

  if (step.value > 1) {
    step.value = (step.value - 1) as Step
  }
}

function storeAuthentication(token: string, user: unknown) {
  localStorage.setItem('accessToken', token)
  localStorage.setItem('user', JSON.stringify(user))

  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('user')
}

async function submitOnboarding() {
  if (!validateStep()) {
    return
  }

  loading.value = true
  clearMessages()

  try {
    const response = await fetch(`${API_BASE_URL}/api/businesses/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: {
          firstName: form.value.owner.firstName.trim(),
          lastName: form.value.owner.lastName.trim(),
          email: form.value.owner.email.trim(),
          password: form.value.owner.password,
        },

        business: {
          legalName: form.value.business.legalName.trim(),
          tradingName: form.value.business.tradingName.trim() || null,
          registrationNumber: form.value.business.registrationNumber.trim(),
          email: form.value.business.email.trim(),
          phone: form.value.business.phone.trim(),
          address: form.value.business.address.trim(),
          city: form.value.business.city.trim(),
          country: form.value.business.country.trim(),
        },

        account: {
          accountType: form.value.account.accountType,
          currency: form.value.account.currency,
        },
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.message || 'Unable to complete business account onboarding.')
    }

    const data = result.data

    if (!data?.authentication?.token) {
      throw new Error(
        'Business account was created, but authentication information was not returned.',
      )
    }

    storeAuthentication(data.authentication.token, data.authentication.user)

    localStorage.setItem('business', JSON.stringify(data.business))

    localStorage.setItem('businessAccount', JSON.stringify(data.account))

    successMessage.value = 'Your business account has been created successfully.'

    await router.push('/business/dashboard')
  } catch (error) {
    console.error('Business onboarding failed:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to complete business account onboarding.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="onboarding-page">
    <!-- =========================================================
         SIDEBAR
    ========================================================== -->

    <aside class="banking-sidebar">
      <div class="banking-sidebar-top">
        <RouterLink to="/business" class="banking-logo">
          <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="banking-logo-image" />

          <span class="banking-logo-text"> Buuchezo Bank </span>
        </RouterLink>
      </div>

      <nav class="banking-navigation">
        <!-- MAIN -->

        <div class="banking-navigation-group">
          <p class="banking-navigation-label">MAIN</p>

          <RouterLink to="/business/dashboard" class="banking-navigation-item">
            <WalletCards :size="18" />
            <span>Overview</span>
          </RouterLink>

          <RouterLink to="/business/onboarding" class="banking-navigation-item active">
            <Building2 :size="18" />
            <span>Business account</span>
          </RouterLink>

          <a href="#" class="banking-navigation-item" @click.prevent>
            <ArrowRight :size="18" />
            <span>Transactions</span>
          </a>
        </div>

        <!-- SERVICES -->

        <div class="banking-navigation-group banking-services-group">
          <p class="banking-navigation-label">SERVICES</p>

          <a href="#" class="banking-navigation-item" @click.prevent>
            <WalletCards :size="18" />
            <span>Accounts</span>
          </a>

          <a href="#" class="banking-navigation-item" @click.prevent>
            <Building2 :size="18" />
            <span>Business profile</span>
          </a>
        </div>
      </nav>

      <!-- SIDEBAR BOTTOM -->

      <div class="banking-sidebar-bottom">
        <div class="banking-support-box">
          <div class="banking-support-icon">
            <AlertCircle :size="17" />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>
        </div>

        <RouterLink to="/business" class="banking-back-button">
          <ArrowLeft :size="17" />
          <span>Back to business</span>
        </RouterLink>
      </div>
    </aside>

    <!-- =========================================================
         MAIN APPLICATION
    ========================================================== -->

    <main class="banking-main">
      <!-- HEADER -->

      <header class="banking-header">
        <div class="banking-page-heading">
          <span class="banking-page-section"> BUUCHEZO BUSINESS </span>

          <h1>Business account</h1>
        </div>

        <RouterLink to="/business" class="header-back-link">
          <ArrowLeft :size="16" />
          Back to Business Banking
        </RouterLink>
      </header>

      <!-- CONTENT -->

      <section class="banking-content">
        <div class="onboarding-container">
          <!-- INTRO -->

          <section class="page-intro">
            <div>
              <span class="intro-eyebrow"> BUSINESS BANKING </span>

              <h2>Open your business account</h2>

              <p>
                Set up your business banking in a few simple steps. Your business account will be
                ready once the application is completed.
              </p>
            </div>
          </section>

          <!-- PROGRESS -->

          <section class="progress-card">
            <div class="progress-header">
              <div>
                <span> Step {{ step }} of 3 </span>

                <strong>
                  {{ stepTitles[step] }}
                </strong>
              </div>

              <strong class="progress-value"> {{ Math.round((step / 3) * 100) }}% </strong>
            </div>

            <div class="progress-track">
              <div class="progress-bar" :style="{ width: progress }" />
            </div>

            <div class="step-indicators">
              <div
                v-for="number in 3"
                :key="number"
                class="step-indicator"
                :class="{
                  active: step === number,
                  completed: step > number,
                }"
              >
                <span>
                  <Check v-if="step > number" :size="14" />

                  <template v-else>
                    {{ number }}
                  </template>
                </span>

                <small>
                  {{ stepTitles[number as Step] }}
                </small>
              </div>
            </div>
          </section>

          <!-- FORM CARD -->

          <section class="form-card">
            <!-- FORM HEADER -->

            <div class="form-heading">
              <div class="form-heading-icon">
                <UserRound v-if="step === 1" :size="21" />

                <Building2 v-else-if="step === 2" :size="21" />

                <WalletCards v-else :size="21" />
              </div>

              <div>
                <span class="form-step-label"> STEP {{ step }} </span>

                <h2>
                  {{ stepTitles[step] }}
                </h2>

                <p>
                  {{ stepDescriptions[step] }}
                </p>
              </div>
            </div>

            <!-- ERROR -->

            <div v-if="errorMessage" class="message error-message">
              <AlertCircle :size="18" />

              <span>
                {{ errorMessage }}
              </span>
            </div>

            <!-- SUCCESS -->

            <div v-if="successMessage" class="message success-message">
              <Check :size="18" />

              <span>
                {{ successMessage }}
              </span>
            </div>

            <!-- =================================================
                 STEP 1
            ================================================== -->

            <div v-if="step === 1" class="form-content">
              <div class="form-grid">
                <label class="field">
                  <span> First name </span>

                  <input
                    v-model="form.owner.firstName"
                    type="text"
                    autocomplete="given-name"
                    placeholder="First name"
                  />
                </label>

                <label class="field">
                  <span> Last name </span>

                  <input
                    v-model="form.owner.lastName"
                    type="text"
                    autocomplete="family-name"
                    placeholder="Last name"
                  />
                </label>

                <label class="field full">
                  <span> Email address </span>

                  <input
                    v-model="form.owner.email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                  />
                </label>

                <label class="field">
                  <span> Password </span>

                  <input
                    v-model="form.owner.password"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Minimum 8 characters"
                  />
                </label>

                <label class="field">
                  <span> Confirm password </span>

                  <input
                    v-model="form.owner.confirmPassword"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Repeat password"
                  />
                </label>
              </div>
            </div>

            <!-- =================================================
                 STEP 2
            ================================================== -->

            <div v-else-if="step === 2" class="form-content">
              <div class="form-grid">
                <label class="field full">
                  <span> Legal business name </span>

                  <input v-model="form.business.legalName" type="text" placeholder="Example GmbH" />
                </label>

                <label class="field full">
                  <span>
                    Trading name
                    <small>(optional)</small>
                  </span>

                  <input
                    v-model="form.business.tradingName"
                    type="text"
                    placeholder="Your public business name"
                  />
                </label>

                <label class="field full">
                  <span> Registration number </span>

                  <input
                    v-model="form.business.registrationNumber"
                    type="text"
                    placeholder="Company registration number"
                  />
                </label>

                <label class="field">
                  <span> Business email </span>

                  <input
                    v-model="form.business.email"
                    type="email"
                    placeholder="business@example.com"
                  />
                </label>

                <label class="field">
                  <span> Business phone </span>

                  <input v-model="form.business.phone" type="tel" placeholder="+49 ..." />
                </label>

                <label class="field full">
                  <span> Business address </span>

                  <input
                    v-model="form.business.address"
                    type="text"
                    placeholder="Street and house number"
                  />
                </label>

                <label class="field">
                  <span> City </span>

                  <input v-model="form.business.city" type="text" placeholder="Frankfurt" />
                </label>

                <label class="field">
                  <span> Country </span>

                  <input v-model="form.business.country" type="text" placeholder="Germany" />
                </label>
              </div>
            </div>

            <!-- =================================================
                 STEP 3
            ================================================== -->

            <div v-else class="form-content">
              <div class="account-options">
                <!-- ACCOUNT TYPE -->

                <div>
                  <span class="section-label"> Account type </span>

                  <div class="option-grid">
                    <button
                      type="button"
                      class="option-card"
                      :class="{
                        selected: form.account.accountType === 'CURRENT',
                      }"
                      @click="form.account.accountType = 'CURRENT'"
                    >
                      <div class="option-icon">
                        <WalletCards :size="19" />
                      </div>

                      <strong> Current account </strong>

                      <span> For everyday business banking, payments and operating expenses. </span>
                    </button>

                    <button
                      type="button"
                      class="option-card"
                      :class="{
                        selected: form.account.accountType === 'CHECKING',
                      }"
                      @click="form.account.accountType = 'CHECKING'"
                    >
                      <div class="option-icon">
                        <WalletCards :size="19" />
                      </div>

                      <strong> Checking account </strong>

                      <span> A flexible account for regular business transactions. </span>
                    </button>

                    <button
                      type="button"
                      class="option-card"
                      :class="{
                        selected: form.account.accountType === 'SAVINGS',
                      }"
                      @click="form.account.accountType = 'SAVINGS'"
                    >
                      <div class="option-icon">
                        <WalletCards :size="19" />
                      </div>

                      <strong> Savings account </strong>

                      <span> Keep business reserves separate from everyday spending. </span>
                    </button>
                  </div>
                </div>

                <!-- CURRENCY -->

                <div>
                  <span class="section-label"> Currency </span>

                  <div class="currency-options">
                    <button
                      type="button"
                      class="currency-card"
                      :class="{
                        selected: form.account.currency === 'EUR',
                      }"
                      @click="form.account.currency = 'EUR'"
                    >
                      <strong> € EUR </strong>

                      <span> Euro </span>
                    </button>

                    <button
                      type="button"
                      class="currency-card"
                      :class="{
                        selected: form.account.currency === 'USD',
                      }"
                      @click="form.account.currency = 'USD'"
                    >
                      <strong> $ USD </strong>

                      <span> US Dollar </span>
                    </button>
                  </div>
                </div>

                <!-- REVIEW -->

                <div class="review-box">
                  <div>
                    <span> Business </span>

                    <strong>
                      {{ form.business.legalName || '—' }}
                    </strong>
                  </div>

                  <div>
                    <span> Account </span>

                    <strong>
                      {{ form.account.accountType }}
                      ·
                      {{ form.account.currency }}
                    </strong>
                  </div>

                  <div>
                    <span> Owner </span>

                    <strong>
                      {{ form.owner.firstName }}
                      {{ form.owner.lastName }}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTIONS -->

            <div class="form-actions">
              <button
                v-if="step > 1"
                type="button"
                class="secondary-button"
                :disabled="loading"
                @click="previousStep"
              >
                <ArrowLeft :size="17" />
                Back
              </button>

              <div v-else />

              <button v-if="step < 3" type="button" class="primary-button" @click="nextStep">
                Continue
                <ArrowRight :size="17" />
              </button>

              <button
                v-else
                type="button"
                class="primary-button"
                :disabled="loading"
                @click="submitOnboarding"
              >
                <Loader2 v-if="loading" :size="18" class="spin" />

                <span>
                  {{ loading ? 'Creating account...' : 'Create business account' }}
                </span>

                <Check v-if="!loading" :size="17" />
              </button>
            </div>
          </section>

          <p class="security-note">
            Your information is transmitted securely. Business account creation is protected by
            Buuchezo Bank's authentication infrastructure.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ============================================================
   BUUCHEZO BANK — SHARED APPLICATION VISUAL SYSTEM

   Matches BankingShell.vue:
   navy       #0b1f38
   navy light #132d4d
   blue       #1597ff
   blue dark  #0d6fbd
   text       #132945
   muted      #718096
   border     #e1e8f0
   background #f5f8fc
   white      #ffffff
============================================================ */

* {
  box-sizing: border-box;
}

.onboarding-page {
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
  color: #ffffff;

  font-size: 15px;
  font-weight: 750;

  letter-spacing: -0.2px;
  white-space: nowrap;
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

  text-decoration: none;

  font-size: 12px;
  font-weight: 600;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.banking-navigation-item svg {
  flex-shrink: 0;
}

.banking-navigation-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.banking-navigation-item.active {
  background: rgba(21, 151, 255, 0.14);
  color: #1597ff;
}

/* ============================================================
   SIDEBAR BOTTOM
============================================================ */

.banking-sidebar-bottom {
  padding-top: 16px;
}

.banking-support-box {
  padding: 12px;

  display: flex;
  align-items: center;

  gap: 10px;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.055);

  margin-bottom: 10px;
}

.banking-support-icon {
  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 8px;

  background: rgba(21, 151, 255, 0.13);

  color: #1597ff;
}

.banking-support-box strong,
.banking-support-box span {
  display: block;
}

.banking-support-box strong {
  margin-bottom: 3px;

  color: rgba(255, 255, 255, 0.86);

  font-size: 10px;
}

.banking-support-box span {
  color: rgba(255, 255, 255, 0.43);

  font-size: 9px;
}

.banking-back-button {
  min-height: 42px;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 0 12px;

  border-radius: 9px;

  color: rgba(255, 255, 255, 0.58);

  text-decoration: none;

  font-size: 12px;
  font-weight: 600;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.banking-back-button:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

/* ============================================================
   MAIN
============================================================ */

.banking-main {
  flex: 1;
  min-width: 0;

  margin-left: 258px;
}

/* ============================================================
   HEADER
============================================================ */

.banking-header {
  height: 88px;

  padding: 0 39px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #ffffff;

  border-bottom: 1px solid #e1e8f0;
}

.banking-page-heading {
  display: flex;
  flex-direction: column;
}

.banking-page-section {
  margin-bottom: 5px;

  color: #718096;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 1.35px;
}

.banking-page-heading h1 {
  margin: 0;

  color: #132945;

  font-size: 21px;
  font-weight: 700;

  letter-spacing: -0.45px;
}

.header-back-link {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  color: #718096;

  text-decoration: none;

  font-size: 11px;
  font-weight: 650;
}

.header-back-link:hover {
  color: #1597ff;
}

/* ============================================================
   CONTENT
============================================================ */

.banking-content {
  min-height: calc(100vh - 88px);

  padding: 34px 39px 60px;
}

.onboarding-container {
  width: 100%;
  max-width: 1180px;

  margin: 0 auto;
}

/* ============================================================
   INTRO
============================================================ */

.page-intro {
  margin-bottom: 25px;
}

.intro-eyebrow {
  display: block;

  margin-bottom: 7px;

  color: #1597ff;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 1.45px;
}

.page-intro h2 {
  margin: 0;

  color: #132945;

  font-size: 25px;
  font-weight: 700;

  letter-spacing: -0.65px;
}

.page-intro p {
  max-width: 650px;

  margin: 8px 0 0;

  color: #718096;

  font-size: 12px;
  line-height: 1.65;
}

/* ============================================================
   PROGRESS
============================================================ */

.progress-card {
  margin-bottom: 18px;

  padding: 18px 20px 17px;

  background: #ffffff;

  border: 1px solid #e1e8f0;
  border-radius: 12px;

  box-shadow: 0 5px 18px rgba(9, 27, 49, 0.035);
}

.progress-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 11px;
}

.progress-header > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-header span {
  color: #718096;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.55px;
}

.progress-header > div strong {
  color: #132945;

  font-size: 12px;
}

.progress-value {
  color: #1597ff !important;

  font-size: 10px !important;
  font-weight: 800;
}

.progress-track {
  width: 100%;
  height: 5px;

  overflow: hidden;

  border-radius: 999px;

  background: #e1e8f0;
}

.progress-bar {
  height: 100%;

  border-radius: inherit;

  background: linear-gradient(90deg, #1597ff, #0d6fbd);

  transition: width 0.3s ease;
}

.step-indicators {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  margin-top: 15px;
}

.step-indicator {
  display: flex;
  align-items: center;

  gap: 8px;

  color: #718096;
}

.step-indicator:nth-child(2) {
  justify-content: center;
}

.step-indicator:last-child {
  justify-content: flex-end;
}

.step-indicator span {
  width: 26px;
  height: 26px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border: 1px solid #e1e8f0;
  border-radius: 50%;

  background: #ffffff;

  color: #718096;

  font-size: 10px;
  font-weight: 800;
}

.step-indicator small {
  color: #718096;

  font-size: 10px;
  font-weight: 600;
}

.step-indicator.active span {
  border-color: #1597ff;

  background: #1597ff;

  color: #ffffff;

  box-shadow: 0 4px 10px rgba(21, 151, 255, 0.18);
}

.step-indicator.active small {
  color: #1597ff;
}

.step-indicator.completed span {
  border-color: #0d6fbd;

  background: #0d6fbd;

  color: #ffffff;
}

.step-indicator.completed small {
  color: #0d6fbd;
}

/* ============================================================
   FORM CARD
============================================================ */

.form-card {
  overflow: hidden;

  background: #ffffff;

  border: 1px solid #e1e8f0;
  border-radius: 14px;

  box-shadow: 0 6px 20px rgba(9, 27, 49, 0.045);
}

.form-heading {
  padding: 22px 23px;

  display: flex;
  align-items: center;

  gap: 13px;

  border-bottom: 1px solid #e1e8f0;
}

.form-heading-icon {
  width: 42px;
  height: 42px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: rgba(21, 151, 255, 0.09);

  color: #1597ff;
}

.form-step-label {
  display: block;

  margin-bottom: 4px;

  color: #718096;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.1px;
}

.form-heading h2 {
  margin: 0;

  color: #132945;

  font-size: 17px;
  font-weight: 700;

  letter-spacing: -0.2px;
}

.form-heading p {
  margin: 4px 0 0;

  color: #718096;

  font-size: 10px;
}

/* ============================================================
   MESSAGES
============================================================ */

.message {
  margin: 17px 23px 0;

  padding: 12px 13px;

  display: flex;
  align-items: center;

  gap: 9px;

  border-radius: 8px;

  font-size: 11px;
}

.error-message {
  color: #a13b3b;

  background: #fff5f5;

  border: 1px solid #f0d4d4;
}

.success-message {
  color: #267e59;

  background: #effaf5;

  border: 1px solid #cce9da;
}

/* ============================================================
   FORM
============================================================ */

.form-content {
  padding: 23px;
}

.form-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 17px;
}

.field {
  display: flex;
  flex-direction: column;

  gap: 7px;
}

.field.full {
  grid-column: 1 / -1;
}

.field > span,
.section-label {
  color: #132945;

  font-size: 11px;
  font-weight: 700;
}

.field > span small {
  color: #718096;

  font-size: 9px;
  font-weight: 500;
}

.field input {
  width: 100%;
  height: 43px;

  padding: 0 12px;

  border: 1px solid #e1e8f0;
  border-radius: 8px;

  outline: none;

  background: #ffffff;

  color: #132945;

  font-family: inherit;
  font-size: 12px;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.field input::placeholder {
  color: #a1adba;
}

.field input:hover {
  border-color: #c9d5e0;
}

.field input:focus {
  border-color: #1597ff;

  box-shadow: 0 0 0 3px rgba(21, 151, 255, 0.08);
}

/* ============================================================
   ACCOUNT OPTIONS
============================================================ */

.account-options {
  display: flex;
  flex-direction: column;

  gap: 25px;
}

.option-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 12px;

  margin-top: 10px;
}

.option-card {
  min-height: 145px;

  padding: 15px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 9px;

  border: 1px solid #e1e8f0;
  border-radius: 10px;

  background: #ffffff;

  color: #132945;

  text-align: left;

  cursor: pointer;

  font-family: inherit;

  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.option-card:hover {
  border-color: #a9cce7;

  background: #fbfdff;
}

.option-card.selected {
  border-color: #1597ff;

  background: rgba(21, 151, 255, 0.045);

  box-shadow: inset 0 0 0 1px #1597ff;
}

.option-icon {
  width: 33px;
  height: 33px;

  display: grid;
  place-items: center;

  border-radius: 8px;

  background: rgba(21, 151, 255, 0.09);

  color: #1597ff;
}

.option-card strong {
  color: #132945;

  font-size: 11px;
  font-weight: 700;
}

.option-card span {
  color: #718096;

  font-size: 9px;
  line-height: 1.55;
}

/* ============================================================
   CURRENCY
============================================================ */

.currency-options {
  display: flex;

  gap: 12px;

  margin-top: 10px;
}

.currency-card {
  min-width: 150px;

  padding: 13px 15px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 3px;

  border: 1px solid #e1e8f0;
  border-radius: 9px;

  background: #ffffff;

  color: #132945;

  text-align: left;

  cursor: pointer;

  font-family: inherit;

  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.currency-card:hover {
  border-color: #a9cce7;
}

.currency-card.selected {
  border-color: #1597ff;

  background: rgba(21, 151, 255, 0.045);

  box-shadow: inset 0 0 0 1px #1597ff;
}

.currency-card strong {
  color: #132945;

  font-size: 12px;
}

.currency-card span {
  color: #718096;

  font-size: 9px;
}

/* ============================================================
   REVIEW
============================================================ */

.review-box {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 14px;

  padding: 16px;

  border: 1px solid #e1e8f0;
  border-radius: 10px;

  background: #f5f8fc;
}

.review-box div {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.review-box span {
  color: #718096;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.9px;
}

.review-box strong {
  color: #132945;

  font-size: 11px;

  word-break: break-word;
}

/* ============================================================
   ACTIONS
============================================================ */

.form-actions {
  min-height: 73px;

  padding: 15px 23px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 12px;

  border-top: 1px solid #e1e8f0;

  background: #fbfcfe;
}

.primary-button,
.secondary-button {
  min-height: 41px;

  padding: 0 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  border-radius: 8px;

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.primary-button {
  border: 1px solid #1597ff;

  background: #1597ff;

  color: #ffffff;

  box-shadow: 0 6px 15px rgba(21, 151, 255, 0.16);
}

.primary-button:hover:not(:disabled) {
  border-color: #0d6fbd;

  background: #0d6fbd;
}

.primary-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

.secondary-button {
  border: 1px solid #e1e8f0;

  background: #ffffff;

  color: #718096;
}

.secondary-button:hover:not(:disabled) {
  border-color: #c8d6e3;

  background: #f8fbfe;

  color: #1597ff;
}

.secondary-button:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* ============================================================
   SECURITY
============================================================ */

.security-note {
  margin: 15px 0 0;

  color: #718096;

  text-align: center;

  font-size: 9px;
  line-height: 1.5;
}

/* ============================================================
   LOADING
============================================================ */

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================
   RESPONSIVE
============================================================ */

@media (max-width: 900px) {
  .banking-sidebar {
    width: 220px;
  }

  .banking-main {
    margin-left: 220px;
  }

  .banking-header {
    padding: 0 25px;
  }

  .banking-content {
    padding: 28px 25px 50px;
  }

  .option-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .banking-sidebar {
    display: none;
  }

  .banking-main {
    margin-left: 0;
  }

  .banking-header {
    height: 78px;

    padding: 0 18px;
  }

  .banking-page-heading h1 {
    font-size: 18px;
  }

  .header-back-link {
    font-size: 0;
  }

  .header-back-link svg {
    width: 19px;
    height: 19px;
  }

  .banking-content {
    padding: 25px 16px 45px;
  }

  .page-intro h2 {
    font-size: 22px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .field.full {
    grid-column: auto;
  }

  .form-heading {
    padding: 19px;
  }

  .form-content {
    padding: 19px;
  }

  .message {
    margin-left: 19px;
    margin-right: 19px;
  }

  .form-actions {
    padding: 14px 19px;
  }

  .step-indicator small {
    display: none;
  }

  .step-indicator {
    justify-content: flex-start !important;
  }

  .step-indicator:nth-child(2) {
    justify-content: center !important;
  }

  .step-indicator:last-child {
    justify-content: flex-end !important;
  }

  .review-box {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .banking-header {
    padding: 0 14px;
  }

  .banking-content {
    padding-left: 13px;
    padding-right: 13px;
  }

  .progress-card {
    padding: 15px;
  }

  .form-heading {
    align-items: flex-start;
  }

  .form-heading-icon {
    width: 38px;
    height: 38px;
  }

  .form-heading h2 {
    font-size: 15px;
  }

  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .currency-options {
    flex-direction: column;
  }

  .currency-card {
    width: 100%;
  }
}
</style>
