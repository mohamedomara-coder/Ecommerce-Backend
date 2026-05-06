import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useLocalStorage('wishlist_items', []);

  const addToWishlist = (product) => {
    setItems((prev) => prev.find((i) => i.id === product.id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const isWishlisted = (id) => items.some((i) => i.id === id);

  const toggleWishlist = (product) => {
    isWishlisted(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
