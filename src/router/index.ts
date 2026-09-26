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
import InvestmentsView from '../views/InvestmentsView.vue'
import MarketDataView from '../views/MarketDataView.vue'
import AdminCardApplicationsView from '@/views/AdminCardApplicationsView.vue'
import CookiesView from '@/components/CookiesView.vue'
import SecurityView from '@/components/SecurityView.vue'
import TermsView from '@/components/TermsView.vue'
import PrivacyView from '@/components/PrivacyView.vue'
import ContactView from '@/components/ContactView.vue'
import SupportView from '@/components/SupportView.vue'
import CareersView from '@/components/CareersView.vue'
import AboutView from '@/components/AboutView.vue'
import BusinessView from '@/views/public/BusinessView.vue'
import WealthView from '@/views/public/WealthView.vue'
import BusinessOnboardingView from '@/views/public/BusinessOnboardingView.vue'
import BusinessDashboardView from '@/views/public/BusinessDashboardView.vue'
import BusinessTransactionsView from '@/views/public/BusinessTransactionsView.vue'
import BusinessTransfersView from '@/views/public/BusinessTransfersView.vue'
import BusinessLoginView from '@/views/public/BusinessLoginView.vue'

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
      path: '/about',
      name: 'about',
      component: AboutView,
    },

    {
      path: '/careers',
      name: 'careers',
      component: CareersView,
    },

    {
      path: '/support',
      name: 'support',
      component: SupportView,
    },

    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },

    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
    },

    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
    },

    {
      path: '/security',
      name: 'security',
      component: SecurityView,
    },

    {
      path: '/cookies',
      name: 'cookies',
      component: CookiesView,
    },
    {
      path: '/business',
      name: 'business',
      component: BusinessView,
    },

    {
      path: '/business/login',
      name: 'business-login',
      component: BusinessLoginView,
      meta: {
        guestOnly: true,
      },
    },

    {
      path: '/business/onboarding',
      name: 'business-onboarding',
      component: BusinessOnboardingView,
    },

    {
      path: '/business/dashboard',
      name: 'business-dashboard',
      component: BusinessDashboardView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/business/transfers',
      component: BusinessTransfersView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/business/transactions',
      component: BusinessTransactionsView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/wealth',
      name: 'wealth',
      component: WealthView,
    },

    /*
     * ------------------------------------------------------------
     * SHARED SETTINGS ROUTE
     * ------------------------------------------------------------
     *
     * Settings can be opened by either:
     *
     *   Customer:
     *     accessToken
     *
     *   Administrator:
     *     adminAccessToken
     *
     * BankingShell determines which navigation/session to display.
     */

    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        requiresAuthOrAdmin: true,
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
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

  const customerAuthenticated = Boolean(customerAccessToken)

  /*
   * ------------------------------------------------------------
   * ADMIN SESSION
   * ------------------------------------------------------------
   */

  const adminAccessToken =
    localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken')

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
   * 2. SHARED AUTHENTICATED ROUTES
   * ------------------------------------------------------------
   *
   * Some pages are intentionally shared between the customer
   * and administrator areas.
   *
   * Currently this is the Settings page.
   *
   * Either authentication session is sufficient.
   */

  if (to.meta.requiresAuthOrAdmin && !customerAuthenticated && !adminAuthenticated) {
    return {
      name: adminAuthenticated ? 'admin-login' : 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  /*
   * ------------------------------------------------------------
   * 3. CUSTOMER ROUTES
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
   * 4. CUSTOMER GUEST ROUTES
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
   * 5. ADMIN LOGIN
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
