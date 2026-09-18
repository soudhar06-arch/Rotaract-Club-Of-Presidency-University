"use client";

import { useState, useEffect, useCallback } from "react";

export function usePersistedState<T>(
  key: string,
  initialValue: T,
  storageType: "local" | "session" = "local"
): [T, (value: T | ((prev: T) => T)) => void] {
  const getStorage = useCallback(() => {
    if (typeof window === "undefined") return null;
    return storageType === "session" ? window.sessionStorage : window.localStorage;
  }, [storageType]);

  // ALWAYS initialize with initialValue so SSR and initial client render match 100%
  const [state, setState] = useState<T>(initialValue);

  // Read saved value from storage ONLY AFTER initial client hydration mount
  useEffect(() => {
    let handle: number | undefined;
    try {
      const storage = getStorage();
      const item = storage?.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as T;
        if (parsed !== undefined && parsed !== null) {
          handle = requestAnimationFrame(() => {
            setState(parsed);
          });
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return () => {
      if (handle !== undefined) cancelAnimationFrame(handle);
    };
  }, [key, getStorage]);

  // Persist state updates to storage
  useEffect(() => {
    try {
      const storage = getStorage();
      if (storage) {
        storage.setItem(key, JSON.stringify(state));
      }
    } catch (e) {
      console.warn(`[usePersistedState] Could not save key "${key}" to storage`, e);
    }
  }, [key, state, getStorage]);

  return [state, setState];
}
