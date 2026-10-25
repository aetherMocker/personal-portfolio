import { createRouter, createWebHashHistory } from "vue-router";
import GalleryView from "./views/GalleryView.vue";
import AboutView from "./views/AboutView.vue";
import ContactView from "./views/ContactView.vue";

// Hash history keeps the site working on any static host with no rewrite rules.
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "gallery", component: GalleryView },
    { path: "/about", name: "about", component: AboutView },
    { path: "/contact", name: "contact", component: ContactView },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 0, behavior: "smooth" };
    return { top: 0 };
  },
});
