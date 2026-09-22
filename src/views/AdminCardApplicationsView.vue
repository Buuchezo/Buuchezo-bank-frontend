<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
  XCircle
} from 'lucide-vue-next'

import {
  approveCardApplication,
  type CardApplication,
  getAllCardApplications,
  rejectCardApplication
} from '../service/cardApplicationService'
import { activateCard, blockCard, cancelCard, type Card, getAllCards } from '../service/cardService'

const router = useRouter()

const applications = ref<CardApplication[]>([])
const loading = ref(true)
const errorMessage = ref('')
const mobileMenuOpen = ref(false)

const actionLoadingId = ref<number | null>(null)

const rejectModalOpen = ref(false)
const selectedApplication = ref<CardApplication | null>(null)
const rejectionReason = ref('')
const rejectionError = ref('')

const approvalModalOpen = ref(false)
const cardActionModalOpen = ref(false)
const selectedCard = ref<Card | null>(null)
const cardAction = ref<'BLOCK' | 'ACTIVATE' | 'CANCEL' | null>(null)
const cardActionError = ref('')
const cardsByApplicationId = ref<Record<number, Card | null>>({})

const searchQuery = ref('')
const statusFilter = ref<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')

function getAccessToken(): string | null {
  return localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken')
}

function logout() {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('user')

  sessionStorage.removeItem('adminAccessToken')
  sessionStorage.removeItem('user')

  router.push('/admin/login')
}

const currentUser = computed(() => {
  const storedUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser')

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
})

const fullName = computed(() => {
  if (!currentUser.value) {
    return 'Administrator'
  }

  return `${currentUser.value.firstName || ''} ${currentUser.value.lastName || ''}`.trim()
})

const initials = computed(() => {
  if (!currentUser.value) {
    return 'A'
  }

  const first = currentUser.value.firstName?.charAt(0) || ''
  const last = currentUser.value.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase() || 'A'
})

const filteredApplications = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return applications.value.filter((application) => {
    const matchesStatus =
      statusFilter.value === 'ALL' || application.applicationStatus === statusFilter.value

    if (!matchesStatus) {
      return false
    }

    if (!query) {
      return true
    }

    return (
      application.applicantEmail.toLowerCase().includes(query) ||
      application.accountNumber.toLowerCase().includes(query) ||
      application.holderName.toLowerCase().includes(query) ||
      application.cardType.toLowerCase().includes(query)
    )
  })
})

const pendingCount = computed(
  () =>
    applications.value.filter((application) => application.applicationStatus === 'PENDING').length,
)

const approvedCount = computed(
  () =>
    applications.value.filter((application) => application.applicationStatus === 'APPROVED').length,
)

const rejectedCount = computed(
  () =>
    applications.value.filter((application) => application.applicationStatus === 'REJECTED').length,
)

