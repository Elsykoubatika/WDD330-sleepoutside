import { getLocalStorage, setLocalStorage, updateCartCount, getResponsiveImage } from "./utils.mjs";


// Action: show an OFF badge when FinalPrice is below SuggestedRetailPrice.
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      document.querySelector(".product-detail").innerHTML =
        "<h2>Product not found</h2><p>We could not find that product.</p>";
      return;
    }

    this.product.Category = this.product.Category || this.dataSource.category;
    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }


  // Action: safely add the selected product to the cart and update the cart counter.
  addProductToCart() {
    const cartItems = getLocalStorage("so-cart");
    const cart = Array.isArray(cartItems) ? cartItems : [];

    // Action: if the product already exists, increment Quantity instead of creating another cart entry.
    const existing = cart.find((item) => String(item.Id) === String(this.product.Id));
    if (existing) {
      existing.Quantity = Number(existing.Quantity || 1) + 1;
    } else {
      cart.push({ ...this.product, Quantity: 1 });
    }
    setLocalStorage("so-cart", cart);
    updateCartCount();
  }

  renderProductDetails() {
    const product = this.product;
    const detail = document.querySelector(".product-detail");
    const discount = Number(product.FinalPrice) < Number(product.SuggestedRetailPrice)
      ? `<span class="discount-badge">${Math.round((1 - product.FinalPrice / product.SuggestedRetailPrice) * 100)}% OFF</span>`
      : "";

    detail.innerHTML = `
      <h2>${product.Brand?.Name || ""}</h2>
      <h3 class="divider">${product.NameWithoutBrand || product.Name}</h3>
      <div class="product-detail-image divider">${getResponsiveImage(product.Image).replace(`alt= " "`, `alt="${product.Name}"`)}</div>
      <p class="product-card__price">$${Number(product.FinalPrice).toFixed(2)} ${discount}</p>
      <p class="product__color">${product.Colors?.[0]?.ColorName || ""}</p>
      <div class="product__description">${product.DescriptionHtmlSimple || ""}</div>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
