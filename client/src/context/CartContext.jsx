import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_KEY = 'helfy_cart';

// Server cart item -> unified UI shape.
const fromServer = (i) => ({
  id: i.id,
  productId: i.productId,
  quantity: i.quantity,
  name: i.productName,
  price: i.productPrice,
  image: i.primaryImage,
  slug: i.productSlug,
});

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadServer = useCallback(async () => {
    setLoading(true);
    try {
      const d = await cartApi.get();
      setItems(d.items.map(fromServer));
    } finally {
      setLoading(false);
    }
  }, []);

  // React to auth changes: merge a guest cart into the server cart on login.
  useEffect(() => {
    let active = true;
    (async () => {
      if (user) {
        const raw = localStorage.getItem(GUEST_KEY);
        const guest = raw ? JSON.parse(raw) : [];
        for (const g of guest) {
          try { await cartApi.addItem(g.productId, g.quantity); } catch { /* ignore */ }
        }
        localStorage.removeItem(GUEST_KEY);
        if (active) await loadServer();
      } else {
        const raw = localStorage.getItem(GUEST_KEY);
        if (active) setItems(raw ? JSON.parse(raw) : []);
      }
    })();
    return () => { active = false; };
  }, [user, loadServer]);

  // Persist the guest cart whenever it changes (guests only).
  useEffect(() => {
    if (!user) localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  }, [items, user]);

  const add = useCallback(async (product, qty = 1) => {
    if (user) {
      const d = await cartApi.addItem(product.id, qty);
      setItems(d.items.map(fromServer));
    } else {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, {
          productId: product.id,
          quantity: qty,
          name: product.name,
          price: product.price,
          image: product.primaryImage ?? product.imageUrl ?? (product.images?.[0]?.url ?? null),
          slug: product.slug,
        }];
      });
    }
  }, [user]);

  const update = useCallback(async (item, qty) => {
    if (qty < 1) return;
    if (user) {
      const d = await cartApi.updateItem(item.id, qty);
      setItems(d.items.map(fromServer));
    } else {
      setItems((prev) => prev.map((i) => (i.productId === item.productId ? { ...i, quantity: qty } : i)));
    }
  }, [user]);

  const remove = useCallback(async (item) => {
    if (user) {
      const d = await cartApi.removeItem(item.id);
      setItems(d.items.map(fromServer));
    } else {
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
    }
  }, [user]);

  const clear = useCallback(() => {
    setItems([]);
    if (!user) localStorage.removeItem(GUEST_KEY);
  }, [user]);

  const { count, subtotal } = useMemo(() => {
    const cents = items.reduce((c, i) => c + Math.round(i.price * 100) * i.quantity, 0);
    return {
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: cents / 100,
    };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, count, subtotal, loading, add, update, remove, clear, reload: loadServer }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
