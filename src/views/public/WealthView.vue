<template>
  <PublicPageLayout
    eyebrow="BUUCHEZO WEALTH"
    title="Build wealth with a clearer view of tomorrow."
    description="Explore investments, understand your portfolio and follow the markets from one connected financial experience."
  >
    <!-- =====================================================
         HERO ACTIONS
    ====================================================== -->

    <section class="wealth-actions">
      <RouterLink to="/investments" class="primary-button">
        <span>Explore Investments</span>
        <ArrowUpRight :size="18" />
      </RouterLink>

      <RouterLink to="/market" class="secondary-button">
        <span>View Market Data</span>
        <BarChart3 :size="17" />
      </RouterLink>
    </section>

    <!-- =====================================================
         WEALTH DASHBOARD
    ====================================================== -->

    <section class="wealth-dashboard-section">
      <div class="section-heading">
        <div>
          <span class="section-eyebrow"> YOUR WEALTH. YOUR VIEW. </span>

          <h2>
            See the bigger picture
            <span>of your money.</span>
          </h2>

          <p>
            A portfolio experience designed to give you a clearer view of your investments,
            allocation and long-term progress.
          </p>
        </div>
      </div>

      <div class="wealth-dashboard">
        <!-- HEADER -->

        <div class="wealth-header">
          <div class="wealth-brand">
            <div class="wealth-logo">B</div>

            <div>
              <strong> Buuchezo Wealth </strong>

              <span> Investment portfolio </span>
            </div>
          </div>

          <div class="portfolio-status">
            <span></span>
            Portfolio active
          </div>
        </div>

        <!-- MAIN -->

        <div class="wealth-body">
          <!-- PORTFOLIO VALUE -->

          <div class="portfolio-value">
            <span class="portfolio-label"> Portfolio value </span>

            <strong> €126,840<span>.72</span> </strong>

            <div class="portfolio-performance">
              <span> +€8,420.34 </span>

              <strong> +7.12% </strong>

              <small> this year </small>
            </div>

            <div class="portfolio-mini-chart">
              <svg viewBox="0 0 500 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#61c9e5" stop-opacity="0.24" />

                    <stop offset="100%" stop-color="#61c9e5" stop-opacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 105
                     C40 100 55 85 90 91
                     C125 97 145 73 175 79
                     C205 85 220 62 255 68
                     C290 74 310 52 340 59
                     C370 66 390 39 420 46
                     C450 53 475 27 500 31
                     L500 130
                     L0 130 Z"
                  fill="url(#wealthFill)"
                />

                <path
                  d="M0 105
                     C40 100 55 85 90 91
                     C125 97 145 73 175 79
                     C205 85 220 62 255 68
                     C290 74 310 52 340 59
                     C370 66 390 39 420 46
                     C450 53 475 27 500 31"
                  fill="none"
                  stroke="#62c9e5"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>

          <!-- ALLOCATION -->

          <div class="allocation-card">
            <div class="card-heading">
              <div>
                <span> PORTFOLIO </span>

                <strong> Allocation </strong>
              </div>

              <span> Current </span>
            </div>

            <div class="allocation-visual">
              <div class="allocation-ring">
                <div class="ring-center">
                  <strong>100%</strong>
                  <span>allocated</span>
                </div>
              </div>

              <div class="allocation-legend">
                <div>
                  <span class="legend-dot stocks"></span>

                  <span> Stocks </span>

                  <strong> 48% </strong>
                </div>

                <div>
                  <span class="legend-dot etf"></span>

                  <span> ETFs </span>

                  <strong> 27% </strong>
                </div>

                <div>
                  <span class="legend-dot bonds"></span>

                  <span> Bonds </span>

                  <strong> 15% </strong>
                </div>

                <div>
                  <span class="legend-dot cash"></span>

                  <span> Cash </span>

                  <strong> 10% </strong>
                </div>
              </div>
            </div>
          </div>

          <!-- PERFORMANCE -->

          <div class="performance-card">
            <div class="card-heading">
              <div>
                <span> PERFORMANCE </span>

                <strong> Portfolio growth </strong>
              </div>

              <span> YTD </span>
            </div>

            <div class="performance-chart">
              <div class="performance-y-axis">
                <span>140k</span>
                <span>120k</span>
                <span>100k</span>
              </div>

              <div class="performance-area">
                <div class="performance-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <svg viewBox="0 0 700 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#176fc1" stop-opacity="0.18" />

                      <stop offset="100%" stop-color="#176fc1" stop-opacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0 190
                       C50 185 75 165 120 174
                       C165 183 190 148 235 154
                       C280 160 310 125 355 136
                       C400 147 425 105 470 112
                       C515 119 550 82 590 92
                       C630 102 665 58 700 66
                       L700 220
                       L0 220 Z"
                    fill="url(#performanceFill)"
                  />

                  <path
                    d="M0 190
                       C50 185 75 165 120 174
                       C165 183 190 148 235 154
                       C280 160 310 125 355 136
                       C400 147 425 105 470 112
                       C515 119 550 82 590 92
                       C630 102 665 58 700 66"
                    fill="none"
                    stroke="#176fc1"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </svg>

                <div class="performance-months">
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

          <!-- HOLDINGS -->

          <div class="holdings-card">
            <div class="card-heading">
              <div>
                <span> PORTFOLIO </span>

                <strong> Your holdings </strong>
              </div>

              <RouterLink to="/investments"> View portfolio </RouterLink>
            </div>

            <div class="holding-list">
              <div class="holding-row">
                <div class="holding-icon blue">
                  <TrendingUp :size="16" />
                </div>

                <div class="holding-name">
                  <strong> Global Equity ETF </strong>

                  <span> Equity </span>
                </div>

                <div class="holding-value">
                  <strong> €42,840 </strong>

                  <span class="positive"> +8.4% </span>
                </div>
              </div>

              <div class="holding-row">
                <div class="holding-icon purple">
                  <Activity :size="16" />
                </div>

                <div class="holding-name">
                  <strong> Technology Fund </strong>

                  <span> Equity </span>
                </div>

                <div class="holding-value">
                  <strong> €18,420 </strong>

                  <span class="positive"> +11.2% </span>
                </div>
              </div>

              <div class="holding-row">
                <div class="holding-icon green">
                  <Landmark :size="16" />
                </div>

                <div class="holding-name">
                  <strong> European Bonds </strong>

                  <span> Fixed income </span>
                </div>

                <div class="holding-value">
                  <strong> €12,640 </strong>

                  <span class="positive"> +3.1% </span>
                </div>
              </div>

              <div class="holding-row">
                <div class="holding-icon orange">
                  <WalletCards :size="16" />
                </div>

                <div class="holding-name">
                  <strong> Cash </strong>

                  <span> Available </span>
                </div>

                <div class="holding-value">
                  <strong> €8,240 </strong>

                  <span> 10.0% </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         WEALTH SOLUTIONS
    ====================================================== -->

    <section class="wealth-solutions">
      <div class="section-heading centered">
        <span class="section-eyebrow"> WEALTH MANAGEMENT </span>

        <h2>
          Understand your money.
          <span>Plan what comes next.</span>
        </h2>

        <p>
          Buuchezo Wealth brings portfolio visibility, investment information and market context
          into one connected experience.
        </p>
      </div>

      <div class="wealth-feature-grid">
        <article class="wealth-feature">
          <div class="wealth-feature-icon">
            <TrendingUp :size="23" />
          </div>

          <span> 01 </span>

          <h3>Portfolio visibility</h3>

          <p>
            See how your investments are distributed and follow the value of your portfolio over
            time.
          </p>

          <RouterLink to="/investments">
            Explore investments
            <ArrowUpRight :size="15" />
          </RouterLink>
        </article>

        <article class="wealth-feature">
          <div class="wealth-feature-icon">
            <BarChart3 :size="23" />
          </div>

          <span> 02 </span>

          <h3>Market information</h3>

          <p>
            Follow market data and keep an eye on the instruments and indicators that matter to you.
          </p>

          <RouterLink to="/market">
            View market data
            <ArrowUpRight :size="15" />
          </RouterLink>
        </article>

        <article class="wealth-feature">
          <div class="wealth-feature-icon">
            <Target :size="23" />
          </div>

          <span> 03 </span>

          <h3>Financial goals</h3>

          <p>
            Think beyond today's balance and organise your finances around the goals you want to
            reach.
          </p>

          <RouterLink to="/register">
            Get started
            <ArrowUpRight :size="15" />
          </RouterLink>
        </article>

        <article class="wealth-feature">
          <div class="wealth-feature-icon">
            <ShieldCheck :size="23" />
          </div>

          <span> 04 </span>

          <h3>Connected security</h3>

          <p>
            Keep your financial experience connected to the authentication and security controls of
            Buuchezo Bank.
          </p>

          <RouterLink to="/security">
            Explore security
            <ArrowUpRight :size="15" />
          </RouterLink>
        </article>
      </div>
    </section>

    <!-- =====================================================
         MARKET SNAPSHOT
    ====================================================== -->

    <section class="market-section">
      <div class="market-copy">
        <span class="section-eyebrow"> MARKET DATA </span>

        <h2>
          Keep an eye on
          <span>the market.</span>
        </h2>

        <p>
          A wealth experience should connect your portfolio with the broader financial environment.
          Follow market information from the same banking platform.
        </p>

        <RouterLink to="/market" class="market-button">
          Explore Market Data
          <ArrowUpRight :size="17" />
        </RouterLink>
      </div>

      <div class="market-board">
        <div class="market-board-header">
          <div>
            <span> MARKET OVERVIEW </span>

            <strong> Selected indicators </strong>
          </div>

          <span class="market-demo-label"> Demo data </span>
        </div>

        <div class="market-row">
          <div class="market-name">
            <strong> DAX </strong>

            <span> Germany </span>
          </div>

          <strong> 23,842.10 </strong>

          <span class="market-positive"> +0.82% </span>
        </div>

        <div class="market-row">
          <div class="market-name">
            <strong> S&amp;P 500 </strong>

            <span> United States </span>
          </div>

          <strong> 6,742.18 </strong>

          <span class="market-positive"> +0.46% </span>
        </div>

        <div class="market-row">
          <div class="market-name">
            <strong> NASDAQ </strong>

            <span> United States </span>
          </div>

          <strong> 22,410.32 </strong>

          <span class="market-positive"> +0.71% </span>
        </div>

        <div class="market-row">
          <div class="market-name">
            <strong> EUR/USD </strong>

            <span> Currency </span>
          </div>

          <strong> 1.18 </strong>

          <span class="market-positive"> +0.12% </span>
        </div>
      </div>
    </section>

    <!-- =====================================================
         GOALS
    ====================================================== -->

    <section class="goals-section">
      <div class="goals-heading">
        <span class="section-eyebrow"> THINK LONG TERM </span>

        <h2>
          Your wealth journey
          <span>starts with a goal.</span>
        </h2>
      </div>

      <div class="goals-grid">
        <article class="goal-card">
          <div class="goal-icon">
            <Compass :size="21" />
          </div>

          <h3>Build for the future</h3>

          <p>Create a long-term financial direction around the things that matter to you.</p>
        </article>

        <article class="goal-card">
          <div class="goal-icon">
            <Landmark :size="21" />
          </div>

          <h3>Plan for tomorrow</h3>

          <p>Keep your financial goals visible as your circumstances change over time.</p>
        </article>

        <article class="goal-card">
          <div class="goal-icon">
            <Layers3 :size="21" />
          </div>

          <h3>Diversify your view</h3>

          <p>Understand how different asset categories contribute to your overall portfolio.</p>
        </article>
      </div>
    </section>

    <!-- =====================================================
         CTA
    ====================================================== -->

    <section class="wealth-cta">
      <div class="wealth-cta-glow"></div>

      <div class="wealth-cta-content">
        <span class="section-eyebrow light"> BUUCHEZO WEALTH </span>

        <h2>
          Your money today.
          <span>Your possibilities tomorrow.</span>
        </h2>

        <p>
          Explore the Buuchezo Bank wealth experience and get a clearer view of your financial
          future.
        </p>

        <div class="wealth-cta-buttons">
          <RouterLink to="/investments" class="cta-primary">
            Explore Investments
            <ArrowUpRight :size="18" />
          </RouterLink>

          <RouterLink to="/register" class="cta-secondary"> Open an Account </RouterLink>
        </div>
      </div>
    </section>
  </PublicPageLayout>
