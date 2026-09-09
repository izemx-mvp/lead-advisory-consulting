import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "gold" | "info" | "violet" | "teal";
}) {
  const tones: Record<string, string> = {
    neutral: "border-border bg-muted text-muted-foreground",
    success: "border-[var(--emerald)]/45 bg-[var(--emerald)]/12 text-[var(--emerald)]",
    warning: "border-[var(--warning)]/50 bg-[var(--warning)]/15 text-[var(--warning)]",
    danger: "border-[var(--terracotta)]/45 bg-[var(--terracotta)]/12 text-[var(--terracotta)]",
    gold: "border-primary/55 bg-primary/15 text-primary",
    info: "border-[var(--azure)]/45 bg-[var(--azure)]/12 text-[var(--azure)]",
    violet: "border-[var(--violet)]/45 bg-[var(--violet)]/12 text-[var(--violet)]",
    teal: "border-[var(--teal)]/45 bg-[var(--teal)]/12 text-[var(--teal)]",
  };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

export function HumanCheckBadge({ children = "Validation humaine requise" }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/12 px-2.5 py-1 text-[11px] font-medium text-primary">
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

export type Accent = "gold" | "azure" | "emerald" | "violet" | "terracotta" | "teal";
const accentVar: Record<Accent, string> = {
  gold: "var(--gold)",
  azure: "var(--azure)",
  emerald: "var(--emerald)",
  violet: "var(--violet)",
  terracotta: "var(--terracotta)",
  teal: "var(--teal)",
};

export function KpiCard({
  label,
  value,
  suffix,
  prefix,
  decimals,
  hint,
  icon: Icon,
  delay = 0,
  accent = "gold",
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
  accent?: Accent;
}) {
  const c = accentVar[accent];
  return (
    <div
      className="panel panel-hover animate-rise group relative overflow-hidden p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className="absolute inset-x-0 top-0 h-1 opacity-80 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${c}, transparent)` }}
      />
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <span
          className="rounded-lg p-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: `color-mix(in oklab, ${c} 16%, transparent)`, color: c }}
        >
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
          <span className="absolute -left-[7px] top-5 h-3 w-3 rounded-full border-2 border-background bg-primary transition-transform duration-200 hover:scale-125" />
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
      : s === "RDV programmé"
        ? "violet"
        : s === "Qualifié"
          ? "gold"
          : s === "Qualification en cours"
            ? "warning"
            : s === "Premier contact"
              ? "teal"
              : "info";
