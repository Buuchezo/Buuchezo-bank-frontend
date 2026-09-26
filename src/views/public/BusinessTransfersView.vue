<template>
  <BankingShell page-title="Business Transfers" page-section="BUSINESS BANKING" :user="shellUser">
    <div class="business-transfers-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <RouterLink to="/business/dashboard"> Business Dashboard </RouterLink>
            <span>/</span>
            <span>Transfers</span>
          </div>

          <h1>Business Transfers</h1>

          <p class="page-description">Send money from your business account securely.</p>
        </div>

        <div class="business-badge">
          <ShieldCheck :size="18" />
          <span>Business Account</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingAccount" class="state-card">
        <div class="spinner"></div>
        <p>Loading business account...</p>
      </div>

      <!-- Error -->
      <div v-else-if="accountError" class="state-card error-state">
        <AlertCircle :size="28" />
        <h3>Unable to load business account</h3>
        <p>{{ accountError }}</p>

        <button class="secondary-button" @click="loadBusinessAccount">Try again</button>
      </div>

      <!-- Success -->
      <div v-else-if="transferSuccessful" class="success-card">
        <div class="success-icon">
          <Check :size="32" />
        </div>

        <h2>Transfer completed</h2>

        <p class="success-message">Your business transfer has been successfully submitted.</p>

        <div class="success-details">
          <div class="detail-row">
            <span>Amount</span>
            <strong>
              {{ formatMoney(form.amount || 0) }}
            </strong>
          </div>

          <div class="detail-row">
            <span>Recipient</span>
            <strong>{{ form.toAccountNumber }}</strong>
          </div>

          <div class="detail-row">
            <span>Reference</span>
            <strong>{{ transferReference || 'N/A' }}</strong>
          </div>
        </div>

        <div class="success-actions">
          <button class="primary-button" @click="goToBusinessTransactions">
            <FileText :size="18" />
            View transactions
          </button>

          <button class="secondary-button" @click="startAnotherTransfer">
            <ArrowLeftRight :size="18" />
            Send another transfer
          </button>
        </div>
      </div>

      <!-- Transfer Form -->
      <div v-else class="content-grid">
        <!-- Main form -->
        <section class="form-card">
          <div class="card-header">
            <div>
              <h2>Make a transfer</h2>
              <p>Transfer funds securely from your business account.</p>
            </div>

            <div class="security-icon">
              <ShieldCheck :size="22" />
            </div>
          </div>

          <!-- Business -->
          <div class="business-info">
            <div class="info-icon">
              <Landmark :size="22" />
            </div>

            <div>
              <span class="info-label">Business</span>
              <strong>
                {{ businessName }}
              </strong>
            </div>
          </div>

          <!-- From account -->
          <div class="form-group">
            <label>From account</label>

            <div class="account-card">
              <div class="account-card-left">
                <div class="account-icon">
                  <WalletCards :size="21" />
                </div>

                <div>
                  <span class="account-type">
                    {{ account.accountType }}
                  </span>

                  <strong>
                    {{ maskAccountNumber(account.accountNumber) }}
                  </strong>
                </div>
              </div>

              <div class="account-balance">
                <span>Available balance</span>
                <strong>
                  {{ formatMoney(account.balance) }}
                </strong>
              </div>
            </div>
          </div>

          <!-- Recipient -->
          <div class="form-group">
            <label for="recipient"> Recipient account </label>

            <div class="input-wrapper" :class="{ invalid: validationErrors.toAccountNumber }">
              <Landmark :size="19" />

              <input
                id="recipient"
                v-model="form.toAccountNumber"
                type="text"
                placeholder="Enter recipient account number"
                autocomplete="off"
              />
            </div>

            <span v-if="validationErrors.toAccountNumber" class="field-error">
              {{ validationErrors.toAccountNumber }}
            </span>
          </div>

          <!-- Amount -->
          <div class="form-group">
            <label for="amount"> Amount </label>

            <div class="input-wrapper amount-input" :class="{ invalid: validationErrors.amount }">
              <span class="currency-prefix">
                {{ currencySymbol }}
              </span>

              <input
                id="amount"
                v-model.number="form.amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <span class="currency-code">
                {{ account.currency }}
              </span>
            </div>

            <span v-if="validationErrors.amount" class="field-error">
              {{ validationErrors.amount }}
            </span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">
              Description
              <span class="optional">(optional)</span>
            </label>

            <div class="input-wrapper">
              <FileText :size="19" />

              <input
                id="description"
                v-model="form.description"
                type="text"
                maxlength="140"
                placeholder="e.g. Invoice 2026-001"
              />
            </div>
          </div>

          <!-- Error -->
          <div v-if="transferError" class="transfer-error">
            <AlertCircle :size="20" />
            <span>{{ transferError }}</span>
          </div>

          <!-- Submit -->
          <button
            class="primary-button continue-button"
            :disabled="submitting || tanCreating || tanSubmitting || !account.accountNumber"
            @click="submitTransfer"
          >
            <span v-if="submitting || tanCreating" class="button-spinner"></span>

            <ArrowRight v-else :size="19" />

            {{ submitting || tanCreating ? 'Requesting TAN...' : 'Continue' }}
          </button>

          <div class="security-note">
            <ShieldCheck :size="17" />

            <span> This transfer requires TAN verification for your security. </span>
          </div>
        </section>

        <!-- Side information -->
        <aside class="info-card">
          <div class="info-card-header">
            <Info :size="21" />
            <h3>Transfer information</h3>
          </div>

          <div class="info-item">
            <div class="info-item-icon">
              <ShieldCheck :size="18" />
            </div>

            <div>
              <strong>Secure verification</strong>
              <p>Every transfer requires a valid TAN before it can be completed.</p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item-icon">
              <ArrowLeftRight :size="18" />
            </div>

            <div>
              <strong>Currency</strong>
              <p>
                Transfers currently require the source and destination accounts to use the same
                currency.
              </p>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item-icon">
              <WalletCards :size="18" />
            </div>

            <div>
              <strong>Available balance</strong>
              <p>Your transfer amount cannot exceed the available business account balance.</p>
            </div>
          </div>

          <div class="help-box">
            <HelpCircle :size="19" />

            <div>
              <strong>Need help?</strong>
              <p>
                Make sure the recipient account number and transfer amount are correct before
                confirming.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- TAN Modal -->
    <div v-if="tanModalOpen" class="modal-overlay" @click.self="closeTanModal">
      <div class="tan-modal">
        <button class="modal-close" type="button" @click="closeTanModal">×</button>

        <div class="tan-icon">
          <ShieldCheck :size="30" />
        </div>

        <h2>Enter TAN</h2>

        <p class="tan-description">
          Enter the 6-digit TAN sent to you to authorize this business transfer.
        </p>

        <div v-if="tanDeliveryMessage" class="delivery-message">
          <ShieldCheck :size="17" />
          <span>{{ tanDeliveryMessage }}</span>
        </div>

        <div class="tan-input-group">
          <label for="tan"> TAN code </label>

          <input
            id="tan"
            v-model="tanCode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            autocomplete="one-time-code"
            placeholder="000000"
            @keyup.enter="confirmTanTransfer"
          />
        </div>

        <div v-if="tanExpiresInSeconds > 0" class="tan-expiry">
          TAN expires in
          <strong> {{ tanExpiresInSeconds }} seconds </strong>
        </div>

        <div v-if="tanError" class="tan-error">
          <AlertCircle :size="18" />
          <span>{{ tanError }}</span>
        </div>

        <button
          class="primary-button tan-confirm-button"
          :disabled="tanSubmitting || tanCode.length !== 6"
          @click="confirmTanTransfer"
        >
          <span v-if="tanSubmitting" class="button-spinner"></span>

          <Check v-else :size="19" />

          {{ tanSubmitting ? 'Confirming...' : 'Confirm transfer' }}
        </button>

        <button class="resend-button" :disabled="tanCreating" @click="resetTanChallenge">
          {{ tanCreating ? 'Sending...' : 'Resend TAN' }}
        </button>

        <button class="cancel-button" @click="closeTanModal">Cancel</button>
      </div>
    </div>
  </BankingShell>
