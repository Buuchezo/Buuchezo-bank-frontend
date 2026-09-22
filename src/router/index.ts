import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import AccountsView from '../views/AccountsView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import TransfersView from '../views/TransfersView.vue'
import CardsView from '../views/CardsView.vue'
import SettingsView from '../views/SettingsView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminUsersView from '@/views/AdminUsersView.vue'
import AdminAccountsView from '@/views/AdminAccountsView.vue'
import AdminTransactionsView from '@/views/AdminTransactionsView.vue'
import InvestmentsView from '@/views/InvestmentsView.vue'
import MarketDataView from '@/views/MarketDataView.vue'
import AdminCardApplicationsView from '@/views/AdminCardApplicationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        guestOnly: true,
      },
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/accounts',
      name: 'accounts',
      component: AccountsView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/transfers',
      name: 'transfers',
      component: TransfersView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/cards',
      name: 'cards',
      component: CardsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/investments',
      name: 'investments',
      component: InvestmentsView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/market',
      name: 'market',
      component: MarketDataView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/accounts',
      name: 'admin-accounts',
      component: AdminAccountsView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/transactions',
      name: 'admin-transactions',
      component: AdminTransactionsView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/admin/card-applications',
      name: 'admin-card-applications',
      component: AdminCardApplicationsView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
})

/*
|--------------------------------------------------------------------------
| Authentication / Authorization Guard
|--------------------------------------------------------------------------
|
| This runs before every route navigation.
|
| requiresAuth:
|   The user must have an access token.
|
| guestOnly:
|   Logged-in users should not visit login/register.
|
| requiresAdmin:
|   The logged-in user must have the ADMIN role.
|
*/

router.beforeEach((to) => {
  const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

  const isAuthenticated = Boolean(accessToken)

  /*
   * ------------------------------------------------------------
   * 1. Protect authenticated routes
   * ------------------------------------------------------------
   */

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  /*
   * ------------------------------------------------------------
   * 2. Prevent authenticated users from going back to
   *    login/register
   * ------------------------------------------------------------
   */

  if (to.meta.guestOnly && isAuthenticated) {
    return {
      name: 'dashboard',
    }
  }

  /*
   * ------------------------------------------------------------
   * 3. Protect administrator routes
   * ------------------------------------------------------------
   */

  if (to.meta.requiresAdmin) {
    if (!storedUser) {
      return {
        name: 'dashboard',
      }
    }

    try {
      const user = JSON.parse(storedUser)

      const isAdmin =
        Array.isArray(user.roles) &&
        user.roles.some((role: { name?: string }) => role?.name === 'ADMIN')

      if (!isAdmin) {
        return {
          name: 'dashboard',
        }
      }
    } catch (error) {
      console.error('Could not read stored user information:', error)

      return {
        name: 'dashboard',
      }
    }
  }

  return true
})

export default router
