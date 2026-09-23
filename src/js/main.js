import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const dataSource = new ProductData("tents");

  const element = document.querySelector(".product-list");

  const productList = new ProductList("Tents", dataSource, element);

  productList.init();
}

init();
