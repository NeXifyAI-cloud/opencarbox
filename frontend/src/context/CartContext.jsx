import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    let id = localStorage.getItem('Carvantooo_session');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('Carvantooo_session', id);
    }
    return id;
  });

  useEffect(() => {
    fetchCart();
  }, [sessionId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart`, {
        headers: { 'X-Session-ID': sessionId }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Warenkorb laden fehlgeschlagen:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await axios.post(`${API}/cart/items`, 
        { product_id: productId, quantity },
        { headers: { 'X-Session-ID': sessionId } }
      );
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Fehler beim Hinzufügen' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      await axios.put(`${API}/cart/items/${productId}`,
        { quantity },
        { headers: { 'X-Session-ID': sessionId } }
      );
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`${API}/cart/items/${productId}`, {
        headers: { 'X-Session-ID': sessionId }
      });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API}/cart`, {
        headers: { 'X-Session-ID': sessionId }
      });
      setCart({ items: [], total: 0, item_count: 0 });
    } catch (error) {
      console.error('Warenkorb leeren fehlgeschlagen:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post(`${API}/cart/coupon?code=${code}`, null, {
        headers: { 'X-Session-ID': sessionId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Gutschein ungültig' 
      };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      sessionId,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart muss innerhalb eines CartProvider verwendet werden');
  }
  return context;
};
