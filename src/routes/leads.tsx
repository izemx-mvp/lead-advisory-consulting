import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  X,
  Instagram,
  Linkedin,
  Globe,
  Store,
  Handshake,
  PhoneCall,
  Music2,
  Bot,
  CalendarCheck,
  UserCheck,
  UserX,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  Columns3,
  SlidersHorizontal,
  MoreVertical,
  Palette,
  Pencil,
  EyeOff,
  Eye,
  RotateCcw,
  Target,
  Flame,
  MapPin,
  Mail,
  Phone,
  Wallet,
  Clock,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HumanCheckBadge, SectionTitle, StatusBadge, Timeline, leadStatusTone } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import { CHANNELS, LEAD_STATUSES, fmtDate, type Channel, type Lead, type LeadStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Pipeline des leads — CRM Lead Advisory Consulting" },
      { name: "description", content: "Pipeline de prospection immobilière avec qualification assistée par agent IA." },
      { property: "og:title", content: "Pipeline des leads — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Suivi des leads par canal, statut et conversation IA simulée." },
    ],
  }),
  component: LeadsPage,
});

const channelIcon: Record<Channel, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Instagram: Instagram,
  TikTok: Music2,
  Avito: Store,
  "Site web": Globe,
  LinkedIn: Linkedin,
  "Prospection directe": PhoneCall,
  Partenariat: Handshake,
};

const channelColor: Record<Channel, string> = {
  Instagram: "var(--violet)",
  TikTok: "var(--teal)",
  Avito: "var(--terracotta)",
  "Site web": "var(--azure)",
  LinkedIn: "var(--info)",
  "Prospection directe": "var(--bronze)",
  Partenariat: "var(--emerald)",
};

const COLUMN_COLORS = [
  { key: "gold", value: "var(--gold)" },
  { key: "azure", value: "var(--azure)" },
  { key: "emerald", value: "var(--emerald)" },
  { key: "violet", value: "var(--violet)" },
  { key: "terracotta", value: "var(--terracotta)" },
  { key: "teal", value: "var(--teal)" },
];

const DEFAULT_COLORS: Record<LeadStatus, string> = {
  Nouveau: "var(--azure)",
  "Premier contact": "var(--teal)",
  "Qualification en cours": "var(--warning)",
  Qualifié: "var(--gold)",
  "RDV programmé": "var(--violet)",
  Converti: "var(--emerald)",
  Perdu: "var(--terracotta)",
};

type ColumnCfg = { title: string; color: string; collapsed: boolean; hidden: boolean };
type SortKey = "recent" | "budget" | "score" | "name";
type ViewMode = "kanban" | "grid" | "list";

const DAY = 86_400_000;

