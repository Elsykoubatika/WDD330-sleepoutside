import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
  updateCartCount
} from "./utils.mjs";


async function init() {
  await loadHeaderFooter();

  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");


  function getCart() {
    const cart = getLocalStorage("so-cart");
    return Array.isArray(cart) ? cart : [];
  }

  function cartItemTemplate(item) {

    const category = (item.Category || "tents").toLowerCase();

    return `<li class="cart-card divider">

      <button
        class="remove-cart-item"
        type="button"
        data-id="${item.Id}"
        aria-label="Remove ${item.Name} from cart">
        &times;
      </button>

      <a
        href="../product_pages/?product=${encodeURIComponent(item.Id)}&category=${encodeURIComponent(category)}"
        class="cart-card__image">

        <img
          src="${item.Image}"
          alt="${item.Name}" />

      </a>

      <a
        href="../product_pages/?product=${encodeURIComponent(item.Id)}&category=${encodeURIComponent(category)}">

        <h2 class="card__name">
          ${item.Name}
        </h2>

      </a>

      <p class="cart-card__color">
        ${item.Colors?.[0]?.ColorName || ""}
      </p>


      <!--
        PROMPT 3 - CART QUANTITY
        allow the customer to change
        the quantity of the product.
      -->
      <label
        class="cart-card__quantity"
        for="quantity-${item.Id}">

        Qty:

        <input
          id="quantity-${item.Id}"
          class="cart-quantity"
          type="number"
          min="1"
          value="${Number(item.Quantity || 1)}"
          data-id="${item.Id}" />

      </label>


      <p class="cart-card__price">
        $${(
          Number(item.FinalPrice || 0) *
          Number(item.Quantity || 1)
        ).toFixed(2)}
      </p>

    </li>`;
  }


  function renderCartContents() {
    const cartItems = getCart();

    if (cartItems.length === 0) {
      productList.innerHTML =
        "<li class=\"empty-cart\">Your cart is empty.</li>";

      cartFooter.classList.add("hide");
      updateCartCount(0);
      return;
    }

    productList.innerHTML =
      cartItems.map(cartItemTemplate).join("");

    const total = cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.FinalPrice || 0) *
        Number(item.Quantity || 1),
      0
    );

    document.querySelector(".cart-total").textContent =
      `Total: $${total.toFixed(2)}`;

    cartFooter.classList.remove("hide");

    const itemCount = cartItems.reduce(
      (count, item) =>
        count + Number(item.Quantity || 1),
      0
    );

    updateCartCount(itemCount);
  }

  function removeFromCart(id) {
    const cartItems = getCart().filter(
      (item) => String(item.Id) !== String(id)
    );

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }

  productList.addEventListener("change", (event) => {
    const quantityInput =
      event.target.closest(".cart-quantity");

    if (!quantityInput) return;

    const quantity = Math.max(
      1,
      Number.parseInt(quantityInput.value, 10) || 1
    );

    const cartItems = getCart();

    const item = cartItems.find(
      (cartItem) =>
        String(cartItem.Id) ===
        String(quantityInput.dataset.id)
    );

    if (item) {
      item.Quantity = quantity;
      setLocalStorage("so-cart", cartItems);
    }

    renderCartContents();
  });

  productList.addEventListener("click", (event) => {
    const removeButton =
      event.target.closest(".remove-cart-item");

    if (!removeButton) return;

    removeFromCart(removeButton.dataset.id);
  });

  renderCartContents();
}

init();
