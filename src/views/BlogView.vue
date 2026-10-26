<script setup>
import { computed } from "vue";
import { blog } from "../content/blog";
import BlogPost from "../components/blog/BlogPost.vue";

// Newest first, whatever order the entries were added in.
const posts = computed(() => [...blog.posts].sort((a, b) => String(b.date).localeCompare(String(a.date))));
</script>

<template>
  <div class="page blog">
    <h1 class="heading">{{ blog.heading }}</h1>

    <div v-if="posts.length" class="list">
      <BlogPost v-for="p in posts" :key="p.id || `${p.date}-${p.title}`" :post="p" />
    </div>
    <p v-else class="empty">No posts yet. Add one in <span class="value">src/content/blog.js</span>.</p>
  </div>
</template>

<style scoped>
.blog { padding-top: clamp(40px, 8vh, 96px); }
.heading { max-width: 18ch; font-size: clamp(34px, 5vw, 72px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; }
.list { margin-top: clamp(48px, 9vh, 104px); border-top: 1px solid var(--ink); }
.empty { margin-top: 56px; font-size: 20px; letter-spacing: -0.01em; }
</style>