import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    productList.innerHTML = "";
    cartFooter.classList.add("hide");
    updateCartCount(0);
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice || 0),
    0,
  );

  document.querySelector(".cart-total").innerHTML = `Total: $${total.toFixed(2)}`;
  cartFooter.classList.remove("hide");
  updateCartCount(cartItems.length);
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
  <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${Number(item.FinalPrice || 0).toFixed(2)}</p>
</li>`;
}

function updateCartCount(count) {
  const cart = document.querySelector(".cart");
  if (!cart) return;

  let countElement = cart.querySelector(".cart-count");

  if (!countElement) {
    countElement = document.createElement("sup");
    countElement.className = "cart-count";
    cart.querySelector("a").appendChild(countElement);
  }

  countElement.textContent = count;
  countElement.classList.toggle("hide", count === 0);
}

renderCartContents();
