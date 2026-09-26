<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeftRight, ChevronRight, ShieldCheck, Users, WalletCards } from 'lucide-vue-next'

import BankingShell from '@/components/BankingShell.vue'

import {
  getMyBusinesses,
  getBusinessAccounts,
  type Business,
  type BusinessAccount,
} from '../../service/businessService.ts'

interface User {
  firstName?: string
  lastName?: string
  email?: string
}

const currentUser = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
})

const business = ref<Business | null>(null)

const accounts = ref<BusinessAccount[]>([])

const loading = ref(true)

const errorMessage = ref('')

const pageUser = computed(() => currentUser.value)

const businessName = computed(() => {
  return business.value?.tradingName || business.value?.legalName || 'Business Dashboard'
})

function loadStoredUser() {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

  if (!storedUser) {
    return
  }

  try {
    currentUser.value = JSON.parse(storedUser) as User
  } catch {
    currentUser.value = {
      firstName: '',
      lastName: '',
      email: '',
    }
  }
}

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    /*
     * ------------------------------------------------------------
     * LOAD BUSINESSES
     * ------------------------------------------------------------
     *
     * businessService handles:
     * - access token
     * - Authorization header
     * - API response handling
     * - backend errors
     */
    const businesses = await getMyBusinesses()

    if (businesses.length === 0) {
      throw new Error('No business is associated with your account.')
    }

    /*
     * For now the dashboard uses the first business
     * associated with the authenticated user.
     */
    const selectedBusiness = businesses[0]

    if (!selectedBusiness) {
      throw new Error('No business is associated with your account.')
    }

    business.value = selectedBusiness

    /*
     * ------------------------------------------------------------
     * LOAD BUSINESS ACCOUNTS
     * ------------------------------------------------------------
     */
    accounts.value = await getBusinessAccounts(selectedBusiness.id)
  } catch (error) {
    console.error('Failed to load business dashboard:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to load the business dashboard.'
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}

onMounted(() => {
  loadStoredUser()
  loadDashboard()
})
</script>

<template>
  <BankingShell :user="pageUser" page-title="Business Dashboard" page-section="BUUCHEZO BUSINESS">
    <main class="business-dashboard-page">
      <!-- =====================================================
           PAGE INTRODUCTION
      ====================================================== -->

      <section class="dashboard-introduction">
        <div>
          <span class="eyebrow"> BUUCHEZO BUSINESS </span>

          <h1>
            {{ businessName }}
          </h1>

          <p>Manage your business accounts and keep track of your business finances.</p>
        </div>

        <RouterLink to="/business" class="back-link"> Back to Business </RouterLink>
      </section>

      <!-- =====================================================
           LOADING
      ====================================================== -->

      <section v-if="loading" class="state-card">
        <div class="loader"></div>

        <h3>Loading your business dashboard</h3>

        <p>Please wait while we retrieve your business information.</p>
      </section>

      <!-- =====================================================
           ERROR
      ====================================================== -->

      <section v-else-if="errorMessage" class="state-card error-state">
        <div class="state-icon">!</div>

        <h3>Unable to load your business</h3>

        <p>
          {{ errorMessage }}
        </p>

        <button type="button" class="primary-button" @click="loadDashboard">Try again</button>
      </section>

      <!-- =====================================================
           DASHBOARD
      ====================================================== -->

      <template v-else>
        <!-- ===================================================
             BUSINESS INFORMATION
        ==================================================== -->

        <section v-if="business" class="business-info-card">
          <div class="business-info-item">
            <span class="card-label"> LEGAL NAME </span>

            <strong>
              {{ business.legalName }}
            </strong>
          </div>

          <div v-if="business.tradingName" class="business-info-item">
            <span class="card-label"> TRADING NAME </span>

            <strong>
              {{ business.tradingName }}
            </strong>
          </div>

          <div v-if="business.registrationNumber" class="business-info-item">
            <span class="card-label"> REGISTRATION NUMBER </span>

            <strong>
              {{ business.registrationNumber }}
            </strong>
          </div>

          <div class="business-info-item">
            <span class="card-label"> BUSINESS STATUS </span>

            <span class="status-badge"> Active </span>
          </div>
        </section>

        <!-- ===================================================
             BUSINESS ACCOUNTS
        ==================================================== -->

        <section class="accounts-section">
          <div class="section-heading">
            <div>
              <span class="eyebrow"> BUSINESS ACCOUNTS </span>

              <h2>Your accounts</h2>
            </div>

            <span class="account-count">
              {{ accounts.length }}
              {{ accounts.length === 1 ? 'account' : 'accounts' }}
            </span>
          </div>

          <!-- No accounts -->

          <div v-if="accounts.length === 0" class="empty-card">
            <div class="empty-icon">
              <WalletCards :size="22" />
            </div>

            <h3>No business accounts found</h3>

            <p>Your business does not currently have any accounts.</p>
          </div>

          <!-- Accounts -->

          <div v-else class="accounts-grid">
            <article v-for="account in accounts" :key="account.id" class="account-card">
              <div class="account-card-top">
                <div class="account-icon">
                  <WalletCards :size="21" />
                </div>

                <span
                  class="account-status"
                  :class="{
                    active: account.accountStatus === 'ACTIVE',
                  }"
                >
                  {{ account.accountStatus }}
                </span>
              </div>

              <div class="account-type">
                {{ account.accountType }}
              </div>

              <div class="account-balance">
                <span> Available balance </span>

                <strong>
                  {{ formatCurrency(account.balance, account.currency) }}
                </strong>
              </div>

              <div class="account-footer">
                <div>
                  <span> ACCOUNT NUMBER </span>

                  <strong>
                    {{ account.accountNumber }}
                  </strong>
                </div>

                <div>
                  <span> CURRENCY </span>

                  <strong>
                    {{ account.currency }}
                  </strong>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- ===================================================
             QUICK ACTIONS
        ==================================================== -->

        <section class="quick-actions-section">
          <div class="section-heading">
            <div>
              <span class="eyebrow"> QUICK ACTIONS </span>

              <h2>Manage your business</h2>
            </div>
          </div>

          <div class="quick-actions">
            <RouterLink
              to="/business/transfers"
              class="quick-action"
            >
              <div class="quick-action-icon">
                <ArrowLeftRight :size="19" />
              </div>

              <div class="quick-action-content">
                <strong>Transfers</strong>

                <span>Move money between accounts</span>
              </div>

              <ChevronRight :size="18" />
            </RouterLink>

            <button type="button" class="quick-action">
              <div class="quick-action-icon">
                <Users :size="19" />
              </div>

              <div class="quick-action-content">
                <strong> Team members </strong>

                <span> Manage your business users </span>
              </div>

              <ChevronRight :size="18" />
            </button>

            <button type="button" class="quick-action">
              <div class="quick-action-icon">
                <ShieldCheck :size="19" />
              </div>

              <div class="quick-action-content">
                <strong> Business security </strong>

                <span> Review your account security </span>
              </div>

              <ChevronRight :size="18" />
            </button>
          </div>
        </section>
      </template>
    </main>
  </BankingShell>
