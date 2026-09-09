import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Bot, Pencil, Plus, X } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionTitle, StatusBadge } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import type { KnowledgeItem } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Base de connaissances — CRM Lead Advisory Consulting" },
      { name: "description", content: "Fiches métier et paramétrage des agents IA de prospection et de gestion clientèle." },
      { property: "og:title", content: "Base de connaissances — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Informations métier utilisées par les agents IA simulés." },
    ],
  }),
  component: KnowledgePage,
});

const CATEGORIES: KnowledgeItem["category"][] = [
  "Critères de qualification",
  "Projets immobiliers",
  "Réponses types",
];

function KnowledgePage() {
  const { knowledge, upsertKnowledge } = useCrm();
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [agents, setAgents] = useState({ prospection: true, clientele: true, relances: false, tonalite: "Professionnel & chaleureux" });

  return (
    <AppShell title="Base de connaissances" subtitle="Informations métier et paramétrage des agents IA">
      <div className="panel animate-rise p-5">
        <SectionTitle
          action={
            <button
              onClick={() =>
                setEditing({ id: `K-${Date.now()}`, category: "Réponses types", title: "", content: "" })
              }
              className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift"
            >
              <Plus className="h-4 w-4" /> Ajouter une information
            </button>
          }
        >
          Fiches d'information
        </SectionTitle>

        <div className="grid gap-3 md:grid-cols-2">
          {knowledge.map((k, i) => (
            <article
              key={k.id}
              className="animate-rise rounded-lg border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-2">
                <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{k.title}</p>
                  <StatusBadge label={k.category} />
                </div>
                <button
                  onClick={() => setEditing(k)}
                  className="ml-auto rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{k.content}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="dark-panel animate-rise mt-6 p-6">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <h2 className="display-title text-lg uppercase tracking-[0.14em] text-primary">
            Paramétrage des agents IA
          </h2>
        </div>
        <p className="mt-2 text-sm text-[oklch(0.8_0.01_84)]">
          Réglages illustratifs — aucune logique de configuration réelle en arrière-plan.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Toggle
            label="Agent de prospection"
            desc="Premier contact, collecte d'informations, qualification"
            on={agents.prospection}
            onChange={(v) => {
              setAgents({ ...agents, prospection: v });
              toast.success(`Agent de prospection ${v ? "activé" : "désactivé"}`);
            }}
          />
          <Toggle
            label="Agent de gestion clientèle"
            desc="Suivi de dossier et réponses aux questions courantes"
            on={agents.clientele}
            onChange={(v) => {
              setAgents({ ...agents, clientele: v });
              toast.success(`Agent de gestion clientèle ${v ? "activé" : "désactivé"}`);
            }}
          />
          <Toggle
            label="Relances automatiques"
            desc="Relance des leads sans réponse"
            on={agents.relances}
            onChange={(v) => {
              setAgents({ ...agents, relances: v });
              toast.success(`Relances automatiques ${v ? "activées" : "désactivées"}`);
            }}
          />
          <div className="rounded-lg border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.22_0.008_60)] p-4">
            <p className="text-sm font-medium text-[oklch(0.95_0.01_84)]">Tonalité des messages</p>
            <select
              value={agents.tonalite}
              onChange={(e) => setAgents({ ...agents, tonalite: e.target.value })}
              className="mt-3 w-full rounded-md border border-[oklch(1_0_0_/_0.15)] bg-[oklch(0.18_0.006_60)] px-3 py-2 text-sm text-[oklch(0.93_0.01_84)] outline-none"
            >
              <option>Professionnel &amp; chaleureux</option>
              <option>Formel</option>
              <option>Direct</option>
            </select>
          </div>
        </div>
      </div>

      {editing && (
        <Modal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(item) => {
            upsertKnowledge(item);
            setEditing(null);
            toast.success("Fiche enregistrée", { description: "Mise à jour locale du prototype." });
          }}
        />
      )}
    </AppShell>
  );
}

function Toggle({
  label,
  desc,
  on,
  onChange,
}: {
  label: string;
  desc: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.22_0.008_60)] p-4">
      <div>
        <p className="text-sm font-medium text-[oklch(0.95_0.01_84)]">{label}</p>
        <p className="text-xs text-[oklch(0.7_0.01_84)]">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`ml-auto h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-primary" : "bg-[oklch(0.35_0.01_60)]"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-[oklch(0.97_0.01_84)] transition-transform duration-300 ${on ? "translate-x-[22px]" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function Modal({
  item,
  onClose,
  onSave,
}: {
  item: KnowledgeItem;
  onClose: () => void;
  onSave: (i: KnowledgeItem) => void;
}) {
  const [draft, setDraft] = useState(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 animate-in fade-in duration-200" onClick={onClose} />
      <div className="panel animate-in zoom-in-95 fade-in relative w-full max-w-lg p-6 duration-200">
        <div className="flex items-start">
          <h2 className="display-title text-xl uppercase tracking-[0.1em]">
            {item.title ? "Modifier la fiche" : "Ajouter une information"}
          </h2>
          <button onClick={onClose} className="ml-auto rounded-full border border-border p-2 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.title.trim()) return;
            onSave(draft);
          }}
        >
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Catégorie</label>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as KnowledgeItem["category"] })}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Titre</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Contenu</label>
            <textarea
              rows={4}
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-ink py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-all hover:shadow-lift"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
