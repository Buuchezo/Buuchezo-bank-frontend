<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import BankingShell from '@/components/BankingShell.vue'
import { type Business, type BusinessAccount, getBusinessAccounts, getMyBusinesses } from '@/service/businessService.ts'
import { type Card, getCardsByAccount } from '@/service/cardService'
import { type CardApplication, createCardApplication, getMyCardApplications } from '@/service/cardApplicationService'

const business = ref<Business | null>(null)
const accounts = ref<BusinessAccount[]>([])
const cards = ref<Card[]>([])
const applications = ref<CardApplication[]>([])

const loading = ref(true)
const errorMessage = ref('')

const applicationModalOpen = ref(false)
const applicationSubmitting = ref(false)
const applicationError = ref('')
const applicationSuccess = ref('')

const selectedApplicationType = ref<'DEBIT' | 'CREDIT'>('DEBIT')

const selectedCardIndex = ref(0)

const pageUser = computed(() => {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    return {}
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return {}
  }
})

const activeAccount = computed(() => {
  return (
    accounts.value.find((account) => account.accountStatus === 'ACTIVE') ??
    accounts.value[0] ??
    null
  )
})

const selectedCard = computed<Card | null>(() => {
  return cards.value[selectedCardIndex.value] ?? cards.value[0] ?? null
})

const cardHolderName = computed(() => {
  return selectedCard.value?.holderName || 'BUSINESS ACCOUNT HOLDER'
})

