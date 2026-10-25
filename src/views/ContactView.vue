<script setup>
import { computed, reactive, ref } from "vue";
import { site } from "../content/site";

const form = reactive({ name: "", email: "", subject: "", message: "" });
const touched = reactive({ name: false, email: false, message: false });
const status = ref("idle"); // idle | sending | sent | mailto | error

const errors = computed(() => ({
  name: form.name.trim() ? "" : "Enter your name.",
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "" : "Enter a valid email address.",
  message: form.message.trim() ? "" : "Write a message.",
}));
const show = (field) => (touched[field] ? errors.value[field] : "");

async function submit() {
  Object.keys(touched).forEach((k) => (touched[k] = true));
  if (Object.values(errors.value).some(Boolean)) return;

  const payload = { ...form, subject: form.subject || "General" };

  if (!site.contactEndpoint) {
    // No backend configured: hand the message to the visitor's email app.
    const subject = encodeURIComponent(`${payload.subject}: ${payload.name}`);
    const body = encodeURIComponent(`${payload.message}\n\n${payload.name}\n${payload.email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    status.value = "mailto";
    return;
  }

  status.value = "sending";
  try {
    const res = await fetch(site.contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(String(res.status));
    Object.assign(form, { name: "", email: "", subject: "", message: "" });
    Object.keys(touched).forEach((k) => (touched[k] = false));
    status.value = "sent";
  } catch {
    status.value = "error";
  }
}
</script>

<template>
  <div class="page contact">
    <h1 class="heading">Studio visits, enquiries and commissions.</h1>

    <div class="cols">
      <form class="form" novalidate @submit.prevent="submit">
        <div class="pair">
          <div class="field">
            <label for="c-name">Name</label>
            <input id="c-name" v-model="form.name" type="text" autocomplete="name" required
              :aria-invalid="Boolean(show('name'))" aria-describedby="c-name-err" @blur="touched.name = true" />
            <p id="c-name-err" class="error" role="alert">{{ show("name") }}</p>
          </div>
          <div class="field">
            <label for="c-email">Email</label>
            <input id="c-email" v-model="form.email" type="email" autocomplete="email" required
              :aria-invalid="Boolean(show('email'))" aria-describedby="c-email-err" @blur="touched.email = true" />
            <p id="c-email-err" class="error" role="alert">{{ show("email") }}</p>
          </div>
        </div>

        <div class="field">
          <label for="c-subject">Enquiry type</label>
          <select id="c-subject" v-model="form.subject">
            <option value="">Choose one</option>
            <option v-for="t in site.enquiryTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="field">
          <label for="c-message">Message</label>
          <textarea id="c-message" v-model="form.message" rows="7" required
            :aria-invalid="Boolean(show('message'))" aria-describedby="c-message-err" @blur="touched.message = true"></textarea>
          <p id="c-message-err" class="error" role="alert">{{ show("message") }}</p>
        </div>

        <div class="submit">
          <button class="btn btn--solid" type="submit" :disabled="status === 'sending'">
            {{ status === "sending" ? "Sending…" : "Send message" }}
          </button>
          <p class="status" role="status">
            <template v-if="status === 'sent'">Message sent. I reply {{ site.responseTime.toLowerCase() }}.</template>
            <template v-else-if="status === 'mailto'">Your email app should open with the message ready to send. If it doesn’t, write to {{ site.email }}.</template>
            <span v-else-if="status === 'error'" class="fail">The message didn’t send. Email {{ site.email }} directly.</span>
          </p>
        </div>
      </form>

      <aside class="info" aria-label="Contact details">
        <div>
          <p class="label">Availability;</p>
          <p class="value">{{ site.availability }}</p>
        </div>
        <div>
          <p class="label">Email;</p>
          <p class="value"><a class="link" :href="`mailto:${site.email}`">{{ site.email }}</a></p>
        </div>
        <div>
          <p class="label">Studio;</p>
          <p class="value">{{ site.location }}</p>
        </div>
        <div>
          <p class="label">Instagram;</p>
          <p class="value"><a class="link" :href="site.instagram.href" target="_blank" rel="noopener">{{ site.instagram.handle }}</a></p>
        </div>
        <div>
          <p class="label">Replies;</p>
          <p class="value">{{ site.responseTime }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.contact { padding-top: clamp(40px, 8vh, 96px); }
.heading { max-width: 18ch; font-size: clamp(34px, 5vw, 72px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; }

.cols { display: grid; grid-template-columns: 2fr 1fr; gap: var(--gap); margin-top: clamp(48px, 9vh, 104px); align-items: start; }
.form { max-width: 640px; display: grid; gap: 22px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.field { display: grid; gap: 6px; }
.field label { font-size: 13px; color: var(--muted); }
input, select, textarea {
  width: 100%;
  padding: 11px 14px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 10px;
  transition: border-color 0.15s;
}
input:hover, select:hover, textarea:hover { border-color: var(--muted); }
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
input[aria-invalid="true"], textarea[aria-invalid="true"] { border-color: var(--alert); }
textarea { resize: vertical; min-height: 140px; line-height: 1.5; }
select {
  appearance: none;
  padding-right: 38px;
  background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%);
  background-position: calc(100% - 20px) 50%, calc(100% - 15px) 50%;
  background-size: 5px 5px;
  background-repeat: no-repeat;
}
.error { min-height: 1.2em; font-size: 12px; line-height: 1.2; color: var(--alert); }

.submit { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.status { font-family: var(--mono); font-size: 12px; line-height: 1.5; max-width: 44ch; }
.fail { color: var(--alert); }

.info { display: grid; gap: 26px; padding-left: clamp(16px, 2.4vw, 36px); border-left: 1px solid var(--line); }

@media (max-width: 899px) {
  .cols { grid-template-columns: 1fr; row-gap: 56px; }
  .info { border-left: 0; padding-left: 0; }
}
@media (max-width: 520px) {
  .pair { grid-template-columns: 1fr; }
}
</style>
