<script setup>
import { computed } from "vue";
import { site } from "../../content/site";
import { sortWorks, uniqueCollections } from "../../lib/catalog";

const props = defineProps({
  works: { type: Array, required: true },     // newest first
  selected: { type: String, default: null },  // active collection name
});
const emit = defineEmits(["select", "open"]);

const collections = computed(() => uniqueCollections(props.works));
const featured = computed(() => sortWorks(props.works, "newest").find((w) => w.thumb || w.image));

function toggle(name) {
  emit("select", props.selected === name ? null : name);
}
</script>

<template>
  <section class="intro page" aria-label="Collections">
    <div class="cols">
      <div class="lead">
        <p class="statement">{{ site.statement }}</p>
        <RouterLink class="link more" :to="{ path: '/', hash: '#works' }">All works ↓</RouterLink>

        <p class="label label-tight">Collections;</p>
        <ul v-if="collections.length" class="collections">
          <li v-for="c in collections" :key="c.name">
            <button
              type="button"
              class="collection"
              :aria-pressed="selected === c.name"
              @click="toggle(c.name)"
            >
              <span class="name">{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </button>
          </li>
        </ul>
        <p v-else class="value empty">
          No collections yet. Add a <code>collections</code> column to the sheet — formatted like
          <code>[Spring Collection], [Landscape]</code>.
        </p>
      </div>

      <div v-if="featured" class="feature">
        <button
          type="button"
          class="thumb"
          :aria-label="`View ${featured.title}`"
          @click="emit('open', featured)"
        >
          <img :src="featured.thumb || featured.image" :alt="featured.title" />
        </button>
        <div>
          <p class="label">Recent;</p>
          <p class="value">{{ featured.title }}<br />{{ featured.medium }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro { padding-top: clamp(36px, 7vh, 84px); padding-bottom: clamp(40px, 8vh, 96px); }
.cols {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: var(--gap);
  align-items: start;
}

.statement {
  max-width: 24ch;
  font-family: var(--display, var(--sans));
  font-size: clamp(28px, 2.8vw, 42px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0;
}
.more { display: inline-block; margin-top: 22px; font-size: 18px; }
.label-tight { margin-top: 48px; margin-bottom: 12px; }

.collections { display: grid; }
.collection {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  padding: 14px 0;
  border-top: 1px solid var(--line);
  font-size: clamp(18px, 1.6vw, 22px);
  letter-spacing: -0.01em;
  transition: color 0.15s;
}
.collection:last-child { border-bottom: 1px solid var(--line); }
.collection:hover { color: var(--focus); }
.collection[aria-pressed="true"] .name {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
}
.count {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.empty { max-width: 36ch; font-size: 14px; color: var(--muted); }
.empty code { font-family: var(--mono); font-size: 12px; }

.feature { display: flex; gap: 16px; align-items: flex-start; }
.thumb {
  flex: none;
  display: block;
  border-radius: 10px;
  overflow: hidden;
  background: var(--wash);
  cursor: zoom-in;
  line-height: 0;
}
.thumb img {
  display: block;
  width: auto;
  height: auto;
  max-width: clamp(140px, 14vw, 220px);
  max-height: 280px;
}

@media (max-width: 899px) {
  .cols { grid-template-columns: 1fr; row-gap: 32px; }
  .statement { max-width: 22ch; }
  .feature { order: -1; }
}
</style>