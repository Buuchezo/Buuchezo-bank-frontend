<script setup lang="ts">
import { ref } from 'vue'
import { Mail, MapPin, Phone } from 'lucide-vue-next'
import PublicPageLayout from '@/components/PublicPageLayout.vue'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')

const submitted = ref(false)
const errorMessage = ref('')

function submitForm() {
  errorMessage.value = ''

  if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  submitted.value = true

  name.value = ''
  email.value = ''
  subject.value = ''
  message.value = ''
}
</script>

<template>
  <PublicPageLayout
    eyebrow="CONTACT"
    title="Let's talk."
    description="Have a question about Buuchezo Bank? Send us a message and we'll point you in the right direction."
  >
    <div class="contact-grid">
      <div>
        <article class="content-card">
          <h2>Get in touch</h2>

          <p>
            Whether you have a question about your account, our services or the Buuchezo Bank
            platform, we're here to help.
          </p>

          <div class="contact-details">
            <div class="contact-detail">
              <span class="contact-icon">
                <Mail :size="18" />
              </span>

              <div>
                <strong>Email</strong>
                <span>support@buuchezobank.com</span>
              </div>
            </div>

            <div class="contact-detail">
              <span class="contact-icon">
                <Phone :size="18" />
              </span>

              <div>
                <strong>Phone</strong>
                <span>Support available through our contact channels</span>
              </div>
            </div>

            <div class="contact-detail">
              <span class="contact-icon">
                <MapPin :size="18" />
              </span>

              <div>
                <strong>Location</strong>
                <span>Germany</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <article class="content-card">
        <h2>Send us a message</h2>

        <div v-if="submitted" class="success-message">
          Thank you. Your message has been prepared successfully. Our contact workflow can be
          connected to the backend when the contact API is implemented.
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form class="contact-form" @submit.prevent="submitForm">
          <label>
            <span>Your name</span>

            <input v-model="name" type="text" placeholder="John Doe" />
          </label>

          <label>
            <span>Email address</span>

            <input v-model="email" type="email" placeholder="you@example.com" />
          </label>

          <label>
            <span>Subject</span>

            <input v-model="subject" type="text" placeholder="How can we help?" />
          </label>

          <label>
            <span>Message</span>

            <textarea v-model="message" rows="6" placeholder="Tell us how we can help..." />
          </label>

          <button type="submit" class="public-button">Send message</button>
        </form>
      </article>
    </div>
  </PublicPageLayout>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 24px;
}

.contact-details {
  margin-top: 30px;

  display: grid;
  gap: 22px;
}

.contact-detail {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.contact-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #07559b;
  background: #edf6fc;
  border-radius: 10px;
}

.contact-detail strong,
.contact-detail span {
  display: block;
}

.contact-detail strong {
  margin-bottom: 4px;
  color: #173d5b;
  font-size: 13px;
}

.contact-detail div > span {
  color: #6b8194;
  font-size: 12px;
  line-height: 1.5;
}

.contact-form {
  display: grid;
  gap: 17px;
}

.contact-form label {
  display: grid;
  gap: 7px;
}

.contact-form label span {
  color: #294761;
  font-size: 12px;
  font-weight: 700;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  box-sizing: border-box;

  padding: 13px 14px;

  color: #16334c;
  background: #f9fbfd;

  border: 1px solid #dce7ef;
  border-radius: 8px;

  outline: none;

  font: inherit;
  font-size: 13px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.contact-form textarea {
  resize: vertical;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #3995d2;
  box-shadow: 0 0 0 3px rgba(57, 149, 210, 0.1);
}

.success-message,
.error-message {
  margin-bottom: 18px;
  padding: 13px 15px;

  border-radius: 8px;

  font-size: 12px;
  line-height: 1.6;
}

.success-message {
  color: #176443;
  background: #edf9f2;
  border: 1px solid #c8ecd8;
}

.error-message {
  color: #a12b2b;
  background: #fff2f2;
  border: 1px solid #f1caca;
}

@media (max-width: 800px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
