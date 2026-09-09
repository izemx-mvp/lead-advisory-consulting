import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Briefcase, TrendingUp, Users, Wallet } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { KpiCard, SectionTitle } from "@/components/app/ui-bits";
import { CHANNEL_PERF, MONTHLY } from "@/lib/mock-data";

export const Route = createFileRoute("/reporting")({
  head: () => ({
    meta: [
      { title: "Reporting & KPI — CRM Lead Advisory Consulting" },
      { name: "description", content: "Indicateurs de performance, évolution des leads et comparaison des canaux d'acquisition." },
      { property: "og:title", content: "Reporting & KPI — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Pilotage de l'activité commerciale immobilière en un coup d'œil." },
    ],
  }),
  component: ReportingPage,
});

function ReportingPage() {
  const weakest = [...CHANNEL_PERF].sort((a, b) => a.conversion - b.conversion)[0]!;

  return (
    <AppShell title="Reporting / KPI" subtitle="Pilotage de la performance commerciale">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total leads" value={444} icon={Users} hint="Depuis janvier 2026" accent="azure" />
        <KpiCard label="Taux de conversion" value={19.4} suffix=" %" decimals={1} icon={TrendingUp} hint="Moyenne annuelle" delay={80} accent="emerald" />
        <KpiCard label="Clients actifs" value={26} icon={Briefcase} hint="Dossiers en cours" delay={160} accent="violet" />
        <KpiCard label="Chiffre d'affaires" value={1842000} suffix=" MAD" icon={Wallet} hint="Cumul 2026" delay={240} accent="gold" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="panel animate-rise p-5 xl:col-span-2">
          <SectionTitle>Évolution des leads et clients</SectionTitle>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--azure)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--azure)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mois" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="var(--gold)" strokeWidth={2} fill="url(#gLeads)" />
                <Area type="monotone" dataKey="clients" name="Clients" stroke="var(--azure)" strokeWidth={2} fill="url(#gClients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel animate-rise p-5" style={{ animationDelay: "120ms" }}>
          <SectionTitle>Volume par canal</SectionTitle>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHANNEL_PERF} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="canal" stroke="var(--muted-foreground)" fontSize={10} width={90} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="leads" name="Leads" radius={[0, 6, 6, 0]}>
                  {CHANNEL_PERF.map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="panel animate-rise p-5 lg:col-span-2">
          <SectionTitle>Performances commerciales par canal</SectionTitle>
          <div className="space-y-4">
            {CHANNEL_PERF.map((c, i) => (
              <div key={c.canal} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.canal}</span>
                  <span className="text-muted-foreground">
                    {c.leads} leads · {c.conversion} % conversion
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      c.conversion < 12 ? "bg-[var(--terracotta)]" : c.conversion >= 25 ? "bg-[var(--emerald)]" : "bg-primary"
                    }`}
                    style={{ width: `${c.conversion * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-rise rounded-xl border border-[var(--warning)]/50 bg-[var(--warning)]/12 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />
            <p className="display-title text-sm uppercase tracking-[0.14em]">Points d'effort</p>
          </div>
          <p className="mt-3 text-sm">
            Le canal <strong>{weakest.canal}</strong> affiche le taux de conversion le plus faible
            ({weakest.conversion} %) malgré {weakest.leads} leads captés.
          </p>
          <p className="mt-3 text-sm">
            L'étape <strong>Qualification en cours</strong> concentre le plus de leads immobilisés du pipeline.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
            Données de démonstration statiques
          </p>
        </div>
      </div>
    </AppShell>
  );
}
