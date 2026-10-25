<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { site } from "../content/site";

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
    <div class="page grid">
      <p class="name">{{ site.name }}</p>
      <p class="value"><a class="mail" :href="`mailto:${site.email}`">{{ site.email }}</a></p>
      <p class="value time" :aria-label="`Local time in ${site.location}`">
        {{ site.location.split(",")[0] }} {{ time }}
      </p>
    </div>
    <p class="page credit">Came from a Tooplate base.</p>
  </footer>
</template>

<style scoped>
.footer { margin-top: clamp(80px, 14vh, 160px); padding-block: 28px 36px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: var(--gap); align-items: baseline; }
.name { font-weight: 500; letter-spacing: -0.01em; }
.mail:hover { text-decoration: underline; text-underline-offset: 4px; }
.time { justify-self: end; font-variant-numeric: tabular-nums; }

@media (max-width: 600px) {
  .grid { grid-template-columns: 1fr; row-gap: 6px; }
  .time { justify-self: start; }
}
</style>
