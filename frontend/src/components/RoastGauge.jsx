import React from "react";

const ROAST_COLORS = {
  1: "var(--roast-1)",
  2: "var(--roast-2)",
  3: "var(--roast-3)",
  4: "var(--roast-4)",
  5: "var(--roast-5)",
};

export function RoastGauge({ level, label }) {
  const pct = (level / 5) * 100;
  return (
    <div className="roast-gauge">
      <div className="roast-gauge-label">
        <span>Roast</span>
        <span>{label}</span>
      </div>
      <div className="roast-track">
        <div
          className="roast-fill"
          style={{ width: `${pct}%`, background: ROAST_COLORS[level] || ROAST_COLORS[3] }}
        />
      </div>
    </div>
  );
}

export function BagIcon({ level, size = 44 }) {
  const fill = ROAST_COLORS[level] || ROAST_COLORS[3];
  return (
    <svg
      className="bag-icon"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 14c0-4 2.5-7 11-7s11 3 11 7v18c0 5-3 9-11 9s-11-4-11-9V14z"
        fill={fill}
      />
      <path
        d="M11 14c0-4 2.5-7 11-7s11 3 11 7"
        stroke="rgba(31,24,21,0.25)"
        strokeWidth="1.2"
        fill="none"
      />
      <rect x="17" y="9" width="10" height="5" rx="1.5" fill="rgba(255,253,249,0.85)" />
      <circle cx="22" cy="24" r="1.6" fill="rgba(255,253,249,0.7)" />
    </svg>
  );
}
