import {
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
  getResponsiveImage
} from "./utils.mjs";


// ProductDetails handles loading and displaying one product.
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = null;
    this.dataSource = dataSource;
  }

  async init() {
    // Get the product from ProductData.
    this.product = await this.dataSource.findProductById(this.productId);

    // Display an error message if the product does not exist.
    if (!this.product) {
      const detail = document.querySelector(".product-detail");

      if (detail) {
        detail.innerHTML = `
          <h2>Product not found</h2>
          <p>We could not find that product.</p>
        `;
      }

      return;
    }

    // Use the current category when the product does not provide one.
    this.product.Category =
      this.product.Category || this.dataSource.category;

    // Render the product on the page.
    this.renderProductDetails();

    // Find the Add to Cart button after rendering it.
    const addButton = document.getElementById("addToCart");

    if (addButton) {
      addButton.addEventListener(
        "click",
        this.addProductToCart.bind(this)
      );
    }
  }


  // Add the selected product to the shopping cart.
  // If the product already exists, increase its quantity.
  addProductToCart() {
    const cartItems = getLocalStorage("so-cart");
    const cart = Array.isArray(cartItems) ? cartItems : [];

    const existing = cart.find(
      (item) => String(item.Id) === String(this.product.Id)
    );

    if (existing) {
      // Product already exists in the cart.
      // Increase the quantity instead of creating a duplicate.
      existing.Quantity = Number(existing.Quantity || 1) + 1;
    } else {
      // Product is not in the cart yet.
      cart.push({
        ...this.product,
        Quantity: 1
      });
    }

    // Save the updated cart.
    setLocalStorage("so-cart", cart);

    // Update the cart counter in the header.
    updateCartCount();
  }


  // Render the product information.
  renderProductDetails() {
    const product = this.product;
    const detail = document.querySelector(".product-detail");

    if (!detail) {
      return;
    }

    const finalPrice = Number(product.FinalPrice);
    const retailPrice = Number(product.SuggestedRetailPrice);

    // Check whether the product is actually discounted.
    const hasDiscount =
      Number.isFinite(finalPrice) &&
      Number.isFinite(retailPrice) &&
      retailPrice > 0 &&
      finalPrice < retailPrice;

    // Create the discount badge.
    const discount = hasDiscount
      ? `<span class="discount-badge">
           ${Math.round((1 - finalPrice / retailPrice) * 100)}% OFF
         </span>`
      : "";

    // Display the original price only when there is a discount.
    const originalPrice = hasDiscount
      ? `<span class="original-price">
           $${retailPrice.toFixed(2)}
         </span>`
      : "";

    detail.innerHTML = `
      <h2>${product.Brand?.Name || ""}</h2>

      <h3 class="divider">
        ${product.NameWithoutBrand || product.Name || ""}
      </h3>

      <div class="product-detail-image divider">
        ${getResponsiveImage(
          product.Image,
          product.Name || "Product image"
        )}
      </div>

      <p class="product-card__price">
        $${finalPrice.toFixed(2)}
        ${discount}
        ${originalPrice}
      </p>

      <p class="product__color">
        ${product.Colors?.[0]?.ColorName || ""}
      </p>

      <div class="product__description">
        ${product.DescriptionHtmlSimple || ""}
      </div>

      <div class="product-detail__add">
        <button
          id="addToCart"
          data-id="${product.Id}">
          Add to Cart
        </button>
      </div>
    `;
  }
}

