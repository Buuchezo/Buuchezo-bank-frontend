<template>
  <section class="security-section">
    <div class="security-inner">
      <!-- =====================================================
           SECURITY VISUAL
      ====================================================== -->

      <div class="security-visual">
        <div class="security-orbit orbit-one"></div>
        <div class="security-orbit orbit-two"></div>
        <div class="security-orbit orbit-three"></div>

        <div class="security-glow"></div>

        <div class="security-shield">
          <ShieldCheck :size="72" stroke-width="1.4" />
        </div>

        <!-- FLOATING SECURITY ITEMS -->

        <div class="security-floating floating-top">
          <div class="floating-icon">
            <Fingerprint :size="17" />
          </div>

          <div>
            <strong>Secure login</strong>
            <span>Protected access</span>
          </div>
        </div>

        <div class="security-floating floating-right">
          <div class="floating-icon">
            <LockKeyhole :size="17" />
          </div>

          <div>
            <strong>Account protected</strong>
            <span>Security active</span>
          </div>
        </div>

        <div class="security-floating floating-bottom">
          <div class="floating-icon">
            <Bell :size="17" />
          </div>

          <div>
            <strong>Instant alerts</strong>
            <span>Stay informed</span>
          </div>
        </div>
      </div>

      <!-- =====================================================
           CONTENT
      ====================================================== -->

      <div class="security-content">
        <div class="section-label">SECURITY FIRST</div>

        <h2>
          Your money.
          <span>Protected by design.</span>
        </h2>

        <p class="security-description">
          Banking should give you confidence. Buuchezo Bank is designed with security at the centre
          of your everyday banking experience.
        </p>

        <!-- SECURITY FEATURES -->

        <div class="security-features">
          <div class="security-feature">
            <div class="security-feature-icon">
              <LockKeyhole :size="19" />
            </div>

            <div>
              <h3>Secure access</h3>

              <p>Your account is protected by secure authentication and controlled access.</p>
            </div>
          </div>

          <div class="security-feature">
            <div class="security-feature-icon">
              <ShieldCheck :size="19" />
            </div>

            <div>
              <h3>Account protection</h3>

              <p>Keep control of your account and its status through your banking experience.</p>
            </div>
          </div>

          <div class="security-feature">
            <div class="security-feature-icon">
              <Bell :size="19" />
            </div>

            <div>
              <h3>Transaction alerts</h3>

              <p>Stay informed about important activity with timely banking notifications.</p>
            </div>
          </div>

          <div class="security-feature">
            <div class="security-feature-icon">
              <Fingerprint :size="19" />
            </div>

            <div>
              <h3>Built for privacy</h3>

              <p>
                Your banking experience is designed around protecting access to your financial
                information.
              </p>
            </div>
          </div>
        </div>

        <RouterLink to="/register" class="security-button">
          <span>Bank with confidence</span>

          <span class="security-button-arrow">
            <ArrowUpRight :size="17" />
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight, Bell, Fingerprint, LockKeyhole, ShieldCheck } from 'lucide-vue-next'
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.security-section {
  position: relative;

  width: 100%;

  background: #ffffff;

  padding: 130px 7% 140px;

  overflow: hidden;
}

.security-inner {
  width: 100%;
  max-width: 1280px;

  margin: 0 auto;

  display: grid;
  grid-template-columns: 1fr 0.9fr;

  gap: 100px;

  align-items: center;
}

/* =========================================================
   VISUAL
========================================================= */

