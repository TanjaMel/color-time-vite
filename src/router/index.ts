import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import TimerPage from '@/pages/TimerPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import ContactPage from '@/pages/Contact.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'timer', component: TimerPage },
  { path: '/settings', name: 'settings', component: SettingsPage },
  { path: '/contact', name: 'contact', component: ContactPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})