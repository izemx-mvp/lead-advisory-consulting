import logo from "@/assets/lac-logo.png";

export function Logo({
  variant = "light",
  compact = false,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const text = variant === "dark" ? "text-[oklch(0.97_0.01_88)]" : "text-foreground";
  return (
    <div className="group flex items-center gap-3">
      <img
        src={logo}
        alt="Lead Advisory Consulting"
        className="h-10 w-10 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
      />
      {!compact && (
        <div className={`leading-tight ${text}`}>
          <div className="display-title text-[15px] uppercase tracking-[0.2em]">Lead Advisory</div>
          <div className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground">Consulting</div>
        </div>
      )}
    </div>
  );
}
