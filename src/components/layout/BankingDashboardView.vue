<template>
  <section class="banking-dashboard">
    <div class="dashboard-inner">
      <!-- =====================================================
           LEFT SIDE — INTRO
      ====================================================== -->

      <div class="dashboard-intro">
        <div class="section-label">YOUR MONEY. YOUR VIEW.</div>

        <h2>
          Everything you need,
          <span>in one place.</span>
        </h2>

        <p>
          See your money clearly, move it when you need to and keep track of every transaction from
          one simple banking experience.
        </p>

        <div class="dashboard-points">
          <div class="dashboard-point">
            <div class="point-check">✓</div>

            <div>
              <strong>Clear overview</strong>
              <span>See your balance and activity at a glance.</span>
            </div>
          </div>

          <div class="dashboard-point">
            <div class="point-check">✓</div>

            <div>
              <strong>Easy transfers</strong>
              <span>Move money quickly when you need to.</span>
            </div>
          </div>

          <div class="dashboard-point">
            <div class="point-check">✓</div>

            <div>
              <strong>Stay informed</strong>
              <span>Keep up with your latest account activity.</span>
            </div>
          </div>
        </div>

        <RouterLink to="/register" class="dashboard-button">
          <span>Open an Account</span>

          <span class="dashboard-button-arrow">
            <ArrowUpRight :size="17" />
          </span>
        </RouterLink>
      </div>

      <!-- =====================================================
           RIGHT SIDE — BANKING DASHBOARD
      ====================================================== -->

      <div class="dashboard-visual">
        <div class="dashboard-window">
          <!-- WINDOW HEADER -->

          <div class="window-header">
            <div class="window-brand">
              <div class="mini-logo">B</div>

              <div>
                <strong>Buuchezo Bank</strong>
                <span>Personal Banking</span>
              </div>
            </div>

            <div class="window-profile">
              <div class="profile-circle">JD</div>
            </div>
          </div>

          <!-- DASHBOARD BODY -->

          <div class="window-body">
            <!-- BALANCE -->

            <div class="balance-card">
              <div class="balance-top">
                <span>Available balance</span>

                <button type="button" class="balance-menu">•••</button>
              </div>

              <div class="balance-amount">€12,840<span>.65</span></div>

              <div class="balance-account">
                <span>Personal Account</span>

                <span>•••• 3456</span>
              </div>
            </div>

            <!-- QUICK ACTIONS -->

            <div class="quick-actions">
              <button type="button" class="quick-action">
                <span class="quick-icon">
                  <ArrowUpRight :size="16" />
                </span>

                <span>Send</span>
              </button>

              <button type="button" class="quick-action">
                <span class="quick-icon">
                  <ArrowDownLeft :size="16" />
                </span>

                <span>Receive</span>
              </button>

              <button type="button" class="quick-action">
                <span class="quick-icon">
                  <CreditCard :size="16" />
                </span>

                <span>Cards</span>
              </button>

              <button type="button" class="quick-action">
                <span class="quick-icon">
                  <MoreHorizontal :size="16" />
                </span>

                <span>More</span>
              </button>
            </div>

            <!-- LOWER DASHBOARD -->

            <div class="dashboard-columns">
              <!-- TRANSACTIONS -->

              <div class="transactions-panel">
                <div class="panel-header">
                  <div>
                    <span>ACTIVITY</span>
                    <h3>Recent transactions</h3>
                  </div>

                  <button type="button">View all</button>
                </div>

                <div class="transactions-list">
                  <div class="transaction">
                    <div class="transaction-icon">
                      <ShoppingBag :size="15" />
                    </div>

                    <div class="transaction-info">
                      <strong>Groceries</strong>
                      <span>Today · Card payment</span>
                    </div>

                    <strong class="transaction-amount negative"> −€84.20 </strong>
                  </div>

                  <div class="transaction">
                    <div class="transaction-icon">
                      <ArrowDownLeft :size="15" />
                    </div>

                    <div class="transaction-info">
                      <strong>Salary</strong>
                      <span>Yesterday · Incoming</span>
                    </div>

                    <strong class="transaction-amount positive"> +€3,240.00 </strong>
                  </div>

                  <div class="transaction">
                    <div class="transaction-icon">
                      <Coffee :size="15" />
                    </div>

                    <div class="transaction-info">
                      <strong>Coffee House</strong>
                      <span>Yesterday · Card payment</span>
                    </div>

                    <strong class="transaction-amount negative"> −€5.80 </strong>
                  </div>

                  <div class="transaction">
                    <div class="transaction-icon">
                      <ArrowUpRight :size="15" />
                    </div>

                    <div class="transaction-info">
                      <strong>Alex Morgan</strong>
                      <span>18 Sep · Transfer</span>
                    </div>

                    <strong class="transaction-amount negative"> −€120.00 </strong>
                  </div>
                </div>
              </div>

              <!-- SPENDING -->

              <div class="spending-panel">
                <div class="panel-header">
                  <div>
                    <span>OVERVIEW</span>
                    <h3>Spending</h3>
                  </div>

                  <span class="period"> This month </span>
                </div>

                <div class="spending-total">€1,284</div>

                <div class="spending-change">
                  <TrendingDown :size="13" />
                  <span>8.4% from last month</span>
                </div>

                <div class="spending-chart">
                  <div class="chart-bars">
                    <span style="height: 42%"></span>
                    <span style="height: 65%"></span>
                    <span style="height: 50%"></span>
                    <span style="height: 76%"></span>
                    <span style="height: 61%"></span>
                    <span style="height: 88%"></span>
                    <span style="height: 70%"></span>
                  </div>

                  <div class="chart-labels">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FLOATING NOTIFICATION -->

        <div class="dashboard-notification">
          <div class="notification-icon">
            <Check :size="16" />
          </div>

          <div>
            <strong>Transfer completed</strong>
            <span>€250.00 sent successfully</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Coffee,
  CreditCard,
  MoreHorizontal,
  ShoppingBag,
  TrendingDown,
} from 'lucide-vue-next'
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.banking-dashboard {
  width: 100%;
  background: #f6f9fc;
  padding: 120px 6% 130px;
  overflow: hidden;
}

