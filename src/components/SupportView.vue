<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import PublicPageLayout from '@/components/PublicPageLayout.vue'

const openQuestion = ref<number | null>(0)

const questions = [
  {
    question: 'How do I open a Buuchezo Bank account?',
    answer:
      'Select "Open an account" and complete the registration process. Your account experience will depend on the services currently available in this application.',
  },
  {
    question: 'How do I access my account?',
    answer:
      'Use the Sign in link in the website header. Your banking dashboard is protected and requires authentication.',
  },
  {
    question: 'How can I manage my accounts?',
    answer:
      'After signing in, use the Accounts section of the banking dashboard to review your available account information.',
  },
  {
    question: 'How do I make a transfer?',
    answer:
      'Sign in and open Transfers from your banking navigation. Available transfer functionality depends on the services implemented in your account.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Visit our Contact page and send us your question. For account-specific issues, please provide enough information for support to understand the problem without sharing passwords or authentication codes.',
  },
  {
    question: 'What should I do if I suspect unauthorized activity?',
    answer:
      'Secure your account immediately, avoid sharing authentication information, and contact support so the activity can be reviewed.',
  },
]

function toggleQuestion(index: number) {
  openQuestion.value = openQuestion.value === index ? null : index
}
</script>

<template>
  <PublicPageLayout
    eyebrow="SUPPORT"
    title="We're here to help."
    description="Find answers to common questions or contact the Buuchezo Bank team."
  >
    <div class="content-card">
      <h2>Frequently asked questions</h2>

      <div class="faq-list">
        <article v-for="(item, index) in questions" :key="item.question" class="faq-item">
          <button
            type="button"
            class="faq-question"
            :aria-expanded="openQuestion === index"
            @click="toggleQuestion(index)"
          >
            <span>{{ item.question }}</span>

            <span class="faq-icon">
              {{ openQuestion === index ? '−' : '+' }}
            </span>
          </button>

          <div v-if="openQuestion === index" class="faq-answer">
            {{ item.answer }}
          </div>
        </article>
      </div>
    </div>

    <div class="content-grid">
      <article class="content-card">
        <h2>Need more help?</h2>

        <p>Our support team can help with questions about your Buuchezo Bank experience.</p>

        <RouterLink to="/contact" class="public-button"> Contact support </RouterLink>
      </article>

      <article class="content-card">
        <h2>Security first</h2>

        <p>
          Never share your password, one-time passwords, recovery codes or authentication secrets
          with anyone.
        </p>

        <RouterLink to="/security" class="public-button secondary">
          Security information
        </RouterLink>
      </article>
    </div>
  </PublicPageLayout>
</template>

<style scoped>
.faq-list {
  border-top: 1px solid #e4edf4;
}

.faq-item {
  border-bottom: 1px solid #e4edf4;
}

.faq-question {
  width: 100%;
  padding: 20px 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  color: #173d5b;
  background: transparent;

  border: 0;

  text-align: left;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
}

.faq-icon {
  color: #07559b;
  font-size: 22px;
  font-weight: 400;
}

.faq-answer {
  padding: 0 35px 22px 0;

  color: #526b82;

  font-size: 13px;
  line-height: 1.8;
}
</style>
