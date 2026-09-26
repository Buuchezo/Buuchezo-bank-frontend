<template>
  <div class="business-login-page">
    <!-- LEFT SIDE -->
    <section class="business-visual">
      <div class="visual-content">
        <RouterLink to="/business" class="brand">
          <span class="brand-mark">B</span>

          <div class="brand-text">
            <strong>Buuchezo Bank</strong>
            <span>Business Banking</span>
          </div>
        </RouterLink>

        <div class="visual-main">
          <span class="eyebrow">BUUCHEZO BUSINESS</span>

          <h1>
            Banking built for
            <span>your business.</span>
          </h1>

          <p>
            Manage your business accounts, payments, transfers and
            team access from one secure banking platform.
          </p>

          <div class="feature-list">
            <div class="feature">
              <div class="feature-number">01</div>
              <div>
                <strong>Business accounts</strong>
                <span>Manage your business finances in one place.</span>
              </div>
            </div>

            <div class="feature">
              <div class="feature-number">02</div>
              <div>
                <strong>Team access</strong>
                <span>Control access with business roles and permissions.</span>
              </div>
            </div>

            <div class="feature">
              <div class="feature-number">03</div>
              <div>
                <strong>Secure payments</strong>
                <span>Protect transfers with authentication and TAN verification.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RIGHT SIDE -->
    <section class="login-section">
      <div class="login-container">
        <div class="mobile-brand">
          <RouterLink to="/business" class="brand">
            <span class="brand-mark">B</span>

            <div class="brand-text">
              <strong>Buuchezo Bank</strong>
              <span>Business Banking</span>
            </div>
          </RouterLink>
        </div>

        <!-- NORMAL LOGIN -->
        <template v-if="!requiresTwoFactor">
          <div class="login-heading">
            <span class="eyebrow">BUSINESS BANKING</span>

            <h2>Welcome back.</h2>

            <p>
              Sign in to manage your business account.
            </p>
          </div>

          <form
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <div class="form-group">
              <label for="email">
                Business email
              </label>

              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div class="form-group">
              <div class="label-row">
                <label for="password">
                  Password
                </label>

                <button
                  type="button"
                  class="forgot-button"
                  @click="handleForgotPassword"
                >
                  Forgot password?
                </button>
              </div>

              <div class="password-wrapper">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <label class="remember-row">
              <input
                v-model="rememberMe"
                type="checkbox"
              />

              <span>
                Keep me signed in
              </span>
            </label>

            <div
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="login-button"
              :disabled="isLoading"
            >
              <span>
                {{ isLoading ? 'Signing in...' : 'Sign in to Business Banking' }}
              </span>

              <span class="button-arrow">→</span>
            </button>
          </form>

          <div class="bottom-links">
            <p>
              Don't have a business account?
              <RouterLink to="/business/onboarding">
                Open a business account
              </RouterLink>
            </p>

            <RouterLink
              to="/login"
              class="personal-login-link"
            >
              Personal Banking login
            </RouterLink>
          </div>
        </template>

        <!-- TWO FACTOR -->
        <template v-else>
          <div class="login-heading">
            <span class="eyebrow">SECURITY VERIFICATION</span>

            <h2>Verify your identity.</h2>

            <p>
              Enter the 6-digit authentication code from your
              authenticator app.
            </p>
          </div>

          <form
            class="login-form"
            @submit.prevent="handleTwoFactorLogin"
          >
            <div class="form-group">
              <label for="twoFactorCode">
                Authentication code
              </label>

              <input
                id="twoFactorCode"
                v-model="twoFactorCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                placeholder="000000"
                class="two-factor-input"
                required
              />

              <small class="input-help">
                Enter the current 6-digit code from your authenticator app.
              </small>
            </div>

            <div
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="login-button"
              :disabled="
                isTwoFactorLoading ||
                twoFactorCode.length !== 6
              "
            >
              <span>
                {{
                  isTwoFactorLoading
                    ? 'Verifying...'
                    : 'Verify and continue'
                }}
              </span>

              <span class="button-arrow">→</span>
            </button>
          </form>

          <button
            type="button"
            class="back-button"
            @click="backToLogin"
          >
            ← Use a different account
          </button>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

interface LoginUser {
  id: number
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles: Array<{
    id?: number
    name: string
  }>
}