.dashboard-inner {
  width: 100%;
  max-width: 1380px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 0.78fr 1.22fr;
  gap: 75px;
  align-items: center;
}

/* =========================================================
   INTRO
========================================================= */

.dashboard-intro {
  max-width: 500px;
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

.dashboard-intro h2 {
  margin: 0;

  color: #082f56;

  font-size: clamp(42px, 4vw, 62px);
  line-height: 1.04;
  letter-spacing: -0.045em;
}

.dashboard-intro h2 span {
  display: block;
  color: #0b5da7;
}

.dashboard-intro > p {
  max-width: 470px;

  margin: 27px 0 34px;

  color: #687b8d;

  font-size: 16px;
  line-height: 1.75;
}

/* =========================================================
   POINTS
========================================================= */

.dashboard-points {
  display: flex;
  flex-direction: column;
  gap: 18px;

  margin-bottom: 36px;
}

.dashboard-point {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.point-check {
  width: 25px;
  height: 25px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #e8f3fa;

  border-radius: 50%;

  font-size: 12px;
  font-weight: 800;
}

.dashboard-point strong {
  display: block;

  margin-bottom: 3px;

  color: #082f56;

  font-size: 14px;
}

.dashboard-point span {
  display: block;

  color: #81909d;

  font-size: 13px;
}

/* =========================================================
   BUTTON
========================================================= */

.dashboard-button {
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

.dashboard-button:hover {
  background: #082f56;
  transform: translateY(-2px);
}

.dashboard-button-arrow {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.15);

  border-radius: 5px;
}

/* =========================================================
   DASHBOARD VISUAL
========================================================= */

.dashboard-visual {
  position: relative;

  min-width: 0;

  padding: 20px;
}

.dashboard-window {
  position: relative;

  width: 100%;

  background: white;

  border: 1px solid #dce6ee;

  border-radius: 18px;

  box-shadow:
    0 30px 80px rgba(8, 47, 86, 0.12),
    0 5px 20px rgba(8, 47, 86, 0.05);

  overflow: hidden;
}

/* =========================================================
   WINDOW HEADER
========================================================= */

.window-header {
  height: 70px;

  padding: 0 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #edf2f6;
}

.window-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-logo {
  width: 31px;
  height: 31px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background: #0b4878;

  border-radius: 7px;

  font-size: 15px;
  font-weight: 800;
}

.window-brand strong {
  display: block;

  color: #082f56;

  font-size: 12px;
}

.window-brand span {
  display: block;

  margin-top: 2px;

  color: #95a3af;

  font-size: 9px;
}

.profile-circle {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;
  background: #eaf4fa;

  border-radius: 50%;

  font-size: 10px;
  font-weight: 800;
}

/* =========================================================
   WINDOW BODY
========================================================= */

.window-body {
  padding: 25px;
  background: #f8fafc;
}

/* =========================================================
   BALANCE
========================================================= */

.balance-card {
  padding: 24px;

  color: white;

  background: linear-gradient(135deg, #063d74 0%, #07559b 58%, #143fbd 100%);

  border-radius: 13px;

  box-shadow: 0 15px 30px rgba(8, 47, 86, 0.15);
}

.balance-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: rgba(255, 255, 255, 0.7);

  font-size: 11px;
}

.balance-menu {
  padding: 0;

  color: rgba(255, 255, 255, 0.75);

  background: none;
  border: 0;

  font-size: 12px;

  cursor: pointer;
}

.balance-amount {
  margin: 12px 0 18px;

  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.04em;
  font-weight: 700;
}

.balance-amount span {
  font-size: 19px;
  opacity: 0.7;
}

.balance-account {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 14px;

  border-top: 1px solid rgba(255, 255, 255, 0.16);

  color: rgba(255, 255, 255, 0.72);

  font-size: 10px;
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 10px;

  margin: 16px 0;
}

.quick-action {
  min-width: 0;

  padding: 12px 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;

  color: #53697b;
  background: white;

  border: 1px solid #e3ebf1;
  border-radius: 9px;

  font-family: inherit;
  font-size: 10px;
  font-weight: 600;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.quick-action:hover {
  border-color: #bfd2e0;
  transform: translateY(-2px);
}

.quick-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;
  background: #edf6fb;

  border-radius: 7px;
}

/* =========================================================
   LOWER COLUMNS
========================================================= */

.dashboard-columns {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;

  gap: 12px;
}

/* =========================================================
   PANELS
========================================================= */

.transactions-panel,
.spending-panel {
  min-width: 0;

  padding: 20px;

  background: white;

  border: 1px solid #e3ebf1;
  border-radius: 11px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 18px;
}

.panel-header span:first-child {
  display: block;

  margin-bottom: 4px;

  color: #98a7b3;

  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.panel-header h3 {
  margin: 0;

  color: #082f56;

  font-size: 13px;
}

.panel-header button {
  padding: 0;

  color: #0b5da7;

  background: none;
  border: 0;

  font-family: inherit;
  font-size: 9px;
  font-weight: 700;

  cursor: pointer;
}

.period {
  padding: 5px 7px;

  color: #778896 !important;

  background: #f3f7fa;

  border-radius: 5px;

  font-size: 8px !important;
  letter-spacing: 0 !important;
}

/* =========================================================
   TRANSACTIONS
========================================================= */

.transactions-list {
  display: flex;
  flex-direction: column;
}

.transaction {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 9px;

  padding: 10px 0;

  border-bottom: 1px solid #f0f3f6;
}

.transaction:last-child {
  border-bottom: 0;
}

.transaction-icon {
  width: 30px;
  height: 30px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #0b4878;
  background: #edf6fb;

  border-radius: 7px;
}

.transaction-info {
  min-width: 0;
  flex: 1;
}

.transaction-info strong {
  display: block;

  overflow: hidden;

  color: #354e61;

  font-size: 10px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-info span {
  display: block;

  margin-top: 2px;

  color: #9aa7b1;

  font-size: 8px;
}

.transaction-amount {
  flex-shrink: 0;

  font-size: 9px;
}

.transaction-amount.negative {
  color: #465c6d;
}

.transaction-amount.positive {
  color: #21845c;
}

/* =========================================================
   SPENDING
========================================================= */

.spending-total {
  margin-top: 5px;

  color: #082f56;

  font-size: 25px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.spending-change {
  display: flex;
  align-items: center;
  gap: 4px;

  margin-top: 5px;

  color: #2b8a62;

  font-size: 8px;
}

.spending-chart {
  margin-top: 25px;
}

.chart-bars {
  height: 80px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 5px;

  border-bottom: 1px solid #e8edf1;
}

.chart-bars span {
  width: 100%;

  max-width: 18px;

  background: #0b5da7;

  border-radius: 3px 3px 0 0;

  opacity: 0.8;
}

.chart-labels {
  display: flex;
  justify-content: space-between;

  margin-top: 7px;

  color: #a2adb5;

  font-size: 7px;
}

/* =========================================================
   FLOATING NOTIFICATION
========================================================= */

.dashboard-notification {
  position: absolute;

  right: -5px;
  bottom: 35px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px 16px;

  background: white;

  border: 1px solid #e0e8ee;
  border-radius: 9px;

  box-shadow: 0 15px 35px rgba(8, 47, 86, 0.14);

  animation: dashboardFloat 4s ease-in-out infinite;
}

.notification-icon {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #16805a;
  background: #e9f7f1;

  border-radius: 50%;
}

.dashboard-notification strong {
  display: block;

  color: #314b5f;

  font-size: 10px;
}

.dashboard-notification span {
  display: block;

  margin-top: 2px;

  color: #8c9aa5;

  font-size: 8px;
}

@keyframes dashboardFloat {
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

@media (max-width: 1100px) {
  .dashboard-inner {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .dashboard-intro {
    max-width: 650px;
  }

  .dashboard-visual {
    width: 100%;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {
  .banking-dashboard {
    padding: 80px 20px 90px;
  }

  .dashboard-inner {
    gap: 45px;
  }

  .dashboard-intro h2 {
    font-size: 42px;
  }

  .dashboard-intro > p {
    font-size: 15px;
  }

  .dashboard-button {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-visual {
    padding: 0;
  }

  .window-header {
    height: 62px;
    padding: 0 17px;
  }

  .window-body {
    padding: 15px;
  }

  .balance-card {
    padding: 20px;
  }

  .balance-amount {
    font-size: 28px;
  }

  .dashboard-columns {
    grid-template-columns: 1fr;
  }

  .dashboard-notification {
    right: 10px;
    bottom: -20px;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 420px) {
  .banking-dashboard {
    padding-left: 16px;
    padding-right: 16px;
  }

  .dashboard-intro h2 {
    font-size: 37px;
  }

  .quick-actions {
    gap: 6px;
  }

  .quick-action {
    padding: 10px 5px;
  }

  .balance-account {
    font-size: 9px;
  }

  .dashboard-notification {
    max-width: calc(100% - 20px);
  }
}
</style>
