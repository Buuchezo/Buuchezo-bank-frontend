<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import buuchezoBankLogo from '@/assets/images/buuchezobank-logo.png'

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
} from 'lucide-vue-next'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const acceptedTerms = ref(false)

const passwordStrength = computed(() => {
  const value = password.value

  if (!value) {
    return {
      score: 0,
      label: '',
    }
  }

  let score = 0

  if (value.length >= 8) score++
  if (/[A-Z]/.test(value)) score++
  if (/[a-z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++

  if (score <= 2) {
    return {
      score,
      label: 'Weak',
    }
  }

  if (score <= 3) {
    return {
      score,
      label: 'Fair',
    }
  }

  if (score <= 4) {
    return {
      score,
      label: 'Good',
    }
  }

  return {
    score,
    label: 'Strong',
  }
})

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) {
    return true
  }

  return password.value === confirmPassword.value
})

const canSubmit = computed(() => {
  return (
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value !== '' &&
    confirmPassword.value !== '' &&
    password.value === confirmPassword.value &&
    acceptedTerms.value &&
    !loading.value
  )
})

function validateForm() {
  errorMessage.value = ''

  if (!firstName.value.trim()) {
    errorMessage.value = 'Please enter your first name.'
    return false
  }

  if (!lastName.value.trim()) {
    errorMessage.value = 'Please enter your last name.'
    return false
  }

  if (!email.value.trim()) {
    errorMessage.value = 'Please enter your email address.'
    return false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email.value.trim())) {
    errorMessage.value = 'Please enter a valid email address.'
    return false
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must contain at least 8 characters.'
    return false
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Your passwords do not match.'
    return false
  }

  if (!acceptedTerms.value) {
    errorMessage.value = 'Please accept the terms and conditions to continue.'
    return false
  }

  return true
}

