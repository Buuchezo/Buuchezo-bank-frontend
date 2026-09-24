<template>
  <PublicPageLayout
    eyebrow="BUUCHEZO BUSINESS"
    title="Banking that works as hard as your business."
    description="Business banking designed to help you manage everyday finances, understand your cash flow and keep your company moving forward."
  >
    <!-- =====================================================
         HERO ACTIONS
    ====================================================== -->

    <section class="business-actions">
      <RouterLink
        to="/register"
        class="primary-button"
      >
        <span>Open a Business Account</span>
        <ArrowUpRight :size="18" />
      </RouterLink>

      <a
        href="#business-solutions"
        class="secondary-button"
      >
        Explore business banking
        <ArrowDown :size="17" />
      </a>
    </section>


    <!-- =====================================================
         BUSINESS DASHBOARD
    ====================================================== -->

    <section class="business-dashboard-section">

      <div class="section-heading">

        <div>
          <span class="section-eyebrow">
            YOUR BUSINESS. YOUR VIEW.
          </span>

          <h2>
            Everything your business needs,
            <span>in one place.</span>
          </h2>

          <p>
            Get a clear view of your business finances and
            stay on top of the money moving in and out of
            your company.
          </p>
        </div>

      </div>


      <div class="business-dashboard">

        <!-- DASHBOARD HEADER -->

        <div class="dashboard-header">

          <div class="dashboard-brand">

            <div class="dashboard-logo">
              B
            </div>

            <div>
              <strong>
                Buuchezo Business
              </strong>

              <span>
                Business account
              </span>
            </div>

          </div>


          <div class="dashboard-status">
            <span></span>
            Account active
          </div>

        </div>


        <!-- DASHBOARD CONTENT -->

        <div class="dashboard-content">

          <!-- BALANCE -->

          <div class="business-balance-card">

            <div class="balance-card-top">

              <span>
                Available business balance
              </span>

              <button
                type="button"
                class="more-button"
                aria-label="More options"
              >
                •••
              </button>

            </div>

            <strong>
              €84,250<span>.40</span>
            </strong>

            <div class="balance-footer">

              <span>
                Business Current
              </span>

              <span>
                •••• 4821
              </span>

            </div>

          </div>


          <!-- STATS -->

          <div class="business-stats">

            <div class="business-stat">

              <span class="stat-label">
                Revenue this month
              </span>

              <strong>
                €32,840
              </strong>

              <span class="stat-positive">
                +12.8%
              </span>

            </div>


            <div class="business-stat">

              <span class="stat-label">
                Expenses
              </span>

              <strong>
                €18,420
              </strong>

              <span class="stat-neutral">
                This month
              </span>

            </div>


            <div class="business-stat">

              <span class="stat-label">
                Pending payments
              </span>

              <strong>
                €4,250
              </strong>

              <span class="stat-neutral">
                6 payments
              </span>

            </div>

          </div>


          <!-- CHART -->

          <div class="business-chart-card">

            <div class="chart-header">

              <div>
                <span>
                  BUSINESS PERFORMANCE
                </span>

                <strong>
                  Revenue overview
                </strong>
              </div>

              <span class="chart-period">
                Last 6 months
              </span>

            </div>


            <div class="chart">

              <div class="chart-y-axis">
                <span>40k</span>
                <span>30k</span>
                <span>20k</span>
                <span>10k</span>
                <span>0</span>
              </div>


              <div class="chart-area">

                <div class="chart-grid">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <svg
                  viewBox="0 0 700 230"
                  preserveAspectRatio="none"
                  class="chart-svg"
                  aria-label="Business revenue chart"
                >
                  <defs>

                    <linearGradient
                      id="businessChartFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stop-color="#176fc1"
                        stop-opacity="0.20"
                      />

                      <stop
                        offset="100%"
                        stop-color="#176fc1"
                        stop-opacity="0"
                      />
                    </linearGradient>

                  </defs>

                  <path
                    d="M0 185
                       C45 175 65 150 115 158
                       C165 166 185 130 235 136
                       C285 142 310 98 360 108
                       C410 118 430 72 480 84
                       C530 96 560 45 610 57
                       C650 65 675 30 700 35
                       L700 230
                       L0 230 Z"
                    fill="url(#businessChartFill)"
                  />

                  <path
                    d="M0 185
                       C45 175 65 150 115 158
                       C165 166 185 130 235 136
                       C285 142 310 98 360 108
                       C410 118 430 72 480 84
                       C530 96 560 45 610 57
                       C650 65 675 30 700 35"
                    fill="none"
                    stroke="#176fc1"
                    stroke-width="4"
                    stroke-linecap="round"
                  />

                </svg>


                <div class="chart-months">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>

              </div>

            </div>

          </div>


          <!-- RECENT ACTIVITY -->

          <div class="business-activity">

            <div class="activity-header">

              <div>
                <span>
                  RECENT ACTIVITY
                </span>

                <strong>
                  Business transactions
                </strong>
              </div>

              <span class="activity-link">
                View all
              </span>

            </div>


            <div class="activity-list">

              <div class="activity-row">

                <div class="activity-icon incoming">
                  <ArrowDownLeft :size="17" />
                </div>

                <div class="activity-info">
                  <strong>
                    Client payment
                  </strong>

                  <span>
                    Today · Invoice #1048
                  </span>
                </div>

                <strong class="activity-amount positive">
                  +€4,500
                </strong>

              </div>


              <div class="activity-row">

                <div class="activity-icon outgoing">
                  <ArrowUpRight :size="17" />
                </div>

                <div class="activity-info">
                  <strong>
                    Supplier payment
                  </strong>

                  <span>
                    Yesterday · Transfer
                  </span>
                </div>

                <strong class="activity-amount">
                  -€1,280
                </strong>

              </div>


              <div class="activity-row">

                <div class="activity-icon incoming">
                  <ArrowDownLeft :size="17" />
                </div>

                <div class="activity-info">
                  <strong>
                    Invoice received
                  </strong>

                  <span>
                    18 Jun · Client services
                  </span>
                </div>

                <strong class="activity-amount positive">
                  +€2,300
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- =====================================================
         BUSINESS SOLUTIONS
    ====================================================== -->

    <section
      id="business-solutions"
      class="solutions-section"
    >

      <div class="section-heading centered">

        <span class="section-eyebrow">
          BUSINESS BANKING
        </span>

        <h2>
          Tools built around
          <span>your business.</span>
        </h2>

        <p>
          Whether you are getting started or already growing,
          Buuchezo Business gives you the tools to manage
          your everyday finances.
        </p>

      </div>


      <div class="solutions-grid">

        <!-- CURRENT ACCOUNT -->

        <article class="solution-card">

          <div class="solution-number">
            01
          </div>

          <div class="solution-icon">
            <WalletCards :size="24" />
          </div>

          <h3>
            Business accounts
          </h3>

          <p>
            Keep your business finances organised with
            dedicated accounts for everyday operations
            and financial reserves.
          </p>

          <ul>
            <li>
              <Check />
              Everyday business banking
            </li>

            <li>
              <Check />
              Clear transaction history
            </li>

            <li>
              <Check />
              Dedicated business balance
            </li>
          </ul>

        </article>


        <!-- PAYMENTS -->

        <article class="solution-card featured">

          <div class="solution-number">
            02
          </div>

          <div class="solution-icon">
            <ArrowLeftRight :size="24" />
          </div>

          <h3>
            Payments &amp; transfers
          </h3>

          <p>
            Move money between your business,
            customers and suppliers with a clear
            view of every payment.
          </p>

          <ul>
            <li>
              <Check />
              Incoming payments
            </li>

            <li>
              <Check />
              Supplier transfers
            </li>

            <li>
              <Check />
              Payment visibility
            </li>
          </ul>

        </article>


        <!-- CASH FLOW -->

        <article class="solution-card">

          <div class="solution-number">
            03
          </div>

          <div class="solution-icon">
            <ChartNoAxesCombined :size="24" />
          </div>

          <h3>
            Cash-flow visibility
          </h3>

          <p>
            Understand what is coming in, what is going
            out and how your business is performing.
          </p>

          <ul>
            <li>
              <Check />
              Revenue overview
            </li>

            <li>
              <Check />
              Expense tracking
            </li>

            <li>
              <Check />
              Performance insights
            </li>
          </ul>

        </article>


        <!-- SECURITY -->

        <article class="solution-card">

          <div class="solution-number">
            04
          </div>

          <div class="solution-icon">
            <ShieldCheck :size="24" />
          </div>

          <h3>
            Business security
          </h3>

          <p>
            Keep your business banking protected with
            modern authentication and account controls.
          </p>

          <ul>
            <li>
              <Check />
              Secure authentication
            </li>

            <li>
              <Check />
              Account controls
            </li>

            <li>
              <Check />
              Transaction monitoring
            </li>
          </ul>

        </article>

      </div>

    </section>


    <!-- =====================================================
         BUSINESS JOURNEY
    ====================================================== -->

    <section class="journey-section">

      <div class="journey-content">

        <span class="section-eyebrow">
          BUILT TO GROW WITH YOU
        </span>

        <h2>
          From your first
          <span>transaction to your next big move.</span>
        </h2>

        <p>
          Your business changes over time. Your banking
          experience should be able to change with it.
        </p>

        <RouterLink
          to="/contact"
          class="text-button"
        >
          Talk to Buuchezo Bank
          <ArrowUpRight :size="17" />
        </RouterLink>

      </div>


      <div class="journey-steps">

        <div class="journey-line"></div>


        <div class="journey-step">

          <span class="journey-dot">
            01
          </span>

          <div>
            <strong>
              Start
            </strong>

            <p>
              Set up your business banking foundation.
            </p>
          </div>

        </div>


        <div class="journey-step">

          <span class="journey-dot">
            02
          </span>

          <div>
            <strong>
              Operate
            </strong>

            <p>
              Manage payments, expenses and cash flow.
            </p>
          </div>

        </div>


        <div class="journey-step">

          <span class="journey-dot">
            03
          </span>

          <div>
            <strong>
              Grow
            </strong>

            <p>
              Use better visibility to plan your next move.
            </p>
          </div>

        </div>

      </div>

    </section>


    <!-- =====================================================
         CTA
    ====================================================== -->

    <section class="business-cta">

      <div class="cta-glow"></div>

      <div class="cta-content">

        <span class="section-eyebrow light">
          BUUCHEZO BUSINESS
        </span>

        <h2>
          Give your business
          <span>room to grow.</span>
        </h2>

        <p>
          Build your business banking experience around
          clarity, control and what comes next.
        </p>

        <div class="cta-buttons">

          <RouterLink
            to="/register"
            class="cta-primary"
          >
            Open a Business Account
            <ArrowUpRight :size="18" />
          </RouterLink>

          <RouterLink
            to="/contact"
            class="cta-secondary"
          >
            Contact us
          </RouterLink>

        </div>

      </div>

    </section>

  </PublicPageLayout>
