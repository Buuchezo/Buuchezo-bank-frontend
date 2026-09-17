<template>
  <section class="final-cta">
    <div class="final-cta-inner">
      <!-- =====================================================
           LEFT CONTENT
      ====================================================== -->

      <div class="cta-content">
        <div class="cta-label">BUUCHEZO BANK</div>

        <h2>
          Your money.
          <span>Your future.</span>
        </h2>

        <p>Banking that gives you clarity, control and confidence for whatever comes next.</p>

        <div class="cta-actions">
          <RouterLink to="/register" class="cta-primary">
            <span>Open an Account</span>

            <span class="cta-arrow">
              <ArrowUpRight :size="17" />
            </span>
          </RouterLink>

          <RouterLink to="/login" class="cta-secondary"> Sign in </RouterLink>
        </div>
      </div>

      <!-- =====================================================
           RIGHT VISUAL
      ====================================================== -->

      <div class="cta-visual">
        <div class="cta-circle circle-one"></div>
        <div class="cta-circle circle-two"></div>

        <!-- CARD -->

        <div class="cta-card">
          <div class="cta-card-top">
            <div class="cta-card-brand">
              <div class="cta-card-logo">B</div>

              <strong> Buuchezo Bank </strong>
            </div>

            <Wifi class="cta-contactless" :size="23" />
          </div>

          <div class="cta-chip">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div class="cta-card-number">5432&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;3456</div>

          <div class="cta-card-footer">
            <div>
              <span>CARD HOLDER</span>
              <strong>JOHN DOE</strong>
            </div>

            <div class="cta-card-symbol">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- FLOATING SECURITY BADGE -->

        <div class="cta-badge">
          <div class="cta-badge-icon">
            <ShieldCheck :size="18" />
          </div>

          <div>
            <strong>Secure banking</strong>
            <span>Always in control</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, ShieldCheck, Wifi } from 'lucide-vue-next'
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.final-cta {
  position: relative;

  width: 100%;

  padding: 110px 7% 115px;

  background: linear-gradient(125deg, #062f59 0%, #07477d 52%, #0b5da7 100%);

  overflow: hidden;
}

.final-cta-inner {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 1280px;

  margin: 0 auto;

  display: grid;

  grid-template-columns: 0.9fr 1.1fr;

  gap: 70px;

  align-items: center;
}

/* =========================================================
   DECORATIVE BACKGROUND
========================================================= */

.final-cta::before {
  content: '';

  position: absolute;

  width: 650px;
  height: 650px;

  right: -250px;
  top: -300px;

  border: 1px solid rgba(255, 255, 255, 0.09);

  border-radius: 50%;
}

.final-cta::after {
  content: '';

  position: absolute;

  width: 450px;
  height: 450px;

  right: -80px;
  bottom: -280px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 50%;
}

/* =========================================================
   CONTENT
========================================================= */

.cta-content {
  max-width: 520px;
}

.cta-label {
  display: flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 22px;

  color: rgba(255, 255, 255, 0.65);

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.16em;
}

.cta-label::before {
  content: '';

  width: 28px;
  height: 2px;

  background: rgba(255, 255, 255, 0.6);
}

.cta-content h2 {
  margin: 0;

  color: white;

  font-size: clamp(45px, 5vw, 68px);

  line-height: 1;

  letter-spacing: -0.05em;
}

.cta-content h2 span {
  display: block;

  color: #8dd7ee;
}

.cta-content > p {
  max-width: 450px;

  margin: 25px 0 34px;

  color: rgba(255, 255, 255, 0.68);

  font-size: 15px;

  line-height: 1.75;
}

/* =========================================================
   ACTIONS
========================================================= */

.cta-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 14px;

  padding: 13px 13px 13px 22px;

  color: #082f56;

  background: white;

  border-radius: 7px;

  font-size: 14px;
  font-weight: 700;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cta-primary:hover {
  transform: translateY(-2px);

  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.16);
}

.cta-arrow {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 5px;
}

.cta-secondary {
  padding: 15px 18px;

  color: rgba(255, 255, 255, 0.85);

  border: 1px solid rgba(255, 255, 255, 0.28);

  border-radius: 7px;

  font-size: 13px;
  font-weight: 700;

  text-decoration: none;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.08);

  border-color: rgba(255, 255, 255, 0.5);
}

/* =========================================================
   VISUAL
========================================================= */

