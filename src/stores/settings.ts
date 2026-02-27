import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    soundEnabled: true,
    warnAt10s: true,
    autoStart: false,
  }),
})