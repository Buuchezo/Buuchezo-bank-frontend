<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, ArrowUpRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import buuchezoBankLogo from '@/assets/images/buuchezobank-blue-logo.png'

const mobileMenuOpen = ref(false)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="public-header">
    <div class="public-header-inner">
      <RouterLink to="/" class="public-logo" @click="closeMobileMenu">
        <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="public-logo-image" />

        <span>Buuchezo Bank</span>
      </RouterLink>

      <nav class="public-navigation">
        <RouterLink to="/" @click="closeMobileMenu"> Home </RouterLink>

        <RouterLink to="/about" @click="closeMobileMenu"> About </RouterLink>

        <RouterLink to="/careers" @click="closeMobileMenu"> Careers </RouterLink>

        <RouterLink to="/support" @click="closeMobileMenu"> Support </RouterLink>

        <RouterLink to="/contact" @click="closeMobileMenu"> Contact </RouterLink>
      </nav>

      <div class="public-header-actions">
        <RouterLink to="/login" class="public-login-link"> Sign in </RouterLink>

        <RouterLink to="/register" class="public-header-button">
          Open an account
          <ArrowUpRight :size="16" />
        </RouterLink>
      </div>

      <button
        type="button"
        class="public-mobile-button"
        aria-label="Open navigation"
        :aria-expanded="mobileMenuOpen"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <X v-if="mobileMenuOpen" :size="22" />
        <Menu v-else :size="22" />
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="public-mobile-menu">
      <RouterLink to="/" @click="closeMobileMenu"> Home </RouterLink>

      <RouterLink to="/about" @click="closeMobileMenu"> About us </RouterLink>

      <RouterLink to="/careers" @click="closeMobileMenu"> Careers </RouterLink>

      <RouterLink to="/support" @click="closeMobileMenu"> Support </RouterLink>

      <RouterLink to="/contact" @click="closeMobileMenu"> Contact </RouterLink>

      <div class="public-mobile-actions">
        <RouterLink to="/login" class="public-mobile-login" @click="closeMobileMenu">
          Sign in
        </RouterLink>

        <RouterLink to="/register" class="public-mobile-register" @click="closeMobileMenu">
          Open an account
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
    gap: 4px;

    background: white;
    border-top: 1px solid rgba(6, 47, 89, 0.06);
  }

  .public-mobile-menu > a {
    padding: 13px 10px;

    color: #294761;
    text-decoration: none;

    font-size: 14px;
    font-weight: 600;

    border-radius: 8px;
  }

  .public-mobile-menu > a:hover {
    background: #f3f8fc;
    color: #07559b;
  }

  .public-mobile-actions {
    margin-top: 12px;
    padding-top: 15px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    border-top: 1px solid #e7eef4;
  }

  .public-mobile-login,
  .public-mobile-register {
    min-height: 44px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;
    text-decoration: none;

    font-size: 13px;
    font-weight: 700;
  }

  .public-mobile-login {
    color: #07559b;
    background: #f2f7fb;
  }

  .public-mobile-register {
    color: white;
    background: #07559b;
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
}
</style>
