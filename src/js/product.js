import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

import {
  getParam,
  loadHeaderFooter,
  renderBreadcrumb,
  updateCartCount
} from "./utils.mjs";


async function init() {
  const detail = document.querySelector(".product-detail");

  try {
    const productId = getParam("product");

    if (!productId) {
      throw new Error(
        "Aucun paramètre 'product' n'a été trouvé dans l'URL."
      );
    }


    try {
      await loadHeaderFooter();
    } catch (headerError) {
      // Ignore the header/footer failure and keep the product page usable.
    }

    updateCartCount();

    const category = getParam("category") || "tents";
    const dataSource = new ProductData(category);

    const productDetails = new ProductDetails(productId, dataSource);
    await productDetails.init();

    if (!productDetails.product) {
      throw new Error(
        `Le produit '${productId}' n'a pas été trouvé dans ${category}.json`
      );
    }

    const breadcrumbCategory = productDetails.product.Category || category;

    const breadcrumbText = breadcrumbCategory
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

    renderBreadcrumb(
      `${breadcrumbText} → ${
        productDetails.product.NameWithoutBrand ||
        productDetails.product.Name
      }`
    );
  } catch (error) {
    if (detail) {
      detail.innerHTML = `
        <div class="product-error">
          <h2>Impossible de charger le produit</h2>

          <p>
            Une erreur s'est produite lors du chargement
            de ce produit.
          </p>

          <p>
            <strong>Erreur :</strong>
            ${error.message}
          </p>

          <p>
            <strong>Produit demandé :</strong>
            ${getParam("product") || "inconnu"}
          </p>
        </div>
      `;
    }
  }
}


init();
