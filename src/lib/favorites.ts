'use client';

/**
 * Destination favorites — localStorage-backed, no server round-trip
 * REQ-FUNC-068
 *
 * Stores a deduplicated array of destination ids under a single key.
 * SSR-safe: every function no-ops (or returns an empty result) when
 * `window`/`localStorage` is unavailable, so this module can be imported
 * from Server Components without crashing — only the interactive Card
 * markup that calls it needs to be a Client Component.
 */

const STORAGE_KEY = 'free-traveler:favorites';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readAll(): string[] {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeAll(ids: string[]): void {
  if (!isBrowser()) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable/full — favorites silently stay unsaved for this action.
  }
}

/** Returns all favorited destination ids. */
export function getFavorites(): string[] {
  return readAll();
}

/** True if the given destination id is already favorited. */
export function isFavorite(destinationId: string): boolean {
  return readAll().includes(destinationId);
}

/** Adds a destination id to favorites (no-op if already present). */
export function addFavorite(destinationId: string): string[] {
  const current = readAll();
  if (current.includes(destinationId)) {
    return current;
  }
  const next = [...current, destinationId];
  writeAll(next);
  return next;
}

/** Removes a destination id from favorites (no-op if not present). */
export function removeFavorite(destinationId: string): string[] {
  const current = readAll();
  const next = current.filter((id) => id !== destinationId);
  writeAll(next);
  return next;
}

/** Adds if absent, removes if present. Returns the new favorited state. */
export function toggleFavorite(destinationId: string): boolean {
  const current = readAll();
  const isCurrentlyFavorited = current.includes(destinationId);
  if (isCurrentlyFavorited) {
    removeFavorite(destinationId);
    return false;
  }
  addFavorite(destinationId);
  return true;
}
