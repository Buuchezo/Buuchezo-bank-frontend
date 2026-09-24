<template>
  <section class="banking-features">
    <div class="banking-features-container">
      <!-- ==========================================================
           SECTION INTRO
      =========================================================== -->

      <div class="features-intro">
        <div class="section-eyebrow">BUUCHEZO BANK</div>

        <h2>
          Banking built
          <span>around you.</span>
        </h2>

        <p>
          Banking should adapt to your life — not the other way around. Everything you need to
          manage, move and protect your money, all in one place.
        </p>

        <RouterLink to="/register" class="features-button">
          Explore banking

          <span class="features-button-arrow"> → </span>
        </RouterLink>
      </div>

      <!-- ==========================================================
           FEATURES
      =========================================================== -->

      <div class="features-grid">
        <!-- ========================================================
             ACCOUNTS
        ========================================================= -->

        <article class="feature-card">
          <div class="feature-card-top">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />

                <line x1="3" y1="10" x2="21" y2="10" />

                <line x1="7" y1="15" x2="11" y2="15" />
              </svg>
            </div>

            <span class="feature-number"> 01 </span>
          </div>

          <div class="feature-content">
            <h3>Accounts</h3>

            <p>Manage your accounts and keep track of your money from one simple place.</p>
          </div>

          <div class="feature-arrow">→</div>
        </article>

        <!-- ========================================================
             TRANSACTIONS
        ========================================================= -->

        <article class="feature-card">
          <div class="feature-card-top">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M7 7h10" />

                <path d="m13 3 4 4-4 4" />

                <path d="M17 17H7" />

                <path d="m11 21-4-4 4-4" />
              </svg>
            </div>

            <span class="feature-number"> 02 </span>
          </div>

          <div class="feature-content">
            <h3>Transactions</h3>

            <p>Send and receive money quickly while keeping every transaction organized.</p>
          </div>

          <div class="feature-arrow">→</div>
        </article>

        <!-- ========================================================
             CARDS
        ========================================================= -->

        <article class="feature-card">
          <div class="feature-card-top">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />

                <line x1="2" y1="10" x2="22" y2="10" />

                <line x1="6" y1="15" x2="10" y2="15" />
              </svg>
            </div>

            <span class="feature-number"> 03 </span>
          </div>

          <div class="feature-content">
            <h3>Cards</h3>

            <p>Keep your cards close, monitor activity and stay in control of your spending.</p>
          </div>

          <div class="feature-arrow">→</div>
        </article>

        <!-- ========================================================
             SECURITY
        ========================================================= -->

        <article class="feature-card">
          <div class="feature-card-top">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />

                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <span class="feature-number"> 04 </span>
          </div>

          <div class="feature-content">
            <h3>Secure banking</h3>

            <p>Security is built into every part of your banking experience.</p>
          </div>

          <div class="feature-arrow">→</div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ================================================================
   SECTION
================================================================ */

.banking-features {
  width: 100%;

  padding: 120px 8% 130px;

  background: #ffffff;

  box-sizing: border-box;
}

/* ================================================================
   CONTAINER
================================================================ */

.banking-features-container {
  width: 100%;

  max-width: 1280px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(280px, 0.85fr)
    minmax(500px, 1.15fr);

  gap: 90px;

  align-items: center;
}

/* ================================================================
   INTRO
================================================================ */

.features-intro {
  max-width: 500px;
}

.section-eyebrow {
  margin-bottom: 18px;

  color: #087da0;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 2.2px;
}

.features-intro h2 {
  margin: 0;

  color: #071b38;

  font-size: clamp(42px, 4.5vw, 64px);

  line-height: 0.98;

  letter-spacing: -3px;

  font-weight: 750;
}

.features-intro h2 span {
  display: block;

  color: #176fc1;
}

.features-intro p {
  max-width: 450px;

  margin: 25px 0 30px;

  color: #63758a;

  font-size: 15px;

  line-height: 1.75;
}

/* ================================================================
   BUTTON
================================================================ */

.features-button {
  display: inline-flex;

  align-items: center;

  gap: 14px;

  height: 46px;

  padding: 0 19px;

  border-radius: 7px;

  background: #063e73;

  color: #ffffff;

  font-size: 13px;

  font-weight: 600;

  text-decoration: none;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.features-button:hover {
  background: #07518f;

  transform: translateY(-2px);
}

.features-button-arrow {
  font-size: 17px;
}

/* ================================================================
   FEATURE GRID
================================================================ */

.features-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 15px;
}

/* ================================================================
   FEATURE CARD
================================================================ */

