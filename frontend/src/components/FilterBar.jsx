import React from "react";

export default function FilterBar({ meta, filters, onChange, onClear, resultCount }) {
  const hasFilters = filters.origin || filters.process || filters.roast || filters.search;

  return (
    <div className="filter-bar">
      <div className="container">
        <div className="filter-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, origin, or tasting note…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />

          <select
            className="filter-select"
            value={filters.origin}
            onChange={(e) => onChange({ ...filters, origin: e.target.value })}
          >
            <option value="">All origins</option>
            {meta?.origins?.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.roast}
            onChange={(e) => onChange({ ...filters, roast: e.target.value })}
          >
            <option value="">All roast levels</option>
            {meta?.roast_levels?.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.process}
            onChange={(e) => onChange({ ...filters, process: e.target.value })}
          >
            <option value="">All processes</option>
            {meta?.processes?.map((process) => (
              <option key={process} value={process}>
                {process}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button className="filter-clear" onClick={onClear}>
              Clear filters
            </button>
          )}
        </div>
        <div className="result-count">
          {resultCount} {resultCount === 1 ? "bean" : "beans"} in stock
        </div>
      </div>
    </div>
  );
}
