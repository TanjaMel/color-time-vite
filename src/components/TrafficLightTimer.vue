<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

type Phase = 'green' | 'yellow' | 'red'
type Status = 'idle' | 'running' | 'paused' | 'done'

const settings = useSettingsStore()

const selectedMinutes = ref<number>(1)
const selectedSeconds = ref<number>(0)

const durationSec = ref<number>(0)
const remainingSec = ref<number>(0)
const phase = ref<Phase>('green')
const status = ref<Status>('idle')

const radius = 90
const circumference = 2 * Math.PI * radius

const isRunning = computed(() => status.value === 'running')
const isPaused = computed(() => status.value === 'paused')

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
const totalSelectedSec = computed(() => clamp(selectedMinutes.value, 0, 59) * 60 + clamp(selectedSeconds.value, 0, 59))

const mmss = computed(() => {
  const s = clamp(remainingSec.value, 0, 999999)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
})

const offset = computed(() => {
  if (durationSec.value <= 0) return circumference
  const p = remainingSec.value / durationSec.value
  return circumference * (1 - clamp(p, 0, 1))
})

let intervalId: ReturnType<typeof setInterval> | null = null
let endAtMs = 0
let pausedRemainingMs = 0
let beeped = false

const audio = new Audio('/beep.mp3')
audio.preload = 'auto'

function stopInterval() {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
}

function updatePhase() {
  const half = Math.floor(durationSec.value / 2)

  if (settings.warnAt10s && remainingSec.value <= 10) phase.value = 'red'
  else if (remainingSec.value <= half) phase.value = 'yellow'
  else phase.value = 'green'
}

function tick() {
  if (status.value !== 'running') return

  const now = Date.now()
  const msLeft = Math.max(0, endAtMs - now)
  const secLeft = Math.ceil(msLeft / 1000)

  if (secLeft !== remainingSec.value) {
    remainingSec.value = secLeft
    updatePhase()

    if (!beeped && secLeft === 10) {
      beeped = true
      if (settings.soundEnabled && settings.warnAt10s) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
    }
  }

  if (msLeft <= 0) {
    stopInterval()
    status.value = 'done'
    remainingSec.value = 0
    phase.value = settings.warnAt10s ? 'red' : 'yellow'
  }
}

function startInterval() {
  stopInterval()
  intervalId = setInterval(tick, 200)
  tick()
}

function startNew() {
  const d = totalSelectedSec.value
  if (d < 10) return

  durationSec.value = d
  remainingSec.value = d
  phase.value = 'green'
  status.value = 'running'
  beeped = false

  endAtMs = Date.now() + d * 1000
  startInterval()
}

function startOrContinue() {
  if (status.value === 'paused') {
    status.value = 'running'
    endAtMs = Date.now() + pausedRemainingMs
    startInterval()
    return
  }
  if (status.value === 'running') return
  startNew()
}

function pause() {
  if (status.value !== 'running') return
  pausedRemainingMs = Math.max(0, endAtMs - Date.now())
  status.value = 'paused'
  stopInterval()
}

function reset() {
  stopInterval()
  status.value = 'idle'
  durationSec.value = 0
  remainingSec.value = 0
  phase.value = 'green'
  beeped = false
  pausedRemainingMs = 0
}

onUnmounted(() => stopInterval())

const minuteOptions = Array.from({ length: 60 }, (_, i) => i)
const secondOptions = Array.from({ length: 60 }, (_, i) => i)
</script>

<template>
  <section class="timer">
    <div class="wrap">
      <div class="panel">
        <!-- Controls -->
        <div class="controls">
          <div class="pickers">
            <label class="field">
              <span class="label">Minutes</span>
              <select v-model.number="selectedMinutes" class="select" :disabled="isRunning">
                <option v-for="m in minuteOptions" :key="m" :value="m">{{ m }}</option>
              </select>
            </label>

            <label class="field">
              <span class="label">Seconds</span>
              <select v-model.number="selectedSeconds" class="select" :disabled="isRunning">
                <option v-for="s in secondOptions" :key="s" :value="s">{{ s }}</option>
              </select>
            </label>
          </div>

          <div class="buttons">
            <button class="btn primary" type="button" @click="startOrContinue" :disabled="isRunning && !isPaused">
              {{ isPaused ? 'Continue' : 'Start' }}
            </button>

            <button class="btn" type="button" @click="pause" :disabled="!isRunning">
              Pause
            </button>

            <button class="btn" type="button" @click="reset" :disabled="status === 'idle' && remainingSec === 0">
              Reset
            </button>
          </div>

          <p v-if="totalSelectedSec < 10" class="hint">Minimum is 10 seconds.</p>
        </div>

        <!-- Layout -->
        <div class="grid">
          <!-- Traffic light -->
          <div class="lightCol">
            <div class="traffic">
              <div class="lamp green" :class="{ on: phase === 'green' }" />
              <div class="lamp yellow" :class="{ on: phase === 'yellow' }" />
              <div class="lamp red" :class="{ on: phase === 'red' }" />
            </div>
          </div>

          <!-- Circle -->
          <div class="circleCol">
            <div class="circleCard">
              <div class="circle">
                <svg class="ring" width="200" height="200">
                  <circle
                    class="ringCircle"
                    stroke-width="8"
                    fill="white"
                    :r="radius"
                    cx="100"
                    cy="100"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="offset"
                  />
                </svg>
                <div class="timeText">{{ mmss }}</div>
              </div>

              <p class="status">{{ status }}</p>

              <div class="settingsHint">
                <span>Sound: <strong>{{ settings.soundEnabled ? 'On' : 'Off' }}</strong></span>
                <span>10s warning: <strong>{{ settings.warnAt10s ? 'On' : 'Off' }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.timer {
  background: var(--bg);
  color: var(--text);
}

.wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 16px 80px;
}

.panel {
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 24px;
}

.controls {
  display: grid;
  gap: 14px;
  justify-items: center;
  margin-bottom: 18px;
}

.pickers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field {
  display: grid;
  gap: 6px;
  width: 150px;
}

.label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.select {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 10px 12px;
  font-size: 14px;
  background: rgba(17, 24, 39, 0.06);
  color: var(--text);
  outline: none;
}


.select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(3, 149, 255, 0.12);
}


.buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  color: var(--text);
}

.btn {
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid var(--border);
  background: rgba(17, 24, 39, 0.06);
  color: var(--text);
}


.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hint {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  align-items: center;
}

.lightCol,
.circleCol {
  display: flex;
  justify-content: center;
}

/* Traffic light */
.traffic {
  height: 360px;
  width: 120px;
  border-radius: 24px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  background: rgba(17, 24, 39, 0.88);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}


.lamp {
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.45);
  transition: background-color 0.25s ease, opacity 0.25s ease;
}

.lamp.green.on { background: #4caf50; }
.lamp.yellow.on { background: #ffeb3b; }
.lamp.red.on {
  background: #f44336;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.4; }
}

/* Circle card */
.circleCard {
  border: 1px dashed var(--border);
  border-radius: 20px;
  background: var(--surface);
  padding: 22px;
  width: 100%;
  max-width: 420px;
  display: grid;
  justify-items: center;
  gap: 10px;
}

.circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.ringCircle {
  stroke: var(--accent);
  transition: stroke-dashoffset 120ms linear;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.timeText {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 34px;
  font-weight: 900;
  color: var(--text);
  user-select: none;
}

.status {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.settingsHint {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 12px;
  color: var(--muted);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>