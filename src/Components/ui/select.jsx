"use client";

import { useState } from "react";

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="border rounded-lg p-2 cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        {value || "Select..."}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-md w-full">
          {children &&
            children.map((child, index) =>
              child.type === SelectItem
                ? React.cloneElement(child, {
                    key: index,
                    onSelect: (val) => {
                      onValueChange(val);
                      setOpen(false);
                    },
                  })
                : child
            )}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({ children }) {
  return <div>{children}</div>;
}
export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}
export function SelectContent({ children }) {
  return <div>{children}</div>;
}
export function SelectItem({ value, children, onSelect }) {
  return (
    <div
      className="p-2 hover:bg-blue-50 cursor-pointer"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}
