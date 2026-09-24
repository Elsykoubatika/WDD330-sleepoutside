import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { getParam, loadHeaderFooter, renderBreadcrumb, updateCartCount } from "./utils.mjs";


async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const category = getParam("category");
  const search = getParam("search");
  const title = search
    ? `Search results for “${search}”`
    : (category || "tents").replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  document.querySelector(".listing-title").textContent = title;

  const dataSource = new ProductData(category || "tents");
  const listElement = document.querySelector(".product-list");
  const productList = new ProductList(title, dataSource, listElement);
  const products = search ? await dataSource.searchProducts(search) : await dataSource.getData();
  await productList.init(products);

  // Action: re-render the same products whenever the shopper changes the sort order.
  const sortSelect = document.querySelector("#sort-products");
  sortSelect?.addEventListener("change", (event) => {
    productList.renderList(productList.products, event.target.value);
  });


  // Action: show the current category/search and the number of returned products.
  const breadcrumbText = search
    ? `Search: ${search} -> (${products.length} items)`
    : `${title} -> (${products.length} items)`;
  renderBreadcrumb(breadcrumbText);

  const alertList = new Alert(document.querySelector("main"));
  await alertList.init();
}

init();
