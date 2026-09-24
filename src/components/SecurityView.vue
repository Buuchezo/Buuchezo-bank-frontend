<template>
  <PublicPageLayout
    eyebrow="SECURITY"
    title="Security is built into the experience."
    description="Protecting accounts and financial information is fundamental to digital banking."
  >
    <div class="content-grid">
      <article class="content-card">
        <h2>Authentication</h2>

        <p>
          Authentication controls help ensure that only authorized users can access protected
          banking functionality.
        </p>

        <p>
          Buuchezo Bank also supports two-factor authentication in the application where enabled.
        </p>
      </article>

      <article class="content-card">
        <h2>Access control</h2>

        <p>
          Protected areas use authenticated requests and role-based access controls to separate
          customer and administrative functionality.
        </p>
      </article>

      <article class="content-card">
        <h2>Data protection</h2>

        <p>
          Sensitive information should be handled using appropriate transport, storage and
          application-level security controls.
        </p>
      </article>

      <article class="content-card">
        <h2>Stay protected</h2>

        <ul class="public-list">
          <li>Never share your password.</li>
          <li>Never share one-time authentication codes.</li>
          <li>Use a strong, unique password.</li>
          <li>Keep your devices and browser updated.</li>
          <li>Report suspicious activity immediately.</li>
        </ul>
      </article>
    </div>

    <article class="content-card">
      <h2>Suspect suspicious activity?</h2>

      <p>
        Contact support as soon as possible and avoid sharing authentication secrets with anyone.
      </p>

      <RouterLink to="/contact" class="public-button"> Contact support </RouterLink>
    </article>
  </PublicPageLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PublicPageLayout from '@/components/PublicPageLayout.vue'
</script>
