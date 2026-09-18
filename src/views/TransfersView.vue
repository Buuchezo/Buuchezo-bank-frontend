<template>
  <main class="transfers-page">
    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <aside
      class="transfers-sidebar"
      :class="{ open: mobileMenuOpen }"
    >
      <RouterLink to="/" class="dashboard-logo">
        <span>B</span>
        <strong>Buuchezo Bank</strong>
      </RouterLink>

      <nav class="dashboard-nav">
        <span class="nav-section-title">
          MAIN
        </span>

        <RouterLink
          to="/dashboard"
          class="dashboard-nav-link"
        >
          <LayoutDashboard :size="18" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink
          to="/accounts"
          class="dashboard-nav-link"
        >
          <WalletCards :size="18" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink
          to="/transactions"
          class="dashboard-nav-link"
        >
          <ArrowLeftRight :size="18" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink
          to="/cards"
          class="dashboard-nav-link"
        >
          <CreditCard :size="18" />
          <span>Cards</span>
        </RouterLink>

        <span
          class="nav-section-title second-nav-title"
        >
          SERVICES
        </span>

        <RouterLink
          to="/transfers"
          class="dashboard-nav-link active"
        >
          <Send :size="18" />
          <span>Transfers</span>
        </RouterLink>

        <RouterLink
          to="/settings"
          class="dashboard-nav-link"
        >
          <Settings :size="18" />
          <span>Settings</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="support-box">
          <div class="support-icon">
            <HelpCircle :size="16" />
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
          <LogOut :size="17" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <!-- =====================================================
         MAIN
    ====================================================== -->

    <div class="transfers-main">
      <header class="transfers-header">
        <button
          type="button"
          class="mobile-menu-button"
          @click="
            mobileMenuOpen =
              !mobileMenuOpen
          "
        >
          <Menu :size="21" />
        </button>

        <div class="header-title">
          <span>TRANSFERS</span>

          <h1>Send money</h1>
        </div>

        <div class="header-actions">
          <button
            type="button"
            class="header-icon"
            aria-label="Notifications"
          >
            <Bell :size="19" />

            <span class="notification-dot"></span>
          </button>

          <div class="header-profile">
            <div class="profile-avatar">
              {{ userInitials }}
            </div>

            <div class="profile-info">
              <strong>
                {{ fullName }}
              </strong>

              <span>
                Personal
              </span>
            </div>

            <ChevronDown :size="15" />
          </div>
        </div>
      </header>

      <!-- =====================================================
           CONTENT
      ====================================================== -->

      <div class="transfers-content">

        <!-- =================================================
             LOADING ACCOUNT
        ================================================== -->

        <div
          v-if="loadingAccount"
          class="page-state"
        >
          <strong>
            Loading your account...
          </strong>

          <span>
            Preparing your transfer securely.
          </span>
        </div>

        <!-- =================================================
             ACCOUNT ERROR
        ================================================== -->

        <div
          v-else-if="accountError"
          class="page-state page-state-error"
        >
          <strong>
            Unable to load your account
          </strong>

          <span>
            {{ accountError }}
          </span>

          <button
            type="button"
            @click="loadAccount"
          >
            Try again
          </button>
        </div>

        <template v-else>

          <!-- =================================================
               SUCCESS
          ================================================== -->

          <section
            v-if="transferSuccessful"
            class="success-section"
          >
            <div class="success-icon">
              <Check :size="30" />
            </div>

            <span class="success-label">
              TRANSFER COMPLETE
            </span>

            <h2>
              Money sent successfully.
            </h2>

            <p>
              Your transfer has been submitted
              successfully.
            </p>

            <div class="success-amount">
              {{ formatMoney(form.amount) }}
            </div>

            <div class="success-recipient">
              <span>
                Sent to
              </span>

              <strong>
                {{ form.toAccountNumber }}
              </strong>
            </div>

            <div class="success-reference">
              <span>
                Reference
              </span>

              <strong>
                {{ transferReference || 'N/A' }}
              </strong>
            </div>

            <div class="success-actions">
              <button
                type="button"
                class="primary-button"
                @click="goToTransactions"
              >
                View transactions
                <ArrowRight :size="16" />
              </button>

              <button
                type="button"
                class="secondary-button"
                @click="startAnotherTransfer"
              >
                Send another payment
              </button>
            </div>
          </section>

          <!-- =================================================
               TRANSFER FORM
          ================================================== -->

          <template v-else>

            <!-- PAGE INTRO -->

            <section class="page-intro">
              <div>
                <span>
                  MOVE MONEY
                </span>

                <h2>
                  Send money securely.
                </h2>

                <p>
                  Transfer money from your Buuchezo
                  Bank account to another account.
                </p>
              </div>

              <div class="available-balance">
                <span>
                  AVAILABLE BALANCE
                </span>

                <strong>
                  {{ formatMoney(account.balance) }}
                </strong>

                <small>
                  •••• {{ maskedAccountNumber }}
                </small>
              </div>
            </section>

            <!-- =================================================
                 FORM LAYOUT
            ================================================== -->

            <div class="transfer-layout">

              <!-- =================================================
                   FORM CARD
              ================================================== -->

              <section class="transfer-form-card">

                <div class="form-heading">
                  <div class="form-heading-icon">
                    <Send :size="19" />
                  </div>

                  <div>
                    <span>
                      NEW TRANSFER
                    </span>

                    <h2>
                      Transfer details
                    </h2>
                  </div>
                </div>

                <!-- SERVER ERROR -->

                <div
                  v-if="transferError"
                  class="form-error"
                >
                  <AlertCircle :size="16" />

                  <span>
                    {{ transferError }}
                  </span>
                </div>

                <form
                  @submit.prevent="
                    submitTransfer
                  "
                >

                  <!-- FROM ACCOUNT -->

                  <div class="form-group">
                    <label>
                      From account
                    </label>

                    <div class="account-field">
                      <div class="field-icon">
                        <WalletCards
                          :size="17"
                        />
                      </div>

                      <div>
                        <strong>
                          {{ account.accountType || 'Account' }}
                        </strong>

                        <span>
                          •••• {{ maskedAccountNumber }}
                        </span>
                      </div>

                      <div class="account-balance">
                        <span>
                          Available
                        </span>

                        <strong>
                          {{
                            formatMoney(
                              account.balance
                            )
                          }}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <!-- TO ACCOUNT -->

                  <div class="form-group">
                    <label
                      for="toAccountNumber"
                    >
                      Recipient account number
                    </label>

                    <div
                      class="input-wrapper"
                      :class="{
                        invalid:
                          validationErrors
                            .toAccountNumber
                      }"
                    >
                      <Landmark :size="16" />

                      <input
                        id="toAccountNumber"
                        v-model="
                          form.toAccountNumber
                        "
                        type="text"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="Enter account number"
                        :disabled="
                          submitting
                        "
                        @input="
                          clearFieldError(
                            'toAccountNumber'
                          )
                        "
                      />
                    </div>

                    <small
                      v-if="
                        validationErrors
                          .toAccountNumber
                      "
                      class="field-error"
                    >
                      {{
                        validationErrors
                          .toAccountNumber
                      }}
                    </small>

                    <small
                      v-else
                      class="field-help"
                    >
                      Enter the recipient's
                      bank account number.
                    </small>
                  </div>

                  <!-- AMOUNT -->

                  <div class="form-group">
                    <label for="amount">
                      Amount
                    </label>

                    <div
                      class="amount-input-wrapper"
                      :class="{
                        invalid:
                          validationErrors.amount
                      }"
                    >
                      <span>
                        {{ currencySymbol }}
                      </span>

                      <input
                        id="amount"
                        v-model="form.amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        inputmode="decimal"
                        placeholder="0.00"
                        :disabled="
                          submitting
                        "
                        @input="
                          clearFieldError(
                            'amount'
                          )
                        "
                      />

                      <small>
                        {{ account.currency }}
                      </small>
                    </div>

                    <small
                      v-if="
                        validationErrors.amount
                      "
                      class="field-error"
                    >
                      {{
                        validationErrors.amount
                      }}
                    </small>

                    <small
                      v-else
                      class="field-help"
                    >
                      You can send up to your
                      available balance.
                    </small>
                  </div>

                  <!-- DESCRIPTION -->

                  <div class="form-group">
                    <label
                      for="description"
                    >
                      Description
                      <span>
                        Optional
                      </span>
                    </label>

                    <div
                      class="input-wrapper textarea-wrapper"
                    >
                      <FileText
                        :size="16"
                      />

                      <textarea
                        id="description"
                        v-model="
                          form.description
                        "
                        rows="3"
                        maxlength="150"
                        placeholder="What is this transfer for?"
                        :disabled="
                          submitting
                        "
                      ></textarea>
                    </div>

                    <small class="field-help">
                      Add a note to help you
                      identify the transaction later.
                    </small>
                  </div>

                  <!-- SUBMIT -->

                  <button
                    type="submit"
                    class="primary-button submit-button"
                    :disabled="submitting"
                  >
                    <span
                      v-if="submitting"
                      class="spinner"
                    ></span>

                    <span>
                      {{
                        submitting
                          ? 'Sending...'
                          : 'Continue'
                      }}
                    </span>

                    <ArrowRight
                      v-if="!submitting"
                      :size="16"
                    />
                  </button>

                </form>
              </section>

              <!-- =================================================
                   INFORMATION PANEL
              ================================================== -->

              <aside class="transfer-info">

                <div class="info-card security-card">
                  <div class="info-icon">
                    <ShieldCheck
                      :size="20"
                    />
                  </div>

                  <span>
                    SECURE TRANSFER
                  </span>

                  <h3>
                    Your transfer is protected.
                  </h3>

                  <p>
                    Every transfer is authenticated
                    using your secure account session.
                  </p>
                </div>

                <div class="info-card">

                  <div class="info-card-header">
                    <Info :size="16" />

                    <strong>
                      Before you send
                    </strong>
                  </div>

                  <ul>
                    <li>
                      Check the recipient account
                      number carefully.
                    </li>

                    <li>
                      Make sure you have enough
                      available balance.
                    </li>

                    <li>
                      Transfers may be processed
                      according to your bank's
                      transaction rules.
                    </li>
                  </ul>

                </div>

                <div class="info-card support-info">
                  <HelpCircle :size="18" />

                  <div>
                    <strong>
                      Need help?
                    </strong>

                    <span>
                      Contact Buuchezo Bank support
                      if you have questions about a
                      transfer.
                    </span>
                  </div>
                </div>

              </aside>

            </div>

          </template>

        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue'