async function register() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      }),
    })

    let result: {
      statusCode?: number
      message?: string
      data?: unknown
    }

    try {
      result = await response.json()
    } catch {
      throw new Error('The server returned an invalid response.')
    }

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed. Please try again.')
    }

    successMessage.value =
      result.message || 'Your account has been created successfully.'

    /*
     * Registration does not automatically store a token.
     *
     * The user should log in through the normal login
     * flow after registration.
     */

    window.setTimeout(() => {
      router.push({
        path: '/login',
        query: {
          registered: 'true',
        },
      })
    }, 1500)
  } catch (error) {
    console.error('Registration failed:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="register-page">
    <!-- LEFT SIDE -->
    <section class="register-visual">
      <div class="visual-background" />

      <div class="visual-content">
        <RouterLink to="/" class="brand">
          <img
            :src="buuchezoBankLogo"
            alt="Buuchezo Bank"
            class="register-brand-logo"
          />

          <strong>Buuchezo Bank</strong>
        </RouterLink>

        <div class="visual-copy">
          <p class="visual-eyebrow">WELCOME TO BUUCHEZO BANK</p>

          <h1>
            Start building
            <span>your future.</span>
          </h1>

          <p>
            Open your Buuchezo Bank account and manage your money with confidence.
          </p>
        </div>

        <!-- CARD -->
        <div class="visual-card">
          <div class="card-top">
            <div class="card-brand">
              <img
                :src="buuchezoBankLogo"
                alt="Buuchezo Bank"
                class="card-brand-logo"
              />

              <strong>Buuchezo</strong>
            </div>

            <span class="card-type"> VISA </span>
          </div>

          <div class="card-chip">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div class="card-number">
            •••• &nbsp; •••• &nbsp; •••• &nbsp; 3456
          </div>

          <div class="card-bottom">
            <div>
              <span>CARD HOLDER</span>
              <strong>YOUR NAME</strong>
            </div>

            <div>
              <span>VALID THRU</span>
              <strong>12/29</strong>
            </div>
          </div>
        </div>

        <!-- SECURITY -->
        <div class="visual-security">
          <div class="security-icon">
            <ShieldCheck :size="18" />
          </div>

          <div>
            <strong>Secure banking</strong>

            <span>Your account is protected by design.</span>
          </div>

          <Check :size="17" />
        </div>
      </div>
    </section>

    <!-- RIGHT SIDE -->
    <section class="register-form-section">
      <div class="register-container">
        <div class="mobile-brand">
          <RouterLink to="/" class="brand">
            <img
              :src="buuchezoBankLogo"
              alt="Buuchezo Bank"
              class="register-brand-logo"
            />

            <strong>Buuchezo Bank</strong>
          </RouterLink>
        </div>

        <div class="form-header">
          <div class="form-icon">
            <UserPlus :size="22" />
          </div>

          <p class="eyebrow">CREATE YOUR ACCOUNT</p>

          <h2>Welcome to Buuchezo Bank.</h2>

          <p>Create your account in a few simple steps.</p>
        </div>

        <!-- ERROR -->
        <div v-if="errorMessage" class="message error-message">
          <div class="message-icon">!</div>

          <span>
            {{ errorMessage }}
          </span>
        </div>

        <!-- SUCCESS -->
        <div v-if="successMessage" class="message success-message">
          <div class="message-icon">
            <Check :size="15" />
          </div>

          <span>
            {{ successMessage }}
          </span>
        </div>

        <!-- FORM -->
        <form class="register-form" @submit.prevent="register">
          <!-- NAME -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First name</label>

              <input
                id="firstName"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                placeholder="Kennedy"
                :disabled="loading"
              />
            </div>

            <div class="form-group">
              <label for="lastName">Last name</label>

              <input
                id="lastName"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                placeholder="Buchichi"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- EMAIL -->
          <div class="form-group">
            <label for="email">Email address</label>

            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :disabled="loading"
            />
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <label for="password">Password</label>

            <div class="password-wrapper">
              <LockKeyhole :size="17" class="field-icon" />

              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Create a secure password"
                :disabled="loading"
              />

              <button
                type="button"
                class="password-toggle"
                :disabled="loading"
                :aria-label="
                  showPassword ? 'Hide password' : 'Show password'
                "
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="17" />
                <Eye v-else :size="17" />
              </button>
            </div>

            <!-- PASSWORD STRENGTH -->
            <div v-if="password" class="password-strength">
              <div class="strength-bars">
                <span
                  v-for="index in 5"
                  :key="index"
                  :class="{
                    filled: index <= passwordStrength.score,
                  }"
                />
              </div>

              <span
                :class="{
                  strong: passwordStrength.score >= 4,
                }"
              >
                {{ passwordStrength.label }}
              </span>
            </div>

            <small class="field-hint">
              Use at least 8 characters with a mix of letters, numbers and
              symbols.
            </small>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="form-group">
            <label for="confirmPassword">Confirm password</label>

            <div
              class="password-wrapper"
              :class="{
                invalid: confirmPassword && !passwordsMatch,
              }"
            >
              <LockKeyhole :size="17" class="field-icon" />

              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Repeat your password"
                :disabled="loading"
              />

              <button
                type="button"
                class="password-toggle"
                :disabled="loading"
                :aria-label="
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <EyeOff v-if="showConfirmPassword" :size="17" />
                <Eye v-else :size="17" />
              </button>
            </div>

            <small
              v-if="confirmPassword && !passwordsMatch"
              class="validation-message"
            >
              Passwords do not match.
            </small>
          </div>

          <!-- TERMS -->
          <label class="terms">
            <input
              v-model="acceptedTerms"
              type="checkbox"
              :disabled="loading"
            />

            <span class="custom-checkbox">
              <Check :size="12" />
            </span>

            <span class="terms-text">
              I agree to the
              <a href="#" @click.prevent>Terms &amp; Conditions</a>
              and
              <a href="#" @click.prevent>Privacy Policy</a>.
            </span>
          </label>

          <!-- SUBMIT -->
          <button
            type="submit"
            class="register-button"
            :disabled="!canSubmit"
          >
            <span>
              {{ loading ? 'Creating account...' : 'Create account' }}
            </span>

            <ArrowRight v-if="!loading" :size="18" />

            <span v-else class="button-spinner" />
          </button>
        </form>

        <!-- LOGIN -->
        <div class="login-link">
          <span>Already have an account?</span>

          <RouterLink to="/login">
            Sign in
            <ArrowUpRight :size="14" />
          </RouterLink>
        </div>

        <!-- LEGAL -->
        <div class="legal">
          <ShieldCheck :size="13" />

          <span>
            Your information is securely transmitted and protected.
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 46% 54%;
  background: #ffffff;
  color: #10243e;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* =========================
   LEFT VISUAL
========================= */

.register-visual {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 43px 58px;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.visual-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 75% 25%,
      rgba(49, 133, 207, 0.42),
      transparent 31%
    ),
    radial-gradient(
      circle at 20% 85%,
      rgba(11, 82, 147, 0.5),
      transparent 34%
    ),
    linear-gradient(145deg, #042f5c 0%, #07559b 52%, #123e9b 100%);
}

