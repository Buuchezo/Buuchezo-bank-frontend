<template>
  <main class="dashboard-page">
    <!-- =====================================================
         SIDEBAR
    ====================================================== -->

    <aside class="dashboard-sidebar" :class="{ open: mobileMenuOpen }">
      <RouterLink to="/" class="dashboard-logo">
        <span>B</span>
        <strong>Buuchezo Bank</strong>
      </RouterLink>

      <nav class="dashboard-nav">
        <span class="nav-section-title"> MAIN </span>

        <RouterLink to="/dashboard" class="dashboard-nav-link active">
          <LayoutDashboard :size="18" />
          <span>Overview</span>
        </RouterLink>

        <RouterLink to="/accounts" class="dashboard-nav-link">
          <WalletCards :size="18" />
          <span>Accounts</span>
        </RouterLink>

        <RouterLink to="/transactions" class="dashboard-nav-link">
          <ArrowLeftRight :size="18" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink to="/cards" class="dashboard-nav-link">
          <CreditCard :size="18" />
          <span>Cards</span>
        </RouterLink>

        <span class="nav-section-title second-nav-title"> SERVICES </span>

        <RouterLink to="/transfers" class="dashboard-nav-link">
          <Send :size="18" />
          <span>Transfers</span>
        </RouterLink>

        <RouterLink to="/settings" class="dashboard-nav-link">
          <Settings :size="18" />
          <span>Settings</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="support-box">
          <div class="support-icon">
            <HelpCircle :size="16" />
          </div>

          <div>
            <strong>Need help?</strong>
            <span>We're here for you.</span>
          </div>
        </div>

        <button class="logout-button">
          <LogOut :size="17" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <!-- =====================================================
         MAIN
    ====================================================== -->

    <div class="dashboard-main">
      <header class="dashboard-header">
        <button class="mobile-menu-button" type="button" @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu :size="21" />
        </button>

        <div class="header-title">
          <span>OVERVIEW</span>
          <h1>Good morning, John.</h1>
        </div>

        <div class="header-actions">
          <button class="header-icon">
            <Bell :size="19" />
            <span class="notification-dot"></span>
          </button>

          <div class="header-profile">
            <div class="profile-avatar">JD</div>

            <div class="profile-info">
              <strong>John Doe</strong>
              <span>Personal</span>
            </div>

            <ChevronDown :size="15" />
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <!-- =================================================
             BALANCE
        ================================================== -->

        <section class="balance-section">
          <div class="balance-main-card">
            <div class="balance-card-header">
              <div>
                <span>AVAILABLE BALANCE</span>
                <h2>€12,840.65</h2>
              </div>

              <div class="balance-card-icon">
                <WalletCards :size="21" />
              </div>
            </div>

            <div class="balance-card-footer">
              <span>Personal Account</span>
              <span>•••• 3456</span>
            </div>
          </div>

          <div class="balance-stat">
            <div class="stat-icon income">
              <ArrowDownLeft :size="17" />
            </div>

            <div>
              <span>Income</span>
              <strong>€4,820.00</strong>
              <small>This month</small>
            </div>
          </div>

          <div class="balance-stat">
            <div class="stat-icon expense">
              <ArrowUpRight :size="17" />
            </div>

            <div>
              <span>Expenses</span>
              <strong>€1,284.20</strong>
              <small>This month</small>
            </div>
          </div>
        </section>

        <!-- =================================================
             QUICK ACTIONS
        ================================================== -->

        <section class="quick-section">
          <div class="section-heading">
            <div>
              <span>QUICK ACTIONS</span>
              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div class="dashboard-actions">
            <button class="action-card">
              <div class="action-icon">
                <Send :size="19" />
              </div>

              <strong>Send money</strong>
              <span>Make a transfer</span>

              <ArrowUpRight class="action-arrow" :size="17" />
            </button>

            <button class="action-card">
              <div class="action-icon">
                <ArrowDownLeft :size="19" />
              </div>

              <strong>Receive money</strong>
              <span>View your details</span>

              <ArrowUpRight class="action-arrow" :size="17" />
            </button>

            <button class="action-card">
              <div class="action-icon">
                <CreditCard :size="19" />
              </div>

              <strong>Manage cards</strong>
              <span>View your cards</span>

              <ArrowUpRight class="action-arrow" :size="17" />
            </button>

            <button class="action-card">
              <div class="action-icon">
                <BarChart3 :size="19" />
              </div>

              <strong>Spending</strong>
              <span>See your activity</span>

              <ArrowUpRight class="action-arrow" :size="17" />
            </button>
          </div>
        </section>

        <!-- =================================================
             LOWER AREA
        ================================================== -->

        <div class="dashboard-lower">
          <!-- TRANSACTIONS -->

          <section class="dashboard-panel transactions-panel">
            <div class="panel-heading">
              <div>
                <span>RECENT ACTIVITY</span>
                <h2>Transactions</h2>
              </div>

              <RouterLink to="/transactions">
                View all
                <ArrowRight :size="14" />
              </RouterLink>
            </div>

            <div class="transaction-list">
              <div class="dashboard-transaction">
                <div class="transaction-symbol">
                  <ShoppingBag :size="17" />
                </div>

                <div class="transaction-description">
                  <strong>Groceries</strong>
                  <span>Today · Card payment</span>
                </div>

                <strong class="transaction-value negative"> −€84.20 </strong>
              </div>

              <div class="dashboard-transaction">
                <div class="transaction-symbol income-symbol">
                  <ArrowDownLeft :size="17" />
                </div>

                <div class="transaction-description">
                  <strong>Salary</strong>
                  <span>Yesterday · Incoming</span>
                </div>

                <strong class="transaction-value positive"> +€3,240.00 </strong>
              </div>

              <div class="dashboard-transaction">
                <div class="transaction-symbol">
                  <Coffee :size="17" />
                </div>

                <div class="transaction-description">
                  <strong>Coffee House</strong>
                  <span>Yesterday · Card payment</span>
                </div>

                <strong class="transaction-value negative"> −€5.80 </strong>
              </div>

              <div class="dashboard-transaction">
                <div class="transaction-symbol">
                  <ArrowUpRight :size="17" />
                </div>

                <div class="transaction-description">
                  <strong>Alex Morgan</strong>
                  <span>18 Sep · Transfer</span>
                </div>

                <strong class="transaction-value negative"> −€120.00 </strong>
              </div>

              <div class="dashboard-transaction">
                <div class="transaction-symbol income-symbol">
                  <ArrowDownLeft :size="17" />
                </div>

                <div class="transaction-description">
                  <strong>Refund</strong>
                  <span>17 Sep · Incoming</span>
                </div>

                <strong class="transaction-value positive"> +€45.00 </strong>
              </div>
            </div>
          </section>

          <!-- SPENDING -->

          <section class="dashboard-panel spending-panel">
            <div class="panel-heading">
              <div>
                <span>MONTHLY OVERVIEW</span>
                <h2>Spending</h2>
              </div>

              <button class="period-button">
                September
                <ChevronDown :size="13" />
              </button>
            </div>

            <div class="spending-number">€1,284.20</div>

            <div class="spending-change">
              <TrendingDown :size="14" />
              8.4% less than last month
            </div>

            <div class="spending-chart">
              <div class="chart-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div class="chart-bars">
                <div style="height: 38%"></div>
                <div style="height: 55%"></div>
                <div style="height: 46%"></div>
                <div style="height: 68%"></div>
                <div style="height: 51%"></div>
                <div style="height: 82%"></div>
                <div style="height: 63%"></div>
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

            <div class="spending-categories">
              <div>
                <span class="category-dot"></span>
                <span>Shopping</span>
                <strong>38%</strong>
              </div>

              <div>
                <span class="category-dot"></span>
                <span>Food</span>
                <strong>27%</strong>
              </div>

              <div>
                <span class="category-dot"></span>
                <span>Transport</span>
                <strong>18%</strong>
              </div>
            </div>
          </section>
        </div>

        <!-- =================================================
             ACCOUNT CARD
        ================================================== -->

        <section class="dashboard-card-section">
          <div class="dashboard-card-heading">
            <div>
              <span>YOUR CARD</span>
              <h2>Manage your card</h2>
            </div>

            <RouterLink to="/cards">
              Manage
              <ArrowUpRight :size="15" />
            </RouterLink>
          </div>

          <div class="dashboard-bank-card">
            <div class="bank-card-top">
              <div class="bank-card-brand">
                <div>B</div>
                <strong>Buuchezo Bank</strong>
              </div>

              <Wifi :size="22" />
            </div>

            <div class="bank-card-chip"></div>

            <div class="bank-card-number">5432&nbsp;&nbsp;7512&nbsp;&nbsp;3412&nbsp;&nbsp;3456</div>

            <div class="bank-card-bottom">
              <div>
                <span>CARD HOLDER</span>
                <strong>JOHN DOE</strong>
              </div>

              <div class="card-type">VISA</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronDown,
  Coffee,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Send,
  Settings,
  ShoppingBag,
  TrendingDown,
  WalletCards,
  Wifi,
} from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;

  display: flex;

  color: #29465a;

  background: #f5f8fb;
}