import { useRouter } from 'vue-router'

import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  HelpCircle,
  Info,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Send,
  Settings,
  ShieldCheck,
  WalletCards,
} from 'lucide-vue-next'

/* =========================================================
   TYPES
========================================================= */

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

interface Transaction {
  id?: number
  reference?: string
  fromAccountNumber?: string
  fromBankCode?: string
  toAccountNumber?: string
  toBankCode?: string
  amount?: number
  description?: string
  currency?: string
  transactionType?: string
  transactionStatus?: string
  transactionDirection?: string
  channel?: string
  createdAt?: string
}

interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

interface TransferForm {
  toAccountNumber: string
  amount: number | null
  description: string
}

interface ValidationErrors {
  toAccountNumber: string
  amount: string
}

/* =========================================================
   CONFIGURATION
========================================================= */

const API_BASE_URL =
  'http://13.48.104.209:8084'

const router = useRouter()

/* =========================================================
   STATE
========================================================= */

const mobileMenuOpen =
  ref(false)

const loadingAccount =
  ref(true)

const accountError =
  ref('')

const submitting =
  ref(false)

const transferError =
  ref('')

const transferSuccessful =
  ref(false)

const transferReference =
  ref('')

const user =
  ref<User>({
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    enabled: false,
    roles: [],
    createdAt: '',
  })