</template>


<script setup lang="ts">

import {
  ArrowDown,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Check,
  ShieldCheck,
  WalletCards,
} from 'lucide-vue-next'

import PublicPageLayout from '@/components/PublicPageLayout.vue'

</script>


<style scoped>

/* =========================================================
   ACTIONS
========================================================= */

.business-actions {
  display: flex;

  justify-content: center;

  gap: 14px;

  margin:
    -15px auto 75px;
}


.primary-button,
.secondary-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  min-height: 48px;

  padding: 0 20px;

  border-radius: 9px;

  font-size: 13px;

  font-weight: 750;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}


.primary-button {
  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #176fc1,
      #0c5ca6
    );

  box-shadow:
    0 10px 24px rgba(23, 111, 193, 0.2);
}


.primary-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 14px 30px rgba(23, 111, 193, 0.27);
}


.secondary-button {
  color: #176fc1;

  background: #ffffff;

  border:
    1px solid #dbe8f3;
}


.secondary-button:hover {
  transform: translateY(-2px);

  border-color: #a9cce7;

  background: #f7fbff;
}


/* =========================================================
   COMMON
========================================================= */

.business-dashboard-section,
.solutions-section,
.journey-section {
  max-width: 1180px;

  margin: 0 auto;

  padding:
    85px 24px;
}


