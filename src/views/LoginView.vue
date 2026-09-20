<template>
  <main class="auth-page">
    <!-- =====================================================
         LEFT VISUAL
    ====================================================== -->
    <div class="auth-visual">
      <div class="auth-visual-glow"></div>

      <RouterLink to="/" class="auth-brand">
        <span class="auth-brand-mark">B</span>
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
            <span>Buuchezo Bank</span>
            <span>◉</span>
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

        <!-- Heading -->
        <div class="form-heading">
          <span class="form-label">SIGN IN</span>

          <h2>Welcome back.</h2>

          <p>Enter your details to access your account.</p>
        </div>

        <!-- Login form -->
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
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const isLoading = ref(false)
const errorMessage = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Login failed. Please check your credentials.')
    }

    /*
     * Backend response:
     *
     * {
     *   statusCode: 200,
     *   message: "User logged in successfully",
     *   data: {
     *     token: "...",
     *     user: {
     *       id: 1,
     *       email: "...",
     *       firstName: "...",
     *       lastName: "...",
     *       enabled: true,
     *       roles: [...]
     *     }
     *   }
     * }
     */

    const token = result?.data?.token
    const user = result?.data?.user

    if (!token || !user) {
      throw new Error('Invalid login response from server.')
    }

    /*
     * If "Remember me" is checked:
     *
     * localStorage
     *
     * Otherwise:
     *
     * sessionStorage
     */

    const storage = rememberMe.value ? localStorage : sessionStorage

    storage.setItem('accessToken', token)
    storage.setItem('user', JSON.stringify(user))

    /*
     * Check the user's backend role.
     *
     * ADMIN users go to the administration dashboard.
     * All other users go to the normal customer dashboard.
     */

    const isAdmin = user.roles?.some((role: { name: string }) => role.name === 'ADMIN')

    if (isAdmin) {
      await router.push('/admin/dashboard')
    } else {
      await router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)

    errorMessage.value =
      error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}

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
   BRAND
========================================================= */

.auth-brand {
  position: relative;
  z-index: 2;

  display: inline-flex;

  align-items: center;
  gap: 10px;

  width: fit-content;

  color: white;

  font-size: 17px;
  font-weight: 800;

  text-decoration: none;
}

.auth-brand-mark {
  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #082f56;
  background: white;

  border-radius: 8px;

  font-size: 17px;
  font-weight: 900;
}

/* =========================================================
   VISUAL CONTENT
========================================================= */

.auth-visual-content {
  position: relative;
  z-index: 2;

  max-width: 540px;

  margin: auto 0;
}

.auth-eyebrow {
  display: block;

  margin-bottom: 20px;

  color: rgba(255, 255, 255, 0.58);

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.16em;
}

.auth-visual-content h1 {
  margin: 0;

  font-size: clamp(48px, 5vw, 72px);

  line-height: 0.98;

  letter-spacing: -0.055em;
}

.auth-visual-content h1 span {
  display: block;

  color: #8dd7ee;
}

.auth-visual-content > p {
  max-width: 430px;

  margin: 25px 0 40px;

  color: rgba(255, 255, 255, 0.66);

  font-size: 15px;
  line-height: 1.75;
}

/* =========================================================
   CARD PREVIEW
========================================================= */

.auth-card-preview {
  width: min(390px, 90%);

  aspect-ratio: 410 / 247;

  padding: 23px;

  background: linear-gradient(145deg, #084b84, #0862a8 55%, #233fc0);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 15px;

  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);

  transform: perspective(1000px) rotateY(-10deg) rotateZ(-4deg);
}

.preview-top {
  display: flex;
  justify-content: space-between;

  font-size: 11px;
  font-weight: 700;
}

.preview-chip {
  width: 43px;
  height: 31px;

  margin-top: 38px;

  background: #d2b16c;

  border-radius: 5px;
}

.preview-number {
  margin-top: 23px;

  font-size: 17px;

  letter-spacing: 0.12em;
}

.preview-bottom {
  display: flex;
  justify-content: space-between;

  margin-top: 25px;

  color: rgba(255, 255, 255, 0.58);

  font-size: 7px;
  letter-spacing: 0.12em;
}

.auth-visual-footer {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 9px;

  color: rgba(255, 255, 255, 0.48);

  font-size: 9px;
}

.status-dot {
  width: 7px;
  height: 7px;

  background: #5dd39e;

  border-radius: 50%;
}

/* =========================================================
   FORM AREA
========================================================= */

.auth-form-area {
  min-height: 100vh;

  display: flex;
  align-items: center;

  padding: 60px 8%;
}

