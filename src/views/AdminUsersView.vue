<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BankingShell from '../components/BankingShell.vue'
import {
  Users,
  X,
  Search,
  UserCheck,
  UserX,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MoreHorizontal,
  Mail,
  CalendarDays,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

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
  roles?: Role[]
  createdAt: string
}

interface PaginatedUsers {
  content: User[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const users = ref<User[]>([])

const loading = ref(true)
const refreshing = ref(false)
const errorMessage = ref('')


const searchQuery = ref(
  typeof route.query.search === 'string'
    ? route.query.search
    : '',
)
const roleFilter = ref('')

const currentPage = ref(0)
const pageSize = ref(10)

const totalElements = ref(0)
const totalPages = ref(0)

const changingStatusId = ref<number | null>(null)

/*
|--------------------------------------------------------------------------
| Current administrator
|--------------------------------------------------------------------------
*/

const currentUser = ref<User | null>(null)


/*
|--------------------------------------------------------------------------
| Statistics calculated from currently loaded users
|--------------------------------------------------------------------------
*/

const activeUsersOnPage = computed(() => {
  return users.value.filter((user) => user.enabled).length
})


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

function getAccessToken(): string | null {
  return (
    localStorage.getItem('adminAccessToken') ||
    sessionStorage.getItem('adminAccessToken')
  )
}

function logout() {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('user')
  localStorage.removeItem('adminUser')

  sessionStorage.removeItem('adminAccessToken')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('adminUser')

  router.push('/admin/login')
}

/*
|--------------------------------------------------------------------------
| Load current administrator
|--------------------------------------------------------------------------
*/

async function loadCurrentUser(): Promise<boolean> {
  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      logout()
      return false
    }

    if (response.status === 403) {
      errorMessage.value =
        'You do not have permission to access the administration area.'
      return false
    }

    if (!response.ok) {
      throw new Error('Could not load your profile.')
    }

    const result = await response.json()

    if (!result?.data?.user) {
      throw new Error('The server returned no user profile.')
    }

    currentUser.value = result.data.user

    return true
  } catch (error) {
    console.error('Failed to load current user:', error)

    throw error
  }
}

/*
|--------------------------------------------------------------------------
| Load users
|--------------------------------------------------------------------------
*/

async function loadUsers() {
  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const params = new URLSearchParams()

    params.set('page', String(currentPage.value))
    params.set('size', String(pageSize.value))

    /*
     * Spring's Pageable supports sorting.
     *
     * We request newest users first.
     */
    params.set('sort', 'createdAt,desc')

    /*
     * The backend supports roleName as a request parameter.
     */
    if (roleFilter.value) {
      params.set('roleName', roleFilter.value)
    }

    const response = await fetch(
      `${API_BASE_URL}/api/users/admin/all?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 401) {
      logout()
      return
    }

    if (response.status === 403) {
      errorMessage.value =
        'You do not have permission to view the users administration page.'
      return
    }

    if (!response.ok) {
      throw new Error('Could not load users.')
    }

    const result = await response.json()

    if (!result?.data) {
      throw new Error('The server returned no user data.')
    }

    const page: PaginatedUsers = result.data

    users.value = Array.isArray(page.content) ? page.content : []

    totalElements.value = Number(page.totalElements ?? 0)
    totalPages.value = Number(page.totalPages ?? 0)

    currentPage.value = Number(page.number ?? currentPage.value)
  } catch (error) {
    console.error('Failed to load users:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading users.'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
|
| The backend search endpoint accepts:
|
| GET /api/users/admin/search?email=...
|
| or
|
| GET /api/users/admin/search?accountNumber=...
|
| Because the current UI does not have a separate account-number
| input, this search box currently searches by email.
|
| We will extend this later when we build account management.
|--------------------------------------------------------------------------
*/

async function searchUsers() {
  const query = searchQuery.value.trim()

  if (!query) {
    currentPage.value = 0
    await loadUsers()
    return
  }

  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const params = new URLSearchParams()

    params.set('email', query)

    const response = await fetch(
      `${API_BASE_URL}/api/users/admin/search?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 401) {
      logout()
      return
    }

    if (response.status === 403) {
      errorMessage.value =
        'You do not have permission to search users.'
      return
    }

    if (response.status === 404) {
      users.value = []
      totalElements.value = 0
      totalPages.value = 0
      return
    }

    if (!response.ok) {
      throw new Error('Could not search users.')
    }

    const result = await response.json()

    /*
     * The backend returns UserWithAccountDto for this endpoint.
     *
     * We only need the user portion for this page.
     */
    const searchedUser = result?.data?.user ?? result?.data

    if (!searchedUser) {
      users.value = []
      totalElements.value = 0
      totalPages.value = 0
      return
    }

    users.value = [searchedUser]
    totalElements.value = 1
    totalPages.value = 1
    currentPage.value = 0
  } catch (error) {
    console.error('Failed to search users:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while searching users.'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Clear search
|--------------------------------------------------------------------------
*/

async function clearSearch() {
  if (!searchQuery.value) {
    return
  }

  searchQuery.value = ''
  currentPage.value = 0

  await loadUsers()
}

/*
|--------------------------------------------------------------------------
| Role filter
|--------------------------------------------------------------------------
*/

async function handleRoleFilterChange() {
  currentPage.value = 0

  /*
   * If a search is active, clear it before using the paginated
   * role-filter endpoint.
   */
  if (searchQuery.value) {
    searchQuery.value = ''
  }

  await loadUsers()
}

/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

async function goToPage(page: number) {
  if (
    page < 0 ||
    page >= totalPages.value ||
    page === currentPage.value ||
    searchQuery.value
  ) {
    return
  }

  currentPage.value = page

  await loadUsers()
}

async function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    await goToPage(currentPage.value + 1)
  }
}

