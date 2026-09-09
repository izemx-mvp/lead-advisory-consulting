import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Building2,
  CalendarCheck,
  Compass,
  Lightbulb,
  MapPin,
  Target,
  Timer,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { KpiCard, SectionTitle, StatusBadge } from "@/components/app/ui-bits";
import {
  CHANNEL_PERF,
  FORECAST,
  FUNNEL,
  GEO_PERF,
  INSIGHTS,
  LOSS_REASONS,
  MONTHLY,
  OPS_PERF,
  TOP_PROPERTIES,
} from "@/lib/mock-data";

export const Route = createFileRoute("/reporting")({
  head: () => ({
    meta: [
      { title: "Reporting & KPI — CRM Lead Advisory Consulting" },
      {
        name: "description",
        content: "Pilotage commercial : KPI, funnel de vente, performance financière, géographique, opérationnelle et prévisions.",
      },
      { property: "og:title", content: "Reporting & KPI — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Pilotage de l'activité commerciale immobilière en un coup d'œil." },
    ],
  }),
  component: ReportingPage,
});

const PERIODS = ["3 mois", "6 mois", "Année"] as const;
const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--foreground)",
};

function ReportingPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Année");
  const [metric, setMetric] = useState<"leads" | "clients" | "ca" | "rdv">("leads");

  const data = useMemo(() => {
    const n = period === "3 mois" ? 3 : period === "6 mois" ? 6 : MONTHLY.length;
    return MONTHLY.slice(-n);
  }, [period]);

  const totalLeads = data.reduce((s, m) => s + m.leads, 0);
  const totalVentes = data.reduce((s, m) => s + m.ventes, 0);
  const totalRdv = data.reduce((s, m) => s + m.rdv, 0);
  const totalCa = data.reduce((s, m) => s + m.ca, 0);
  const totalPerdus = data.reduce((s, m) => s + m.perdus, 0);
  const conv = Math.round((totalVentes / totalLeads) * 1000) / 10;
  const weakest = [...CHANNEL_PERF].sort((a, b) => a.conversion - b.conversion)[0]!;
  const maxFunnel = FUNNEL[0]!.leads;

  const metricLabel = { leads: "Leads", clients: "Clients", ca: "CA (k MAD)", rdv: "Rendez-vous" }[metric];
  const metricColor = { leads: "var(--gold)", clients: "var(--azure)", ca: "var(--emerald)", rdv: "var(--violet)" }[metric];

  return (
    <AppShell title="Reporting / KPI" subtitle="Pilotage commercial, financier et opérationnel">
      {/* Période */}
      <div className="panel mb-6 flex flex-wrap items-center gap-3 p-4">
        <Compass className="h-4 w-4 text-primary" />
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Période analysée</p>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`press rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                period === p
                  ? "border-primary bg-primary/15 font-semibold text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Leads captés" value={totalLeads} icon={Users} hint={`Période : ${period}`} accent="azure" />
        <KpiCard label="Leads qualifiés" value={Math.round(totalLeads * 0.36)} icon={Target} hint="Critères IA validés" delay={60} accent="teal" />
        <KpiCard label="Rendez-vous" value={totalRdv} icon={CalendarCheck} hint="Programmés par l'agent IA" delay={120} accent="violet" />
        <KpiCard label="Taux de conversion" value={conv} suffix=" %" decimals={1} icon={TrendingUp} hint="Leads → ventes" delay={180} accent="emerald" />
        <KpiCard label="Clients convertis" value={totalVentes} icon={Award} hint="Dossiers ouverts" delay={240} accent="gold" />
        <KpiCard label="Chiffre d'affaires" value={totalCa * 1000} suffix=" MAD" icon={Wallet} hint="Honoraires encaissés" delay={300} accent="emerald" />
        <KpiCard label="Leads perdus" value={totalPerdus} icon={ArrowDownRight} hint="Sur la période" delay={360} accent="terracotta" />
        <KpiCard label="Temps de réponse" value={14} suffix=" min" icon={Timer} hint="Moyenne septembre" delay={420} accent="azure" />
      </div>

      {/* Funnel */}
      <section className="mt-8">
        <SectionTitle>Funnel de vente</SectionTitle>
        <div className="panel animate-rise p-5">
          <div className="space-y-3">
            {FUNNEL.map((f, i) => {
              const prev = FUNNEL[i - 1];
              const drop = prev ? Math.round((1 - f.leads / prev.leads) * 100) : 0;
              const critical = drop >= 30;
              return (
                <div key={f.etape} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{f.etape}</span>
                    <span className="text-muted-foreground">{f.leads} leads</span>
                    {prev && (
                      <StatusBadge label={`−${drop} % vs étape précédente`} tone={critical ? "danger" : drop >= 20 ? "warning" : "success"} />
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {Math.round((f.leads / maxFunnel) * 100)} % du volume initial
                    </span>
                  </div>
                  <div className="h-7 w-full overflow-hidden rounded-lg bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-lg pr-3 text-[11px] font-semibold text-primary-foreground transition-all duration-1000"
                      style={{
                        width: `${(f.leads / maxFunnel) * 100}%`,
                        background: `linear-gradient(90deg, var(--chart-${(i % 5) + 1}), color-mix(in oklab, var(--chart-${(i % 5) + 1}) 65%, transparent))`,
                      }}
                    >
                      {f.leads}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-[var(--warning)]" />
            Le plus fort décrochage se situe entre « Premier contact » et « Qualification en cours ».
          </p>
        </div>
      </section>

      {/* Évolutions */}
      <section className="mt-8">
        <SectionTitle
          action={
            <div className="flex flex-wrap gap-1.5">
              {(["leads", "clients", "rdv", "ca"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`press rounded-full border px-3 py-1 text-[11px] transition-all ${
                    metric === m
                      ? "border-primary bg-primary/15 font-semibold text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {{ leads: "Leads", clients: "Conversions", rdv: "Rendez-vous", ca: "Chiffre d'affaires" }[m]}
                </button>
              ))}
            </div>
          }
        >
          Graphes d'évolution
        </SectionTitle>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="panel animate-rise p-5 xl:col-span-2">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Évolution — {metricLabel}</p>
            <div className="h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="gMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={metricColor} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={metricColor} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mois" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey={metric} name={metricLabel} stroke={metricColor} strokeWidth={2.5} fill="url(#gMetric)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel animate-rise p-5" style={{ animationDelay: "120ms" }}>
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Volume par canal</p>
            <div className="h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_PERF} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="canal" stroke="var(--muted-foreground)" fontSize={10} width={90} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={tooltipStyle} />
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
      </section>

      {/* Performance financière */}
      <section className="mt-8">
        <SectionTitle>Performance financière</SectionTitle>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-4">
            <FinanceCard label="Chiffre d'affaires" value={`${(totalCa * 1000).toLocaleString("fr-FR")} MAD`} delta="+12,9 %" up accent="var(--emerald)" />
            <FinanceCard label="Valeur des ventes" value="1,84 Md MAD" delta="+8,4 %" up accent="var(--gold)" />
            <FinanceCard label="Paiements encaissés" value="1 246 000 MAD" delta="+5,1 %" up accent="var(--azure)" />
            <FinanceCard label="Encours à recouvrer" value="284 000 MAD" delta="−3,2 %" up={false} accent="var(--terracotta)" />
          </div>
          <div className="panel animate-rise p-5 xl:col-span-2">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Chiffre d'affaires (k MAD) et ventes par mois
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mois" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="l" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="r" orientation="right" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="l" dataKey="ca" name="CA (k MAD)" fill="var(--emerald)" radius={[6, 6, 0, 0]} />
                  <Line yAxisId="r" type="monotone" dataKey="ventes" name="Ventes" stroke="var(--gold)" strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Top 5 biens */}
      <section className="mt-8">
        <SectionTitle>Top 5 des biens les plus performants</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {TOP_PROPERTIES.map((p, i) => (
            <div key={p.nom} className="panel panel-hover animate-rise overflow-hidden p-5" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="display-title text-2xl text-muted-foreground">#{i + 1}</span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-snug">{p.nom}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {p.ville}
              </p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <Row label="Leads" value={`${p.leads}`} />
                <Row label="Visites" value={`${p.visites}`} />
                <Row label="Ventes" value={`${p.ventes}`} />
                <Row label="CA" value={`${p.ca} k MAD`} />
              </dl>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(p.ventes / 11) * 100}%`, background: `var(--chart-${(i % 5) + 1})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance opérationnelle */}
      <section className="mt-8">
        <SectionTitle>Performance opérationnelle</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel animate-rise p-5 lg:col-span-2">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Temps moyen de réponse (min) et rendez-vous obtenus
            </p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={OPS_PERF}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mois" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="reponseMin" name="Réponse (min)" fill="var(--azure)" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="rdv" name="Rendez-vous" stroke="var(--violet)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="relances" name="Relances IA" stroke="var(--teal)" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            <FinanceCard label="Temps moyen de réponse" value="14 min" delta="−69 % depuis mai" up accent="var(--azure)" />
            <FinanceCard label="Relances automatiques" value="96 / mois" delta="+9 %" up accent="var(--teal)" />
            <FinanceCard label="RDV obtenus" value="36" delta="+16 %" up accent="var(--violet)" />
          </div>
        </div>
      </section>

      {/* Analyse des pertes */}
      <section className="mt-8">
        <SectionTitle>Analyse des pertes</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel animate-rise p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Répartition des motifs</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={LOSS_REASONS} dataKey="count" nameKey="raison" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {LOSS_REASONS.map((_, i) => (
                      <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel animate-rise p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Motifs par étape</p>
            <ul className="space-y-3">
              {LOSS_REASONS.map((l, i) => (
                <li key={l.raison} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{l.raison}</span>
                    <span className="text-muted-foreground">{l.count}</span>
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{l.etape}</p>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[var(--terracotta)] transition-all duration-1000"
                      style={{ width: `${(l.count / 38) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel animate-rise p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Évolution des leads perdus</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="gLost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--terracotta)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--terracotta)" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="mois" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="perdus" name="Leads perdus" stroke="var(--terracotta)" strokeWidth={2} fill="url(#gLost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Prévisions */}
      <section className="mt-8">
        <SectionTitle
          action={<StatusBadge label="Projection indicative" tone="violet" />}
        >
          Prévisions
        </SectionTitle>
        <div className="panel animate-rise p-5">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={FORECAST}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mois" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="ca" name="CA réalisé (k MAD)" fill="var(--gold)" radius={[6, 6, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="prevu"
                  name="CA prévu (k MAD)"
                  stroke="var(--violet)"
                  strokeWidth={2.5}
                  strokeDasharray="6 5"
                  dot={{ r: 3 }}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Tendance projetée jusqu'en décembre à partir de la dynamique des trois derniers mois — simulation de démonstration.
          </p>
        </div>
      </section>

      {/* Performance géographique */}
      <section className="mt-8">
        <SectionTitle>Performance géographique</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {GEO_PERF.map((g, i) => (
              <div key={g.zone} className="panel panel-hover animate-rise p-4" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">{g.zone}</p>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Leads</p>
                    <p className="display-title text-2xl">{g.leads}</p>
                  </div>
                  <StatusBadge label={`${g.conversion} % conv.`} tone={g.conversion >= 20 ? "success" : g.conversion >= 13 ? "warning" : "danger"} />
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(g.ca / 742) * 100}%`, background: `var(--chart-${(i % 5) + 1})` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{g.ca} k MAD de CA</p>
              </div>
            ))}
          </div>
          <div className="panel animate-rise p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Comparatif des zones</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GEO_PERF} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="zone" stroke="var(--muted-foreground)" fontSize={10} width={120} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="leads" name="Leads" fill="var(--azure)" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="conversion" name="Conversion (%)" fill="var(--emerald)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Insights & actions */}
      <section className="mt-8">
        <SectionTitle>Insights & actions recommandées</SectionTitle>
        <div className="grid gap-4 lg:grid-cols-2">
          {INSIGHTS.map((ins, i) => {
            const color =
              ins.tone === "success"
                ? "var(--emerald)"
                : ins.tone === "warning"
                  ? "var(--warning)"
                  : ins.tone === "danger"
                    ? "var(--terracotta)"
                    : "var(--azure)";
            return (
              <div
                key={ins.titre}
                className="panel panel-hover animate-rise overflow-hidden p-5"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} />
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" style={{ color }} />
                  <p className="text-sm font-semibold">{ins.titre}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{ins.detail}</p>
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-background p-3">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <p className="text-xs">
                    <span className="font-semibold uppercase tracking-wider text-primary">Action — </span>
                    {ins.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-rise mt-4 rounded-xl border border-[var(--warning)]/50 bg-[var(--warning)]/12 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />
            <p className="display-title text-sm uppercase tracking-[0.14em]">Point d'effort prioritaire</p>
          </div>
          <p className="mt-3 text-sm">
            Le canal <strong>{weakest.canal}</strong> affiche le taux de conversion le plus faible ({weakest.conversion} %) malgré{" "}
            {weakest.leads} leads captés.
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function FinanceCard({
  label,
  value,
  delta,
  up,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  accent: string;
}) {
  return (
    <div className="panel panel-hover animate-rise overflow-hidden p-4">
      <span className="mb-3 block h-1 w-12 rounded-full" style={{ background: accent }} />
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="display-title mt-1 text-2xl">{value}</p>
      <p
        className="mt-1 flex items-center gap-1 text-xs"
        style={{ color: up ? "var(--emerald)" : "var(--terracotta)" }}
      >
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />} {delta}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
