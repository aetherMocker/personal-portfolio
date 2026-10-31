<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { formatWhen } from "../../lib/catalog";

const props = defineProps({ works: { type: Array, default: () => [] } });
const id = defineModel("id", { default: null });

const dialog = ref(null);
const closeBtn = ref(null);
const loaded = ref(false);
const useThumb = ref(false);
const panelIndex = ref(0);
const showComposed = ref(false);
let opener = null;

const index = computed(() => props.works.findIndex((w) => w.id === id.value));
const current = computed(() => (index.value === -1 ? null : props.works[index.value]));

const src = computed(() => {
  if (!current.value) return "";
  const idx = panelIndex.value;
  const img = current.value.images?.[idx] || current.value.image;
  const th = current.value.thumbs?.[idx] || current.value.thumb || img;
  return useThumb.value ? th : img;
});

const close = () => (id.value = null);

function step(delta) {
  if (!current.value) return;
  const n = props.works.length;
  
  if (showComposed.value) {
    // In composed view, step through whole works
    id.value = props.works[(index.value + delta + n) % n].id;
  } else {
    // In single view, step through panels first, then move to next/prev work
    const numPanels = current.value.images?.length || 1;
    const nextPanel = panelIndex.value + delta;
    if (nextPanel >= 0 && nextPanel < numPanels) {
      panelIndex.value = nextPanel;
    } else {
      id.value = props.works[(index.value + delta + n) % n].id;
    }
  }
}

watch(current, (now, before) => {
  document.body.classList.toggle("no-scroll", Boolean(now));
  if (now && !before) {
    opener = document.activeElement;
    nextTick(() => closeBtn.value?.focus());
  }
  if (!now && before) opener?.focus?.();
  if (now) {
    for (const d of [-1, 1]) {
      const n = props.works[(index.value + d + props.works.length) % props.works.length];
      if (n?.image) new Image().src = n.image;
    }
  }
});

// Reset panel index and image states when the work changes
watch(id, () => {
  panelIndex.value = 0;
  loaded.value = false;
  useThumb.value = false;
});

function onKey(e) {
  if (!current.value) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "Tab" && dialog.value) {
    const items = [...dialog.value.querySelectorAll("button:not([disabled])")];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
    else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
  }
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  document.body.classList.remove("no-scroll");
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div v-if="current" ref="dialog" class="lb" role="dialog" aria-modal="true" :aria-label="current.title" @click.self="close">
        <header class="top">
          <p class="value">{{ index + 1 }} / {{ works.length }}</p>
          
          <div class="actions">
            <button
              v-if="current.images && current.images.length > 1"
              type="button"
              class="ctl"
              :aria-pressed="showComposed"
              @click="showComposed = !showComposed"
            >
              {{ showComposed ? 'View separately' : 'View together' }}
            </button>
            <button ref="closeBtn" type="button" class="ctl" @click="close">Close</button>
          </div>
        </header>

        <div class="stage" @click.self="close">
          <!-- Composed View (Multiple Panels) -->
          <div v-if="showComposed && current.images && current.images.length > 1" class="composed" :class="current.layout">
            <img
              v-for="(img, i) in current.images"
              :key="i"
              :src="img"
              :alt="`${current.title}, panel ${i + 1}`"
            />
          </div>
          
          <!-- Single View -->
          <img
            v-else-if="src"
            :key="current.id + src"
            :src="src"
            :alt="`${current.title}, ${current.medium || 'artwork'}`"
            :class="{ ready: loaded }"
            @load="loaded = true"
            @error="useThumb ? (loaded = true) : (useThumb = true)"
          />
          
          <p v-else class="value">Image not found; {{ current.file || "no file listed" }}</p>
        </div>

        <footer class="foot">
          <div class="caption">
            <h2 class="title">{{ current.title }}</h2>
            <p class="value when">{{ formatWhen(current) }}</p>
            <p class="value medium">{{ current.medium }}</p>
            <p class="value size">{{ current.size }}</p>
          </div>
          <nav class="steps" aria-label="Artwork navigation">
            <button type="button" class="ctl" @click="step(-1)">← Prev</button>
            <button type="button" class="ctl" @click="step(1)">Next →</button>
          </nav>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 14px var(--gutter) 20px;
  background: color-mix(in srgb, var(--paper) 97%, transparent);
}

.top { display: flex; justify-content: space-between; align-items: center; height: 36px; }
.actions { display: flex; gap: 24px; align-items: center; }
.ctl { font-family: var(--mono); font-size: 12px; color: var(--muted); padding: 6px 0; }
.ctl:hover, .ctl[aria-pressed="true"] { color: var(--ink); }
.ctl[aria-pressed="true"] { text-decoration: underline; text-underline-offset: 4px; }

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  min-width: 0;
  padding-block: 8px 18px;
}

.stage > img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.stage > img.ready { opacity: 1; }

/* Composed view (multiple panels) */
.composed {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}
.composed img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
}
.composed.offset {
  align-items: flex-start;
}
.composed.offset img:nth-child(2) {
  margin-top: 15%; /* Adjust this percentage to align the canvases perfectly */
}
.composed.stacked {
  flex-direction: column;
}

.foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.caption {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 40px;
  row-gap: 1px;
  width: min(100%, 560px);
}
.title { font-size: 16px; font-weight: 500; letter-spacing: -0.01em; }
.when, .size { text-align: right; white-space: nowrap; }
.medium, .size { color: var(--muted); }
.steps { display: flex; gap: 24px; }

.lb-enter-active, .lb-leave-active { transition: opacity 0.22s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .foot { flex-direction: column; align-items: stretch; gap: 14px; }
  .steps { justify-content: space-between; }
}
</style>