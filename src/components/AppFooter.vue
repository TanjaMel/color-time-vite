<script setup lang="ts">
import { RouterLink } from 'vue-router'



const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="wrap">
      <div class="top">
        <!-- Brand -->
        <div class="brand">
          <img class="logo" src="@/assets/logo_white.png" alt="Color Time logo" />
          <p class="tagline">Make time visible. Stay calm.</p>
        </div>


        <!-- Contact -->
        <div class="contact">
          <h4 class="title">Contact</h4>
          <a class="link" href="mailto:hello@colortime.app">hello@colortime.app</a>
          <p class="meta">Usually replies within 24h.</p>
        </div>
      </div>

      <div class="rule" />

      <div class="bottom">
        <p class="copy">© {{ year }} Color Time. All rights reserved.</p>

        <div class="smallLinks">
          <a class="smallLink" href="#" @click.prevent>Privacy</a>
          <span class="dot" aria-hidden="true">•</span>
          <a class="smallLink" href="#" @click.prevent>Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 56px;
  color: rgba(255, 255, 255, 0.92);
  background: radial-gradient(1200px 600px at 10% -10%, rgba(3,149,255,0.18), transparent 55%),
              radial-gradient(900px 500px at 90% 0%, rgba(3,149,255,0.10), transparent 60%),
              linear-gradient(180deg, #0b1220 0%, #070b14 100%);

  border-top: 1px solid rgba(255, 255, 255, 0.10);
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 34px 16px 18px;
}

.top {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 26px;
  align-items: start;
}

.brand {
  min-width: 0;
}

.logo {
  height: 42px;
  width: auto;
  display: block;
  margin-bottom: 10px;
}

.tagline {
  margin: 0;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.72);
}

.title {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.70);
}

.nav,
.contact {
  display: grid;
  justify-content: end;
  gap: 8px;
}

.link {
  text-decoration: none;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.78);
  width: fit-content;
}

.link:hover {
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.meta {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.68);
}

.rule {
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
  margin: 18px 0 14px;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.copy {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
}

.smallLinks {
  display: flex;
  gap: 10px;
  align-items: center;
}

.smallLink {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
}

.smallLink:hover {
  color: rgba(255, 255, 255, 0.92);
}

.dot {
  color: rgba(255, 255, 255, 0.35);
}

@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>