</template>

<script setup lang="ts">
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Compass,
  Landmark,
  Layers3,
  ShieldCheck,
  Target,
  TrendingUp,
  WalletCards,
} from 'lucide-vue-next'

import PublicPageLayout from '@/components/PublicPageLayout.vue'
</script>

<style scoped>
/* =========================================================
   ACTIONS
========================================================= */

.wealth-actions {
  display: flex;

  justify-content: center;

  gap: 14px;

  margin: -15px auto 75px;
}

.primary-button,
.secondary-button {
  min-height: 48px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  padding: 0 20px;

  border-radius: 9px;

  font-size: 13px;

  font-weight: 750;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.primary-button {
  color: #ffffff;

  background: linear-gradient(135deg, #176fc1, #0c5ca6);

  box-shadow: 0 10px 24px rgba(23, 111, 193, 0.2);
}

.primary-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 14px 30px rgba(23, 111, 193, 0.27);
}

.secondary-button {
  color: #176fc1;

  background: #ffffff;

  border: 1px solid #dbe8f3;
}

.secondary-button:hover {
  transform: translateY(-2px);

  background: #f7fbff;

  border-color: #a9cce7;
}

/* =========================================================
   COMMON
========================================================= */

.wealth-dashboard-section,
.wealth-solutions,
.market-section,
.goals-section {
  max-width: 1180px;

  margin: 0 auto;

  padding: 85px 24px;
}

.section-heading {
  margin-bottom: 35px;
}

.section-heading.centered {
  max-width: 720px;

  margin: 0 auto 48px;

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
.goals-heading h2,
.market-copy h2,
.wealth-cta h2 {
  margin: 0;

  color: #0d2d4f;

  font-size: clamp(30px, 4vw, 48px);

  line-height: 1.08;

  letter-spacing: -0.045em;
}

.section-heading h2 span,
.goals-heading h2 span,
.market-copy h2 span {
  color: #176fc1;
}

.section-heading p,
.market-copy p {
  max-width: 670px;

  margin: 17px 0 0;

  color: #718096;

  font-size: 14px;

  line-height: 1.8;
}

/* =========================================================
   DASHBOARD
========================================================= */

.wealth-dashboard {
  overflow: hidden;

  border: 1px solid #dbe7f0;

  border-radius: 22px;

  background: #ffffff;

  box-shadow: 0 25px 70px rgba(25, 65, 100, 0.12);
}

.wealth-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 20px 25px;

  border-bottom: 1px solid #edf2f7;
}

.wealth-brand {
  display: flex;

  align-items: center;

  gap: 11px;
}

.wealth-logo {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #ffffff;

  background: linear-gradient(145deg, #176fc1, #0b5da7);

  border-radius: 10px;

  font-size: 18px;

  font-weight: 900;
}

.wealth-brand strong {
  display: block;

  color: #193651;

  font-size: 12px;
}

.wealth-brand span {
  display: block;

  margin-top: 3px;

  color: #8999a9;

  font-size: 9px;
}

.portfolio-status {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #4b6b61;

  font-size: 9px;

  font-weight: 700;
}

.portfolio-status span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #4ac58c;

  box-shadow: 0 0 0 4px rgba(74, 197, 140, 0.1);
}

.wealth-body {
  padding: 25px;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 18px;
}

/* =========================================================
   PORTFOLIO VALUE
========================================================= */

.portfolio-value {
  position: relative;

  min-height: 310px;

  overflow: hidden;

  padding: 25px;

  color: #ffffff;

  background: linear-gradient(145deg, #062f59, #075a93);

  border-radius: 16px;
}

.portfolio-label {
  display: block;

  color: rgba(255, 255, 255, 0.56);

  font-size: 10px;
}

.portfolio-value > strong {
  display: block;

  margin: 17px 0 12px;

  font-size: 35px;

  letter-spacing: -0.045em;
}

.portfolio-value > strong span {
  font-size: 20px;

  opacity: 0.7;
}

.portfolio-performance {
  display: flex;

  align-items: center;

  gap: 8px;

  color: #70d7b0;

  font-size: 11px;

  font-weight: 700;
}

.portfolio-performance small {
  color: rgba(255, 255, 255, 0.4);

  font-size: 9px;

  font-weight: 500;
}

.portfolio-mini-chart {
  position: absolute;

  left: 20px;
  right: 20px;
  bottom: 20px;

  height: 110px;
}

.portfolio-mini-chart svg {
  width: 100%;
  height: 100%;
}

/* =========================================================
   ALLOCATION
========================================================= */

.allocation-card,
.performance-card,
.holdings-card {
  padding: 22px;

  border: 1px solid #e4edf4;

  border-radius: 16px;

  background: #ffffff;
}

.card-heading {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;
}

.card-heading > div > span {
  display: block;

  margin-bottom: 5px;

  color: #8a9bab;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.card-heading strong {
  color: #1b3957;

  font-size: 13px;
}

.card-heading > span {
  color: #9aa9b7;

  font-size: 9px;
}

.allocation-visual {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  min-height: 235px;
}

.allocation-ring {
  width: 160px;
  height: 160px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: conic-gradient(#176fc1 0 48%, #62c9e5 48% 75%, #70a0c7 75% 90%, #dce8ef 90% 100%);
}

.allocation-ring::before {
  content: '';

  position: absolute;
}

.ring-center {
  width: 102px;
  height: 102px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  background: #ffffff;

  border-radius: 50%;
}

.ring-center strong {
  color: #183b59;

  font-size: 20px;
}

.ring-center span {
  margin-top: 3px;

  color: #98a7b5;

  font-size: 8px;
}

.allocation-legend {
  flex: 1;
}

.allocation-legend > div {
  display: grid;

  grid-template-columns: 9px 1fr auto;

  align-items: center;

  gap: 7px;

  margin-bottom: 13px;

  color: #6e8192;

  font-size: 9px;
}

.legend-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;
}

.legend-dot.stocks {
  background: #176fc1;
}

.legend-dot.etf {
  background: #62c9e5;
}

.legend-dot.bonds {
  background: #70a0c7;
}

.legend-dot.cash {
  background: #dce8ef;
}

.allocation-legend strong {
  color: #29445d;

  font-size: 9px;
}

/* =========================================================
   PERFORMANCE
========================================================= */

.performance-card {
  grid-column: 1 / -1;
}

.performance-chart {
  height: 240px;

  display: flex;
}

.performance-y-axis {
  width: 42px;

  padding: 0 8px 25px 0;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  color: #a4b1bd;

  font-size: 8px;

  text-align: right;
}

.performance-area {
  position: relative;

  flex: 1;
}

.performance-lines {
  position: absolute;

  inset: 0 0 25px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
}

.performance-lines span {
  border-top: 1px dashed #e9eff4;
}

.performance-area svg {
  position: absolute;

  width: 100%;

  height: calc(100% - 25px);

  left: 0;
  top: 0;
}

.performance-months {
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
   HOLDINGS
========================================================= */

.holdings-card {
  grid-column: 1 / -1;
}

.card-heading a {
  color: #176fc1;

  font-size: 9px;

  font-weight: 750;

  text-decoration: none;
}

.holding-row {
  min-height: 62px;

  display: flex;

  align-items: center;

  gap: 11px;

  border-top: 1px solid #edf2f6;
}

.holding-icon {
  width: 33px;
  height: 33px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 9px;
}

.holding-icon.blue {
  color: #176fc1;

  background: #eaf4fc;
}

.holding-icon.purple {
  color: #7857c8;

  background: #f1edfb;
}

.holding-icon.green {
  color: #2d9b72;

  background: #eaf8f2;
}

.holding-icon.orange {
  color: #d18438;

  background: #fff4e8;
}

.holding-name {
  flex: 1;
}

.holding-name strong {
  display: block;

  color: #29445d;

  font-size: 10px;
}

.holding-name span {
  display: block;

  margin-top: 3px;

  color: #9aa8b6;

  font-size: 8px;
}

.holding-value {
  text-align: right;
}

.holding-value strong {
  display: block;

  color: #29445d;

  font-size: 10px;
}

.holding-value span {
  display: block;

  margin-top: 3px;

  color: #9aa8b6;

  font-size: 8px;
}

.holding-value span.positive {
  color: #2b9f76;
}

/* =========================================================
   WEALTH FEATURES
========================================================= */

.wealth-feature-grid {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 16px;
}

.wealth-feature {
  position: relative;

  min-height: 290px;

  padding: 25px;

  border: 1px solid #dfeaf2;

  border-radius: 17px;

  background: #ffffff;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.wealth-feature:hover {
  transform: translateY(-6px);

  border-color: #a7cde7;

  box-shadow: 0 20px 45px rgba(23, 82, 125, 0.1);
}

.wealth-feature > span {
  position: absolute;

  top: 25px;
  right: 22px;

  color: #c1d1de;

  font-size: 10px;

  font-weight: 800;
}

.wealth-feature-icon {
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

.wealth-feature h3 {
  margin: 0 0 11px;

  color: #153754;

  font-size: 17px;

  letter-spacing: -0.025em;
}

.wealth-feature p {
  margin: 0;

  color: #77899a;

  font-size: 11px;

  line-height: 1.7;
}

.wealth-feature a {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-top: 23px;

  color: #176fc1;

  font-size: 9px;

  font-weight: 800;

  text-decoration: none;
}

/* =========================================================
   MARKET
========================================================= */

.market-section {
  display: grid;

  grid-template-columns:
    0.8fr
    1.2fr;

  gap: 75px;

  align-items: center;

  max-width: 1280px;

  padding: 100px 7%;
}

.market-copy p {
  max-width: 500px;
}

.market-button {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 24px;

  color: #176fc1;

  font-size: 11px;

  font-weight: 800;

  text-decoration: none;
}

.market-board {
  padding: 24px;

  border: 1px solid #dce8f1;

  border-radius: 18px;

  background: linear-gradient(145deg, #f8fbfd, #ffffff);

  box-shadow: 0 20px 55px rgba(30, 75, 110, 0.08);
}

.market-board-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 12px;
}

.market-board-header > div span {
  display: block;

  margin-bottom: 5px;

  color: #8a9bab;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.market-board-header strong {
  color: #1b3957;

  font-size: 13px;
}

.market-demo-label {
  padding: 5px 8px;

  color: #176fc1;

  background: #eaf4fc;

  border-radius: 5px;

  font-size: 8px;

  font-weight: 750;
}

.market-row {
  min-height: 68px;

  display: grid;

  grid-template-columns: 1fr auto auto;

  align-items: center;

  gap: 20px;

  border-top: 1px solid #eaf0f5;
}

.market-name strong {
  display: block;

  color: #29445d;

  font-size: 10px;
}

.market-name span {
  display: block;

  margin-top: 3px;

  color: #9aa8b6;

  font-size: 8px;
}

.market-row > strong {
  color: #29445d;

  font-size: 10px;
}

.market-positive {
  min-width: 50px;

  color: #269c70;

  font-size: 9px;

  font-weight: 750;

  text-align: right;
}

/* =========================================================
   GOALS
========================================================= */

.goals-heading {
  margin-bottom: 40px;
}

.goals-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 17px;
}

.goal-card {
  padding: 26px;

  border: 1px solid #dfeaf2;

  border-radius: 17px;

  background: #ffffff;
}

.goal-icon {
  width: 44px;
  height: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 22px;

  color: #176fc1;

  background: #edf7fd;

  border-radius: 11px;
}

.goal-card h3 {
  margin: 0 0 9px;

  color: #153754;

  font-size: 15px;
}

.goal-card p {
  margin: 0;

  color: #77899a;

  font-size: 10px;

  line-height: 1.7;
}

/* =========================================================
   CTA
========================================================= */

.wealth-cta {
  position: relative;

  overflow: hidden;

  margin: 0 7% 90px;

  padding: 75px 8%;

  border-radius: 24px;

  background: linear-gradient(125deg, #062f59, #07548d, #0b6eac);
}

.wealth-cta-glow {
  position: absolute;

  width: 500px;
  height: 500px;

  right: -200px;
  top: -260px;

  border-radius: 50%;

  background: rgba(89, 213, 237, 0.18);

  filter: blur(35px);
}

.wealth-cta-content {
  position: relative;

  z-index: 2;

  max-width: 700px;
}

.wealth-cta h2 {
  color: #ffffff;
}

.wealth-cta h2 span {
  color: #8dd7ee;
}

.wealth-cta p {
  max-width: 580px;

  margin: 17px 0 25px;

  color: rgba(255, 255, 255, 0.64);

  font-size: 13px;

  line-height: 1.75;
}

.wealth-cta-buttons {
  display: flex;

  gap: 12px;
}

.cta-primary,
.cta-secondary {
  min-height: 46px;

  padding: 0 17px;

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

  border: 1px solid rgba(255, 255, 255, 0.22);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {
  .wealth-feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .wealth-body {
    grid-template-columns: 1fr;
  }

  .portfolio-value {
    min-height: 280px;
  }

  .market-section {
    grid-template-columns: 1fr;

    gap: 45px;
  }
}

@media (max-width: 700px) {
  .wealth-actions {
    flex-direction: column;

    align-items: stretch;

    margin-left: 24px;
    margin-right: 24px;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .wealth-dashboard-section,
  .wealth-solutions,
  .market-section,
  .goals-section {
    padding: 65px 18px;
  }

  .wealth-body {
    padding: 15px;
  }

  .wealth-header {
    padding: 16px;
  }

  .portfolio-status {
    display: none;
  }

  .allocation-visual {
    flex-direction: column;

    justify-content: center;
  }

  .wealth-feature-grid,
  .goals-grid {
    grid-template-columns: 1fr;
  }

  .wealth-feature {
    min-height: auto;
  }

  .market-row {
    grid-template-columns: 1fr auto;
  }

  .market-row > strong {
    grid-column: 2;
    grid-row: 1;
  }

  .market-positive {
    grid-column: 2;
    grid-row: 2;
  }

  .wealth-cta {
    margin: 0 18px 65px;

    padding: 55px 25px;
  }

  .wealth-cta-buttons {
    flex-direction: column;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
  }
}
</style>