function LeadsPage() {
  const { leads, setLeadStatus, convertLead } = useCrm();
  const [query, setQuery] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [status, setStatus] = useState<LeadStatus | null>(null);
  const [period, setPeriod] = useState<"all" | "7" | "30" | "90">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewMode>("kanban");
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [cfg, setCfg] = useState<Record<LeadStatus, ColumnCfg>>(() =>
    Object.fromEntries(
      LEAD_STATUSES.map((s) => [s, { title: s, color: DEFAULT_COLORS[s], collapsed: false, hidden: false }]),
    ) as Record<LeadStatus, ColumnCfg>,
  );

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    const now = new Date("2026-09-09").getTime();
    const list = leads.filter((l) => {
      const hay = `${l.name} ${l.project} ${l.interest} ${l.city} ${l.email}`.toLowerCase();
      if (t && !hay.includes(t)) return false;
      if (channels.length && !channels.includes(l.channel)) return false;
      if (status && l.status !== status) return false;
      const created = new Date(l.createdAt).getTime();
      if (period !== "all" && now - created > Number(period) * DAY) return false;
      if (from && created < new Date(from).getTime()) return false;
      if (to && created > new Date(to).getTime()) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "budget") return b.budgetValue - a.budgetValue;
      if (sort === "score") return b.score - a.score;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [leads, query, channels, status, period, from, to, sort]);

  const openLead = leads.find((l) => l.id === openId) ?? null;
  const activeFilters = (query ? 1 : 0) + channels.length + (status ? 1 : 0) + (period !== "all" ? 1 : 0) + (from || to ? 1 : 0);

  const move = (id: string, to: LeadStatus) => {
    setLeadStatus(id, to);
    toast.success(`Statut mis à jour : ${to}`);
  };

  const reset = () => {
    setQuery("");
    setChannels([]);
    setStatus(null);
    setPeriod("all");
    setFrom("");
    setTo("");
    setSort("recent");
    toast.info("Filtres réinitialisés");
  };

  return (
    <AppShell title="Prospection / Leads" subtitle="Pipeline commercial et qualification par agent IA">
      {/* Barre de filtres */}
      <div className="panel mb-5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 transition-colors focus-within:border-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un lead, un projet, une ville…"
              className="w-full bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Select
            value={status ?? ""}
            onChange={(v) => setStatus((v || null) as LeadStatus | null)}
            options={[{ label: "Tous les statuts", value: "" }, ...LEAD_STATUSES.map((s) => ({ label: s, value: s }))]}
          />
          <Select
            value={period}
            onChange={(v) => setPeriod(v as typeof period)}
            options={[
              { label: "Toutes les dates", value: "all" },
              { label: "7 derniers jours", value: "7" },
              { label: "30 derniers jours", value: "30" },
              { label: "90 derniers jours", value: "90" },
            ]}
          />
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5 text-xs">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-transparent text-xs outline-none"
              aria-label="Date de début"
            />
            <span className="text-muted-foreground">→</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-transparent text-xs outline-none"
              aria-label="Date de fin"
            />
          </div>
          <Select
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
            options={[
              { label: "Plus récents", value: "recent" },
              { label: "Budget décroissant", value: "budget" },
              { label: "Score IA", value: "score" },
              { label: "Nom (A-Z)", value: "name" },
            ]}
          />

          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {([
              ["kanban", Columns3, "Kanban"],
              ["grid", LayoutGrid, "Cartes"],
              ["list", List, "Liste"],
            ] as const).map(([v, Icon, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                title={label}
                className={`press flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ${
                  view === v
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={reset}
            className="press flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Source :</span>
          {CHANNELS.map((c) => {
            const on = channels.includes(c);
            const Icon = channelIcon[c];
            return (
              <button
                key={c}
                onClick={() => setChannels((p) => (on ? p.filter((x) => x !== c) : [...p, c]))}
                className="press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
                style={
                  on
                    ? {
                        borderColor: channelColor[c],
                        background: `color-mix(in oklab, ${channelColor[c]} 16%, transparent)`,
                        color: channelColor[c],
                        fontWeight: 600,
                      }
                    : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                }
              >
                <Icon className="h-3.5 w-3.5" /> {c}
              </button>
            );
          })}
          <span className="ml-auto rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {filtered.length} lead{filtered.length > 1 ? "s" : ""}
            {activeFilters > 0 && ` · ${activeFilters} filtre${activeFilters > 1 ? "s" : ""} actif${activeFilters > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {view === "kanban" && (
        <KanbanView
          leads={filtered}
          cfg={cfg}
          setCfg={setCfg}
          onOpen={setOpenId}
          onMove={move}
          dragId={dragId}
          setDragId={setDragId}
        />
      )}

      {view === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l, i) => (
            <GridCard key={l.id} lead={l} onOpen={() => setOpenId(l.id)} delay={i * 40} />
          ))}
          {filtered.length === 0 && <EmptyState />}
        </div>
      )}

      {view === "list" && <ListView leads={filtered} onOpen={setOpenId} />}

      {openLead && (
        <LeadDrawer
          lead={openLead}
          onClose={() => setOpenId(null)}
          onConvert={() => {
            convertLead(openLead.id);
            toast.success(`${openLead.name} converti en client`, {
              description: "Dossier client créé dans le module Clients / Ventes.",
            });
            setOpenId(null);
          }}
          onLost={() => {
            setLeadStatus(openLead.id, "Perdu");
            toast.error(`${openLead.name} marqué comme perdu`);
            setOpenId(null);
          }}
        />
      )}
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="panel col-span-full p-10 text-center text-sm text-muted-foreground">
      Aucun lead ne correspond à ces filtres.
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-2 text-xs transition-colors hover:border-primary/60">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent pr-1 text-xs outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-popover text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- Kanban ---------------- */

function KanbanView({
  leads,
  cfg,
  setCfg,
  onOpen,
  onMove,
  dragId,
  setDragId,
}: {
  leads: Lead[];
  cfg: Record<LeadStatus, ColumnCfg>;
  setCfg: React.Dispatch<React.SetStateAction<Record<LeadStatus, ColumnCfg>>>;
  onOpen: (id: string) => void;
  onMove: (id: string, s: LeadStatus) => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
}) {
  const hidden = LEAD_STATUSES.filter((s) => cfg[s].hidden);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);

  return (
    <>
      {hidden.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Colonnes masquées :</span>
          {hidden.map((s) => (
            <button
              key={s}
              onClick={() => setCfg((p) => ({ ...p, [s]: { ...p[s], hidden: false } }))}
              className="press flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Eye className="h-3 w-3" /> {cfg[s].title}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {LEAD_STATUSES.filter((s) => !cfg[s].hidden).map((s) => {
          const c = cfg[s];
          const items = leads.filter((l) => l.status === s);
          if (c.collapsed) {
            return (
              <button
                key={s}
                onClick={() => setCfg((p) => ({ ...p, [s]: { ...p[s], collapsed: false } }))}
                className="press flex w-[56px] shrink-0 flex-col items-center gap-3 rounded-xl border border-border bg-sidebar/70 py-4 hover:border-primary"
                style={{ borderTopColor: c.color, borderTopWidth: 3 }}
              >
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ background: `color-mix(in oklab, ${c.color} 20%, transparent)`, color: c.color }}
                >
                  {items.length}
                </span>
                <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-muted-foreground [writing-mode:vertical-rl]">
                  {c.title}
                </span>
              </button>
            );
          }
          return (
            <div
              key={s}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(s);
              }}
              onDragLeave={() => setOverCol((p) => (p === s ? null : p))}
              onDrop={() => {
                if (dragId) onMove(dragId, s);
                setDragId(null);
                setOverCol(null);
              }}
              className={`flex w-[290px] shrink-0 flex-col rounded-xl border bg-sidebar/60 p-3 transition-all duration-200 ${
                overCol === s ? "scale-[1.01] border-primary bg-primary/5 shadow-lift" : "border-border"
              }`}
              style={{ borderTopColor: c.color, borderTopWidth: 3 }}
            >
              <ColumnHeader
                status={s}
                cfg={c}
                count={items.length}
                setCfg={setCfg}
              />
              <div className="space-y-2.5">
                {items.map((l, i) => (
                  <LeadCard
                    key={l.id}
                    lead={l}
                    color={c.color}
                    delay={i * 40}
                    onOpen={() => onOpen(l.id)}
                    onDragStart={() => setDragId(l.id)}
                    onQuickMove={onMove}
                  />
                ))}
                {items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-[11px] text-muted-foreground">
                    Déposer un lead ici
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ColumnHeader({
  status,
  cfg,
  count,
  setCfg,
}: {
  status: LeadStatus;
  cfg: ColumnCfg;
  count: number;
  setCfg: React.Dispatch<React.SetStateAction<Record<LeadStatus, ColumnCfg>>>;
}) {
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cfg.title);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const update = (patch: Partial<ColumnCfg>) => setCfg((p) => ({ ...p, [status]: { ...p[status], ...patch } }));

  return (
    <div ref={ref} className="relative mb-3 flex items-center gap-2">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: cfg.color }} />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            update({ title: draft.trim() || status });
            setEditing(false);
            toast.success("Colonne renommée");
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="min-w-0 flex-1 rounded border border-primary bg-background px-1.5 py-0.5 text-[11px] outline-none"
        />
      ) : (
        <p className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {cfg.title}
        </p>
      )}
      <span
        className="rounded-full px-2 py-0.5 text-[11px] font-bold"
        style={{ background: `color-mix(in oklab, ${cfg.color} 18%, transparent)`, color: cfg.color }}
      >
        {count}
      </span>
      <button
        onClick={() => update({ collapsed: true })}
        title="Replier"
        className="press text-muted-foreground hover:text-primary"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setMenu((m) => !m)}
        title="Options de la colonne"
        className="press text-muted-foreground hover:text-primary"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {menu && (
        <div className="animate-pop absolute right-0 top-7 z-40 w-[210px] rounded-xl border border-border bg-popover p-2 shadow-lift">
          <button
            onClick={() => {
              setEditing(true);
              setMenu(false);
            }}
            className="press flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" /> Renommer la colonne
          </button>
          <button
            onClick={() => {
              update({ hidden: true });
              setMenu(false);
              toast.info(`Colonne « ${cfg.title} » masquée`);
            }}
            className="press flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <EyeOff className="h-3.5 w-3.5" /> Masquer la colonne
          </button>
          <div className="mt-1 border-t border-border px-2.5 pt-2">
            <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Palette className="h-3 w-3" /> Couleur
            </p>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {COLUMN_COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => update({ color: c.value })}
                  aria-label={c.key}
                  className={`h-5 w-5 rounded-full transition-transform hover:scale-125 ${
                    cfg.color === c.value ? "ring-2 ring-foreground ring-offset-2 ring-offset-popover" : ""
                  }`}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? "var(--emerald)" : score >= 55 ? "var(--gold)" : "var(--terracotta)";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}
    >
      <Flame className="h-3 w-3" /> {score}
    </span>
  );
}

function LeadCard({
  lead,
  color,
  delay = 0,
  onOpen,
  onDragStart,
  onQuickMove,
}: {
  lead: Lead;
  color: string;
  delay?: number;
  onOpen: () => void;
  onDragStart: () => void;
  onQuickMove: (id: string, s: LeadStatus) => void;
}) {
  const Icon = channelIcon[lead.channel];
  const idx = LEAD_STATUSES.indexOf(lead.status);
  const next = LEAD_STATUSES[Math.min(idx + 1, LEAD_STATUSES.length - 2)];
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      style={{ animationDelay: `${delay}ms` }}
      className="animate-rise group cursor-pointer rounded-lg border border-border bg-card p-3 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lift active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold group-hover:text-primary">{lead.name}</p>
        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: channelColor[lead.channel] }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{lead.project}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{
            background: `color-mix(in oklab, ${channelColor[lead.channel]} 14%, transparent)`,
            color: channelColor[lead.channel],
          }}
        >
          {lead.channel}
        </span>
        <ScorePill score={lead.score} />
        <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
          {fmtDate(lead.lastContact)}
        </span>
      </div>
      <p className="mt-2 text-xs font-medium" style={{ color }}>
        {lead.budget}
      </p>
      {lead.status !== "Converti" && lead.status !== "Perdu" && next && next !== lead.status && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickMove(lead.id, next);
          }}
          className="press mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-primary/50 bg-primary/10 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/20"
        >
          Étape suivante <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </article>
  );
}

