<script setup lang="ts">
import PublicPageLayout from '@/components/PublicPageLayout.vue'
import { RouterLink } from 'vue-router'

const positions = [
  {
    title: 'Full-Stack Software Developer',
    type: 'Engineering · Full-time',
    description:
      'Build secure and scalable banking experiences across our frontend and backend platforms.',
  },
  {
    title: 'Backend Engineer',
    type: 'Engineering · Full-time',
    description: 'Design APIs, services and financial workflows using modern backend technologies.',
  },
  {
    title: 'Frontend Developer',
    type: 'Engineering · Full-time',
    description: 'Create accessible, responsive and intuitive digital banking experiences.',
  },
  {
    title: 'Customer Experience Specialist',
    type: 'Customer Experience · Full-time',
    description: 'Help customers understand and confidently use our banking services.',
  },
]
</script>

<template>
  <PublicPageLayout
    eyebrow="CAREERS"
    title="Build the future of banking with us."
    description="Join a team focused on creating a simpler, more secure and more human digital banking experience."
  >
    <div class="content-card">
      <h2>Why Buuchezo Bank?</h2>

      <p>We are building technology at the intersection of finance, security and everyday life.</p>

      <p>
        Our teams work across engineering, product, security and customer experience to create
        services people can trust.
      </p>
    </div>

    <div class="content-card">
      <h2>Open positions</h2>

      <div class="jobs">
        <article v-for="position in positions" :key="position.title" class="job-card">
          <div>
            <span class="job-type">
              {{ position.type }}
            </span>

            <h3>
              {{ position.title }}
            </h3>

            <p>
              {{ position.description }}
            </p>
          </div>

          <RouterLink to="/contact" class="public-button secondary">
            Ask about this role
          </RouterLink>
        </article>
      </div>
    </div>

    <div class="content-card">
      <h2>Don't see your role?</h2>

      <p>
        We are always interested in meeting people who can contribute to our technology, product,
        security and customer experience teams.
      </p>

      <RouterLink to="/contact" class="public-button"> Contact us </RouterLink>
    </div>
  </PublicPageLayout>
</template>

<style scoped>
.jobs {
  display: grid;
  gap: 16px;
}

.job-card {
  padding: 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;

  background: #f7fafc;
  border: 1px solid #e2ebf2;
  border-radius: 14px;
}

.job-type {
  color: #07559b;

  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.job-card h3 {
  margin: 8px 0;

  color: #062f59;

  font-size: 19px;
}

.job-card p {
  max-width: 650px;
}

@media (max-width: 700px) {
  .job-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
