<script setup>
    import { ref, watch } from "vue";
    import { useRouter } from "vue-router";
    import CatalogManager from "../components/CatalogManager.vue";

    // Reachable only by URL (/#/catalog). Not linked from the site.
    // Closing the manager (its own Close button, or Escape) routes back home.
    const router = useRouter();
    const open = ref(true);

    watch(open, (now) => {
    if (!now) router.push({ name: "gallery" });
    });
</script>

<template>
  <CatalogManager v-model:open="open" />
</template>