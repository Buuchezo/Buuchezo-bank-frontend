<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ArrowUpRight, Menu, X } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

import buuchezoBankLogo from '@/assets/images/buuchezobank-blue-logo.png'

const route = useRoute()

const mobileMenuOpen = ref(false)

const isBusiness = computed(() => route.path.startsWith('/business'))

const loginRoute = computed(() => (isBusiness.value ? '/business/login' : '/login'))

const accountRoute = computed(() => (isBusiness.value ? '/business/onboarding' : '/register'))

const loginLabel = computed(() => (isBusiness.value ? 'Business sign in' : 'Sign in'))

const accountLabel = computed(() =>
  isBusiness.value ? 'Open a Business account' : 'Open an account',
)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="public-header">
    <div class="public-header-inner">
      <!-- LOGO -->
      <RouterLink :to="isBusiness ? '/business' : '/'" class="public-logo" @click="closeMobileMenu">
        <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="public-logo-image" />

        <span>
          {{ isBusiness ? 'Buuchezo Bank Business' : 'Buuchezo Bank' }}
        </span>
      </RouterLink>

      <!-- DESKTOP NAVIGATION -->
      <nav class="public-navigation">
        <RouterLink to="/" @click="closeMobileMenu"> Home </RouterLink>

        <RouterLink to="/about" @click="closeMobileMenu"> About </RouterLink>

        <RouterLink to="/careers" @click="closeMobileMenu"> Careers </RouterLink>

        <RouterLink to="/support" @click="closeMobileMenu"> Support </RouterLink>

        <RouterLink to="/contact" @click="closeMobileMenu"> Contact </RouterLink>
      </nav>

      <!-- DESKTOP ACCOUNT ACTIONS -->
      <div class="public-header-actions">
        <RouterLink :to="loginRoute" class="public-login-link">
          {{ loginLabel }}
        </RouterLink>

        <RouterLink :to="accountRoute" class="public-header-button">
          {{ accountLabel }}

          <ArrowUpRight :size="16" />
        </RouterLink>
      </div>

      <!-- MOBILE MENU BUTTON -->
      <button
        :aria-expanded="mobileMenuOpen"
        :aria-label="mobileMenuOpen ? 'Close navigation' : 'Open navigation'"
        class="public-mobile-button"
        type="button"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <X v-if="mobileMenuOpen" :size="22" />
        <Menu v-else :size="22" />
      </button>
    </div>

    <!-- =========================================================
         MOBILE NAVIGATION
    ========================================================== -->

    <div v-if="mobileMenuOpen" class="public-mobile-menu">
      <!-- MAIN NAVIGATION -->

      <div class="public-mobile-navigation">
        <span class="public-mobile-section-title"> Explore </span>

        <!-- Personal -->
        <RouterLink class="public-mobile-nav-item" to="/" @click="closeMobileMenu">
          <span> Personal </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>

        <!-- Business -->
        <RouterLink class="public-mobile-nav-item" to="/business" @click="closeMobileMenu">
          <span> Business </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>

        <!-- Wealth -->
        <RouterLink class="public-mobile-nav-item" to="/wealth" @click="closeMobileMenu">
          <span> Wealth </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>

        <!-- About -->
        <RouterLink class="public-mobile-nav-item" to="/about" @click="closeMobileMenu">
          <span> About </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>

        <!-- Careers -->
        <RouterLink class="public-mobile-nav-item" to="/careers" @click="closeMobileMenu">
          <span> Careers </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>

        <!-- Support -->
        <RouterLink class="public-mobile-nav-item" to="/support" @click="closeMobileMenu">
          <span> Support </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>

        <!-- Contact -->
        <RouterLink class="public-mobile-nav-item" to="/contact" @click="closeMobileMenu">
          <span> Contact </span>

          <span class="public-mobile-arrow"> → </span>
        </RouterLink>
      </div>

      <!-- ACCOUNT ACTIONS -->

      <div class="public-mobile-actions">
        <span class="public-mobile-section-title"> Account </span>

        <RouterLink :to="loginRoute" class="public-mobile-login" @click="closeMobileMenu">
          {{ loginLabel }}
        </RouterLink>

        <RouterLink :to="accountRoute" class="public-mobile-register" @click="closeMobileMenu">
          {{ accountLabel }}

          <ArrowUpRight :size="15" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.public-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(6, 47, 89, 0.08);
}

