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
      <div class="statement">
        <p>{{ site.statement }}</p>
        <RouterLink class="link" :to="{ path: '/', hash: '#works' }">View works ↓</RouterLink>
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
  </section>
</template>

<style scoped>
.intro { padding-top: clamp(36px, 7vh, 84px); padding-bottom: clamp(72px, 16vh, 180px); }
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); align-items: start; }
.latest button { text-align: left; }
.latest button:hover { text-decoration: underline; text-underline-offset: 4px; }

/* The statement now opens the page. It uses the display face when gothic.css is loaded,
   and quietly falls back to the body font when it isn't. */
.statement { padding-right: clamp(0px, 2vw, 32px); }
.statement p {
  font-family: var(--display);
  font-size: clamp(28px, 2.8vw, 42px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0;
}
.statement .link { margin-top: 28px; font-size: 18px; }

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

@media (max-width: 899px) {
  .cols { grid-template-columns: 1fr 1fr; row-gap: 32px; }
  .statement { grid-column: 1 / -1; max-width: 22ch; padding-right: 0; }
  .feature { grid-column: 1 / -1; }
}
@media (max-width: 520px) {
  .cols { grid-template-columns: 1fr; }
}
</style>