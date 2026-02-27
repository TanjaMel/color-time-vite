<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <div class="wrap">
      <RouterLink to="/" class="brand" aria-label="Color Time">
        <img class="logo" src="@/assets/logo.png" alt="Color Time logo" />
      </RouterLink>

      <nav class="nav">
        <RouterLink class="link" to="/">Timer</RouterLink>
        <RouterLink class="link" to="/settings">Settings</RouterLink>
        <RouterLink class="link" to="/contact">Contact</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 30;

  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand { display: inline-flex; align-items: center; text-decoration: none; }
.logo { height: 42px; width: auto; display: block; }

.nav {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link {
  text-decoration: none;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 13px;

  color: var(--muted);
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid transparent;
}

.link:hover { color: var(--text); background: rgba(17,24,39,0.04); }
:global(html[data-theme="dark"]) .link:hover { background: rgba(255,255,255,0.06); }

.link.router-link-active {
  color: var(--text);
  border-color: rgba(3, 149, 255, 0.35);
}

.themeBtn {
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  border: 1px solid var(--border);
  background: rgba(17,24,39,0.06);
  color: var(--text);
  cursor: pointer;
}

:global(html[data-theme="dark"]) .themeBtn {
  background: rgba(255,255,255,0.06);
}

@media (max-width: 520px) {
  .logo { height: 36px; }
  .link { padding: 8px 10px; font-size: 12px; }
}
</style>