.security-visual {
  position: relative;

  min-height: 530px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.security-glow {
  position: absolute;

  width: 330px;
  height: 330px;

  background: #eaf7fb;

  border-radius: 50%;

  filter: blur(2px);
}

/* =========================================================
   ORBITS
========================================================= */

.security-orbit {
  position: absolute;

  border: 1px solid #dbeaf1;

  border-radius: 50%;
}

.orbit-one {
  width: 390px;
  height: 390px;
}

.orbit-two {
  width: 300px;
  height: 300px;
}

.orbit-three {
  width: 480px;
  height: 480px;

  border-style: dashed;

  opacity: 0.65;
}

/* =========================================================
   SHIELD
========================================================= */

.security-shield {
  position: relative;
  z-index: 5;

  width: 170px;
  height: 190px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;

  background: linear-gradient(145deg, #063d74 0%, #07559b 55%, #143fbd 100%);

  clip-path: polygon(
    50% 0%,
    91% 15%,
    91% 51%,
    82% 70%,
    68% 84%,
    50% 100%,
    32% 84%,
    18% 70%,
    9% 51%,
    9% 15%
  );

  filter: drop-shadow(0 25px 25px rgba(8, 47, 86, 0.18));
}

.security-shield svg {
  transform: translateY(-4px);
}

/* =========================================================
   FLOATING CARDS
========================================================= */

.security-floating {
  position: absolute;
  z-index: 10;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px 15px;

  background: rgba(255, 255, 255, 0.96);

  border: 1px solid #e1eaf0;

  border-radius: 9px;

  box-shadow: 0 14px 35px rgba(8, 47, 86, 0.1);

  backdrop-filter: blur(8px);
}

.security-floating strong {
  display: block;

  color: #314b5f;

  font-size: 10px;
}

.security-floating span {
  display: block;

  margin-top: 3px;

  color: #8c9ba6;

  font-size: 8px;
}

.floating-icon {
  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 7px;
}

/* =========================================================
   FLOATING POSITIONS
========================================================= */

.floating-top {
  top: 58px;
  left: 7%;

  animation: securityFloatOne 5s ease-in-out infinite;
}

.floating-right {
  top: 190px;
  right: 2%;

  animation: securityFloatTwo 5s ease-in-out infinite;
}

.floating-bottom {
  bottom: 55px;
  left: 14%;

  animation: securityFloatThree 5s ease-in-out infinite;
}

@keyframes securityFloatOne {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes securityFloatTwo {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(7px);
  }
}

@keyframes securityFloatThree {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

/* =========================================================
   CONTENT
========================================================= */

.security-content {
  max-width: 540px;
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

.security-content h2 {
  margin: 0;

  color: #082f56;

  font-size: clamp(42px, 4vw, 61px);
  line-height: 1.04;

  letter-spacing: -0.045em;
}

.security-content h2 span {
  display: block;

  color: #0b5da7;
}

.security-description {
  margin: 27px 0 35px;

  color: #687b8d;

  font-size: 16px;
  line-height: 1.75;
}

/* =========================================================
   FEATURES
========================================================= */

.security-features {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 23px 28px;

  margin-bottom: 36px;
}

.security-feature {
  display: flex;
  align-items: flex-start;

  gap: 11px;
}

.security-feature-icon {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 8px;
}

.security-feature h3 {
  margin: 1px 0 5px;

  color: #29465a;

  font-size: 13px;
}

.security-feature p {
  margin: 0;

  color: #84939e;

  font-size: 11px;
  line-height: 1.55;
}

/* =========================================================
   BUTTON
========================================================= */

.security-button {
  display: inline-flex;
  align-items: center;
  gap: 14px;

  padding: 13px 13px 13px 22px;

  color: white;

  background: #0b4878;

  border-radius: 7px;

  font-size: 14px;
  font-weight: 700;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.security-button:hover {
  background: #082f56;

  transform: translateY(-2px);
}

.security-button-arrow {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.15);

  border-radius: 5px;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1050px) {
  .security-inner {
    grid-template-columns: 1fr;

    gap: 60px;
  }

  .security-content {
    max-width: 700px;
  }

  .security-visual {
    min-height: 500px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 650px) {
  .security-section {
    padding: 80px 20px 90px;
  }

  .security-inner {
    gap: 40px;
  }

  .security-visual {
    min-height: 390px;
  }

  .security-glow {
    width: 240px;
    height: 240px;
  }

  .orbit-one {
    width: 290px;
    height: 290px;
  }

  .orbit-two {
    width: 220px;
    height: 220px;
  }

  .orbit-three {
    width: 350px;
    height: 350px;
  }

  .security-shield {
    width: 125px;
    height: 145px;
  }

  .security-shield svg {
    width: 55px;
    height: 55px;
  }

  .floating-top {
    top: 25px;
    left: 0;
  }

  .floating-right {
    top: 145px;
    right: -5px;
  }

  .floating-bottom {
    bottom: 20px;
    left: 7%;
  }

  .security-content h2 {
    font-size: 42px;
  }

  .security-description {
    font-size: 15px;
  }

  .security-features {
    grid-template-columns: 1fr;

    gap: 20px;
  }

  .security-button {
    width: 100%;

    justify-content: space-between;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .security-section {
    padding: 65px 16px 75px;
  }

  .security-visual {
    min-height: 350px;
  }

  .security-floating {
    padding: 10px 11px;
  }

  .floating-top {
    left: -5px;
  }

  .floating-right {
    right: -8px;
  }

  .security-content h2 {
    font-size: 37px;
  }
}
</style>
