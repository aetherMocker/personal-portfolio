<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { site } from "../content/site";

// Live clock in the studio's timezone
const time = ref("");
let timer;

function tick() {
  time.value = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: site.timezone,
  }).format(new Date());
}

onMounted(() => {
  tick();
  timer = setInterval(tick, 15000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <footer class="footer">
    <div class="page inner">
      <div class="brand">
        <p class="name">{{ site.name }}</p>
        <p class="credit">Came from a Tooplate base.</p>
      </div>
      
      <div class="meta">
        <div class="block">
          <p class="label">Email</p>
          <a class="mail value" :href="`mailto:${site.email}`">{{ site.email }}</a>
        </div>
        <div class="block">
          <p class="label">Based in</p>
          <p class="value">{{ site.location }}</p>
        </div>
        <div class="block">
          <p class="label">Local time</p>
          <p class="value time">{{ time }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { margin-top: clamp(64px, 10vh, 120px); padding-block: 10px 20px; border-top: 3px double var(--ink); }

.inner { display: flex; justify-content: space-between; align-items: flex-start; gap: 5px; }

.brand { display: flex; flex-direction: column; gap: 1px; }

.name { font-weight: 500; letter-spacing: -0.01em; font-size: 15px; }

.credit { font-family: var(--mono); font-size: 10px; color: var(--muted); opacity: 0.8; }

.meta { display: flex; gap: clamp(24px, 4vw, 64px); text-align: right; }

.block { display: flex; flex-direction: column; gap: 2px; }

.block .label { margin-bottom: 0; }

.mail:hover { text-decoration: underline; text-underline-offset: 4px; }

.time { font-variant-numeric: tabular-nums; }

@media (max-width: 760px) {
  .inner { 
     flex-direction: column-reverse; /* Puts the brand/credit at the bottom on mobile */
     gap: 28px;
  }
  .meta { flex-wrap: wrap; text-align: left; gap: 24px }
}
</style>