<script setup>
import { computed } from "vue";
import WorkCard from "./WorkCard.vue";

const props = defineProps({
  works: { type: Array, required: true },
  columns: { type: Number, default: 3 },
});
const emit = defineEmits(["open"]);

// Deal works across columns left to right, so reading order stays chronological
// while columns pack tightly whatever the image proportions.
const lanes = computed(() =>
  Array.from({ length: props.columns }, (_, lane) => props.works.filter((_, i) => i % props.columns === lane)),
);
</script>

<template>
  <div class="grid">
    <div v-for="(lane, i) in lanes" :key="i" class="lane">
      <WorkCard v-for="work in lane" :key="work.id" :work="work" @open="emit('open', $event)" />
    </div>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(v-bind(columns), 1fr); gap: var(--gap); align-items: start; }
.lane { display: flex; flex-direction: column; gap: 38px; min-width: 0; }
</style>