.section-heading {
  margin-bottom: 35px;
}


.section-heading.centered {
  max-width: 720px;

  margin:
    0 auto 48px;

  text-align: center;
}


.section-eyebrow {
  display: block;

  margin-bottom: 12px;

  color: #1680c5;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.2em;
}


.section-eyebrow.light {
  color: #8dd7ee;
}


.section-heading h2,
.journey-content h2,
.business-cta h2 {
  margin: 0;

  color: #0d2d4f;

  font-size: clamp(30px, 4vw, 48px);

  line-height: 1.08;

  letter-spacing: -0.045em;
}


.section-heading h2 span,
.journey-content h2 span,
.business-cta h2 span {
  color: #176fc1;
}


.section-heading p,
.journey-content > p {
  max-width: 670px;

  margin:
    17px 0 0;

  color: #718096;

  font-size: 14px;

  line-height: 1.8;
}


/* =========================================================
   BUSINESS DASHBOARD
========================================================= */

.business-dashboard {
  overflow: hidden;

  border:
    1px solid #dbe7f0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 25px 70px rgba(25, 65, 100, 0.12);
}


.dashboard-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding:
    20px 25px;

  border-bottom:
    1px solid #edf2f7;

  background:
    linear-gradient(
      180deg,
      #ffffff,
      #f9fbfd
    );
}