const account =
  ref<Account>({
    id: 0,
    accountNumber: '',
    balance: 0,
    currency: 'EUR',
    accountType: '',
    accountStatus: '',
    createdAt: '',
  })

const form =
  reactive<TransferForm>({
    toAccountNumber: '',
    amount: null,
    description: '',
  })

const validationErrors =
  reactive<ValidationErrors>({
    toAccountNumber: '',
    amount: '',
  })

/* =========================================================
   USER INFORMATION
========================================================= */

const fullName =
  computed(() => {
    return (
      `${user.value.firstName} ${user.value.lastName}`
        .trim() || 'User'
    )
  })

const userInitials =
  computed(() => {
    const first =
      user.value.firstName?.charAt(0) ||
      ''

    const last =
      user.value.lastName?.charAt(0) ||
      ''

    return (
      `${first}${last}`.toUpperCase() ||
      'U'
    )
  })

/* =========================================================
   ACCOUNT INFORMATION
========================================================= */

const maskedAccountNumber =
  computed(() => {
    const number =
      account.value.accountNumber ||
      ''

    if (number.length <= 4) {
      return number
    }

    return number.slice(-4)
  })

const currencySymbol =
  computed(() => {
    try {
      return new Intl.NumberFormat(
        'en-DE',
        {
          style: 'currency',
          currency:
            account.value.currency ||
            'EUR',
        }
      )
        .formatToParts(0)
        .find(
          (part) =>
            part.type === 'currency'
        )?.value || '€'
    } catch {
      return '€'
    }
  })

