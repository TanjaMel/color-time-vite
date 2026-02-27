<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
const s = useSettingsStore()
</script>


<template>
  <main class="page">
    <div class="row">
    
  </div>
    <h1 class="title">Settings</h1>
    <p class="subtitle">Customize the timer behavior.</p>

    <section class="card">
      <div class="row">
        <div>
          <h3 class="rowTitle">Sound</h3>
          <p class="rowText">Play a beep at the 10-second warning.</p>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="s.soundEnabled" />
          <span class="slider" />
        </label>
      </div>

      <div class="row">
        <div>
          <h3 class="rowTitle">10-second warning</h3>
          <p class="rowText">Switch to red + warning at 10 seconds.</p>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="s.warnAt10s" />
          <span class="slider" />
        </label>
      </div>

      <div class="row">
        <div>
          <h3 class="rowTitle">Auto start</h3>
          <p class="rowText">Start immediately after setting time.</p>
        </div>
        <label class="switch">
          <input type="checkbox" v-model="s.autoStart" />
          <span class="slider" />
        </label>
      </div>

    </section>
  </main>
</template>

<style scoped>
.page { max-width: 900px; margin: 0 auto; padding: 28px 16px; }
.title { margin: 0 0 8px; font-size: 28px; font-weight: 900; }
.subtitle { margin: 0 0 18px; color: rgba(17,24,39,.7); }

.card {
  background: #fff;
  border: 1px solid rgba(17,24,39,.12);
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(17,24,39,.06);
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(17,24,39,.08);
}
.row:last-child { border-bottom: 0; }

.rowTitle { margin: 0 0 4px; font-size: 14px; letter-spacing: .06em; text-transform: uppercase; }
.rowText { margin: 0; color: rgba(17,24,39,.7); font-size: 14px; max-width: 520px; }

.btn {
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid rgba(17,24,39,.14);
  background: #fff;
}

.switch { position: relative; width: 48px; height: 28px; display: inline-block; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; inset: 0;
  background: rgba(17,24,39,.20);
  border-radius: 999px;
  transition: .2s;
}
.slider:before {
  content: "";
  position: absolute; height: 22px; width: 22px;
  left: 3px; top: 3px;
  background: #fff;
  border-radius: 999px;
  transition: .2s;
  box-shadow: 0 6px 16px rgba(17,24,39,.18);
}
.switch input:checked + .slider { background: rgba(3,149,255,.8); }
.switch input:checked + .slider:before { transform: translateX(20px); }
</style>