interface LoginResponse {
  statusCode: number
  message: string
  data?: {
    token?: string
    challengeToken?: string
    requiresTwoFactor?: boolean
    user?: LoginUser
  }
}

interface Business {
  id: number
  legalName: string
  tradingName?: string | null
  registrationNumber?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
}

interface BusinessListResponse {
  data?: Business[]
}

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const isLoading = ref(false)
const isTwoFactorLoading = ref(false)

const errorMessage = ref('')

const requiresTwoFactor = ref(false)
const challengeToken = ref('')
const twoFactorCode = ref('')

/*
 * ------------------------------------------------------------
 * NORMAL LOGIN
 * ------------------------------------------------------------
 */

async function handleLogin(): Promise<void> {
  errorMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value =
      'Please enter your email and password.'

    return
  }

  isLoading.value = true

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value,
        }),
      },
    )

    const result =
      (await response.json()) as LoginResponse

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Login failed. Please check your credentials.',
      )
    }

    /*
     * --------------------------------------------------------
     * TWO-FACTOR REQUIRED
     * --------------------------------------------------------
     */

    if (result.data?.requiresTwoFactor === true) {
      if (!result.data.challengeToken) {
        throw new Error(
          'Two-factor authentication was requested but no challenge was provided.',
        )
      }

      requiresTwoFactor.value = true
      challengeToken.value =
        result.data.challengeToken
      twoFactorCode.value = ''

      return
    }

    /*
     * --------------------------------------------------------
     * NORMAL LOGIN
     * --------------------------------------------------------
     */

    const token = result.data?.token
    const user = result.data?.user

    if (!token || !user) {
      throw new Error(
        'Invalid login response from server.',
      )
    }

    await completeBusinessLogin(token, user)
  } catch (error) {
    console.error(
      'Business login error:',
      error,
    )

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to sign in to Business Banking.'
  } finally {
    isLoading.value = false
  }
}

/*
 * ------------------------------------------------------------
 * TWO-FACTOR LOGIN
 * ------------------------------------------------------------
 */

async function handleTwoFactorLogin(): Promise<void> {
  errorMessage.value = ''

  const code = twoFactorCode.value.trim()

  if (!challengeToken.value) {
    errorMessage.value =
      'Your login session has expired. Please sign in again.'

    backToLogin()

    return
  }

  if (!/^\d{6}$/.test(code)) {
    errorMessage.value =
      'Please enter the 6-digit authentication code.'

    return
  }

  isTwoFactorLoading.value = true

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/2fa/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          challengeToken: challengeToken.value,
          code,
        }),
      },
    )

    const result =
      (await response.json()) as LoginResponse

    if (!response.ok) {
      throw new Error(
        result.message ||
        'Invalid authentication code.',
      )
    }

    const token = result.data?.token
    const user = result.data?.user

    if (!token || !user) {
      throw new Error(
        'Invalid two-factor authentication response from server.',
      )
    }

    await completeBusinessLogin(token, user)
  } catch (error) {
    console.error(
      'Business two-factor login error:',
      error,
    )

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to verify the authentication code.'
  } finally {
    isTwoFactorLoading.value = false
  }
}

/*
 * ------------------------------------------------------------
 * COMPLETE BUSINESS LOGIN
 * ------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * We do NOT simply redirect to /business/dashboard.
 *
 * First we verify that the authenticated user actually
 * belongs to a business.
 * ------------------------------------------------------------
 */

