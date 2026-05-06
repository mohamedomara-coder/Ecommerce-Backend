import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateOrderId } from '../utils/generateOrderId';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useLocalStorage('shoplux_orders', []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token')?.replace(/"/g, '');
    if (token && token !== 'null') {
      fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => Array.isArray(data) && setOrders(data))
        .catch(console.error);
    }
  }, []);

  const placeOrder = async (cartItems, user, shipping, payment) => {
    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrder = {
      items: cartItems.map((i) => ({ productId: i.id || i.slug, qty: i.qty })),
      shippingAddress: shipping,
    };
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')?.replace(/"/g, '')}` },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const created = await res.json();
        setOrders((prev) => [created, ...prev]);
        return created;
      }
    } catch(e) {
      console.error('Failed to place order:', e);
    }
    return newOrder;
  };

  const getOrdersByUser = (userId) => orders.filter((o) => o.userId === userId);

  const getOrder = (id) => orders.find((o) => o.id === id);

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrdersByUser, getOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
