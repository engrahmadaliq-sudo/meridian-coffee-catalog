import React from "react";

export default function Hero({ spotlight }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="hero-eyebrow">Lot-traced · Single origin</span>
          <h1>Coffee traced to the farm, roasted to the week.</h1>
          <p>
            We work directly with ten growing regions, paying above fair-trade price floors,
            and roast every order within seven days of shipping. Every bag lists the farm,
            the process, and the week it was roasted.
          </p>
        </div>
        {spotlight && (
          <div className="hero-spotlight">
            <span className="spotlight-label">This week's spotlight</span>
            <div className="spotlight-name">{spotlight.name}</div>
            <div className="spotlight-detail">
              {spotlight.region}, {spotlight.origin_country} · {spotlight.farm}
            </div>
            <div className="spotlight-notes">
              {spotlight.tasting_notes.map((note) => (
                <span className="note-pill" key={note} style={{ background: "rgba(255,253,249,0.14)", color: "#fffdf9" }}>
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
