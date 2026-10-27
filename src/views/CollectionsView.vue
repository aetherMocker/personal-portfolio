<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useCatalog } from "../composables/useCatalog";
import { useColumns } from "../composables/useColumns";
import { groupByYear, MEDIUM_ORDER, sortWorks, uniqueCollections, yearKey } from "../lib/catalog";
import CollectionsList from "../components/gallery/CollectionsList.vue";
import FilterBar from "../components/gallery/FilterBar.vue";
import YearGroup from "../components/gallery/YearGroup.vue";
import WorkIndex from "../components/gallery/WorkIndex.vue";
import Lightbox from "../components/gallery/Lightbox.vue";

const { works, source, boot } = useCatalog();
boot();
const columns = useColumns();

const collection = ref(null);
const year = ref(null);
const medium = ref(null);
const sort = ref("newest");

const newestFirst = computed(() => sortWorks(works.value, "newest"));
const allCollections = computed(() => uniqueCollections(works.value));

// Works inside the selected collection (or all works, for stable counts when toggling).
const scoped = computed(() =>
  collection.value ? works.value.filter((w) => w.collections.includes(collection.value)) : works.value,
);
const sorted = computed(() => sortWorks(works.value, sort.value, collection.value));

const matches = (w, y, m) => (y === null || yearKey(w) === y) && (m === null || w.mediums.includes(m));
const visible = computed(() => sorted.value.filter((w) => matches(w, year.value, medium.value)));
const groups = computed(() => groupByYear(visible.value));

const yearOptions = computed(() => {
  const keys = [...new Set(sorted.value.map(yearKey))];
  return [
    { value: null, label: "All", count: scoped.value.filter((w) => matches(w, null, medium.value)).length },
    ...keys.map((k) => ({ value: k, label: k, count: scoped.value.filter((w) => matches(w, k, medium.value)).length })),
  ];
});
const mediumOptions = computed(() => {
  const present = new Set(scoped.value.flatMap((w) => w.mediums));
  return [
    { value: null, label: "All", count: scoped.value.filter((w) => matches(w, year.value, null)).length },
    ...MEDIUM_ORDER.filter((m) => present.has(m)).map((m) => ({
      value: m,
      label: m,
      count: scoped.value.filter((w) => matches(w, year.value, m)).length,
    })),
  ];
});

// Changing collection clears the year/medium filters (they don't carry meaning across groups).
watch(collection, () => {
  year.value = null;
  medium.value = null;
});

// If the catalog changes (new import), drop any filters/selection that no longer exist.
watch(works, () => {
  if (collection.value && !allCollections.value.some((c) => c.name === collection.value)) collection.value = null;
  if (year.value !== null && !yearOptions.value.some((o) => o.value === year.value)) year.value = null;
  if (medium.value !== null && !mediumOptions.value.some((o) => o.value === medium.value)) medium.value = null;
});

const openId = ref(null);
const lightboxList = ref([]);
function open(work, list) {
  lightboxList.value = list;
  openId.value = work.id;
}

function selectCollection(name) {
  collection.value = name;
  if (name) nextTick(() => document.getElementById("works")?.scrollIntoView());
}

const clearFilters = () => {
  year.value = null;
  medium.value = null;
};
</script>

<template>
  <CollectionsList
    :works="newestFirst"
    :selected="collection"
    @select="selectCollection"
    @open="(w) => open(w, newestFirst)"
  />

  <section id="works" class="works page" aria-label="Works">
    <template v-if="collection">
      <div class="scope">
        <p class="value">Collection · <strong>{{ collection }}</strong></p>
        <button type="button" class="link" @click="collection = null">Clear</button>
      </div>

      <FilterBar
        v-model:year="year"
        v-model:medium="medium"
        v-model:sort="sort"
        :years="yearOptions"
        :mediums="mediumOptions"
        :shown="visible.length"
        :total="scoped.length"
      />

      <p v-if="source === 'loading'" class="value notice">Loading catalog…</p>

      <template v-else-if="groups.length">
        <YearGroup v-for="g in groups" :key="g.key" :group="g" :columns="columns" @open="(w) => open(w, visible)" />
      </template>

      <div v-else class="notice empty">
        <p>No works in this collection match these filters.</p>
        <button type="button" class="link" @click="clearFilters">Clear filters</button>
      </div>
    </template>

    <div v-else class="notice empty">
      <p>Pick a collection above to browse its works.</p>
    </div>
  </section>

  <WorkIndex v-if="collection && visible.length" :works="visible" @open="(w) => open(w, visible)" />

  <Lightbox v-model:id="openId" :works="lightboxList" />
</template>

<style scoped>
.works { scroll-margin-top: var(--header-h); }
.notice { padding-block: 72px; }
.empty { font-size: 20px; letter-spacing: -0.01em; display: grid; gap: 16px; justify-items: start; }
.scope {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-block: 18px 12px;
  border-top: 1px solid var(--line);
}
.scope strong { font-weight: 600; }
</style>