import React, { useState, useEffect } from "react";

export default function InlineEditor({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]);

  return (
    <div className="inlineEditor" onDoubleClick={() => setEditing(true)}>
      {editing ? (
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onChange(val);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(false);
              onChange(val);
            }
          }}
          autoFocus
        />
      ) : (
        <span>{val}</span>
      )}
    </div>
  );
}