/* =========================================================
   MONEY
========================================================= */

function formatMoney(
  amount: number | null
) {
  return new Intl.NumberFormat(
    'en-DE',
    {
      style: 'currency',

      currency:
        account.value.currency ||
        'EUR',

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    }
  ).format(
    Number(amount || 0)
  )
}

/* =========================================================
   VALIDATION
========================================================= */

function validateForm() {
  validationErrors.toAccountNumber =
    ''

  validationErrors.amount = ''

  transferError.value = ''

  let valid = true

  const recipient =
    form.toAccountNumber.trim()

  const amount =
    Number(form.amount)

  if (!recipient) {
    validationErrors.toAccountNumber =
      'Recipient account number is required.'

    valid = false
  }

  if (
    recipient &&
    recipient ===
    account.value.accountNumber
  ) {
    validationErrors.toAccountNumber =
      'You cannot transfer money to your own account.'

    valid = false
  }

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    validationErrors.amount =
      'Enter an amount greater than €0.00.'

    valid = false
  }

  if (
    Number.isFinite(amount) &&
    amount > account.value.balance
  ) {
    validationErrors.amount =
      'The transfer amount exceeds your available balance.'

    valid = false
  }

  return valid
}

/* =========================================================
   CLEAR FIELD ERROR
========================================================= */

function clearFieldError(
  field:
    | 'toAccountNumber'
    | 'amount'
) {
  validationErrors[field] = ''
}

/* =========================================================
   LOAD ACCOUNT
========================================================= */

async function loadAccount() {
  loadingAccount.value = true

  accountError.value = ''

  const token =
    localStorage.getItem(
      'accessToken'
    ) ||
    sessionStorage.getItem(
      'accessToken'
    )

  if (!token) {
    await router.push('/login')
    return
  }

  try {
    const response =
      await fetch(
        `${API_BASE_URL}/api/users/me`,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

    if (
      response.status ===
      401
    ) {
      logout()
      return
    }

    const result:
      ApiResponse<UserWithAccount> =
      await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Unable to load your account.'
      )
    }

    user.value =
      result.data.user

    account.value =
      result.data.account
  } catch (error) {
    console.error(
      'Account loading failed:',
      error
    )

    accountError.value =
      error instanceof Error
        ? error.message
        : 'Unable to load your account.'
  } finally {
    loadingAccount.value = false
  }
}

/* =========================================================
   SUBMIT TRANSFER
========================================================= */

async function submitTransfer() {
  if (submitting.value) {
    return
  }

  if (!validateForm()) {
    return
  }

  const token =
    localStorage.getItem(
      'accessToken'
    ) ||
    sessionStorage.getItem(
      'accessToken'
    )

  if (!token) {
    await router.push('/login')
    return
  }

  submitting.value = true

  transferError.value = ''

  try {
    const requestBody = {
      fromAccountNumber:
      account.value.accountNumber,

      toAccountNumber:
        form.toAccountNumber.trim(),

      amount:
        Number(form.amount),

      description:
        form.description.trim() ||
        undefined,
    }

    const response =
      await fetch(
        `${API_BASE_URL}/api/transactions/transfer`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            requestBody
          ),
        }
      )

    if (
      response.status ===
      401
    ) {
      logout()
      return
    }

    const result:
      ApiResponse<Transaction> =
      await response.json()

    if (!response.ok) {
      throw new Error(
        result.message ||
        'The transfer could not be completed.'
      )
    }

    transferReference.value =
      result.data?.reference ||
      ''

    transferSuccessful.value =
      true

  } catch (error) {
    console.error(
      'Transfer failed:',
      error
    )

    transferError.value =
      error instanceof Error
        ? error.message
        : 'The transfer could not be completed.'
  } finally {
    submitting.value = false
  }
}

/* =========================================================
   START ANOTHER TRANSFER
========================================================= */

function startAnotherTransfer() {
  form.toAccountNumber = ''

  form.amount = null

  form.description = ''

  validationErrors.toAccountNumber =
    ''

  validationErrors.amount = ''

  transferError.value = ''

  transferReference.value = ''

  transferSuccessful.value =
    false

  /*
   * Refresh account balance so the
   * available balance is current.
   */
  loadAccount()
}

