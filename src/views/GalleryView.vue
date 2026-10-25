<script setup>
import { computed, ref, watch } from "vue";
import { useCatalog } from "../composables/useCatalog";
import { useColumns } from "../composables/useColumns";
import { groupByYear, MEDIUM_ORDER, sortWorks, yearKey } from "../lib/catalog";
import HomeIntro from "../components/gallery/HomeIntro.vue";
import FilterBar from "../components/gallery/FilterBar.vue";
import YearGroup from "../components/gallery/YearGroup.vue";
import WorkIndex from "../components/gallery/WorkIndex.vue";
import Lightbox from "../components/gallery/Lightbox.vue";

const { works, source, boot } = useCatalog();
boot();
const columns = useColumns();

const year = ref(null);
const medium = ref(null);
const sort = ref("newest");

const newestFirst = computed(() => sortWorks(works.value, "newest"));
const sorted = computed(() => sortWorks(works.value, sort.value));

const matches = (w, y, m) => (y === null || yearKey(w) === y) && (m === null || w.mediums.includes(m));
const visible = computed(() => sorted.value.filter((w) => matches(w, year.value, medium.value)));
const groups = computed(() => groupByYear(visible.value));

// Counts are faceted: each filter shows how many works it would give with the other one applied.
const yearOptions = computed(() => {
  const keys = [...new Set(sorted.value.map(yearKey))];
  return [
    { value: null, label: "All", count: works.value.filter((w) => matches(w, null, medium.value)).length },
    ...keys.map((k) => ({ value: k, label: k, count: works.value.filter((w) => matches(w, k, medium.value)).length })),
  ];
});
const mediumOptions = computed(() => {
  const present = new Set(works.value.flatMap((w) => w.mediums));
  return [
    { value: null, label: "All", count: works.value.filter((w) => matches(w, year.value, null)).length },
    ...MEDIUM_ORDER.filter((m) => present.has(m)).map((m) => ({
      value: m,
      label: m,
      count: works.value.filter((w) => matches(w, year.value, m)).length,
    })),
  ];
});

// If the catalog changes (new import), drop filters that no longer exist.
watch(works, () => {
  if (year.value !== null && !yearOptions.value.some((o) => o.value === year.value)) year.value = null;
  if (medium.value !== null && !mediumOptions.value.some((o) => o.value === medium.value)) medium.value = null;
});

// Lightbox steps through whichever list it was opened from.
const openId = ref(null);
const lightboxList = ref([]);
function open(work, list) {
  lightboxList.value = list;
  openId.value = work.id;
}
const clearFilters = () => {
  year.value = null;
  medium.value = null;
};
</script>

<template>
  <HomeIntro :works="newestFirst" @open="(w) => open(w, newestFirst)" />

  <section id="works" class="works page" aria-label="Works">
    <FilterBar
      v-model:year="year"
      v-model:medium="medium"
      v-model:sort="sort"
      :years="yearOptions"
      :mediums="mediumOptions"
      :shown="visible.length"
      :total="works.length"
    />

    <p v-if="source === 'loading'" class="value notice">Loading catalog…</p>

    <template v-else-if="groups.length">
      <YearGroup v-for="g in groups" :key="g.key" :group="g" :columns="columns" @open="(w) => open(w, visible)" />
    </template>

    <div v-else class="notice empty">
      <p v-if="works.length">No works match these filters.</p>
      <p v-else>No works yet. Add <span class="value">catalog.xlsx</span> to the public folder, or open Catalog to import one.</p>
      <button v-if="works.length" type="button" class="link" @click="clearFilters">Clear filters</button>
    </div>
  </section>

  <WorkIndex :works="newestFirst" @open="(w) => open(w, newestFirst)" />

  <Lightbox v-model:id="openId" :works="lightboxList" />
</template>

<style scoped>
.works { scroll-margin-top: var(--header-h); }
.notice { padding-block: 72px; }
.empty { font-size: 20px; letter-spacing: -0.01em; display: grid; gap: 16px; justify-items: start; }
</style>
