```
<template>
  <main class="auth-page">
    <!-- =====================================================
         LEFT VISUAL
    ====================================================== -->
    <div class="auth-visual">
      <div class="auth-visual-glow"></div>
      <!-- =====================================================
       FADED CURRENCY BACKGROUND
  ====================================================== -->
      <div class="currency-background" aria-hidden="true">
        <div class="global-globe">
          <div class="globe-grid globe-grid-horizontal"></div>
          <div class="globe-grid globe-grid-vertical"></div>

          <span class="globe-node node-1"></span>
          <span class="globe-node node-2"></span>
          <span class="globe-node node-3"></span>
          <span class="globe-node node-4"></span>
          <span class="globe-node node-5"></span>
          <span class="globe-node node-6"></span>
        </div>
        <span class="currency-symbol currency-euro">€</span>
        <span class="currency-symbol currency-dollar">$</span>
        <span class="currency-symbol currency-pound">£</span>
        <span class="currency-symbol currency-yen">¥</span>
        <span class="currency-symbol currency-euro-small">€</span>
        <span class="currency-symbol currency-dollar-small">$</span>
        <span class="currency-symbol currency-yen-small">¥</span>
      </div>

      <RouterLink to="/" class="auth-brand">
        <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="banking-logo-image" />
        <span>Buuchezo Bank</span>
      </RouterLink>

      <div class="auth-visual-content">
        <span class="auth-eyebrow">WELCOME BACK</span>

        <h1>
          Your money,
          <span>your control.</span>
        </h1>

        <p>Securely access your accounts and stay connected to everything that matters.</p>

        <div class="auth-card-preview">
          <div class="preview-top">
            <div class="preview-brand">
              <img
                src="@/assets/images/buuchezobank-logo.png"
                alt="Buuchezo Bank"
                class="preview-logo"
              />
              <span>Buuchezo Bank</span>
            </div>
            <span class="preview-contactless" aria-label="Contactless payment">◉</span>
          </div>
          <div class="preview-chip"></div>

          <div class="preview-number">5432&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;3456</div>

          <div class="preview-bottom">
            <span>JOHN DOE</span>
            <span>VISA</span>
          </div>
        </div>
      </div>

      <div class="auth-visual-footer">
        <span class="status-dot"></span>
        Secure banking experience
      </div>
    </div>

    <!-- =====================================================
         FORM AREA
    ====================================================== -->
    <div class="auth-form-area">
      <div class="auth-form-container">
        <!-- Mobile brand -->
        <div class="mobile-brand">
          <span class="auth-brand-mark">B</span>
          <span>Buuchezo Bank</span>
        </div>

        <!-- =================================================
             NORMAL LOGIN
        ================================================== -->
        <template v-if="!requiresTwoFactor">
          <div class="form-heading">
            <span class="form-label">SIGN IN</span>

            <h2>Welcome back.</h2>

            <p>Enter your details to access your account.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleLogin">
            <!-- Email -->
            <div class="form-group">
              <label for="email">Email address</label>

              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
            </div>

            <!-- Password -->
            <div class="form-group">
              <div class="label-row">
                <label for="password">Password</label>

                <button type="button" class="forgot-password" @click="handleForgotPassword">
                  Forgot password?
                </button>
              </div>

              <div class="password-input">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                />

                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <!-- Remember me -->
            <div class="remember-row">
              <label class="remember-label">
                <input v-model="rememberMe" type="checkbox" />

                <span>Remember me</span>
              </label>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <!-- Submit -->
            <button type="submit" class="auth-submit" :disabled="isLoading">
              <span>
                {{ isLoading ? 'Signing in...' : 'Sign in' }}
              </span>

              <ArrowUpRight :size="17" />
            </button>
          </form>

          <!-- Divider -->
          <div class="auth-divider">
            <span>OR</span>
          </div>

          <!-- Register -->
          <div class="register-prompt">
            <span>Don't have an account?</span>

            <RouterLink to="/register">
              Create an account
              <ArrowRight :size="14" />
            </RouterLink>
          </div>

          <!-- Legal -->
          <p class="auth-legal">
            By continuing, you agree to our
            <RouterLink to="/terms">Terms</RouterLink>
            and
            <RouterLink to="/privacy">Privacy Policy</RouterLink>.
          </p>
        </template>

        <!-- =================================================
             TWO-FACTOR AUTHENTICATION
        ================================================== -->
        <template v-else>
          <div class="form-heading">
            <span class="form-label">TWO-FACTOR AUTHENTICATION</span>

            <h2>Verify your identity.</h2>

            <p>Open your authenticator app and enter the 6-digit verification code to continue.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleTwoFactorLogin">
            <div class="form-group">
              <label for="twoFactorCode">Authentication code</label>

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

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="auth-submit"
              :disabled="isTwoFactorLoading || twoFactorCode.length !== 6"
            >
              <span>
                {{ isTwoFactorLoading ? 'Verifying...' : 'Verify code' }}
              </span>

              <ArrowUpRight :size="17" />
            </button>
          </form>

          <button type="button" class="back-to-login" @click="backToLogin">
            <ArrowLeft :size="15" />
            Use a different account
          </button>

          <p class="auth-legal two-factor-security-note">
            Your verification code is provided by your authenticator app and changes regularly.
          </p>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import buuchezoBankLogo from '@/assets/images/buuchezobank-logo.png'

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

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const isLoading = ref(false)
const isTwoFactorLoading = ref(false)
const errorMessage = ref('')

/*
 * ------------------------------------------------------------
 * TWO-FACTOR LOGIN STATE
 * ------------------------------------------------------------
 */

const requiresTwoFactor = ref(false)
const challengeToken = ref('')
const twoFactorCode = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/*
 * ------------------------------------------------------------
 * NORMAL LOGIN
 * ------------------------------------------------------------
 */

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const result: LoginResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Login failed. Please check your credentials.')
    }

    /*
     * --------------------------------------------------------
     * TWO-FACTOR REQUIRED
     * --------------------------------------------------------
     *
     * The backend returns:
     *
     * {
     *   requiresTwoFactor: true,
     *   challengeToken: "..."
     * }
     *
     * No JWT should be stored at this point.
     */

    if (result.data?.requiresTwoFactor === true) {
      if (!result.data.challengeToken) {
        throw new Error('Two-factor authentication was requested but no challenge was provided.')
      }

      requiresTwoFactor.value = true
      challengeToken.value = result.data.challengeToken
      twoFactorCode.value = ''

      return
    }

    /*
     * --------------------------------------------------------
     * NORMAL LOGIN WITHOUT TWO-FACTOR
     * --------------------------------------------------------
     */

    const token = result.data?.token
    const user = result.data?.user

    if (!token || !user) {
      throw new Error('Invalid login response from server.')
    }

    completeLogin(token, user)
  } catch (error) {
    console.error('Login error:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

/*
 * ------------------------------------------------------------
 * TWO-FACTOR LOGIN
 * ------------------------------------------------------------
 */

const handleTwoFactorLogin = async () => {
  errorMessage.value = ''

  const code = twoFactorCode.value.trim()

  if (!challengeToken.value) {
    errorMessage.value = 'Your login session has expired. Please sign in again.'
    backToLogin()
    return
  }

  if (!/^\d{6}$/.test(code)) {
    errorMessage.value = 'Please enter the 6-digit authentication code.'
    return
  }

  isTwoFactorLoading.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/2fa/login`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        challengeToken: challengeToken.value,
        code,
      }),
    })

    const result: LoginResponse = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Invalid authentication code.')
    }

    const token = result.data?.token
    const user = result.data?.user

    if (!token || !user) {
      throw new Error('Invalid two-factor authentication response from server.')
    }

    completeLogin(token, user)
  } catch (error) {
    console.error('Two-factor login error:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to verify the authentication code. Please try again.'
  } finally {
    isTwoFactorLoading.value = false
  }
}

