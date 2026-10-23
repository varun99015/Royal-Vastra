import { useEffect, useState, useCallback } from 'react';
import { fetchProducts } from '../services/products.js';

export function useProductList(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProducts(params);
      setProducts(res.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, refetch: loadProducts };
}
