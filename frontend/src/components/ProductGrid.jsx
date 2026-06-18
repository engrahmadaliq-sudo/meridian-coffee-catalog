import React from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, loading, onOpen, onAddToCart, onClearFilters }) {
  if (loading) {
    return <div className="result-count">Loading beans…</div>;
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h3>No beans match those filters</h3>
        <p>Try a different origin, roast level, or search term.</p>
        <button onClick={onClearFilters}>Reset filters</button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onOpen={onOpen} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
