// Everything that turns a spreadsheet row into an artwork record lives here.
const BASE = import.meta.env.BASE_URL;

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Medium filter groups.
 * The "medium" column is free text ("Pigment and oil on linen"), so the filter
 * buckets it by keyword. A work can belong to several groups. Edit this list to
 * match the materials you actually use; anything unmatched falls under "Other".
 */
export const MEDIUM_GROUPS = [
  { label: "Oil", match: /\boil\b/i },
  { label: "Cold wax", match: /\bwax\b/i },
  { label: "Acrylic", match: /acrylic/i },
  { label: "Casein & tempera", match: /casein|tempera/i },
  { label: "Watercolor", match: /water\s?colou?r|gouache/i },
  { label: "Graphite & charcoal", match: /graphite|charcoal|pencil/i },
  { label: "Ink", match: /\bink\b/i },
  { label: "Mixed media", match: /mixed media/i },
];

export function mediumGroupsFor(medium) {
  const text = String(medium || "").trim();
  if (!text) return [];
  const hits = MEDIUM_GROUPS.filter((g) => g.match.test(text)).map((g) => g.label);
  return hits.length ? hits : ["Other"];
}

/** Display order for filter options: configured groups first, "Other" last. */
export const MEDIUM_ORDER = [...MEDIUM_GROUPS.map((g) => g.label), "Other"];

/** "collections" column: "[Spring Collection], [Landscape]" or "Spring, Landscape". */
export function parseCollections(v) {
  const s = clean(v);
  if (!s) return [];
  const bracketed = s.match(/\[([^\]]+)\]/g);
  const names = bracketed ? bracketed.map((m) => m.slice(1, -1)) : s.split(",");
  return [...new Set(names.map((n) => clean(n).replace(/\s+/g, " ")).filter(Boolean))];
}

// ---------------------------------------------------------------- parsing

const clean = (v) => String(v ?? "").trim();
const lowerKeys = (row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v]));

function pick(row, ...keys) {
  for (const key of keys) {
    const v = row[key];
    if (v !== undefined && clean(v) !== "") return v;
  }
  return "";
}

function monthNum(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  if (Number.isInteger(n)) return n >= 1 && n <= 12 ? n : null;
  const i = MONTHS.findIndex((m) => m.toLowerCase() === clean(v).slice(0, 3).toLowerCase());
  return i === -1 ? null : i + 1;
}

// Shift by 12h so timezone drift in spreadsheet dates can't tip into the wrong month.
function ymFromDate(d, utc = false) {
  const t = new Date(d.getTime() + 12 * 3600 * 1000);
  return utc
    ? { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1 }
    : { year: t.getFullYear(), month: t.getMonth() + 1 };
}

const NONE = { year: null, month: null };

function parseLoose(v) {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return ymFromDate(v);
  if (typeof v === "number") {
    if (v >= 1800 && v <= 2200) return { year: Math.trunc(v), month: null };
    if (v > 20000 && v < 80000) return ymFromDate(new Date(Math.round((v - 25569) * 86400000)), true); // Excel serial
    return NONE;
  }
  const s = clean(v);
  let m;
  if (!s) return NONE;
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.]\d{1,2})?$/))) return { year: +m[1], month: monthNum(m[2]) };
  if ((m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) return { year: +m[3], month: monthNum(+m[1] <= 12 ? m[1] : m[2]) };
  if ((m = s.match(/^(\d{1,2})[-/.](\d{4})$/))) return { year: +m[2], month: monthNum(m[1]) };
  if ((m = s.match(/([A-Za-z]{3,})\.?,?\s+(\d{4})/))) return { year: +m[2], month: monthNum(m[1]) };
  if ((m = s.match(/(\d{4})/))) return { year: +m[1], month: null };
  return NONE;
}

function parseWhen(row) {
  let { year, month } = parseLoose(pick(row, "year", "logged year"));
  if (!year) ({ year, month } = parseLoose(pick(row, "date", "created", "made", "completed")));
  const explicit = monthNum(pick(row, "month"));
  if (explicit) month = explicit;
  return { year: year || null, month: year ? month || null : null };
}