</template>

<script setup lang="ts">
import BankingShell from '@/components/BankingShell.vue'

import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Check,
  FileText,
  HelpCircle,
  Info,
  Landmark,
  ShieldCheck,
  WalletCards,
} from 'lucide-vue-next'

import { computed, onMounted, reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import {
  getMyBusinesses,
  getBusinessAccounts,
  type Business,
  type BusinessAccount,
} from '../../service/businessService.ts'

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ShellUser {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles: Array<{
    id: number
    name: string
  }>
  createdAt: string
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

interface TanChallengeResponse {
  challengeId: string
  operation: string
  expiresInSeconds: number
  deliveryMessage: string
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

/*
 * -------------------------------------------------------
 * State
 * -------------------------------------------------------
 */

const loadingAccount = ref(true)
const accountError = ref('')

const submitting = ref(false)
const transferError = ref('')
const transferSuccessful = ref(false)
const transferReference = ref('')

const business = ref<Business | null>(null)

const account = ref<BusinessAccount>({
  id: 0,
  accountNumber: '',
  balance: 0,
  currency: 'EUR',
  accountType: '',
  accountStatus: '',
  ownershipType: 'BUSINESS',
})

const tanModalOpen = ref(false)
const tanChallengeId = ref('')
const tanCode = ref('')
const tanExpiresInSeconds = ref(0)
const tanDeliveryMessage = ref('')

const tanError = ref('')
const tanCreating = ref(false)
const tanSubmitting = ref(false)

const form = reactive<TransferForm>({
  toAccountNumber: '',
  amount: null,
  description: '',
})

const validationErrors = reactive<ValidationErrors>({
  toAccountNumber: '',
  amount: '',
})

const shellUser = ref<ShellUser>({
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  enabled: true,
  roles: [],
  createdAt: '',
})

/*
 * -------------------------------------------------------
 * Computed
 * -------------------------------------------------------
 */

const businessName = computed(() => {
  if (!business.value) {
    return 'Business Account'
  }

  return business.value.tradingName || business.value.legalName || 'Business Account'
})

const currencySymbol = computed(() => {
  return account.value.currency === 'USD'
    ? '$'
    : account.value.currency === 'EUR'
      ? '€'
      : account.value.currency
})

/*
 * -------------------------------------------------------
 * Helpers
 * -------------------------------------------------------
 */

function formatMoney(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: account.value.currency || 'EUR',
  }).format(value)
}

function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) {
    return '••••••••••'
  }

  if (accountNumber.length <= 4) {
    return accountNumber
  }

  return `•••• •••• ${accountNumber.slice(-4)}`
}

