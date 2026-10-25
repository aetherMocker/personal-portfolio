<script setup>
import { ref } from "vue";
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import CatalogManager from "./components/CatalogManager.vue";

const catalogOpen = ref(false);
const main = ref(null);
const focusMain = () => main.value?.focus();
</script>

<template>
  <a class="skip" href="#" @click.prevent="focusMain">Skip to content</a>
  <SiteHeader @open-catalog="catalogOpen = true" />
  <main id="main" ref="main" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter />
  <CatalogManager v-model:open="catalogOpen" />
</template>

<style>
#main:focus { outline: none; }
</style>
