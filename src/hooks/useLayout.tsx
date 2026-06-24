import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LayoutId = "console" | "bento";

export interface LayoutOption {
  id: LayoutId;
  name: string;
  hint: string;
}

/**
 * Registry of selectable start-page layouts. Add an entry here (and a matching
 * component in src/layouts/index.tsx) to expose a new layout in the dropdown.
 */
export const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: "console", name: "Console", hint: "Terminal launcher" },
  { id: "bento", name: "Bento", hint: "Tile mosaic" },
];

export const DEFAULT_LAYOUT: LayoutId = "console";
const STORAGE_KEY = "homeserver-layout";

function isLayoutId(value: unknown): value is LayoutId {
  return typeof value === "string" && LAYOUT_OPTIONS.some((l) => l.id === value);
}

function readStoredLayout(): LayoutId {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLayoutId(stored)) return stored;
  } catch {
    /* localStorage unavailable - use default */
  }
  return DEFAULT_LAYOUT;
}

interface LayoutContextValue {
  layout: LayoutId;
  setLayout: (layout: LayoutId) => void;
  layouts: LayoutOption[];
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutId>(() => readStoredLayout());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, layout);
    } catch {
      /* ignore persistence failures */
    }
  }, [layout]);

  const setLayout = useCallback((next: LayoutId) => setLayoutState(next), []);

  const value = useMemo(
    () => ({ layout, setLayout, layouts: LAYOUT_OPTIONS }),
    [layout, setLayout],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used inside LayoutProvider");
  return ctx;
}
