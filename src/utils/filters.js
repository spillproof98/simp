export function applyFilters(rows, searchText, genre, yearRange) {
  return rows.filter((r) => {
    const matchesSearch = searchText
      ? Object.values(r).some((v) =>
          String(v).toLowerCase().includes(searchText.toLowerCase())
        )
      : true;
    const matchesGenre = genre ? r.Genre === genre : true;
    const year = parseInt(r.PublishedYear) || 0;
    const matchesYear =
      (!yearRange[0] || year >= yearRange[0]) &&
      (!yearRange[1] || year <= yearRange[1]);
    return matchesSearch && matchesGenre && matchesYear;
  });
}