.dashboard-brand {
  display: flex;

  align-items: center;

  gap: 11px;
}


.dashboard-logo {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #ffffff;

  background:
    linear-gradient(
      145deg,
      #176fc1,
      #0b5da7
    );

  border-radius: 10px;

  font-size: 18px;

  font-weight: 900;
}


.dashboard-brand strong {
  display: block;

  color: #193651;

  font-size: 12px;
}


.dashboard-brand span {
  display: block;

  margin-top: 3px;

  color: #8999a9;

  font-size: 9px;
}


.dashboard-status {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #4b6b61;

  font-size: 9px;

  font-weight: 700;
}


.dashboard-status span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #4ac58c;

  box-shadow:
    0 0 0 4px rgba(74, 197, 140, 0.1);
}


.dashboard-content {
  padding: 25px;

  display: grid;

  grid-template-columns:
    1.15fr
    1.85fr;

  gap: 18px;
}


/* =========================================================
   BALANCE
========================================================= */

.business-balance-card {
  min-height: 180px;

  padding: 23px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #082f59,
      #07538c
    );

  border-radius: 15px;

  box-shadow:
    0 14px 30px rgba(6, 47, 89, 0.15);
}


.balance-card-top {
  display: flex;

  justify-content: space-between;

  align-items: center;

  color: rgba(255, 255, 255, 0.6);

  font-size: 10px;
}


.more-button {
  padding: 0;

  color: rgba(255, 255, 255, 0.65);

  background: transparent;

  border: 0;

  cursor: pointer;
}


.business-balance-card > strong {
  display: block;

  margin:
    22px 0;

  font-size: 31px;

  letter-spacing: -0.04em;
}


.business-balance-card > strong span {
  font-size: 18px;

  opacity: 0.7;
}


.balance-footer {
  display: flex;

  justify-content: space-between;

  padding-top: 15px;

  border-top:
    1px solid rgba(255, 255, 255, 0.12);

  color: rgba(255, 255, 255, 0.55);

  font-size: 9px;
}


/* =========================================================
   STATS
========================================================= */

.business-stats {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;
}


.business-stat {
  min-height: 180px;

  padding: 20px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  border:
    1px solid #e4edf4;

  border-radius: 15px;

  background: #fbfdff;
}


.stat-label {
  margin-bottom: 10px;

  color: #8495a6;

  font-size: 9px;

  line-height: 1.5;
}


.business-stat strong {
  color: #193651;

  font-size: 21px;

  letter-spacing: -0.03em;
}


.stat-positive {
  margin-top: 7px;

  color: #31a878;

  font-size: 9px;

  font-weight: 700;
}


.stat-neutral {
  margin-top: 7px;

  color: #9ba9b7;

  font-size: 9px;
}


/* =========================================================
   CHART
========================================================= */

