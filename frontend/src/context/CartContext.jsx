import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateOrderTotals } from '../utils/helpers.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('rv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('rv_coupon') || '';
  });

  useEffect(() => {
    localStorage.setItem('rv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('rv_coupon', couponCode);
    } else {
      localStorage.removeItem('rv_coupon');
    }
  }, [couponCode]);

  const addToCart = useCallback((product, size, color, quantity = 1) => {
    const selectedSize = size || (product.sizes?.[0] || 'M');
    const selectedColor = color || (product.colors?.[0] || 'Classic');
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize && item.color === selectedColor
      );

      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug || product.id,
          name: product.name,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80',
          size: selectedSize,
          color: selectedColor,
          quantity: qty,
          price: product.price,
          originalPrice: product.originalPrice,
          category: product.category,
        },
      ];
    });

    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode('');
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totals = calculateOrderTotals(cart, couponCode);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    totals,
    couponCode,
    setCouponCode,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
