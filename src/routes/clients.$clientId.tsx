import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Receipt,
  RefreshCcw,
  Send,
  Sparkles,
  StickyNote,
  User,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HumanCheckBadge, SectionTitle, StatusBadge, Timeline } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import { COMM_TEMPLATES, COMM_THREADS, type CommMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Dossier client — CRM Lead Advisory Consulting" },
      { name: "description", content: "Parcours de gestion du dossier : informations, devis, validation, facturation, communication et suivi." },
      { property: "og:title", content: "Dossier client — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Suivi étape par étape d'un dossier client immobilier." },
    ],
  }),
  component: ClientDetail,
});

const STEPS = [
  { key: "infos", label: "Informations client", icon: User },
  { key: "devis", label: "Devis", icon: FileText },
  { key: "validation", label: "Validation", icon: CheckCircle2 },
  { key: "facturation", label: "Facturation & paiements", icon: Receipt },
  { key: "communication", label: "Communication", icon: MessageSquare },
  { key: "suivi", label: "Suivi du dossier", icon: Clock },
] as const;

function ClientDetail() {
  const { clientId } = useParams({ from: "/clients/$clientId" });
  const { clients, validateQuote, addQuote, addInvoice, payInvoice, addClientEvent } = useCrm();
  const client = clients.find((c) => c.id === clientId);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  if (!client) {
    return (
      <AppShell title="Dossier client">
        <p className="text-sm text-muted-foreground">Dossier introuvable.</p>
        <Link to="/clients" className="mt-4 inline-block text-sm text-primary hover:underline">
          Retour à la liste des clients
        </Link>
      </AppShell>
    );
  }

  const validated = client.quotes.filter((q) => q.status === "Validé");
  const pending = client.quotes.filter((q) => q.status === "En attente");
  const paid = client.invoices.filter((f) => f.status === "Payée");
  const paidAmount = paid.reduce((s, f) => s + f.amount, 0);
  const totalInvoiced = client.invoices.reduce((s, f) => s + f.amount, 0);

  const done = [
    true,
    client.quotes.length > 0,
    validated.length > 0,
    client.invoices.length > 0,
    true,
    client.dossier === "Clôturé",
  ];
  const progress = Math.round((done.filter(Boolean).length / STEPS.length) * 100);

  const generateQuote = () => {
    setGenerating(true);
    setTimeout(() => {
      const id = `D-${2300 + client.quotes.length + Math.floor(Math.random() * 90)}`;
      addQuote(client.id, {
        id,
        label: `Accompagnement — ${client.project}`,
        amount: Math.max(45000, Math.round((client.amount || 1500000) * 0.045)),
        status: "En attente",
      });
      setGenerating(false);
      toast.success("Devis généré et envoyé au client", {
        description: `${id} — en attente de validation.`,
      });
    }, 1400);
  };

  return (
    <AppShell title={client.name} subtitle={`${client.project} · Dossier ${client.id}`}>
      <Link
        to="/clients"
        className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Liste des clients
      </Link>

      {/* Stepper */}
      <div className="panel animate-rise mb-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="display-title text-lg uppercase tracking-[0.12em]">Parcours du dossier</p>
            <p className="text-xs text-muted-foreground">
              Étape {step + 1} / {STEPS.length} — {STEPS[step]!.label}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge
              label={client.dossier}
              tone={client.dossier === "Clôturé" ? "neutral" : client.dossier === "En cours" ? "gold" : "info"}
            />
            <span className="text-xs text-muted-foreground">{progress} % complété</span>
          </div>
        </div>

        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            return (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                className={`press flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                  active
                    ? "border-primary bg-primary/12 font-semibold text-foreground shadow-soft"
                    : done[i]
                      ? "border-[var(--emerald)]/40 bg-[var(--emerald)]/8 text-muted-foreground hover:border-primary/60"
                      : "border-border text-muted-foreground hover:border-primary/60"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done[i] ? "bg-[var(--emerald)]/20 text-[var(--emerald)]" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done[i] ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {step === 0 && (
            <>
              <div className="panel animate-rise overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 border-b border-border bg-sidebar/60 p-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
                    {client.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="display-title text-xl uppercase tracking-[0.08em]">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.project}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Valeur du dossier</p>
                    <p className="display-title text-2xl">{client.amount.toLocaleString("fr-FR")} MAD</p>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  <Field icon={Mail} label="E-mail" value={client.email} />
                  <Field icon={Phone} label="Téléphone" value={client.phone} />
                  <Field icon={Building2} label="Projet immobilier" value={client.project} />
                  <Field icon={Clock} label="Statut du dossier" value={client.dossier} />
                  <Field icon={FileText} label="Devis" value={`${client.quotes.length} · ${validated.length} validé(s)`} />
                  <Field icon={Wallet} label="Encaissé" value={`${paidAmount.toLocaleString("fr-FR")} MAD`} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MiniStat label="Devis en attente" value={`${pending.length}`} accent="var(--warning)" />
                <MiniStat label="Factures émises" value={`${client.invoices.length}`} accent="var(--azure)" />
                <MiniStat
                  label="Taux d'encaissement"
                  value={totalInvoiced ? `${Math.round((paidAmount / totalInvoiced) * 100)} %` : "—"}
                  accent="var(--emerald)"
                />
              </div>
            </>
          )}

          {step === 1 && (
            <div className="panel animate-rise p-5">
              <SectionTitle action={<HumanCheckBadge />}>Devis du dossier</SectionTitle>

              <div className="mb-5 rounded-xl border border-dashed border-primary/45 bg-primary/8 p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Générer un nouveau devis</p>
                    <p className="text-xs text-muted-foreground">
                      Le devis est préparé à partir des données du dossier puis envoyé au client.
                    </p>
                  </div>
                  <button
                    onClick={generateQuote}
                    disabled={generating}
                    className="press ml-auto flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift disabled:opacity-60"
                  >
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {generating ? "Génération en cours…" : "Générer & envoyer"}
                  </button>
                </div>
                {generating && (
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/2 animate-shimmer rounded-full bg-primary" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {client.quotes.map((q) => (
                  <div
                    key={q.id}
                    className="animate-rise flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:shadow-soft"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{q.label}</p>
                      <p className="text-xs text-muted-foreground">{q.id}</p>
                    </div>
                    <span className="ml-auto text-sm font-medium">{q.amount.toLocaleString("fr-FR")} MAD</span>
                    <StatusBadge
                      label={q.status === "En attente" ? "En attente de validation" : q.status}
                      tone={q.status === "Validé" ? "success" : q.status === "Refusé" ? "danger" : "warning"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="panel animate-rise p-5">
              <SectionTitle action={<HumanCheckBadge>Validation humaine du devis</HumanCheckBadge>}>
                Validation des devis
              </SectionTitle>
              <div className="space-y-3">
                {client.quotes.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun devis à valider — revenez à l'étape précédente.</p>
                )}
                {client.quotes.map((q) => (
                  <div
                    key={q.id}
                    className={`animate-rise rounded-xl border p-4 transition-all ${
                      q.status === "Validé" ? "border-[var(--emerald)]/45 bg-[var(--emerald)]/8" : "border-border bg-background"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold">{q.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {q.id} · {q.amount.toLocaleString("fr-FR")} MAD
                        </p>
                      </div>
                      <StatusBadge
                        label={q.status === "En attente" ? "En attente de validation" : q.status}
                        tone={q.status === "Validé" ? "success" : q.status === "Refusé" ? "danger" : "warning"}
                      />
                      {q.status === "En attente" && (
                        <button
                          onClick={() => {
                            validateQuote(client.id, q.id);
                            toast.success(`Devis ${q.id} validé`, { description: "Le dossier peut passer à la facturation." });
                          }}
                          className="press ml-auto flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift"
                        >
                          <Check className="h-3.5 w-3.5" /> Valider le devis
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {validated.length > 0 && (
                <p className="mt-4 flex items-center gap-2 text-sm text-[var(--emerald)]">
                  <CheckCircle2 className="h-4 w-4" /> Devis validé — passage à la facturation possible.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="panel animate-rise p-5">
              <SectionTitle action={<HumanCheckBadge>Confirmation humaine du paiement</HumanCheckBadge>}>
                Facturation & paiements
              </SectionTitle>

              {validated.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun devis validé : validez un devis à l'étape précédente pour émettre une facture.
                </p>
              ) : (
                <button
                  onClick={() => {
                    const q = validated[0]!;
                    const id = `F-${5600 + client.invoices.length + Math.floor(Math.random() * 80)}`;
                    addInvoice(client.id, {
                      id,
                      label: `Facture — ${q.label}`,
                      amount: Math.round(q.amount * 0.4),
                      status: "En attente",
                      due: "30/09/2026",
                    });
                    toast.success(`Facture ${id} émise`, { description: "Envoyée au client — en attente de paiement." });
                  }}
                  className="press mb-5 flex items-center gap-2 rounded-lg border border-primary/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/15"
                >
                  <Receipt className="h-4 w-4" /> Émettre une facture d'acompte
                </button>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {client.invoices.length === 0 && <p className="text-sm text-muted-foreground">Aucune facture émise.</p>}
                {client.invoices.map((f) => (
                  <div
                    key={f.id}
                    className={`animate-rise rounded-xl border bg-background p-4 transition-all hover:shadow-soft ${
                      f.status === "En retard" ? "border-destructive/50" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">{f.label}</p>
                    </div>
                    <p className="display-title mt-3 text-2xl">{f.amount.toLocaleString("fr-FR")} MAD</p>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusBadge
                        label={f.status}
                        tone={f.status === "Payée" ? "success" : f.status === "En retard" ? "danger" : "warning"}
                      />
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Échéance {f.due}</span>
                    </div>
                    {f.status !== "Payée" && (
                      <button
                        onClick={() => {
                          payInvoice(client.id, f.id);
                          toast.success(`Paiement enregistré — ${f.id}`);
                        }}
                        className="press mt-3 w-full rounded-lg border border-[var(--emerald)]/50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--emerald)] transition-colors hover:bg-[var(--emerald)]/12"
                      >
                        Confirmer le paiement
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && <Communication clientId={client.id} clientName={client.name} onEvent={addClientEvent} />}

          {step === 5 && (
            <div className="panel animate-rise p-5">
              <SectionTitle>Suivi global du dossier</SectionTitle>
              <Timeline items={client.timeline} />
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="press flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Étape précédente
            </button>
            <button
              onClick={() => {
                if (step === 2 && validated.length === 0) {
                  toast.warning("Validez d'abord un devis pour continuer");
                  return;
                }
                setStep((s) => Math.min(STEPS.length - 1, s + 1));
              }}
              disabled={step === STEPS.length - 1}
              className="press flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift disabled:opacity-40"
            >
              Étape suivante <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-5">
            <SectionTitle>Notifications du dossier</SectionTitle>
            <ul className="space-y-2">
              {client.notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-sm">{n.label}</p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{n.date}</p>
                  </div>
                  <span className="ml-auto">
                    <StatusBadge label={n.tone === "success" ? "OK" : n.tone === "warning" ? "Alerte" : "Info"} tone={n.tone} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="dark-panel p-5">
            <p className="display-title text-sm uppercase tracking-[0.15em] text-primary">Dernières étapes</p>
            <ol className="mt-3 space-y-2">
              {client.timeline.slice(-4).map((t, i) => (
                <li key={i} className="text-xs text-[oklch(0.85_0.01_84)]">
                  <span className="text-primary">◆</span> {t.label} — {t.date}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Communication({
  clientId,
  clientName,
  onEvent,
}: {
  clientId: string;
  clientName: string;
  onEvent: (id: string, e: { label: string; date: string; detail?: string }, notif?: string) => void;
}) {
  const initial = useMemo(() => COMM_THREADS[clientId] ?? [], [clientId]);
  const [thread, setThread] = useState<CommMessage[]>(initial);
  const [channel, setChannel] = useState<CommMessage["channel"]>("E-mail");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<string>("Tous");

  const filtered = filter === "Tous" ? thread : thread.filter((m) => m.channel === filter);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() && !message.trim()) {
      toast.warning("Renseignez un objet ou un message");
      return;
    }
    setSending(true);
    setTimeout(() => {
      const msg: CommMessage = {
        id: `M-${Date.now()}`,
        channel,
        direction: "sortant",
        subject: subject || "Suivi de dossier",
        body: message || "—",
        date: "Aujourd'hui",
        state: "Envoyé",
      };
      setThread((p) => [msg, ...p]);
      onEvent(clientId, { label: `${channel} envoyé`, date: "Aujourd'hui", detail: msg.subject }, `${channel} envoyé au client`);
      setSubject("");
      setMessage("");
      setSending(false);
      toast.success(`${channel} envoyé à ${clientName}`);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div className="panel animate-rise p-5">
        <SectionTitle>Nouveau message</SectionTitle>
        <form onSubmit={send} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Canal</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as CommMessage["channel"])}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {["E-mail", "WhatsApp", "Appel", "Note interne"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Modèle de message</label>
              <select
                value={template}
                onChange={(e) => {
                  const t = COMM_TEMPLATES.find((x) => x.id === e.target.value);
                  setTemplate(e.target.value);
                  if (t) {
                    setSubject(t.subject);
                    setMessage(t.body);
                    toast.info(`Modèle « ${t.label} » appliqué`);
                  }
                }}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Aucun modèle</option>
                {COMM_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Objet</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet du message"
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Votre message…"
              className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">{message.length} caractères</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={sending}
              className="press flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Envoi en cours…" : "Envoyer"}
            </button>
            <button
              type="button"
              onClick={() => {
                setThread((p) => [
                  {
                    id: `M-${Date.now()}`,
                    channel: "E-mail",
                    direction: "sortant",
                    subject: "Relance de suivi",
                    body: "Relance automatique de suivi de dossier.",
                    date: "Aujourd'hui",
                    state: "Envoyé",
                  },
                  ...p,
                ]);
                onEvent(clientId, { label: "Relance envoyée", date: "Aujourd'hui" }, "Relance envoyée au client");
                toast.success("Relance envoyée");
              }}
              className="press flex items-center gap-2 rounded-lg border border-primary/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/15"
            >
              <RefreshCcw className="h-4 w-4" /> Envoyer une relance
            </button>
            <button
              type="button"
              onClick={() => {
                setSubject("");
                setMessage("");
                setTemplate("");
              }}
              className="press rounded-lg border border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <div className="panel animate-rise p-5">
        <SectionTitle
          action={
            <div className="flex flex-wrap gap-1.5">
              {["Tous", "E-mail", "WhatsApp", "Appel", "Note interne"].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] transition-all ${
                    filter === c
                      ? "border-primary bg-primary/15 font-semibold text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          }
        >
          Historique des échanges
        </SectionTitle>

        <ul className="space-y-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">Aucun échange sur ce canal.</p>}
          {filtered.map((m, i) => {
            const Icon =
              m.channel === "Appel" ? Phone : m.channel === "WhatsApp" ? MessageSquare : m.channel === "Note interne" ? StickyNote : Mail;
            return (
              <li
                key={m.id}
                className={`animate-rise rounded-xl border p-4 transition-all hover:shadow-soft ${
                  m.direction === "entrant" ? "border-[var(--azure)]/40 bg-[var(--azure)]/8" : "border-border bg-background"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-semibold">{m.subject}</p>
                  <StatusBadge label={m.direction === "entrant" ? "Reçu" : m.channel} tone={m.direction === "entrant" ? "info" : "gold"} />
                  <StatusBadge
                    label={m.state}
                    tone={m.state === "Répondu" ? "success" : m.state === "Lu" ? "teal" : m.state === "Envoyé" ? "violet" : "neutral"}
                  />
                  <span className="ml-auto text-[11px] uppercase tracking-wider text-muted-foreground">{m.date}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{m.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-soft">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="panel panel-hover animate-rise overflow-hidden p-4">
      <span className="mb-2 block h-1 w-10 rounded-full" style={{ background: accent }} />
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="display-title mt-1 text-2xl">{value}</p>
    </div>
  );
}