async function previousPage() {
  if (currentPage.value > 0) {
    await goToPage(currentPage.value - 1)
  }
}

/*
|--------------------------------------------------------------------------
| Page numbers
|--------------------------------------------------------------------------
*/

const visiblePages = computed(() => {
  const pages: number[] = []

  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 0; i < total; i += 1) {
      pages.push(i)
    }

    return pages
  }

  pages.push(0)

  if (current > 3) {
    pages.push(-1)
  }

  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  if (current < total - 4) {
    pages.push(-1)
  }

  pages.push(total - 1)

  return pages
})

/*
|--------------------------------------------------------------------------
| Toggle user status
|--------------------------------------------------------------------------
*/

async function toggleUserStatus(user: User) {
  if (changingStatusId.value !== null) {
    return
  }

  const token = getAccessToken()

  if (!token) {
    await router.push('/admin/login')
    return
  }

  changingStatusId.value = user.id
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/admin/toggle-status/${user.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 401) {
      logout()
      return
    }

    if (response.status === 403) {
      errorMessage.value =
        'You do not have permission to change user status.'
      return
    }

    if (!response.ok) {
      let message = 'Could not change user status.'

      try {
        const result = await response.json()

        if (result?.message) {
          message = result.message
        }
      } catch {
        // Ignore invalid error JSON.
      }

      throw new Error(message)
    }

    /*
     * Update the local row immediately.
     */
    user.enabled = !user.enabled
  } catch (error) {
    console.error('Failed to change user status:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while changing user status.'
  } finally {
    changingStatusId.value = null
  }
}

/*
|--------------------------------------------------------------------------
| Refresh
|--------------------------------------------------------------------------
*/

async function refreshUsers() {
  if (refreshing.value) {
    return
  }

  refreshing.value = true

  if (searchQuery.value) {
    await searchUsers()
    return
  }

  await loadUsers()
}

/*
|--------------------------------------------------------------------------
| Formatting helpers
|--------------------------------------------------------------------------
*/

function formatDate(date: string): string {
  if (!date) {
    return '—'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

function getUserRole(user: User): string {
  if (!user.roles || user.roles.length === 0) {
    return 'CUSTOMER'
  }

  return user.roles[0]?.name || 'CUSTOMER'
}

function isAdminUser(user: User): boolean {
  return user.roles?.some((role) => role.name === 'ADMIN') ?? false
}


/*
|--------------------------------------------------------------------------
| Initial load
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  try {
    const authenticated = await loadCurrentUser()

    if (!authenticated) {
      loading.value = false
      return
    }

    /*
     * The router guard and backend ADMIN authority protect this route.
     * The separate admin session is already authenticated at this point.
     */

    await loadUsers()
  } catch (error) {
    console.error('Failed to initialize users page:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong while loading the users page.'

    loading.value = false
  }
})
</script>

