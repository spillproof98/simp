import React, { useState, useEffect, useMemo, useRef } from "react";
import Papa from "papaparse";

import { generateFakeBooks } from "./utils/fakeBooks";
import { applyFilters } from "./utils/filters";
import { downloadCSV } from "./utils/csvHelpers";

import InlineEditor from "./components/InlineEditor";
import SearchFilterBar from "./components/SearchFilter";
import PaginationControls from "./components/PaginationControls";
import BookDetailModal from "./components/BookDetailModal";

import { motion } from "framer-motion";
import { Upload, Download, RefreshCw, FileSpreadsheet } from "lucide-react";

const COLUMNS = ["Title", "Author", "Genre", "PublishedYear", "ISBN"];
const GENRES = [
  "Fiction","Non-Fiction","Sci-Fi","Fantasy","Romance",
  "Mystery","Biography","Self-Help","History"
];

export default function App() {
  const [originalRows, setOriginalRows] = useState(() => generateFakeBooks(10000));
  const [rows, setRows] = useState(originalRows);
  const [loading, setLoading] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [genre, setGenre] = useState("");
  const [yearRange, setYearRange] = useState(["", ""]);

  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [page, setPage] = useState(1);
  const rowsPerPage = 200;

  const editsRef = useRef(new Map());
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    setRows(originalRows);
    editsRef.current = new Map();
  }, [originalRows]);

  const filtered = useMemo(() => {
    return applyFilters(rows, filterText, genre, yearRange);
  }, [rows, filterText, genre, yearRange]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
        return Number(va) - Number(vb);
      }
      return String(va).localeCompare(String(vb));
    });
    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const pagedRows = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((r) => {
          const out = {};
          COLUMNS.forEach((c) => (out[c] = r[c] ?? ""));
          return out;
        });
        setOriginalRows(parsed);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setLoading(false);
      },
    });
  }

  function handleCellEdit(rowIndex, col, newValue) {
    const key = `${rowIndex}__${col}`;
    editsRef.current.set(key, newValue);
    setRows((prev) => {
      const copy = [...prev];
      const r = { ...copy[rowIndex] };
      r[col] = newValue;
      copy[rowIndex] = r;
      return copy;
    });
  }

  function resetAllEdits() {
    editsRef.current = new Map();
    setRows(originalRows);
  }

  function toggleSort(column) {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  }

  const Row = ({ index, style }) => {
    const row = pagedRows[index];
    const globalIndex = sorted.indexOf(row);
    return (
      <motion.div
        className={`row ${index % 2 ? "odd" : "even"}`}
        style={style}
        whileHover={{ scale: 1.01, backgroundColor: "#f0f9ff" }}
        onDoubleClick={() => setSelectedBook(row)}
      >
        {COLUMNS.map((col) => {
          const key = `${globalIndex}__${col}`;
          const edited = editsRef.current.has(key);
          return (
            <div key={col} className={`cell ${edited ? "edited" : ""}`}>
              <InlineEditor
                value={row[col]}
                onChange={(val) => handleCellEdit(globalIndex, col, val)}
              />
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="container">
      <header>
        <img src="logo.svg" alt="simp logo" className="logo" />
        <p className="muted">
          Upload, explore, edit, and export your book data.
        </p>
      </header>

      <div className="controls">
        <div className="left">
          <label className="fileUpload">
            <Upload size={16} /> Upload CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              hidden
            />
          </label>
          <button onClick={() => setOriginalRows(generateFakeBooks(10000))}>
            <FileSpreadsheet size={16} /> Generate 10k
          </button>
          <button onClick={() => downloadCSV(rows)}>
            <Download size={16} /> Download
          </button>
          <button onClick={resetAllEdits}>
            <RefreshCw size={16} /> Reset
          </button>
        </div>
      </div>

      <SearchFilterBar
        filterText={filterText}
        setFilterText={setFilterText}
        genre={genre}
        setGenre={setGenre}
        yearRange={yearRange}
        setYearRange={setYearRange}
        genres={GENRES}
      />

      <div className="tableHeader">
        {COLUMNS.map((col) => (
          <div key={col} className="headerCell" onClick={() => toggleSort(col)}>
            {col} {sortBy === col ? (sortDir === "asc" ? "▲" : "▼") : ""}
          </div>
        ))}
      </div>

      <div className="table" style={{ maxHeight: "500px", overflowY: "auto" }}>
        {loading ? (
          <div className="loading">Loading CSV...</div>
        ) : (
          pagedRows.map((row, index) => (
            <Row key={index} index={index} style={{ height: 46 }} />
          ))
        )}
      </div>

      <PaginationControls
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <footer>
        <small>Built with React, Vite, and simp components.</small>
      </footer>
    </div>
  );
}
