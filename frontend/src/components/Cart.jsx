import React, { useState } from "react";

export default function Cart({ items, onClose, onRemove, onUpdateQty, onCheckout, placing }) {
  const [name, setName] = useState("");
  const total = items.reduce((sum, item) => sum + item.product.price_usd * item.qty, 0);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-header">
          <h2 style={{ fontSize: "1.2rem" }}>Your cart</h2>
          <button className="modal-close" style={{ position: "static" }} onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart">Your cart is empty. Add a bag to get started.</div>
          ) : (
            items.map((item) => (
              <div className="drawer-item" key={item.product.id}>
                <div>
                  <div className="drawer-item-name">{item.product.name}</div>
                  <div className="drawer-item-sub">
                    {item.qty} × ${item.product.price_usd.toFixed(2)}
                  </div>
                  <button className="remove-link" onClick={() => onRemove(item.product.id)}>
                    Remove
                  </button>
                </div>
                <div className="qty-stepper">
                  <button onClick={() => onUpdateQty(item.product.id, Math.max(1, item.qty - 1))}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-total">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <input
              className="checkout-input"
              placeholder="Name for the order"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="checkout-button"
              disabled={placing}
              onClick={() => onCheckout(name)}
            >
              {placing ? "Placing order…" : "Place order"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