<template>
  <BankingShell
    :admin="true"
    :user="currentUser || undefined"
    page-title="Users"
    page-section="ADMINISTRATION"
  >
    <section class="admin-content">
      <!-- Page introduction -->
      <section class="page-introduction">
        <div>
          <span class="section-kicker">USER MANAGEMENT</span>

          <h2>Manage users</h2>

          <p>
            Review registered users, account access and
            administrative roles.
          </p>
        </div>

        <div class="user-summary">
          <div class="summary-item">
            <span>Total users</span>
            <strong>{{ totalElements }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span>On this page</span>
            <strong>{{ users.length }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span>Active</span>
            <strong>{{ activeUsersOnPage }}</strong>
          </div>
        </div>
      </section>

      <!-- Error -->
      <div
        v-if="errorMessage && !loading"
        class="error-banner"
      >
        <div class="error-banner-icon">
          <ShieldCheck :size="18" />
        </div>

        <div>
          <strong>Something went wrong</strong>
          <span>{{ errorMessage }}</span>
        </div>

        <button
          type="button"
          @click="loadUsers"
        >
          Try again
        </button>
      </div>

      <!-- Toolbar -->
      <section class="users-toolbar">
        <form
          class="search-box"
          @submit.prevent="searchUsers"
        >
          <Search :size="18" />

          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search by email..."
            aria-label="Search users by email"
          />

          <button
            v-if="searchQuery"
            type="button"
            class="clear-search"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <X :size="15" />
          </button>
        </form>

        <div class="toolbar-actions">
          <label class="filter-control">
            <span>Role</span>

            <select
              v-model="roleFilter"
              @change="handleRoleFilterChange"
            >
              <option value="">All roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </label>

          <button
            type="button"
            class="refresh-button"
            :disabled="refreshing"
            @click="refreshUsers"
          >
            <RefreshCw
              :size="16"
              :class="{ spinning: refreshing }"
            />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      <!-- Loading -->
      <section
        v-if="loading"
        class="table-loading"
      >
        <div class="loading-spinner"></div>

        <h3>Loading users</h3>

        <p>
          Retrieving the latest user information...
        </p>
      </section>

      <!-- Users table -->
      <section
        v-else
        class="users-panel"
      >
        <div class="table-header">
          <div>
            <span class="panel-kicker">REGISTERED USERS</span>
            <h3>User directory</h3>
          </div>

          <span class="result-count">
              {{ totalElements }}
              {{ totalElements === 1 ? 'user' : 'users' }}
            </span>
        </div>

        <!-- Empty -->
        <div
          v-if="users.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">
            <Users :size="25" />
          </div>

          <h3>No users found</h3>

          <p>
            No users match the current search or filter.
          </p>

          <button
            v-if="searchQuery || roleFilter"
            type="button"
            @click="
                searchQuery = '';
                roleFilter = '';
                currentPage = 0;
                loadUsers()
              "
          >
            Clear filters
          </button>
        </div>

        <!-- Desktop table -->
        <div
          v-else
          class="table-wrapper"
        >
          <table class="users-table">
            <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th class="actions-column">Action</th>
            </tr>
            </thead>

            <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
            >
              <!-- User -->
              <td>
                <div class="user-cell">
                  <div class="user-avatar">
                    {{
                      `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`
                        .toUpperCase()
                    }}
                  </div>

                  <div class="user-details">
                    <strong>
                      {{ user.firstName }} {{ user.lastName }}
                    </strong>

                    <span>
                          <Mail :size="12" />
                          {{ user.email }}
                        </span>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td>
                    <span
                      class="role-badge"
                      :class="{
                        'admin-role': isAdminUser(user),
                      }"
                    >
                      <ShieldCheck
                        v-if="isAdminUser(user)"
                        :size="13"
                      />

                      <UserCheck
                        v-else
                        :size="13"
                      />

                      {{ getUserRole(user) }}
                    </span>
              </td>

              <!-- Status -->
              <td>
                    <span
                      class="status-badge"
                      :class="{
                        active: user.enabled,
                        inactive: !user.enabled,
                      }"
                    >
                      <span class="status-dot"></span>

                      {{
                        user.enabled
                          ? 'Active'
                          : 'Inactive'
                      }}
                    </span>
              </td>

              <!-- Created -->
              <td>
                <div class="date-cell">
                  <CalendarDays :size="14" />
                  <span>{{ formatDate(user.createdAt) }}</span>
                </div>
              </td>

              <!-- Action -->
              <td class="actions-column">
                <button
                  type="button"
                  class="status-action"
                  :class="{
                        deactivate: user.enabled,
                        activate: !user.enabled,
                      }"
                  :disabled="changingStatusId === user.id"
                  @click="toggleUserStatus(user)"
                >
                  <RefreshCw
                    v-if="changingStatusId === user.id"
                    :size="14"
                    class="spinning"
                  />

                  <UserX
                    v-else-if="user.enabled"
                    :size="14"
                  />

                  <UserCheck
                    v-else
                    :size="14"
                  />

                  <span>
                        {{
                      changingStatusId === user.id
                        ? 'Updating...'
                        : user.enabled
                          ? 'Deactivate'
                          : 'Activate'
                    }}
                      </span>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="users.length > 0 && totalPages > 1 && !searchQuery"
          class="pagination"
        >
          <div class="pagination-info">
            Showing
            <strong>
              {{ currentPage * pageSize + 1 }}
            </strong>
            –
            <strong>
              {{
                Math.min(
                  (currentPage + 1) * pageSize,
                  totalElements,
                )
              }}
            </strong>
            of
            <strong>{{ totalElements }}</strong>
          </div>

          <div class="pagination-controls">
            <button
              type="button"
              :disabled="currentPage === 0"
              aria-label="Previous page"
              @click="previousPage"
            >
              <ChevronLeft :size="17" />
            </button>

            <template
              v-for="(page, index) in visiblePages"
              :key="`${page}-${index}`"
            >
                <span
                  v-if="page === -1"
                  class="pagination-ellipsis"
                >
                  <MoreHorizontal :size="16" />
                </span>

              <button
                v-else
                type="button"
                :class="{
                    active: page === currentPage,
                  }"
                @click="goToPage(page)"
              >
                {{ page + 1 }}
              </button>
            </template>

            <button
              type="button"
              :disabled="currentPage >= totalPages - 1"
              aria-label="Next page"
              @click="nextPage"
            >
              <ChevronRight :size="17" />
            </button>
          </div>
        </div>
      </section>

      <!-- Information note -->
      <div class="management-note">
        <ShieldCheck :size="17" />

        <div>
          <strong>Administrative access</strong>

          <span>
              User status changes are performed through the
              protected administration API.
            </span>
        </div>
      </div>
    </section>
  </BankingShell>
