import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { getParam, updateCartCount } from "./utils.mjs";
import ProductDetails from "./ProductDetails.mjs";

/* Initialize ProductData with the category "tents" and retrieve the product ID from the URL query string */
const dataSource = new ProductData("tents");

/* Retrieve the product ID from the URL query string using the getParam function */
const productId = getParam("product");

/* Initialize ProductDetails with the product ID and data source */
const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();

/* Function to add a product to the shopping cart in local storage */
function addProductToCart(product) {
  const storedCart = getLocalStorage("so-cart");
  const cartItems = Array.isArray(storedCart) ? storedCart : [];
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  updateCartCount();
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