function GridCard({ lead, onOpen, delay }: { lead: Lead; onOpen: () => void; delay: number }) {
  const Icon = channelIcon[lead.channel];
  return (
    <article
      onClick={onOpen}
      style={{ animationDelay: `${delay}ms` }}
      className="panel panel-hover animate-rise group cursor-pointer p-5"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: `color-mix(in oklab, ${channelColor[lead.channel]} 16%, transparent)`,
            color: channelColor[lead.channel],
          }}
        >
          {lead.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold group-hover:text-primary">{lead.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {lead.city}
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1.5">
          <StatusBadge label={lead.status} tone={leadStatusTone(lead.status)} />
          <ScorePill score={lead.score} />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-primary/30 bg-primary/8 p-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-primary">Intérêt</p>
        <p className="mt-0.5 text-sm font-medium">{lead.interest}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Wallet className="h-3.5 w-3.5 text-primary" /> {lead.budget}
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" style={{ color: channelColor[lead.channel] }} /> {lead.channel}
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> {fmtDate(lead.lastContact)}
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" /> {lead.interactions.length} interactions
        </p>
      </div>
    </article>
  );
}

type ListSortKey = "name" | "interest" | "channel" | "status" | "budget" | "score" | "lastContact";

const LIST_COLUMNS: { key: ListSortKey; label: string }[] = [
  { key: "name", label: "Lead" },
  { key: "interest", label: "Intérêt" },
  { key: "channel", label: "Source" },
  { key: "status", label: "Statut" },
  { key: "budget", label: "Budget" },
  { key: "score", label: "Score" },
  { key: "lastContact", label: "Dernier contact" },
];

