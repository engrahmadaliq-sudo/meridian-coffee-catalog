import React from "react";
import { BagIcon, RoastGauge } from "./RoastGauge.jsx";

export default function ProductCard({ product, onOpen, onAddToCart }) {
  return (
    <div className="product-card" role="button" tabIndex={0} onClick={() => onOpen(product)}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(product) : null)}>
      <div className="card-top">
        <BagIcon level={product.roast_level} />
        <div className="card-heading">
          <div className="card-origin">
            {product.origin_country} · {product.region}
          </div>
          <div className="card-name">{product.name}</div>
        </div>
        {product.limited && <span className="limited-badge">Limited</span>}
      </div>

      <div className="notes-row">
        {product.tasting_notes.slice(0, 3).map((note) => (
          <span className="note-pill" key={note}>
            {note}
          </span>
        ))}
      </div>

      <RoastGauge level={product.roast_level} label={product.roast_label} />

      <div className="card-footer">
        <div>
          <span className="price">${product.price_usd.toFixed(2)}</span>
          <span className="price-unit">/ {product.weight_g}g</span>
        </div>
        <button
          className="add-button"
          disabled={!product.in_stock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, 1);
          }}
        >
          {product.in_stock ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
