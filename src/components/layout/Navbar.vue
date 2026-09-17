<template>
  <header class="navbar">
    <!-- ============================================================
         BRAND
    ============================================================= -->

    <RouterLink to="/" class="navbar-brand">
      <div class="brand-logo">B</div>

      <div class="brand-copy">
        <strong>Buuchezo Bank</strong>
        <span>Banking Beyond Tomorrow</span>
      </div>
    </RouterLink>

    <!-- ============================================================
         DESKTOP NAVIGATION
    ============================================================= -->

    <nav class="navbar-navigation">
      <RouterLink
        to="/"
        class="nav-link"
        :class="{ active: route.path === '/' }"
      >
        Personal
      </RouterLink>

      <RouterLink
        to="/business"
        class="nav-link"
        :class="{ active: route.path === '/business' }"
      >
        Business
      </RouterLink>

      <RouterLink
        to="/wealth"
        class="nav-link"
        :class="{ active: route.path === '/wealth' }"
      >
        Wealth
      </RouterLink>

      <RouterLink
        to="/about"
        class="nav-link"
        :class="{ active: route.path === '/about' }"
      >
        About
      </RouterLink>

      <RouterLink
        to="/support"
        class="nav-link"
        :class="{ active: route.path === '/support' }"
      >
        Support
      </RouterLink>
    </nav>

    <!-- ============================================================
         NAVBAR ACTIONS
    ============================================================= -->

    <div class="navbar-actions">

      <!-- ==========================================================
           SEARCH
      =========================================================== -->

      <button
        class="search-button"
        type="button"
        aria-label="Search"
        @click="toggleSearch"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>

      <!-- ==========================================================
           LANGUAGE
      =========================================================== -->

      <button class="language-button" type="button">
        EN

        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <!-- ==========================================================
           DESKTOP LOGIN

           IMPORTANT:
           This is visible only on desktop.
      =========================================================== -->

      <RouterLink to="/login" class="login-button">
        Login
      </RouterLink>

      <!-- ==========================================================
           DESKTOP REGISTER

           IMPORTANT:
           This is visible only on desktop.
           There is NO desktop dropdown.
      =========================================================== -->

      <RouterLink to="/register" class="register-button">
        Register
      </RouterLink>

      <!-- ==========================================================
           MOBILE GET STARTED MENU

           IMPORTANT:
           This is hidden on desktop and visible only on mobile.
      =========================================================== -->

      <div class="mobile-account-menu" ref="accountMenu">

        <button
          class="mobile-account-button"
          type="button"
          :aria-expanded="accountMenuOpen"
          aria-haspopup="menu"
          @click="toggleAccountMenu"
        >
          <span class="mobile-account-label">
            Get Started
          </span>

          <svg
            class="account-menu-chevron"
            :class="{ rotated: accountMenuOpen }"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <!-- ========================================================
             MOBILE DROPDOWN
        ========================================================= -->

        <Transition name="dropdown">
          <div
            v-if="accountMenuOpen"
            class="account-dropdown"
            role="menu"
          >

            <!-- Login -->

            <RouterLink
              to="/login"
              class="account-dropdown-item"
              role="menuitem"
              @click="closeAccountMenu"
            >
              <div class="dropdown-icon">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                  />

                  <polyline points="10 17 15 12 10 7" />

                  <line
                    x1="15"
                    y1="12"
                    x2="3"
                    y2="12"
                  />
                </svg>
              </div>

              <div class="dropdown-copy">
                <strong>Login</strong>
                <span>Access your account</span>
              </div>
            </RouterLink>

            <!-- Register -->

            <RouterLink
              to="/register"
              class="account-dropdown-item"
              role="menuitem"
              @click="closeAccountMenu"
            >
              <div class="dropdown-icon">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                  />

                  <path
                    d="M3 21v-2a6 6 0 0 1 12 0v2"
                  />

                  <line
                    x1="19"
                    y1="8"
                    x2="19"
                    y2="14"
                  />

                  <line
                    x1="16"
                    y1="11"
                    x2="22"
                    y2="11"
                  />
                </svg>
              </div>

              <div class="dropdown-copy">
                <strong>Register</strong>
                <span>Open a new account</span>
              </div>
            </RouterLink>

          </div>
        </Transition>

      </div>
    </div>
  </header>

  <!-- ==============================================================
       SEARCH PANEL
  ============================================================== -->

  <Transition name="search-panel">
    <div
      v-if="searchOpen"
      class="search-panel"
    >
      <div class="search-panel-inner">

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
          />
        </svg>

        <input
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          placeholder="Search Buuchezo Bank..."
          aria-label="Search"
        />

        <button
          class="search-close"
          type="button"
          aria-label="Close search"
          @click="closeSearch"
        >
          ×
        </button>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import { useRoute } from 'vue-router'

