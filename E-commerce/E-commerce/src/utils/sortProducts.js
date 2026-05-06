export const sortProducts = (products, sortBy) => {
  const arr = [...products];
  switch (sortBy) {
    case 'price-asc': return arr.sort((a, b) => a.price - b.price);
    case 'price-desc': return arr.sort((a, b) => b.price - a.price);
    case 'rating': return arr.sort((a, b) => b.avgRating - a.avgRating);
    case 'newest': return arr.sort((a, b) => b.id.localeCompare(a.id));
    default: return arr;
  }
};
