import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const finalPrice = Number(product.FinalPrice);
  const retailPrice = Number(product.SuggestedRetailPrice);

  const hasDiscount =
    Number.isFinite(finalPrice) &&
    Number.isFinite(retailPrice) &&
    retailPrice > 0 &&
    finalPrice < retailPrice;

  const discountBadge = hasDiscount
    ? `
      <span class="discount-badge">
        ${Math.round(
          (1 - finalPrice / retailPrice) * 100
        )}% OFF
      </span>
    `
    : "";

  return `
    <li class="product-card">
      <a
        href="/product_pages/?product=${encodeURIComponent(product.Id)}&category=${encodeURIComponent(product.Category || "tents")}"
      >
        <img
          src="${product.Image}"
          alt="${product.Name || ""}"
        />

        <h2 class="card__brand">
          ${product.Brand?.Name || ""}
        </h2>

        <h3 class="card__name">
          ${product.NameWithoutBrand || product.Name || ""}
        </h3>

        <p class="product-card__price">
          $${finalPrice.toFixed(2)}
        </p>

        ${discountBadge}
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init(products = null) {
    this.products = Array.isArray(products)
      ? products
      : await this.dataSource.getData();

    this.renderList(this.products);
  }

  renderList(list, sortOrder = "") {
    const products = Array.isArray(list) ? [...list] : [];

    const getName = (product) =>
      product.NameWithoutBrand || product.Name || "";

    const sorters = {
      "name-asc": (a, b) => getName(a).localeCompare(getName(b)),
      "name-desc": (a, b) => getName(b).localeCompare(getName(a)),
      "price-asc": (a, b) => Number(a.FinalPrice) - Number(b.FinalPrice),
      "price-desc": (a, b) => Number(b.FinalPrice) - Number(a.FinalPrice)
    };

    if (sorters[sortOrder]) {
      products.sort(sorters[sortOrder]);
    }

    this.products = products;

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      this.products,
      "afterbegin",
      true
    );
  }
}
