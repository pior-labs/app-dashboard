import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LayoutGrid } from "lucide-react";
import { useLayout } from "@/hooks/useLayout";
import { cn } from "@/lib/utils";

/**
 * Layout picker, styled to match ThemeDropdown. Lets you swap the whole start
 * page between registered layouts; the choice is persisted in localStorage.
 */
export function LayoutDropdown({ className }: { className?: string }) {
  const { layout, setLayout, layouts } = useLayout();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = layouts.find((l) => l.id === layout) ?? layouts[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm font-medium text-card-foreground shadow-sketch-xs backdrop-blur transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <LayoutGrid className="size-4 opacity-70" aria-hidden="true" />
        <span className="hidden sm:inline">{active.name}</span>
        <ChevronDown
          className={cn("size-4 opacity-60 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="theme-glass absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-sketch border border-border bg-card/95 p-1.5 shadow-sketch"
        >
          <div className="px-2.5 pb-1.5 pt-1 font-serif text-[11px] italic tracking-wide text-muted-foreground">
            Layout
          </div>
          {layouts.map((option) => {
            const isActive = option.id === layout;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setLayout(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-sketch-sm px-2.5 py-2 text-left transition-colors",
                  isActive ? "bg-primary-soft" : "hover:bg-primary-soft/60",
                )}
              >
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate text-[13px] text-card-foreground">{option.name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{option.hint}</span>
                </span>
                {isActive && <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
