import { createRouter, createWebHashHistory } from "vue-router";
import GalleryView from "./views/GalleryView.vue";
import AboutView from "./views/AboutView.vue";
import ContactView from "./views/ContactView.vue";
import BlogView from "./views/BlogView.vue";
import CollectionsView from "./views/CollectionsView.vue";
import CatalogView from "./views/CatalogView.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "gallery", component: GalleryView },
    { path: "/about", name: "about", component: AboutView },
    { path: "/blog", name: "blog", component: BlogView },
    { path: "/collections", name: "collections", component: CollectionsView },
    { path: "/catalog", name: "catalog", component: CatalogView },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 0, behavior: "smooth" };
    return { top: 0 };
  },
});