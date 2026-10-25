<script setup>
import { formatWhen } from "../../lib/catalog";

defineProps({ works: { type: Array, required: true } }); // newest first
const emit = defineEmits(["open"]);
</script>

<template>
  <section id="index" class="index page" aria-labelledby="index-title">
    <header class="head">
      <h2 id="index-title" class="heading">Index</h2>
      <p class="value">{{ works.length }} works, all years</p>
    </header>

    <ul>
      <li v-for="w in works" :key="w.id">
        <button type="button" class="row" @click="emit('open', w)">
          <span class="value when">{{ formatWhen(w) }}</span>
          <span class="title">{{ w.title }}</span>
          <span class="value medium">{{ w.medium }}</span>
          <span class="value size">{{ w.size }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.index { scroll-margin-top: var(--header-h); margin-top: clamp(96px, 16vh, 180px); }
.head { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 14px; border-bottom: 1px solid var(--ink); }
.heading { font-size: clamp(22px, 2vw, 28px); font-weight: 500; letter-spacing: -0.02em; line-height: 1; }

.row {
  display: grid;
  grid-template-columns: 2fr 4fr 4fr 2fr;
  column-gap: var(--gap);
  align-items: baseline;
  width: 100%;
  padding-block: 14px;
  border-bottom: 1px solid var(--line);
}
.title { font-weight: 500; transition: transform 0.2s ease; }
.row:hover .title { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; }
.medium { color: var(--muted); }
.size { text-align: right; color: var(--muted); }

@media (max-width: 760px) {
  .row { grid-template-columns: 5.5rem 1fr; row-gap: 2px; }
  .medium { grid-column: 2; }
  .size { display: none; }
}
</style>
