
// Retourne le premier élément correspondant au sélecteur.
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Récupère une valeur depuis localStorage.
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


// Enregistre une valeur dans localStorage.
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  const element = qs(selector);

  if (!element) {
    return;
  }

  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });

  element.addEventListener("click", callback);
}


export function getParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (!parentElement) {
    return;
  }

  const htmlStrings = list.map(template);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(
    position,
    htmlStrings.join("")
  );
}

export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
) {
  if (!parentElement) {
    return;
  }

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Impossible de charger ${path} : ${response.status}`
    );
  }

  return response.text();
}


export async function loadHeaderFooter() {
  /*
   * import.meta.url permet de construire un chemin fiable
   * à partir de utils.mjs.
   *
   * utils.mjs se trouve dans :
   * src/js/utils.mjs
   *
   * Les partials se trouvent dans :
   * src/partials/
   */
  const headerUrl = new URL(
    "../partials/header.html",
    import.meta.url
  );

  const footerUrl = new URL(
    "../partials/footer.html",
    import.meta.url
  );

  const headerTemplate = await loadTemplate(headerUrl);
  const footerTemplate = await loadTemplate(footerUrl);

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

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
  const cartItems = getLocalStorage("so-cart");
  const cart = document.querySelector(".cart");

  if (!cart) {
    return;
  }

  let countElement = cart.querySelector(".cart-count");

  if (!countElement) {
    countElement = document.createElement("sup");
    countElement.className = "cart-count";

    const cartLink = cart.querySelector("a");

    if (cartLink) {
      cartLink.appendChild(countElement);
    }
  }

  // Ignore les éléments null ou invalides du panier.
  const count = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => {
        if (!item || typeof item !== "object") {
          return total;
        }

        const quantity = Number(item.Quantity || 1);

        return total + (
          Number.isFinite(quantity) && quantity > 0
            ? quantity
            : 1
        );
      }, 0)
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

  if (!breadcrumb || !text) {
    return;
  }

  breadcrumb.innerHTML = `
    <nav aria-label="Breadcrumb">
      <a href="/src/index.html">Home</a>
      <span aria-hidden="true"> → </span>
      <span>${text}</span>
    </nav>
  `;
}


export function getResponsiveImage(image, alt = "") {
  if (!image) {
    return "";
  }

  /*
   * Exemple :
   * photo~320.jpg
   *
   * devient :
   * photo~640.jpg
   *
   * IMPORTANT :
   * l'ancienne regex :
   *
   * /\~320(?=**\.**[^.]+$)/
   *
   * était invalide.
   */
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
