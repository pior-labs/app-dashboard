import { LayoutDropdown } from "@/components/LayoutDropdown";
import { ThemeDropdown } from "@/components/ThemeDropdown";
import { cn } from "@/lib/utils";

/** Layout + theme pickers, paired so every layout exposes both consistently. */
export function Controls({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LayoutDropdown />
      <ThemeDropdown />
    </div>
  );
}
