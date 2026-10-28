<script setup>
import { computed } from "vue";
import { site } from "../../content/site";
import { sortWorks, uniqueCollections } from "../../lib/catalog";

const props = defineProps({
  works: { type: Array, required: true }, // newest first
  selected: { type: String, default: null }, // active collection name
});
// "open" sends the work, plus the list it belongs to so the lightbox can step through that collection.
const emit = defineEmits(["select", "open"]);

const featured = computed(() => sortWorks(props.works, "newest").find((w) => w.thumb || w.image));

// One row per collection: name, count, year span, and up to three recent works to preview.
const rows = computed(() =>
  uniqueCollections(props.works).map((c) => {
    const inside = props.works.filter((w) => (w.collections || []).includes(c.name));
    const years = inside.map((w) => w.year).filter(Boolean);
    const lo = Math.min(...years);
    const hi = Math.max(...years);
    return {
      ...c,
      inside,
      previews: inside.filter((w) => w.thumb || w.image).slice(0, 3),
      span: !years.length ? "" : lo === hi ? String(lo) : `${lo}–${hi}`,
    };
  }),
);

// Clicking the active collection clears it.
function toggle(name) {
  emit("select", props.selected === name ? null : name);
}
</script>

<template>
  <section class="intro page" aria-label="Collections">
    <div class="top">
      <div class="lead">
        <p class="statement">{{ site.statement }}</p>
        <RouterLink class="link more" :to="{ path: '/', hash: '#works' }">All works ↓</RouterLink>
      </div>

      <div v-if="featured" class="feature">
        <button type="button" class="thumb" :aria-label="`View ${featured.title}`" @click="emit('open', featured)">
          <img :src="featured.thumb || featured.image" :alt="featured.title" />
        </button>
        <div>
          <p class="label">Recent;</p>
          <p class="value">{{ featured.title }}<br />{{ featured.medium }}</p>
        </div>
      </div>
    </div>

    <div class="list">
      <p id="collections-label" class="label">Collections;</p>

      <ul v-if="rows.length" class="collections" aria-labelledby="collections-label">
        <li v-for="c in rows" :key="c.name" class="row">
          <!-- The name button's ::after stretches over the whole row, so any click on the row selects.
               The thumbnails sit above it and open the lightbox instead. -->
          <button type="button" class="pick" :aria-pressed="selected === c.name" @click="toggle(c.name)">
            <span class="name">{{ c.name }}</span>
            <span class="meta">{{ c.count }} {{ c.count === 1 ? "work" : "works" }}<template v-if="c.span">, {{ c.span }}</template></span>
            <span class="cta" aria-hidden="true">{{ selected === c.name ? "Clear ×" : "View works →" }}</span>
          </button>

          <div v-if="c.previews.length" class="previews">
            <button
              v-for="w in c.previews"
              :key="w.id"
              type="button"
              class="preview"
              :aria-label="`View ${w.title}`"
              @click="emit('open', w, c.inside)"
            >
              <img :src="w.thumb || w.image" :alt="w.title" loading="lazy" decoding="async" />
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="value empty">
        No collections yet. Add a <code>collections</code> column to the sheet — formatted like
        <code>[Spring Collection], [Landscape]</code>.
      </p>
    </div>
  </section>
</template>

<style scoped>
.intro {
  --thumb-h: clamp(84px, 9.2vw, 120px); /* about twice a plain text row */
  padding-top: clamp(36px, 7vh, 84px);
  padding-bottom: clamp(40px, 8vh, 96px);
}

/* Top band: a wide statement, and a small featured piece. */
.top { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: clamp(24px, 4vw, 64px); align-items: start; }
.statement {
  max-width: 40ch;
  font-family: var(--display, var(--sans));
  font-size: clamp(28px, 2.8vw, 42px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0;
}
.more { display: inline-block; margin-top: 22px; font-size: 18px; }

.feature { display: flex; gap: 14px; align-items: flex-start; }
.thumb {
  flex: none;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: var(--wash);
  cursor: zoom-in;
  line-height: 0;
}
.thumb img { display: block; width: auto; height: auto; max-width: clamp(72px, 7vw, 104px); max-height: 150px; }

/* Collections: full-width ruled rows, name left, previews right. */
.list { margin-top: clamp(44px, 8vh, 88px); scroll-margin-top: var(--header-h);}
.label { margin-bottom: 12px; }
.collections { border-top: 3px double var(--ink); }

.row {
  position: relative; /* anchors the row-wide click area */
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: clamp(16px, 3vw, 48px);
  align-items: stretch;
  min-height: calc(var(--thumb-h) + 28px);
  padding-block: 14px;
  border-bottom: 3px double var(--line);
  cursor: pointer;
}
.row:last-child { border-bottom-color: var(--ink); }

.pick {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}
.pick::after { content: ""; position: absolute; inset: 0; } /* the stretched hit area */
.pick:focus-visible { outline: none; }
.pick:focus-visible::after { outline: 2px solid var(--focus); outline-offset: -2px; border-radius: 6px; }

.name {
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.row:hover .name,
.pick[aria-pressed="true"] .name {
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
}
.pick[aria-pressed="true"] .name { font-weight: 600; }

.meta { margin-top: 6px; font-family: var(--mono); font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.pick[aria-pressed="true"] .meta { color: var(--ink); }

/* Sits at the bottom of the row, like the "learn more" in the reference. */
.cta {
  margin-top: auto;
  padding-top: 12px;
  font-family: var(--mono);
  font-size: 12px;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Previews are natural proportions at a fixed height (no cropping), above the row's click area. */
.previews { position: relative; z-index: 1; display: flex; gap: var(--gap); align-items: flex-start; }
.preview {
  display: block;
  height: var(--thumb-h);
  min-width: calc(var(--thumb-h) * 0.7);
  border-radius: 8px;
  overflow: hidden;
  background: var(--wash);
  line-height: 0;
  cursor: zoom-in;
}
.preview img { display: block; height: 100%; width: auto; }
.preview:focus-visible { outline-offset: 2px; }

.empty { max-width: 36ch; font-size: 14px; color: var(--muted); }
.empty code { font-family: var(--mono); font-size: 12px; }

@media (max-width: 899px) {
  .top { grid-template-columns: 1fr; row-gap: 28px; }
  .statement { max-width: 28ch; }
}
@media (max-width: 640px) {
  /* name above, previews below; keep two so the row stays calm */
  .row { grid-template-columns: 1fr; row-gap: 14px; min-height: 0; }
  .cta { margin-top: 10px; padding-top: 0; }
  .preview:nth-child(n + 3) { display: none; }
}
</style>