<script setup>
import { computed } from "vue";
import { site } from "../content/site";
import { resolveSrc } from "../lib/catalog";
import { useCatalog } from "../composables/useCatalog";

const { works, boot } = useCatalog();
boot();

// Facts come from the catalog itself, so they never go stale.
const facts = computed(() => {
  const years = works.value.map((w) => w.year).filter(Boolean);
  const media = new Set(works.value.flatMap((w) => w.mediums));
  const span = years.length ? (Math.min(...years) === Math.max(...years) ? `${years[0]}` : `${Math.min(...years)}–${Math.max(...years)}`) : "—";
  return [
    { label: "Works catalogued", value: String(works.value.length) },
    { label: "Years", value: span },
    { label: "Media", value: String(media.size) },
  ];
});
</script>

<template>
  <div class="page about">
    <h1 class="heading">{{ site.about.heading }}</h1>

    <div class="cols">
      <figure class="portrait">
        <img :src="resolveSrc(site.about.portrait)" :alt="site.about.portraitAlt" width="600" height="800" />
      </figure>

      <div class="bio">
        <p class="label">Practice;</p>
        <p v-for="p in site.about.paragraphs" :key="p" class="text">{{ p }}</p>
        <div class="actions">
          <RouterLink class="link" to="/contact">Get in touch</RouterLink>
          <RouterLink class="link" :to="{ path: '/', hash: '#works' }">View works</RouterLink>
        </div>
      </div>

      <aside class="side" aria-label="Approach and facts">
        <p class="label">Approach;</p>
        <ul>
          <li v-for="item in site.about.approach" :key="item.title" class="item">
            <h2 class="item-title">{{ item.title }}</h2>
            <p class="item-text">{{ item.text }}</p>
          </li>
        </ul>

        <p class="label facts-label">In the catalog;</p>
        <dl>
          <div v-for="f in facts" :key="f.label" class="fact">
            <dt class="value">{{ f.label }}</dt>
            <dd class="value">{{ f.value }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.about { padding-top: clamp(40px, 8vh, 96px); }
.heading { max-width: 16ch; font-size: clamp(34px, 5vw, 72px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; }

.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); margin-top: clamp(48px, 9vh, 104px); align-items: start; }
.portrait img { width: 100%; height: auto; aspect-ratio: 3 / 4; object-fit: cover; border-radius: var(--radius); background: var(--wash); }

/* Hairline dividers between the three columns, as in a printed page. */
.bio, .side { border-left: 1px solid var(--line); padding-left: clamp(16px, 2.4vw, 36px); min-height: 100%; }
.bio .text { max-width: 46ch; font-size: 16px; line-height: 1.6; }
.bio .text + .text { margin-top: 1.1em; }
.actions { display: flex; gap: 28px; margin-top: 40px; }

.item { padding-block: 16px; border-top: 1px solid var(--line); }
.item:last-child { border-bottom: 1px solid var(--line); }
.item-title { font-size: 15px; font-weight: 500; letter-spacing: -0.005em; }
.item-text { margin-top: 4px; color: var(--muted); font-size: 14px; line-height: 1.55; }

.facts-label { margin-top: 44px; }
.fact { display: flex; justify-content: space-between; padding-block: 10px; border-top: 1px solid var(--line); }
.fact:last-child { border-bottom: 1px solid var(--line); }

@media (max-width: 899px) {
  .cols { grid-template-columns: 1fr 1fr; row-gap: 48px; }
  .portrait { grid-column: 1 / -1; max-width: 420px; }
  .bio { border-left: 0; padding-left: 0; }
}
@media (max-width: 599px) {
  .cols { grid-template-columns: 1fr; }
  .side { border-left: 0; padding-left: 0; }
}
</style>