/* ================================================================
   ROUTER
================================================================ */

const route = useRoute()

/* ================================================================
   MOBILE ACCOUNT MENU
================================================================ */

const accountMenuOpen = ref(false)

const accountMenu = ref<HTMLElement | null>(null)

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value
}

const closeAccountMenu = () => {
  accountMenuOpen.value = false
}

/* ================================================================
   CLOSE ACCOUNT MENU WHEN CLICKING OUTSIDE
================================================================ */

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node

  if (
    accountMenu.value &&
    !accountMenu.value.contains(target)
  ) {
    closeAccountMenu()
  }
}

/* ================================================================
   SEARCH
================================================================ */

const searchOpen = ref(false)

const searchQuery = ref('')

const searchInput = ref<HTMLInputElement | null>(null)

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value

  if (searchOpen.value) {
    await nextTick()

    searchInput.value?.focus()
  }
}

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

/* ================================================================
   LIFECYCLE
================================================================ */

onMounted(() => {
  document.addEventListener(
    'click',
    handleOutsideClick
  )
})

onBeforeUnmount(() => {
  document.removeEventListener(
    'click',
    handleOutsideClick
  )
})
</script>

<style scoped>
/* ================================================================
   NAVBAR
================================================================ */

.navbar {
  position: absolute;

  top: 0;
  left: 0;

  z-index: 100;

  width: 100%;

  height: 78px;

  display: flex;

  align-items: center;

  padding: 0 58px;

  box-sizing: border-box;

  background: transparent;

  border-bottom: none;
}

/* ================================================================
   BRAND
================================================================ */

.navbar-brand {
  display: flex;

  align-items: center;

  gap: 11px;

  min-width: 250px;

  text-decoration: none;

  color: #071b38;
}

.brand-logo {
  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  background: linear-gradient(
    145deg,
    #062f61,
    #087f94
  );

  color: #ffffff;

  font-size: 24px;

  font-weight: 800;
}

.brand-copy {
  display: flex;

  flex-direction: column;
}

.brand-copy strong {
  font-size: 17px;

  line-height: 1.1;

  letter-spacing: -0.3px;
}

.brand-copy span {
  margin-top: 4px;

  color: #8191a6;

  font-size: 10px;

  letter-spacing: 0.2px;
}

/* ================================================================
   NAVIGATION
================================================================ */

.navbar-navigation {
  display: flex;

  align-items: center;

  gap: 30px;

  flex: 1;

  margin-left: 0;
}

.nav-link {
  position: relative;

  padding: 30px 0;

  color: #263b55;

  font-size: 13px;

  font-weight: 500;

  text-decoration: none;

  white-space: nowrap;

  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #086ca8;
}

.nav-link.active {
  color: #086ca8;
}

.nav-link.active::after {
  content: '';

  position: absolute;

  left: 0;
  right: 0;

  bottom: 17px;

  height: 2px;

  background: #087fb4;

  border-radius: 999px;
}

/* ================================================================
   ACTIONS
================================================================ */

.navbar-actions {
  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 10px;

  flex-shrink: 0;
}

/* ================================================================
   SEARCH BUTTON
================================================================ */

