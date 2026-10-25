import { ref } from "vue";

// Shared column count for the gallery and its year headers. Listeners attach once.
const columns = ref(3);
let ready = false;

function init() {
  if (ready) return;
  ready = true;
  const wide = window.matchMedia("(min-width: 1000px)");
  const mid = window.matchMedia("(min-width: 600px)");
  const update = () => (columns.value = wide.matches ? 3 : mid.matches ? 2 : 1);
  wide.addEventListener("change", update);
  mid.addEventListener("change", update);
  update();
}

export function useColumns() {
  init();
  return columns;
}