function ListView({ leads, onOpen }: { leads: Lead[]; onOpen: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<ListSortKey | null>(null);
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const toggle = (k: ListSortKey) => {
    if (sortKey === k) {
      if (dir === "asc") setDir("desc");
      else {
        setSortKey(null);
        setDir("asc");
      }
    } else {
      setSortKey(k);
      setDir("asc");
    }
  };

  const rows = useMemo(() => {
    if (!sortKey) return leads;
    const s = dir === "asc" ? 1 : -1;
    return [...leads].sort((a, b) => {
      switch (sortKey) {
        case "budget":
          return (a.budgetValue - b.budgetValue) * s;
        case "score":
          return (a.score - b.score) * s;
        case "lastContact":
          return (new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime()) * s;
        case "interest":
          return a.interest.localeCompare(b.interest) * s;
        case "channel":
          return a.channel.localeCompare(b.channel) * s;
        case "status":
          return (LEAD_STATUSES.indexOf(a.status) - LEAD_STATUSES.indexOf(b.status)) * s;
        default:
          return a.name.localeCompare(b.name) * s;
      }
    });
  }, [leads, sortKey, dir]);

  return (
    <div className="panel overflow-x-auto">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Trier la liste</span>
        {LIST_COLUMNS.map((c) => (
          <button
            key={c.key}
            onClick={() => toggle(c.key)}
            className={`press inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition-colors ${
              sortKey === c.key
                ? "border-primary bg-primary/15 font-semibold"
                : "border-border text-muted-foreground hover:border-primary/60"
            }`}
          >
            {c.label}
            {sortKey === c.key && (dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          </button>
        ))}
        {sortKey && (
          <button
            onClick={() => {
              setSortKey(null);
              setDir("asc");
            }}
            className="press rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/60"
          >
            Réinitialiser le tri
          </button>
        )}
      </div>
      <table className="w-full min-w-[860px]">
        <thead className="border-b border-border bg-sidebar/60">
          <tr>
            {LIST_COLUMNS.map((h) => (
              <th key={h.key} className="px-4 py-3 text-left">
                <button
                  onClick={() => toggle(h.key)}
                  className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-primary ${
                    sortKey === h.key ? "font-semibold text-primary" : "text-muted-foreground"
                  }`}
                >
                  {h.label}
                  {sortKey === h.key ? (
                    dir === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((l, i) => {
            const Icon = channelIcon[l.channel];
            return (
              <tr
                key={l.id}
                onClick={() => onOpen(l.id)}
                style={{ animationDelay: `${i * 25}ms` }}
                className="animate-rise cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold">{l.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {l.id} · {l.city}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm">{l.interest}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
                    style={{
                      background: `color-mix(in oklab, ${channelColor[l.channel]} 14%, transparent)`,
                      color: channelColor[l.channel],
                    }}
                  >
                    <Icon className="h-3 w-3" /> {l.channel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={l.status} tone={leadStatusTone(l.status)} />
                </td>
                <td className="px-4 py-3 text-sm font-medium">{l.budget}</td>
                <td className="px-4 py-3">
                  <ScorePill score={l.score} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(l.lastContact)}</td>
              </tr>
            );
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                Aucun lead ne correspond à ces filtres.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Fiche lead ---------------- */

function LeadDrawer({
  lead,
  onClose,
  onConvert,
  onLost,
}: {
  lead: Lead;
  onClose: () => void;
  onConvert: () => void;
  onLost: () => void;
}) {
  const Icon = channelIcon[lead.channel];
  const [rdv, setRdv] = useState(false);
  const [tab, setTab] = useState<"apercu" | "historique" | "agent">("apercu");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/50 animate-in fade-in duration-200" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[580px] flex-col overflow-y-auto border-l border-border bg-background shadow-lift animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: `color-mix(in oklab, ${channelColor[lead.channel]} 18%, transparent)`,
                color: channelColor[lead.channel],
              }}
            >
              {lead.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Fiche lead · {lead.id}</p>
              <h2 className="display-title truncate text-2xl uppercase">{lead.name}</h2>
              <p className="truncate text-sm text-muted-foreground">{lead.project}</p>
            </div>
            <button onClick={onClose} className="press ml-auto rounded-full border border-border p-2 hover:border-primary hover:text-primary">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge label={lead.status} tone={leadStatusTone(lead.status)} />
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
              style={{
                background: `color-mix(in oklab, ${channelColor[lead.channel]} 14%, transparent)`,
                color: channelColor[lead.channel],
              }}
            >
              <Icon className="h-3 w-3" /> {lead.channel}
            </span>
            <ScorePill score={lead.score} />
          </div>

          <div className="mt-4 flex gap-1 rounded-lg border border-border bg-card p-1">
            {([
              ["apercu", "Aperçu"],
              ["historique", "Historique"],
              ["agent", "Agent IA"],
            ] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`press flex-1 rounded-md px-3 py-1.5 text-xs font-medium ${
                  tab === k ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          {tab === "apercu" && (
            <div className="animate-page space-y-5">
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-5">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Intérêt</p>
                </div>
                <p className="display-title mt-2 text-2xl">{lead.interest}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bien recherché : {lead.project} · Budget {lead.budget}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Info icon={Mail} label="E-mail" value={lead.email} />
                <Info icon={Phone} label="Téléphone" value={lead.phone} />
                <Info icon={MapPin} label="Ville" value={lead.city} />
                <Info icon={Wallet} label="Budget estimé" value={lead.budget} />
                <Info icon={Clock} label="Lead créé le" value={fmtDate(lead.createdAt)} />
                <Info icon={Clock} label="Dernier contact" value={fmtDate(lead.lastContact)} />
              </div>

              <div className="panel p-5">
                <SectionTitle>Rendez-vous</SectionTitle>
                {lead.appointment || rdv ? (
                  <div className="flex items-center gap-3 rounded-lg border border-[var(--emerald)]/40 bg-[var(--emerald)]/10 p-4">
                    <CalendarCheck className="h-5 w-5 text-[var(--emerald)]" />
                    <div>
                      <p className="text-sm font-medium">
                        {lead.appointment
                          ? `${lead.appointment.date} à ${lead.appointment.time}`
                          : "Jeudi 14h — créneau réservé"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Consultant : {lead.appointment?.consultant ?? "Houda Bennis"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun rendez-vous programmé pour ce lead.</p>
                )}
              </div>

              <HumanCheckBadge>Décision humaine requise pour la conversion</HumanCheckBadge>
            </div>
          )}

          {tab === "historique" && (
            <div className="animate-page space-y-5">
              <div className="panel p-5">
                <SectionTitle>Historique</SectionTitle>
                <Timeline
                  items={
                    rdv
                      ? [...lead.timeline, { label: "Rendez-vous confirmé", date: "Aujourd'hui", detail: "Créneau réservé par l'agent IA" }]
                      : lead.timeline
                  }
                />
              </div>
              <div className="panel p-5">
                <SectionTitle>Interactions</SectionTitle>
                <ul className="space-y-2">
                  {lead.interactions.map((it, i) => (
                    <li
                      key={i}
                      style={{ animationDelay: `${i * 70}ms` }}
                      className="animate-rise flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
                    >
                      <span className="rounded-md bg-[var(--azure)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--azure)]">
                        {it.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm">{it.label}</p>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "agent" && (
            <div className="dark-panel animate-page p-5">
              <div className="mb-4 flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <p className="display-title text-sm uppercase tracking-[0.15em] text-primary">Agent IA de prospection</p>
                <span className="ml-auto rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                  Simulation
                </span>
              </div>
              <div className="space-y-3">
                {lead.conversation.map((m, i) => (
                  <div
                    key={i}
                    className={`animate-rise flex ${m.from === "agent" ? "justify-start" : "justify-end"}`}
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs ${
                        m.from === "agent"
                          ? "bg-[oklch(0.28_0.01_70)] text-[oklch(0.93_0.01_88)]"
                          : "bg-primary/90 text-[oklch(0.16_0.004_60)]"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      <p className="mt-1 text-[10px] opacity-60">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setRdv(true);
                  toast.success("Rendez-vous simulé confirmé", { description: "Jeudi 14h avec un consultant." });
                }}
                className="press mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:bg-primary/15"
              >
                <CalendarCheck className="h-4 w-4" />
                {rdv ? "Rendez-vous confirmé" : "Simuler la prise de rendez-vous"}
              </button>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 mt-auto flex gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
          <button
            onClick={onConvert}
            className="press flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:shadow-lift"
          >
            <UserCheck className="h-4 w-4" /> Convertir en client
          </button>
          <button
            onClick={onLost}
            className="press flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/40 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-destructive hover:bg-destructive/10"
          >
            <UserX className="h-4 w-4" /> Marquer comme perdu
          </button>
        </div>
      </aside>
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3 w-3 text-primary" /> {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
