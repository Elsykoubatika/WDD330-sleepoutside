function convertToJson(response) {
  if (!response.ok) {
    throw new Error(
      `Impossible de charger le fichier JSON : ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}


export default class ExternalServices {
  constructor(category = "tents") {
    this.category = category;

    /*
     * Vite utilise src/ comme root.
     *
     * Depuis /product_pages/
     * ../json/tents.json devient :
     *
     * /json/tents.json
     */
    this.path = `../json/${this.category}.json`;
  }

  async getData() {
    console.log("Chargement :", this.path);

    const response = await fetch(this.path);

    const data = await convertToJson(response);

    /*
     * Certains fichiers JSON (ex. tents.json) sont directement
     * un tableau, tandis que d'autres (ex. backpacks.json,
     * sleeping-bags.json) enveloppent le tableau dans une
     * propriété "Result".
     */
    const products = Array.isArray(data) ? data : data.Result;

    if (!Array.isArray(products)) {
      throw new Error(
        `${this.path} ne contient pas un tableau de produits.`
      );
    }

    console.log(
      `${products.length} produits chargés depuis ${this.path}`
    );

    return products;
  }

  async findProductById(id) {
    const products = await this.getData();

    const product = products.find(
      (item) =>
        String(item.Id).toLowerCase() ===
        String(id).toLowerCase()
    );

    console.log(
      "Produit recherché :",
      id,
      "→",
      product
    );

    return product;
  }

  async searchProducts(searchTerm) {
    const products = await this.getData();
    const term = String(searchTerm).toLowerCase();

    const results = products.filter((product) => {
      const name = `${product.Brand?.Name || ""} ${
        product.NameWithoutBrand || product.Name || ""
      }`;

      return name.toLowerCase().includes(term);
    });

    console.log(
      `${results.length} produit(s) trouvé(s) pour "${searchTerm}"`
    );

    return results;
  }
}
