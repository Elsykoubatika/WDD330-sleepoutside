import { loadHeaderFooter, updateCartCount } from "./utils.mjs";


async function init() {
  await loadHeaderFooter();
  updateCartCount();
}

init();
