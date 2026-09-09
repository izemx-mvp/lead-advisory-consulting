import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "gold" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "border-border bg-muted text-muted-foreground",
    success: "border-[var(--success)]/40 bg-[var(--success)]/12 text-[var(--success)]",
    warning: "border-[var(--warning)]/45 bg-[var(--warning)]/15 text-[oklch(0.5_0.11_70)]",
    danger: "border-destructive/40 bg-destructive/10 text-destructive",
    gold: "border-primary/50 bg-primary/15 text-[oklch(0.45_0.07_63)]",
    info: "border-[var(--info)]/40 bg-[var(--info)]/10 text-[var(--info)]",
  };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export function HumanCheckBadge({ children = "Validation humaine requise" }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-[oklch(0.45_0.07_63)]">
      <ShieldCheck className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string | undefined;
  prefix?: string | undefined;
  decimals?: number | undefined;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  suffix,
  prefix,
  decimals,
  hint,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}) {
  return (
    <div
      className="panel animate-rise group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <span className="rounded-lg bg-primary/15 p-2 text-primary transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="display-title mt-4 text-4xl">
        <Counter value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="display-title text-xl uppercase tracking-[0.12em]">{children}</h2>
      {action}
    </div>
  );
}

export function Timeline({ items }: { items: { label: string; date: string; detail?: string }[] }) {
  return (
    <ol className="relative ml-3 border-l border-border">
      {items.map((it, i) => (
        <li
          key={`${it.label}-${i}`}
          className="animate-rise relative py-3 pl-6"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <span className="absolute -left-[7px] top-5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
          <p className="text-sm font-medium">{it.label}</p>
          {it.detail && <p className="text-xs text-muted-foreground">{it.detail}</p>}
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{it.date}</p>
        </li>
      ))}
    </ol>
  );
}

export const leadStatusTone = (s: string) =>
  s === "Converti"
    ? "success"
    : s === "Perdu"
      ? "danger"
      : s === "Qualifié" || s === "Rendez-vous programmé"
        ? "gold"
        : s === "Qualification en cours"
          ? "warning"
          : "neutral";
