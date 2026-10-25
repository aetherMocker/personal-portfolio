<script setup>
import { computed } from "vue";

defineProps({
  years: { type: Array, required: true }, // [{ value, label, count }]
  mediums: { type: Array, required: true },
  shown: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

const year = defineModel("year", { default: null });
const medium = defineModel("medium", { default: null });
const sort = defineModel("sort", { default: "newest" });

const active = computed(() => year.value !== null || medium.value !== null);
const clear = () => {
  year.value = null;
  medium.value = null;
};
</script>

<template>
  <div class="filters">
    <div class="rows">
      <div class="row">
        <span id="f-year" class="label">Year;</span>
        <div class="options" role="group" aria-labelledby="f-year">
          <button
            v-for="o in years"
            :key="o.label"
            type="button"
            class="opt"
            :aria-pressed="year === o.value"
            :disabled="o.count === 0"
            @click="year = o.value"
          >
            {{ o.label }}<sup>{{ o.count }}</sup>
          </button>
        </div>
      </div>

      <div class="row">
        <span id="f-medium" class="label">Medium;</span>
        <div class="options" role="group" aria-labelledby="f-medium">
          <button
            v-for="o in mediums"
            :key="o.label"
            type="button"
            class="opt"
            :aria-pressed="medium === o.value"
            :disabled="o.count === 0"
            @click="medium = o.value"
          >
            {{ o.label }}<sup>{{ o.count }}</sup>
          </button>
        </div>
      </div>
    </div>

    <div class="aside">
      <p class="value" aria-live="polite">
        {{ shown === total ? `${total} works` : `${shown} of ${total} works` }}
      </p>
      <div class="sort" role="group" aria-label="Sort order">
        <button type="button" class="opt" :aria-pressed="sort === 'newest'" @click="sort = 'newest'">Newest</button>
        <button type="button" class="opt" :aria-pressed="sort === 'oldest'" @click="sort = 'oldest'">Oldest</button>
      </div>
      <button type="button" class="clear" :class="{ off: !active }" :tabindex="active ? 0 : -1" :aria-hidden="!active" @click="clear">
        Clear filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters {
  position: sticky;
  top: var(--header-h);
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 40px;
  padding-block: 16px 14px;
  background: var(--paper);
  border-block: 1px solid var(--line);
}
.rows { display: grid; row-gap: 8px; min-width: 0; }
.row { display: grid; grid-template-columns: 6.5rem 1fr; align-items: baseline; min-width: 0; }
.row .label { margin: 0; }

.options, .sort { display: flex; flex-wrap: wrap; row-gap: 6px; }

/* Text options divided by hairlines; the active one is darker, heavier and underlined. */
.opt {
  padding: 2px 14px;
  border-left: 1px solid var(--line);
  font-size: 14px;
  line-height: 1.4;
  color: var(--muted);
  white-space: nowrap;
  transition: color 0.15s;
}
.options .opt:first-child, .sort .opt:first-child { padding-left: 0; border-left: 0; }
.opt:hover:not(:disabled) { color: var(--ink); }
.opt[aria-pressed="true"] {
  color: var(--ink);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 6px;
}
.opt:disabled { opacity: 0.38; }
.opt sup {
  display: inline-block;
  margin-left: 4px;
  vertical-align: top;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--muted);
}

.aside { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; text-align: right; }
.aside .value { line-height: 1.4; }
.sort .opt { font-family: var(--mono); font-size: 12px; padding-inline: 10px; }
.sort .opt:last-child { padding-right: 0; }
.clear { font-family: var(--mono); font-size: 12px; text-decoration: underline; text-underline-offset: 4px; }
.clear.off { visibility: hidden; }

@media (max-width: 899px) {
  .filters { position: static; grid-template-columns: 1fr; row-gap: 14px; }
  .row { grid-template-columns: 1fr; row-gap: 6px; }
  .options { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin-inline: calc(var(--gutter) * -1); padding-inline: var(--gutter); }
  .options::-webkit-scrollbar { display: none; }
  .aside { flex-direction: row; flex-wrap: wrap; align-items: baseline; justify-content: space-between; text-align: left; gap: 8px 20px; }
  .clear.off { display: none; }
}
</style>
