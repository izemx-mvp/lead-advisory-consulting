import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Filter,
  Users,
  BarChart3,
  Megaphone,
  BookOpen,
  Bell,
  Search,
  Lock,
} from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-sidebar px-5 py-6 lg:flex">
          <Link to="/dashboard" className="mb-8 block">
            <Logo />
          </Link>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                    active
                      ? "bg-card font-semibold text-foreground shadow-soft ring-1 ring-primary/40"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  {label}
                </Link>
              );
            })}
            <div className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/60">
              <Lock className="h-4 w-4" />
              <span>Service après-vente</span>
              <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider">
                À venir
              </span>
            </div>
          </nav>

          <div className="mt-auto dark-panel p-4">
            <p className="display-title text-sm uppercase tracking-[0.15em] text-primary">
              16 ans d'expérience
            </p>
            <p className="mt-2 text-xs text-[oklch(0.85_0.01_84)]">
              Harhoura, Témara — Maroc. Votre partenaire stratégique en immobilier.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="flex items-center gap-4 px-5 py-4 lg:px-8">
              <div className="lg:hidden">
                <Logo compact />
              </div>
              <div className="min-w-0">
                <h1 className="display-title truncate text-2xl uppercase tracking-[0.08em]">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
                  <Search className="h-3.5 w-3.5" />
                  <span className="text-xs">Rechercher…</span>
                </div>
                <button className="relative rounded-full border border-border bg-card p-2 transition-colors hover:bg-accent">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                </button>
                <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    LA
                  </div>
                  <span className="hidden text-xs font-medium sm:block">Consultant</span>
                </div>
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-5 pb-3 lg:hidden">
              {NAV.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground data-[status=active]:border-primary data-[status=active]:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </header>

          <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>

          <footer className="mt-10 bg-ink px-5 py-10 text-[oklch(0.9_0.01_84)] lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Logo variant="dark" />
                <p className="mt-3 max-w-sm text-sm text-[oklch(0.75_0.01_84)]">
                  Votre partenaire stratégique en immobilier — Harhoura, Témara, Maroc.
                </p>
              </div>
              <div className="text-xs text-[oklch(0.7_0.01_84)]">
                <p className="text-primary">Prototype de démonstration</p>
                <p>Données fictives — aucune intégration réelle</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
