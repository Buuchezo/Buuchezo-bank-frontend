<script setup lang="ts">
import {
  ShieldCheck,
  Zap,
  Users,
  Play,
  LockKeyhole,
  Globe2,
  BarChart3,
  Sprout,
  Wifi,
  ArrowUpRight,
} from 'lucide-vue-next'

import heroImage from '../assets/images/banking-hero.png'
import BankingFeaturesView from '@/components/layout/BankingFeaturesView.vue'
import BankingDashboardView from '@/components/layout/BankingDashboardView.vue'
import SecuritySectionView from '@/components/layout/SecuritySectionView.vue'
import BankingLifeSectionView from '@/components/layout/BankingLifeSectionView.vue'
import FinalCTAView from '@/components/layout/FinalCTAView.vue'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
</script>

<template>
  <main class="home">
    <Navbar />
    <!-- =========================================================
         HERO
    ========================================================== -->

    <section class="hero">
      <!-- =======================================================
           BACKGROUND PHOTO
      ======================================================== -->

      <div class="hero-stage">
        <div
          class="hero-photo"
          :style="{
            backgroundImage: `url(${heroImage})`,
          }"
        ></div>

        <div class="hero-photo-overlay"></div>
      </div>

      <!-- =======================================================
           HERO GEOMETRY

           The turquoise ribbon and white panel are completely
           independent SVG shapes.
      ======================================================== -->

      <svg
        class="hero-geometry"
        viewBox="0 0 1728 864"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <!-- =====================================================
             INDEPENDENT TURQUOISE RIBBON

             Solid shape.
             No glow.
             No blur.
             No stroke.
        ====================================================== -->

        <path
          class="turquoise-ribbon"
          d="
            M 1038 0

            C 947 82,
              823 158,
              716 248

            C 632 318,
              593 391,
              605 462

            C 619 548,
              693 631,
              786 699

            C 882 769,
              1002 822,
              1135 864

            L 1177 864

            C 1040 814,
              925 758,
              839 691

            C 754 625,
              684 548,
              672 465

            C 661 393,
              704 320,
              787 251

            C 894 163,
              1012 82,
              1088 0

            Z
          "
        />

        <!-- =====================================================
             INDEPENDENT WHITE HERO PANEL
        ====================================================== -->

        <path
          class="white-shape"
          d="
            M 0 0

            L 1048 0

            C 970 72,
              853 147,
              748 227

            C 665 291,
              620 351,
              620 427

            C 620 512,
              687 589,
              773 655

            C 858 720,
              963 779,
              1075 835

            C 1090 843,
              1107 853,
              1127 864

            L 0 864

            Z
          "
        />
      </svg>

      <!-- =======================================================
           HERO CONTENT
      ======================================================== -->

      <div class="hero-content">
        <div class="hero-content-inner">
          <!-- =================================================
               EYEBROW
          ================================================== -->

          <div class="hero-eyebrow-wrap">
            <span class="hero-eyebrow-line"></span>

            <span class="hero-eyebrow"> YOUR LIFE. OUR COMMITMENT. </span>
          </div>

          <!-- =================================================
               HEADLINE

               Each line is independent so the text cannot
               accidentally wrap or collide with the curve.

               Extra bottom space is deliberately provided
               for the "y" descender.
          ================================================== -->

          <h1 class="hero-title">
            <span class="title-line"> Banking </span>

            <span class="title-line"> that moves </span>

            <span class="title-line title-accent"> with you. </span>
          </h1>

          <!-- =================================================
               DESCRIPTION
          ================================================== -->

          <p class="hero-description">
            Simple. Secure. Personal. A modern banking experience built for your tomorrow.
          </p>

          <!-- =================================================
               BUTTONS
          ================================================== -->

          <div class="hero-buttons">
            <RouterLink to="/register" class="primary-button">
              <span> Open an Account </span>

              <span class="button-arrow">
                <ArrowUpRight :size="16" />
              </span>
            </RouterLink>

            <button type="button" class="secondary-button">
              <span class="play-button">
                <Play :size="10" fill="currentColor" />
              </span>

              <span> See How It Works </span>
            </button>
          </div>

          <!-- =================================================
               TRUST ROW
          ================================================== -->

          <div class="trust-row">
            <div class="trust-item">
              <div class="trust-circle">
                <ShieldCheck :size="17" />
              </div>

              <div class="trust-copy">
                <strong> Your money </strong>

                <span> is protected </span>
              </div>
            </div>

            <div class="trust-item">
              <div class="trust-circle">
                <Zap :size="17" />
              </div>

              <div class="trust-copy">
                <strong> Bank anytime, </strong>

                <span> anywhere </span>
              </div>
            </div>

            <div class="trust-item">
              <div class="trust-circle">
                <Users :size="17" />
              </div>

              <div class="trust-copy">
                <strong> Trusted by </strong>

                <span> 100K+ customers </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================================================
           A STRONGER TOMORROW
      ======================================================== -->

      <div class="tomorrow-label">
        <span> A </span>

        <strong>
          Stronger
          <br />
          Tomorrow
        </strong>

        <div class="tomorrow-line"></div>
      </div>

      <!-- =======================================================
           CARD SHADOW
      ======================================================== -->

      <div class="card-shadow"></div>

      <!-- =======================================================
           BANK CARD
      ======================================================== -->

      <div class="bank-card">
        <div class="card-reflection"></div>

        <div class="card-ring card-ring-one"></div>

        <div class="card-ring card-ring-two"></div>

        <div class="card-header">
          <div class="card-brand">
            <div class="card-logo">B</div>

            <strong> Buuchezo Bank </strong>
          </div>

          <Wifi class="contactless" :size="23" />
        </div>

        <!-- CHIP -->

        <div class="card-chip">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <!-- NUMBER -->

        <div class="card-number">5432&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;3456</div>

        <!-- FOOTER -->

        <div class="card-footer">
          <div class="card-holder">
            <span> CARD HOLDER </span>

            <strong> JOHN DOE </strong>
          </div>

          <div class="card-payment-logo">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- =======================================================
           CONTROL PANEL
      ======================================================== -->

      <div class="control-panel">
        <div class="control-header">
          <div>
            <span class="control-kicker"> YOUR BANKING </span>

            <h3>You're in control</h3>
          </div>

          <span class="control-status"></span>
        </div>

        <div class="control-list">
          <div class="control-row">
            <div class="control-icon">
              <LockKeyhole :size="14" />
            </div>

            <span> Manage your accounts </span>
          </div>

          <div class="control-row">
            <div class="control-icon">
              <Globe2 :size="14" />
            </div>

            <span> Send money globally </span>
          </div>

          <div class="control-row">
            <div class="control-icon">
              <BarChart3 :size="14" />
            </div>

            <span> Track your spending </span>
          </div>

          <div class="control-row">
            <div class="control-icon">
              <Sprout :size="14" />
            </div>

            <span> Reach your goals </span>
          </div>
        </div>
      </div>

      <!-- =======================================================
           PHOTO DETAIL
      ======================================================== -->

      <div class="hero-photo-detail">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>

    <!-- =========================================================
         NEXT SECTION
    ========================================================== -->
    <BankingFeaturesView />
    <BankingDashboardView />
    <SecuritySectionView />
    <BankingLifeSectionView />
    <FinalCTAView />
    <Footer />
  </main>