.visual-background::before {
  content: '';
  position: absolute;
  width: 620px;
  height: 620px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 50%;
  right: -270px;
  top: -170px;
}

.visual-background::after {
  content: '';
  position: absolute;
  width: 450px;
  height: 450px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 50%;
  left: -280px;
  bottom: -230px;
}

.visual-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 560px;
  margin: auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  color: #ffffff;
}

.register-brand-logo {
  width: 38px;
  height: 38px;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}

.brand strong {
  font-size: 16px;
  letter-spacing: -0.3px;
}

.visual-copy {
  margin-top: 95px;
}

.visual-eyebrow,
.eyebrow {
  margin: 0 0 10px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.visual-eyebrow {
  color: rgba(255, 255, 255, 0.58);
}

.visual-copy h1 {
  margin: 0;
  max-width: 460px;
  font-size: clamp(37px, 4vw, 57px);
  line-height: 1.03;
  letter-spacing: -2.2px;
  font-weight: 750;
}

.visual-copy h1 span {
  display: block;
  color: #8fd0ff;
}

.visual-copy > p {
  max-width: 420px;
  margin: 22px 0 0;
  color: rgba(255, 255, 255, 0.67);
  font-size: 13px;
  line-height: 1.7;
}

/* =========================
   VISUAL CARD
========================= */

.visual-card {
  width: min(100%, 430px);
  min-height: 245px;
  margin-top: 52px;
  border-radius: 19px;
  padding: 24px 26px;
  background:
    radial-gradient(
      circle at 88% 15%,
      rgba(89, 174, 237, 0.38),
      transparent 28%
    ),
    linear-gradient(135deg, #126aa9, #1741a7);
  box-shadow:
    0 25px 55px rgba(1, 26, 55, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
}

.visual-card::before {
  content: '';
  position: absolute;
  width: 270px;
  height: 270px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  right: -100px;
  top: -130px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-brand-logo {
  width: 29px;
  height: 29px;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}

.card-brand strong {
  font-size: 12px;
}

.card-type {
  font-size: 14px;
  font-weight: 800;
  font-style: italic;
}

.card-chip {
  width: 42px;
  height: 31px;
  border-radius: 6px;
  background: #d9ba72;
  margin-top: 37px;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
}

.card-chip span {
  border: 1px solid rgba(70, 55, 20, 0.4);
  border-radius: 2px;
}

.card-number {
  margin-top: 20px;
  font-family: 'Courier New', monospace;
  font-size: 17px;
  letter-spacing: 1px;
}

.card-bottom {
  display: flex;
  gap: 27px;
  margin-top: 22px;
}

.card-bottom span,
.card-bottom strong {
  display: block;
}

.card-bottom span {
  color: rgba(255, 255, 255, 0.47);
  font-size: 6px;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.card-bottom strong {
  font-size: 8px;
  letter-spacing: 0.7px;
}

/* =========================
   SECURITY
========================= */

.visual-security {
  width: min(100%, 430px);
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.06);
}

.security-icon {
  width: 33px;
  height: 33px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
}

.visual-security div:nth-child(2) {
  flex: 1;
}

.visual-security strong,
.visual-security span {
  display: block;
}

.visual-security strong {
  font-size: 10px;
  margin-bottom: 3px;
}

.visual-security span {
  color: rgba(255, 255, 255, 0.5);
  font-size: 9px;
}

/* =========================
   FORM SIDE
========================= */

.register-form-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 45px 60px;
  overflow-y: auto;
}

.register-container {
  width: 100%;
  max-width: 480px;
}

.mobile-brand {
  display: none;
}

.form-header {
  margin-bottom: 27px;
}

.form-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  background: #eaf3fb;
  color: #07559b;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
}

.form-header .eyebrow {
  color: #07559b;
  margin-bottom: 7px;
}

.form-header h2 {
  margin: 0;
  color: #122a45;
  font-size: 29px;
  letter-spacing: -1px;
  line-height: 1.1;
}

.form-header > p:last-child {
  margin: 9px 0 0;
  color: #8e9cac;
  font-size: 12px;
}

/* =========================
   MESSAGES
========================= */

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 9px;
  padding: 11px 13px;
  margin-bottom: 17px;
  font-size: 10px;
  line-height: 1.5;
}

.message-icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-weight: 800;
}

.error-message {
  background: #fff3f3;
  border: 1px solid #f0d5d5;
  color: #9f4d4d;
}