.business-chart-card {
  grid-column: 1 / -1;

  padding: 22px;

  border:
    1px solid #e4edf4;

  border-radius: 15px;

  background: #ffffff;
}


.chart-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 20px;
}


.chart-header > div > span,
.activity-header > div > span {
  display: block;

  margin-bottom: 5px;

  color: #8a9bab;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}


.chart-header strong,
.activity-header strong {
  color: #1b3957;

  font-size: 13px;
}


.chart-period {
  color: #9aa9b7;

  font-size: 9px;
}


.chart {
  display: flex;

  height: 250px;
}


.chart-y-axis {
  width: 42px;

  padding:
    0 8px 29px 0;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  color: #a4b1bd;

  font-size: 8px;

  text-align: right;
}


.chart-area {
  position: relative;

  flex: 1;
}


.chart-grid {
  position: absolute;

  inset: 0 0 30px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
}


.chart-grid span {
  width: 100%;

  border-top:
    1px dashed #e9eff4;
}


.chart-svg {
  position: absolute;

  left: 0;
  top: 0;

  width: 100%;

  height: calc(100% - 30px);
}


.chart-months {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  display: flex;

  justify-content: space-between;

  color: #a4b1bd;

  font-size: 8px;
}


/* =========================================================
   ACTIVITY
========================================================= */

.business-activity {
  grid-column: 1 / -1;

  padding: 22px;

  border:
    1px solid #e4edf4;

  border-radius: 15px;

  background: #fbfdff;
}


.activity-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 15px;
}


.activity-link {
  color: #176fc1;

  font-size: 9px;

  font-weight: 700;
}


.activity-row {
  min-height: 57px;

  display: flex;

  align-items: center;

  gap: 12px;

  border-top:
    1px solid #edf2f6;
}


.activity-icon {
  width: 31px;
  height: 31px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 9px;
}


.activity-icon.incoming {
  color: #2b9f76;

  background: #eaf8f2;
}


.activity-icon.outgoing {
  color: #176fc1;

  background: #eaf3fb;
}


.activity-info {
  flex: 1;
}


.activity-info strong {
  display: block;

  color: #29445d;

  font-size: 10px;
}


.activity-info span {
  display: block;

  margin-top: 3px;

  color: #9aa8b6;

  font-size: 8px;
}


.activity-amount {
  color: #596c7d;

  font-size: 10px;
}


.activity-amount.positive {
  color: #269c70;
}


/* =========================================================
   SOLUTIONS
========================================================= */

.solutions-section {
  max-width: 1280px;

  padding-top: 105px;

  padding-bottom: 105px;
}


.solutions-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 16px;
}