.auth-form-container {
  width: 100%;
  max-width: 450px;

  margin: 0 auto;
}

/* =========================================================
   MOBILE BRAND
========================================================= */

.mobile-brand {
  display: none;
}

/* =========================================================
   HEADING
========================================================= */

.form-label {
  display: block;

  margin-bottom: 15px;

  color: #0b4878;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.form-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 43px;

  line-height: 1;

  letter-spacing: -0.04em;
}

.form-heading p {
  margin: 14px 0 35px;

  color: #81909d;

  font-size: 14px;
}

/* =========================================================
   FORM
========================================================= */

.auth-form {
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
  color: #304b5e;

  font-size: 12px;
  font-weight: 700;
}

.label-row {
  display: flex;
  justify-content: space-between;
}

.forgot-password {
  padding: 0;

  color: #0b5da7;

  background: none;
  border: 0;

  font-family: inherit;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;
}

.form-group input {
  width: 100%;

  height: 50px;

  padding: 0 15px;

  color: #29465a;

  background: #f8fafc;

  border: 1px solid #dfe8ee;

  border-radius: 7px;

  outline: none;

  font-family: inherit;

  font-size: 13px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus {
  border-color: #0b5da7;

  box-shadow: 0 0 0 3px rgba(11, 93, 167, 0.08);
}

.form-group input::placeholder {
  color: #a8b3bc;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 60px;
}

.password-toggle {
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  padding: 0;

  color: #0b5da7;

  background: none;
  border: 0;

  font-family: inherit;

  font-size: 10px;
  font-weight: 700;

  cursor: pointer;
}

/* =========================================================
   REMEMBER
========================================================= */

.remember-row {
  margin-top: -5px;
}

.remember-label {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  color: #7e8e9a;

  font-size: 11px;

  cursor: pointer;
}

.remember-label input {
  accent-color: #0b4878;
}

/* =========================================================
   ERROR
========================================================= */

.error-message {
  padding: 12px 14px;

  color: #b42318;

  background: #fff4f2;

  border: 1px solid #ffd8d2;

  border-radius: 7px;

  font-size: 11px;

  line-height: 1.5;
}

/* =========================================================
   SUBMIT
========================================================= */

.auth-submit {
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 12px 0 20px;

  color: white;

  background: #0b4878;

  border: 0;
  border-radius: 7px;

  font-family: inherit;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  background: #082f56;

  transform: translateY(-1px);
}

.auth-submit:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

.auth-submit svg {
  width: 32px;
  height: 32px;

  padding: 7px;

  background: rgba(255, 255, 255, 0.13);

  border-radius: 5px;
}

/* =========================================================
   DIVIDER
========================================================= */

.auth-divider {
  display: flex;
  align-items: center;

  gap: 14px;

  margin: 30px 0 22px;

  color: #a6b1ba;

  font-size: 8px;
  font-weight: 700;
}

.auth-divider::before,
.auth-divider::after {
  content: '';

  height: 1px;

  flex: 1;

  background: #e6edf1;
}

/* =========================================================
   REGISTER
========================================================= */

.register-prompt {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  color: #84939e;

  font-size: 11px;
}

.register-prompt a {
  display: inline-flex;

  align-items: center;

  gap: 4px;

  color: #0b5da7;

  font-weight: 800;

  text-decoration: none;
}

/* =========================================================
   LEGAL
========================================================= */

.auth-legal {
  margin: 30px auto 0;

  max-width: 360px;

  color: #a0acb5;

  font-size: 9px;

  line-height: 1.6;

  text-align: center;
}

.auth-legal a {
  color: #6d8190;

  text-decoration: underline;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 800px) {
  .auth-page {
    display: block;
  }

  .auth-visual {
    display: none;
  }

  .auth-form-area {
    min-height: 100vh;

    padding: 35px 20px;
  }

  .mobile-brand {
    display: inline-flex;

    align-items: center;
    gap: 9px;

    margin-bottom: 65px;

    color: #082f56;

    font-size: 16px;
    font-weight: 800;
  }

  .mobile-brand .auth-brand-mark {
    width: 32px;
    height: 32px;

    color: white;

    background: #0b4878;

    font-size: 15px;
  }

  .form-heading h2 {
    font-size: 40px;
  }

  .auth-form-container {
    max-width: 500px;
  }
}

@media (max-width: 380px) {
  .auth-form-area {
    padding: 25px 16px;
  }

  .mobile-brand {
    margin-bottom: 50px;
  }

  .form-heading h2 {
    font-size: 36px;
  }
}
</style>
