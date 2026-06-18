import React, { useState } from "react";
import { RoastGauge, BagIcon } from "./RoastGauge.jsx";

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="card-top">
          <BagIcon level={product.roast_level} size={56} />
          <div className="card-heading">
            <div className="card-origin">
              {product.origin_country} · {product.region}
            </div>
            <h2 className="card-name" style={{ fontSize: "1.5rem" }}>
              {product.name}
            </h2>
          </div>
        </div>

        <div className="notes-row" style={{ marginTop: 14 }}>
          {product.tasting_notes.map((note) => (
            <span className="note-pill" key={note}>
              {note}
            </span>
          ))}
        </div>

        <dl className="modal-meta-grid">
          <div>
            <dt>Farm</dt>
            <dd>{product.farm}</dd>
          </div>
          <div>
            <dt>Process</dt>
            <dd style={{ textTransform: "capitalize" }}>{product.process}</dd>
          </div>
          <div>
            <dt>Altitude</dt>
            <dd>{product.altitude_m}m</dd>
          </div>
          <div>
            <dt>Bag weight</dt>
            <dd>{product.weight_g}g</dd>
          </div>
        </dl>

        <RoastGauge level={product.roast_level} label={product.roast_label} />

        <div className="qty-row">
          <div className="qty-stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button
            className="add-button"
            disabled={!product.in_stock}
            onClick={() => {
              onAddToCart(product, qty);
              onClose();
            }}
          >
            {product.in_stock ? `Add ${qty} to cart — $${(product.price_usd * qty).toFixed(2)}` : "Sold out"}
          </button>
        </div>
      </div>
    </div>
  );
}