</template>

<style scoped>
* {
  box-sizing: border-box;
}


/* ============================================
   SIDEBAR
============================================ */



.logo-text strong {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.logo-text span {
  color: #73859a;
  font-size: 11px;
  margin-top: 4px;
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


/* ============================================
   MAIN
============================================ */



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


/* ============================================
   CONTENT
============================================ */

.admin-content {
  padding: 34px 39px 55px;
  max-width: 1500px;
}

.page-introduction {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 25px;
}

.section-kicker,
.panel-kicker {
  color: #5680a7;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.page-introduction h2 {
  margin: 7px 0 6px;
  color: #12304f;
  font-size: 27px;
  line-height: 1.2;
  letter-spacing: -0.7px;
}

.page-introduction p {
  margin: 0;
  color: #77899d;
  font-size: 12px;
  line-height: 1.7;
}

.user-summary {
  min-height: 69px;
  padding: 12px 17px;
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  min-width: 76px;
}

.summary-item span {
  color: #91a0b0;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

.summary-item strong {
  margin-top: 5px;
  color: #183652;
  font-size: 17px;
  font-weight: 780;
}

.summary-divider {
  width: 1px;
  height: 31px;
  background: #e8eef4;
}

/* ============================================
   ERROR
============================================ */

.error-banner {
  margin-bottom: 18px;
  padding: 13px 15px;
  border: 1px solid #f0dada;
  border-radius: 12px;
  background: #fff8f8;
  display: flex;
  align-items: center;
  gap: 11px;
}

.error-banner-icon {
  width: 33px;
  height: 33px;
  border-radius: 9px;
  background: #fdecec;
  color: #c75858;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-banner > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.error-banner strong {
  color: #8c3f3f;
  font-size: 10px;
}

.error-banner span {
  margin-top: 3px;
  color: #a46e6e;
  font-size: 9px;
}

.error-banner button {
  border: 0;
  background: transparent;
  color: #a04a4a;
  font-size: 9px;
  font-weight: 750;
  cursor: pointer;
}

/* ============================================
   TOOLBAR
============================================ */

.users-toolbar {
  min-height: 68px;
  padding: 11px;
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 17px;
}

.search-box {
  min-width: 280px;
  max-width: 510px;
  flex: 1;
  height: 43px;
  border: 1px solid #e1e9f1;
  border-radius: 10px;
  background: #fbfdff;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  color: #91a0b0;
}

.search-box:focus-within {
  border-color: #a8c5df;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.06);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #263f58;
  font-family: inherit;
  font-size: 11px;
}

.search-box input::placeholder {
  color: #a0adba;
}

.clear-search {
  width: 25px;
  height: 25px;
  border: 0;
  border-radius: 7px;
  background: #edf2f7;
  color: #71869a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 9px;
}

.filter-control {
  height: 43px;
  padding: 0 10px 0 12px;
  border: 1px solid #e1e9f1;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 9px;
}

.filter-control span {
  color: #8b9aaa;
  font-size: 9px;
  font-weight: 700;
}

.filter-control select {
  border: 0;
  outline: 0;
  background: transparent;
  color: #38516a;
  font-family: inherit;
  font-size: 10px;
  font-weight: 650;
  cursor: pointer;
}

.refresh-button {
  height: 43px;
  padding: 0 13px;
  border: 1px solid #e1e9f1;
  border-radius: 10px;
  background: #ffffff;
  color: #526b83;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.refresh-button:hover {
  color: #07559b;
  background: #f7faff;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ============================================
   TABLE
============================================ */

.users-panel {
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 15px;
  overflow: hidden;
}

.table-header {
  min-height: 77px;
  padding: 19px 22px;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-header h3 {
  margin: 5px 0 0;
  color: #183652;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.2px;
}

.result-count {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  background: #f3f7fb;
  color: #71859a;
  display: flex;
  align-items: center;
  font-size: 9px;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
}

.users-table th {
  height: 44px;
  padding: 0 20px;
  background: #fbfdff;
  border-bottom: 1px solid #edf1f5;
  color: #91a0b0;
  text-align: left;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.users-table td {
  height: 78px;
  padding: 10px 20px;
  border-bottom: 1px solid #eef2f6;
  color: #526a81;
  font-size: 10px;
}

.users-table tbody tr:last-child td {
  border-bottom: 0;
}

.users-table tbody tr {
  transition: background 0.15s ease;
}

.users-table tbody tr:hover {
  background: #fbfdff;
}

.actions-column {
  text-align: right !important;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #eaf3fb;
  color: #07559b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-details strong {
  color: #29445e;
  font-size: 10px;
  font-weight: 750;
}

.user-details span {
  margin-top: 5px;
  color: #91a0b0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 8px;
  white-space: nowrap;
}

.role-badge {
  min-height: 27px;
  padding: 0 9px;
  border-radius: 14px;
  background: #edf6fc;
  color: #39729e;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.role-badge.admin-role {
  background: #f2eef9;
  color: #765ca3;
}

.status-badge {
  min-height: 27px;
  padding: 0 9px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 8px;
  font-weight: 750;
}

.status-badge.active {
  background: #edf8f4;
  color: #438c6e;
}

.status-badge.inactive {
  background: #f3f5f7;
  color: #82909d;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #71859a;
}

.status-action {
  min-height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
  font-size: 8px;
  font-weight: 750;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.status-action.deactivate {
  border: 1px solid #f0dddd;
  background: #fff8f8;
  color: #b35a5a;
}

.status-action.deactivate:hover {
  background: #fdeeee;
}

.status-action.activate {
  border: 1px solid #d9eee5;
  background: #f3faf7;
  color: #468b70;
}

.status-action.activate:hover {
  background: #eaf7f1;
}

.status-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ============================================
   EMPTY STATE
============================================ */

.empty-state {
  min-height: 330px;
  padding: 45px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.empty-icon {
  width: 55px;
  height: 55px;
  border-radius: 15px;
  background: #edf4fa;
  color: #5b83a6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state h3 {
  margin: 17px 0 6px;
  color: #28445f;
  font-size: 15px;
}

.empty-state p {
  margin: 0;
  color: #91a0b0;
  font-size: 10px;
}

.empty-state button {
  margin-top: 17px;
  border: 0;
  border-radius: 8px;
  background: #07559b;
  color: #ffffff;
  padding: 9px 14px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

/* ============================================
   LOADING
============================================ */

.table-loading {
  min-height: 460px;
  background: #ffffff;
  border: 1px solid #e5edf5;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.loading-spinner {
  width: 37px;
  height: 37px;
  border: 3px solid #e4edf5;
  border-top-color: #07559b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.table-loading h3 {
  margin: 18px 0 6px;
  color: #183652;
  font-size: 16px;
}

.table-loading p {
  margin: 0;
  color: #91a0b0;
  font-size: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinning {
  animation: spin 0.8s linear infinite;
}

/* ============================================
   PAGINATION
============================================ */

.pagination {
  min-height: 68px;
  padding: 13px 20px;
  border-top: 1px solid #edf1f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.pagination-info {
  color: #91a0b0;
  font-size: 9px;
}

.pagination-info strong {
  color: #526b83;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-controls button {
  min-width: 31px;
  height: 31px;
  padding: 0 7px;
  border: 1px solid #e3eaf1;
  border-radius: 8px;
  background: #ffffff;
  color: #657b91;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

.pagination-controls button:hover:not(:disabled) {
  background: #f4f8fc;
  color: #07559b;
}

.pagination-controls button.active {
  border-color: #07559b;
  background: #07559b;
  color: #ffffff;
}

.pagination-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-ellipsis {
  width: 28px;
  height: 31px;
  color: #9aa8b5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============================================
   NOTE
============================================ */

.management-note {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 11px;
  background: #f6f9fc;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #07559b;
}

.management-note div {
  display: flex;
  flex-direction: column;
}

.management-note strong {
  color: #3b5670;
  font-size: 9px;
}

.management-note span {
  margin-top: 3px;
  color: #8c9aa8;
  font-size: 8px;
  line-height: 1.45;
}

/* ============================================
   TABLET
============================================ */

@media (max-width: 1000px) {
  .page-introduction {
    align-items: flex-start;
    flex-direction: column;
  }

  .user-summary {
    width: 100%;
  }

  .users-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    max-width: none;
  }

  .toolbar-actions {
    justify-content: space-between;
  }
}

/* ============================================
   MOBILE SIDEBAR
============================================ */

@media (max-width: 850px) {

  .admin-content {
    padding: 29px 22px 45px;
  }
}

/* ============================================
   MOBILE
============================================ */

@media (max-width: 600px) {

  .admin-header h1 {
    font-size: 20px;
  }


  .admin-content {
    padding: 24px 15px 40px;
  }

  .page-introduction h2 {
    font-size: 23px;
  }

  .page-introduction p {
    font-size: 10px;
  }

  .user-summary {
    padding: 11px;
    gap: 10px;
    justify-content: space-between;
  }

  .summary-item {
    min-width: 0;
    flex: 1;
  }

  .summary-item strong {
    font-size: 15px;
  }

  .summary-divider {
    height: 27px;
  }

  .toolbar-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-control,
  .refresh-button {
    width: 100%;
  }

  .filter-control {
    justify-content: space-between;
  }

  .refresh-button {
    justify-content: center;
  }

  .table-header {
    padding: 17px;
  }

  .pagination {
    align-items: flex-start;
    flex-direction: column;
    padding: 13px 17px;
  }

  .pagination-controls {
    width: 100%;
    justify-content: flex-end;
  }

  .management-note {
    margin-top: 13px;
  }
}

@media (min-width: 851px) {

}
</style>