async function loadApplications() {
  loading.value = true
  errorMessage.value = ''

  const token = getAccessToken()

  if (!token) {
    router.push('/admin/login')
    return
  }

  try {
    const [result, cards] = await Promise.all([getAllCardApplications(), getAllCards()])

    applications.value = result

    const cardMap: Record<number, Card | null> = {}

    for (const application of result) {
      if (application.applicationStatus === 'APPROVED' && application.cardId !== null) {
        const card = cards.find((item) => Number(item.id) === Number(application.cardId))

        cardMap[application.id] = card ?? null
      }
    }

    cardsByApplicationId.value = cardMap

    console.log('ADMIN APPLICATIONS:', result)
    console.log('ADMIN CARDS:', cards)
    console.log('CARD MAP:', cardMap)
  } catch (error) {
    console.error('Failed to load card applications:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Could not load card applications.'
  } finally {
    loading.value = false
  }
}

async function loadCardForApplication(application: CardApplication) {
  if (application.applicationStatus !== 'APPROVED' || !application.cardId) {
    return
  }

  try {
    const cards = await getAllCards()
    cardsByApplicationId.value[application.id] =
      cards.find((item) => item.id === application.cardId) ?? null
  } catch (error) {
    console.error(`Failed to load card ${application.cardId}:`, error)
    cardsByApplicationId.value[application.id] = null
  }
}

function openApprovalModal(application: CardApplication) {
  if (actionLoadingId.value !== null) {
    return
  }

  selectedApplication.value = application
  cardActionError.value = ''
  approvalModalOpen.value = true
}

function closeApprovalModal() {
  if (actionLoadingId.value !== null) {
    return
  }

  approvalModalOpen.value = false
  selectedApplication.value = null
  cardActionError.value = ''
}

async function submitApproval() {
  if (!selectedApplication.value || actionLoadingId.value !== null) {
    return
  }

  const application = selectedApplication.value
  actionLoadingId.value = application.id
  cardActionError.value = ''
  errorMessage.value = ''

  try {
    const updatedApplication = await approveCardApplication(application.id)
    const index = applications.value.findIndex((item) => item.id === application.id)

    if (index !== -1) {
      applications.value[index] = updatedApplication
    }

    approvalModalOpen.value = false
    selectedApplication.value = null

    await loadCardForApplication(updatedApplication)
  } catch (error) {
    console.error('Failed to approve card application:', error)
    cardActionError.value =
      error instanceof Error ? error.message : 'Could not approve the card application.'
  } finally {
    actionLoadingId.value = null
  }
}

function openCardActionModal(
  application: CardApplication,
  action: 'BLOCK' | 'ACTIVATE' | 'CANCEL',
) {
  if (actionLoadingId.value !== null) {
    return
  }

  const card = cardsByApplicationId.value[application.id]

  if (!card) {
    errorMessage.value = 'The card information could not be loaded. Please refresh and try again.'
    return
  }

  selectedApplication.value = application
  selectedCard.value = card
  cardAction.value = action
  cardActionError.value = ''
  cardActionModalOpen.value = true
}

function closeCardActionModal() {
  if (actionLoadingId.value !== null) {
    return
  }

  cardActionModalOpen.value = false
  selectedCard.value = null
  cardAction.value = null
  selectedApplication.value = null
  cardActionError.value = ''
}

const cardActionTitle = computed(() => {
  if (cardAction.value === 'BLOCK') return 'Freeze card'
  if (cardAction.value === 'ACTIVATE') return 'Unfreeze card'
  if (cardAction.value === 'CANCEL') return 'Cancel card'
  return 'Card action'
})

const cardActionButtonLabel = computed(() => {
  if (actionLoadingId.value !== null) {
    if (cardAction.value === 'BLOCK') return 'Freezing...'
    if (cardAction.value === 'ACTIVATE') return 'Unfreezing...'
    if (cardAction.value === 'CANCEL') return 'Cancelling...'
  }

  if (cardAction.value === 'BLOCK') return 'Freeze card'
  if (cardAction.value === 'ACTIVATE') return 'Unfreeze card'
  if (cardAction.value === 'CANCEL') return 'Cancel card'
  return 'Confirm'
})

const cardActionDescription = computed(() => {
  if (cardAction.value === 'BLOCK') {
    return 'The card will be frozen and cannot be used until an administrator activates it again.'
  }

  if (cardAction.value === 'ACTIVATE') {
    return 'The card will be unfrozen and returned to active status so it can be used again.'
  }

  if (cardAction.value === 'CANCEL') {
    return 'This permanently cancels the card. A cancelled card cannot be activated again.'
  }

  return ''
})

async function submitCardAction() {
  if (!selectedApplication.value || !selectedCard.value || !cardAction.value) {
    return
  }

  if (actionLoadingId.value !== null) {
    return
  }

  const application = selectedApplication.value
  const card = selectedCard.value
  const action = cardAction.value

  actionLoadingId.value = application.id
  cardActionError.value = ''
  errorMessage.value = ''

  try {
    let updatedCard: Card

    if (action === 'BLOCK') {
      updatedCard = await blockCard(card.id)
    } else if (action === 'ACTIVATE') {
      updatedCard = await activateCard(card.id)
    } else {
      updatedCard = await cancelCard(card.id)
    }

    cardsByApplicationId.value[application.id] = updatedCard
    cardActionModalOpen.value = false
    selectedCard.value = null
    cardAction.value = null
    selectedApplication.value = null
  } catch (error) {
    console.error(`Failed to ${action.toLowerCase()} card:`, error)
    cardActionError.value =
      error instanceof Error ? error.message : 'Could not update the card status.'
  } finally {
    actionLoadingId.value = null
  }
}

function openRejectModal(application: CardApplication) {
  selectedApplication.value = application
  rejectionReason.value = ''
  rejectionError.value = ''
  rejectModalOpen.value = true
}

function closeRejectModal() {
  if (actionLoadingId.value !== null) {
    return
  }

  rejectModalOpen.value = false
  selectedApplication.value = null
  rejectionReason.value = ''
  rejectionError.value = ''
}

async function submitRejection() {
  if (!selectedApplication.value) {
    return
  }

  const reason = rejectionReason.value.trim()

  if (!reason) {
    rejectionError.value = 'Please provide a rejection reason.'
    return
  }

  if (actionLoadingId.value !== null) {
    return
  }

  actionLoadingId.value = selectedApplication.value.id
  rejectionError.value = ''
  errorMessage.value = ''

  try {
    const updatedApplication = await rejectCardApplication(selectedApplication.value.id, reason)

    const index = applications.value.findIndex((item) => item.id === selectedApplication.value?.id)

    if (index !== -1) {
      applications.value[index] = updatedApplication
    }

    closeRejectModal()
  } catch (error) {
    console.error('Failed to reject card application:', error)

    rejectionError.value =
      error instanceof Error ? error.message : 'Could not reject the card application.'
  } finally {
    actionLoadingId.value = null
  }
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getStatusLabel(status: CardApplication['applicationStatus']): string {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

onMounted(() => {
  loadApplications()
})
</script>

<template>
  <div class="admin-layout">
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="mobileMenuOpen = false"></div>

    <aside :class="{ 'sidebar-open': mobileMenuOpen }" class="admin-sidebar">
      <div class="sidebar-top">
        <RouterLink class="admin-logo" to="/">
          <span class="logo-mark">B</span>

          <div class="logo-text">
            <strong>Buuchezo</strong>
            <span>Bank</span>
          </div>
        </RouterLink>

        <button class="mobile-close" type="button" @click="mobileMenuOpen = false">
          <X :size="22" />
        </button>

        <nav class="admin-navigation">
          <p class="navigation-label">ADMINISTRATION</p>

          <RouterLink class="admin-nav-link" to="/admin/dashboard" @click="mobileMenuOpen = false">
            <LayoutDashboard :size="19" />
            <span>Overview</span>
          </RouterLink>

          <RouterLink class="admin-nav-link" to="/admin/users" @click="mobileMenuOpen = false">
            <Users :size="19" />
            <span>Users</span>
          </RouterLink>

          <RouterLink class="admin-nav-link" to="/admin/accounts" @click="mobileMenuOpen = false">
            <WalletCards :size="19" />
            <span>Accounts</span>
          </RouterLink>

          <RouterLink
            class="admin-nav-link"
            to="/admin/transactions"
            @click="mobileMenuOpen = false"
          >
            <ArrowLeftRight :size="19" />
            <span>Transactions</span>
          </RouterLink>

          <RouterLink
            class="admin-nav-link active"
            to="/admin/card-applications"
            @click="mobileMenuOpen = false"
          >
            <CreditCard :size="19" />
            <span>Card Applications</span>

            <span v-if="pendingCount > 0" class="nav-count-badge">
              {{ pendingCount }}
            </span>
          </RouterLink>

          <p class="navigation-label second-label">SYSTEM</p>

          <RouterLink class="admin-nav-link" to="/settings" @click="mobileMenuOpen = false">
            <Settings :size="19" />
            <span>Settings</span>
          </RouterLink>
        </nav>
      </div>

      <div class="sidebar-bottom">
        <div class="admin-support">
          <div class="support-icon">
            <ShieldCheck :size="18" />
          </div>

          <div>
            <strong>Admin Area</strong>
            <span>Secure access</span>
          </div>
        </div>

        <button class="logout-button" type="button" @click="logout">
          <LogOut :size="18" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <button class="mobile-menu-button" type="button" @click="mobileMenuOpen = true">
            <Menu :size="23" />
          </button>

          <div>
            <span class="page-overline">ADMINISTRATION</span>
            <h1>Card Applications</h1>
          </div>
        </div>

        <div class="header-right">
          <button
            class="header-icon-button"
            title="Refresh"
            type="button"
            @click="loadApplications"
          >
            <RefreshCw :size="18" />
          </button>

          <div class="header-profile">
            <div class="profile-avatar">
              {{ initials }}
            </div>

            <div class="profile-info">
              <strong>{{ fullName }}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </header>

      <section class="admin-content">
        <section class="welcome-section">
          <div>
            <span class="section-kicker">CARD MANAGEMENT</span>

            <h2>Customer card applications</h2>

            <p>Review customer requests and approve or reject card applications.</p>
          </div>

          <div class="system-status">
            <span class="status-pulse"></span>
            <span>Secure administration</span>
          </div>
        </section>

        <section class="statistics-grid">
          <article class="stat-card primary-stat">
            <div class="stat-card-top">
              <div class="stat-icon">
                <Clock3 :size="21" />
              </div>

              <span class="stat-label">PENDING</span>
            </div>

            <div class="stat-value">
              {{ pendingCount }}
            </div>

            <div class="stat-footer">
              <span>Awaiting review</span>
              <Clock3 :size="15" />
            </div>
          </article>

          <article class="stat-card">
            <div class="stat-card-top">
              <div class="stat-icon green-icon">
                <CheckCircle2 :size="21" />
              </div>

              <span class="stat-label">APPROVED</span>
            </div>

            <div class="stat-value">
              {{ approvedCount }}
            </div>

            <div class="stat-footer">
              <span>Approved applications</span>
              <CheckCircle2 :size="15" />
            </div>
          </article>

          <article class="stat-card">
            <div class="stat-card-top">
              <div class="stat-icon red-icon">
                <XCircle :size="21" />
              </div>

              <span class="stat-label">REJECTED</span>
            </div>

            <div class="stat-value">
              {{ rejectedCount }}
            </div>

            <div class="stat-footer">
              <span>Rejected applications</span>
              <XCircle :size="15" />
            </div>
          </article>

          <article class="stat-card">
            <div class="stat-card-top">
              <div class="stat-icon purple-icon">
                <CreditCard :size="21" />
              </div>

              <span class="stat-label">TOTAL</span>
            </div>

            <div class="stat-value">
              {{ applications.length }}
            </div>

            <div class="stat-footer">
              <span>All applications</span>
              <CreditCard :size="15" />
            </div>
          </article>
        </section>

        <section class="applications-panel">
          <div class="panel-heading">
            <div>
              <span class="panel-kicker">APPLICATION REVIEW</span>
              <h3>Card applications</h3>
            </div>

            <CreditCard :size="20" />
          </div>

          <div class="toolbar">
            <div class="search-wrapper">
              <Search :size="17" />

              <input
                v-model="searchQuery"
                placeholder="Search applicant, account or card type..."
                type="search"
              />
            </div>

            <div class="filter-buttons">
              <button
                :class="{ selected: statusFilter === 'ALL' }"
                type="button"
                @click="statusFilter = 'ALL'"
              >
                All
              </button>

              <button
                :class="{ selected: statusFilter === 'PENDING' }"
                type="button"
                @click="statusFilter = 'PENDING'"
              >
                Pending
              </button>

              <button
                :class="{ selected: statusFilter === 'APPROVED' }"
                type="button"
                @click="statusFilter = 'APPROVED'"
              >
                Approved
              </button>

              <button
                :class="{ selected: statusFilter === 'REJECTED' }"
                type="button"
                @click="statusFilter = 'REJECTED'"
              >
                Rejected
              </button>
            </div>
          </div>

          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>

            <h2>Loading applications</h2>

            <p>Retrieving customer card applications...</p>
          </div>

          <div v-else-if="errorMessage" class="error-state">
            <div class="error-icon">
              <ShieldCheck :size="25" />
            </div>

            <h2>Unable to load applications</h2>

            <p>{{ errorMessage }}</p>

            <button class="retry-button" type="button" @click="loadApplications">Try again</button>
          </div>

          <div v-else-if="filteredApplications.length === 0" class="empty-state">
            <div class="empty-icon">
              <CreditCard :size="27" />
            </div>

            <h2>No applications found</h2>

            <p>
              {{
                searchQuery || statusFilter !== 'ALL'
                  ? 'No applications match your current search or filter.'
                  : 'There are currently no card applications.'
              }}
            </p>
          </div>

          <div v-else class="applications-table-wrapper">
            <table class="applications-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Account</th>
                  <th>Card</th>
                  <th>Holder</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="application in filteredApplications" :key="application.id">
                  <td>
                    <div class="applicant-cell">
                      <div class="applicant-avatar">
                        {{
                          application.holderName
                            .split(' ')
                            .map((part) => part.charAt(0))
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        }}
                      </div>

                      <div class="applicant-info">
                        <strong>{{ application.holderName }}</strong>
                        <span>{{ application.applicantEmail }}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="account-number">
                      {{ application.accountNumber }}
                    </span>
                  </td>

                  <td>
                    <span class="card-type">
                      <CreditCard :size="14" />
                      {{ application.cardType }}
                    </span>

                    <span
                      v-if="
                        application.applicationStatus === 'APPROVED' &&
                        cardsByApplicationId[application.id]
                      "
                      :class="`card-status-badge ${cardsByApplicationId[application.id]?.cardStatus.toLowerCase()}`"
                    >
                      <span class="card-status-dot"></span>
                      {{ cardsByApplicationId[application.id]?.cardStatus }}
                    </span>

                    <span
                      v-if="
                        application.applicationStatus === 'APPROVED' &&
                        application.cardId &&
                        !cardsByApplicationId[application.id]
                      "
                      class="card-status-loading"
                    >
                      Card information unavailable
                    </span>
                  </td>

                  <td>
                    <span class="holder-name">
                      {{ application.holderName }}
                    </span>
                  </td>

                  <td>
                    <span :class="application.applicationStatus.toLowerCase()" class="status-badge">
                      <span class="status-dot"></span>
                      {{ getStatusLabel(application.applicationStatus) }}
                    </span>

                    <span
                      v-if="
                        application.applicationStatus === 'REJECTED' && application.rejectionReason
                      "
                      :title="application.rejectionReason"
                      class="rejection-preview"
                    >
                      {{ application.rejectionReason }}
                    </span>

                    <span
                      v-if="application.applicationStatus === 'APPROVED' && application.cardId"
                      class="card-created"
                    >
                      Card #{{ application.cardId }}
                    </span>
                  </td>

                  <td>
                    <span class="date-cell">
                      {{ formatDate(application.createdAt) }}
                    </span>
                  </td>

                  <td>
                    <div v-if="application.applicationStatus === 'PENDING'" class="action-buttons">
                      <button
                        :disabled="actionLoadingId === application.id"
                        class="approve-button"
                        type="button"
                        @click="openApprovalModal(application)"
                      >
                        <CheckCircle2 :size="15" />
                        {{ actionLoadingId === application.id ? 'Processing...' : 'Approve' }}
                      </button>

                      <button
                        :disabled="actionLoadingId === application.id"
                        class="reject-button"
                        type="button"
                        @click="openRejectModal(application)"
                      >
                        <XCircle :size="15" />
                        Reject
                      </button>
                    </div>

                    <div
                      v-else-if="
                        application.applicationStatus === 'APPROVED' &&
                        cardsByApplicationId[application.id]
                      "
                      class="action-buttons card-management-actions"
                    >
                      <button
                        v-if="cardsByApplicationId[application.id]?.cardStatus === 'ACTIVE'"
                        :disabled="actionLoadingId === application.id"
                        class="freeze-button"
                        type="button"
                        @click="openCardActionModal(application, 'BLOCK')"
                      >
                        <Lock :size="15" />
                        Freeze
                      </button>

                      <button
                        v-else-if="cardsByApplicationId[application.id]?.cardStatus === 'BLOCKED'"
                        :disabled="actionLoadingId === application.id"
                        class="activate-button"
                        type="button"
                        @click="openCardActionModal(application, 'ACTIVATE')"
                      >
                        <CheckCircle2 :size="15" />
                        Unfreeze
                      </button>

                      <button
                        v-if="cardsByApplicationId[application.id]?.cardStatus !== 'CANCELLED'"
                        :disabled="actionLoadingId === application.id"
                        class="cancel-card-button"
                        type="button"
                        @click="openCardActionModal(application, 'CANCEL')"
                      >
                        <XCircle :size="15" />
                        Cancel
                      </button>
                    </div>

                    <span
                      v-else-if="application.applicationStatus === 'APPROVED'"
                      class="completed-action"
                    >
                      Card unavailable
                    </span>

                    <span v-else class="completed-action">
                      Reviewed
                      <ChevronRight :size="14" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>

    <div v-if="approvalModalOpen" class="modal-backdrop" @click.self="closeApprovalModal">
      <div class="action-modal">
        <div class="modal-header">
          <div>
            <span class="panel-kicker">APPLICATION REVIEW</span>
            <h3>Approve card application</h3>
          </div>

          <button class="modal-close" type="button" @click="closeApprovalModal">
            <X :size="19" />
          </button>
        </div>

        <div v-if="selectedApplication" class="modal-application">
          <div class="modal-card-icon">
            <CreditCard :size="20" />
          </div>

          <div>
            <strong>{{ selectedApplication.holderName }}</strong>
            <span>
              {{ selectedApplication.cardType }} · {{ selectedApplication.accountNumber }}
            </span>
          </div>
        </div>

        <p class="modal-description">
          Approving this application will create an active card for this customer.
        </p>

        <p v-if="cardActionError" class="modal-error">{{ cardActionError }}</p>

        <div class="modal-actions">
          <button
            :disabled="actionLoadingId !== null"
            class="cancel-button"
            type="button"
            @click="closeApprovalModal"
          >
            Cancel
          </button>

          <button
            :disabled="actionLoadingId !== null"
            class="confirm-approve-button"
            type="button"
            @click="submitApproval"
          >
            <CheckCircle2 :size="16" />
            {{ actionLoadingId !== null ? 'Approving...' : 'Approve application' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="cardActionModalOpen" class="modal-backdrop" @click.self="closeCardActionModal">
      <div class="action-modal">
        <div class="modal-header">
          <div>
            <span class="panel-kicker">CARD MANAGEMENT</span>
            <h3>{{ cardActionTitle }}</h3>
          </div>

          <button class="modal-close" type="button" @click="closeCardActionModal">
            <X :size="19" />
          </button>
        </div>

        <div v-if="selectedApplication && selectedCard" class="modal-application">
          <div class="modal-card-icon">
            <CreditCard :size="20" />
          </div>

          <div>
            <strong>{{ selectedApplication.holderName }}</strong>
            <span>
              {{ selectedCard.cardType }} · Card #{{ selectedCard.id }} ·
              {{ selectedCard.cardStatus }}
            </span>
          </div>
        </div>

        <p class="modal-description">{{ cardActionDescription }}</p>

        <p v-if="cardActionError" class="modal-error">{{ cardActionError }}</p>

        <div class="modal-actions">
          <button
            :disabled="actionLoadingId !== null"
            class="cancel-button"
            type="button"
            @click="closeCardActionModal"
          >
            Cancel
          </button>

          <button
            :class="{
              'confirm-freeze-button': cardAction === 'BLOCK',
              'confirm-activate-button': cardAction === 'ACTIVATE',
              'confirm-cancel-button': cardAction === 'CANCEL',
            }"
            :disabled="actionLoadingId !== null"
            class="card-action-confirm-button"
            type="button"
            @click="submitCardAction"
          >
            <XCircle v-if="cardAction === 'CANCEL'" :size="16" />
            <Lock v-else-if="cardAction === 'BLOCK'" :size="16" />
            <CheckCircle2 v-else :size="16" />
            {{ cardActionButtonLabel }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="rejectModalOpen" class="modal-backdrop" @click.self="closeRejectModal">
      <div class="reject-modal">
        <div class="modal-header">
          <div>
            <span class="panel-kicker">APPLICATION REVIEW</span>
            <h3>Reject card application</h3>
          </div>

          <button class="modal-close" type="button" @click="closeRejectModal">
            <X :size="19" />
          </button>
        </div>

        <div v-if="selectedApplication" class="modal-application">
          <div class="modal-card-icon">
            <CreditCard :size="20" />
          </div>

          <div>
            <strong>{{ selectedApplication.holderName }}</strong>
            <span>
              {{ selectedApplication.cardType }} ·
              {{ selectedApplication.accountNumber }}
            </span>
          </div>
        </div>

        <label class="field-label" for="rejectionReason"> Rejection reason </label>

        <textarea
          id="rejectionReason"
          v-model="rejectionReason"
          maxlength="500"
          placeholder="Enter the reason for rejecting this application..."
          rows="5"
        ></textarea>

        <div class="character-count">{{ rejectionReason.length }}/500</div>

        <p v-if="rejectionError" class="modal-error">
          {{ rejectionError }}
        </p>

        <div class="modal-actions">
          <button
            :disabled="actionLoadingId !== null"
            class="cancel-button"
            type="button"
            @click="closeRejectModal"
          >
            Cancel
          </button>

          <button
            :disabled="actionLoadingId !== null"
            class="confirm-reject-button"
            type="button"
            @click="submitRejection"
          >
            <XCircle :size="16" />

            {{ actionLoadingId !== null ? 'Rejecting...' : 'Reject application' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-layout {
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

.admin-sidebar {
  width: 258px;
  min-width: 258px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e6edf5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 26px 18px 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar-top {
  width: 100%;
}

.admin-logo {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: #0b2848;
  margin-bottom: 43px;
  padding: 0 7px;
}

.logo-mark {
  width: 39px;
  height: 39px;
  border-radius: 11px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-text strong {
  font-size: 15px;
  font-weight: 800;
}

.logo-text span {
  color: #73859a;
  font-size: 11px;
  margin-top: 4px;
}

.mobile-close {
  display: none;
}

.navigation-label {
  padding: 0 12px;
  margin: 0 0 11px;
  color: #9aa9ba;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.second-label {
  margin-top: 31px;
}

.admin-navigation {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.admin-nav-link {
  min-height: 47px;
  padding: 0 13px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  color: #6c7e91;
  font-size: 13px;
  font-weight: 650;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.admin-nav-link:hover {
  background: #f2f7fc;
  color: #07559b;
}

.admin-nav-link.active {
  background: #eaf3fb;
  color: #07559b;
  font-weight: 750;
}

.nav-count-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: auto;
  border-radius: 10px;
  background: #07559b;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.admin-support {
  border: 1px solid #e5edf5;
  border-radius: 13px;
  padding: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fbfdff;
}

.support-icon {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-support div:last-child {
  display: flex;
  flex-direction: column;
}

.admin-support strong {
  font-size: 11px;
  color: #1d3652;
}

.admin-support span {
  margin-top: 3px;
  color: #91a0b0;
  font-size: 9px;
}

.logout-button {
  border: 0;
  background: transparent;
  min-height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #7d8d9e;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  border-radius: 10px;
  text-align: left;
}

.logout-button:hover {
  background: #f6f8fb;
  color: #d14e4e;
}

.admin-main {
  flex: 1;
  min-width: 0;
}

.admin-header {
  height: 84px;
  background: #ffffff;
  border-bottom: 1px solid #e7edf4;
  padding: 0 39px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-overline {
  color: #8b9bac;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.header-left h1 {
  margin: 4px 0 0;
  color: #12304f;
  font-size: 25px;
  font-weight: 750;
  letter-spacing: -0.7px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 11px;
}

.header-icon-button {
  width: 39px;
  height: 39px;
  border: 1px solid #e4ebf3;
  background: #ffffff;
  color: #60748a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-icon-button:hover {
  color: #07559b;
  background: #f7faff;
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 8px;
}

.profile-avatar {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info strong {
  color: #213a55;
  font-size: 11px;
  font-weight: 750;
}

.profile-info span {
  color: #8a9bad;
  font-size: 9px;
  margin-top: 3px;
}

.mobile-menu-button {
  display: none;
}

.admin-content {
  padding: 34px 39px 55px;
  max-width: 1500px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 29px;
}

.section-kicker,
.panel-kicker {
  color: #5680a7;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.welcome-section h2 {
  margin: 7px 0 6px;
  color: #12304f;
  font-size: 27px;
  line-height: 1.2;
  letter-spacing: -0.7px;
}

.welcome-section p {
  margin: 0;
  color: #77899d;
  font-size: 12px;
  line-height: 1.7;
}

.system-status {
  height: 36px;
  padding: 0 13px;
  border-radius: 18px;
  background: #f0f9f5;
  color: #398267;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pulse {
  width: 7px;
  height: 7px;
  background: #48a47c;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(72, 164, 124, 0.1);
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 17px;
}

.stat-card {
  min-height: 158px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(30, 64, 96, 0.025);
}

.stat-card.primary-stat {
  background: #07559b;
  border-color: #07559b;
  color: #ffffff;
}

.stat-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-stat .stat-icon {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.green-icon {
  color: #3d9472;
  background: #edf8f4;
}

.red-icon {
  color: #c45656;
  background: #fbeeee;
}

.purple-icon {
  color: #755da4;
  background: #f3effa;
}

.stat-label {
  color: #91a0b0;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.primary-stat .stat-label {
  color: rgba(255, 255, 255, 0.68);
}

.stat-value {
  margin-top: 20px;
  color: #183652;
  font-size: 27px;
  line-height: 1;
  font-weight: 780;
  letter-spacing: -0.8px;
}

.primary-stat .stat-value {
  color: #ffffff;
}

.stat-footer {
  margin-top: 15px;
  color: #91a0b0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
}

.primary-stat .stat-footer {
  color: rgba(255, 255, 255, 0.68);
}

.applications-panel {
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 15px;
  padding: 23px;
  box-shadow: 0 4px 16px rgba(30, 64, 96, 0.025);
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #71869c;
}

.panel-heading h3 {
  margin: 5px 0 0;
  color: #183652;
  font-size: 16px;
  font-weight: 750;
}

.toolbar {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.search-wrapper {
  min-width: 280px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e2eaf2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #91a0b0;
  background: #fbfdff;
}

.search-wrapper input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #29445e;
  font-size: 11px;
}

.search-wrapper input::placeholder {
  color: #a2afbc;
}

.filter-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-buttons button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #e2eaf2;
  background: #ffffff;
  color: #7b8da0;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.filter-buttons button:hover {
  border-color: #cbd9e7;
  color: #07559b;
}

.filter-buttons button.selected {
  background: #eaf3fb;
  border-color: #cfe1f1;
  color: #07559b;
}

.applications-table-wrapper {
  margin-top: 22px;
  overflow-x: auto;
}

.applications-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.applications-table th {
  padding: 12px 13px;
  border-bottom: 1px solid #e8eef4;
  color: #91a0b0;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  text-align: left;
  white-space: nowrap;
}

.applications-table td {
  padding: 15px 13px;
  border-bottom: 1px solid #edf1f5;
  vertical-align: middle;
}

.applications-table tbody tr:hover {
  background: #fbfdff;
}

.applicant-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;
}

.applicant-avatar {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
}

.applicant-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.applicant-info strong {
  color: #29445e;
  font-size: 10px;
  white-space: nowrap;
}

.applicant-info span {
  margin-top: 4px;
  color: #91a0b0;
  font-size: 8px;
  white-space: nowrap;
}

.account-number,
.holder-name,
.date-cell {
  color: #536b82;
  font-size: 9px;
  white-space: nowrap;
}

.card-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #536b82;
  font-size: 9px;
  font-weight: 700;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 8px;
  font-size: 8px;
  font-weight: 750;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.pending {
  background: #fff7e8;
  color: #ad762d;
}

.status-badge.pending .status-dot {
  background: #d69a40;
}

.status-badge.approved {
  background: #edf8f4;
  color: #398267;
}

.status-badge.approved .status-dot {
  background: #48a47c;
}

.status-badge.rejected {
  background: #fdf0f0;
  color: #c45656;
}

.status-badge.rejected .status-dot {
  background: #d15b5b;
}

.rejection-preview,
.card-created {
  display: block;
  max-width: 160px;
  margin-top: 5px;
  color: #9aa8b5;
  font-size: 7px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-created {
  color: #4b8b70;
}

.card-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 7px;
  font-weight: 800;
  white-space: nowrap;
}

.card-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.card-status-badge.active {
  background: #edf8f4;
  color: #398267;
}

.card-status-badge.active .card-status-dot {
  background: #48a47c;
}

.card-status-badge.blocked {
  background: #fff7e8;
  color: #ad762d;
}

.card-status-badge.blocked .card-status-dot {
  background: #d69a40;
}

.card-status-badge.cancelled,
.card-status-badge.expired {
  background: #fdf0f0;
  color: #c45656;
}

.card-status-badge.cancelled .card-status-dot,
.card-status-badge.expired .card-status-dot {
  background: #d15b5b;
}

.card-status-loading {
  display: block;
  margin-top: 6px;
  color: #9aa8b5;
  font-size: 7px;
}

.card-management-actions {
  flex-wrap: wrap;
}

.freeze-button,
.activate-button,
.cancel-card-button {
  min-height: 31px;
  padding: 0 9px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 8px;
  font-weight: 750;
  cursor: pointer;
}

.freeze-button {
  border: 1px solid #ead9b8;
  background: #fff8eb;
  color: #ad762d;
}

.freeze-button:hover {
  background: #fff1d7;
}

.activate-button {
  border: 1px solid #cde7da;
  background: #edf8f4;
  color: #398267;
}

.activate-button:hover {
  background: #e2f3eb;
}

.cancel-card-button {
  border: 1px solid #f0d5d5;
  background: #fdf4f4;
  color: #c45656;
}

.cancel-card-button:hover {
  background: #fbeded;
}

.freeze-button:disabled,
.activate-button:disabled,
.cancel-card-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.approve-button,
.reject-button {
  min-height: 31px;
  padding: 0 9px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 8px;
  font-weight: 750;
  cursor: pointer;
}

.approve-button {
  border: 1px solid #cde7da;
  background: #edf8f4;
  color: #398267;
}

.approve-button:hover {
  background: #e2f3eb;
}

.reject-button {
  border: 1px solid #f0d5d5;
  background: #fdf4f4;
  color: #c45656;
}

.reject-button:hover {
  background: #fbeded;
}

.approve-button:disabled,
.reject-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.completed-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #9aa8b5;
  font-size: 8px;
  white-space: nowrap;
}

.loading-state,
.error-state,
.empty-state {
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-spinner {
  width: 38px;
  height: 38px;
  border: 3px solid #e4edf5;
  border-top-color: #07559b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state h2,
.error-state h2,
.empty-state h2 {
  margin: 20px 0 6px;
  color: #183652;
  font-size: 18px;
}

.loading-state p,
.error-state p,
.empty-state p {
  margin: 0;
  max-width: 430px;
  color: #8a9bad;
  font-size: 11px;
  line-height: 1.6;
}

.error-icon,
.empty-icon {
  width: 53px;
  height: 53px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  background: #fdf0f0;
  color: #d15b5b;
}

.empty-icon {
  background: #eaf3fb;
  color: #07559b;
}

.retry-button {
  margin-top: 20px;
  border: 0;
  background: #07559b;
  color: #ffffff;
  border-radius: 9px;
  padding: 11px 19px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(13, 36, 59, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.action-modal,
.reject-modal {
  width: min(500px, 100%);
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(13, 36, 59, 0.2);
}

.modal-description {
  margin: 18px 0 0;
  color: #71869c;
  font-size: 10px;
  line-height: 1.7;
}

.confirm-approve-button,
.card-action-confirm-button {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 9px;
  font-size: 9px;
  font-weight: 750;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.confirm-approve-button,
.confirm-activate-button {
  border: 1px solid #cde7da;
  background: #edf8f4;
  color: #398267;
}

.confirm-freeze-button {
  border: 1px solid #ead9b8;
  background: #fff7e8;
  color: #ad762d;
}

.confirm-cancel-button {
  border: 1px solid #e8caca;
  background: #fdf0f0;
  color: #c45656;
}

.confirm-approve-button:hover,
.confirm-activate-button:hover {
  background: #e2f3eb;
}

.confirm-freeze-button:hover {
  background: #fff0d2;
}

.confirm-cancel-button:hover {
  background: #fbeded;
}

.confirm-approve-button:disabled,
.card-action-confirm-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 5px 0 0;
  color: #183652;
  font-size: 17px;
}

.modal-close {
  width: 34px;
  height: 34px;
  border: 1px solid #e4ebf3;
  border-radius: 9px;
  background: #ffffff;
  color: #708399;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-close:hover {
  background: #f6f9fc;
  color: #c45656;
}

.modal-application {
  margin-top: 21px;
  padding: 13px;
  border: 1px solid #e5edf5;
  border-radius: 11px;
  background: #fbfdff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-card-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-application > div:last-child {
  display: flex;
  flex-direction: column;
}

.modal-application strong {
  color: #29445e;
  font-size: 10px;
}

.modal-application span {
  margin-top: 4px;
  color: #91a0b0;
  font-size: 8px;
}

.field-label {
  display: block;
  margin-top: 20px;
  margin-bottom: 7px;
  color: #526b83;
  font-size: 9px;
  font-weight: 750;
}

.reject-modal textarea {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  padding: 11px;
  border: 1px solid #dfe8f0;
  border-radius: 10px;
  outline: none;
  color: #29445e;
  background: #fbfdff;
  font-family: inherit;
  font-size: 10px;
  line-height: 1.5;
}

.reject-modal textarea:focus {
  border-color: #9ebfdc;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.07);
}

.character-count {
  margin-top: 5px;
  color: #9aa8b5;
  text-align: right;
  font-size: 8px;
}

.modal-error {
  margin-top: 8px !important;
  color: #c45656 !important;
  font-size: 9px !important;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button,
.confirm-reject-button {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 9px;
  font-size: 9px;
  font-weight: 750;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #e1e8ef;
  background: #ffffff;
  color: #71869c;
}

.confirm-reject-button {
  border: 1px solid #e8caca;
  background: #fdf0f0;
  color: #c45656;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cancel-button:disabled,
.confirm-reject-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-wrapper {
    width: 100%;
  }
}

@media (max-width: 850px) {
  .admin-sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    transition: left 0.25s ease;
    box-shadow: 12px 0 30px rgba(20, 48, 78, 0.1);
  }

  .admin-sidebar.sidebar-open {
    left: 0;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(13, 36, 59, 0.35);
    z-index: 90;
  }

  .mobile-close {
    position: absolute;
    top: 24px;
    right: 17px;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 9px;
    background: #f4f7fa;
    color: #6c7e91;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .mobile-menu-button {
    width: 39px;
    height: 39px;
    border: 1px solid #e4ebf3;
    border-radius: 10px;
    background: #ffffff;
    color: #526b83;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .admin-header {
    padding: 0 22px;
  }

  .admin-content {
    padding: 29px 22px 45px;
  }
}

@media (max-width: 600px) {
  .admin-header {
    height: 74px;
    padding: 0 15px;
  }

  .admin-header h1 {
    font-size: 20px;
  }

  .header-profile {
    margin-left: 2px;
  }

  .profile-info {
    display: none;
  }

  .header-icon-button {
    width: 35px;
    height: 35px;
  }

  .profile-avatar {
    width: 35px;
    height: 35px;
  }

  .admin-content {
    padding: 24px 15px 40px;
  }

  .welcome-section {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .welcome-section h2 {
    font-size: 23px;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .applications-panel {
    padding: 17px;
  }

  .filter-buttons {
    width: 100%;
  }

  .filter-buttons button {
    flex: 1;
  }

  .action-modal,
  .reject-modal {
    padding: 19px;
  }
}
</style>


