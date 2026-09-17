<template>
  <main class="register-page">
    <div class="register-container">
      <div class="register-header">
        <RouterLink to="/" class="register-brand">
          <span class="brand-mark">B</span>
          <span>Buuchezo Bank</span>
        </RouterLink>

        <div class="login-link">
          Already have an account?

          <RouterLink to="/login"> Sign in </RouterLink>
        </div>
      </div>

      <div class="register-content">
        <div class="register-heading">
          <span class="register-label"> CREATE YOUR ACCOUNT </span>

          <h1>
            Welcome to
            <span>Buuchezo Bank.</span>
          </h1>

          <p>Open your account in a few simple steps and start taking control of your money.</p>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-section-title">Personal information</div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName"> First name </label>

              <input id="firstName" v-model="firstName" type="text" placeholder="John" required />
            </div>

            <div class="form-group">
              <label for="lastName"> Last name </label>

              <input id="lastName" v-model="lastName" type="text" placeholder="Doe" required />
            </div>
          </div>

          <div class="form-group">
            <label for="email"> Email address </label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-section-title second-title">Account security</div>

          <div class="form-group">
            <label for="password"> Password </label>

            <div class="password-field">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password"
                autocomplete="new-password"
                required
              />

              <button type="button" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>

            <div class="password-strength">
              <span
                v-for="index in 4"
                :key="index"
                :class="{
                  active: passwordStrength >= index,
                }"
              ></span>
            </div>

            <small> Use at least 8 characters with a combination of letters and numbers. </small>
          </div>

          <div class="form-group">
            <label for="confirmPassword"> Confirm password </label>

            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Repeat your password"
              autocomplete="new-password"
              required
            />
          </div>

          <label class="terms-check">
            <input v-model="acceptedTerms" type="checkbox" required />

            <span>
              I agree to the
              <RouterLink to="/terms"> Terms & Conditions </RouterLink>
              and
              <RouterLink to="/privacy"> Privacy Policy </RouterLink>.
            </span>
          </label>

          <button type="submit" class="register-button">
            <span>Create account</span>
            <ArrowUpRight :size="17" />
          </button>
        </form>

        <div class="register-security">
          <ShieldCheck :size="18" />

          <span> Your information is protected with secure authentication. </span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, ShieldCheck } from 'lucide-vue-next'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(false)
const showPassword = ref(false)

const passwordStrength = computed(() => {
  let strength = 0

  if (password.value.length >= 8) strength++
  if (/[A-Z]/.test(password.value)) strength++
  if (/[0-9]/.test(password.value)) strength++
  if (/[^A-Za-z0-9]/.test(password.value)) strength++

  return strength
})

function handleRegister() {
  console.log('Registration UI submitted', {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
  })
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;

  background: linear-gradient(135deg, #f7fafc 0%, #ffffff 55%, #eef7fb 100%);

  padding: 35px 6% 70px;
}

.register-container {
  width: 100%;
  max-width: 1120px;

  margin: 0 auto;
}

/* =========================================================
   HEADER
========================================================= */

.register-header {
  display: flex;

  align-items: center;
  justify-content: space-between;
}

.register-brand {
  display: flex;

  align-items: center;
  gap: 10px;

  color: #082f56;

  font-size: 17px;
  font-weight: 800;

  text-decoration: none;
}

.brand-mark {
  width: 35px;
  height: 35px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 8px;

  font-size: 17px;
  font-weight: 900;
}

.login-link {
  color: #8795a0;

  font-size: 11px;
}

.login-link a {
  margin-left: 6px;

  color: #0b5da7;

  font-weight: 800;

  text-decoration: none;
}

/* =========================================================
   CONTENT
========================================================= */

.register-content {
  width: 100%;
  max-width: 650px;

  margin: 90px auto 0;
}

.register-heading {
  margin-bottom: 42px;
}

.register-label {
  display: block;

  margin-bottom: 18px;

  color: #0b4878;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.15em;
}

.register-heading h1 {
  margin: 0;

  color: #082f56;

  font-size: clamp(43px, 5vw, 64px);

  line-height: 1;

  letter-spacing: -0.05em;
}

.register-heading h1 span {
  display: block;

  color: #0b5da7;
}

.register-heading p {
  max-width: 500px;

  margin: 20px 0 0;

  color: #7b8b97;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================================================
   FORM
========================================================= */

.register-form {
  padding: 35px;

  background: white;

  border: 1px solid #e1e9ef;

  border-radius: 14px;

  box-shadow: 0 20px 55px rgba(8, 47, 86, 0.06);
}

.form-section-title {
  margin-bottom: 20px;

  color: #082f56;

  font-size: 13px;
  font-weight: 800;
}

.second-title {
  margin-top: 35px;
}

.form-row {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 16px;
}

.form-group {
  display: flex;

  flex-direction: column;

  gap: 8px;

  margin-bottom: 18px;
}

.form-group label {
  color: #3d5668;

  font-size: 11px;
  font-weight: 700;
}

.form-group input {
  width: 100%;

  height: 49px;

  padding: 0 14px;

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
  color: #a9b4bc;
}

/* =========================================================
   PASSWORD
========================================================= */

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 60px;
}

.password-field button {
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

.password-strength {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 4px;

  margin-top: 8px;
}

.password-strength span {
  height: 3px;

  background: #e4ebef;

  border-radius: 10px;
}

.password-strength span.active {
  background: #0b5da7;
}

.form-group small {
  color: #9aa7b1;

  font-size: 9px;

  line-height: 1.5;
}

/* =========================================================
   TERMS
========================================================= */

.terms-check {
  display: flex;

  align-items: flex-start;

  gap: 9px;

  margin: 8px 0 22px;

  color: #81909b;

  font-size: 10px;

  line-height: 1.6;

  cursor: pointer;
}

.terms-check input {
  margin-top: 2px;

  accent-color: #0b4878;
}

.terms-check a {
  color: #0b5da7;

  font-weight: 700;
}

/* =========================================================
   BUTTON
========================================================= */

.register-button {
  width: 100%;

  height: 52px;

  padding: 0 12px 0 20px;

  display: flex;

  align-items: center;
  justify-content: space-between;

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
    transform 0.2s ease;
}

.register-button:hover {
  background: #082f56;

  transform: translateY(-1px);
}

.register-button svg {
  width: 32px;
  height: 32px;

  padding: 7px;

  background: rgba(255, 255, 255, 0.13);

  border-radius: 5px;
}

/* =========================================================
   SECURITY NOTE
========================================================= */

.register-security {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 22px;

  color: #8c9aa5;

  font-size: 9px;
}

.register-security svg {
  color: #0b4878;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {
  .register-page {
    padding: 25px 20px 55px;
  }

  .register-header {
    align-items: flex-start;
  }

  .login-link {
    text-align: right;

    max-width: 130px;

    line-height: 1.5;
  }

  .register-content {
    margin-top: 65px;
  }

  .register-heading h1 {
    font-size: 42px;
  }

  .register-form {
    padding: 24px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;

    gap: 0;
  }
}

@media (max-width: 380px) {
  .register-page {
    padding-left: 16px;
    padding-right: 16px;
  }

  .register-content {
    margin-top: 50px;
  }

  .register-heading h1 {
    font-size: 37px;
  }

  .register-form {
    padding: 21px 16px;
  }
}
</style>
