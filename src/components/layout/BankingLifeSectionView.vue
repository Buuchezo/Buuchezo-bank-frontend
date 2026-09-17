<template>
  <section class="banking-life" :style="{ backgroundImage: `url(${bankingLifeBackground})` }">
    <div class="banking-life-inner">
      <!-- =====================================================
           HEADER
      ====================================================== -->

      <div class="life-header">
        <div class="section-label">BANKING FOR REAL LIFE</div>

        <div class="life-heading-row">
          <h2>
            Built for the way
            <span>you live.</span>
          </h2>

          <p>
            From everyday payments to planning what's next, Buuchezo Bank gives you the tools to
            stay in control wherever life takes you.
          </p>
        </div>
      </div>

      <!-- =====================================================
           USE CASES
      ====================================================== -->

      <div class="life-grid">
        <!-- ===================================================
             EVERYDAY BANKING
        ==================================================== -->

        <article class="life-card life-card-large">
          <div class="life-card-number">01</div>

          <div class="life-card-visual everyday-visual">
            <div class="mini-account-card">
              <div class="mini-account-top">
                <span>AVAILABLE</span>

                <WalletCards :size="17" />
              </div>

              <strong>€8,420.50</strong>

              <div class="mini-account-bottom">
                <span>Personal Account</span>
                <span>•••• 3456</span>
              </div>
            </div>
          </div>

          <div class="life-card-content">
            <div class="life-card-icon">
              <WalletCards :size="20" />
            </div>

            <h3>Everyday banking</h3>

            <p>
              Manage your accounts, check your balance and keep your everyday finances organized.
            </p>

            <RouterLink to="/register" class="life-link">
              <span>Learn more</span>
              <ArrowUpRight :size="16" />
            </RouterLink>
          </div>
        </article>

        <!-- ===================================================
             MOVING MONEY
        ==================================================== -->

        <article class="life-card">
          <div class="life-card-number">02</div>

          <div class="life-card-visual transfer-visual">
            <div class="transfer-row">
              <div class="transfer-avatar">JD</div>

              <div class="transfer-person">
                <strong>You</strong>
                <span>Personal account</span>
              </div>

              <ArrowRight :size="18" />

              <div class="transfer-avatar recipient">AM</div>
            </div>

            <div class="transfer-complete">
              <Check :size="13" />
              <span>Transfer completed</span>
            </div>
          </div>

          <div class="life-card-content">
            <div class="life-card-icon">
              <ArrowLeftRight :size="20" />
            </div>

            <h3>Move money</h3>

            <p>Send and receive money with a clear view of every transfer along the way.</p>

            <RouterLink to="/register" class="life-link">
              <span>Learn more</span>
              <ArrowUpRight :size="16" />
            </RouterLink>
          </div>
        </article>

        <!-- ===================================================
             PLAN AHEAD
        ==================================================== -->

        <article class="life-card">
          <div class="life-card-number">03</div>

          <div class="life-card-visual savings-visual">
            <div class="goal-header">
              <span>SAVINGS GOAL</span>

              <span>68%</span>
            </div>

            <div class="goal-title">
              <strong>New car</strong>
              <span>€6,800 / €10,000</span>
            </div>

            <div class="goal-progress">
              <span></span>
            </div>

            <div class="goal-footer">
              <span>€3,200 to go</span>
              <TrendingUp :size="15" />
            </div>
          </div>

          <div class="life-card-content">
            <div class="life-card-icon">
              <Sprout :size="20" />
            </div>

            <h3>Plan ahead</h3>

            <p>Keep your goals visible and make progress toward the things that matter to you.</p>

            <RouterLink to="/register" class="life-link">
              <span>Learn more</span>
              <ArrowUpRight :size="16" />
            </RouterLink>
          </div>
        </article>
      </div>

      <!-- =====================================================
           BOTTOM STATEMENT
      ====================================================== -->

      <div class="life-bottom">
        <div class="life-bottom-line"></div>

        <p>
          One bank. One simple experience.
          <strong>Everything connected.</strong>
        </p>

        <div class="life-bottom-line"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Sprout,
  TrendingUp,
  WalletCards,
} from 'lucide-vue-next'