.search-button {
  width: 38px;

  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 0;

  background: transparent;

  color: #203751;

  cursor: pointer;

  border-radius: 7px;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.search-button:hover {
  background: #f5f8fb;

  color: #086ca8;
}

/* ================================================================
   LANGUAGE
================================================================ */

.language-button {
  display: flex;

  align-items: center;

  gap: 4px;

  padding: 8px 7px;

  border: 0;

  background: transparent;

  color: #203751;

  font-family: inherit;

  font-size: 13px;

  cursor: pointer;
}

/* ================================================================
   DESKTOP LOGIN
================================================================ */

.login-button {
  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0 19px;

  border: 1px solid #b9c7d5;

  border-radius: 7px;

  background: #ffffff;

  color: #102a47;

  font-size: 13px;

  font-weight: 500;

  text-decoration: none;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.login-button:hover {
  background: #f6f9fc;

  border-color: #8fa4b8;

  transform: translateY(-1px);
}

/* ================================================================
   DESKTOP REGISTER
================================================================ */

.register-button {
  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0 16px;

  border: 0;

  border-radius: 7px;

  background: #063e73;

  color: #ffffff;

  font-size: 13px;

  font-weight: 600;

  text-decoration: none;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.register-button:hover {
  background: #07518f;

  transform: translateY(-1px);

  box-shadow:
    0 7px 18px
    rgba(6, 62, 115, 0.18);
}

/* ================================================================
   MOBILE ACCOUNT MENU

   Hidden by default.
   Only shown on mobile.
================================================================ */

.mobile-account-menu {
  position: relative;

  display: none;

  align-items: center;
}

/* ================================================================
   MOBILE GET STARTED BUTTON
================================================================ */

.mobile-account-button {
  height: 40px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  padding: 0 16px;

  border: 0;

  border-radius: 7px;

  background: #063e73;

  color: #ffffff;

  font-family: inherit;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.mobile-account-button:hover {
  background: #07518f;

  transform: translateY(-1px);

  box-shadow:
    0 7px 18px
    rgba(6, 62, 115, 0.18);
}

.account-menu-chevron {
  flex-shrink: 0;

  transition: transform 0.2s ease;
}

.account-menu-chevron.rotated {
  transform: rotate(180deg);
}

/* ================================================================
   MOBILE DROPDOWN
================================================================ */

.account-dropdown {
  position: absolute;

  top: calc(100% + 10px);

  right: 0;

  width: 230px;

  padding: 7px;

  box-sizing: border-box;

  border: 1px solid #e5eaf0;

  border-radius: 12px;

  background: #ffffff;

  box-shadow:
    0 18px 45px
    rgba(20, 35, 55, 0.15);

  z-index: 1000;
}

/* ================================================================
   DROPDOWN ITEM
================================================================ */

.account-dropdown-item {
  display: flex;

  align-items: center;

  gap: 12px;

  width: 100%;

  padding: 12px 11px;

  box-sizing: border-box;

  border-radius: 8px;

  color: #102a47;

  text-decoration: none;

  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.account-dropdown-item:hover {
  background: #f6f9fc;

  transform: translateX(2px);
}

/* ================================================================
   DROPDOWN ICON
================================================================ */

.dropdown-icon {
  width: 35px;

  height: 35px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 8px;

  background: #eef7fb;

  color: #087fa4;
}

/* ================================================================
   DROPDOWN COPY
================================================================ */

.dropdown-copy {
  display: flex;

  flex-direction: column;

  gap: 3px;
}

.dropdown-copy strong {
  color: #102a47;

  font-size: 13px;

  font-weight: 650;
}

.dropdown-copy span {
  color: #8191a6;

  font-size: 10px;

  line-height: 1.3;
}

/* ================================================================
   DROPDOWN TRANSITION
================================================================ */

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;

  transform:
    translateY(-5px)
    scale(0.98);
}

/* ================================================================
   SEARCH PANEL
================================================================ */

.search-panel {
  position: absolute;

  top: 78px;

  left: 0;
  right: 0;

  z-index: 90;

  padding: 14px 58px;

  background:
    rgba(255, 255, 255, 0.98);

  border-bottom: 1px solid #edf2f7;

  box-shadow:
    0 10px 30px
    rgba(20, 35, 55, 0.08);
}

.search-panel-inner {
  max-width: 900px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  gap: 12px;

  height: 48px;

  padding: 0 14px;

  box-sizing: border-box;

  border: 1px solid #d8e1e9;

  border-radius: 8px;

  background: #ffffff;

  color: #203751;
}

.search-panel-inner input {
  flex: 1;

  min-width: 0;

  border: 0;

  outline: 0;

  background: transparent;

  color: #102a47;

  font-family: inherit;

  font-size: 14px;
}

.search-panel-inner input::placeholder {
  color: #9aa9b8;
}

.search-close {
  width: 30px;

  height: 30px;

  border: 0;

  background: transparent;

  color: #718296;

  font-size: 24px;

  line-height: 1;

  cursor: pointer;
}

/* ================================================================
   SEARCH TRANSITION
================================================================ */

.search-panel-enter-active,
.search-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.search-panel-enter-from,
.search-panel-leave-to {
  opacity: 0;

  transform: translateY(-8px);
}

/* ================================================================
   TABLET
================================================================ */

@media (max-width: 1100px) {
  .navbar {
    padding: 0 30px;
  }

  .navbar-brand {
    min-width: auto;
  }

  .navbar-navigation {
    margin-left: 35px;

    gap: 20px;
  }
}

/* ================================================================
   SMALL DESKTOP / TABLET
================================================================ */

@media (max-width: 900px) {
  .navbar {
    padding: 0 20px;
  }

  .navbar-navigation {
    display: none;
  }

  .language-button {
    display: none;
  }

  /*
    IMPORTANT:

    Desktop Login and Register disappear.
    Mobile Get Started appears.
  */

  .login-button {
    display: none;
  }

  .register-button {
    display: none;
  }

  .mobile-account-menu {
    display: flex;
  }

  .mobile-account-button {
    height: 44px;

    width: auto;

    min-width: 48px;

    padding: 0 13px;
  }

  .mobile-account-label {
    display: none;
  }

  .account-menu-chevron {
    width: 18px;

    height: 18px;
  }

  .account-dropdown {
    top: calc(100% + 10px);

    right: 0;

    left: auto;

    width: 230px;
  }
}

/* ================================================================
   MOBILE
================================================================ */

@media (max-width: 600px) {
  .navbar {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;

    height: 70px;

    padding: 0 16px;

    background: transparent;

    border-bottom: none;
  }

  .navbar-brand {
    gap: 9px;

    min-width: 0;
  }

  .brand-logo {
    width: 38px;

    height: 38px;

    border-radius: 8px;

    font-size: 22px;
  }

  .brand-copy strong {
    font-size: 15px;

    letter-spacing: -0.2px;
  }

  .brand-copy span {
    display: none;
  }

  .navbar-actions {
    margin-left: auto;

    gap: 5px;
  }

  .search-button {
    width: 40px;

    height: 40px;
  }

  .mobile-account-button {
    width: 44px;

    height: 44px;

    border-radius: 8px;

    padding: 0;
  }

  .account-menu-chevron {
    width: 18px;

    height: 18px;
  }

  /*
    IMPORTANT:
    Dropdown is anchored to the right edge
    of the mobile Get Started button.
  */

  .account-dropdown {
    position: absolute;

    top: calc(100% + 9px);

    right: 0;

    left: auto;

    width: min(
      230px,
      calc(100vw - 32px)
    );
  }

  .account-dropdown-item {
    padding: 13px 11px;
  }

  .search-panel {
    top: 70px;

    padding: 12px 16px;
  }
}

/* ================================================================
   VERY SMALL PHONES
================================================================ */

@media (max-width: 380px) {
  .navbar {
    padding: 0 12px;
  }

  .brand-copy strong {
    font-size: 14px;
  }

  .brand-logo {
    width: 36px;

    height: 36px;
  }

  .mobile-account-button {
    width: 42px;

    height: 42px;
  }

  .account-dropdown {
    width: calc(100vw - 24px);
  }
}
</style>
