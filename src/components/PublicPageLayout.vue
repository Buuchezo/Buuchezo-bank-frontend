<script setup lang="ts">
import PublicSiteHeader from './PublicSiteHeader.vue'
import PublicSiteFooter from './PublicSiteFooter.vue'

withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
  }>(),
  {
    eyebrow: 'BUUCHEZO BANK',
    description: '',
  },
)
</script>

<template>
  <div class="public-page">
    <PublicSiteHeader />

    <main>
      <section class="public-hero">
        <div class="public-hero-inner">
          <span class="public-eyebrow">
            {{ eyebrow }}
          </span>

          <h1>{{ title }}</h1>

          <p v-if="description">
            {{ description }}
          </p>
        </div>
      </section>

      <section class="public-content">
        <div class="public-content-inner">
          <slot />
        </div>
      </section>
    </main>

    <PublicSiteFooter />
  </div>
</template>

<style scoped>
.public-page {
  min-height: 100vh;
  background: #f7fafc;
  color: #16334c;
}

.public-hero {
  position: relative;
  overflow: hidden;

  padding: 100px 24px 95px;

  background:
    radial-gradient(circle at 85% 20%, rgba(49, 159, 231, 0.28), transparent 35%),
    linear-gradient(135deg, #062f59 0%, #07559b 55%, #0a6fb8 100%);

  color: white;
}

.public-hero::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;

  right: -180px;
  top: -260px;

  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}

.public-hero::after {
  content: '';
  position: absolute;
  width: 650px;
  height: 650px;

  right: -280px;
  top: -330px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.public-hero-inner {
  position: relative;
  z-index: 2;

  width: min(900px, 100%);
  margin: 0 auto;

  text-align: center;
}

.public-eyebrow {
  display: inline-block;
  margin-bottom: 20px;

  color: #8bd2ff;

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.public-hero h1 {
  margin: 0;

  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.public-hero p {
  max-width: 680px;
  margin: 24px auto 0;

  color: rgba(255, 255, 255, 0.78);

  font-size: 17px;
  line-height: 1.7;
}

.public-content {
  padding: 75px 24px 100px;
}

.public-content-inner {
  width: min(1080px, 100%);
  margin: 0 auto;
}

:deep(.content-card) {
  padding: 36px;

  background: white;
  border: 1px solid #e2ebf2;
  border-radius: 18px;

  box-shadow: 0 12px 35px rgba(6, 47, 89, 0.06);
}

:deep(.content-card + .content-card) {
  margin-top: 24px;
}

:deep(.content-card h2) {
  margin: 0 0 15px;

  color: #062f59;

  font-size: 25px;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

:deep(.content-card h3) {
  margin: 25px 0 10px;

  color: #07559b;

  font-size: 17px;
}

:deep(.content-card p) {
  margin: 0 0 15px;

  color: #526b82;

  font-size: 14px;
  line-height: 1.8;
}

:deep(.content-card p:last-child) {
  margin-bottom: 0;
}

:deep(.content-grid) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

:deep(.feature-box) {
  padding: 26px;

  background: #f6fafd;
  border: 1px solid #e2edf5;
  border-radius: 14px;
}

:deep(.feature-box h3) {
  margin-top: 0;
}

:deep(.public-button) {
  min-height: 45px;
  padding: 0 18px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: white;
  background: #07559b;

  border: 0;
  border-radius: 8px;

  text-decoration: none;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

:deep(.public-button:hover) {
  background: #06457f;
}

:deep(.public-button.secondary) {
  color: #07559b;
  background: #edf5fb;
}

:deep(.public-list) {
  margin: 0;
  padding-left: 20px;
}

:deep(.public-list li) {
  margin-bottom: 10px;

  color: #526b82;

  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 700px) {
  .public-hero {
    padding: 75px 20px 70px;
  }

  .public-content {
    padding: 50px 18px 70px;
  }

  :deep(.content-card) {
    padding: 25px;
  }

  :deep(.content-grid) {
    grid-template-columns: 1fr;
  }
}
</style>
