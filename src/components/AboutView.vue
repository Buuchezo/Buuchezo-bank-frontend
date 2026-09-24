<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PublicPageLayout from '@/components/PublicPageLayout.vue'
</script>

<template>
  <PublicPageLayout
    eyebrow="ABOUT BUUCHEZO BANK"
    title="More than a bank. A brighter tomorrow."
    description="Buuchezo Bank is a modern banking platform built around simplicity, security and giving people greater control over their financial lives."
  >
    <div class="content-grid">
      <article class="content-card">
        <h2>Our mission</h2>

        <p>
          We believe banking should be understandable, accessible and designed around the people who
          use it.
        </p>

        <p>
          Buuchezo Bank combines digital technology with a human approach to create a banking
          experience that helps customers manage their money with confidence.
        </p>
      </article>

      <article class="content-card">
        <h2>Our vision</h2>

        <p>
          We are building a financial platform where everyday banking, payments, cards and financial
          information work together in one connected experience.
        </p>

        <p>The goal is simple: less friction and more control.</p>
      </article>
    </div>

    <div class="content-card">
      <h2>What we value</h2>

      <div class="content-grid">
        <div class="feature-box">
          <h3>People</h3>
          <p>Financial products should serve people rather than overwhelm them.</p>
        </div>

        <div class="feature-box">
          <h3>Security</h3>
          <p>Security is considered throughout the design of our digital banking experience.</p>
        </div>

        <div class="feature-box">
          <h3>Transparency</h3>
          <p>
            We aim to communicate clearly so customers understand what happens with their money.
          </p>
        </div>

        <div class="feature-box">
          <h3>Progress</h3>
          <p>We continuously improve the technology and experience behind modern banking.</p>
        </div>
      </div>
    </div>

    <div class="content-card">
      <h2>Ready to get started?</h2>

      <p>Explore the Buuchezo Bank experience or create an account.</p>

      <RouterLink to="/register" class="public-button"> Open an account </RouterLink>
    </div>
  </PublicPageLayout>
</template>