</template>

<style scoped>
/* ============================================================
   BANKING DASHBOARD
============================================================ */

.business-dashboard-page {
  width: 100%;
  padding: 4px 0 50px;

  color: #132945;
}

/* ============================================================
   INTRODUCTION
============================================================ */

.dashboard-introduction {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 30px;

  margin-bottom: 30px;
}

.eyebrow {
  display: block;

  margin-bottom: 8px;

  color: #0d6fbd;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 0.16em;
}

.dashboard-introduction h1 {
  margin: 0;

  color: #0b1f38;

  font-size: 28px;
  line-height: 1.15;

  letter-spacing: -0.035em;
}

.dashboard-introduction p {
  max-width: 620px;

  margin: 10px 0 0;

  color: #718096;

  font-size: 12px;
  line-height: 1.7;
}

.back-link {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  min-height: 38px;

  padding: 0 15px;

  color: #0d6fbd;

  border: 1px solid #e1e8f0;
  border-radius: 8px;

  background: #ffffff;

  font-size: 10px;
  font-weight: 700;

  text-decoration: none;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.back-link:hover {
  color: #ffffff;

  border-color: #1597ff;

  background: #1597ff;
}

/* ============================================================
   BUSINESS INFORMATION
============================================================ */

.business-info-card {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 1px;

  margin-bottom: 36px;

  overflow: hidden;

  border: 1px solid #e1e8f0;
  border-radius: 12px;

  background: #e1e8f0;

  box-shadow: 0 8px 24px rgba(11, 31, 56, 0.04);
}

.business-info-item {
  min-height: 88px;

  padding: 18px;

  background: #ffffff;
}

.card-label {
  display: block;

  margin-bottom: 7px;

  color: #718096;

  font-size: 7px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.business-info-item strong {
  color: #132945;

  font-size: 11px;
}

.status-badge {
  display: inline-flex;

  padding: 5px 9px;

  color: #237b58;

  background: #eaf8f2;

  border-radius: 999px;

  font-size: 8px;
  font-weight: 800;
}

/* ============================================================
   SECTION HEADINGS
============================================================ */

.section-heading {
  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 17px;
}

.section-heading h2 {
  margin: 0;

  color: #0b1f38;

  font-size: 21px;

  letter-spacing: -0.03em;
}

.account-count {
  color: #718096;

  font-size: 9px;
  font-weight: 700;
}

.accounts-section {
  margin-bottom: 40px;
}

/* ============================================================
   ACCOUNT CARDS
============================================================ */

.accounts-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 15px;
}

.account-card {
  padding: 20px;

  border: 1px solid #e1e8f0;
  border-radius: 13px;

  background: #ffffff;

  box-shadow: 0 8px 24px rgba(11, 31, 56, 0.045);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.account-card:hover {
  transform: translateY(-2px);

  border-color: #c7dceb;

  box-shadow: 0 14px 32px rgba(11, 31, 56, 0.075);
}

.account-card-top {
  display: flex;

  align-items: center;
  justify-content: space-between;
}

.account-icon {
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #1597ff;

  background: #edf7ff;

  border-radius: 10px;
}

.account-status {
  padding: 4px 8px;

  color: #718096;

  background: #f1f4f7;

  border-radius: 999px;

  font-size: 7px;
  font-weight: 800;
}

.account-status.active {
  color: #237b58;

  background: #eaf8f2;
}

.account-type {
  margin-top: 20px;

  color: #718096;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.account-balance {
  margin-top: 7px;
}

.account-balance span {
  display: block;

  color: #718096;

  font-size: 8px;
}

.account-balance strong {
  display: block;

  margin-top: 5px;

  color: #0b1f38;

  font-size: 24px;

  letter-spacing: -0.04em;
}

.account-footer {
  display: flex;

  justify-content: space-between;

  gap: 15px;

  margin-top: 20px;
  padding-top: 14px;

  border-top: 1px solid #e1e8f0;
}

.account-footer span {
  display: block;

  margin-bottom: 4px;

  color: #718096;

  font-size: 6px;
  font-weight: 800;

  letter-spacing: 0.08em;
}

.account-footer strong {
  color: #132945;

  font-size: 8px;
}

/* ============================================================
   QUICK ACTIONS
============================================================ */

.quick-actions-section {
  margin-top: 10px;
}

.quick-actions {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 13px;
}

.quick-action {
  width: 100%;
  min-height: 72px;

  padding: 13px;

  display: flex;

  align-items: center;

  gap: 11px;

  color: #132945;

  text-align: left;

  border: 1px solid #e1e8f0;
  border-radius: 11px;

  background: #ffffff;

  cursor: pointer;

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.quick-action:hover {
  transform: translateY(-1px);

  border-color: #b8d9f2;

  background: #ffffff;

  box-shadow: 0 8px 22px rgba(11, 31, 56, 0.06);
}

.quick-action:active {
  transform: translateY(0);
}

.quick-action-icon {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #1597ff;

  background: #edf7ff;

  border-radius: 9px;

  transition:
    color 0.18s ease,
    background 0.18s ease;
}

.quick-action:hover .quick-action-icon {
  color: #ffffff;

  background: #1597ff;
}

.quick-action-content {
  flex: 1;
}

.quick-action-content strong {
  display: block;

  color: #132945;

  font-size: 10px;
}

.quick-action-content span {
  display: block;

  margin-top: 3px;

  color: #718096;

  font-size: 7px;
}

/* ============================================================
   LOADING / ERROR / EMPTY
============================================================ */

.state-card,
.empty-card {
  padding: 45px 25px;

  text-align: center;

  border: 1px solid #e1e8f0;
  border-radius: 13px;

  background: #ffffff;

  box-shadow: 0 8px 24px rgba(11, 31, 56, 0.04);
}

.state-card h3,
.empty-card h3 {
  margin: 0;

  color: #132945;

  font-size: 15px;
}

.state-card p,
.empty-card p {
  color: #718096;

  font-size: 10px;
  line-height: 1.6;
}

.state-icon,
.empty-icon {
  width: 44px;
  height: 44px;

  margin: 0 auto 13px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #1597ff;

  background: #edf7ff;

  border-radius: 50%;

  font-weight: 900;
}

.error-state .state-icon {
  color: #b34a4a;

  background: #fff0f0;
}

.primary-button {
  min-height: 40px;

  margin-top: 13px;

  padding: 0 17px;

  color: #ffffff;

  border: 0;
  border-radius: 8px;

  background: #1597ff;

  font-size: 9px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.primary-button:hover {
  background: #0d6fbd;

  transform: translateY(-1px);
}

.primary-button:active {
  transform: translateY(0);
}

/* ============================================================
   LOADER
============================================================ */

.loader {
  width: 30px;
  height: 30px;

  margin: 0 auto 15px;

  border: 3px solid #dbeaf5;

  border-top-color: #1597ff;

  border-radius: 50%;

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

@media (max-width: 950px) {
  .business-info-card {
    grid-template-columns: repeat(2, 1fr);
  }

  .accounts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .dashboard-introduction {
    flex-direction: column;
  }

  .back-link {
    width: 100%;
  }

  .business-info-card {
    grid-template-columns: 1fr;
  }

  .accounts-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-introduction h1 {
    font-size: 24px;
  }
}
</style>