/** "file" may be a bare filename (looked up in /images) or a path / URL. */
export function resolveSrc(file) {
  const f = clean(file);
  if (!f) return "";
  if (/^(https?:|data:|blob:|\/)/i.test(f)) return f;
  const path = f.replace(/^\.\//, "");
  return path.includes("/") ? BASE + path : `${BASE}images/${path}`;
}

function sizeFrom(row) {
  const size = clean(pick(row, "size", "dimensions"));
  if (size) return size;
  const w = clean(pick(row, "width", "w"));
  const h = clean(pick(row, "height", "h"));
  if (!w || !h) return "";
  const unit = clean(pick(row, "unit", "units")) || "in";
  return `${w} × ${h} ${unit}`;
}

export function normalizeRow(rawRow, index) {
  const row = lowerKeys(rawRow);
  const file = clean(pick(row, "file", "filename", "file name", "image", "image file", "location", "path", "url"));
  const thumbFile = clean(pick(row, "thumb", "thumbnail"));
  const { year, month } = parseWhen(row);
  const medium = clean(pick(row, "medium", "materials"));
  return {
    id: `work-${index}`,
    order: index,
    title: clean(pick(row, "title", "name", "artwork", "work")) || `Untitled ${index + 1}`,
    year,
    month,
    when: year ? year * 100 + (month || 0) : 0,
    medium,
    mediums: mediumGroupsFor(medium),
    collections: parseCollections(pick(row, "collections", "collection")),
    size: sizeFrom(row),
    file,
    thumbFile,
    image: resolveSrc(file),
    thumb: resolveSrc(thumbFile || file),
    featured: /^(1|true|yes|y|x)$/i.test(clean(pick(row, "featured"))),
  };
}

/** "landscape" and "Landscape" are one collection: the first spelling seen wins. */
function unifyCollectionNames(works) {
  const canon = new Map();
  for (const w of works) for (const n of w.collections) if (!canon.has(n.toLowerCase())) canon.set(n.toLowerCase(), n);
  return works.map((w) => ({ ...w, collections: [...new Set(w.collections.map((n) => canon.get(n.toLowerCase())))] }));
}

export async function parseSheet(buffer) {
  const XLSX = await import("xlsx"); // loaded on demand, keeps the first paint light
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  // codepage 65001 = UTF-8, so CSVs keep characters like ×
  const book = XLSX.read(bytes, { type: "array", cellDates: true, codepage: 65001 });
  const rows = XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: "" });
  return unifyCollectionNames(rows.filter((r) => Object.values(r).some((v) => clean(v) !== "")).map(normalizeRow));
}

/** Looks for public/catalog.xlsx, then public/catalog.csv. Returns null if neither exists. */
export async function loadCatalog() {
  for (const name of ["catalog.xlsx", "catalog.csv"]) {
    try {
      const res = await fetch(BASE + name, { cache: "no-cache" });
      const type = res.headers.get("content-type") || "";
      if (!res.ok || type.includes("text/html")) continue; // dev servers answer unknown paths with index.html
      return await parseSheet(await res.arrayBuffer());
    } catch {
      /* try the next name */
    }
  }
  return null;
}

// ---------------------------------------------------------------- display

export function formatWhen(work) {
  if (!work.year) return "Undated";
  return work.month ? `${MONTHS[work.month - 1]} ${work.year}` : String(work.year);
}

export const yearKey = (work) => (work.year ? String(work.year) : "Undated");

export function sortWorks(list, direction = "newest", collection = null) {
  const scoped = collection ? list.filter((w) => (w.collections || []).includes(collection)) : list;
  const sign = direction === "newest" ? -1 : 1;
  return [...scoped].sort((a, b) => {
    if (!a.year !== !b.year) return a.year ? -1 : 1; // undated always last
    return (a.when - b.when) * sign || a.order - b.order;
  });
}

/** Sorted list of unique collection names with work counts. */
export function uniqueCollections(works) {
  const counts = new Map();
  for (const w of works) for (const name of w.collections || []) counts.set(name, (counts.get(name) || 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Groups an already-sorted list by year, keeping order. */
export function groupByYear(sorted) {
  const groups = new Map();
  for (const work of sorted) {
    const key = yearKey(work);
    if (!groups.has(key)) groups.set(key, { key, label: key, works: [] });
    groups.get(key).works.push(work);
  }
  return [...groups.values()];
}

// ---------------------------------------------------------------- sample + template

const SAMPLE = [
  ["01", "Held Light", 2024, 3, "Pigment and oil on linen", "48 × 72 in"],
  ["02", "After the Tide", 2023, 9, "Oil and cold wax on panel", "60 × 40 in"],
  ["03", "Near Distance", 2024, 6, "Graphite, ink and gesso", "36 × 48 in"],
  ["04", "Understory", 2022, 11, "Oil on raw canvas", "54 × 36 in"],
  ["05", "A Quiet Measure", 2024, 10, "Mixed media on linen", "42 × 60 in"],
  ["06", "Threshold No. 3", 2023, 2, "Oil and marble dust", "72 × 44 in"],
  ["07", "Soft Geometry", 2024, 1, "Casein on wood", "40 × 40 in"],
  ["08", "Blue Hours", 2022, 5, "Oil on linen", "36 × 54 in"],
  ["09", "Fault Line", 2023, 7, "Charcoal and pigment", "48 × 60 in"],
];

export const SAMPLE_ROWS = SAMPLE.map(([n, title, year, month, medium, size]) => ({
  file: `tooplate-exhibit-${n}.jpg`,
  thumb: `thumb-exhibit-${n}.jpg`,
  title,
  year,
  month,
  medium,
  size,
}));

export const sampleWorks = () => SAMPLE_ROWS.map(normalizeRow);

export const TEMPLATE_CSV =
  'file,title,year,month,medium,size,collections\n' +
  'my-artwork.jpg,Untitled No. 1,2025,3,Oil on canvas,40 × 60 in,"[Spring Collection], [Landscape]"\n';