.public-header-inner {
  width: min(1280px, calc(100% - 48px));
  min-height: 76px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.public-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  color: #062f59;
  text-decoration: none;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  white-space: nowrap;
}

.public-logo-image {
  width: 38px;
  height: 38px;
  object-fit: contain;
  display: block;
}

.public-navigation {
  display: flex;
  align-items: center;
  gap: 30px;
}

.public-navigation a {
  color: #526b82;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.public-navigation a:hover,
.public-navigation a.router-link-active {
  color: #07559b;
}

.public-header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.public-login-link {
  color: #07559b;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
}

.public-header-button {
  min-height: 42px;
  padding: 0 17px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: white;
  background: #07559b;
  border-radius: 9px;

  text-decoration: none;
  font-size: 12px;
  font-weight: 700;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.public-header-button:hover {
  background: #06457f;
  transform: translateY(-1px);
}

/* =========================================================
   MOBILE BUTTON
========================================================= */

.public-mobile-button {
  display: none;

  width: 42px;
  height: 42px;

  align-items: center;
  justify-content: center;

  color: #062f59;
  background: #f2f7fb;

  border: 0;
  border-radius: 9px;

  cursor: pointer;
}

/* =========================================================
   MOBILE MENU
========================================================= */

.public-mobile-menu {
  display: none;
}

@media (max-width: 850px) {
  .public-navigation,
  .public-header-actions {
    display: none;
  }

  .public-mobile-button {
    display: inline-flex;
  }

  .public-mobile-menu {
    padding: 18px 24px 25px;

    display: flex;
    flex-direction: column;

    background: white;
    border-top: 1px solid rgba(6, 47, 89, 0.06);

    box-shadow: 0 14px 30px rgba(6, 47, 89, 0.08);
  }

  /* =======================================================
     SECTION TITLE
  ======================================================== */

  .public-mobile-section-title {
    display: block;

    margin: 4px 10px 7px;

    color: #8797a8;

    font-size: 10px;
    font-weight: 800;

    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================== */

  .public-mobile-navigation {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .public-mobile-nav-item {
    min-height: 46px;
    padding: 0 10px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #294761;
    text-decoration: none;

    font-size: 14px;
    font-weight: 650;

    border-radius: 9px;

    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  .public-mobile-nav-item:hover,
  .public-mobile-nav-item.router-link-active {
    color: #07559b;
    background: #f3f8fc;
  }

  .public-mobile-arrow {
    color: #9aabba;

    font-size: 17px;

    transition:
      transform 0.2s ease,
      color 0.2s ease;
  }

  .public-mobile-nav-item:hover .public-mobile-arrow {
    color: #07559b;
    transform: translateX(3px);
  }

  /* =======================================================
     ACCOUNT SECTION
  ======================================================== */

  .public-mobile-actions {
    margin-top: 14px;
    padding-top: 15px;

    display: flex;
    flex-direction: column;
    gap: 9px;

    border-top: 1px solid #e7eef4;
  }

  .public-mobile-login,
  .public-mobile-register {
    min-height: 44px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    border-radius: 8px;
    text-decoration: none;

    font-size: 13px;
    font-weight: 700;
  }

  .public-mobile-login {
    color: #07559b;
    background: #f2f7fb;
  }

  .public-mobile-login:hover {
    background: #e8f1f8;
  }

  .public-mobile-register {
    color: white;
    background: #07559b;
  }

  .public-mobile-register:hover {
    background: #06457f;
  }
}

@media (max-width: 500px) {
  .public-header-inner {
    width: min(100% - 32px, 1280px);
  }

  .public-logo {
    font-size: 16px;
  }

  .public-logo-image {
    width: 34px;
    height: 34px;
  }

  .public-mobile-menu {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