/* =========================================================
   SIDEBAR
========================================================= */

.dashboard-sidebar {
  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;

  width: 245px;

  padding: 28px 18px;

  display: flex;
  flex-direction: column;

  background: #ffffff;

  border-right: 1px solid #e3ebf0;

  z-index: 100;
}

.dashboard-logo {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 0 10px;

  color: #082f56;

  text-decoration: none;
}

.dashboard-logo span {
  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 8px;

  font-size: 16px;

  font-weight: 900;
}

.dashboard-logo strong {
  font-size: 15px;

  letter-spacing: -0.02em;
}

/* =========================================================
   NAVIGATION
========================================================= */

.dashboard-nav {
  display: flex;

  flex-direction: column;

  gap: 5px;

  margin-top: 50px;
}

.nav-section-title {
  padding: 0 13px;

  margin-bottom: 9px;

  color: #a0adb7;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.15em;
}

.second-nav-title {
  margin-top: 30px;
}

.dashboard-nav-link {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 13px;

  color: #7d8d99;

  border-radius: 7px;

  font-size: 11px;

  font-weight: 600;

  text-decoration: none;

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.dashboard-nav-link:hover {
  color: #0b4878;

  background: #f1f7fa;
}

.dashboard-nav-link.active {
  color: #0b4878;

  background: #eaf4fa;

  font-weight: 800;
}

/* =========================================================
   SIDEBAR BOTTOM
========================================================= */

.sidebar-bottom {
  margin-top: auto;
}

.support-box {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 13px;

  margin-bottom: 18px;

  background: #f5f9fb;

  border-radius: 8px;
}

.support-icon {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: white;

  border-radius: 6px;
}

.support-box strong {
  display: block;

  color: #425c6e;

  font-size: 9px;
}

.support-box span {
  display: block;

  margin-top: 2px;

  color: #9aa8b2;

  font-size: 8px;
}

.logout-button {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 11px 13px;

  color: #84929c;

  background: none;

  border: 0;

  border-radius: 7px;

  font-family: inherit;

  font-size: 11px;

  cursor: pointer;

  text-align: left;
}

.logout-button:hover {
  color: #0b4878;

  background: #f4f8fa;
}

/* =========================================================
   MAIN
========================================================= */

.dashboard-main {
  width: calc(100% - 245px);

  margin-left: 245px;
}

/* =========================================================
   HEADER
========================================================= */

.dashboard-header {
  height: 82px;

  padding: 0 45px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: white;

  border-bottom: 1px solid #e4ebf0;
}

.header-title span {
  display: block;

  margin-bottom: 5px;

  color: #a0adb6;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.header-title h1 {
  margin: 0;

  color: #082f56;

  font-size: 18px;

  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;

  align-items: center;

  gap: 25px;
}

.header-icon {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #627888;

  background: #f4f8fa;

  border: 0;

  border-radius: 50%;

  cursor: pointer;
}

.notification-dot {
  position: absolute;

  top: 7px;
  right: 8px;

  width: 6px;
  height: 6px;

  background: #0b5da7;

  border: 2px solid white;

  border-radius: 50%;
}

.header-profile {
  display: flex;

  align-items: center;

  gap: 9px;
}

.profile-avatar {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: white;

  background: #0b4878;

  border-radius: 50%;

  font-size: 9px;

  font-weight: 800;
}

.profile-info strong {
  display: block;

  color: #40586a;

  font-size: 10px;
}

.profile-info span {
  display: block;

  margin-top: 2px;

  color: #9ba8b2;

  font-size: 8px;
}

.mobile-menu-button {
  display: none;
}

/* =========================================================
   CONTENT
========================================================= */

.dashboard-content {
  max-width: 1400px;

  padding: 40px 45px 70px;

  margin: 0 auto;
}

/* =========================================================
   BALANCE
========================================================= */

.balance-section {
  display: grid;

  grid-template-columns: 1.6fr 1fr 1fr;

  gap: 15px;
}

.balance-main-card {
  min-height: 170px;

  padding: 25px;

  color: white;

  background: linear-gradient(135deg, #063d74, #07559b 55%, #143fbd);

  border-radius: 12px;

  box-shadow: 0 15px 30px rgba(8, 47, 86, 0.13);
}

.balance-card-header {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;
}

.balance-card-header > div:first-child span {
  color: rgba(255, 255, 255, 0.58);

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.1em;
}

.balance-card-header h2 {
  margin: 10px 0 0;

  font-size: 30px;

  line-height: 1;

  letter-spacing: -0.04em;
}

.balance-card-icon {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.12);

  border-radius: 7px;
}

.balance-card-footer {
  display: flex;

  justify-content: space-between;

  padding-top: 20px;

  margin-top: 25px;

  border-top: 1px solid rgba(255, 255, 255, 0.14);

  color: rgba(255, 255, 255, 0.6);

  font-size: 9px;
}

.balance-stat {
  min-height: 170px;

  padding: 25px;

  display: flex;

  align-items: flex-start;

  gap: 13px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;
}

.stat-icon {
  width: 37px;
  height: 37px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 8px;
}

.stat-icon.income {
  color: #27825f;

  background: #eaf7f1;
}

.stat-icon.expense {
  color: #0b4878;

  background: #edf6fb;
}

.balance-stat > div:last-child span {
  display: block;

  color: #94a1ab;

  font-size: 9px;
}

.balance-stat strong {
  display: block;

  margin-top: 9px;

  color: #29465a;

  font-size: 20px;

  letter-spacing: -0.03em;
}

.balance-stat small {
  display: block;

  margin-top: 7px;

  color: #a2adb5;

  font-size: 8px;
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

.quick-section {
  margin-top: 45px;
}

.section-heading > div span {
  display: block;

  margin-bottom: 6px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.14em;
}

.section-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 20px;

  letter-spacing: -0.025em;
}

.dashboard-actions {
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 13px;

  margin-top: 18px;
}

.action-card {
  position: relative;

  min-height: 140px;

  padding: 18px;

  display: flex;

  flex-direction: column;

  align-items: flex-start;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 10px;

  font-family: inherit;

  text-align: left;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.action-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 12px 30px rgba(8, 47, 86, 0.07);
}

.action-icon {
  width: 35px;
  height: 35px;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 7px;

  margin-bottom: auto;
}

.action-card strong {
  color: #314b5f;

  font-size: 11px;
}

.action-card > span {
  margin-top: 4px;

  color: #9aa7b1;

  font-size: 8px;
}

.action-arrow {
  position: absolute;

  top: 19px;
  right: 19px;

  color: #9ba9b3;
}

/* =========================================================
   LOWER AREA
========================================================= */

.dashboard-lower {
  display: grid;

  grid-template-columns: 1.2fr 0.8fr;

  gap: 15px;

  margin-top: 40px;
}

.dashboard-panel {
  min-width: 0;

  padding: 25px;

  background: white;

  border: 1px solid #e1e9ee;

  border-radius: 12px;
}

.panel-heading {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  margin-bottom: 22px;
}

.panel-heading > div span {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.panel-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 17px;
}

.panel-heading a {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #0b5da7;

  font-size: 9px;

  font-weight: 700;

  text-decoration: none;
}

.period-button {
  display: flex;

  align-items: center;

  gap: 5px;

  padding: 7px 9px;

  color: #728491;

  background: #f5f8fa;

  border: 0;

  border-radius: 5px;

  font-family: inherit;

  font-size: 8px;
}

/* =========================================================
   TRANSACTIONS
========================================================= */

.transaction-list {
  display: flex;

  flex-direction: column;
}

.dashboard-transaction {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 13px 0;

  border-bottom: 1px solid #eef2f5;
}

.dashboard-transaction:last-child {
  border-bottom: 0;
}

.transaction-symbol {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  color: #0b4878;

  background: #edf6fb;

  border-radius: 8px;
}

.income-symbol {
  color: #25825d;

  background: #eaf7f1;
}

.transaction-description {
  min-width: 0;

  flex: 1;
}

.transaction-description strong {
  display: block;

  color: #415a6b;

  font-size: 10px;
}

.transaction-description span {
  display: block;

  margin-top: 3px;

  color: #9ca9b2;

  font-size: 8px;
}

.transaction-value {
  flex-shrink: 0;

  font-size: 10px;
}

.transaction-value.negative {
  color: #506777;
}

.transaction-value.positive {
  color: #27815d;
}

/* =========================================================
   SPENDING
========================================================= */

.spending-number {
  color: #082f56;

  font-size: 29px;

  font-weight: 700;

  letter-spacing: -0.04em;
}

.spending-change {
  display: flex;

  align-items: center;

  gap: 5px;

  margin-top: 6px;

  color: #2b875f;

  font-size: 8px;
}

.spending-chart {
  position: relative;

  height: 150px;

  margin-top: 30px;
}

.chart-grid {
  position: absolute;

  inset: 0 0 20px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;
}

.chart-grid span {
  width: 100%;

  height: 1px;

  background: #edf1f4;
}

.chart-bars {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 20px;

  height: 120px;

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 8px;
}

.chart-bars div {
  width: 100%;

  background: #0b5da7;

  border-radius: 4px 4px 0 0;

  opacity: 0.78;
}

.chart-labels {
  position: absolute;

  bottom: 0;
  left: 0;
  right: 0;

  display: flex;

  justify-content: space-between;

  color: #a1adb5;

  font-size: 7px;
}

.spending-categories {
  display: flex;

  justify-content: space-between;

  padding-top: 18px;

  border-top: 1px solid #edf1f4;
}

.spending-categories div {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #8998a3;

  font-size: 8px;
}

.spending-categories strong {
  margin-left: 3px;

  color: #425b6c;
}

.category-dot {
  width: 6px;
  height: 6px;

  background: #0b5da7;

  border-radius: 50%;
}

/* =========================================================
   CARD
========================================================= */

.dashboard-card-section {
  margin-top: 40px;
}

.dashboard-card-heading {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 18px;
}

.dashboard-card-heading span {
  display: block;

  margin-bottom: 5px;

  color: #9aa7b1;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.13em;
}

.dashboard-card-heading h2 {
  margin: 0;

  color: #082f56;

  font-size: 18px;
}

.dashboard-card-heading a {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #0b5da7;

  font-size: 9px;

  font-weight: 700;

  text-decoration: none;
}

.dashboard-bank-card {
  width: min(470px, 100%);

  aspect-ratio: 410 / 247;

  padding: 25px;

  color: white;

  background: linear-gradient(145deg, #063d74, #07559b 55%, #143fbd);

  border-radius: 16px;

  box-shadow: 0 25px 50px rgba(8, 47, 86, 0.17);

  overflow: hidden;
}

.bank-card-top {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.bank-card-brand {
  display: flex;

  align-items: center;

  gap: 8px;
}

.bank-card-brand div {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.13);

  border-radius: 6px;

  font-weight: 800;
}

.bank-card-brand strong {
  font-size: 12px;
}

.bank-card-chip {
  width: 45px;
  height: 32px;

  margin-top: 35px;

  background: #d1b06c;

  border-radius: 5px;
}

.bank-card-number {
  margin-top: 22px;

  font-size: 17px;

  letter-spacing: 0.11em;
}

.bank-card-bottom {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-top: 27px;
}

.bank-card-bottom span {
  display: block;

  margin-bottom: 4px;

  color: rgba(255, 255, 255, 0.45);

  font-size: 6px;

  letter-spacing: 0.13em;
}

.bank-card-bottom strong {
  font-size: 9px;

  letter-spacing: 0.08em;
}

.card-type {
  font-size: 17px;

  font-weight: 800;

  font-style: italic;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .dashboard-sidebar {
    width: 215px;
  }

  .dashboard-main {
    width: calc(100% - 215px);

    margin-left: 215px;
  }

  .dashboard-content {
    padding-left: 30px;
    padding-right: 30px;
  }

  .dashboard-header {
    padding-left: 30px;
    padding-right: 30px;
  }

  .balance-section {
    grid-template-columns: 1.4fr 1fr 1fr;
  }

  .dashboard-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 850px) {
  .dashboard-sidebar {
    transform: translateX(-100%);

    transition: transform 0.25s ease;

    box-shadow: 10px 0 35px rgba(8, 47, 86, 0.1);
  }

  .dashboard-sidebar.open {
    transform: translateX(0);
  }

  .dashboard-main {
    width: 100%;

    margin-left: 0;
  }

  .mobile-menu-button {
    width: 38px;
    height: 38px;

    display: flex;

    align-items: center;
    justify-content: center;

    color: #526a7a;

    background: #f4f8fa;

    border: 0;

    border-radius: 7px;

    cursor: pointer;
  }

  .dashboard-header {
    gap: 15px;
  }

  .header-title {
    flex: 1;
  }

  .profile-info {
    display: none;
  }

  .balance-section {
    grid-template-columns: 1fr 1fr;
  }

  .balance-main-card {
    grid-column: span 2;
  }

  .dashboard-lower {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .dashboard-header {
    height: 72px;

    padding: 0 16px;
  }

  .header-title h1 {
    font-size: 15px;
  }

  .header-actions {
    gap: 9px;
  }

  .header-icon {
    width: 34px;
    height: 34px;
  }

  .profile-avatar {
    width: 34px;
    height: 34px;
  }

  .dashboard-content {
    padding: 25px 16px 50px;
  }

  .balance-section {
    grid-template-columns: 1fr;
  }

  .balance-main-card {
    grid-column: auto;

    min-height: 160px;
  }

  .balance-stat {
    min-height: auto;
  }

  .dashboard-actions {
    grid-template-columns: 1fr 1fr;
  }

  .action-card {
    min-height: 130px;
  }

  .dashboard-panel {
    padding: 20px;
  }

  .spending-categories {
    gap: 10px;

    flex-wrap: wrap;
  }

  .dashboard-bank-card {
    padding: 19px;
  }

  .bank-card-number {
    font-size: 13px;
  }
}

/* =========================================================
   SMALL PHONES
========================================================= */

@media (max-width: 380px) {
  .dashboard-content {
    padding-left: 12px;
    padding-right: 12px;
  }

  .header-title h1 {
    font-size: 14px;
  }

  .balance-card-header h2 {
    font-size: 27px;
  }

  .dashboard-actions {
    gap: 9px;
  }

  .action-card {
    padding: 14px;
  }

  .action-card strong {
    font-size: 10px;
  }

  .dashboard-bank-card {
    padding: 16px;
  }

  .bank-card-chip {
    margin-top: 25px;
  }

  .bank-card-number {
    margin-top: 16px;

    font-size: 11px;
  }
}
</style>
