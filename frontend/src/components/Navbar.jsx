import React from "react";

export default function Navbar({ cartCount, onCartClick }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="wordmark">
          Meridian<span>.</span>
        </div>
        <div className="nav-meta">Direct-trade · Roasted weekly · Shipped Tuesdays</div>
        <button className="cart-button" onClick={onCartClick} aria-label="Open cart">
          Cart
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
