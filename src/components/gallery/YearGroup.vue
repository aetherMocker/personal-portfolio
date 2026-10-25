<script setup>
import { computed } from "vue";
import WorkGrid from "./WorkGrid.vue";
import { MEDIUM_ORDER } from "../../lib/catalog";

const props = defineProps({
  group: { type: Object, required: true },
  columns: { type: Number, default: 3 },
});
const emit = defineEmits(["open"]);

const media = computed(() => {
  const present = new Set(props.group.works.flatMap((w) => w.mediums));
  return MEDIUM_ORDER.filter((m) => present.has(m));
});
</script>

<template>
  <section class="group" :aria-labelledby="`year-${group.key}`">
    <header class="head">
      <h2 :id="`year-${group.key}`" class="year">{{ group.label }}</h2>
      <div>
        <p class="label">Works;</p>
        <p class="value">{{ group.works.length }}</p>
      </div>
      <div>
        <p class="label">Media;</p>
        <p class="value">{{ media.join(", ") || "Not listed" }}</p>
      </div>
    </header>
    <WorkGrid :works="group.works" :columns="columns" @open="emit('open', $event)" />
  </section>
</template>

<style scoped>
.group + .group { margin-top: clamp(72px, 12vh, 140px); }
.head {
  display: grid;
  grid-template-columns: repeat(v-bind(columns), 1fr);
  gap: var(--gap);
  align-items: start;
  padding-block: clamp(36px, 6vh, 64px) 22px;
}
.year { font-size: clamp(22px, 2vw, 28px); font-weight: 500; letter-spacing: -0.02em; line-height: 1; }

@media (max-width: 599px) {
  .head { grid-template-columns: 1fr 1fr; row-gap: 14px; }
  .year { grid-column: 1 / -1; }
}
</style>
