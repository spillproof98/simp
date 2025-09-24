import React from "react";

export default function SearchFilterBar({
  filterText,
  setFilterText,
  genre,
  setGenre,
  yearRange,
  setYearRange,
  genres,
}) {
  return (
    <div className="searchFilterBar">
      <input
        placeholder="Search by Title, Author, ISBN"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="From Year"
        value={yearRange[0]}
        onChange={(e) => setYearRange([e.target.value, yearRange[1]])}
      />
      <input
        type="number"
        placeholder="To Year"
        value={yearRange[1]}
        onChange={(e) => setYearRange([yearRange[0], e.target.value])}
      />
    </div>
  );
}
