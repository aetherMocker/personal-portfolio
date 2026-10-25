<script setup>
import { onMounted, ref } from "vue";
import { formatWhen } from "../../lib/catalog";

const props = defineProps({ work: { type: Object, required: true } });
const emit = defineEmits(["open"]);

const img = ref(null);
const loaded = ref(false);
const failed = ref(false);

// Cached images can finish loading before the listener is attached.
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth) loaded.value = true;
});
</script>

<template>
  <article class="card">
    <button
      type="button"
      class="media"
      :class="{ ready: loaded || failed }"
      :aria-label="`View ${work.title}`"
      :disabled="failed || !work.thumb"
      @click="emit('open', work)"
    >
      <img
        v-if="work.thumb && !failed"
        ref="img"
        :src="work.thumb"
        :alt="`${work.title}, ${work.medium || 'artwork'}`"
        loading="lazy"
        decoding="async"
        @load="loaded = true"
        @error="failed = true"
      />
      <span v-else class="missing">
        Image not found;<br />{{ work.file || "no file listed" }}
      </span>
    </button>

    <div class="meta">
      <h3 class="title">{{ work.title }}</h3>
      <p class="mono when">{{ formatWhen(work) }}</p>
      <p class="mono medium">{{ work.medium || "Medium not listed" }}</p>
      <p class="mono size">{{ work.size }}</p>
    </div>
  </article>
</template>

<style scoped>
.card { animation: settle 0.4s ease both; }
@keyframes settle { from { opacity: 0; } }

.media {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 4 / 5; /* holds space until the real image arrives */
  background: var(--wash);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: zoom-in;
}
.media.ready { aspect-ratio: auto; }
.media img { width: 100%; height: auto; opacity: 0; transition: opacity 0.35s ease; }
.media.ready img { opacity: 1; }
.media:disabled { cursor: default; }

.missing { font-family: var(--mono); font-size: 12px; line-height: 1.6; color: var(--muted); text-align: center; padding: 1rem; }

.meta {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 16px;
  row-gap: 2px;
  padding-top: 11px;
}
.title { font-size: 14px; font-weight: 500; letter-spacing: -0.005em; line-height: 1.35; }
.mono { font-family: var(--mono); font-size: 12px; line-height: 1.6; }
.when, .size { text-align: right; white-space: nowrap; }
.medium, .size { color: var(--muted); }
</style>
