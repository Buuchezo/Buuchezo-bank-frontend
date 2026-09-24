<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import buuchezoBankLogo from '@/assets/images/buuchezobank-logo.png'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-inner">
        <!-- BRAND -->
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo">
            <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="footer-logo-image" />

            <span>Buuchezo Bank</span>
          </RouterLink>

          <p>Simple. Secure. Personal. Banking built for your tomorrow.</p>

          <div class="footer-status">
            <span class="status-dot"></span>
            <span>Banking services available</span>
          </div>
        </div>

        <!-- BANKING -->
        <div class="footer-column">
          <h3>Banking</h3>

          <ul>
            <li>
              <RouterLink to="/accounts"> Accounts </RouterLink>
            </li>

            <li>
              <RouterLink to="/transactions"> Transactions </RouterLink>
            </li>

            <li>
              <RouterLink to="/cards"> Cards </RouterLink>
            </li>

            <li>
              <RouterLink to="/transfers"> Transfers </RouterLink>
            </li>
          </ul>
        </div>

        <!-- COMPANY -->
        <div class="footer-column">
          <h3>Company</h3>

          <ul>
            <li>
              <RouterLink to="/about"> About us </RouterLink>
            </li>

            <li>
              <RouterLink to="/careers"> Careers </RouterLink>
            </li>

            <li>
              <RouterLink to="/support"> Support </RouterLink>
            </li>

            <li>
              <RouterLink to="/contact"> Contact </RouterLink>
            </li>
          </ul>
        </div>

        <!-- LEGAL -->
        <div class="footer-column">
          <h3>Legal</h3>

          <ul>
            <li>
              <RouterLink to="/privacy"> Privacy </RouterLink>
            </li>

            <li>
              <RouterLink to="/terms"> Terms & Conditions </RouterLink>
            </li>

            <li>
              <RouterLink to="/security"> Security </RouterLink>
            </li>

            <li>
              <RouterLink to="/cookies"> Cookie policy </RouterLink>
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <div class="footer-cta">
          <span class="footer-cta-label"> GET STARTED </span>

          <h3>
            Ready to take
            <span>control?</span>
          </h3>

          <RouterLink to="/register" class="footer-button">
            <span>Open an Account</span>

            <span class="footer-button-arrow">
              <ArrowUpRight :size="16" />
            </span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p>© {{ currentYear }} Buuchezo Bank. All rights reserved.</p>

        <div class="footer-bottom-links">
          <RouterLink to="/privacy"> Privacy </RouterLink>

          <RouterLink to="/terms"> Terms </RouterLink>

          <RouterLink to="/security"> Security </RouterLink>

          <RouterLink to="/cookies"> Cookies </RouterLink>

          <RouterLink to="/contact"> Contact </RouterLink>
        </div>

        <div class="footer-mark">
          <img :src="buuchezoBankLogo" alt="Buuchezo Bank" class="footer-mark-image" />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  color: rgba(255, 255, 255, 0.75);
  background: #062f59;
}

.footer-main {
  padding: 85px 7% 75px;
}

.footer-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: grid;

  grid-template-columns:
    1.6fr
    0.8fr
    0.8fr
    0.8fr
    1.1fr;

  gap: 50px;
}

.footer-brand {
  max-width: 280px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  color: white;

  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
}

.footer-logo-image {
  width: 35px;
  height: 35px;

  display: block;

  object-fit: contain;
  object-position: center;

  flex-shrink: 0;
}

.footer-brand > p {
  margin: 20px 0 23px;

  color: rgba(255, 255, 255, 0.56);

  font-size: 13px;
  line-height: 1.7;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 8px;

  color: rgba(255, 255, 255, 0.52);

  font-size: 9px;
}

.status-dot {
  width: 7px;
  height: 7px;

  background: #5dd39e;
  border-radius: 50%;

  box-shadow: 0 0 0 4px rgba(93, 211, 158, 0.1);
}

.footer-column h3 {
  margin: 2px 0 21px;

  color: white;

  font-size: 12px;
  font-weight: 700;
}

.footer-column ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.footer-column li {
  margin-bottom: 12px;
}

.footer-column a {
  color: rgba(255, 255, 255, 0.5);

  font-size: 11px;
  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: white;
}

.footer-cta {
  padding-left: 15px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-cta-label {
  color: #79c5ff;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.footer-cta h3 {
  margin: 12px 0 20px;

  color: white;

  font-size: 24px;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.footer-cta h3 span {
  display: block;
  color: #79c5ff;
}

.footer-button {
  min-height: 45px;
  padding: 0 8px 0 16px;

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  color: white;
  background: #07559b;

  border-radius: 7px;

  font-size: 11px;
  font-weight: 700;
  text-decoration: none;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.footer-button:hover {
  background: #0b68b8;
  transform: translateY(-1px);
}

.footer-button-arrow {
  width: 29px;
  height: 29px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background: #0b4878;
  border-radius: 5px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}

.footer-bottom-inner {
  width: 100%;
  max-width: 1280px;
  min-height: 70px;

  margin: 0 auto;
  padding: 0 7%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-bottom p {
  margin: 0;

  color: rgba(255, 255, 255, 0.38);

  font-size: 9px;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.38);

  font-size: 9px;
  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-bottom-links a:hover {
  color: white;
}

.footer-mark {
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;

  overflow: hidden;
}

.footer-mark-image {
  width: 23px;
  height: 23px;

  display: block;
  object-fit: contain;
}

@media (max-width: 1050px) {
  .footer-main {
    padding: 75px 6% 65px;
  }

  .footer-inner {
    grid-template-columns:
      1.4fr
      0.8fr
      0.8fr
      0.8fr;

    gap: 45px;
  }

  .footer-cta {
    grid-column: span 4;

    padding-left: 0;
    padding-top: 30px;

    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 650px) {
  .footer-main {
    padding: 65px 20px 55px;
  }

  .footer-inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 45px 30px;
  }

  .footer-brand {
    grid-column: span 2;
  }

  .footer-cta {
    grid-column: span 2;
  }

  .footer-button {
    width: 100%;
  }

  .footer-bottom-inner {
    min-height: auto;
    padding: 25px 20px;

    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .footer-mark {
    display: none;
  }
}
</style>