async function completeBusinessLogin(
  token: string,
  user: LoginUser,
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/businesses/me`,
      {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status === 401) {
      throw new Error(
        'Your authentication session is invalid. Please sign in again.',
      )
    }

    const result =
      (await response.json()) as
        | Business[]
        | BusinessListResponse

    if (!response.ok) {
      throw new Error(
        'Unable to verify your business account.',
      )
    }

    const businesses = Array.isArray(result)
      ? result
      : result.data || []

    /*
     * The credentials are valid, but this user does
     * not belong to a business.
     */

    if (businesses.length === 0) {
      errorMessage.value =
        'These credentials do not have access to a business account.'

      return
    }

    const selectedBusiness = businesses[0]

    if (!selectedBusiness) {
      errorMessage.value =
        'Unable to determine your business account.'

      return
    }

    /*
     * Only now create the customer session.
     */

    const storage = rememberMe.value
      ? localStorage
      : sessionStorage

    storage.setItem(
      'accessToken',
      token,
    )

    storage.setItem(
      'user',
      JSON.stringify(user),
    )

    /*
     * Store the business context so the business
     * frontend can use it immediately.
     */

    storage.setItem(
      'business',
      JSON.stringify(selectedBusiness),
    )

    /*
     * Business login goes to Business Dashboard,
     * NOT the personal dashboard.
     */

    await router.push('/business/dashboard')
  } catch (error) {
    console.error(
      'Business account verification failed:',
      error,
    )

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to verify your business account.'
  }
}

/*
 * ------------------------------------------------------------
 * BACK TO LOGIN
 * ------------------------------------------------------------
 */

function backToLogin(): void {
  requiresTwoFactor.value = false
  challengeToken.value = ''
  twoFactorCode.value = ''
  errorMessage.value = ''
}

/*
 * ------------------------------------------------------------
 * FORGOT PASSWORD
 * ------------------------------------------------------------
 */

function handleForgotPassword(): void {
  errorMessage.value =
    'Password recovery will be available soon.'
}
</script>

<style scoped>
.business-login-page {
  min-height: 100vh;

  display: grid;
  grid-template-columns: 1fr 0.85fr;

  background: #ffffff;
}

/* =========================================================
   LEFT VISUAL
========================================================= */

.business-visual {
  position: relative;

  min-height: 100vh;

  padding: 42px 7%;

  display: flex;
  flex-direction: column;

  color: #ffffff;

  background:
    linear-gradient(
      145deg,
      #062f59 0%,
      #07559b 55%,
      #143fbd 100%
    );

  overflow: hidden;
}

.business-visual::before {
  content: '';

  position: absolute;

  width: 650px;
  height: 650px;

  right: -300px;
  top: -220px;

  border: 1px solid rgba(255, 255, 255, 0.12);

  border-radius: 50%;
}

.business-visual::after {
  content: '';

  position: absolute;

  width: 500px;
  height: 500px;

  left: -300px;
  bottom: -280px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 50%;
}

.visual-content {
  position: relative;

  z-index: 1;

  height: 100%;

  display: flex;
  flex-direction: column;
}

/* =========================================================
   BRAND
========================================================= */

.brand {
  display: inline-flex;

  align-items: center;

  gap: 12px;

  width: fit-content;

  color: inherit;

  text-decoration: none;
}

.brand-mark {
  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  color: #ffffff;

  background: rgba(255, 255, 255, 0.14);

  border: 1px solid rgba(255, 255, 255, 0.18);

  font-size: 23px;
  font-weight: 800;
}

.brand-text {
  display: flex;

  flex-direction: column;

  gap: 2px;
}

.brand-text strong {
  font-size: 17px;
  font-weight: 750;
}

.brand-text span {
  font-size: 11px;

  color: rgba(255, 255, 255, 0.68);
}

/* =========================================================
   VISUAL CONTENT
========================================================= */

.visual-main {
  max-width: 650px;

  margin-top: auto;
  margin-bottom: auto;

  padding: 80px 0 40px;
}

.eyebrow {
  display: inline-block;

  margin-bottom: 18px;

  color: #4e9fff;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 0.16em;
}

.business-visual .eyebrow {
  color: #9bcaff;
}

.visual-main h1 {
  max-width: 620px;

  margin: 0;

  font-size: clamp(42px, 5vw, 68px);

  line-height: 1.02;

  letter-spacing: -0.045em;
}

.visual-main h1 span {
  display: block;

  color: #8ec7ff;
}

.visual-main > p {
  max-width: 560px;

  margin: 28px 0 45px;

  color: rgba(255, 255, 255, 0.72);

  font-size: 16px;

  line-height: 1.7;
}

/* =========================================================
   FEATURES
========================================================= */

.feature-list {
  display: flex;

  flex-direction: column;

  gap: 18px;
}

.feature {
  display: flex;

  align-items: flex-start;

  gap: 18px;
}

.feature-number {
  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);

  border-radius: 9px;

  color: #a9d3ff;

  font-size: 10px;

  font-weight: 800;
}

.feature strong {
  display: block;

  margin-bottom: 3px;

  font-size: 13px;
}

.feature span {
  display: block;

  color: rgba(255, 255, 255, 0.55);

  font-size: 11px;

  line-height: 1.5;
}

/* =========================================================
   LOGIN SIDE
========================================================= */

.login-section {
  min-height: 100vh;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 40px;
}

.login-container {
  width: 100%;

  max-width: 470px;
}

.mobile-brand {
  display: none;
}

.login-heading {
  margin-bottom: 38px;
}

.login-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 39px;

  line-height: 1.05;

  letter-spacing: -0.035em;
}

.login-heading p {
  margin: 13px 0 0;

  color: #8998a3;

  font-size: 14px;

  line-height: 1.6;
}

/* =========================================================
   FORM
========================================================= */

.login-form {
  display: flex;

  flex-direction: column;

  gap: 23px;
}

.form-group {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.form-group label {
  color: #29465a;

  font-size: 12px;

  font-weight: 700;
}

.label-row {
  display: flex;

  align-items: center;

  justify-content: space-between;
}

.login-form input[type='email'],
.login-form input[type='password'],
.login-form input[type='text'] {
  width: 100%;

  box-sizing: border-box;

  padding: 14px 15px;

  border: 1px solid #dce5eb;

  border-radius: 8px;

  outline: none;

  color: #183b55;

  background: #ffffff;

  font-family: inherit;

  font-size: 13px;

  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.login-form input:focus {
  border-color: #1683dc;

  box-shadow:
    0 0 0 3px rgba(22, 131, 220, 0.09);
}

.login-form input::placeholder {
  color: #aab6be;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 65px !important;
}

.password-toggle {
  position: absolute;

  right: 12px;
  top: 50%;

  transform: translateY(-50%);

  padding: 5px;

  border: 0;

  color: #1977b8;

  background: transparent;

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}

.forgot-button {
  padding: 0;

  border: 0;

  color: #1977b8;

  background: transparent;

  font-family: inherit;

  font-size: 11px;

  cursor: pointer;
}

.remember-row {
  display: flex;

  align-items: center;

  gap: 9px;

  color: #71818d;

  font-size: 11px;

  cursor: pointer;
}

.remember-row input {
  width: 14px;
  height: 14px;
}

/* =========================================================
   ERROR
========================================================= */

.error-message {
  padding: 12px 14px;

  border: 1px solid #f0caca;

  border-radius: 8px;

  color: #8b3434;

  background: #fff5f5;

  font-size: 12px;

  line-height: 1.5;
}

/* =========================================================
   BUTTON
========================================================= */

.login-button {
  width: 100%;

  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 15px 17px;

  border: 0;

  border-radius: 8px;

  color: #ffffff;

  background: #07559b;

  font-family: inherit;

  font-size: 12px;

  font-weight: 750;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #06477f;

  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

.button-arrow {
  font-size: 19px;
}

.two-factor-input {
  text-align: center;

  letter-spacing: 0.35em;

  font-size: 22px !important;

  font-weight: 700;
}

.input-help {
  color: #8998a3;

  font-size: 11px;

  line-height: 1.5;
}

.back-button {
  margin-top: 24px;

  padding: 0;

  border: 0;

  color: #1977b8;

  background: transparent;

  font-family: inherit;

  font-size: 12px;

  cursor: pointer;
}

/* =========================================================
   BOTTOM LINKS
========================================================= */

.bottom-links {
  margin-top: 30px;

  text-align: center;
}

.bottom-links p {
  margin: 0;

  color: #8998a3;

  font-size: 11px;

  line-height: 1.7;
}

.bottom-links a {
  color: #1977b8;

  font-weight: 700;

  text-decoration: none;
}

.personal-login-link {
  display: inline-block;

  margin-top: 15px;

  color: #657783 !important;

  font-size: 11px;

  font-weight: 600 !important;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .business-login-page {
    grid-template-columns: 1fr;
  }

  .business-visual {
    display: none;
  }

  .login-section {
    min-height: 100vh;

    padding: 30px 22px;
  }

  .mobile-brand {
    display: block;

    margin-bottom: 55px;
  }

  .mobile-brand .brand {
    color: #082f56;
  }

  .mobile-brand .brand-mark {
    color: #ffffff;

    background: #07559b;

    border-color: #07559b;
  }

  .mobile-brand .brand-text span {
    color: #8998a3;
  }
}

@media (max-width: 500px) {
  .login-section {
    padding: 25px 18px;
  }

  .login-heading h2 {
    font-size: 34px;
  }

  .login-heading {
    margin-bottom: 30px;
  }
}
</style>