import bankingLifeBackground from '@/assets/images/banking-life-bg.png'
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.banking-life {
  position: relative;

  width: 100%;

  padding: 125px 7% 120px;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow: hidden;
}
.banking-life::before {
  content: '';

  position: absolute;
  inset: 0;

  background: rgba(255, 255, 255, 0.55);

  pointer-events: none;
}

.banking-life-inner {
  position: relative;
  z-index: 1;
}
/* =========================================================
   HEADER
========================================================= */

.life-header {
  margin-bottom: 60px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 22px;

  color: #0b4878;

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.section-label::before {
  content: '';

  width: 28px;
  height: 2px;

  background: #0b4878;
}

.life-heading-row {
  display: grid;
  grid-template-columns: 1fr 0.65fr;

  gap: 80px;

  align-items: end;
}

.life-heading-row h2 {
  margin: 0;

  color: #082f56;

  font-size: clamp(45px, 5vw, 70px);

  line-height: 1;

  letter-spacing: -0.05em;
}

.life-heading-row h2 span {
  color: #0b5da7;
}

.life-heading-row > p {
  margin: 0;

  color: #718394;

  font-size: 15px;

  line-height: 1.75;
}

/* =========================================================
   CARD GRID
========================================================= */

.life-grid {
  display: grid;

  grid-template-columns:
    1.15fr
    0.925fr
    0.925fr;

  gap: 18px;
}

/* =========================================================
   CARD
========================================================= */

.life-card {
  position: relative;

  min-width: 0;

  padding: 22px;

  background: #ffffff;

  border: 1px solid #e1eaf0;

  border-radius: 14px;

  overflow: hidden;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.life-card:hover {
  transform: translateY(-5px);

  border-color: #cfdee8;

  box-shadow: 0 20px 50px rgba(8, 47, 86, 0.08);
}

.life-card-large {
  min-height: 515px;
}

.life-card:not(.life-card-large) {
  min-height: 515px;
}

.life-card-number {
  position: absolute;

  top: 23px;
  right: 23px;

  color: #9aa9b5;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.1em;
}

/* =========================================================
   VISUAL AREA
========================================================= */

.life-card-visual {
  position: relative;

  height: 220px;

  margin-bottom: 25px;

  border-radius: 10px;

  overflow: hidden;
}

/* =========================================================
   EVERYDAY VISUAL
========================================================= */

.everyday-visual {
  display: flex;

  align-items: center;
  justify-content: center;

  background: linear-gradient(145deg, #e9f4fa 0%, #f7fbfd 100%);
}

.everyday-visual::before {
  content: '';

  position: absolute;

  width: 190px;
  height: 190px;

  border-radius: 50%;

  background: #d8ecf6;

  transform: translate(45px, -25px);
}

.mini-account-card {
  position: relative;
  z-index: 2;

  width: 75%;

  padding: 20px;

  color: white;

  background: linear-gradient(145deg, #063d74 0%, #07559b 55%, #143fbd 100%);

  border-radius: 11px;

  box-shadow: 0 20px 35px rgba(8, 47, 86, 0.2);

  transform: rotate(-3deg);
}

.mini-account-top {
  display: flex;

  align-items: center;
  justify-content: space-between;

  color: rgba(255, 255, 255, 0.65);

  font-size: 8px;

  letter-spacing: 0.12em;
}

.mini-account-card > strong {
  display: block;

  margin: 16px 0;

  font-size: 26px;

  letter-spacing: -0.04em;
}

.mini-account-bottom {
  display: flex;

  justify-content: space-between;

  padding-top: 11px;

  border-top: 1px solid rgba(255, 255, 255, 0.16);

  color: rgba(255, 255, 255, 0.65);

  font-size: 8px;
}

/* =========================================================
   TRANSFER VISUAL
========================================================= */

.transfer-visual {
  padding: 25px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: 20px;

  background: #f1f7fa;
}

.transfer-row {
  display: flex;

  align-items: center;

  gap: 8px;

  padding: 16px;

  background: white;

  border: 1px solid #e1eaf0;

  border-radius: 9px;
}

.transfer-avatar {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 50%;

  font-size: 9px;

  font-weight: 800;
}

.transfer-avatar.recipient {
  background: #d8e8f2;

  color: #0b4878;
}

.transfer-person {
  min-width: 0;

  flex: 1;
}

.transfer-person strong {
  display: block;

  color: #314b5f;

  font-size: 10px;
}

.transfer-person span {
  display: block;

  margin-top: 2px;

  color: #9aa8b2;

  font-size: 7px;
}

.transfer-complete {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 9px;

  color: #257a59;

  background: #eaf7f1;

  border-radius: 7px;

  font-size: 8px;

  font-weight: 700;
}

/* =========================================================
   SAVINGS VISUAL
========================================================= */

.savings-visual {
  padding: 25px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  background: linear-gradient(145deg, #f0f7fa, #ffffff);
}

.goal-header {
  display: flex;

  justify-content: space-between;

  color: #8a9aa6;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.12em;
}

.goal-header span:last-child {
  color: #0b5da7;

  letter-spacing: 0;
}

.goal-title {
  display: flex;

  justify-content: space-between;

  align-items: end;

  gap: 10px;

  margin-top: 20px;
}

.goal-title strong {
  color: #082f56;

  font-size: 22px;

  letter-spacing: -0.03em;
}

.goal-title span {
  color: #7f8f9b;

  font-size: 8px;
}

.goal-progress {
  height: 8px;

  margin-top: 20px;

  background: #e2edf2;

  border-radius: 99px;

  overflow: hidden;
}

.goal-progress span {
  display: block;

  width: 68%;

  height: 100%;

  background: #0b5da7;

  border-radius: inherit;
}

.goal-footer {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-top: 12px;

  color: #8b9aa5;

  font-size: 8px;
}

.goal-footer svg {
  color: #2d8a62;
}

/* =========================================================
   CONTENT
========================================================= */

.life-card-content {
  padding: 0 4px 5px;
}

.life-card-icon {
  width: 39px;
  height: 39px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 17px;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 8px;
}

.life-card-content h3 {
  margin: 0 0 10px;

  color: #082f56;

  font-size: 20px;

  letter-spacing: -0.02em;
}

.life-card-content p {
  max-width: 320px;

  margin: 0;

  color: #7a8b98;

  font-size: 13px;

  line-height: 1.65;
}

/* =========================================================
   LINK
========================================================= */

.life-link {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 22px;

  color: #0b4878;

  font-size: 11px;

  font-weight: 800;

  text-decoration: none;
}

.life-link svg {
  transition: transform 0.2s ease;
}

.life-link:hover svg {
  transform: translate(3px, -3px);
}

/* =========================================================
   BOTTOM STATEMENT
========================================================= */

.life-bottom {
  display: flex;

  align-items: center;

  gap: 25px;

  margin-top: 65px;
}

.life-bottom-line {
  height: 1px;

  flex: 1;

  background: #dbe6ec;
}

.life-bottom p {
  flex-shrink: 0;

  margin: 0;

  color: #8797a3;

  font-size: 11px;

  text-align: center;
}

.life-bottom strong {
  color: #0b4878;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1050px) {
  .banking-life {
    padding: 100px 6%;
  }

  .life-heading-row {
    grid-template-columns: 1fr;

    gap: 25px;
  }

  .life-heading-row > p {
    max-width: 650px;
  }

  .life-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .life-card-large {
    grid-column: span 2;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {
  .banking-life {
    padding: 80px 20px 85px;
  }

  .life-header {
    margin-bottom: 40px;
  }

  .life-heading-row h2 {
    font-size: 42px;
  }

  .life-heading-row > p {
    font-size: 15px;
  }

  .life-grid {
    grid-template-columns: 1fr;
  }

  .life-card-large {
    grid-column: auto;
  }

  .life-card,
  .life-card-large {
    min-height: auto;
  }

  .life-card-visual {
    height: 200px;
  }

  .life-bottom {
    margin-top: 45px;

    gap: 12px;
  }

  .life-bottom p {
    font-size: 9px;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .banking-life {
    padding: 65px 16px 70px;
  }

  .life-heading-row h2 {
    font-size: 37px;
  }

  .life-card {
    padding: 18px;
  }

  .life-card-visual {
    height: 185px;
  }
}
</style>
