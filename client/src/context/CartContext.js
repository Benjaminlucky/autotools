"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on page load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity) => {
    // FIX: Use _id instead of id to match MongoDB schema
    const productId = product._id || product.id;
    const existingItem = cart.find(
      (item) => (item._id || item.id) === productId
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Ensure the product has _id when added to cart
      setCart([...cart, { ...product, _id: productId, quantity }]);
    }
  };

  const removeFromCart = (id) => {
    // FIX: Handle both _id and id
    setCart(cart.filter((item) => (item._id || item.id) !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
