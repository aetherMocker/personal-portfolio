<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { site } from "../content/site";

const emit = defineEmits(["open-catalog"]);
const route = useRoute();
const menuOpen = ref(false);

const links = [
  { label: "Works", to: { path: "/", hash: "#works" } },
  { label: "Index", to: { path: "/", hash: "#index" } },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const isCurrent = (link) => typeof link.to === "string" && link.to === route.path;

watch(() => route.fullPath, () => (menuOpen.value = false));

function openCatalog() {
  menuOpen.value = false;
  emit("open-catalog");
}
</script>

<template>
  <header class="header">
    <div class="page bar">
      <RouterLink class="wordmark" to="/" aria-label="Mara Voss, home">{{ site.name }}</RouterLink>

      <nav class="nav" aria-label="Main">
        <RouterLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :aria-current="isCurrent(link) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button class="catalog" type="button" @click="openCatalog">Catalog</button>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "Close" : "Menu" }}
      </button>
    </div>

    <nav v-show="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Main">
      <div class="page">
        <RouterLink v-for="link in links" :key="link.label" :to="link.to">{{ link.label }}</RouterLink>
        <button type="button" @click="openCatalog">Catalog</button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(10px);
}
.bar {
  height: var(--header-h);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: var(--gap);
  align-items: center;
}
.wordmark { font-size: 17px; font-weight: 500; letter-spacing: -0.01em; justify-self: start; }
.nav { display: flex; gap: 1.6rem; font-size: 14px; }
.nav a { color: var(--muted); transition: color 0.15s; }
.nav a:hover, .nav a[aria-current="page"] { color: var(--ink); }
.nav a[aria-current="page"] { text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 1px; }
.catalog { justify-self: end; font-family: var(--mono); font-size: 12px; color: var(--muted); }
.catalog:hover { color: var(--ink); }
.menu-toggle { display: none; font-family: var(--mono); font-size: 12px; }
.mobile-nav { border-bottom: 1px solid var(--line); background: var(--paper); }
.mobile-nav .page { display: flex; flex-direction: column; gap: 18px; padding-block: 22px 26px; font-size: 20px; letter-spacing: -0.01em; }
.mobile-nav button { font-size: inherit; color: var(--muted); }

@media (max-width: 760px) {
  .bar { display: flex; justify-content: space-between; }
  .nav, .catalog { display: none; }
  .menu-toggle { display: block; }
}
@media (min-width: 761px) {
  .mobile-nav { display: none !important; }
}
</style>