function getStoredUser(): void {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

  if (!storedUser) {
    return
  }

  try {
    const parsed = JSON.parse(storedUser)

    shellUser.value = {
      id: parsed.id || 0,
      email: parsed.email || '',
      firstName: parsed.firstName || '',
      lastName: parsed.lastName || '',
      enabled: parsed.enabled ?? true,
      roles: parsed.roles || [],
      createdAt: parsed.createdAt || '',
    }
  } catch {
    // Ignore malformed local user data.
  }
}

/*
 * -------------------------------------------------------
 * Validation
 * -------------------------------------------------------
 */

function validateForm(): boolean {
  validationErrors.toAccountNumber = ''
  validationErrors.amount = ''
  transferError.value = ''

  const recipient = form.toAccountNumber.trim()

  if (!recipient) {
    validationErrors.toAccountNumber = 'Please enter the recipient account number.'

    return false
  }

  if (recipient === account.value.accountNumber) {
    validationErrors.toAccountNumber = 'You cannot transfer money to the same account.'

    return false
  }

  if (form.amount === null || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
    validationErrors.amount = 'Please enter a valid transfer amount.'

    return false
  }

  if (Number(form.amount) > Number(account.value.balance)) {
    validationErrors.amount = 'The transfer amount exceeds the available balance.'

    return false
  }

  return true
}

/*
 * -------------------------------------------------------
 * Load business account
 * -------------------------------------------------------
 */

async function loadBusinessAccount(): Promise<void> {
  loadingAccount.value = true
  accountError.value = ''

  try {
    getStoredUser()

    const businesses = await getMyBusinesses()

    if (businesses.length === 0) {
      throw new Error('No business is associated with your account.')
    }

    const currentBusiness = businesses[0]

    if (!currentBusiness) {
      throw new Error('Unable to determine the business account.')
    }

    business.value = currentBusiness

    const accounts = await getBusinessAccounts(currentBusiness.id)

    if (accounts.length === 0) {
      throw new Error('No business account was found.')
    }

    const activeAccount = accounts.find((item) => item.accountStatus === 'ACTIVE')

    const selectedAccount = activeAccount ?? accounts[0]

    if (!selectedAccount) {
      throw new Error('Unable to determine the business account.')
    }

    account.value = selectedAccount
  } catch (error) {
    console.error('Failed to load business account:', error)

    accountError.value = error instanceof Error ? error.message : 'Failed to load business account.'
  } finally {
    loadingAccount.value = false
  }
}

/*
 * -------------------------------------------------------
 * TAN challenge
 * -------------------------------------------------------
 */

