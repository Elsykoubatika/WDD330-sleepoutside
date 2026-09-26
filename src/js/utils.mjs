
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {

  const value = localStorage.getItem(key);

  if (value === null) {
    return [];
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// Save data to localStorage.
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


// Set a listener for both touchend and click.
export function setClick(selector, callback) {

  qs(selector).addEventListener("touchend", (event) => {

    event.preventDefault();

    callback();

  });

  qs(selector).addEventListener("click", callback);
}


export function getParam(param) {

  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  return urlParams.get(param);
}


// Render a list using a template function.
export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {

  const htmlStrings = list.map(template);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(
    position,
    htmlStrings.join("")
  );
}


// Render a template into an element.
export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
) {

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}


// Load an HTML template.
export async function loadTemplate(path) {

  const res = await fetch(path);

  const template = await res.text();

  return template;
}


export async function loadHeaderFooter() {

  const headerTemplate =
    await loadTemplate("../partials/header.html");

  const footerTemplate =
    await loadTemplate("../partials/footer.html");

  const headerElement =
    document.querySelector("#main-header");

  const footerElement =
    document.querySelector("#main-footer");

  if (headerElement) {
    renderWithTemplate(
      headerTemplate,
      headerElement
    );
  }

  if (footerElement) {
    renderWithTemplate(
      footerTemplate,
      footerElement
    );
  }
}


export function updateCartCount() {

  const cartItems = getLocalStorage("so-cart") || [];

  const cart = document.querySelector(".cart");

  if (!cart) return;

  let countElement =
    cart.querySelector(".cart-count");

  if (!countElement) {

    countElement =
      document.createElement("sup");

    countElement.className =
      "cart-count";

    const cartLink =
      cart.querySelector("a");

    if (cartLink) {
      cartLink.appendChild(countElement);
    }
  }

  const count = Array.isArray(cartItems)
    ? cartItems.reduce(
        (total, item) =>
          total + Number(item.Quantity || 1),
        0
      )
    : 0;

  countElement.textContent = count;

  countElement.classList.toggle(
    "hide",
    count === 0
  );
}



export function renderBreadcrumb(text) {

  const breadcrumb =
    document.querySelector("#breadcrumb");

  if (!breadcrumb || !text) return;

  breadcrumb.innerHTML = `
    <nav aria-label="Breadcrumb">
      <a href="/index.html">Home</a>
      <span aria-hidden="true"> → </span>
      <span>${text}</span>
    </nav>
  `;
}

export function getResponsiveImage(image, alt = "") {
  if (!image) return "";

  // Convert the 320px image to the 640px version for larger screens.
  const large = image.replace(
    /~320(?=\.[^.]+$)/,
    "~640"
  );

  return `
    <picture>
      <source
        media="(min-width: 700px)"
        srcset="${large}">
      <img
        src="${image}"
        alt="${alt}">
    </picture>
  `;
}
