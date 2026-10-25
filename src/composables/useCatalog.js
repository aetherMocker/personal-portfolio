import { ref } from "vue";
import { loadCatalog, parseSheet, resolveSrc, sampleWorks, TEMPLATE_CSV } from "../lib/catalog";

// One catalog for the whole app. Components call useCatalog() and share this state.
const STORAGE_KEY = "art-catalog-import";

const works = ref([]);
const source = ref("loading"); // loading | sheet | sample | imported
const message = ref("");
const blobUrls = [];
let booting = null;

function readImported() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!Array.isArray(saved) || !saved.length) return null;
    // Images are re-derived from the file column; preview blobs don't survive a reload.
    return saved.map((w) => ({ ...w, image: resolveSrc(w.file), thumb: resolveSrc(w.thumbFile || w.file) }));
  } catch {
    return null;
  }
}

function saveImported() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works.value.map(({ image, thumb, ...rest }) => rest)));
  } catch {
    /* storage full or unavailable: the import still works for this session */
  }
}

function boot() {
  if (booting) return booting;
  booting = (async () => {
    const imported = readImported();
    if (imported) {
      works.value = imported;
      source.value = "imported";
      return;
    }
    const loaded = await loadCatalog();
    if (loaded?.length) {
      works.value = loaded;
      source.value = "sheet";
    } else {
      works.value = sampleWorks();
      source.value = "sample";
    }
  })();
  return booting;
}

async function importSheet(file) {
  if (!file) return;
  try {
    const parsed = await parseSheet(await file.arrayBuffer());
    if (!parsed.length) throw new Error("empty");
    works.value = parsed;
    source.value = "imported";
    saveImported();
    message.value = `${parsed.length} records imported. Choose their image files to preview them, or place the images in public/images.`;
  } catch {
    message.value = "That file could not be read. Use .xlsx, .xls or .csv with a header row.";
  }
}

function linkImages(files) {
  const base = (p) => String(p).split(/[\\/]/).pop().toLowerCase();
  const byName = new Map(files.map((f) => [f.name.toLowerCase(), f]));
  let matched = 0;
  works.value = works.value.map((work) => {
    const file = byName.get(base(work.file));
    if (!file) return work;
    const url = URL.createObjectURL(file);
    blobUrls.push(url);
    matched += 1;
    return { ...work, image: url, thumb: url };
  });
  message.value = `${matched} of ${works.value.length} images matched by file name.`;
}

async function reset() {
  localStorage.removeItem(STORAGE_KEY);
  blobUrls.splice(0).forEach(URL.revokeObjectURL);
  booting = null;
  works.value = [];
  source.value = "loading";
  await boot();
  message.value = source.value === "sheet" ? "Showing the published catalog." : "Showing the sample works.";
}

function downloadTemplate() {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([TEMPLATE_CSV], { type: "text/csv" }));
  link.download = "catalog-template.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

export function useCatalog() {
  return { works, source, message, boot, importSheet, linkImages, reset, downloadTemplate };
}