.cta-visual {
  position: relative;

  min-height: 440px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-circle {
  position: absolute;

  border: 1px solid rgba(255, 255, 255, 0.12);

  border-radius: 50%;
}

.circle-one {
  width: 390px;
  height: 390px;
}

.circle-two {
  width: 520px;
  height: 520px;
}

/* =========================================================
   CARD
========================================================= */

.cta-card {
  position: relative;
  z-index: 5;

  width: min(440px, 85%);

  aspect-ratio: 410 / 247;

  padding: 25px;

  color: white;

  background: linear-gradient(145deg, #063d74 0%, #07559b 55%, #143fbd 100%);

  border: 1px solid rgba(255, 255, 255, 0.18);

  border-radius: 17px;

  box-shadow: 0 35px 65px rgba(0, 0, 0, 0.22);

  transform: perspective(1100px) rotateX(5deg) rotateY(-10deg) rotateZ(-5deg);

  overflow: hidden;
}

.cta-card::after {
  content: '';

  position: absolute;

  width: 230px;
  height: 230px;

  right: -70px;
  bottom: -100px;

  border: 1px solid rgba(255, 255, 255, 0.13);

  border-radius: 50%;
}

.cta-card-top {
  display: flex;

  align-items: center;
  justify-content: space-between;
}

.cta-card-brand {
  display: flex;

  align-items: center;

  gap: 9px;
}

.cta-card-logo {
  width: 32px;
  height: 32px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.13);

  border: 1px solid rgba(255, 255, 255, 0.16);

  border-radius: 7px;

  font-size: 15px;

  font-weight: 800;
}

.cta-card-brand strong {
  font-size: 13px;
}

.cta-contactless {
  opacity: 0.75;
}

/* =========================================================
   CHIP
========================================================= */

.cta-chip {
  width: 47px;
  height: 34px;

  margin-top: 42px;

  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  overflow: hidden;

  background: #c9a96e;

  border-radius: 6px;
}

.cta-chip span {
  border: 1px solid rgba(70, 50, 20, 0.35);
}

/* =========================================================
   NUMBER
========================================================= */

.cta-card-number {
  margin-top: 24px;

  font-size: 20px;

  letter-spacing: 0.12em;

  font-weight: 500;
}

/* =========================================================
   CARD FOOTER
========================================================= */

.cta-card-footer {
  position: absolute;

  left: 25px;
  right: 25px;
  bottom: 22px;

  display: flex;

  align-items: end;
  justify-content: space-between;
}

.cta-card-footer span {
  display: block;

  margin-bottom: 4px;

  color: rgba(255, 255, 255, 0.48);

  font-size: 7px;

  letter-spacing: 0.12em;
}

.cta-card-footer strong {
  font-size: 10px;

  letter-spacing: 0.08em;
}

/* =========================================================
   CARD PAYMENT SYMBOL
========================================================= */

.cta-card-symbol {
  position: relative;

  width: 46px;
  height: 28px;
}

.cta-card-symbol span {
  position: absolute;

  top: 0;

  width: 28px;
  height: 28px;

  margin: 0;

  border-radius: 50%;

  background: #ff6b35;

  opacity: 0.85;
}

.cta-card-symbol span:first-child {
  left: 0;
}

.cta-card-symbol span:last-child {
  right: 0;

  background: #f4c24f;
}

/* =========================================================
   BADGE
========================================================= */

.cta-badge {
  position: absolute;

  z-index: 10;

  right: 2%;
  bottom: 32px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 13px 17px;

  color: #29465a;

  background: rgba(255, 255, 255, 0.96);

  border: 1px solid rgba(255, 255, 255, 0.8);

  border-radius: 9px;

  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.17);

  backdrop-filter: blur(10px);

  animation: ctaFloat 4s ease-in-out infinite;
}

.cta-badge-icon {
  width: 32px;
  height: 32px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #eaf5fa;

  border-radius: 7px;
}

.cta-badge strong {
  display: block;

  font-size: 10px;
}

.cta-badge span {
  display: block;

  margin-top: 2px;

  color: #8999a5;

  font-size: 8px;
}

@keyframes ctaFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-7px);
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {
  .final-cta {
    padding: 100px 6%;
  }

  .final-cta-inner {
    grid-template-columns: 1fr;

    gap: 60px;
  }

  .cta-content {
    max-width: 680px;
  }

  .cta-visual {
    min-height: 450px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {
  .final-cta {
    padding: 80px 20px 90px;
  }

  .final-cta-inner {
    gap: 45px;
  }

  .cta-content h2 {
    font-size: 42px;
  }

  .cta-content > p {
    font-size: 15px;
  }

  .cta-actions {
    width: 100%;

    flex-direction: column;

    align-items: stretch;
  }

  .cta-primary {
    justify-content: space-between;
  }

  .cta-secondary {
    text-align: center;
  }

  .cta-visual {
    min-height: 350px;
  }

  .circle-one {
    width: 280px;
    height: 280px;
  }

  .circle-two {
    width: 350px;
    height: 350px;
  }

  .cta-card {
    width: 88%;

    padding: 18px;
  }

  .cta-chip {
    margin-top: 25px;

    width: 40px;
    height: 29px;
  }

  .cta-card-number {
    margin-top: 17px;

    font-size: 14px;
  }

  .cta-card-footer {
    left: 18px;
    right: 18px;
    bottom: 17px;
  }

  .cta-badge {
    right: 0;
    bottom: 5px;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .final-cta {
    padding: 65px 16px 75px;
  }

  .cta-content h2 {
    font-size: 37px;
  }

  .cta-visual {
    min-height: 300px;
  }

  .cta-card {
    width: 94%;
  }

  .cta-card-number {
    font-size: 12px;
  }

  .cta-badge {
    padding: 10px 12px;
  }
}
</style>