async function submitTransfer(): Promise<void> {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  tanCreating.value = true
  transferError.value = ''
  tanError.value = ''

  try {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

    if (!token) {
      throw new Error('You are not authenticated.')
    }

    const requestBody = {
      operation: 'TRANSFER',
      fromAccountNumber: account.value.accountNumber,
      toAccountNumber: form.toAccountNumber.trim(),
      amount: Number(form.amount),
      description: form.description.trim() || undefined,
    }

    const response = await fetch(`${API_BASE_URL}/api/transactions/tan/challenge`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(result?.message || `Failed to request TAN. Status: ${response.status}`)
    }

    const data = result?.data || result

    const challenge = data as TanChallengeResponse

    tanChallengeId.value = challenge.challengeId

    tanExpiresInSeconds.value = challenge.expiresInSeconds || 0

    tanDeliveryMessage.value = challenge.deliveryMessage || ''

    tanCode.value = ''
    tanError.value = ''
    tanModalOpen.value = true
  } catch (error) {
    console.error('Failed to request TAN:', error)

    transferError.value = error instanceof Error ? error.message : 'Failed to request TAN.'
  } finally {
    submitting.value = false
    tanCreating.value = false
  }
}

/*
 * -------------------------------------------------------
 * Confirm TAN transfer
 * -------------------------------------------------------
 */

