function convertToJson(res) {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function normalizeProducts(data) {
  if (Array.isArray(data)) return data;
  return data?.products || data?.Result || data?.results || [];
}

function normalizeProduct(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] || null;
  return data.product || data.Product || data.result || data.Result || data;
}

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

    // Action: try the API first, then fall back to the local category JSON if the API is unavailable or returns no usable product.
    try {
      const response = await fetch(`${this.api}/product/${encodeURIComponent(id)}`);
      const product = normalizeProduct(await convertToJson(response));
      if (product && String(product.Id) === String(id)) return product;
    } catch (error) {
      // The local JSON fallback below keeps the assignment usable during API/network problems.
    }

    const categories = [this.category, "tents", "backpacks", "sleeping-bags", "hammocks"];
    const checked = new Set();
    for (const category of categories) {
      if (checked.has(category)) continue;
      checked.add(category);
      try {
        const response = await fetch(`/json/${category}.json`);
        const products = normalizeProducts(await convertToJson(response));
        const found = products.find((item) => String(item.Id) === String(id));
        if (found) return { ...found, Category: found.Category || category };
      } catch (error) {
        // Continue searching the remaining local categories.
      }
    }
    return null;
  }
}