const cardTypeLabel = computed(() => {
  const type = selectedCard.value?.cardType || 'CARD'

  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const cardStatusLabel = computed(() => {
  const status = selectedCard.value?.cardStatus || 'NO CARD'

  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const cardStatusClass = computed(() => {
  const status = selectedCard.value?.cardStatus?.toUpperCase()

  if (status === 'ACTIVE') {
    return 'active'
  }

  if (status === 'BLOCKED') {
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

const pendingApplication = computed<CardApplication | null>(() => {
  if (!activeAccount.value) {
    return null
  }

  return (
    applications.value.find(
      (application) =>
        application.accountNumber === activeAccount.value?.accountNumber &&
        application.applicationStatus === 'PENDING',
    ) ?? null
  )
})

const latestApplication = computed<CardApplication | null>(() => {
  if (!activeAccount.value) {
    return null
  }

  return (
    applications.value.find(
      (application) => application.accountNumber === activeAccount.value?.accountNumber,
    ) ?? null
  )
})

const applicationStatusLabel = computed(() => {
  const status = latestApplication.value?.applicationStatus

  if (!status) {
    return ''
  }

  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
})

const applicationStatusClass = computed(() => {
  return latestApplication.value?.applicationStatus?.toLowerCase() || ''
})

const businessName = computed(() => {
  return business.value?.tradingName || business.value?.legalName || 'Your business'
})

async function loadBusinessCards() {
  loading.value = true
  errorMessage.value = ''

  try {
    const businesses = await getMyBusinesses()

    const currentBusiness = businesses[0]

    if (!currentBusiness) {
      throw new Error('No business profile was found for this user.')
    }

    business.value = currentBusiness

    const loadedAccounts = await getBusinessAccounts(currentBusiness.id)

    accounts.value = loadedAccounts

    const account =
      loadedAccounts.find((item) => item.accountStatus === 'ACTIVE') ?? loadedAccounts[0]

    if (!account) {
      return
    }

    cards.value = await getCardsByAccount(account.accountNumber)

    selectedCardIndex.value = 0

    try {
      applications.value = await getMyCardApplications()
    } catch (applicationError) {
      console.error('Failed to load card applications:', applicationError)
      applications.value = []
    }
  } catch (error) {
    console.error('Failed to load business cards:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load your business cards.'
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
  if (applicationSubmitting.value) {
    return
  }

  applicationModalOpen.value = false
  applicationError.value = ''
}

async function submitCardApplication() {
  if (!activeAccount.value) {
    applicationError.value = 'No active business account is available.'
    return
  }

  if (pendingApplication.value) {
    applicationError.value = 'You already have a pending card application for this account.'
    return
  }

  applicationSubmitting.value = true
  applicationError.value = ''
  applicationSuccess.value = ''

  try {
    const holderName =
      business.value?.tradingName || business.value?.legalName || 'BUSINESS ACCOUNT HOLDER'

    const application = await createCardApplication({
      accountNumber: activeAccount.value.accountNumber,
      cardType: selectedApplicationType.value,
      holderName,
    })

    applications.value = [
      application,
      ...applications.value.filter((item) => item.id !== application.id),
    ]

    applicationModalOpen.value = false

    applicationSuccess.value = `${selectedApplicationType.value === 'DEBIT' ? 'Debit' : 'Credit'} card application submitted successfully.`
  } catch (error) {
    applicationError.value =
      error instanceof Error ? error.message : 'Unable to submit the card application.'
  } finally {
    applicationSubmitting.value = false
  }
}

function selectCard(index: number) {
  selectedCardIndex.value = index
}

function formatAccountNumber(accountNumber: string) {
  if (!accountNumber) {
    return '—'
  }

  if (accountNumber.length <= 4) {
    return accountNumber
  }

  return `•••• ${accountNumber.slice(-4)}`
}

onMounted(loadBusinessCards)
</script>

<template>
  <BankingShell :user="pageUser" page-section="BUUCHEZO BUSINESS" page-title="Business Cards">
    <main class="business-cards-page">
      <!-- HEADER -->
      <section class="page-header">
        <div>
          <p class="eyebrow">BUSINESS BANKING</p>

          <h1>Cards</h1>

          <p class="subtitle">Manage your business cards and card applications.</p>
        </div>

        <div v-if="business" class="business-name">
          {{ businessName }}
        </div>
      </section>

      <!-- LOADING -->
      <section v-if="loading" class="state-card">
        <div class="spinner"></div>

        <h2>Loading business cards</h2>

        <p>Please wait while we retrieve your business card information.</p>
      </section>

      <!-- ERROR -->
      <section v-else-if="errorMessage" class="state-card error-state">
        <div class="state-icon">!</div>

        <h2>Unable to load cards</h2>

        <p>{{ errorMessage }}</p>

        <button class="primary-button" type="button" @click="loadBusinessCards">Try again</button>
      </section>

      <!-- CONTENT -->
      <template v-else>
        <!-- SUCCESS -->
        <div v-if="applicationSuccess" class="success-message">
          {{ applicationSuccess }}
        </div>

        <!-- ACCOUNT -->
        <section v-if="activeAccount" class="account-strip">
          <div>
            <span>BUSINESS ACCOUNT</span>

            <strong>
              {{ formatAccountNumber(activeAccount.accountNumber) }}
            </strong>
          </div>

          <div>
            <span>ACCOUNT TYPE</span>

            <strong>
              {{ activeAccount.accountType }}
            </strong>
          </div>

          <div>
            <span>CURRENCY</span>

            <strong>
              {{ activeAccount.currency }}
            </strong>
          </div>
        </section>

        <!-- CARD -->
        <section class="cards-layout">
          <div class="card-area">
            <div class="section-heading">
              <div>
                <p class="eyebrow">YOUR BUSINESS CARD</p>

                <h2>
                  {{ selectedCard ? 'Card details' : 'No physical card yet' }}
                </h2>
              </div>

              <span v-if="selectedCard" :class="cardStatusClass" class="status-badge">
                {{ cardStatusLabel }}
              </span>
            </div>

            <!-- VISUAL CARD -->
            <div v-if="selectedCard" class="bank-card">
              <div class="card-top">
                <div>
                  <strong>Buuchezo Bank</strong>
                  <span>BUSINESS</span>
                </div>

                <div class="chip"></div>
              </div>

              <div class="card-number">
                {{ maskedCardNumber }}
              </div>

              <div class="card-bottom">
                <div>
                  <span>CARD HOLDER</span>
                  <strong>{{ cardHolderName }}</strong>
                </div>

                <div>
                  <span>EXPIRES</span>
                  <strong>{{ expiryDate }}</strong>
                </div>

                <div>
                  <span>TYPE</span>
                  <strong>{{ cardTypeLabel }}</strong>
                </div>
              </div>
            </div>

            <!-- CARD LIST -->
            <div v-if="cards.length > 1" class="card-selector">
              <button
                v-for="(card, index) in cards"
                :key="card.id"
                :class="{ selected: index === selectedCardIndex }"
                class="card-selector-item"
                type="button"
                @click="selectCard(index)"
              >
                <span>
                  {{ card.cardType }}
                </span>

                <strong>
                  {{ card.maskedCardNumber }}
                </strong>
              </button>
            </div>

            <!-- NO CARD -->
            <div v-if="cards.length === 0" class="no-card-card">
              <div class="no-card-icon">
                <span>▣</span>
              </div>

              <h3>No business card yet</h3>

              <p>Apply for a business debit or credit card for your business account.</p>

              <div class="application-buttons">
                <button
                  :disabled="!!pendingApplication"
                  class="primary-button"
                  type="button"
                  @click="openApplicationModal('DEBIT')"
                >
                  Apply for debit card
                </button>

                <button
                  :disabled="!!pendingApplication"
                  class="secondary-button"
                  type="button"
                  @click="openApplicationModal('CREDIT')"
                >
                  Apply for credit card
                </button>
              </div>
            </div>
          </div>

          <!-- DETAILS -->
          <aside class="details-card">
            <p class="eyebrow">CARD INFORMATION</p>

            <h2>Business card</h2>

            <div v-if="selectedCard" class="details-list">
              <div class="detail-row">
                <span>Card type</span>
                <strong>{{ cardTypeLabel }}</strong>
              </div>

              <div class="detail-row">
                <span>Status</span>

                <strong>
                  {{ cardStatusLabel }}
                </strong>
              </div>

              <div class="detail-row">
                <span>Card number</span>

                <strong>
                  {{ maskedCardNumber }}
                </strong>
              </div>

              <div class="detail-row">
                <span>Card holder</span>

                <strong>
                  {{ cardHolderName }}
                </strong>
              </div>

              <div class="detail-row">
                <span>Expiry date</span>

                <strong>
                  {{ expiryDate }}
                </strong>
              </div>
            </div>

            <div v-else class="details-empty">
              <p>Your business does not have an issued card yet.</p>
            </div>

            <div v-if="latestApplication" class="application-status">
              <span>Latest application</span>

              <strong :class="applicationStatusClass">
                {{ applicationStatusLabel }}
              </strong>
            </div>
          </aside>
        </section>

        <!-- APPLICATION -->
        <section class="application-section">
          <div>
            <p class="eyebrow">CARD APPLICATION</p>

            <h2>Need another business card?</h2>

            <p>
              Request a debit or credit card for your business account. Applications are reviewed
              before a card is issued.
            </p>
          </div>

          <div class="application-buttons">
            <button
              :disabled="!!pendingApplication"
              class="primary-button"
              type="button"
              @click="openApplicationModal('DEBIT')"
            >
              Apply for debit card
            </button>

            <button
              :disabled="!!pendingApplication"
              class="secondary-button"
              type="button"
              @click="openApplicationModal('CREDIT')"
            >
              Apply for credit card
            </button>
          </div>
        </section>
      </template>

      <!-- APPLICATION MODAL -->
      <div v-if="applicationModalOpen" class="modal-overlay" @click.self="closeApplicationModal">
        <section class="modal-card">
          <div class="modal-header">
            <div>
              <p class="eyebrow">CARD APPLICATION</p>

              <h2>
                Apply for
                {{ selectedApplicationType === 'DEBIT' ? 'a debit card' : 'a credit card' }}
              </h2>
            </div>

            <button
              :disabled="applicationSubmitting"
              class="close-button"
              type="button"
              @click="closeApplicationModal"
            >
              ×
            </button>
          </div>

          <div class="modal-content">
            <div class="application-summary">
              <span>BUSINESS</span>
              <strong>{{ businessName }}</strong>
            </div>

            <div v-if="activeAccount" class="application-summary">
              <span>ACCOUNT</span>

              <strong>
                {{ formatAccountNumber(activeAccount.accountNumber) }}
              </strong>
            </div>

            <div class="application-summary">
              <span>CARD TYPE</span>

              <strong>
                {{ selectedApplicationType === 'DEBIT' ? 'Debit Card' : 'Credit Card' }}
              </strong>
            </div>

            <div v-if="applicationError" class="application-error">
              {{ applicationError }}
            </div>

            <p class="modal-note">
              Your application will be submitted for review. The card will only be issued after
              approval.
            </p>
          </div>

          <div class="modal-actions">
            <button
              :disabled="applicationSubmitting"
              class="secondary-button"
              type="button"
              @click="closeApplicationModal"
            >
              Cancel
            </button>

            <button
              :disabled="applicationSubmitting"
              class="primary-button"
              type="button"
              @click="submitCardApplication"
            >
              {{ applicationSubmitting ? 'Submitting...' : 'Submit application' }}
            </button>
          </div>
        </section>
      </div>
    </main>
  </BankingShell>
</template>

<style scoped>
.business-cards-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 0 40px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #7b8494;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.page-header h1 {
  margin: 0;
  color: #111827;
  font-size: 32px;
  letter-spacing: -0.03em;
}

.subtitle {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.business-name {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.account-strip {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #e5e7eb;
}

.account-strip > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px 18px;
  background: #ffffff;
}

.account-strip span {
  color: #9ca3af;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.account-strip strong {
  color: #1f2937;
  font-size: 13px;
}

.cards-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.7fr);
  gap: 20px;
}

.card-area,
.details-card,
.application-section {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.card-area {
  padding: 24px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.section-heading h2,
.details-card h2,
.application-section h2 {
  margin: 0;
  color: #111827;
  font-size: 20px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.blocked {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.other {
  background: #f3f4f6;
  color: #6b7280;
}

.bank-card {
  min-height: 265px;
  padding: 28px;
  border-radius: 18px;
  background: linear-gradient(135deg, #102b4a 0%, #071b31 100%);
  color: #ffffff;
  box-shadow: 0 16px 35px rgba(15, 35, 58, 0.18);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-top strong {
  display: block;
  font-size: 17px;
}

.card-top span {
  display: block;
  margin-top: 4px;
  color: #aebdcd;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.chip {
  width: 42px;
  height: 31px;
  border-radius: 7px;
  background: #d9c99a;
}

.card-number {
  margin-top: 58px;
  font-family: monospace;
  font-size: 21px;
  letter-spacing: 0.12em;
}

.card-bottom {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  margin-top: 32px;
}

.card-bottom span {
  display: block;
  margin-bottom: 5px;
  color: #91a3b7;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.card-bottom strong {
  display: block;
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.card-selector-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  text-align: left;
}

.card-selector-item.selected {
  border-color: #1d4f7a;
  background: #eff6ff;
  color: #1d4f7a;
}

.card-selector-item span {
  font-size: 10px;
  font-weight: 700;
}

.card-selector-item strong {
  font-family: monospace;
  font-size: 11px;
}

.details-card {
  padding: 24px;
}

.details-list {
  margin-top: 22px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 0;
  border-bottom: 1px solid #f0f1f3;
}

.detail-row span {
  color: #6b7280;
  font-size: 12px;
}

.detail-row strong {
  max-width: 60%;
  overflow: hidden;
  color: #1f2937;
  font-size: 12px;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.application-status {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 22px;
  padding: 13px;
  border-radius: 10px;
  background: #f8fafc;
}

.application-status span {
  color: #6b7280;
  font-size: 11px;
}

.application-status strong {
  font-size: 11px;
}

.application-status.pending {
  color: #92400e;
}

.application-status.approved {
  color: #166534;
}

.application-status.rejected {
  color: #991b1b;
}

.application-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-top: 20px;
  padding: 24px;
}

.application-section p:not(.eyebrow) {
  max-width: 680px;
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.application-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-button,
.secondary-button {
  padding: 11px 16px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
}

.primary-button:hover {
  background: #1f2937;
}

.secondary-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.secondary-button:hover {
  background: #f9fafb;
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.no-card-card {
  padding: 42px 24px;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
  text-align: center;
}

.no-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  border-radius: 14px;
  background: #f3f4f6;
  color: #374151;
  font-size: 20px;
}

.no-card-card h3 {
  margin: 0;
  color: #111827;
  font-size: 18px;
}

.no-card-card p {
  max-width: 500px;
  margin: 8px auto 20px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.details-empty {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  background: #f8fafc;
}

.details-empty p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.5;
}

.success-message {
  margin-bottom: 18px;
  padding: 12px 15px;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  padding: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  text-align: center;
}

.state-card h2 {
  margin: 15px 0 7px;
  color: #111827;
  font-size: 18px;
}

.state-card p {
  max-width: 480px;
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 700;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.modal-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
}

.modal-card {
  width: min(520px, 100%);
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #111827;
  font-size: 20px;
}

.close-button {
  border: 0;
  background: transparent;
  color: #6b7280;
  font-size: 25px;
  cursor: pointer;
}

.modal-content {
  padding: 22px 24px;
}

.application-summary {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f3;
}

.application-summary span {
  color: #9ca3af;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.application-summary strong {
  color: #374151;
  font-size: 12px;
  text-align: right;
}

.application-error {
  margin-top: 16px;
  padding: 11px 13px;
  border-radius: 9px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
}

.modal-note {
  margin: 18px 0 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 24px;
  border-top: 1px solid #e5e7eb;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .cards-layout {
    grid-template-columns: 1fr;
  }

  .application-section {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .account-strip {
    grid-template-columns: 1fr;
  }

  .bank-card {
    min-height: 235px;
    padding: 20px;
  }

  .card-number {
    margin-top: 42px;
    font-size: 16px;
  }

  .card-bottom {
    gap: 10px;
    margin-top: 24px;
  }

  .card-bottom strong {
    font-size: 9px;
  }

  .card-area,
  .details-card,
  .application-section {
    padding: 18px;
  }
}
</style>
