import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { getParam, loadHeaderFooter, updateCartCount } from "./utils.mjs";

await loadHeaderFooter();
updateCartCount();

const category = getParam("category") || "tents";
const title = category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

document.querySelector(".listing-title").textContent = title;

const dataSource = new ProductData(category);
const productList = new ProductList(title, dataSource, document.querySelector(".product-list"));
await productList.init();

const alertList = new Alert(document.querySelector("main"));
await alertList.init();
