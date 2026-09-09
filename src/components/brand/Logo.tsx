export function Logo({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const text = variant === "dark" ? "text-[oklch(0.97_0.01_84)]" : "text-foreground";
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 48 40" className="h-9 w-11 shrink-0" aria-hidden="true">
        <path
          d="M24 4 L44 20 M24 4 L4 20"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 13 L36 23 M24 13 L12 23"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <rect x="21" y="27" width="6" height="9" fill="var(--gold)" opacity="0.85" />
      </svg>
      {!compact && (
        <div className={`leading-tight ${text}`}>
          <div className="display-title text-[15px] uppercase tracking-[0.22em]">Lead Advisory</div>
          <div className="text-[9px] uppercase tracking-[0.42em] text-muted-foreground">
            Consulting
          </div>
        </div>
      )}
    </div>
  );
}
