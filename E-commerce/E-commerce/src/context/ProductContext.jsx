import { createContext, useContext, useState, useEffect } from 'react';

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const addProduct = async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')?.replace(/"/g, '')}` },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const newP = await res.json();
        setProducts((prev) => [...prev, newP]);
      }
    } catch (e) { console.error('Add product failed', e); }
  };

  const updateProduct = async (id, updates) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')?.replace(/"/g, '')}` },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const upP = await res.json();
        setProducts((prev) => prev.map((p) => p.id === id || p.slug === id ? { ...p, ...upP } : p));
      }
    } catch (e) { console.error('Update product failed', e); }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')?.replace(/"/g, '')}` }
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
      }
    } catch (e) { console.error('Delete product failed', e); }
  };

  const addReview = async (productId, review) => {
    try {
      const res = await fetch(`/api/products/${productId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')?.replace(/"/g, '')}` },
        body: JSON.stringify({ rating: review.score })
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => p.id === productId || p.slug === productId ? updated : p));
      }
    } catch (e) { console.error('Review failed', e); }
  };

  const getProduct = (id) => products.find((p) => p.id === id || p.slug === id);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
