<template>
  <BankingShell :user="pageUser" page-section="BUUCHEZO BUSINESS" page-title="Business Accounts">
    <div class="accounts-page">
      <!-- Page header -->
      <section class="page-header">
        <div>
          <p class="eyebrow">BUSINESS BANKING</p>
          <h1>Accounts</h1>
          <p class="subtitle">Manage your business accounts, balances and account details.</p>
        </div>

        <div v-if="business" class="business-badge">
          <span class="badge-label">Business</span>
          <strong>{{ business.tradingName || business.legalName }}</strong>
        </div>
      </section>

      <!-- Loading -->
      <section v-if="loading" class="state-card">
        <div class="spinner"></div>
        <p>Loading business accounts...</p>
      </section>

      <!-- Error -->
      <section v-else-if="errorMessage" class="state-card error-state">
        <div class="state-icon">!</div>
        <h2>Unable to load accounts</h2>
        <p>{{ errorMessage }}</p>

        <button class="retry-button" type="button" @click="loadAccounts">Try again</button>
      </section>

      <!-- Empty -->
      <section v-else-if="accounts.length === 0" class="state-card">
        <div class="state-icon">€</div>
        <h2>No business accounts</h2>
        <p>This business does not have any accounts available yet.</p>
      </section>

      <!-- Accounts -->
      <template v-else>
        <section class="summary-grid">
          <div class="summary-card">
            <span class="summary-label">TOTAL ACCOUNTS</span>
            <strong>{{ accounts.length }}</strong>
            <span class="summary-description"> Business accounts </span>
          </div>

          <div class="summary-card">
            <span class="summary-label">ACTIVE ACCOUNTS</span>
            <strong>{{ activeAccounts }}</strong>
            <span class="summary-description"> Currently available </span>
          </div>

          <div class="summary-card">
            <span class="summary-label">BASE CURRENCY</span>
            <strong>{{ primaryCurrency }}</strong>
            <span class="summary-description"> Primary account currency </span>
          </div>
        </section>

        <section class="accounts-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">YOUR ACCOUNTS</p>
              <h2>Business accounts</h2>
            </div>

            <span class="account-count">
              {{ accounts.length }}
              {{ accounts.length === 1 ? 'account' : 'accounts' }}
            </span>
          </div>

          <div class="accounts-list">
            <article v-for="account in accounts" :key="account.id" class="account-card">
              <div class="account-top">
                <div class="account-icon">
                  {{ account.accountType.charAt(0) }}
                </div>

                <div class="account-heading">
                  <div class="account-title-row">
                    <h3>{{ formatAccountType(account.accountType) }}</h3>

                    <span :class="statusClass(account.accountStatus)" class="status-badge">
                      {{ formatStatus(account.accountStatus) }}
                    </span>
                  </div>

                  <p class="account-number">
                    {{ formatAccountNumber(account.accountNumber) }}
                  </p>
                </div>
              </div>

              <div class="account-balance">
                <span>Available balance</span>

                <strong>
                  {{ formatCurrency(account.balance, account.currency) }}
                </strong>
              </div>

              <div class="account-details">
                <div class="detail-item">
                  <span>Account type</span>
                  <strong>
                    {{ formatAccountType(account.accountType) }}
                  </strong>
                </div>

                <div class="detail-item">
                  <span>Currency</span>
                  <strong>{{ account.currency }}</strong>
                </div>

                <div class="detail-item">
                  <span>Ownership</span>
                  <strong>
                    {{ account.ownershipType || 'BUSINESS' }}
                  </strong>
                </div>

                <div class="detail-item">
                  <span>Account number</span>
                  <strong>{{ account.accountNumber }}</strong>
                </div>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>
  </BankingShell>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import BankingShell from '@/components/BankingShell.vue'
import {
  type Business,
  type BusinessAccount,
  getBusinessAccounts,
  getMyBusinesses,
} from '@/service/businessService.ts'

const business = ref<Business | null>(null)
const accounts = ref<BusinessAccount[]>([])
const loading = ref(true)
const errorMessage = ref('')

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

const activeAccounts = computed(
  () => accounts.value.filter((account) => account.accountStatus === 'ACTIVE').length,
)

const primaryCurrency = computed(() => {
  return accounts.value[0]?.currency || '—'
})

async function loadAccounts() {
  loading.value = true
  errorMessage.value = ''

  try {
    const businesses = await getMyBusinesses()

    const currentBusiness = businesses[0]

    if (!currentBusiness) {
      throw new Error('No business profile was found for this user.')
    }

    business.value = currentBusiness

    accounts.value = await getBusinessAccounts(currentBusiness.id)
  } catch (error) {
    console.error('Failed to load business accounts:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading the business accounts.'
  } finally {
    loading.value = false
  }
}

function formatAccountType(accountType: string) {
  return accountType
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/_/g, '-')
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

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

onMounted(loadAccounts)
</script>

<style scoped>
.accounts-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 0 40px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #7b8494;
}

.page-header h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.business-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.badge-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
}

.business-badge strong {
  color: #1f2937;
  font-size: 14px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.summary-card {
  display: flex;
  flex-direction: column;
  min-height: 118px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
}

.summary-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

.summary-card strong {
  margin-top: 12px;
  font-size: 25px;
  line-height: 1;
  color: #111827;
}

.summary-description {
  margin-top: auto;
  padding-top: 10px;
  font-size: 12px;
  color: #6b7280;
}

.accounts-section {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.account-count {
  font-size: 12px;
  color: #6b7280;
}

.accounts-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.account-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fafafa;
}

.account-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.account-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  background: #111827;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
}

.account-heading {
  min-width: 0;
  flex: 1;
}

.account-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.account-title-row h3 {
  margin: 0;
  font-size: 15px;
  color: #111827;
}

.account-number {
  margin: 5px 0 0;
  font-family: monospace;
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.04em;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.frozen {
  background: #fef3c7;
  color: #92400e;
}

.account-balance {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid #e5e7eb;
}

.account-balance span {
  font-size: 12px;
  color: #6b7280;
}

.account-balance strong {
  font-size: 24px;
  color: #111827;
  letter-spacing: -0.02em;
}

.account-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
  margin-top: 18px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.detail-item span {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.detail-item strong {
  overflow: hidden;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  margin: 16px 0 6px;
  color: #111827;
  font-size: 18px;
}

.state-card p {
  max-width: 480px;
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
}

.error-state .state-icon {
  background: #fee2e2;
  color: #b91c1c;
}

.spinner {
  width: 28px;
  height: 28px;
  margin-bottom: 14px;
  border: 3px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.retry-button {
  margin-top: 20px;
  padding: 10px 16px;
  border: 0;
  border-radius: 9px;
  background: #111827;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.retry-button:hover {
  background: #1f2937;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .accounts-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .business-badge {
    align-items: flex-start;
  }

  .accounts-section {
    padding: 18px;
  }

  .account-balance {
    align-items: flex-start;
    flex-direction: column;
  }

  .account-details {
    grid-template-columns: 1fr;
  }
}
</style>