</template>

<style scoped>
/* ================================================================
   HOME
================================================================ */

.home {
  width: 100%;
  overflow: hidden;
  background: #ffffff;
}

/* ================================================================
   HERO
================================================================ */

.hero {
  position: relative;

  width: 100%;
  height: 720px;

  overflow: hidden;

  background: #ffffff;

  isolation: isolate;
}

/* ================================================================
   PHOTO STAGE
================================================================ */

.hero-stage {
  position: absolute;

  inset: 0;

  z-index: 1;

  overflow: hidden;
}

/* ================================================================
   PHOTO
================================================================ */

.hero-photo {
  position: absolute;

  inset: -1.5%;

  width: 103%;
  height: 103%;

  background-repeat: no-repeat;

  background-size: cover;

  background-position: center center;

  transform: scale(1.01);

  filter: saturate(0.91) contrast(0.97) brightness(0.97);

  animation: heroPhotoEnter 1.2s ease-out both;
}

/* ================================================================
   PHOTO OVERLAY
================================================================ */

.hero-photo-overlay {
  position: absolute;

  inset: 0;

  pointer-events: none;

  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0) 44%,
    rgba(3, 35, 65, 0.07) 100%
  );
}

/* ================================================================
   HERO SVG
================================================================ */

.hero-geometry {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  z-index: 10;

  pointer-events: none;

  overflow: visible;
}

/* ================================================================
   INDEPENDENT TURQUOISE RIBBON
================================================================ */

.turquoise-ribbon {
  fill: #8fe7e1;

  opacity: 1;
}

/* ================================================================
   WHITE HERO PANEL
================================================================ */

.white-shape {
  fill: #ffffff;
}

/* ================================================================
   HERO CONTENT
================================================================ */

.hero-content {
  position: absolute;

  top: 0;
  left: 0;

  width: 58%;
  height: 100%;

  z-index: 20;

  display: flex;

  align-items: center;

  pointer-events: none;
}

.hero-content-inner {
  width: 100%;

  box-sizing: border-box;

  padding-left: clamp(55px, 6.7vw, 108px);

  padding-right: 50px;

  padding-top: 15px;

  pointer-events: auto;
}

/* ================================================================
   EYEBROW
================================================================ */

.hero-eyebrow-wrap {
  display: flex;

  align-items: center;

  gap: 11px;

  margin-bottom: 20px;

  animation: contentEnter 0.7s 0.1s ease-out both;
}

.hero-eyebrow-line {
  width: 27px;

  height: 1px;

  flex-shrink: 0;

  background: #10a9a0;
}

.hero-eyebrow {
  display: block;

  color: #087b99;

  font-size: 9px;

  font-weight: 750;

  letter-spacing: 2.7px;

  line-height: 1;

  white-space: nowrap;
}

/* ================================================================
   HEADLINE

   IMPORTANT FIX:

   The previous line-height was .95.

   That was too tight for the font's descenders,
   especially the "y" in "you".

   The headline now has a comfortable line-height
   and bottom padding so no part of the letters is
   clipped.
================================================================ */

.hero-title {
  display: block;

  width: min(100%, 650px);

  max-width: 650px;

  margin: 0;

  padding: 0 0 10px;

  box-sizing: border-box;

  color: #071b37;

  font-size: clamp(56px, 4.7vw, 76px);

  font-weight: 760;

  line-height: 1.04;

  letter-spacing: -3.8px;

  white-space: normal;

  overflow: visible;

  animation: contentEnter 0.8s 0.18s ease-out both;
}

/* ================================================================
   INDIVIDUAL TITLE LINES
================================================================ */

.title-line {
  display: block;

  width: max-content;

  max-width: 100%;

  white-space: nowrap;

  overflow: visible;
}

/* ================================================================
   ACCENT TITLE LINE
================================================================ */

