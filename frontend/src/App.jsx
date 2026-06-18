import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import ProductModal from "./components/ProductModal.jsx";
import Cart from "./components/Cart.jsx";
import Toast from "./components/Toast.jsx";
import { getMeta, getProducts, placeOrder } from "./api.js";

const EMPTY_FILTERS = { origin: "", roast: "", process: "", search: "" };

export default function App() {
  const [meta, setMeta] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // [{ product, qty }]
  const [toast, setToast] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Load filter metadata once
  useEffect(() => {
    getMeta().then(setMeta).catch(() => setError("Could not load filters."));
  }, []);

  // Load products whenever filters change (debounced for search)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getProducts(filters)
        .then((data) => {
          setProducts(data);
          setError("");
        })
        .catch(() => setError("Could not reach the catalog API. Is the backend running?"))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const spotlight = useMemo(
    () => products.find((p) => p.limited) || products[0],
    [products]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(product, qty) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { product, qty }];
    });
    setToast(`Added ${product.name} to cart`);
  }

  function updateQty(productId, qty) {
    setCartItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, qty } : item)));
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  async function handleCheckout(customerName) {
    setPlacing(true);
    try {
      const order = await placeOrder({
        customer_name: customerName,
        items: cartItems.map((item) => ({ product_id: item.product.id, qty: item.qty })),
      });
      setCartItems([]);
      setCartOpen(false);
      setToast(`Order #${order.id} placed — $${order.total_usd.toFixed(2)}`);
    } catch (err) {
      setToast(err.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <Hero spotlight={spotlight} />
      <FilterBar
        meta={meta}
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        resultCount={products.length}
      />

      <section className="catalog">
        <div className="container">
          {error && <div className="result-count" style={{ color: "var(--clay-dark)" }}>{error}</div>}
          <ProductGrid
            products={products}
            loading={loading}
            onOpen={setSelectedProduct}
            onAddToCart={addToCart}
            onClearFilters={() => setFilters(EMPTY_FILTERS)}
          />
        </div>
      </section>

      <footer className="site-footer">Meridian Coffee Co. — built as a Jenkins + Docker demo project</footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />

      {cartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
          onCheckout={handleCheckout}
          placing={placing}
        />
      )}

      <Toast message={toast} />
    </>
  );
}