/* =========================================================
   NAVIGATION
========================================================= */

function goToTransactions() {
  router.push(
    '/transactions'
  )
}

/* =========================================================
   LOGOUT
========================================================= */

function logout() {
  localStorage.removeItem(
    'accessToken'
  )

  localStorage.removeItem(
    'user'
  )

  sessionStorage.removeItem(
    'accessToken'
  )

  sessionStorage.removeItem(
    'user'
  )

  router.push('/login')
}

/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(
  loadAccount
)
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */

.transfers-page {
  min-height: 100vh;

  display: flex;

  color: #29465a;

  background: #f5f8fb;
}

/* =========================================================
   SIDEBAR
========================================================= */

.transfers-sidebar {
  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;

  width: 245px;

  padding: 28px 18px;

  display: flex;
  flex-direction: column;

  background: #ffffff;

  border-right: 1px solid #e3ebf0;

  z-index: 100;
}

.dashboard-logo {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 0 10px;

  color: #082f56;

  text-decoration: none;
}

.dashboard-logo span {
  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 8px;

  font-size: 16px;

  font-weight: 900;
}

.dashboard-logo strong {
  font-size: 15px;

  letter-spacing: -0.02em;
}

/* =========================================================
   NAVIGATION
========================================================= */

.dashboard-nav {
  display: flex;

  flex-direction: column;

  gap: 5px;

  margin-top: 50px;
}

.nav-section-title {
  padding: 0 13px;

  margin-bottom: 9px;

  color: #a0adb7;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.15em;
}

.second-nav-title {
  margin-top: 30px;
}