async function confirmTanTransfer(): Promise<void> {
  tanError.value = ''

  const tan = tanCode.value.trim()

  if (!/^\d{6}$/.test(tan)) {
    tanError.value = 'Please enter the 6-digit TAN.'

    return
  }

  tanSubmitting.value = true

  try {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

    if (!token) {
      throw new Error('You are not authenticated.')
    }

    const requestBody = {
      fromAccountNumber: account.value.accountNumber,

      toAccountNumber: form.toAccountNumber.trim(),

      amount: Number(form.amount),

      description: form.description.trim() || undefined,

      tanChallengeId: tanChallengeId.value,

      tan,
    }

    const response = await fetch(`${API_BASE_URL}/api/transactions/transfer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(result?.message || `Transfer failed. Status: ${response.status}`)
    }

    const apiResponse = result as ApiResponse<Transaction>

    transferReference.value = apiResponse?.data?.reference || result?.reference || ''

    tanModalOpen.value = false
    transferSuccessful.value = true
  } catch (error) {
    console.error('Business transfer failed:', error)

    tanError.value = error instanceof Error ? error.message : 'Transfer failed.'
  } finally {
    tanSubmitting.value = false
  }
}

/*
 * -------------------------------------------------------
 * TAN modal
 * -------------------------------------------------------
 */

function closeTanModal(): void {
  if (tanSubmitting.value) {
    return
  }

  tanModalOpen.value = false
  tanCode.value = ''
  tanError.value = ''
}

async function resetTanChallenge(): Promise<void> {
  tanCode.value = ''
  tanError.value = ''

  await submitTransfer()
}

/*
 * -------------------------------------------------------
 * Transfer reset/navigation
 * -------------------------------------------------------
 */

function startAnotherTransfer(): void {
  form.toAccountNumber = ''
  form.amount = null
  form.description = ''

  validationErrors.toAccountNumber = ''
  validationErrors.amount = ''

  transferError.value = ''
  transferReference.value = ''

  tanChallengeId.value = ''
  tanCode.value = ''
  tanDeliveryMessage.value = ''
  tanError.value = ''
  tanModalOpen.value = false

  transferSuccessful.value = false

  loadBusinessAccount()
}

function goToBusinessTransactions(): void {
  router.push('/business/transactions')
}

/*
 * -------------------------------------------------------
 * Lifecycle
 * -------------------------------------------------------
 */

onMounted(() => {
  loadBusinessAccount()
})
</script>

<style scoped>
.business-transfers-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #6b7280;
}

.breadcrumb a {
  color: #2563eb;
  text-decoration: none;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #111827;
}

.page-description {
  margin: 8px 0 0;
  color: #6b7280;
}

.business-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
  gap: 24px;
  align-items: start;
}

.form-card,
.info-card,
.state-card,
.success-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
}

.form-card {
  padding: 28px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.card-header h2 {
  margin: 0;
  font-size: 21px;
  color: #111827;
}

.card-header p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.security-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
}

.business-info {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #e0f2fe;
  color: #0369a1;
}

.info-label {
  display: block;
  margin-bottom: 3px;
  color: #6b7280;
  font-size: 12px;
}

.business-info strong {
  color: #111827;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.optional {
  color: #9ca3af;
  font-weight: 400;
}

.account-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.account-card-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
}

.account-type {
  display: block;
  margin-bottom: 3px;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
}

.account-card strong {
  display: block;
  color: #111827;
}

.account-balance {
  text-align: right;
}

.account-balance span {
  display: block;
  margin-bottom: 3px;
  color: #6b7280;
  font-size: 12px;
}

.account-balance strong {
  font-size: 17px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #6b7280;
  transition: border-color 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #2563eb;
}

.input-wrapper.invalid {
  border-color: #dc2626;
}

.input-wrapper input {
  flex: 1;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font-size: 15px;
}

.amount-input {
  padding-left: 14px;
}

.currency-prefix {
  color: #374151;
  font-weight: 600;
}

.currency-code {
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

.field-error {
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 13px;
}

.transfer-error,
.tan-error {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  margin-bottom: 18px;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
}

.primary-button,
.secondary-button,
.cancel-button,
.resend-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-button {
  border: 0;
  background: #2563eb;
  color: #ffffff;
}

.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
}

.primary-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.secondary-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.secondary-button:hover {
  background: #f9fafb;
}

.continue-button {
  width: 100%;
  margin-top: 4px;
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 13px;
  color: #6b7280;
  font-size: 12px;
}

.info-card {
  padding: 24px;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #1d4ed8;
}

.info-card-header h3 {
  margin: 0;
  color: #111827;
  font-size: 17px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-of-type {
  border-bottom: 0;
}

.info-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #f3f4f6;
  color: #4b5563;
}

.info-item strong {
  display: block;
  margin-bottom: 4px;
  color: #111827;
  font-size: 14px;
}

.info-item p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.help-box {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding: 14px;
  border-radius: 10px;
  background: #eff6ff;
  color: #1d4ed8;
}

.help-box strong {
  display: block;
  margin-bottom: 3px;
  color: #1e3a8a;
  font-size: 13px;
}

.help-box p {
  margin: 0;
  color: #1e40af;
  font-size: 12px;
  line-height: 1.5;
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 30px;
  text-align: center;
}

.state-card p {
  color: #6b7280;
}

.error-state {
  color: #dc2626;
}

.error-state h3 {
  margin: 12px 0 4px;
  color: #111827;
}

.error-state p {
  max-width: 500px;
  margin-bottom: 20px;
}

.spinner,
.button-spinner {
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner {
  width: 32px;
  height: 32px;
}

.button-spinner {
  width: 17px;
  height: 17px;
}

.success-card {
  max-width: 700px;
  margin: 30px auto;
  padding: 38px;
  text-align: center;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
}

.success-card h2 {
  margin: 0;
  color: #111827;
}

.success-message {
  margin: 8px 0 24px;
  color: #6b7280;
}

.success-details {
  margin-bottom: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  text-align: left;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: 0;
}

.detail-row span {
  color: #6b7280;
  font-size: 13px;
}

.detail-row strong {
  color: #111827;
  font-size: 14px;
}

.success-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
}

.tan-modal {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 32px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 17px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 23px;
  cursor: pointer;
}

.tan-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  margin: 0 auto 17px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
}

.tan-modal h2 {
  margin: 0;
  color: #111827;
}

.tan-description {
  margin: 9px 0 20px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.delivery-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 12px;
  margin-bottom: 18px;
  border-radius: 9px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
  text-align: left;
}

.tan-input-group {
  text-align: left;
}

.tan-input-group label {
  display: block;
  margin-bottom: 7px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.tan-input-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  outline: 0;
  font-size: 24px;
  letter-spacing: 8px;
  text-align: center;
}

.tan-input-group input:focus {
  border-color: #2563eb;
}

.tan-expiry {
  margin-top: 10px;
  color: #6b7280;
  font-size: 12px;
}

.tan-expiry strong {
  color: #374151;
}

.tan-error {
  margin-top: 15px;
  margin-bottom: 0;
  text-align: left;
}

.tan-confirm-button {
  width: 100%;
  margin-top: 20px;
}

.resend-button {
  width: 100%;
  margin-top: 10px;
  border: 0;
  background: transparent;
  color: #2563eb;
}

.resend-button:hover:not(:disabled) {
  background: #eff6ff;
}

.resend-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  width: 100%;
  margin-top: 3px;
  border: 0;
  background: transparent;
  color: #6b7280;
}

.cancel-button:hover {
  background: #f3f4f6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .business-transfers-page {
    padding: 20px;
  }
}

@media (max-width: 650px) {
  .page-header {
    flex-direction: column;
  }

  .account-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .account-balance {
    text-align: left;
  }

  .form-card,
  .info-card,
  .success-card {
    padding: 20px;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-actions button {
    width: 100%;
  }
}
</style>
