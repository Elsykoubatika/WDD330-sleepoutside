import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, loadHeaderFooter, renderBreadcrumb, updateCartCount } from "./utils.mjs";


async function init() {
  await loadHeaderFooter();
  updateCartCount();

  const productId = getParam("product");
  const category = getParam("category") || "tents";
  const dataSource = new ProductData(category);
  const productDetails = new ProductDetails(productId, dataSource);
  await productDetails.init();
  renderBreadcrumb(productDetails.product?.Category ? productDetails.product.Category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : category);
}

init();
