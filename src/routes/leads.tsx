import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  Bot,
  CalendarCheck,
  UserCheck,
  UserX,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HumanCheckBadge, SectionTitle, StatusBadge, Timeline, leadStatusTone } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import { CHANNELS, LEAD_STATUSES, type Channel, type Lead, type LeadStatus } from "@/lib/mock-data";

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

const channelIcon: Record<Channel, React.ComponentType<{ className?: string }>> = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  "Site web": Globe,
  Avito: Store,
  "Partenariat agence": Handshake,
  "Prospection directe": PhoneCall,
};

function LeadsPage() {
  const { leads, setLeadStatus, convertLead } = useCrm();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<Channel | null>(null);
  const [status, setStatus] = useState<LeadStatus | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      leads.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) &&
          (!channel || l.channel === channel) &&
          (!status || l.status === status),
      ),
    [leads, query, channel, status],
  );

  const openLead = leads.find((l) => l.id === openId) ?? null;

  const move = (id: string, to: LeadStatus) => {
    setLeadStatus(id, to);
    toast.success(`Statut mis à jour : ${to}`);
  };

  return (
    <AppShell title="Prospection / Leads" subtitle="Pipeline commercial et qualification par agent IA">
      <div className="panel mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un lead par nom…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <button
            onClick={() => {
              setChannel(null);
              setStatus(null);
              setQuery("");
            }}
            className="rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            Réinitialiser
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <button
              key={c}
              onClick={() => setChannel(channel === c ? null : c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                channel === c
                  ? "border-primary bg-primary/15 font-semibold text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(status === s ? null : s)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                status === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-flow-col gap-4 overflow-x-auto pb-4" style={{ gridAutoColumns: "minmax(250px, 1fr)" }}>
        {LEAD_STATUSES.map((s) => {
          const items = filtered.filter((l) => l.status === s);
          return (
            <div
              key={s}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) move(dragId, s);
                setDragId(null);
              }}
              className="flex flex-col rounded-xl border border-border bg-sidebar/60 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{s}</p>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-[oklch(0.45_0.07_63)]">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((l) => (
                  <LeadCard key={l.id} lead={l} onOpen={() => setOpenId(l.id)} onDragStart={() => setDragId(l.id)} onQuickMove={move} />
                ))}
                {items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                    Déposer un lead ici
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openLead && (
        <LeadDrawer
          lead={openLead}
          onClose={() => setOpenId(null)}
          onConvert={() => {
            convertLead(openLead.id);
            toast.success(`${openLead.name} converti en client`, { description: "Dossier client créé dans le module Clients / Ventes." });
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

function LeadCard({
  lead,
  onOpen,
  onDragStart,
  onQuickMove,
}: {
  lead: Lead;
  onOpen: () => void;
  onDragStart: () => void;
  onQuickMove: (id: string, s: LeadStatus) => void;
}) {
  const Icon = channelIcon[lead.channel];
  const next = LEAD_STATUSES[Math.min(LEAD_STATUSES.indexOf(lead.status) + 1, LEAD_STATUSES.length - 2)];
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="animate-rise cursor-pointer rounded-lg border border-border bg-card p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lift active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{lead.name}</p>
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{lead.project}</p>
      <div className="mt-2 flex items-center justify-between">
        <StatusBadge label={lead.channel} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{lead.lastContact}</span>
      </div>
      {lead.status !== "Converti" && lead.status !== "Perdu" && next && next !== lead.status && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickMove(lead.id, next);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-primary/50 bg-primary/10 py-1.5 text-[11px] font-medium text-[oklch(0.45_0.07_63)] transition-colors hover:bg-primary/20"
        >
          Étape suivante <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </article>
  );
}

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/45 animate-in fade-in duration-200" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[560px] flex-col overflow-y-auto border-l border-border bg-background shadow-lift animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-border bg-background/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">Fiche lead</p>
            <h2 className="display-title text-2xl uppercase">{lead.name}</h2>
            <p className="text-sm text-muted-foreground">{lead.project}</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-full border border-border p-2 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            <Info label="E-mail" value={lead.email} />
            <Info label="Téléphone" value={lead.phone} />
            <Info label="Budget estimé" value={lead.budget} />
            <Info label="Dernier contact" value={lead.lastContact} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
              <Icon className="h-3.5 w-3.5 text-primary" /> {lead.channel}
            </span>
            <StatusBadge label={lead.status} tone={leadStatusTone(lead.status)} />
          </div>

          <div className="panel p-5">
            <SectionTitle>Historique</SectionTitle>
            <Timeline items={rdv ? [...lead.timeline, { label: "Rendez-vous confirmé", date: "Aujourd'hui", detail: "Créneau réservé par l'agent IA" }] : lead.timeline} />
          </div>

          <div className="dark-panel p-5">
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
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs ${
                      m.from === "agent"
                        ? "bg-[oklch(0.26_0.01_60)] text-[oklch(0.93_0.01_84)]"
                        : "bg-primary/85 text-[oklch(0.16_0.004_60)]"
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/15"
            >
              <CalendarCheck className="h-4 w-4" />
              {rdv ? "Rendez-vous confirmé" : "Simuler la prise de rendez-vous"}
            </button>
          </div>

          <HumanCheckBadge>Décision humaine requise pour la conversion</HumanCheckBadge>
        </div>

        <div className="sticky bottom-0 mt-auto flex gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
          <button
            onClick={onConvert}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-all hover:shadow-lift"
          >
            <UserCheck className="h-4 w-4" /> Convertir en client
          </button>
          <button
            onClick={onLost}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/40 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-destructive transition-colors hover:bg-destructive/10"
          >
            <UserX className="h-4 w-4" /> Marquer comme perdu
          </button>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
