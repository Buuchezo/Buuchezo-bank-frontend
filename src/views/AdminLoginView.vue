<template>
  <main class="admin-login-page">
    <div class="admin-login-visual">
      <div class="visual-glow"></div>

      <RouterLink to="/" class="brand">
        <span class="brand-mark">B</span>
        <span>Buuchezo Bank</span>
      </RouterLink>

      <div class="visual-content">
        <span class="eyebrow">ADMINISTRATION PORTAL</span>

        <h1>
          Secure control,
          <span>secure banking.</span>
        </h1>

        <p>
          Administrative access is protected separately from customer banking.
          Sign in with your administrator credentials to continue.
        </p>

        <div class="security-card">
          <div class="security-icon"></div>

          <div>
            <strong>Administrative access</strong>
            <span>Separate authentication session</span>
          </div>
        </div>
      </div>

      <div class="visual-footer">
        <span class="status-dot"></span>
        Secure administration environment
      </div>
    </div>

    <div class="admin-login-form-area">
      <div class="admin-login-container">

        <div class="mobile-brand">
          <span class="brand-mark">B</span>
          <span>Buuchezo Bank</span>
        </div>

        <div class="form-heading">
          <span class="form-label">ADMIN SIGN IN</span>

          <h2>Welcome, administrator.</h2>

          <p>
            Enter your administrator credentials to access the banking
            administration portal.
          </p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">

          <div class="form-group">
            <label for="admin-email">Email address</label>

            <input
              id="admin-email"
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-group">
            <label for="admin-password">Password</label>

            <div class="password-input">
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your administrator password"
                autocomplete="current-password"
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

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="login-submit"
            :disabled="isLoading"
          >
            <span>
              {{ isLoading ? 'Signing in...' : 'Sign in as administrator' }}
            </span>

            <ArrowUpRight :size="17" />
          </button>
        </form>

        <div class="security-note">
          <span class="security-note-icon"></span>

          <div>
            <strong>Separate administrator authentication</strong>

            <p>
              Administrator credentials are authenticated independently from
              customer accounts.
            </p>
          </div>
        </div>

        <div class="customer-login">
          <span>Looking for customer banking?</span>

          <RouterLink to="/login">
            Customer sign in
            <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <p class="legal">
          Authorized administrators only. All administrative actions are
          protected by role-based authorization.
        </p>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'

interface AdminLoginResponse {
  statusCode: number
  message: string
  data?: {
    token?: string
  }
}

const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const result: AdminLoginResponse = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || 'Administrator login failed. Please check your credentials.',
      )
    }

    const token = result.data?.token

    if (!token) {
      throw new Error('Invalid administrator login response from server.')
    }

    /*
     * Administrator authentication has its own storage key.
     *
     * This is deliberately NOT "accessToken".
     * Customer authentication uses "accessToken".
     */
    localStorage.setItem('adminAccessToken', token)

    /*
     * Store a minimal admin identity.
     *
     * The backend admin JWT is the authoritative source of
     * administrative authorization.
     */
    const adminUser = {
      email: email.value,
      role: 'ADMIN',
    }

    localStorage.setItem('adminUser', JSON.stringify(adminUser))

    /*
     * Administrator authentication is now complete.
     */
    await router.push('/admin/dashboard')
  } catch (error) {
    console.error('Admin login error:', error)

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  background: #ffffff;
}

.admin-login-visual {
  position: relative;
  min-height: 100vh;
  padding: 42px 7%;
  display: flex;
  flex-direction: column;
  color: white;
  background: linear-gradient(145deg, #071f38 0%, #0b477d 55%, #163b8f 100%);
  overflow: hidden;
}

.admin-login-visual::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  right: -250px;
  top: -180px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.admin-login-visual::after {
  content: '';
  position: absolute;
  width: 450px;
  height: 450px;
  left: -250px;
  bottom: -250px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.visual-glow {
  position: absolute;
  width: 350px;
  height: 350px;
  right: 15%;
  top: 25%;
  background: rgba(94, 211, 238, 0.12);
  border-radius: 50%;
  filter: blur(70px);
}

.brand {
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

.brand-mark {
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

.visual-content {
  position: relative;
  z-index: 2;
  max-width: 570px;
  margin: auto 0;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.65);
}

.visual-content h1 {
  margin: 0;
  font-size: clamp(42px, 5vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.055em;
  font-weight: 800;
}

.visual-content h1 span {
  display: block;
  color: #8be7ff;
}

.visual-content p {
  max-width: 470px;
  margin: 28px 0 0;
  font-size: 17px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

.security-card {
  width: min(390px, 100%);
  margin-top: 48px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
}

.security-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(110, 231, 183, 0.15);
  color: #6ee7b7;
  font-size: 20px;
  font-weight: 800;
}

.security-card strong {
  display: block;
  font-size: 14px;
}

.security-card span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.visual-footer {
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

.admin-login-form-area {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 7%;
}

.admin-login-container {
  width: min(460px, 100%);
}

.mobile-brand {
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 50px;
  font-size: 17px;
  font-weight: 700;
  color: #071f38;
}

.mobile-brand .brand-mark {
  color: white;
  background: #0b477d;
}

.form-heading {
  margin-bottom: 36px;
}

.form-label {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #0b477d;
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #18324a;
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

.error-message {
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
  line-height: 1.5;
}

.login-submit {
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 11px;
  background: #0b477d;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
}

.login-submit:hover:not(:disabled) {
  background: #08385f;
  transform: translateY(-1px);
}

.login-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.security-note {
  margin-top: 28px;
  padding: 15px;
  display: flex;
  gap: 12px;
  border: 1px solid #e3eaf1;
  border-radius: 12px;
  background: #f8fafc;
}

.security-note-icon {
  flex-shrink: 0;
  font-size: 15px;
}

.security-note strong {
  display: block;
  font-size: 12px;
  color: #18324a;
}

.security-note p {
  margin: 5px 0 0;
  font-size: 11px;
  line-height: 1.5;
  color: #718096;
}

.customer-login {
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #7a8999;
}

.customer-login a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #0b477d;
  font-weight: 700;
  text-decoration: none;
}

.customer-login a:hover {
  text-decoration: underline;
}

.legal {
  margin: 28px 0 0;
  font-size: 11px;
  line-height: 1.7;
  text-align: center;
  color: #9aa7b4;
}

@media (max-width: 900px) {
  .admin-login-page {
    grid-template-columns: 1fr;
  }

  .admin-login-visual {
    display: none;
  }

  .admin-login-form-area {
    min-height: 100vh;
    padding: 36px 24px;
  }

  .mobile-brand {
    display: flex;
  }
}

@media (max-width: 500px) {
  .admin-login-form-area {
    padding: 28px 20px;
  }

  .form-heading h2 {
    font-size: 34px;
  }

  .mobile-brand {
    margin-bottom: 40px;
  }
}

</style>