/*
 * ------------------------------------------------------------
 * COMPLETE LOGIN
 * ------------------------------------------------------------
 *
 * This is the ONLY place where the JWT is stored.
 *
 * That is important because when 2FA is enabled, the JWT must
 * not be stored after the password step alone.
 */

const completeLogin = async (token: string, user: LoginUser) => {
  const storage = rememberMe.value ? localStorage : sessionStorage

  /*
   * ------------------------------------------------------------
   * CUSTOMER SESSION
   * ------------------------------------------------------------
   *
   * This login page is ONLY for customer authentication.
   *
   * Even if the same email also has a separate administrator
   * identity, customer login always creates a customer session.
   *
   * Administrator authentication happens exclusively through:
   *
   *   /admin/login
   *
   * and uses:
   *
   *   adminAccessToken
   */

  storage.setItem('accessToken', token)
  storage.setItem('user', JSON.stringify(user))

  /*
   * Never inspect the customer's roles to decide whether the
   * user should enter the administrator portal.
   *
   * The customer and administrator identities are separate.
   */

  await router.push('/dashboard')
}

/*
 * ------------------------------------------------------------
 * BACK TO NORMAL LOGIN
 * ------------------------------------------------------------
 */

const backToLogin = () => {
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

const handleForgotPassword = () => {
  errorMessage.value = 'Password recovery will be available soon.'
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;

  display: grid;
  grid-template-columns: 1fr 0.9fr;

  background: #ffffff;
}

/* =========================================================
   VISUAL
========================================================= */

.auth-visual {
  position: relative;

  min-height: 100vh;

  padding: 42px 7%;

  display: flex;
  flex-direction: column;

  color: white;

  background: linear-gradient(145deg, #062f59 0%, #07559b 55%, #143fbd 100%);

  overflow: hidden;
}

.auth-visual::before {
  content: '';

  position: absolute;

  width: 600px;
  height: 600px;

  right: -250px;
  top: -180px;

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 50%;
}

.auth-visual::after {
  content: '';

  position: absolute;

  width: 450px;
  height: 450px;

  left: -250px;
  bottom: -250px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 50%;
}

.preview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.preview-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.preview-brand span {
  margin: 0;
  white-space: nowrap;
  line-height: 1;
}

.preview-logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  object-position: center;
  display: block;
  flex: 0 0 34px;
}

.preview-contactless {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-left: 16px;
  font-size: 21px;
  line-height: 1;
  opacity: 0.9;
  flex: 0 0 30px;
}

.auth-visual-glow {
  position: absolute;

  width: 350px;
  height: 350px;

  right: 15%;
  top: 25%;

  background: rgba(94, 211, 238, 0.15);

  border-radius: 50%;

  filter: blur(70px);
}
/* =========================================================
   FADED CURRENCY BACKGROUND
========================================================= */

.currency-background {
  position: absolute;

  inset: 0;

  z-index: 0;

  overflow: hidden;

  pointer-events: none;

  user-select: none;
}

.currency-symbol {
  position: absolute;

  display: block;

  color: rgba(255, 255, 255, 0.1);

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;

  font-weight: 700;

  line-height: 1;

  pointer-events: none;

  filter: blur(0.2px);

  transform-origin: center;

  text-shadow: 0 0 35px rgba(139, 231, 255, 0.08);
}
/* =========================================================
   DIGITAL GLOBAL NETWORK
========================================================= */

.global-globe {
  position: absolute;

  width: 520px;
  height: 520px;

  right: -70px;
  top: 50%;

  transform: translateY(-50%);

  border-radius: 50%;

  opacity: 0.55;

  pointer-events: none;
}

/* Main globe outline */

.global-globe::before {
  content: '';

  position: absolute;

  inset: 0;

  border: 1px solid rgba(139, 231, 255, 0.12);

  border-radius: 50%;

  box-shadow:
    0 0 60px rgba(139, 231, 255, 0.04),
    inset 0 0 70px rgba(139, 231, 255, 0.03);
}

/* Latitude / longitude arcs */

.globe-grid {
  position: absolute;

  border: 1px solid rgba(139, 231, 255, 0.1);

  border-radius: 50%;
}

/* Horizontal latitude */

.globe-grid-horizontal {
  width: 100%;
  height: 46%;

  left: 0;
  top: 27%;

  border-left-color: transparent;
  border-right-color: transparent;
}

/* Vertical longitude */

.globe-grid-vertical {
  width: 46%;
  height: 100%;

  left: 27%;
  top: 0;

  border-top-color: transparent;
  border-bottom-color: transparent;
}

/* Additional curved longitude */

.global-globe::after {
  content: '';

  position: absolute;

  width: 30%;
  height: 100%;

  left: 35%;
  top: 0;

  border-left: 1px solid rgba(139, 231, 255, 0.07);
  border-right: 1px solid rgba(139, 231, 255, 0.07);

  border-radius: 50%;
}

/* =========================================================
   NETWORK NODES
========================================================= */
.global-globe {
  background-image: radial-gradient(circle, rgba(139, 231, 255, 0.22) 1px, transparent 1.5px);

  background-size: 12px 12px;

  mask-image: radial-gradient(ellipse at center, black 0%, rgba(0, 0, 0, 0.8) 45%, transparent 72%);

  -webkit-mask-image: radial-gradient(
    ellipse at center,
    black 0%,
    rgba(0, 0, 0, 0.8) 45%,
    transparent 72%
  );
}
.globe-node {
  position: absolute;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #8be7ff;

  box-shadow:
    0 0 10px rgba(139, 231, 255, 0.7),
    0 0 22px rgba(139, 231, 255, 0.25);

  opacity: 0.65;
}

.node-1 {
  top: 18%;
  left: 36%;
}

.node-2 {
  top: 32%;
  left: 72%;
}

.node-3 {
  top: 51%;
  left: 22%;
}

.node-4 {
  top: 61%;
  left: 67%;
}

.node-5 {
  top: 77%;
  left: 42%;
}

.node-6 {
  top: 40%;
  left: 49%;
}

/* Large € */

.currency-euro {
  top: 7%;
  right: 18%;

  font-size: 180px;

  opacity: 0.55;

  transform: rotate(-8deg);
}

/* Large $ */

.currency-dollar {
  top: 13%;
  right: -3%;

  font-size: 210px;

  opacity: 0.45;

  transform: rotate(7deg);
}

/* Large £ */

.currency-pound {
  top: 43%;
  right: 25%;

  font-size: 165px;

  opacity: 0.38;

  transform: rotate(-12deg);
}

/* Large ¥ */

.currency-yen {
  bottom: 7%;
  right: 12%;

  font-size: 190px;

  opacity: 0.3;

  transform: rotate(9deg);
}

/* Smaller € */

.currency-euro-small {
  bottom: 4%;
  left: 44%;

  font-size: 110px;

  opacity: 0.2;

  transform: rotate(-15deg);
}

/* Smaller $ */

.currency-dollar-small {
  top: 35%;
  left: 45%;

  font-size: 95px;

  opacity: 0.18;

  transform: rotate(10deg);
}

/* Smaller ¥ */

.currency-yen-small {
  bottom: 23%;
  right: 48%;

  font-size: 85px;

  opacity: 0.16;

  transform: rotate(-6deg);
}

/* =========================================================
   BRAND
========================================================= */

.auth-brand {
  position: relative;
  z-index: 2;

  display: inline-flex;
  align-items: center;
  gap: 12px;

  width: fit-content;

  color: white;

  text-decoration: none;

  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.auth-brand-mark {
  width: 38px;
  height: 38px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: rgba(255, 255, 255, 0.14);

  border: 1px solid rgba(255, 255, 255, 0.18);

  font-size: 18px;
  font-weight: 800;
}

/* =========================================================
   VISUAL CONTENT
========================================================= */

.auth-visual-content {
  position: relative;
  z-index: 2;

  max-width: 570px;

  margin: auto 0;
}

.auth-eyebrow {
  display: inline-block;

  margin-bottom: 18px;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;

  color: rgba(255, 255, 255, 0.65);
}

.auth-visual-content h1 {
  margin: 0;

  font-size: clamp(42px, 5vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.055em;
  font-weight: 800;
}

.auth-visual-content h1 span {
  display: block;

  color: #8be7ff;
}

.auth-visual-content p {
  max-width: 470px;

  margin: 28px 0 0;

  font-size: 17px;
  line-height: 1.65;

  color: rgba(255, 255, 255, 0.72);
}

/* =========================================================
   CARD PREVIEW
========================================================= */

.auth-card-preview {
  width: min(390px, 100%);

  margin-top: 48px;

  padding: 22px 24px 24px;

  border-radius: 22px;

  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.07));

  border: 1px solid rgba(255, 255, 255, 0.18);

  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(20px);
}

.banking-logo-image {
  width: 38px;
  height: 38px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}

.preview-top,
.preview-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-top {
  font-size: 13px;
  font-weight: 700;
}

.preview-chip {
  width: 42px;
  height: 32px;

  margin-top: 32px;

  border-radius: 7px;

  background: linear-gradient(135deg, #f7d794, #d7a84e);
}

.preview-number {
  margin-top: 24px;

  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.075em;
  white-space: nowrap;
}

.preview-bottom {
  margin-top: 24px;

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;

  color: rgba(255, 255, 255, 0.7);
}

.preview-bottom span {
  line-height: 1;
}

@media (max-width: 1100px) and (min-width: 901px) {
  .auth-card-preview {
    width: min(360px, 100%);
  }

  .preview-number {
    font-size: 15px;
    letter-spacing: 0.055em;
  }
}

/* =========================================================
   VISUAL FOOTER
========================================================= */

.auth-visual-footer {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 9px;

  font-size: 12px;

  color: rgba(255, 255, 255, 0.6);
}

.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #6ee7b7;

  box-shadow: 0 0 0 5px rgba(110, 231, 183, 0.12);
}

/* =========================================================
   FORM AREA
========================================================= */

.auth-form-area {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 48px 7%;
}

.auth-form-container {
  width: min(460px, 100%);
}

/* =========================================================
   MOBILE BRAND
========================================================= */

.mobile-brand {
  display: none;

  align-items: center;
  gap: 10px;

  margin-bottom: 50px;

  font-size: 17px;
  font-weight: 700;
  color: #062f59;
}

.mobile-brand .auth-brand-mark {
  color: white;

  background: #07559b;
}

/* =========================================================
   FORM HEADING
========================================================= */

.form-heading {
  margin-bottom: 36px;
}

.form-label {
  display: inline-block;

  margin-bottom: 12px;

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;

  color: #07559b;
}

.form-heading h2 {
  margin: 0;

  font-size: 42px;
  line-height: 1.05;
  letter-spacing: -0.045em;

  color: #071d33;
}

.form-heading p {
  margin: 14px 0 0;

  font-size: 15px;
  line-height: 1.6;

  color: #6b7c8f;
}

/* =========================================================
   FORM
========================================================= */

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-group label,
.label-row label {
  font-size: 13px;
  font-weight: 700;

  color: #18324a;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-group input {
  width: 100%;

  box-sizing: border-box;

  padding: 14px 15px;

  border: 1px solid #d8e0e8;

  border-radius: 11px;

  background: #ffffff;

  color: #071d33;

  font-size: 14px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #a2afbd;
}

.form-group input:focus {
  border-color: #2878c8;

  box-shadow: 0 0 0 4px rgba(40, 120, 200, 0.1);
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 72px;
}

.password-toggle {
  position: absolute;

  right: 13px;
  top: 50%;

  transform: translateY(-50%);

  border: 0;

  background: transparent;

  color: #2878c8;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

.forgot-password {
  border: 0;

  padding: 0;

  background: transparent;

  color: #2878c8;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

.remember-row {
  margin-top: -2px;
}

.remember-label {
  display: inline-flex;

  align-items: center;
  gap: 9px;

  font-size: 13px;

  color: #607287;

  cursor: pointer;
}

.remember-label input {
  width: 15px;
  height: 15px;

  accent-color: #07559b;
}

.error-message {
  padding: 12px 14px;

  border: 1px solid #fecaca;

  border-radius: 10px;

  background: #fef2f2;

  color: #b91c1c;

  font-size: 13px;
  line-height: 1.5;
}

.auth-submit {
  width: 100%;

  min-height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border: 0;

  border-radius: 11px;

  background: #07559b;

  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  background: #064781;

  transform: translateY(-1px);
}

.auth-submit:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* =========================================================
   TWO-FACTOR
========================================================= */

.two-factor-input {
  text-align: center;

  font-family: monospace;

  font-size: 24px !important;
  font-weight: 700;

  letter-spacing: 0.35em;

  padding-left: 24px !important;
}

.input-help {
  font-size: 12px;
  line-height: 1.5;

  color: #7b8b9b;
}

.back-to-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  width: 100%;

  margin-top: 22px;

  padding: 0;

  border: 0;

  background: transparent;

  color: #07559b;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
}

.two-factor-security-note {
  margin-top: 28px !important;

  text-align: center;
}

/* =========================================================
   DIVIDER
========================================================= */

.auth-divider {
  display: flex;
  align-items: center;
  gap: 15px;

  margin: 30px 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';

  flex: 1;

  height: 1px;

  background: #e4e9ef;
}

.auth-divider span {
  font-size: 10px;
  font-weight: 700;

  color: #9aa7b4;

  letter-spacing: 0.12em;
}

/* =========================================================
   REGISTER
========================================================= */

.register-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 13px;

  color: #7a8999;
}

.register-prompt a {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  color: #07559b;

  font-weight: 700;

  text-decoration: none;
}

.register-prompt a:hover {
  text-decoration: underline;
}

/* =========================================================
   LEGAL
========================================================= */

.auth-legal {
  margin: 32px 0 0;

  font-size: 11px;
  line-height: 1.7;

  text-align: center;

  color: #9aa7b4;
}

.auth-legal a {
  color: #6c7e91;

  text-decoration: underline;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .auth-visual {
    display: none;
  }

  .auth-form-area {
    min-height: 100vh;

    padding: 36px 24px;
  }

  .mobile-brand {
    display: flex;
  }
}

@media (max-width: 500px) {
  .auth-form-area {
    padding: 28px 20px;
  }

  .form-heading h2 {
    font-size: 34px;
  }

  .mobile-brand {
    margin-bottom: 40px;
  }

  .two-factor-input {
    font-size: 21px !important;

    letter-spacing: 0.25em;
  }
}
</style>

```
