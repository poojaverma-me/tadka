"use client";

import { useSyncExternalStore } from "react";

/** Saved dishes live in localStorage on this device; no account needed. */
const KEY = "tadka-saved";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

function write(ids: string[]) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {}
  listeners.forEach((l) => l());
}

const EMPTY: string[] = [];

export function useSaved() {
  const ids = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
  const toggle = (id: string) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]);
  return { ids, has: (id: string) => ids.includes(id), toggle };
}
