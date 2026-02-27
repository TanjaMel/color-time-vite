<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type FormState = {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

const state = reactive<FormState>({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
})

const touched = reactive({
  firstName: false,
  lastName: false,
  email: false,
  subject: false,
  message: false,
})

const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

const emailOk = (v: string) => /.+@.+\..+/.test(v)

const errors = computed(() => ({
  firstName: !state.firstName.trim() ? 'First name is required.' : '',
  lastName: !state.lastName.trim() ? 'Last name is required.' : '',
  email: !state.email.trim() ? 'E-mail is required.' : !emailOk(state.email) ? 'E-mail must be valid.' : '',
  subject: !state.subject.trim() ? 'Subject is required.' : state.subject.trim().length > 60 ? 'Keep it under 60 chars.' : '',
  message: !state.message.trim()
    ? 'Message is required.'
    : state.message.trim().length < 10
      ? 'Write at least 10 characters.'
      : state.message.trim().length > 800
        ? 'Keep it under 800 characters.'
        : '',
}))

const isValid = computed(() => Object.values(errors.value).every((e) => !e))
const messageLen = computed(() => state.message.trim().length)

function markAllTouched() {
  touched.firstName = true
  touched.lastName = true
  touched.email = true
  touched.subject = true
  touched.message = true
}

function clear() {
  state.firstName = ''
  state.lastName = ''
  state.email = ''
  state.subject = ''
  state.message = ''
  submitStatus.value = 'idle'
  touched.firstName = false
  touched.lastName = false
  touched.email = false
  touched.subject = false
  touched.message = false
}

async function submit() {
  markAllTouched()
  if (!isValid.value || isSubmitting.value) return

  isSubmitting.value = true
  submitStatus.value = 'idle'
  try {
    console.log('Contact payload:', { ...state })
    submitStatus.value = 'success'
    clear()
  } catch {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="heroOverlay" />
      <div class="wrap">
        <h1 class="heroTitle">Contact</h1>
        <p class="heroSubtitle">Send a short message — we’ll reply with next steps.</p>

        
      </div>
    </section>

    <section class="content">
      <div class="wrap">
        <div class="card">
          <div class="cardHeader">
            <h2 class="cardTitle">Send a message</h2>
            
          </div>

          <form class="form" @submit.prevent="submit" novalidate>
            <div class="row2">
              <div class="field">
                <label class="label" for="firstName">First name</label>
                <input
                  id="firstName"
                  v-model.trim="state.firstName"
                  class="input"
                  type="text"
                  autocomplete="given-name"
                  @blur="touched.firstName = true"
                  :aria-invalid="touched.firstName && !!errors.firstName"
                />
                <p v-if="touched.firstName && errors.firstName" class="error">{{ errors.firstName }}</p>
              </div>

              <div class="field">
                <label class="label" for="lastName">Last name</label>
                <input
                  id="lastName"
                  v-model.trim="state.lastName"
                  class="input"
                  type="text"
                  autocomplete="family-name"
                  @blur="touched.lastName = true"
                  :aria-invalid="touched.lastName && !!errors.lastName"
                />
                <p v-if="touched.lastName && errors.lastName" class="error">{{ errors.lastName }}</p>
              </div>
            </div>

            <div class="field">
              <label class="label" for="email">E-mail</label>
              <input
                id="email"
                v-model.trim="state.email"
                class="input"
                type="email"
                autocomplete="email"
                inputmode="email"
                @blur="touched.email = true"
                :aria-invalid="touched.email && !!errors.email"
              />
              <p v-if="touched.email && errors.email" class="error">{{ errors.email }}</p>
            </div>

            <div class="field">
              <label class="label" for="subject">Subject</label>
              <input
                id="subject"
                v-model.trim="state.subject"
                class="input"
                type="text"
                maxlength="60"
                placeholder="For example: sound toggle, presets, design"
                @blur="touched.subject = true"
                :aria-invalid="touched.subject && !!errors.subject"
              />
              <div class="metaRow">
                <p v-if="touched.subject && errors.subject" class="error">{{ errors.subject }}</p>
                <span class="counter">{{ state.subject.length }}/60</span>
              </div>
            </div>

            <div class="field">
              <label class="label" for="message">Message</label>
              <textarea
                id="message"
                v-model.trim="state.message"
                class="textarea"
                rows="6"
                maxlength="800"
                placeholder="Write your message here…"
                @blur="touched.message = true"
                :aria-invalid="touched.message && !!errors.message"
              />
              <div class="metaRow">
                <p v-if="touched.message && errors.message" class="error">{{ errors.message }}</p>
                <span class="counter">{{ messageLen }}/800</span>
              </div>
            </div>

            <div class="actions">
              <button class="btnSend" type="submit" :disabled="!isValid || isSubmitting">
                {{ isSubmitting ? 'Sending…' : 'Send message' }}
              </button>

              <button class="btnClear" type="button" @click="clear" :disabled="isSubmitting">
                Clear
              </button>

              <span class="micro ok" v-if="submitStatus === 'success'">Sent ✅</span>
              <span class="micro bad" v-if="submitStatus === 'error'">Failed. Try again.</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
*,
*::before,
*::after { box-sizing: border-box; }

.page { background: var(--bg); color: var(--text); }

.hero {
  position: relative;
  background-image: url("@/assets/contactFormBG.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 46px 0 22px;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0.92), rgba(255,255,255,0.78));
}
:global(html[data-theme="dark"]) .heroOverlay {
  background: linear-gradient(to bottom, rgba(11,18,32,0.88), rgba(11,18,32,0.70));
}

.wrap {
  position: relative;
  max-width: 1100px; 
  margin: 0 auto;
  padding: 0 16px;
}

.heroTitle {
  margin: 0 0 8px;
  font-size: 40px;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.heroSubtitle { margin: 0 0 12px; color: var(--muted); line-height: 1.7; }

.heroMeta { display: flex; gap: 10px; flex-wrap: wrap; }
.pill {
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 8px 10px;
  border-radius: 999px;
}

.content { padding: 18px 0 64px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 20px;

  max-width: 860px;   
  margin: 0 auto;    

}

.cardHeader {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.cardTitle { margin: 0; font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; }
.cardHint { margin: 0; color: var(--muted); font-size: 14px; }

.row2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); /* ✅ ключ */
  gap: 16px;
  align-items: start;
}
.field { min-width: 0; margin-bottom: 12px; }

.label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: left;
}



.input, .textarea {
  width: 100% !important;  
  display: block !important;
  min-width: 0; 
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(17,24,39,0.06);
  color: var(--text);
  padding: 12px;
  font-size: 16px;
  outline: none;
}


.input:focus, .textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(3,149,255,0.12);
}


.input[aria-invalid="true"], .textarea[aria-invalid="true"] {
  border-color: var(--danger);
  box-shadow: 0 0 0 4px rgba(180,35,24,0.10);
}

.textarea { resize: vertical; min-height: 160px; }

.metaRow {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}
.error { margin: 0; font-size: 13px; color: var(--danger); }
.counter { font-size: 12px; color: var(--muted); white-space: nowrap; }

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
}

.btn {
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 900;
  cursor: pointer;
  border: 1px solid var(--border);
  background: rgba(17,24,39,0.06);
  color: var(--text);
}


.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn.ghost { background: transparent; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.micro { font-size: 13px; }
.micro.ok { color: var(--muted); }
.micro.bad { color: var(--danger); }

@media (max-width: 600px) {
  .heroTitle { font-size: 30px; }
  .row2 { grid-template-columns: 1fr; }
}

.card {
  width: 100% !important;
  display: block !important;
}

.form {
  width: 100% !important;
  display: block !important;
}

.row2 {
  width: 100% !important;
}

.field {
  width: 100% !important;
}

.actions{
  display:flex;
  gap:12px;
  align-items:center;
  flex-wrap:wrap;
  margin-top: 14px;
}

.btnSend{
  appearance:none;
  border:0;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 900;
  cursor:pointer;

  border: 1px solid var(--border);
  background: rgba(17, 24, 39, 0.06);
  color: var(--text);
}

.btnSend:hover{ filter: brightness(0.98); }
.btnSend:disabled{
  opacity: .55;
  cursor: not-allowed;
  box-shadow: none;
}

.btnClear{
  appearance:none;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 900;
  cursor:pointer;

  border: 1px solid var(--border);
  background: rgba(17,24,39,0.06);
  color: var(--text);
}

.btnClear:hover{ background: rgba(17,24,39,0.09); }
</style>