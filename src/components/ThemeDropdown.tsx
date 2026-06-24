import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useTheme } from "@finlens/theme";
import { cn } from "@/lib/utils";

/**
 * Theme picker as a real dropdown (not a binary toggle) so it scales as more
 * themes are added to @finlens/theme. Closes on outside-click and Escape.
 */
export function ThemeDropdown({ className }: { className?: string }) {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = themes.find((t) => t.id === theme) ?? themes[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
        <Palette className="size-4 opacity-70" aria-hidden="true" />
        <Swatch swatch={active.swatch} />
        <span className="hidden sm:inline">{active.name}</span>
        <ChevronDown
          className={cn("size-4 opacity-60 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="bloom-glass absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-sketch border border-border bg-card/95 p-1.5 shadow-sketch"
        >
          <div className="px-2.5 pb-1.5 pt-1 font-serif text-[11px] italic tracking-wide text-muted-foreground">
            Theme
          </div>
          {themes.map((option) => {
            const isActive = option.id === theme;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setTheme(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-sketch-sm px-2.5 py-2 text-left transition-colors",
                  isActive ? "bg-primary-soft" : "hover:bg-primary-soft/60",
                )}
              >
                <Swatch swatch={option.swatch} />
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

function Swatch({ swatch }: { swatch: [string, string, string] }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-5 shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(var(--frost-rgb),0.5)]"
      style={{ background: swatch[0] }}
    >
      <span className="flex size-2.5 overflow-hidden rounded-full">
        <span className="h-full w-1/2" style={{ background: swatch[1] }} />
        <span className="h-full w-1/2" style={{ background: swatch[2] }} />
      </span>
    </span>
  );
}
