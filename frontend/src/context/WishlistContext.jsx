import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('rv_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rv_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [
        {
          id: product.id,
          slug: product.slug || product.id,
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images || [],
          sizes: product.sizes || ['M', 'L'],
          colors: product.colors || ['Classic'],
          badge: product.badge,
          fabric: product.fabric,
        },
        ...prev,
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const isInWishlist = useCallback(
    (id) => wishlist.some((p) => p.id === id),
    [wishlist]
  );

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
