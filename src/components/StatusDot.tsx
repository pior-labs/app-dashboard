import type { LinkStatus } from "@/config/links";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<LinkStatus, { dot: string; label: string }> = {
  online: { dot: "bg-[var(--good)]", label: "Online" },
  idle: { dot: "bg-[var(--warn)]", label: "Idle" },
  offline: { dot: "bg-[var(--destructive)]", label: "Offline" },
};

export function StatusDot({
  status = "online",
  pulse = true,
  className,
}: {
  status?: LinkStatus;
  pulse?: boolean;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span className={cn("relative flex size-2.5", className)} title={style.label}>
      {pulse && status === "online" && (
        <span
          className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", style.dot)}
          aria-hidden="true"
        />
      )}
      <span className={cn("relative inline-flex size-2.5 rounded-full", style.dot)} aria-hidden="true" />
      <span className="sr-only">{style.label}</span>
    </span>
  );
}
