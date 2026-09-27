<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { RefreshCw, ShieldCheck, Trash2, UserPlus } from 'lucide-vue-next'

import BankingShell from '@/components/BankingShell.vue'
import {
  addBusinessMember,
  type Business,
  type BusinessMembership,
  getBusinessMembers,
  getMyBusinesses,
  removeBusinessMember,
  updateBusinessMemberRole
} from '@/service/businessService.ts'

type BusinessRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'EMPLOYEE' | 'VIEWER'

const business = ref<Business | null>(null)
const members = ref<BusinessMembership[]>([])

const loading = ref(true)
const refreshing = ref(false)
const submitting = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const showAddMember = ref(false)

const memberEmail = ref('')
const memberRole = ref<BusinessRole>('EMPLOYEE')

const editingMemberId = ref<number | null>(null)
const editingRole = ref<BusinessRole>('EMPLOYEE')

const availableRoles: BusinessRole[] = ['ADMIN', 'ACCOUNTANT', 'EMPLOYEE', 'VIEWER']

const businessId = computed(() => business.value?.id ?? null)

const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => {
    if (a.role === 'OWNER') return -1
    if (b.role === 'OWNER') return 1

    return a.userEmail.localeCompare(b.userEmail)
  })
})

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

function formatDate(value?: string) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function roleLabel(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

function roleClass(role: string) {
  return `role-${role.toLowerCase()}`
}

async function loadMembers(showSpinner = true) {
  clearMessages()

  if (showSpinner) {
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

    members.value = await getBusinessMembers(business.value.id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load business members.'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

function openAddMember() {
  clearMessages()

  memberEmail.value = ''
  memberRole.value = 'EMPLOYEE'
  showAddMember.value = true
}

function closeAddMember() {
  if (submitting.value) {
    return
  }

  showAddMember.value = false
}

async function submitAddMember() {
  clearMessages()

  if (!businessId.value) {
    errorMessage.value = 'No business is currently selected.'
    return
  }

  const email = memberEmail.value.trim()

  if (!email) {
    errorMessage.value = 'Please enter the member email address.'
    return
  }

  submitting.value = true

  try {
    const newMember = await addBusinessMember(businessId.value, email, memberRole.value)

    members.value.push(newMember)

    successMessage.value = `${email} has been added to the business.`

    showAddMember.value = false
    memberEmail.value = ''
    memberRole.value = 'EMPLOYEE'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to add the business member.'
  } finally {
    submitting.value = false
  }
}

function startEditing(member: BusinessMembership) {
  clearMessages()

  if (member.role === 'OWNER') {
    return
  }

  editingMemberId.value = member.id
  editingRole.value = member.role as BusinessRole
}

function cancelEditing() {
  editingMemberId.value = null
}

async function saveRole(member: BusinessMembership) {
  clearMessages()

  if (!businessId.value) {
    errorMessage.value = 'No business is currently selected.'
    return
  }

  if (member.role === 'OWNER') {
    return
  }

  submitting.value = true

  try {
    const updatedMember = await updateBusinessMemberRole(
      businessId.value,
      member.id,
      editingRole.value,
    )

    const index = members.value.findIndex((item) => item.id === member.id)

    if (index !== -1) {
      members.value[index] = updatedMember
    }

    successMessage.value = `${member.userEmail}'s role has been updated.`

    editingMemberId.value = null
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to update the member role.'
  } finally {
    submitting.value = false
  }
}

async function deleteMember(member: BusinessMembership) {
  clearMessages()

  if (!businessId.value) {
    errorMessage.value = 'No business is currently selected.'
    return
  }

  if (member.role === 'OWNER') {
    errorMessage.value = 'The business owner cannot be removed.'
    return
  }

  const confirmed = window.confirm(`Remove ${member.userEmail} from this business?`)

  if (!confirmed) {
    return
  }

  submitting.value = true

  try {
    await removeBusinessMember(businessId.value, member.id)

    members.value = members.value.filter((item) => item.id !== member.id)

    successMessage.value = `${member.userEmail} has been removed.`
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to remove the business member.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadMembers()
})
</script>

<template>
  <BankingShell page-section="BUSINESS BANKING" page-title="Team Members">
    <div class="members-page">
      <section class="page-header">
        <div>
          <p class="eyebrow">Business access</p>

          <h2>Team Members</h2>

          <p class="page-description">
            Manage the people who can access and operate this business account.
          </p>

          <p v-if="business" class="business-name">
            {{ business.legalName }}
          </p>
        </div>

        <div class="header-actions">
          <button
            :disabled="loading || refreshing"
            class="secondary-button"
            type="button"
            @click="loadMembers(false)"
          >
            <RefreshCw :class="{ spinning: refreshing }" :size="16" />
            Refresh
          </button>

          <button class="primary-button" type="button" @click="openAddMember">
            <UserPlus :size="16" />
            Add member
          </button>
        </div>
      </section>

      <div v-if="successMessage" class="message success-message">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="message error-message">
        {{ errorMessage }}
      </div>

      <section class="members-card">
        <div class="card-header">
          <div>
            <h3>Members</h3>
            <span>
              {{ members.length }}
              {{ members.length === 1 ? 'member' : 'members' }}
            </span>
          </div>

          <ShieldCheck :size="20" />
        </div>

        <div v-if="loading" class="loading-state">
          <RefreshCw :size="20" class="spinning" />
          <span>Loading members...</span>
        </div>

        <div v-else-if="members.length === 0" class="empty-state">
          <UsersIcon :size="30" />
          <h4>No members found</h4>
          <p>Add a team member to give someone access to this business.</p>
        </div>

        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Added</th>
                <th class="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="member in sortedMembers" :key="member.id">
                <td>
                  <div class="member-info">
                    <div class="member-avatar">
                      {{ member.userEmail.charAt(0).toUpperCase() }}
                    </div>

                    <div>
                      <strong>{{ member.userEmail }}</strong>

                      <small v-if="member.role === 'OWNER'"> Business owner </small>
                    </div>
                  </div>
                </td>

                <td>
                  <div v-if="editingMemberId === member.id" class="role-editor">
                    <select v-model="editingRole">
                      <option v-for="role in availableRoles" :key="role" :value="role">
                        {{ roleLabel(role) }}
                      </option>
                    </select>

                    <button :disabled="submitting" type="button" @click="saveRole(member)">
                      Save
                    </button>

                    <button :disabled="submitting" type="button" @click="cancelEditing">
                      Cancel
                    </button>
                  </div>

                  <span v-else :class="roleClass(member.role)" class="role-badge">
                    {{ roleLabel(member.role) }}
                  </span>
                </td>

                <td>
                  <span :class="member.active ? 'active' : 'inactive'" class="status-badge">
                    {{ member.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="date-cell">
                  {{ formatDate(member.createdAt) }}
                </td>

                <td class="actions-cell">
                  <template v-if="member.role !== 'OWNER'">
                    <button
                      v-if="editingMemberId !== member.id"
                      :disabled="submitting"
                      class="action-button"
                      type="button"
                      @click="startEditing(member)"
                    >
                      Edit role
                    </button>

                    <button
                      :disabled="submitting"
                      aria-label="Remove member"
                      class="delete-button"
                      type="button"
                      @click="deleteMember(member)"
                    >
                      <Trash2 :size="15" />
                    </button>
                  </template>

                  <span v-else class="owner-label"> Owner </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="showAddMember" class="modal-backdrop" @click.self="closeAddMember">
      <section class="modal-card">
        <div class="modal-header">
          <div>
            <p class="eyebrow">Business access</p>
            <h3>Add team member</h3>
          </div>

          <button :disabled="submitting" class="modal-close" type="button" @click="closeAddMember">
            ×
          </button>
        </div>

        <form @submit.prevent="submitAddMember">
          <div class="form-group">
            <label for="member-email"> Email address </label>

            <input
              id="member-email"
              v-model="memberEmail"
              :disabled="submitting"
              autocomplete="email"
              placeholder="employee@example.com"
              type="email"
            />
          </div>

          <div class="form-group">
            <label for="member-role"> Role </label>

            <select id="member-role" v-model="memberRole" :disabled="submitting">
              <option v-for="role in availableRoles" :key="role" :value="role">
                {{ roleLabel(role) }}
              </option>
            </select>
          </div>

          <div class="role-help">
            <strong>{{ roleLabel(memberRole) }}</strong>

            <span v-if="memberRole === 'ADMIN'">
              Administrative access to business operations.
            </span>

            <span v-else-if="memberRole === 'ACCOUNTANT'">
              Access intended for accounting and financial operations.
            </span>

            <span v-else-if="memberRole === 'EMPLOYEE'">
              Standard operational business access.
            </span>

            <span v-else> Read-oriented business access. </span>
          </div>

          <div class="modal-actions">
            <button
              :disabled="submitting"
              class="secondary-button"
              type="button"
              @click="closeAddMember"
            >
              Cancel
            </button>

            <button :disabled="submitting" class="primary-button" type="submit">
              <RefreshCw v-if="submitting" :size="15" class="spinning" />

              <UserPlus v-else :size="15" />

              {{ submitting ? 'Adding...' : 'Add member' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </BankingShell>
</template>

<style scoped>
.members-page {
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

.business-name {
  margin: 8px 0 0;
  color: #132945;
  font-size: 11px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 9px;
  flex-shrink: 0;
}

.primary-button,
.secondary-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 14px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.primary-button {
  border: 1px solid #0d6fbd;
  background: #0d6fbd;
  color: #ffffff;
}

.primary-button:hover:not(:disabled) {
  background: #095d9f;
}

.secondary-button {
  border: 1px solid #dce5ee;
  background: #ffffff;
  color: #52657d;
}

.secondary-button:hover:not(:disabled) {
  border-color: #bcd9ed;
  color: #0d6fbd;
}

.primary-button:disabled,
.secondary-button:disabled {
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

.members-card {
  overflow: hidden;
  border: 1px solid #e3eaf1;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(11, 31, 56, 0.04);
}

.card-header {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e8eef4;
}

.card-header h3 {
  margin: 0 0 3px;
  color: #132945;
  font-size: 13px;
  font-weight: 750;
}

.card-header span {
  color: #8a98a9;
  font-size: 9px;
}

.card-header > svg {
  color: #0d6fbd;
}

.loading-state,
.empty-state {
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #8a98a9;
}

.empty-state h4 {
  margin: 5px 0 0;
  color: #132945;
  font-size: 13px;
}

.empty-state p {
  max-width: 350px;
  margin: 0;
  text-align: center;
  font-size: 10px;
  line-height: 1.5;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 12px 18px;
  background: #f8fafc;
  color: #8290a1;
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-align: left;
  text-transform: uppercase;
}

td {
  padding: 15px 18px;
  border-top: 1px solid #edf1f5;
  color: #52657d;
  font-size: 10px;
  vertical-align: middle;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #eaf5fd;
  color: #0d6fbd;
  font-size: 10px;
  font-weight: 800;
}

.member-info strong {
  display: block;
  color: #132945;
  font-size: 10px;
  font-weight: 700;
}

.member-info small {
  display: block;
  margin-top: 3px;
  color: #8a98a9;
  font-size: 8px;
}

.role-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 750;
}

.role-owner {
  background: #e9f2ff;
  color: #245f9e;
}

.role-admin {
  background: #f0eaff;
  color: #6942a8;
}

.role-accountant {
  background: #e8f8f1;
  color: #207553;
}

.role-employee {
  background: #f1f4f7;
  color: #52657d;
}

.role-viewer {
  background: #fff5df;
  color: #966b1d;
}

.status-badge.active {
  background: #e9f8ef;
  color: #247447;
}

.status-badge.inactive {
  background: #fff0f0;
  color: #a33a3a;
}

.date-cell {
  white-space: nowrap;
  color: #7d8b9b;
}

.actions-column,
.actions-cell {
  text-align: right;
}

.actions-cell {
  white-space: nowrap;
}

.action-button {
  min-height: 30px;
  margin-right: 6px;
  padding: 0 9px;
  border: 1px solid #dce5ee;
  border-radius: 6px;
  background: #ffffff;
  color: #52657d;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

.action-button:hover:not(:disabled) {
  border-color: #bcd9ed;
  color: #0d6fbd;
}

.delete-button {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0dada;
  border-radius: 6px;
  background: #fff8f8;
  color: #b24a4a;
  cursor: pointer;
}

.delete-button:hover:not(:disabled) {
  background: #fff0f0;
}

.delete-button:disabled,
.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.owner-label {
  color: #8a98a9;
  font-size: 9px;
  font-weight: 650;
}

.role-editor {
  display: flex;
  align-items: center;
  gap: 5px;
}

.role-editor select {
  height: 30px;
  padding: 0 7px;
  border: 1px solid #dce5ee;
  border-radius: 6px;
  background: #ffffff;
  color: #132945;
  font-family: inherit;
  font-size: 9px;
}

.role-editor button {
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: #0d6fbd;
  color: #ffffff;
  font-family: inherit;
  font-size: 8px;
  font-weight: 700;
  cursor: pointer;
}

.role-editor button:last-child {
  background: #eef2f6;
  color: #52657d;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(7, 22, 39, 0.48);
  backdrop-filter: blur(3px);
}

.modal-card {
  width: min(100%, 460px);
  padding: 24px;
  border-radius: 13px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(7, 22, 39, 0.22);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  color: #132945;
  font-size: 18px;
  font-weight: 750;
}

.modal-close {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: #f3f6f9;
  color: #52657d;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  color: #52657d;
  font-size: 9px;
  font-weight: 750;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #dce5ee;
  border-radius: 7px;
  outline: none;
  background: #ffffff;
  color: #132945;
  font-family: inherit;
  font-size: 10px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #72b9e6;
  box-shadow: 0 0 0 3px rgba(21, 151, 255, 0.08);
}

.role-help {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 22px;
  padding: 11px;
  border-radius: 7px;
  background: #f7fafc;
}

.role-help strong {
  color: #132945;
  font-size: 9px;
}

.role-help span {
  color: #7d8b9b;
  font-size: 8px;
  line-height: 1.45;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .modal-card {
    padding: 18px;
  }

  .members-card {
    border-radius: 9px;
  }
}
</style>
