// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}



// Action: read the product/category identifier from the URL query string.
// get a parameter from the URL query string
export function getParam (param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}


export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}


export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  // if clear is true we need to clear out the contents of the parent.
  if (callback) {
     callback(data);
  }
}

// 
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}



// Action: add a superscript counter to the backpack/cart icon and hide it when empty.
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cart = document.querySelector(".cart");
  if (!cart) return;

  let countElement = cart.querySelector(".cart-count");
  if (!countElement) {
    countElement = document.createElement("sup");
    countElement.className = "cart-count";
    cart.querySelector("a").appendChild(countElement);
  }
  // Action: count the actual requested units, not just the number of unique product rows.
  const count = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + Number(item.Quantity || 1), 0)
    : 0;
  countElement.textContent = count;
  countElement.classList.toggle("hide", count === 0);
}



// Action: create the breadcrumb below the navbar on listing and product pages.
export function renderBreadcrumb(text) {
  const breadcrumb = document.querySelector("#breadcrumb");
  if (!breadcrumb || !text) return;
  breadcrumb.innerHTML = `<nav aria-label="Breadcrumb"><a href="/index.html">Home</a> <span aria-hidden="true">-&gt;</span> <span>${text}</span></nav>`;
}


// Action: provide a larger image candidate on wider screens when the source naming convention supports it.
export function getResponsiveImage(image) {
  if (!image) return "";
  const large = image.replace(/~320(?=\.[^.]+$)/, "~640");
  return `<picture><source media="(min-width: 700px)" srcset="${large}"><img src="${image}" alt=""></picture>`;
}
