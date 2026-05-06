export const filterProducts = (products, { category, minPrice, maxPrice, minRating, inStock, query }) => {
  return products.filter((p) => {
    if (category && p.category !== category) return false;
    if (minPrice !== undefined && p.price < minPrice) return false;
    if (maxPrice !== undefined && p.price > maxPrice) return false;
    if (minRating && p.avgRating < minRating) return false;
    if (inStock && p.stock === 0) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
};
