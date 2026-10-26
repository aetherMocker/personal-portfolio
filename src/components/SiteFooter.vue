<script setup>
  import { site } from "../content/site";
</script>

<template>
  <footer class="footer">
    <div class="page grid">
      <p class="name">{{ site.name }}</p>
      <p class="value"><a class="mail" :href="`mailto:${site.email}`">{{ site.email }}</a></p>
      <p class="value time">{{ site.location }}</p>
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