.dashboard-nav-link {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 13px;

  color: #7d8d99;

  border-radius: 7px;

  font-size: 11px;

  font-weight: 600;

  text-decoration: none;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.dashboard-nav-link:hover {
  color: #0b4878;

  background: #f1f7fa;
}

.dashboard-nav-link.active {
  color: #0b4878;

  background: #eaf4fa;

  font-weight: 800;
}

/* =========================================================
   SIDEBAR BOTTOM
========================================================= */

.sidebar-bottom {
  margin-top: auto;
}

.support-box {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 13px;

  margin-bottom: 18px;

  background: #f5f9fb;

  border-radius: 8px;
}

.support-icon {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: white;

  border-radius: 6px;
}

.support-box strong {
  display: block;

  color: #425c6e;

  font-size: 9px;
}

.support-box span {
  display: block;

  margin-top: 2px;

  color: #9aa8b2;

  font-size: 8px;
}

.logout-button {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 13px;

  color: #84929c;

  background: none;

  border: 0;

  border-radius: 7px;

  font-family: inherit;

  font-size: 11px;

  cursor: pointer;

  text-align: left;
}

.logout-button:hover {
  color: #0b4878;

  background: #f4f8fa;
}

/* =========================================================
   MAIN
========================================================= */

.transfers-main {
  width:
    calc(100% - 245px);

  margin-left: 245px;
}

/* =========================================================
   HEADER
========================================================= */

.transfers-header {
  height: 82px;

  padding: 0 45px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: white;

  border-bottom: 1px solid #e4ebf0;
}

.header-title span {
  display: block;

  margin-bottom: 5px;

  color: #a0adb6;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.header-title h1 {
  margin: 0;

  color: #082f56;

  font-size: 18px;

  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;

  align-items: center;

  gap: 25px;
}

.header-icon {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #627888;

  background: #f4f8fa;

  border: 0;

  border-radius: 50%;

  cursor: pointer;
}

.notification-dot {
  position: absolute;

  top: 7px;
  right: 8px;

  width: 6px;
  height: 6px;

  background: #0b5da7;

  border: 2px solid white;

  border-radius: 50%;
}

.header-profile {
  display: flex;

  align-items: center;

  gap: 9px;
}

.profile-avatar {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 50%;

  font-size: 9px;

  font-weight: 800;
}

.profile-info strong {
  display: block;

  color: #40586a;

  font-size: 10px;
}

.profile-info span {
  display: block;

  margin-top: 2px;

  color: #9ba8b2;

  font-size: 8px;
}

.mobile-menu-button {
  display: none;
}

/* =========================================================
   CONTENT
========================================================= */

.transfers-content {
  max-width: 1250px;

  padding: 40px 45px 70px;

  margin: 0 auto;
}

/* =========================================================
   PAGE STATE
========================================================= */

.page-state {
  padding: 30px;

  display: flex;

  flex-direction: column;

  gap: 6px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;

  color: #082f56;
}

.page-state span {
  color: #8998a3;

  font-size: 12px;
}

.page-state-error {
  color: #7b2d2d;
}

.page-state button {
  width: fit-content;

  padding: 9px 14px;

  margin-top: 10px;

  color: white;

  background: #0b4878;

  border: 0;

  border-radius: 6px;

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}

/* =========================================================
   INTRO
========================================================= */

.page-intro {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 30px;
}

.page-intro > div:first-child span {
  display: block;

  margin-bottom: 7px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.page-intro h2 {
  margin: 0;

  color: #082f56;

  font-size: 26px;

  letter-spacing: -0.035em;
}

.page-intro p {
  margin: 8px 0 0;

  color: #8c9ba5;

  font-size: 10px;
}

.available-balance {
  padding: 14px 18px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 9px;

  text-align: right;
}

.available-balance span {
  display: block;

  margin-bottom: 6px;

  color: #9aa7b1;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.1em;
}

.available-balance strong {
  display: block;

  color: #29465a;

  font-size: 17px;
}

.available-balance small {
  display: block;

  margin-top: 4px;

  color: #9ca9b2;

  font-size: 8px;
}

/* =========================================================
   TRANSFER LAYOUT
========================================================= */

.transfer-layout {
  display: grid;

  grid-template-columns:
    minmax(0, 1.2fr)
    minmax(260px, 0.8fr);

  gap: 18px;

  align-items: start;
}

/* =========================================================
   FORM CARD
========================================================= */

.transfer-form-card {
  padding: 28px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;
}

.form-heading {
  display: flex;

  align-items: center;

  gap: 12px;

  padding-bottom: 23px;

  margin-bottom: 23px;

  border-bottom:
    1px solid #edf1f4;
}

.form-heading-icon {
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 8px;
}

.form-heading span {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.form-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 17px;
}

/* =========================================================
   FORM ERROR
========================================================= */

.form-error {
  display: flex;

  align-items: flex-start;

  gap: 9px;

  padding: 11px 13px;

  margin-bottom: 20px;

  color: #8e4545;

  background: #fdf0f0;

  border: 1px solid #f2dada;

  border-radius: 7px;

  font-size: 9px;

  line-height: 1.5;
}

/* =========================================================
   FORM GROUP
========================================================= */

.form-group {
  margin-bottom: 21px;
}

.form-group > label {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-bottom: 7px;

  color: #526b7b;

  font-size: 8px;

  font-weight: 800;
}

.form-group > label span {
  color: #a1adb5;

  font-size: 7px;

  font-weight: 500;
}

/* =========================================================
   ACCOUNT FIELD
========================================================= */

.account-field {
  min-height: 58px;

  padding: 10px 12px;

  display: flex;

  align-items: center;

  gap: 10px;

  background: #f6f9fb;

  border: 1px solid #e5edf1;

  border-radius: 7px;
}

.field-icon {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: white;

  border-radius: 7px;
}

.account-field > div:nth-child(2) {
  min-width: 0;

  flex: 1;
}

.account-field strong {
  display: block;

  color: #4a6272;

  font-size: 9px;
}

.account-field span {
  display: block;

  margin-top: 3px;

  color: #99a7b1;

  font-size: 8px;
}

.account-balance {
  text-align: right;
}

.account-balance span {
  margin-top: 0;

  color: #a1adb5;

  font-size: 7px;
}

.account-balance strong {
  margin-top: 3px;

  color: #29465a;

  font-size: 9px;
}

/* =========================================================
   INPUTS
========================================================= */

.input-wrapper {
  min-height: 43px;

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    0 12px;

  color: #9aa8b2;

  background: white;

  border: 1px solid #dfe8ed;

  border-radius: 7px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #82abc6;

  box-shadow:
    0 0 0 3px
    rgba(11, 93, 167, 0.06);
}

.input-wrapper.invalid,
.amount-input-wrapper.invalid {
  border-color: #d87979;
}

.input-wrapper input {
  width: 100%;

  height: 41px;

  padding: 0;

  color: #405a6c;

  background: transparent;

  border: 0;

  outline: 0;

  font-family: inherit;

  font-size: 10px;
}

.input-wrapper input::placeholder,
.input-wrapper textarea::placeholder {
  color: #a8b2b9;
}

/* =========================================================
   TEXTAREA
========================================================= */

.textarea-wrapper {
  align-items: flex-start;

  padding-top: 11px;

  padding-bottom: 11px;
}

.textarea-wrapper textarea {
  width: 100%;

  padding: 0;

  color: #405a6c;

  background: transparent;

  border: 0;

  outline: 0;

  resize: vertical;

  font-family: inherit;

  font-size: 9px;

  line-height: 1.5;
}

/* =========================================================
   AMOUNT
========================================================= */

.amount-input-wrapper {
  min-height: 58px;

  display: flex;

  align-items: center;

  padding:
    0 15px;

  background: white;

  border: 1px solid #dfe8ed;

  border-radius: 7px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.amount-input-wrapper:focus-within {
  border-color: #82abc6;

  box-shadow:
    0 0 0 3px
    rgba(11, 93, 167, 0.06);
}

.amount-input-wrapper > span {
  margin-right: 7px;

  color: #8496a2;

  font-size: 15px;

  font-weight: 600;
}

.amount-input-wrapper input {
  min-width: 0;

  flex: 1;

  height: 50px;

  padding: 0;

  color: #082f56;

  background: transparent;

  border: 0;

  outline: 0;

  font-family: inherit;

  font-size: 22px;

  font-weight: 700;
}

.amount-input-wrapper input::placeholder {
  color: #b0bac1;
}

.amount-input-wrapper small {
  color: #9ca9b2;

  font-size: 7px;

  font-weight: 700;
}

/* =========================================================
   HELP / ERROR
========================================================= */

.field-help {
  display: block;

  margin-top: 5px;

  color: #a0adb5;

  font-size: 7px;

  line-height: 1.4;
}

.field-error {
  display: block;

  margin-top: 5px;

  color: #b25252;

  font-size: 7px;
}

/* =========================================================
   BUTTONS
========================================================= */

.primary-button {
  min-height: 43px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  padding:
    0 18px;

  color: white;

  background: #0b4878;

  border: 0;

  border-radius: 7px;

  font-family: inherit;

  font-size: 9px;

  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background: #083c67;

  transform:
    translateY(-1px);
}

.primary-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

.submit-button {
  width: 100%;

  margin-top: 4px;
}

.secondary-button {
  min-height: 43px;

  padding:
    0 18px;

  color: #0b4878;

  background: white;

  border: 1px solid #dce6ec;

  border-radius: 7px;

  font-family: inherit;

  font-size: 9px;

  font-weight: 800;

  cursor: pointer;
}

.secondary-button:hover {
  background: #f4f8fa;
}

.spinner {
  width: 13px;
  height: 13px;

  border:
    2px solid
    rgba(255, 255, 255, 0.35);

  border-top-color: white;

  border-radius: 50%;

  animation:
    spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   INFO
========================================================= */

.transfer-info {
  display: flex;

  flex-direction: column;

  gap: 13px;
}

.info-card {
  padding: 21px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 11px;
}

.security-card {
  color: white;

  background:
    linear-gradient(
      135deg,
      #063d74,
      #07559b
    );

  border: 0;

  box-shadow:
    0 15px 30px
    rgba(8, 47, 86, 0.12);
}

.info-icon {
  width: 37px;
  height: 37px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 19px;

  color: white;

  background:
    rgba(255, 255, 255, 0.13);

  border-radius: 8px;
}

.security-card > span {
  display: block;

  color:
    rgba(255, 255, 255, 0.55);

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.security-card h3 {
  margin: 7px 0 0;

  color: white;

  font-size: 16px;

  line-height: 1.25;
}

.security-card p {
  margin: 9px 0 0;

  color:
    rgba(255, 255, 255, 0.62);

  font-size: 8px;

  line-height: 1.6;
}

.info-card-header {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #0b4878;

  font-size: 9px;
}

.info-card ul {
  padding: 0;

  margin:
    16px 0 0;

  list-style: none;
}

.info-card li {
  position: relative;

  padding-left: 14px;

  margin-bottom: 11px;

  color: #7f909b;

  font-size: 8px;

  line-height: 1.5;
}

.info-card li:last-child {
  margin-bottom: 0;
}

.info-card li::before {
  content: '';

  position: absolute;

  top: 5px;
  left: 0;

  width: 5px;
  height: 5px;

  background: #0b5da7;

  border-radius: 50%;
}

.support-info {
  display: flex;

  align-items: flex-start;

  gap: 10px;

  color: #0b4878;
}

.support-info > div {
  display: flex;

  flex-direction: column;

  gap: 4px;
}

.support-info strong {
  color: #425b6c;

  font-size: 9px;
}

.support-info span {
  color: #99a7b1;

  font-size: 7px;

  line-height: 1.5;
}

/* =========================================================
   SUCCESS
========================================================= */

.success-section {
  max-width: 600px;

  padding: 55px 40px;

  margin:
    35px auto;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 14px;

  text-align: center;
}

.success-icon {
  width: 66px;
  height: 66px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  color: #27825f;

  background: #eaf7f1;

  border-radius: 50%;
}

.success-label {
  display: block;

  margin-bottom: 7px;

  color: #8fa0aa;

  font-size: 7px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.success-section h2 {
  margin: 0;

  color: #082f56;

  font-size: 24px;

  letter-spacing: -0.03em;
}

.success-section > p {
  margin: 8px 0 0;

  color: #8c9ba5;

  font-size: 9px;
}

.success-amount {
  margin-top: 25px;

  color: #27825f;

  font-size: 30px;

  font-weight: 700;

  letter-spacing: -0.04em;
}

.success-recipient,
.success-reference {
  padding:
    13px 0;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-top:
    1px solid #edf1f4;

  text-align: left;
}

.success-recipient {
  margin-top: 23px;
}

.success-recipient span,
.success-reference span {
  color: #98a6af;

  font-size: 8px;
}

.success-recipient strong,
.success-reference strong {
  color: #526b7b;

  font-size: 8px;

  font-family: monospace;
}

.success-actions {
  display: flex;

  justify-content: center;

  gap: 9px;

  margin-top: 25px;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {
  .transfers-sidebar {
    width: 215px;
  }

  .transfers-main {
    width:
      calc(100% - 215px);

    margin-left: 215px;
  }

  .transfers-content {
    padding-left: 30px;
    padding-right: 30px;
  }

  .transfers-header {
    padding-left: 30px;
    padding-right: 30px;
  }

  .transfer-layout {
    grid-template-columns:
      1fr;
  }

  .transfer-info {
    display: grid;

    grid-template-columns:
      repeat(3, 1fr);
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 850px) {
  .transfers-sidebar {
    transform:
      translateX(-100%);

    transition:
      transform 0.25s ease;

    box-shadow:
      10px 0 35px
      rgba(8, 47, 86, 0.1);
  }

  .transfers-sidebar.open {
    transform:
      translateX(0);
  }

  .transfers-main {
    width: 100%;

    margin-left: 0;
  }

  .mobile-menu-button {
    width: 38px;
    height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #526a7a;

    background: #f4f8fa;

    border: 0;

    border-radius: 7px;

    cursor: pointer;
  }

  .transfers-header {
    gap: 15px;
  }

  .header-title {
    flex: 1;
  }

  .profile-info {
    display: none;
  }

  .page-intro {
    align-items: flex-start;

    gap: 20px;
  }

  .transfer-info {
    grid-template-columns:
      1fr 1fr;
  }

  .security-card {
    grid-column: span 2;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .transfers-header {
    height: 72px;

    padding: 0 16px;
  }

  .header-title h1 {
    font-size: 15px;
  }

  .header-actions {
    gap: 9px;
  }

  .header-icon {
    width: 34px;
    height: 34px;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .transfers-content {
    padding:
      25px 16px 50px;
  }

  .page-intro {
    display: block;
  }

  .page-intro h2 {
    font-size: 22px;
  }

  .available-balance {
    width: fit-content;

    margin-top: 18px;

    text-align: left;
  }

  .transfer-form-card {
    padding: 20px;
  }

  .transfer-info {
    display: flex;
  }

  .security-card {
    grid-column: auto;
  }

  .account-field {
    flex-wrap: wrap;
  }

  .account-balance {
    width: 100%;

    padding-top: 9px;

    margin-top: 3px;

    border-top:
      1px solid #e5edf1;

    text-align: left;
  }

  .success-section {
    padding:
      40px 20px;
  }

  .success-actions {
    flex-direction: column;
  }

  .secondary-button,
  .success-actions .primary-button {
    width: 100%;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .transfers-content {
    padding-left: 12px;
    padding-right: 12px;
  }

  .transfer-form-card {
    padding: 17px;
  }

  .page-intro h2 {
    font-size: 20px;
  }
}
</style>