.feature-card {
  position: relative;

  min-height: 255px;

  display: flex;

  flex-direction: column;

  padding: 25px;

  box-sizing: border-box;

  border: 1px solid #e5ebf1;

  border-radius: 13px;

  background: #ffffff;

  overflow: hidden;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-5px);

  border-color: #176fc1;

  background: #f5fbff;

  box-shadow: 0 18px 45px rgba(20, 55, 85, 0.12);
}

/* ================================================================
   FEATURE CARD ELEMENT TRANSITIONS
================================================================ */

.feature-card .feature-icon,
.feature-card .feature-number,
.feature-card .feature-content h3,
.feature-card .feature-content p,
.feature-card .feature-arrow {
  transition:
    color 0.25s ease,
    background-color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease,
    opacity 0.25s ease;
}

/* ================================================================
   TOP
================================================================ */

.feature-card-top {
  display: flex;

  align-items: center;

  justify-content: space-between;
}

/* ================================================================
   ICON
================================================================ */

.feature-icon {
  width: 43px;

  height: 43px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #eef7fb;

  color: #087fa4;

  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}

.feature-card:hover .feature-icon {
  background: #176fc1;

  color: #ffffff;

  transform: translateY(-2px);
}

/* ================================================================
   NUMBER
================================================================ */

.feature-number {
  color: #a5b1be;

  font-size: 9px;

  font-weight: 600;

  letter-spacing: 1px;

  transition: color 0.25s ease;
}

.feature-card:hover .feature-number {
  color: #176fc1;
}

/* ================================================================
   CONTENT
================================================================ */

.feature-content {
  margin-top: auto;

  padding-top: 35px;
}

.feature-content h3 {
  margin: 0;

  color: #102d4f;

  font-size: 21px;

  font-weight: 650;

  letter-spacing: -0.5px;

  transition: color 0.25s ease;
}

.feature-card:hover .feature-content h3 {
  color: #07559b;
}

.feature-content p {
  max-width: 280px;

  margin: 9px 0 0;

  color: #718398;

  font-size: 12px;

  line-height: 1.6;

  transition: color 0.25s ease;
}

.feature-card:hover .feature-content p {
  color: #526b82;
}

/* ================================================================
   ARROW
================================================================ */

.feature-arrow {
  position: absolute;

  right: 24px;

  bottom: 22px;

  color: #176fc1;

  font-size: 18px;

  opacity: 0;

  transform: translateX(-5px);

  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    color 0.25s ease;
}

.feature-card:hover .feature-arrow {
  color: #07559b;

  opacity: 1;

  transform: translateX(0);
}

/* ================================================================
   TABLET
================================================================ */

@media (max-width: 1000px) {
  .banking-features {
    padding: 90px 30px 100px;
  }

  .banking-features-container {
    grid-template-columns: 1fr;

    gap: 55px;
  }

  .features-intro {
    max-width: 650px;
  }
}

/* ================================================================
   MOBILE
================================================================ */

@media (max-width: 650px) {
  .banking-features {
    padding: 70px 20px 80px;
  }

  .banking-features-container {
    display: block;
  }

  .features-intro {
    max-width: 100%;
  }

  .section-eyebrow {
    margin-bottom: 14px;

    font-size: 9px;
  }

  .features-intro h2 {
    font-size: clamp(38px, 11vw, 50px);

    line-height: 1;

    letter-spacing: -2.4px;
  }

  .features-intro p {
    margin: 20px 0 25px;

    font-size: 13px;

    line-height: 1.65;
  }

  .features-button {
    width: 100%;

    justify-content: center;

    box-sizing: border-box;
  }

  .features-grid {
    grid-template-columns: 1fr;

    gap: 12px;

    margin-top: 45px;
  }

  .feature-card {
    min-height: 190px;

    padding: 21px;
  }

  .feature-content {
    padding-top: 24px;
  }

  .feature-content h3 {
    font-size: 19px;
  }

  .feature-content p {
    max-width: 90%;

    font-size: 11px;
  }

  /*
   * On touch devices there is no real hover state,
   * so keep the arrow visible.
   */

  .feature-arrow {
    opacity: 1;

    transform: none;

    right: 21px;

    bottom: 20px;
  }
}

/* ================================================================
   SMALL PHONES
================================================================ */

@media (max-width: 380px) {
  .banking-features {
    padding: 60px 18px 70px;
  }

  .features-intro h2 {
    font-size: 37px;

    letter-spacing: -2px;
  }

  .feature-card {
    min-height: 180px;

    padding: 18px;
  }
}
</style>
