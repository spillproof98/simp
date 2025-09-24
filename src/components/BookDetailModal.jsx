import React from "react";
import { motion } from "framer-motion";

export default function BookDetailModal({ book, onClose }) {
  if (!book) return null;
  return (
    <motion.div className="modalOverlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modalContent" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <button className="closeBtn" onClick={onClose}>✖</button>
        <h2>{book.Title}</h2>
        <p><strong>Author:</strong> {book.Author}</p>
        <p><strong>Genre:</strong> {book.Genre}</p>
        <p><strong>Year:</strong> {book.PublishedYear}</p>
        <p><strong>ISBN:</strong> {book.ISBN}</p>
      </motion.div>
    </motion.div>
  );
}
