"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: number;
  title: string;
  description?: string;
}

const listeners = new Set<(toast: Toast) => void>();
let counter = 0;

export function toast(toast: Omit<Toast, "id">) {
  const withId = { ...toast, id: ++counter };
  listeners.forEach((listener) => listener(withId));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (toast: Toast) => {
      setItems((prev) => [...prev, toast]);
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== toast.id));
      }, 4000);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed right-4 top-4 z-50 space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="w-72 rounded-2xl border border-charcoal/10 bg-white/90 p-4 shadow-subtle backdrop-blur"
        >
          <p className="text-sm font-semibold text-charcoal">{item.title}</p>
          {item.description ? (
            <p className="mt-1 text-xs text-charcoal/70">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