.solution-card {
  position: relative;

  min-height: 330px;

  padding: 26px;

  overflow: hidden;

  border:
    1px solid #dfeaf2;

  border-radius: 17px;

  background: #ffffff;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}


.solution-card:hover {
  transform: translateY(-6px);

  border-color: #9fc8e5;

  box-shadow:
    0 20px 45px rgba(23, 82, 125, 0.1);
}


.solution-card.featured {
  background:
    linear-gradient(
      145deg,
      #f2f9ff,
      #ffffff
    );

  border-color: #b8d8ec;
}


.solution-number {
  position: absolute;

  top: 21px;
  right: 22px;

  color: #c1d1de;

  font-size: 10px;

  font-weight: 800;
}


.solution-icon {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 28px;

  color: #176fc1;

  background: #edf7fd;

  border-radius: 12px;
}


.solution-card h3 {
  margin: 0 0 11px;

  color: #153754;

  font-size: 17px;

  letter-spacing: -0.025em;
}


.solution-card p {
  margin: 0;

  color: #77899a;

  font-size: 11px;

  line-height: 1.7;
}


.solution-card ul {
  padding: 0;

  margin: 23px 0 0;

  list-style: none;
}


.solution-card li {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 9px;

  color: #607487;

  font-size: 9px;
}


.solution-card li svg {
  width: 12px;
  height: 12px;

  color: #31a878;

  stroke-width: 2.5;
}


/* =========================================================
   JOURNEY
========================================================= */

.journey-section {
  display: grid;

  grid-template-columns:
    0.9fr
    1.1fr;

  gap: 80px;

  align-items: center;

  max-width: 1280px;

  padding:
    100px 7%;
}


.text-button {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 25px;

  color: #176fc1;

  font-size: 11px;

  font-weight: 800;

  text-decoration: none;
}


.journey-steps {
  position: relative;

  display: flex;

  flex-direction: column;

  gap: 30px;
}


.journey-line {
  position: absolute;

  top: 22px;
  bottom: 22px;

  left: 21px;

  width: 1px;

  background:
    linear-gradient(
      to bottom,
      #8fc4e5,
      #dce9f2
    );
}


.journey-step {
  position: relative;

  display: flex;

  align-items: center;

  gap: 18px;
}


.journey-dot {
  position: relative;

  z-index: 2;

  width: 43px;
  height: 43px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #176fc1;

  background: #edf7fd;

  border:
    1px solid #c7e0ef;

  border-radius: 50%;

  font-size: 9px;

  font-weight: 800;
}


.journey-step strong {
  display: block;

  color: #173a59;

  font-size: 13px;
}


.journey-step p {
  margin: 5px 0 0;

  color: #8192a2;

  font-size: 10px;
}


/* =========================================================
   CTA
========================================================= */

.business-cta {
  position: relative;

  overflow: hidden;

  margin:
    0 7% 90px;

  padding:
    75px 8%;

  border-radius: 24px;

  color: #ffffff;

  background:
    linear-gradient(
      125deg,
      #062f59 0%,
      #07548d 55%,
      #0b6eac 100%
    );
}


.cta-glow {
  position: absolute;

  width: 450px;
  height: 450px;

  right: -180px;
  top: -230px;

  border-radius: 50%;

  background:
    rgba(87, 213, 235, 0.18);

  filter: blur(30px);
}


.business-cta .cta-content {
  position: relative;

  z-index: 2;

  max-width: 680px;
}


.business-cta h2 {
  color: #ffffff;
}


.business-cta h2 span {
  color: #8dd7ee;
}


.business-cta p {
  max-width: 570px;

  margin:
    17px 0 25px;

  color: rgba(255, 255, 255, 0.64);

  font-size: 13px;

  line-height: 1.75;
}


.cta-buttons {
  display: flex;

  gap: 12px;
}


.cta-primary,
.cta-secondary {
  min-height: 46px;

  padding:
    0 17px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  border-radius: 8px;

  font-size: 10px;

  font-weight: 800;

  text-decoration: none;
}


.cta-primary {
  color: #08345d;

  background: #ffffff;
}


.cta-secondary {
  color: #ffffff;

  border:
    1px solid rgba(255, 255, 255, 0.22);
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {

  .solutions-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }


  .dashboard-content {
    grid-template-columns:
      1fr;
  }


  .business-stats {
    grid-template-columns:
      repeat(3, 1fr);
  }


  .journey-section {
    grid-template-columns:
      1fr;

    gap: 50px;
  }

}


@media (max-width: 700px) {

  .business-actions {
    flex-direction: column;

    align-items: stretch;

    margin-left: 24px;
    margin-right: 24px;
  }


  .primary-button,
  .secondary-button {
    width: 100%;
  }


  .business-dashboard-section,
  .solutions-section,
  .journey-section {
    padding:
      65px 18px;
  }


  .dashboard-content {
    padding: 15px;
  }


  .business-stats {
    grid-template-columns:
      1fr;
  }


  .business-stat {
    min-height: 105px;
  }


  .dashboard-header {
    padding:
      16px;
  }


  .dashboard-status {
    display: none;
  }


  .solutions-grid {
    grid-template-columns:
      1fr;
  }


  .solution-card {
    min-height: auto;
  }


  .business-cta {
    margin:
      0 18px 65px;

    padding:
      55px 25px;
  }


  .cta-buttons {
    flex-direction: column;
  }


  .cta-primary,
  .cta-secondary {
    width: 100%;
  }


  .chart-header {
    align-items: flex-start;

    gap: 10px;
  }


  .chart-period {
    display: none;
  }

}

</style>
