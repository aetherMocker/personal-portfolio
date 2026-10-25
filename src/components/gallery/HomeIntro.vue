<script setup>
  import { computed } from "vue";
  import { site } from "../../content/site";
  import { formatWhen, sortWorks } from "../../lib/catalog";

  const props = defineProps({ works: { type: Array, required: true } }); // newest first
  const emit = defineEmits(["open"]);

  const latest = computed(() => props.works.slice(0, 5));
  // Most recent work (year, then month) that has an image to show.
  const featured = computed(() => sortWorks(props.works, "newest").find((w) => w.thumb || w.image));
</script>

<template>
  <section class="intro page" aria-label="Introduction">
    <div class="cols">
      <div>
        <p class="label">Studio;</p>
        <p class="value">{{ site.name }}<br />{{ site.location }}<br />{{ site.availability }}</p>
      </div>

      <div>
        <p class="label">Latest work;</p>
        <ul class="value latest">
          <li v-for="w in latest" :key="w.id">
            <button type="button" @click="emit('open', w)">→ {{ w.title }} ({{ formatWhen(w) }})</button>
          </li>
        </ul>
      </div>

      <div v-if="featured" class="feature">
        <button type="button" class="thumb" :aria-label="`View ${featured.title}`" @click="emit('open', featured)">
          <img :src="featured.thumb || featured.image" :alt="featured.title" />
        </button>
        <div>
          <p class="label">Featured;</p>
          <p class="value">{{ featured.title }}<br />{{ featured.medium }}</p>
        </div>
      </div>
    </div>

    <div class="statement">
      <p>{{ site.statement }}</p>
      <RouterLink class="link" :to="{ path: '/', hash: '#works' }">View works ↓</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.intro { padding-top: clamp(36px, 7vh, 84px); }
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); align-items: start; }
.latest button { text-align: left; }
.latest button:hover { text-decoration: underline; text-underline-offset: 4px; }

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
  max-width: clamp(120px, 12vw, 180px);
  max-height: 240px;
}

.statement { margin-top: clamp(64px, 14vh, 140px); margin-bottom: clamp(72px, 16vh, 180px); max-width: 34ch; }
.statement p { font-size: clamp(22px, 2.3vw, 32px); line-height: 1.22; letter-spacing: -0.018em; }
.statement .link { margin-top: 26px; font-size: 18px; }

@media (max-width: 899px) {
  .cols { grid-template-columns: 1fr 1fr; row-gap: 32px; }
  .feature { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .cols { grid-template-columns: 1fr; }
}
</style>
