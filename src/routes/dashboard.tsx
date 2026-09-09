import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, TrendingUp, Briefcase, Wallet, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { KpiCard, SectionTitle, StatusBadge, leadStatusTone } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import { ACTIVITY, LEAD_STATUSES } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — CRM Lead Advisory Consulting" },
      { name: "description", content: "Vue d'ensemble des leads, dossiers clients et activité récente." },
      { property: "og:title", content: "Tableau de bord — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "KPI, pipeline de leads et activité récente du cabinet." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { leads, clients } = useCrm();
  const active = leads.filter((l) => l.status !== "Converti" && l.status !== "Perdu").length;

  return (
    <AppShell title="Tableau de bord" subtitle="Vue d'ensemble de l'activité commerciale">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Leads actifs" value={active} icon={Users} hint="Pipeline en cours" />
        <KpiCard label="Taux de conversion" value={19.4} suffix=" %" decimals={1} icon={TrendingUp} hint="+2,3 pts vs mois dernier" delay={80} />
        <KpiCard label="Clients actifs" value={clients.filter((c) => c.dossier !== "Clôturé").length} icon={Briefcase} hint="Dossiers ouverts et en cours" delay={160} />
        <KpiCard label="Chiffre d'affaires" value={1842000} suffix=" MAD" icon={Wallet} hint="Cumul 2026" delay={240} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="panel animate-rise p-5 xl:col-span-2">
          <SectionTitle
            action={
              <Link to="/leads" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Ouvrir le pipeline <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            Pipeline des leads
          </SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LEAD_STATUSES.filter((s) => s !== "Perdu").map((s) => {
              const count = leads.filter((l) => l.status === s).length;
              return (
                <Link
                  key={s}
                  to="/leads"
                  className="rounded-lg border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-soft"
                >
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s}</p>
                  <p className="display-title mt-2 text-3xl">{count}</p>
                  <div className="mt-3 h-1 w-full rounded-full bg-muted">
                    <div
                      className="h-1 rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${Math.min(100, count * 25)}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6">
            <SectionTitle
              action={
                <Link to="/clients" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Tous les clients <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              }
            >
              Dossiers clients récents
            </SectionTitle>
            <div className="space-y-2">
              {clients.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to="/clients/$clientId"
                  params={{ clientId: c.id }}
                  className="flex items-center gap-4 rounded-lg border border-border bg-background px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-soft"
                >
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.project}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <StatusBadge label={c.dossier} tone={c.dossier === "Clôturé" ? "neutral" : "gold"} />
                    <span className="hidden text-sm font-medium sm:block">
                      {c.amount.toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="panel animate-rise p-5" style={{ animationDelay: "120ms" }}>
          <SectionTitle>Activité récente</SectionTitle>
          <ul className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <li
                key={i}
                className="animate-rise rounded-lg border border-border bg-background p-3"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{a.label}</p>
                  <StatusBadge label={a.tone === "success" ? "OK" : a.tone === "warning" ? "Alerte" : "Info"} tone={a.tone} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.who}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.time}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-lg border border-primary/40 bg-primary/10 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[oklch(0.45_0.07_63)]">Agents IA actifs</p>
            <p className="mt-2 text-sm">
              Prospection & qualification en fonctionnement — {leads.filter((l) => leadStatusTone(l.status) === "gold").length} leads
              prêts pour intervention humaine.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