.title-accent {
  display: block;

  padding-bottom: 4px;

  background: linear-gradient(100deg, #126bc0 0%, #087fae 48%, #03a6a0 100%);

  -webkit-background-clip: text;

  background-clip: text;

  -webkit-text-fill-color: transparent;

  background-size: 180% 100%;

  animation: gradientMove 7s ease-in-out infinite;
}

/* ================================================================
   DESCRIPTION
================================================================ */

.hero-description {
  width: 430px;

  max-width: 100%;

  margin: 22px 0 30px;

  color: #65778a;

  font-size: 14px;

  font-weight: 450;

  line-height: 1.7;

  animation: contentEnter 0.8s 0.28s ease-out both;
}

/* ================================================================
   BUTTONS
================================================================ */

.hero-buttons {
  display: flex;

  align-items: center;

  gap: 12px;

  animation: contentEnter 0.8s 0.36s ease-out both;
}

/* ================================================================
   PRIMARY BUTTON
================================================================ */

.primary-button {
  height: 47px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 17px;

  padding: 0 17px 0 21px;

  box-sizing: border-box;

  border: 1px solid rgba(255, 255, 255, 0.12);

  border-radius: 7px;

  background: linear-gradient(135deg, #053a70 0%, #075995 55%, #086b9f 100%);

  color: #ffffff;

  text-decoration: none;

  font-size: 11px;

  font-weight: 650;

  box-shadow: 0 12px 26px rgba(5, 55, 105, 0.19);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.primary-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 17px 32px rgba(5, 55, 105, 0.25);

  background: linear-gradient(135deg, #06437d 0%, #08649f 55%, #0879aa 100%);
}

.button-arrow {
  width: 25px;

  height: 25px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.13);
}

/* ================================================================
   SECONDARY BUTTON
================================================================ */

.secondary-button {
  height: 47px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 0 18px;

  box-sizing: border-box;

  border: 1px solid #d2dce5;

  border-radius: 7px;

  background: rgba(255, 255, 255, 0.78);

  color: #29445f;

  font-size: 11px;

  font-weight: 550;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.secondary-button:hover {
  transform: translateY(-1px);

  background: #ffffff;

  border-color: #b8cbd9;
}

.play-button {
  width: 23px;

  height: 23px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid #b6c9d8;

  border-radius: 50%;

  color: #1175a7;
}

/* ================================================================
   TRUST ROW
================================================================ */

.trust-row {
  display: flex;

  align-items: center;

  gap: 29px;

  margin-top: 41px;

  animation: contentEnter 0.8s 0.44s ease-out both;
}

.trust-item {
  display: flex;

  align-items: center;

  gap: 9px;
}

.trust-circle {
  width: 36px;

  height: 36px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid rgba(0, 156, 143, 0.07);

  border-radius: 50%;

  background: #e2f8f4;

  color: #00998d;
}

.trust-copy {
  display: flex;

  flex-direction: column;

  gap: 1px;
}

.trust-item strong {
  color: #29445e;

  font-size: 8.5px;

  font-weight: 700;

  line-height: 1.35;
}

.trust-item span {
  color: #8090a0;

  font-size: 8.5px;

  line-height: 1.35;
}

/* ================================================================
   TOMORROW LABEL
================================================================ */

.tomorrow-label {
  position: absolute;

  z-index: 40;

  top: 27.5%;

  right: 6.5%;

  display: flex;

  flex-direction: column;

  color: #082f56;

  animation: contentEnter 0.9s 0.5s ease-out both;
}

.tomorrow-label > span {
  color: #668198;

  font-size: 9px;

  line-height: 1;
}

.tomorrow-label strong {
  margin-top: 5px;

  font-size: 16px;

  font-weight: 680;

  line-height: 1.12;

  letter-spacing: -0.3px;
}

.tomorrow-line {
  width: 35px;

  height: 1px;

  margin-top: 14px;

  background: #0878a1;
}

/* ================================================================
   CARD SHADOW
================================================================ */

.card-shadow {
  position: absolute;

  z-index: 44;

  top: 58%;

  left: 53.5%;

  width: 350px;

  height: 80px;

  background: rgba(1, 31, 65, 0.25);

  border-radius: 50%;

  filter: blur(29px);

  transform: rotate(-8deg);

  opacity: 0.48;
}

/* ================================================================
   BANK CARD
================================================================ */

.bank-card {
  position: absolute;

  z-index: 50;

  top: 21%;

  left: 52%;

  width: 410px;

  height: 247px;

  padding: 25px 27px;

  box-sizing: border-box;

  border: 1px solid rgba(255, 255, 255, 0.18);

  border-radius: 19px;

  background: linear-gradient(145deg, #06396f 0%, #075493 45%, #1344bb 100%);

  color: #ffffff;

  overflow: hidden;

  transform: perspective(1600px) rotateX(7deg) rotateY(-14deg) rotateZ(-6deg);

  transform-origin: center center;

  box-shadow:
    0 34px 65px rgba(0, 30, 70, 0.34),
    0 8px 18px rgba(0, 30, 70, 0.13);

  animation: cardFloat 6s ease-in-out infinite;

  transition:
    transform 0.5s ease,
    box-shadow 0.5s ease;
}

.bank-card:hover {
  transform: perspective(1600px) rotateX(5deg) rotateY(-9deg) rotateZ(-4deg) translateY(-5px);

  box-shadow: 0 42px 75px rgba(0, 30, 70, 0.38);
}

/* ================================================================
   CARD REFLECTION
================================================================ */

.card-reflection {
  position: absolute;

  z-index: 1;

  top: -100px;

  left: -90px;

  width: 500px;

  height: 160px;

  transform: rotate(-25deg);

  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);

  filter: blur(5px);

  pointer-events: none;
}

/* ================================================================
   CARD RINGS
================================================================ */

.card-ring {
  position: absolute;

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 50%;

  pointer-events: none;
}

.card-ring-one {
  width: 350px;

  height: 350px;

  top: -205px;

  right: -100px;
}

.card-ring-two {
  width: 265px;

  height: 265px;

  top: -160px;

  right: -55px;

  border-color: rgba(255, 255, 255, 0.06);
}

/* ================================================================
   CARD HEADER
================================================================ */

.card-header {
  position: relative;

  z-index: 3;

  display: flex;

  align-items: center;

  justify-content: space-between;
}

.card-brand {
  display: flex;

  align-items: center;

  gap: 9px;
}

.card-logo {
  width: 27px;

  height: 27px;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.9);

  border-radius: 6px;

  font-size: 14px;

  font-weight: 800;
}

.card-brand strong {
  font-size: 13px;

  font-weight: 650;
}

.contactless {
  transform: rotate(90deg);

  opacity: 0.9;
}

/* ================================================================
   CHIP
================================================================ */

.card-chip {
  position: relative;

  z-index: 3;

  width: 45px;

  height: 32px;

  margin-top: 27px;

  border-radius: 5px;

  background: linear-gradient(135deg, #bba963 0%, #eee0a5 50%, #a99859 100%);

  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.55),
    0 2px 4px rgba(0, 0, 0, 0.12);
}

.card-chip span {
  position: absolute;

  border: 1px solid rgba(80, 70, 35, 0.28);
}

.card-chip span:nth-child(1) {
  top: 0;

  bottom: 0;

  left: 50%;

  width: 1px;
}

.card-chip span:nth-child(2) {
  left: 0;

  right: 0;

  top: 50%;

  height: 1px;
}

.card-chip span:nth-child(3) {
  top: 0;

  bottom: 0;

  left: 14px;

  width: 1px;
}

/* ================================================================
   CARD NUMBER
================================================================ */

.card-number {
  position: relative;

  z-index: 3;

  margin-top: 18px;

  font-size: 18px;

  font-weight: 500;

  letter-spacing: 2px;

  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}

/* ================================================================
   CARD FOOTER
================================================================ */

.card-footer {
  position: relative;

  z-index: 3;

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-top: 17px;
}

.card-holder {
  display: flex;

  flex-direction: column;
}

.card-holder span {
  margin-bottom: 3px;

  font-size: 6px;

  letter-spacing: 1px;

  opacity: 0.62;
}

.card-holder strong {
  font-size: 9px;

  letter-spacing: 1px;
}

/* ================================================================
   PAYMENT LOGO
================================================================ */

.card-payment-logo {
  position: relative;

  width: 44px;

  height: 26px;
}

.card-payment-logo span {
  position: absolute;

  width: 26px;

  height: 26px;

  border-radius: 50%;
}

.card-payment-logo span:first-child {
  left: 0;

  background: #ed453b;
}

.card-payment-logo span:last-child {
  left: 15px;

  background: #f3a923;
}

/* ================================================================
   CONTROL PANEL
================================================================ */

.control-panel {
  position: absolute;

  z-index: 60;

  right: 6.8%;

  bottom: 8.2%;

  width: 238px;

  padding: 19px;

  box-sizing: border-box;

  border: 1px solid rgba(255, 255, 255, 0.9);

  border-radius: 15px;

  background: rgba(255, 255, 255, 0.91);

  box-shadow:
    0 27px 55px rgba(0, 31, 66, 0.18),
    0 5px 12px rgba(0, 31, 66, 0.06);

  backdrop-filter: blur(18px);

  -webkit-backdrop-filter: blur(18px);

  animation: panelFloat 7s ease-in-out infinite;
}

/* ================================================================
   CONTROL HEADER
================================================================ */

.control-header {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  margin-bottom: 15px;
}

.control-kicker {
  display: block;

  margin-bottom: 4px;

  color: #0b96a0;

  font-size: 7px;

  font-weight: 750;

  letter-spacing: 1.6px;
}

.control-panel h3 {
  margin: 0;

  color: #102d4f;

  font-size: 13px;

  font-weight: 720;

  letter-spacing: -0.2px;
}

.control-status {
  width: 7px;

  height: 7px;

  margin-top: 3px;

  border-radius: 50%;

  background: #13b49f;

  box-shadow: 0 0 0 4px rgba(19, 180, 159, 0.1);
}

/* ================================================================
   CONTROL LIST
================================================================ */

.control-list {
  display: flex;

  flex-direction: column;

  gap: 10px;
}

.control-row {
  display: flex;

  align-items: center;

  gap: 9px;

  min-height: 27px;
}

.control-icon {
  width: 27px;

  height: 27px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border: 1px solid rgba(0, 152, 138, 0.07);

  border-radius: 7px;

  background: #e1f7f3;

  color: #00988a;
}

.control-row > span {
  color: #52677e;

  font-size: 9px;

  font-weight: 470;
}

/* ================================================================
   PHOTO DETAIL
================================================================ */

.hero-photo-detail {
  position: absolute;

  z-index: 5;

  right: 2.5%;

  top: 13%;

  width: 70px;

  height: 70px;

  opacity: 0.5;

  pointer-events: none;
}

.hero-photo-detail span {
  position: absolute;

  display: block;

  border: 1px solid rgba(255, 255, 255, 0.32);

  border-radius: 50%;
}

.hero-photo-detail span:nth-child(1) {
  inset: 0;
}

.hero-photo-detail span:nth-child(2) {
  inset: 12px;
}

.hero-photo-detail span:nth-child(3) {
  inset: 24px;
}

/* ================================================================
   NEXT SECTION
================================================================ */

.next-section {
  position: relative;

  min-height: 330px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #ffffff;
}

.next-section-inner {
  width: min(1100px, calc(100% - 80px));

  padding: 60px 0;
}

.section-label {
  color: #087c9b;

  font-size: 9px;

  font-weight: 750;

  letter-spacing: 2.4px;
}

.next-section h2 {
  margin: 10px 0 10px;

  color: #071a38;

  font-size: 43px;

  font-weight: 700;

  letter-spacing: -2.3px;
}

.next-section p {
  max-width: 500px;

  margin: 0;

  color: #708194;

  font-size: 14px;

  line-height: 1.7;
}

/* ================================================================
   ANIMATIONS
================================================================ */

@keyframes heroPhotoEnter {
  from {
    opacity: 0;

    transform: scale(1.045);
  }

  to {
    opacity: 1;

    transform: scale(1.01);
  }
}

@keyframes contentEnter {
  from {
    opacity: 0;

    transform: translateY(16px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}

@keyframes gradientMove {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes cardFloat {
  0%,
  100% {
    transform: perspective(1600px) rotateX(7deg) rotateY(-14deg) rotateZ(-6deg) translateY(0);
  }

  50% {
    transform: perspective(1600px) rotateX(7deg) rotateY(-14deg) rotateZ(-6deg) translateY(-8px);
  }
}

@keyframes panelFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

/* ================================================================
   LAPTOP
================================================================ */

@media (max-width: 1250px) {
  .hero {
    height: 680px;
  }

  .hero-content {
    width: 57%;
  }

  .hero-content-inner {
    padding-left: 50px;

    padding-right: 35px;
  }

  .hero-title {
    font-size: 58px;

    letter-spacing: -3px;

    line-height: 1.04;

    max-width: 590px;
  }

  .hero-description {
    width: 390px;
  }

  .trust-row {
    gap: 20px;
  }

  .bank-card {
    left: 50%;

    width: 360px;

    height: 217px;

    padding: 21px 23px;
  }

  .card-number {
    font-size: 15px;
  }

  .card-chip {
    margin-top: 21px;
  }

  .control-panel {
    right: 4.5%;

    width: 210px;
  }

  .tomorrow-label {
    right: 4%;
  }
}

/* ================================================================
   SMALL LAPTOP
================================================================ */

@media (max-width: 1100px) {
  .hero-content {
    width: 56%;
  }

  .hero-content-inner {
    padding-left: 40px;

    padding-right: 28px;
  }

  .hero-title {
    font-size: 53px;

    letter-spacing: -2.8px;

    max-width: 540px;
  }

  .hero-description {
    width: 360px;
  }

  .trust-row {
    gap: 16px;
  }

  .bank-card {
    left: 49%;

    width: 340px;

    height: 205px;

    padding: 20px 22px;
  }

  .card-number {
    font-size: 14px;
  }

  .card-chip {
    margin-top: 19px;
  }

  .control-panel {
    right: 3%;

    width: 200px;
  }

  .tomorrow-label {
    right: 2.5%;
  }
}

/* ================================================================
   TABLET
================================================================ */

@media (max-width: 950px) {
  .hero {
    height: 620px;
  }

  .hero-content {
    width: 55%;
  }

  .hero-content-inner {
    padding-left: 28px;

    padding-right: 20px;
  }

  .hero-title {
    font-size: 45px;

    letter-spacing: -2.5px;

    line-height: 1.04;

    max-width: 480px;
  }

  .hero-description {
    width: 315px;

    font-size: 12.5px;
  }

  .hero-buttons {
    gap: 8px;
  }

  .primary-button,
  .secondary-button {
    padding-left: 15px;

    padding-right: 15px;
  }

  .trust-row {
    gap: 12px;

    margin-top: 32px;
  }

  .trust-circle {
    width: 31px;

    height: 31px;
  }

  .trust-item strong,
  .trust-item span {
    font-size: 7.5px;
  }

  .bank-card {
    top: 22%;

    left: 48%;

    width: 300px;

    height: 181px;

    padding: 18px 20px;
  }

  .card-logo {
    width: 23px;

    height: 23px;

    font-size: 12px;
  }

  .card-brand strong {
    font-size: 9.5px;
  }

  .card-chip {
    width: 37px;

    height: 26px;

    margin-top: 16px;
  }

  .card-number {
    margin-top: 12px;

    font-size: 12px;

    letter-spacing: 1.2px;
  }

  .card-footer {
    margin-top: 10px;
  }

  .tomorrow-label {
    top: 23%;

    right: 2%;
  }

  .tomorrow-label strong {
    font-size: 12px;
  }

  .control-panel {
    right: 2%;

    bottom: 6%;

    width: 175px;

    padding: 14px;
  }

  .control-panel h3 {
    font-size: 10px;
  }

  .control-row {
    gap: 7px;
  }

  .control-row > span {
    font-size: 7.5px;
  }

  .control-icon {
    width: 25px;

    height: 25px;
  }
}

/* ================================================================
   MOBILE
================================================================ */

/* ================================================================
   MOBILE
================================================================ */

@media (max-width: 800px) {
  /* --------------------------------------------------------------
     HERO
  -------------------------------------------------------------- */

  .hero {
    position: relative;

    width: 100%;

    height: auto;
    min-height: 0;

    overflow: visible;

    display: flex;
    flex-direction: column;

    background: #ffffff;
  }

  /* --------------------------------------------------------------
     PHOTO STAGE
  -------------------------------------------------------------- */

  .hero-stage {
    position: relative;

    width: 100%;

    height: 370px;

    flex-shrink: 0;
  }

  .hero-photo {
    position: absolute;

    inset: 0;

    width: 100%;
    height: 370px;

    background-size: cover;

    background-position: 60% center;
  }

  .hero-photo-overlay {
    position: absolute;

    inset: 0;

    width: 100%;
    height: 370px;

    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.06) 100%);
  }

  /* --------------------------------------------------------------
     REMOVE DESKTOP CURVED SVG
  -------------------------------------------------------------- */

  .hero-geometry {
    display: none;
  }

  /* --------------------------------------------------------------
     PHOTO DETAIL
  -------------------------------------------------------------- */

  .hero-photo-detail {
    top: 8%;
    left: 5%;
    right: auto;

    width: 55px;
    height: 55px;
  }

  /* --------------------------------------------------------------
     STRONGER TOMORROW
  -------------------------------------------------------------- */

  .tomorrow-label {
    position: absolute !important;

    top: 390px !important;
    left: 50% !important;
    right: auto !important;

    z-index: 55;

    width: max-content;

    transform: translateX(-50%) !important;

    text-align: center;
  }

  .tomorrow-label > span {
    color: rgba(50, 20, 27, 0.72);

    font-size: 8px;

    line-height: 1;

    text-align: center;
  }

  .tomorrow-label strong {
    margin-top: 5px;

    color: #32141b;

    font-size: 13px;

    font-weight: 700;

    line-height: 1.12;

    letter-spacing: -0.2px;

    text-align: center;
  }

  .tomorrow-line {
    width: 28px;

    height: 1px;

    margin-top: 9px;

    background: #a51c30;
  }

  /* --------------------------------------------------------------
     BANK CARD
  -------------------------------------------------------------- */

  .bank-card {
    position: absolute;

    z-index: 50;

    top: 115px;

    left: 50%;

    right: auto;

    width: min(calc(100vw - 42px), 315px);

    height: auto;

    aspect-ratio: 410 / 247;

    padding: 19px 21px;

    box-sizing: border-box;

    transform: translateX(-50%) perspective(1100px) rotateX(5deg) rotateY(-10deg) rotateZ(-4deg);

    transform-origin: center center;

    animation: mobileCardFloat 6s ease-in-out infinite;
  }

  .bank-card:hover {
    transform: translateX(-50%) perspective(1100px) rotateX(4deg) rotateY(-7deg) rotateZ(-2deg);
  }

  /* --------------------------------------------------------------
     CARD SHADOW
  -------------------------------------------------------------- */

  .card-shadow {
    position: absolute;

    z-index: 44;

    top: 275px;

    left: 50%;

    right: auto;

    width: min(260px, 70vw);

    height: 42px;

    transform: translateX(-50%) rotate(-4deg);

    filter: blur(20px);

    opacity: 0.35;
  }

  /* --------------------------------------------------------------
     HERO CONTENT

     IMPORTANT:
     It is now part of the normal page flow.
  -------------------------------------------------------------- */

  .hero-content {
    position: relative;

    top: auto;
    left: auto;

    width: 100%;
    height: auto;

    min-height: 0;

    display: block;

    order: 2;

    background: #ffffff;

    z-index: 20;

    pointer-events: none;
  }

  .hero-content-inner {
    position: relative;

    width: 100%;

    box-sizing: border-box;

    padding: 52px 25px 42px;

    pointer-events: auto;
  }

  /* --------------------------------------------------------------
     EYEBROW
  -------------------------------------------------------------- */

  .hero-eyebrow-wrap {
    margin-bottom: 17px;
  }

  .hero-eyebrow-line {
    width: 23px;
  }

  .hero-eyebrow {
    font-size: 8px;

    letter-spacing: 2.3px;
  }

  /* --------------------------------------------------------------
     TITLE
  -------------------------------------------------------------- */

  .hero-title {
    width: 100%;

    max-width: 100%;

    font-size: 48px;

    line-height: 1.04;

    letter-spacing: -2.8px;

    padding-bottom: 8px;
  }

  .title-line {
    width: auto;

    max-width: 100%;

    white-space: normal;
  }

  .title-accent {
    padding-bottom: 5px;
  }

  /* --------------------------------------------------------------
     DESCRIPTION
  -------------------------------------------------------------- */

  .hero-description {
    width: auto;

    max-width: 100%;

    margin: 24px 0 26px;

    font-size: 13.5px;

    line-height: 1.65;
  }

  /* --------------------------------------------------------------
     BUTTONS
  -------------------------------------------------------------- */

  .hero-buttons {
    width: 100%;

    display: flex;

    flex-direction: column;

    align-items: stretch;

    gap: 9px;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  /* --------------------------------------------------------------
     TRUST ROW
  -------------------------------------------------------------- */

  .trust-row {
    width: 100%;

    display: grid;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    align-items: center;

    gap: 16px 12px;

    margin-top: 30px;
  }

  .trust-item {
    min-width: 0;

    display: flex;

    align-items: center;

    gap: 8px;
  }

  .trust-circle {
    width: 34px;
    height: 34px;

    flex-shrink: 0;
  }

  .trust-copy {
    min-width: 0;
  }

  .trust-item strong,
  .trust-item span {
    display: block;

    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;
  }

  .trust-item strong {
    font-size: 8px;
  }

  .trust-item span {
    font-size: 8px;
  }

  /* --------------------------------------------------------------
     CONTROL PANEL

     IMPORTANT:
     This is now BELOW the hero content.

     It is NOT positioned with top/right/bottom/left.
  -------------------------------------------------------------- */

  .control-panel {
    position: relative !important;

    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;

    width: calc(100% - 50px) !important;

    max-width: none;

    margin: 0 25px 42px !important;

    padding: 18px !important;

    box-sizing: border-box;

    order: 3;

    z-index: 30;

    transform: none;

    animation: none;

    border: 1px solid rgba(255, 255, 255, 0.9);

    border-radius: 15px;

    background: rgba(255, 255, 255, 0.96);

    box-shadow:
      0 20px 45px rgba(0, 31, 66, 0.12),
      0 5px 12px rgba(0, 31, 66, 0.05);

    backdrop-filter: blur(18px);

    -webkit-backdrop-filter: blur(18px);
  }

  .control-header {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    margin-bottom: 15px;
  }

  .control-kicker {
    font-size: 7px;
  }

  .control-panel h3 {
    font-size: 13px;
  }

  .control-list {
    display: grid;

    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 10px;
  }

  .control-row {
    min-width: 0;

    display: flex;

    align-items: center;

    gap: 8px;
  }

  .control-icon {
    width: 27px;
    height: 27px;

    flex-shrink: 0;
  }

  .control-row > span {
    min-width: 0;

    font-size: 8px;

    line-height: 1.35;
  }

  /* --------------------------------------------------------------
     NEXT SECTION
  -------------------------------------------------------------- */

  .next-section {
    position: relative;

    width: 100%;

    min-height: 0;

    display: block;

    background: #ffffff;
  }

  .next-section-inner {
    width: calc(100% - 40px);

    padding: 55px 0;
  }

  .next-section h2 {
    font-size: 34px;

    line-height: 1.05;
  }
}

/* ================================================================
   MOBILE - 600px
================================================================ */

@media (max-width: 600px) {
  .hero-stage {
    height: 350px;

    flex-basis: 350px;
  }

  .hero-content-inner {
    padding: 48px 24px 42px;
  }

  .hero-title {
    font-size: 44px;

    line-height: 1.05;

    letter-spacing: -2.5px;
  }

  .hero-description {
    font-size: 13.5px;

    line-height: 1.65;

    margin: 22px 0 25px;
  }

  .bank-card {
    top: 140px;

    width: min(calc(100% - 38px), 315px);
  }

  .card-shadow {
    top: 250px;
  }

  .tomorrow-label {
    top: 22px;

    right: 5%;
  }

  .control-panel {
    width: calc(100% - 48px) !important;

    margin: 0 24px 40px !important;

    padding: 17px !important;
  }

  .next-section-inner {
    width: calc(100% - 40px);
  }

  .next-section h2 {
    font-size: 32px;
  }
}

/* ================================================================
   SMALL MOBILE - 500px
================================================================ */

@media (max-width: 500px) {
  .hero-stage {
    height: 350px;
  }
  .hero-photo {
    height: 350px;

    background-position: 60% center;
  }

  .hero-photo-overlay {
    height: 350px;
  }

  .hero-content-inner {
    padding: 46px 20px 36px;
  }

  .hero-eyebrow-wrap {
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 41px;

    line-height: 1.05;

    letter-spacing: -2.3px;

    padding-bottom: 8px;
  }

  .hero-description {
    font-size: 13px;

    line-height: 1.6;

    margin: 20px 0 24px;
  }

  .primary-button,
  .secondary-button {
    height: 45px;

    font-size: 11px;
  }

  .trust-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 14px 10px;

    margin-top: 25px;
  }

  .trust-circle {
    width: 32px;
    height: 32px;
  }

  .trust-item strong,
  .trust-item span {
    font-size: 7.5px;
  }

  .bank-card {
    top: 105px;

    left: 50%;

    width: min(calc(100vw - 34px), 300px);

    padding: 17px 19px;

    transform: translateX(-50%) perspective(1100px) rotateX(5deg) rotateY(-10deg) rotateZ(-4deg);
  }
  .bank-card:hover {
    transform: translateX(-50%) perspective(1100px) rotateX(4deg) rotateY(-7deg) rotateZ(-2deg);
  }
  .card-logo {
    width: 22px;
    height: 22px;

    font-size: 12px;
  }

  .card-brand strong {
    font-size: 9px;
  }

  .card-chip {
    width: 34px;
    height: 24px;

    margin-top: 16px;
  }

  .card-number {
    margin-top: 11px;

    font-size: 11px;

    letter-spacing: 1.1px;
  }

  .card-footer {
    margin-top: 10px;
  }

  .card-shadow {
    top: 260px;

    left: 50%;

    width: min(245px, 72vw);
  }

  .tomorrow-label {
    top: 300px !important;

    left: 50%;

    right: auto;

    transform: translateX(-50%);
  }

  .tomorrow-label > span {
    font-size: 8px;
  }

  .tomorrow-label strong {
    font-size: 12px;
  }

  .tomorrow-line {
    width: 25px;

    margin-top: 8px;
  }

  .control-panel {
    width: calc(100% - 40px) !important;

    margin: 0 20px 36px !important;

    padding: 16px !important;
  }

  .control-panel h3 {
    font-size: 11px;
  }

  .control-kicker {
    font-size: 6.5px;
  }

  .control-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 9px;
  }

  .control-row {
    gap: 7px;
  }

  .control-icon {
    width: 25px;
    height: 25px;
  }

  .control-row > span {
    font-size: 7.5px;
  }

  .next-section-inner {
    width: calc(100% - 40px);
  }

  .next-section h2 {
    font-size: 30px;

    letter-spacing: -1.5px;
  }

  .next-section p {
    font-size: 13px;
  }
}

/* ================================================================
   VERY SMALL PHONES - 380px
================================================================ */

@media (max-width: 380px) {
  .hero-stage {
    height: 315px;

    flex-basis: 315px;
  }

  .hero-content-inner {
    padding: 42px 18px 30px;
  }

  .hero-title {
    font-size: 37px;

    line-height: 1.05;

    letter-spacing: -2px;
  }

  .hero-description {
    font-size: 12.5px;

    margin: 19px 0 22px;
  }

  .hero-eyebrow {
    font-size: 8px;

    letter-spacing: 2.2px;
  }

  .hero-eyebrow-line {
    width: 22px;
  }

  @media (max-width: 360px) {
    .hero-stage {
      height: 330px;
    }

    .hero-photo {
      height: 330px;
    }

    .hero-photo-overlay {
      height: 330px;
    }

    .tomorrow-label {
      top: 290px !important;
    }

    .tomorrow-label strong {
      font-size: 11px;
    }

    .bank-card {
      top: 96px;

      width: calc(100vw - 28px);

      max-width: 285px;
    }

    .card-shadow {
      top: 245px;

      width: min(230px, 70vw);
    }
  }

  /* --------------------------------------------------------------
     TRUST
  -------------------------------------------------------------- */

  .trust-row {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .trust-item {
    width: 100%;
  }

  .trust-item strong,
  .trust-item span {
    font-size: 8px;
  }

  /* --------------------------------------------------------------
     CARD
  -------------------------------------------------------------- */

  .bank-card {
    top: 125px;

    width: calc(100% - 30px);

    max-width: 270px;

    padding: 15px 17px;
  }

  .card-logo {
    width: 20px;
    height: 20px;

    font-size: 11px;
  }

  .card-brand {
    gap: 7px;
  }

  .card-brand strong {
    font-size: 8px;
  }

  .card-chip {
    width: 31px;
    height: 22px;

    margin-top: 14px;
  }

  .card-number {
    margin-top: 9px;

    font-size: 10px;

    letter-spacing: 0.9px;
  }

  .card-footer {
    margin-top: 8px;
  }

  .card-holder span {
    font-size: 5px;
  }

  .card-holder strong {
    font-size: 7.5px;
  }

  .card-payment-logo {
    transform: scale(0.85);

    transform-origin: right bottom;
  }

  .card-shadow {
    top: 220px;

    width: min(225px, 76%);
  }

  /* --------------------------------------------------------------
     TOMORROW
  -------------------------------------------------------------- */

  .tomorrow-label {
    top: 16px;

    right: 4%;
  }

  .tomorrow-label strong {
    font-size: 11px;
  }

  .tomorrow-label > span {
    font-size: 7px;
  }

  /* --------------------------------------------------------------
     CONTROL PANEL
  -------------------------------------------------------------- */

  .control-panel {
    width: calc(100% - 36px) !important;

    margin: 0 18px 32px !important;

    padding: 15px !important;
  }

  .control-list {
    grid-template-columns: 1fr;

    gap: 9px;
  }

  .control-panel h3 {
    font-size: 10px;
  }

  .control-row {
    min-height: 25px;

    gap: 7px;
  }

  .control-icon {
    width: 23px;
    height: 23px;
  }

  .control-row > span {
    font-size: 7.5px;
  }

  /* --------------------------------------------------------------
     NEXT SECTION
  -------------------------------------------------------------- */

  .next-section h2 {
    font-size: 28px;
  }
}

/* ================================================================
   FINAL MOBILE LAYOUT FIX
   ---------------------------------------------------------------
   Structural fix:
   - No horizontal page movement
   - Card stays inside the viewport
   - Photo/card occupy their own mobile stage
   - Text starts below the visual stage
   - Control panel stays in normal document flow
   - No negative/oversized positioning
================================================================ */

@media (max-width: 800px) {
  html,
  body {
    max-width: 100%;
    overflow-x: hidden;
  }

  .home {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .hero {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: visible;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Keep the photograph as a self-contained visual area. */
  .hero-stage {
    position: relative;
    inset: auto;
    width: 100%;
    max-width: 100%;
    height: 370px;
    flex: 0 0 370px;
    overflow: hidden;
    order: 1;
  }

  .hero-photo {
    inset: 0;
    width: 100%;
    height: 100%;
    transform: scale(1.02);
    background-position: 62% center;
  }

  /*
   * The card is deliberately smaller than the available viewport.
   * This gives the rotation room without allowing its transformed
   * corners to create horizontal overflow.
   */
  .bank-card {
    position: absolute;

    z-index: 50;

    /*
     * Keep the card inside the 370px photo.
     */
    top: 112px;

    left: 50%;

    right: auto;

    width: min(calc(100vw - 42px), 315px);

    height: auto;

    aspect-ratio: 410 / 247;

    transform: translateX(-50%) perspective(1100px) rotateX(5deg) rotateY(-10deg) rotateZ(-4deg);
  }

  .bank-card:hover {
    transform: translateX(-50%) rotateX(3deg) rotateY(-5deg) rotateZ(-2deg) translateY(-3px);
  }

  .card-shadow {
    top: 255px;
    left: 50%;
    width: min(250px, calc(100% - 80px));
    height: 45px;
    transform: translateX(-50%) rotate(-3deg);
  }

  /*
   * Keep the small label inside the photo stage.
   * It cannot push the page wider.
   */
  .tomorrow-label {
    position: absolute;

    z-index: 55;

    /*
     * hero-stage = 370px tall
     * Place label near the top of the photo.
     */
    top: 32px;

    left: 50%;

    right: auto;

    width: max-content;

    transform: translateX(-50%);

    display: flex;

    flex-direction: column;

    align-items: center;

    text-align: center;
  }
  .tomorrow-label > span {
    font-size: 8px;

    line-height: 1;

    color: #7b8d9f;
  }
  .tomorrow-label strong {
    margin-top: 5px;

    font-size: 13px;

    line-height: 1.12;

    color: #082f56;

    text-align: center;
  }

  .tomorrow-line {
    width: 28px;

    height: 1px;

    margin-top: 9px;

    background: #0b4878;
  }
  .tomorrow-label,
  .tomorrow-label .tomorrow-letter,
  .tomorrow-label .tomorrow-copy {
    color: #ffffff !important;
    background: none !important;
    background-image: none !important;
    -webkit-background-clip: initial !important;
    background-clip: initial !important;
    -webkit-text-fill-color: #ffffff !important;
  }
  /*
   * Text is a normal block AFTER the image stage.
   * It can therefore never sit underneath the navbar because of
   * absolute positioning inside the hero.
   */
  .hero-content {
    position: relative;
    inset: auto;
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 0;
    display: block;
    order: 2;
    background: #ffffff;
    z-index: 20;
  }

  .hero-content-inner {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 48px 24px 40px;
  }

  .hero-title {
    width: 100%;
    max-width: 100%;
    font-size: 46px;
    line-height: 1.06;
    letter-spacing: -2.5px;
    overflow-wrap: normal;
    word-break: normal;
  }

  .title-line {
    width: auto;
    max-width: 100%;
    white-space: normal;
  }

  .title-accent {
    max-width: 100%;
  }

  .hero-description {
    width: 100%;
    max-width: 520px;
    margin: 22px 0 26px;
  }

  .hero-buttons {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 9px;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 100%;
  }

  .trust-row {
    width: 100%;
    max-width: 520px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 12px;
    margin-top: 30px;
  }

  .trust-item {
    min-width: 0;
    max-width: 100%;
  }

  /*
   * Control panel remains part of the page flow.
   * It is never allowed to use viewport-relative absolute
   * positioning on mobile.
   */
  .control-panel {
    position: relative !important;
    inset: auto !important;
    width: calc(100% - 48px) !important;
    max-width: 520px;
    margin: 0 auto 40px !important;
    padding: 17px !important;
    box-sizing: border-box;
    order: 3;
    transform: none !important;
    animation: none;
  }

  .control-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .control-row {
    min-width: 0;
  }

  .control-row > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .next-section {
    width: 100%;
    max-width: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .next-section-inner {
    width: calc(100% - 40px);
    max-width: 520px;
    margin: 0 auto;
    box-sizing: border-box;
  }
}

/* ---------------------------------------------------------------
   NARROW PHONES
---------------------------------------------------------------- */

@media (max-width: 600px) {
  .hero-stage {
    height: 350px;
    flex-basis: 350px;
  }

  .bank-card {
    top: 138px;
    width: min(285px, calc(100% - 48px));
    padding: 17px 18px;
  }

  .card-shadow {
    top: 245px;
    width: min(235px, calc(100% - 70px));
  }

  .tomorrow-label {
    top: 20px;
    right: 20px;
  }

  .hero-content-inner {
    padding: 44px 22px 38px;
  }

  .hero-title {
    font-size: 43px;
    letter-spacing: -2.3px;
  }

  .hero-description {
    font-size: 13.5px;
  }

  .control-panel {
    width: calc(100% - 44px) !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
}

/* ---------------------------------------------------------------
   SMALL PHONES
---------------------------------------------------------------- */

@media (max-width: 500px) {
  .hero-stage {
    height: 330px;
    flex-basis: 330px;
  }

  .bank-card {
    top: 128px;
    width: min(270px, calc(100% - 42px));
    padding: 16px 17px;
  }

  .card-shadow {
    top: 228px;
    width: min(220px, calc(100% - 65px));
  }

  .tomorrow-label {
    top: 18px;
    right: 18px;
  }

  .hero-content-inner {
    padding: 42px 20px 34px;
  }

  .hero-title {
    font-size: 40px;
    letter-spacing: -2.1px;
  }

  .hero-description {
    font-size: 13px;
  }

  .trust-row {
    grid-template-columns: 1fr;
    gap: 11px;
  }

  .control-panel {
    width: calc(100% - 40px) !important;
    margin-bottom: 34px !important;
  }

  .control-list {
    grid-template-columns: 1fr;
  }
}

/* ---------------------------------------------------------------
   VERY SMALL PHONES
---------------------------------------------------------------- */

@media (max-width: 380px) {
  .hero-stage {
    height: 315px;
    flex-basis: 315px;
  }

  .bank-card {
    top: 120px;
    width: calc(100% - 34px);
    max-width: 260px;
    padding: 14px 15px;
  }

  .card-shadow {
    top: 214px;
    width: min(205px, calc(100% - 60px));
  }

  .hero-content-inner {
    padding: 38px 18px 30px;
  }

  .hero-title {
    font-size: 36px;
    letter-spacing: -1.8px;
  }

  .hero-description {
    font-size: 12.5px;
  }

  .control-panel {
    width: calc(100% - 36px) !important;
  }
}

/* ================================================================
   REDUCED MOTION
================================================================ */

@media (prefers-reduced-motion: reduce) {
  .hero-photo,
  .hero-title,
  .hero-eyebrow-wrap,
  .hero-description,
  .hero-buttons,
  .trust-row,
  .tomorrow-label,
  .bank-card,
  .control-panel {
    animation: none;
  }

  .hero-title span,
  .title-accent {
    animation: none;
  }
}
</style>

```
