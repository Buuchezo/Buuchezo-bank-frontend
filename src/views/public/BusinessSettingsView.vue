<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, Building2, FileText, Mail, MapPin, Phone, RefreshCw, ShieldCheck, Users } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import BankingShell from '@/components/BankingShell.vue'
import { type Business, getMyBusinesses } from '@/service/businessService.ts'

const router = useRouter()

const business = ref<Business | null>(null)

const loading = ref(true)
const refreshing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const businessId = computed(() => business.value?.id ?? null)

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}
//TODO
async function loadBusiness(showLoading = true) {
  clearMessages()

  if (showLoading) {
    loading.value = true
  } else {
    refreshing.value = true
  }

  try {
    const businesses = await getMyBusinesses()

    if (!businesses.length) {
      throw new Error('No business was found for this account.')
    }

    business.value = businesses[0] ?? null

    if (!business.value) {
      throw new Error('Unable to determine the active business.')
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to load business information.'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

function displayValue(value?: string | null) {
  return value?.trim() || 'Not provided'
}

function goToMembers() {
  router.push('/business/members')
}

onMounted(() => {
  loadBusiness()
})
</script>

<template>
  <BankingShell page-section="BUSINESS BANKING" page-title="Business Settings">
    <div class="settings-page">
      <!-- HEADER -->
      <section class="page-header">
        <div>
          <p class="eyebrow">Business administration</p>

          <h2>Business Settings</h2>

          <p class="page-description">View your business profile and manage business access.</p>
        </div>

        <button
          :disabled="loading || refreshing"
          class="refresh-button"
          type="button"
          @click="loadBusiness(false)"
        >
          <RefreshCw :class="{ spinning: refreshing }" :size="16" />

          Refresh
        </button>
      </section>

      <!-- SUCCESS -->
      <div v-if="successMessage" class="message success-message">
        {{ successMessage }}
      </div>

      <!-- ERROR -->
      <div v-if="errorMessage" class="message error-message">
        {{ errorMessage }}
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="loading-card">
        <RefreshCw :size="21" class="spinning" />

        <span>Loading business settings...</span>
      </div>

      <template v-else-if="business">
        <!-- BUSINESS PROFILE -->
        <section class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <Building2 :size="18" />
            </div>

            <div>
              <h3>Business information</h3>

              <p>Registered information associated with your business.</p>
            </div>
          </div>

          <div class="settings-grid">
            <!-- LEGAL NAME -->
            <div class="setting-item">
              <div class="setting-icon">
                <Building2 :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Legal name </span>

                <strong>
                  {{ displayValue(business.legalName) }}
                </strong>
              </div>
            </div>

            <!-- TRADING NAME -->
            <div class="setting-item">
              <div class="setting-icon">
                <Building2 :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Trading name </span>

                <strong>
                  {{ displayValue(business.tradingName) }}
                </strong>
              </div>
            </div>

            <!-- REGISTRATION NUMBER -->
            <div class="setting-item">
              <div class="setting-icon">
                <FileText :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Registration number </span>

                <strong>
                  {{ displayValue(business.registrationNumber) }}
                </strong>
              </div>
            </div>

            <!-- BUSINESS EMAIL -->
            <div class="setting-item">
              <div class="setting-icon">
                <Mail :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Business email </span>

                <strong>
                  {{ displayValue(business.email) }}
                </strong>
              </div>
            </div>

            <!-- PHONE -->
            <div class="setting-item">
              <div class="setting-icon">
                <Phone :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Phone </span>

                <strong>
                  {{ displayValue(business.phone) }}
                </strong>
              </div>
            </div>

            <!-- ADDRESS -->
            <div class="setting-item">
              <div class="setting-icon">
                <MapPin :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Address </span>

                <strong>
                  {{ displayValue(business.address) }}
                </strong>
              </div>
            </div>

            <!-- CITY -->
            <div class="setting-item">
              <div class="setting-icon">
                <MapPin :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> City </span>

                <strong>
                  {{ displayValue(business.city) }}
                </strong>
              </div>
            </div>

            <!-- COUNTRY -->
            <div class="setting-item">
              <div class="setting-icon">
                <MapPin :size="16" />
              </div>

              <div class="setting-content">
                <span class="setting-label"> Country </span>

                <strong>
                  {{ displayValue(business.country) }}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <!-- BUSINESS ID -->
        <section class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <ShieldCheck :size="18" />
            </div>

            <div>
              <h3>Business account</h3>

              <p>Identification information for this business.</p>
            </div>
          </div>

          <div class="account-details">
            <div class="account-detail">
              <span>Business ID</span>

              <strong>
                {{ businessId }}
              </strong>
            </div>

            <div class="account-detail">
              <span>Business status</span>

              <strong class="status-active"> Active </strong>
            </div>
          </div>
        </section>

        <!-- TEAM MANAGEMENT -->
        <section class="settings-card">
          <div class="card-header">
            <div class="card-header-icon">
              <Users :size="18" />
            </div>

            <div>
              <h3>Team management</h3>

              <p>Manage users who have access to this business.</p>
            </div>
          </div>

          <div class="management-row">
            <div>
              <strong>Business members</strong>

              <p>Add members, change their roles, or remove their access.</p>
            </div>

            <button class="management-button" type="button" @click="goToMembers">
              Manage members

              <ArrowRight :size="15" />
            </button>
          </div>
        </section>

        <!-- EDITING NOTICE -->
        <section class="notice-card">
          <div class="notice-icon">
            <ShieldCheck :size="18" />
          </div>

          <div>
            <strong>Business profile editing</strong>

            <p>
              Business profile information is currently read-only. Editing functionality will be
              added when the corresponding business update service is available.
            </p>
          </div>
        </section>
      </template>
    </div>
  </BankingShell>
</template>

<style scoped>
.settings-page {
  max-width: 1180px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #0d6fbd;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.page-header h2 {
  margin: 0;
  color: #0b1f38;
  font-size: 24px;
  font-weight: 750;
}

.page-description {
  max-width: 620px;
  margin: 8px 0 0;
  color: #718096;
  font-size: 12px;
  line-height: 1.6;
}

.refresh-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  border: 1px solid #dce5ee;
  border-radius: 8px;
  background: #ffffff;
  color: #52657d;
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.refresh-button:hover:not(:disabled) {
  border-color: #bcd9ed;
  color: #0d6fbd;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.message {
  margin-bottom: 16px;
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.success-message {
  border: 1px solid #c8ead8;
  background: #f0fbf5;
  color: #197044;
}

.error-message {
  border: 1px solid #f0cccc;
  background: #fff5f5;
  color: #a33a3a;
}

.loading-card {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid #e3eaf1;
  border-radius: 12px;
  background: #ffffff;
  color: #718096;
  font-size: 11px;
}

.settings-card {
  margin-bottom: 18px;
  overflow: hidden;
  border: 1px solid #e3eaf1;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(11, 31, 56, 0.04);
}

.card-header {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid #e8eef4;
}

.card-header-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: #eaf5fd;
  color: #0d6fbd;
}

.card-header h3 {
  margin: 0 0 3px;
  color: #132945;
  font-size: 13px;
  font-weight: 750;
}

.card-header p {
  margin: 0;
  color: #8a98a9;
  font-size: 9px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.setting-item {
  min-height: 88px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 17px 20px;
  border-bottom: 1px solid #edf1f5;
}

.setting-item:nth-child(odd) {
  border-right: 1px solid #edf1f5;
}

.setting-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 7px;
  background: #f5f8fb;
  color: #718096;
}

.setting-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.setting-label {
  color: #8a98a9;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.setting-content strong {
  overflow: hidden;
  color: #132945;
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.account-detail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
}

.account-detail + .account-detail {
  border-left: 1px solid #edf1f5;
}

.account-detail span {
  color: #8a98a9;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.account-detail strong {
  color: #132945;
  font-size: 11px;
  font-weight: 750;
}

.status-active {
  color: #247447 !important;
}

.management-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.management-row strong {
  display: block;
  margin-bottom: 5px;
  color: #132945;
  font-size: 11px;
  font-weight: 750;
}

.management-row p {
  margin: 0;
  color: #8a98a9;
  font-size: 9px;
  line-height: 1.5;
}

.management-button {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex-shrink: 0;
  padding: 0 13px;
  border: 1px solid #dce5ee;
  border-radius: 7px;
  background: #ffffff;
  color: #52657d;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

.management-button:hover {
  border-color: #bcd9ed;
  color: #0d6fbd;
}

.notice-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 17px;
  border: 1px solid #dce9f3;
  border-radius: 10px;
  background: #f7fbff;
}

.notice-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 7px;
  background: #eaf5fd;
  color: #0d6fbd;
}

.notice-card strong {
  display: block;
  margin-bottom: 4px;
  color: #132945;
  font-size: 10px;
  font-weight: 750;
}

.notice-card p {
  max-width: 700px;
  margin: 0;
  color: #718096;
  font-size: 9px;
  line-height: 1.55;
}

.spinning {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 800px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-item:nth-child(odd) {
    border-right: 0;
  }

  .account-details {
    grid-template-columns: 1fr;
  }

  .account-detail + .account-detail {
    border-top: 1px solid #edf1f5;
    border-left: 0;
  }
}

@media (max-width: 600px) {
  .management-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .management-button {
    width: 100%;
  }
}
</style>
