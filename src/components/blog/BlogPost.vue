<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { resolveSrc } from "../../lib/catalog";

const props = defineProps({ post: { type: Object, required: true } });

const uid = useId();
const root = ref(null);
const body = ref(null);
const open = ref(false);
const overflowing = ref(false);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2026-10-18" -> "October 18, 2026"; "2026-10" -> "October 2026". Parsed by hand to avoid timezone shifts.
const dateLabel = computed(() => {
  const m = String(props.post.date || "").match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
  if (!m) return String(props.post.date || "");
  const [, year, month, day] = m;
  if (!month) return year;
  const name = MONTHS[Number(month) - 1] || "";
  return day ? `${name} ${Number(day)}, ${year}` : `${name} ${year}`;
});

// Links: write [the words](https://example.com) anywhere in a paragraph.
// Only http(s), mailto and #/internal links become links; anything else stays plain text.
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const SAFE = /^(https?:\/\/|mailto:|#)/i;

function pieces(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push(SAFE.test(m[2]) ? { text: m[1], href: m[2], external: /^https?:/i.test(m[2]) } : { text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

// Blank line = new paragraph. Single line breaks reflow, so indented template literals are fine.
// Each paragraph is a list of pieces: plain text, or text with an href.
const paragraphs = computed(() =>
  String(props.post.body || "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
    .map(pieces),
);

const images = computed(() =>
  (props.post.images || [])
    .map((img) => (typeof img === "string" ? { src: img } : img))
    .filter((img) => img && img.src)
    .map((img) => ({ ...img, src: resolveSrc(img.src) })),
);

// Show the toggle when the text is cut off, or when there are images waiting inside.
const expandable = computed(() => overflowing.value || images.value.length > 0);

function measure() {
  const el = body.value;
  if (!el || open.value) return;
  overflowing.value = el.scrollHeight > el.clientHeight + 1;
}

async function toggle() {
  open.value = !open.value;
  await nextTick();
  if (!open.value) {
    measure();
    // Collapsing a long post can leave its top above the viewport; bring it back.
    if (root.value && root.value.getBoundingClientRect().top < 0) {
      root.value.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
}

let observer;
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && body.value) {
    observer = new ResizeObserver(measure); // re-measure when the width (and so the line count) changes
    observer.observe(body.value);
  }
  document.fonts?.ready.then(measure); // web fonts change line lengths once they load
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <article ref="root" class="post" :aria-labelledby="`${uid}-title`">
    <time class="date value" :datetime="post.date">{{ dateLabel }}</time>

    <div class="main">
      <h2 :id="`${uid}-title`" class="title">{{ post.title }}</h2>

      <div :id="`${uid}-body`" ref="body" class="body" :class="{ clamped: !open, fade: !open && overflowing }">
        <p v-for="(p, i) in paragraphs" :key="i">
          <template v-for="(piece, j) in p" :key="j"
            ><a
              v-if="piece.href"
              :href="piece.href"
              :target="piece.external ? '_blank' : undefined"
              :rel="piece.external ? 'noopener noreferrer' : undefined"
              >{{ piece.text }}</a
            ><template v-else>{{ piece.text }}</template></template
          >
        </p>
      </div>

      <div v-if="open && images.length" class="media" :class="{ single: images.length === 1 }">
        <figure v-for="(img, i) in images" :key="img.src">
          <img :src="img.src" :alt="img.alt || `${post.title}, image ${i + 1}`" loading="lazy" decoding="async" />
          <figcaption v-if="img.caption" class="value">{{ img.caption }}</figcaption>
        </figure>
      </div>

      <button v-if="expandable" type="button" class="toggle" :aria-expanded="open" :aria-controls="`${uid}-body`" @click="toggle">
        {{ open ? "Show less ↑" : "Read more ↓" }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.post {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: var(--gap);
  padding-block: 34px 40px;
  border-bottom: 1px solid var(--line);
  scroll-margin-top: calc(var(--header-h) + 16px);
}
.date { grid-column: 1; padding-top: 0.65rem; font-variant-numeric: tabular-nums; }
.main { grid-column: 2 / span 2; min-width: 0; }

/* Bold, section-header style title. Uses the display face when gothic.css is loaded. */
.title {
  font-family: var(--display);
  font-size: clamp(24px, 2.3vw, 34px);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: 0;
  max-width: 28ch;
}

.body { margin-top: 14px; max-width: 62ch; font-size: 16px; line-height: 1.65; }
.body p + p { margin-top: 1em; }
.body a { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.body a:hover { opacity: 0.6; }
/* Collapsed: about five lines tall, fading out where the text is cut. */
.body.clamped { max-height: calc(1.65em * 5); overflow: hidden; }
.body.fade {
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 1.8em), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 1.8em), transparent);
}

.media { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--gap); margin-top: 24px; align-items: start; }
.media.single { grid-template-columns: minmax(0, 1fr); max-width: 62ch; }
.media img { width: 100%; height: auto; border-radius: var(--radius); background: var(--wash); }
.media figcaption { margin-top: 8px; color: var(--muted); }

.toggle {
  margin-top: 16px;
  font-family: var(--mono);
  font-size: 12px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.toggle:hover { opacity: 0.6; }

@media (max-width: 760px) {
  .post { grid-template-columns: 1fr; row-gap: 10px; }
  .date, .main { grid-column: 1; }
  .date { padding-top: 0; }
  .media { grid-template-columns: 1fr; }
}
</style>