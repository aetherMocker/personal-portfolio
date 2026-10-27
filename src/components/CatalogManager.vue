<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useCatalog } from "../composables/useCatalog";

const open = defineModel("open", { default: false });
const { source, message, importSheet, linkImages, reset, downloadTemplate } = useCatalog();

const dialog = ref(null);
const closeBtn = ref(null);
let opener = null;

const close = () => (open.value = false);

const onSheet = async (e) => {
  await importSheet(e.target.files[0]);
  e.target.value = "";
};
const onImages = (e) => {
  linkImages([...e.target.files]);
  e.target.value = "";
};

watch(open, (now) => {
  document.body.classList.toggle("no-scroll", now);
  if (now) {
    opener = document.activeElement;
    nextTick(() => closeBtn.value?.focus());
  } else opener?.focus?.();
});

function onKey(e) {
  if (!open.value) return;
  if (e.key === "Escape") return close();
  if (e.key !== "Tab" || !dialog.value) return;
  const items = [...dialog.value.querySelectorAll("button:not([disabled]), input:not([disabled])")].filter(
    (el) => el.type !== "file" || el.closest("label"),
  );
  // file inputs are visually hidden; their labels receive focus via the input itself
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
  else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  document.body.classList.remove("no-scroll");
});

const sourceText = {
  loading: "Loading…",
  sheet: "Showing the published catalog (public/catalog.xlsx).",
  sample: "Showing sample works. No catalog.xlsx was found in the public folder.",
  imported: "Showing an imported catalog saved in this browser only.",
};
</script>

<template>
  <Teleport to="body">
    <Transition name="cm">
      <div v-if="open" ref="dialog" class="cm" role="dialog" aria-modal="true" aria-labelledby="cm-title">
        <div class="page inner">
          <header class="top">
            <h2 id="cm-title" class="heading">Catalog</h2>
            <button ref="closeBtn" type="button" class="close" @click="close">Close</button>
          </header>

          <p class="intro">
            How I made this catalog— A spreadsheet & image files. Images are matched through the
            <strong>file</strong> column, which can be a file name or a path.
          </p>

          <ol class="steps">
            <li>
              <h3>Get the template</h3>
              <p>Columns: file, title, year, month, medium, size, collections. Month and collections are optional.
                    Width, height and unit columns also work in place of size. Collections are one cell:
                    <code>[Spring Collection], [Landscape]</code>.</p>
              <button type="button" class="btn" @click="downloadTemplate">Download CSV</button>
            </li>
            <li>
              <h3>Import the sheet</h3>
              <p>Accepts .xlsx, .xls and .csv. The first sheet is used. Year can also be a full date.</p>
              <label class="btn">Choose spreadsheet<input class="sr-only" type="file" accept=".xlsx,.xls,.csv" @change="onSheet" /></label>
            </li>
            <li>
              <h3>Preview images</h3>
              <p>Choose several image files at once. Names must match the file column.</p>
              <label class="btn">Choose images<input class="sr-only" type="file" accept="image/*" multiple @change="onImages" /></label>
            </li>
          </ol>

          <div class="publish">
            <p class="label">To publish;</p>
            <p class="value">
              Put catalog.xlsx in the public folder and images in public/images, then rebuild. Imports here are a
              private preview in this browser; they don't change the live site.
            </p>
          </div>

          <div class="status">
            <p class="value" role="status">{{ message || sourceText[source] }}</p>
            <button v-if="source === 'imported'" type="button" class="reset" @click="reset">Back to published catalog</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cm { position: fixed; inset: 0; z-index: 70; overflow-y: auto; background: var(--paper); }
.inner { padding-block: 18px 56px; }
.top { display: flex; justify-content: space-between; align-items: baseline; min-height: 36px; }
.close { font-family: var(--mono); font-size: 12px; color: var(--muted); padding: 6px 0; }
.close:hover { color: var(--ink); }
.heading { font-size: clamp(34px, 5vw, 72px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin-top: clamp(24px, 6vh, 64px); }
.top .heading { margin: 0; font-size: 17px; letter-spacing: -0.01em; line-height: 1.5; }
.intro { max-width: 42ch; margin-top: clamp(28px, 6vh, 56px); font-size: clamp(20px, 2vw, 26px); line-height: 1.25; letter-spacing: -0.015em; }

.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); margin-top: clamp(48px, 9vh, 96px); counter-reset: step; }
.steps li { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding-top: 16px; border-top: 1px solid var(--ink); min-height: 220px; }
.steps h3 { font-size: 17px; font-weight: 500; letter-spacing: -0.01em; }
.steps h3::before { counter-increment: step; content: counter(step) ". "; color: var(--muted); font-family: var(--mono); font-weight: 400; font-size: 13px; }
.steps p { color: var(--muted); max-width: 34ch; line-height: 1.5; flex: 1; }

.publish { margin-top: 40px; max-width: 70ch; }
.status { display: flex; justify-content: space-between; align-items: baseline; gap: 20px; flex-wrap: wrap; margin-top: 40px; padding-top: 14px; border-top: 1px solid var(--line); }
.reset { font-family: var(--mono); font-size: 12px; text-decoration: underline; text-underline-offset: 4px; }

.cm-enter-active, .cm-leave-active { transition: opacity 0.22s ease; }
.cm-enter-from, .cm-leave-to { opacity: 0; }

@media (max-width: 760px) {
  .steps { grid-template-columns: 1fr; }
  .steps li { min-height: 0; padding-bottom: 20px; }
}
</style>
