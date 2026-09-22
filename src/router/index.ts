import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
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

    /*
     * ------------------------------------------------------------
     * CUSTOMER AUTHENTICATION
     * ------------------------------------------------------------
     */

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

    /*
     * ------------------------------------------------------------
     * ADMIN AUTHENTICATION
     * ------------------------------------------------------------
     */

    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
    },

    /*
     * ------------------------------------------------------------
     * CUSTOMER ROUTES
     * ------------------------------------------------------------
     */

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
      path: '/market',
      name: 'market',
      component: MarketDataView,
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

    /*
     * ------------------------------------------------------------
     * ADMIN ROUTES
     * ------------------------------------------------------------
     *
     * These routes use the ADMIN authentication session.
     *
     * They do NOT use:
     *
     *   accessToken
     *   user.roles
     *
     * They require:
     *
     *   adminAccessToken
     *
     */

    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: {
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: {
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/accounts',
      name: 'admin-accounts',
      component: AdminAccountsView,
      meta: {
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/transactions',
      name: 'admin-transactions',
      component: AdminTransactionsView,
      meta: {
        requiresAdmin: true,
      },
    },

    {
      path: '/admin/card-applications',
      name: 'admin-card-applications',
      component: AdminCardApplicationsView,
      meta: {
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
| CUSTOMER SESSION
| ----------------
| accessToken
| user
|
| ADMIN SESSION
| --------------
| adminAccessToken
| adminUser
|
| The two sessions are intentionally independent.
|
*/

router.beforeEach((to) => {
  /*
   * ------------------------------------------------------------
   * CUSTOMER SESSION
   * ------------------------------------------------------------
   */

  const customerAccessToken =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken')

  const customerAuthenticated = Boolean(customerAccessToken)

  /*
   * ------------------------------------------------------------
   * ADMIN SESSION
   * ------------------------------------------------------------
   */

  const adminAccessToken =
    localStorage.getItem('adminAccessToken') ||
    sessionStorage.getItem('adminAccessToken')

  const adminAuthenticated = Boolean(adminAccessToken)

  /*
   * ------------------------------------------------------------
   * 1. ADMIN ROUTES
   * ------------------------------------------------------------
   *
   * Admin routes are protected ONLY by the admin token.
   *
   * A customer JWT is not sufficient.
   *
   */

  if (to.meta.requiresAdmin) {
    if (!adminAuthenticated) {
      return {
        name: 'admin-login',
        query: {
          redirect: to.fullPath,
        },
      }
    }

    return true
  }

  /*
   * ------------------------------------------------------------
   * 2. CUSTOMER ROUTES
   * ------------------------------------------------------------
   */

  if (to.meta.requiresAuth && !customerAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  /*
   * ------------------------------------------------------------
   * 3. CUSTOMER GUEST ROUTES
   * ------------------------------------------------------------
   *
   * A customer session should prevent the customer from
   * unnecessarily returning to the customer login/register page.
   *
   * An ADMIN session alone does NOT count as a customer session.
   */

  if (to.meta.guestOnly && customerAuthenticated) {
    return {
      name: 'dashboard',
    }
  }

  /*
   * ------------------------------------------------------------
   * 4. ADMIN LOGIN
   * ------------------------------------------------------------
   *
   * An existing customer session does NOT prevent an admin
   * from visiting /admin/login.
   *
   * This is intentional because the same person may have:
   *
   *   customer session + admin session
   *
   * simultaneously.
   */

  if (to.name === 'admin-login' && adminAuthenticated) {
    return {
      name: 'admin-dashboard',
    }
  }

  return true
})

export default router
