import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Filter,
  Users,
  BarChart3,
  Megaphone,
  BookOpen,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  UserCog,
  Settings,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  X,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { useTheme } from "@/lib/theme";
import { useCrm } from "@/lib/crm-store";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { toast } from "sonner";

const NAV = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/leads", label: "Prospection / Leads", icon: Filter },
  { to: "/clients", label: "Clients / Ventes", icon: Users },
  { to: "/reporting", label: "Reporting / KPI", icon: BarChart3 },
  { to: "/marketing", label: "Marketing", icon: Megaphone },
  { to: "/knowledge", label: "Base de connaissances", icon: BookOpen },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar py-6 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
            collapsed ? "w-[84px] px-3" : "w-[264px] px-5"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link to="/dashboard" className="block">
              <Logo compact={collapsed} />
            </Link>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                aria-label="Réduire le menu"
                className="press rounded-lg border border-border p-1.5 text-muted-foreground hover:border-primary hover:text-primary"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Déployer le menu"
              className="press mb-4 self-center rounded-lg border border-border p-2 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}

          <nav className="flex flex-col gap-1.5">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={`press group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm ${
                    collapsed ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-card font-semibold text-foreground shadow-soft ring-1 ring-primary/45"
                      : "text-muted-foreground hover:translate-x-0.5 hover:bg-accent/70 hover:text-foreground"
                  }`}
                >
                  {active && <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r bg-primary" />}
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-primary" : ""
                    }`}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <TopBar title={title} subtitle={subtitle} />
          <main key={pathname} className="animate-page px-5 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}

function TopBar({ title, subtitle }: { title: string; subtitle?: string | undefined }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState<"search" | "notif" | "profile" | null>(null);
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div ref={ref} className="flex items-center gap-4 px-5 py-4 lg:px-8">
        <div className="lg:hidden">
          <Logo compact />
        </div>
        <div className="min-w-0">
          <h1 className="display-title truncate text-2xl uppercase tracking-[0.08em]">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="relative ml-auto flex items-center gap-2 sm:gap-3">
          <GlobalSearch open={open === "search"} setOpen={(v) => setOpen(v ? "search" : null)} />

          <button
            onClick={toggle}
            aria-label="Changer de thème"
            className="press rounded-full border border-border bg-card p-2 text-muted-foreground hover:border-primary hover:text-primary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(open === "notif" ? null : "notif")}
              aria-label="Notifications"
              className={`press relative rounded-full border bg-card p-2 ${
                open === "notif" ? "border-primary text-primary" : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 animate-pulse-ring items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unread}
                </span>
              )}
            </button>
            {open === "notif" && (
              <div className="animate-pop absolute right-0 top-12 z-50 w-[330px] overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <p className="display-title text-sm uppercase tracking-[0.14em]">Notifications</p>
                  <button
                    onClick={() => {
                      setNotifs((p) => p.map((n) => ({ ...n, read: true })));
                      toast.success("Notifications marquées comme lues");
                    }}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Tout marquer lu
                  </button>
                </div>
                <ul className="max-h-[340px] overflow-y-auto">
                  {notifs.map((n, i) => (
                    <li
                      key={n.id}
                      className="animate-rise"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      <button
                        onClick={() => setNotifs((p) => p.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                        className={`flex w-full gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-accent/60 ${
                          n.read ? "opacity-60" : ""
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            n.tone === "success"
                              ? "bg-[var(--emerald)]"
                              : n.tone === "warning"
                                ? "bg-[var(--warning)]"
                                : "bg-[var(--azure)]"
                          }`}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{n.title}</span>
                          <span className="block truncate text-xs text-muted-foreground">{n.detail}</span>
                          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                            {n.time}
                          </span>
                        </span>
                        {!n.read && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary opacity-0 group-hover:opacity-100" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen(open === "profile" ? null : "profile")}
              className={`press flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-2.5 ${
                open === "profile" ? "border-primary" : "border-border hover:border-primary"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                LA
              </span>
              <span className="hidden text-xs font-medium sm:block">Consultant</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === "profile" ? "rotate-180" : ""}`} />
            </button>
            {open === "profile" && (
              <div className="animate-pop absolute right-0 top-12 z-50 w-[250px] overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    LA
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Houda Bennis</p>
                    <p className="text-xs text-muted-foreground">Consultante senior</p>
                  </div>
                </div>
                <div className="p-2">
                  {[
                    { icon: UserCog, label: "Mon profil" },
                    { icon: Settings, label: "Préférences" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => toast.info(`${label} — écran de démonstration`)}
                      className="press flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  ))}
                  <Link
                    to="/"
                    className="press flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Se déconnecter
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-5 pb-3 lg:hidden">
        {NAV.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="press whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground data-[status=active]:border-primary data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { leads, clients, knowledge } = useCrm();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [] as { type: string; label: string; detail: string; go: () => void }[];
    const out: { type: string; label: string; detail: string; go: () => void }[] = [];
    leads
      .filter((l) => (l.name + l.project + l.interest + l.channel).toLowerCase().includes(t))
      .slice(0, 5)
      .forEach((l) =>
        out.push({
          type: "Lead",
          label: l.name,
          detail: `${l.interest} · ${l.status}`,
          go: () => navigate({ to: "/leads" }),
        }),
      );
    clients
      .filter((c) => (c.name + c.project).toLowerCase().includes(t))
      .slice(0, 4)
      .forEach((c) =>
        out.push({
          type: "Client",
          label: c.name,
          detail: c.project,
          go: () => navigate({ to: "/clients/$clientId", params: { clientId: c.id } }),
        }),
      );
    knowledge
      .filter((k) => (k.title + k.content).toLowerCase().includes(t))
      .slice(0, 3)
      .forEach((k) =>
        out.push({
          type: "Connaissance",
          label: k.title,
          detail: k.category,
          go: () => navigate({ to: "/knowledge" }),
        }),
      );
    return out;
  }, [q, leads, clients, knowledge, navigate]);

  return (
    <div className="relative">
      <div
        className={`hidden items-center gap-2 rounded-full border bg-card px-3 py-2 transition-all duration-300 md:flex ${
          open ? "w-[280px] border-primary shadow-soft" : "w-[190px] border-border hover:border-primary/60"
        }`}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          placeholder="Rechercher…"
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Effacer" className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div className="animate-pop absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted-foreground">Aucun résultat pour « {q} »</p>
          ) : (
            <ul className="max-h-[340px] overflow-y-auto">
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      r.go();
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-accent/60"
                  >
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                      {r.type}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{r.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">{r.detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-10 bg-ink px-5 py-12 text-[oklch(0.9_0.01_88)] lg:px-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Logo variant="dark" />
          <p className="mt-4 max-w-sm text-sm text-[oklch(0.75_0.01_88)]">
            Votre partenaire stratégique en immobilier depuis 16 ans. Conseil, acquisition et
            commercialisation à Rabat-Témara.
          </p>
          <div className="mt-4 flex gap-2">
            {[Instagram, Linkedin].map((Icon, i) => (
              <span
                key={i}
                className="press flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[oklch(1_0_0/0.15)] text-primary hover:border-primary hover:bg-primary/10"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <p className="display-title mb-3 text-xs uppercase tracking-[0.2em] text-primary">Contact</p>
          <ul className="space-y-2 text-[oklch(0.8_0.01_88)]">
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Harhoura, Témara — Maroc
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary" /> +212 5 37 00 00 00
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary" /> contact@leadadvisoryconsulting.ma
            </li>
          </ul>
        </div>

        <div className="text-sm md:text-right">
          <p className="display-title mb-3 text-xs uppercase tracking-[0.2em] text-primary">Prototype</p>
          <p className="text-[oklch(0.8_0.01_88)]">Démonstration frontend</p>
          <p className="text-[oklch(0.7_0.01_88)]">Données fictives — aucune intégration réelle</p>
        </div>
      </div>

      <div className="gold-line mt-8 h-px w-full" />
      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-[oklch(0.65_0.01_88)]">
        © 2026 Lead Advisory Consulting
      </p>
    </footer>
  );
}
