function convertToJson(res) {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function normalizeProducts(data) {
  if (Array.isArray(data)) return data;
  return data?.products || data?.Result || data?.results || [];
}

// Action: use the category search and product-by-ID API endpoints, with local JSON as a development fallback.
// This class is an ES module so the same data logic can be reused by listings and product details.
export default class ProductData {
  constructor(category = "tents") {
    this.category = category;
    this.api = (import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");
  }

  async searchProducts(searchTerm) {
    try {
      const response = await fetch(`${this.api}/products/search/${encodeURIComponent(searchTerm)}`);
      return normalizeProducts(await convertToJson(response));
    } catch (error) {
    
      // Action: if the API is unavailable, search all local category files so the search page still works.
      const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
      const results = [];
      for (const category of categories) {
        try {
          const response = await fetch(`/json/${category}.json`);
          const products = normalizeProducts(await convertToJson(response));
          results.push(...products.map((product) => ({ ...product, Category: product.Category || category })));
        } catch {
          // Ignore missing local fallback files.
        }
      }
      const term = String(searchTerm).toLowerCase();
      return results.filter((product) => `${product.Name || ""} ${product.Brand?.Name || ""}`.toLowerCase().includes(term));
    }
  }

  async getData() {
    try {
      const response = await fetch(`${this.api}/products/search/${encodeURIComponent(this.category)}`);
      return normalizeProducts(await convertToJson(response));
    } catch (error) {
      // Keep the project usable offline during development/assignment testing.
      const response = await fetch(`/json/${this.category}.json`);
      return normalizeProducts(await convertToJson(response));
    }
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${this.api}/product/${encodeURIComponent(id)}`);
      return await convertToJson(response);
    } catch (error) {
      const products = await this.getData();
      return products.find((item) => String(item.Id) === String(id));
    }
  }
}