.error-message .message-icon {
  background: #f5dede;
  color: #a44949;
}

.success-message {
  background: #eefaf4;
  border: 1px solid #d2ebde;
  color: #287e5b;
}

.success-message .message-icon {
  background: #d8f0e2;
  color: #287e5b;
}

/* =========================
   FORM
========================= */

.register-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.form-group label {
  display: block;
  color: #52677d;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 7px;
}

.form-group input {
  width: 100%;
  height: 45px;
  padding: 0 13px;
  border: 1px solid #dfe7ef;
  border-radius: 8px;
  background: #ffffff;
  color: #263e56;
  outline: none;
  font-size: 11px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #b2bdc8;
}

.form-group input:focus {
  border-color: #75a9d1;
  box-shadow: 0 0 0 3px rgba(7, 85, 155, 0.07);
}

.form-group input:disabled {
  background: #f7f9fb;
  cursor: not-allowed;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-left: 39px;
  padding-right: 42px;
}

.password-wrapper.invalid input {
  border-color: #d96b6b;
}

.field-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0adba;
}

.password-toggle {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #8999a9;
  display: grid;
  place-items: center;
  padding: 4px;
  cursor: pointer;
}

.password-toggle:hover {
  color: #07559b;
}

.password-toggle:disabled {
  cursor: not-allowed;
}

.password-strength {
  margin-top: 7px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.strength-bars {
  display: flex;
  gap: 3px;
  flex: 1;
}

.strength-bars span {
  height: 3px;
  flex: 1;
  background: #e4e9ee;
  border-radius: 5px;
}

.strength-bars span.filled {
  background: #07559b;
}

.password-strength > span {
  color: #8c9aa8;
  font-size: 9px;
  font-weight: 700;
  min-width: 30px;
  text-align: right;
}

.password-strength > span.strong {
  color: #2b9068;
}

.field-hint {
  display: block;
  color: #a1acb8;
  font-size: 8px;
  margin-top: 6px;
  line-height: 1.5;
}

.validation-message {
  display: block;
  color: #bd5555;
  font-size: 9px;
  margin-top: 6px;
}

/* =========================
   TERMS
========================= */

.terms {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  cursor: pointer;
  margin-top: 1px;
}

.terms input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-checkbox {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  border: 1px solid #d4dee7;
  border-radius: 4px;
  color: transparent;
  display: grid;
  place-items: center;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.terms input:checked + .custom-checkbox {
  background: #07559b;
  border-color: #07559b;
  color: #ffffff;
}

.terms-text {
  color: #8b99a7;
  font-size: 9px;
  line-height: 1.55;
}

.terms-text a {
  color: #07559b;
  text-decoration: none;
  font-weight: 700;
}

.terms-text a:hover {
  text-decoration: underline;
}

/* =========================
   BUTTON
========================= */

.register-button {
  width: 100%;
  height: 47px;
  border: 0;
  border-radius: 9px;
  background: #07559b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(7, 85, 155, 0.17);
  transition:
    background 0.2s ease,
    opacity 0.2s ease;
}

.register-button:hover:not(:disabled) {
  background: #06477f;
}

.register-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   LOGIN / LEGAL
========================= */

.login-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 21px;
  font-size: 10px;
  color: #96a2ae;
}

.login-link a {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #07559b;
  text-decoration: none;
  font-weight: 750;
}

.login-link a:hover {
  text-decoration: underline;
}

.legal {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: #adb7c0;
  font-size: 8px;
  margin-top: 28px;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1050px) {
  .register-page {
    grid-template-columns: 43% 57%;
  }

  .register-visual {
    padding: 35px 40px;
  }

  .register-form-section {
    padding: 40px;
  }

  .visual-copy {
    margin-top: 70px;
  }
}

@media (max-width: 800px) {
  .register-page {
    display: block;
  }

  .register-visual {
    display: none;
  }

  .register-form-section {
    min-height: 100vh;
    padding: 35px 25px 45px;
    align-items: flex-start;
  }

  .register-container {
    max-width: 520px;
    margin: auto;
  }

  .mobile-brand {
    display: block;
    margin-bottom: 48px;
  }

  .mobile-brand .brand {
    color: #10243e;
  }
}

@media (max-width: 550px) {
  .register-form-section {
    padding: 27px 19px 35px;
  }

  .mobile-brand {
    margin-bottom: 35px;
  }

  .form-header h2 {
    font-size: 25px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
