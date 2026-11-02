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
    id.value = props.works[(index.value + delta + n) % n].id;
  } else {
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

// Reset the load state whenever the picture changes: a new work, or a new panel of the same work.
watch(id, () => (panelIndex.value = 0));
watch([id, panelIndex], () => {
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
          <div v-if="showComposed && current.images && current.images.length > 1" class="composed" :class="current.layout" :style="{ '--n': current.images.length }" @click.self="close">
            <img
              v-for="(img, i) in current.images"
              :key="i"
              :src="img"
              :alt="`${current.title}, panel ${i + 1}`"
            />
          </div>
          
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
.lb { position: fixed; inset: 0; z-index: 60; display: grid; grid-template-rows: auto 1fr auto; padding: 14px var(--gutter) 20px; background: var(--paper); }
.top { display: flex; justify-content: space-between; align-items: center; height: 36px; }
.actions { display: flex; gap: 24px; align-items: center; }
.ctl { font-family: var(--mono); font-size: 12px; color: var(--muted); padding: 6px 0; }
.ctl:hover, .ctl[aria-pressed="true"] { color: var(--ink); }
.ctl[aria-pressed="true"] { text-decoration: underline; text-underline-offset: 4px; }
.stage { display: flex; align-items: center; justify-content: center; min-height: 0; min-width: 0; padding-block: 8px 18px; }
.stage > img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; border-radius: 10px; opacity: 0; transition: opacity 0.3s ease; }
.stage > img.ready { opacity: 1; }
/* Together view. The container fills the stage so the images' percentage limits resolve against
   something real (before, they had nothing and fell back to natural size and overflowed). Each image
   is sized on its own, keeping its proportions and rounded corners, and the group is centred. */
.composed {
  --n: 2; /* panel count, set from the template */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
.composed img {
  flex: 0 1 auto;
  min-width: 0;
  min-height: 0;
  width: auto;
  height: auto;
  max-width: calc((100% - (var(--n) - 1) * 10px) / var(--n));
  max-height: 100%;
  border-radius: 10px;
}
/* Offset: panels staggered by a fixed amount (transform, so it never changes the layout). */
.composed.offset { --offset: clamp(24px, 8vh, 72px); }
.composed.offset img { max-height: calc(100% - var(--offset)); }
.composed.offset img:nth-child(odd) { transform: translateY(calc(var(--offset) / -2)); }
.composed.offset img:nth-child(even) { transform: translateY(calc(var(--offset) / 2)); }
/* Stacked: one above the other. */
.composed.stacked { flex-direction: column; }
.composed.stacked img { max-width: 100%; max-height: calc((100% - (var(--n) - 1) * 10px) / var(--n)); }
.foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; }
.caption { display: grid; grid-template-columns: max-content max-content; justify-content: start; column-gap: 32px; row-gap: 1px; max-width: 100%; }
.title { font-size: 16px; font-weight: 500; letter-spacing: -0.01em; }
.when, .size { white-space: nowrap; }
.medium, .size { color: var(--muted); }
.steps { display: flex; gap: 24px; }
.lb-enter-active, .lb-leave-active { transition: opacity 0.22s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }
@media (max-width: 600px) { .foot { flex-direction: column; align-items: stretch; gap: 14px; } .steps { justify-content: space-between; } }
</style>