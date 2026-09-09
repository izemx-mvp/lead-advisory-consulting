import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Bell, FileText, Mail, RefreshCcw, Receipt, Check } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { HumanCheckBadge, SectionTitle, StatusBadge, Timeline } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";

export const Route = createFileRoute("/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Fiche client — CRM Lead Advisory Consulting" },
      { name: "description", content: "Devis, facturation, communication et suivi du dossier client." },
      { property: "og:title", content: "Fiche client — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Suivi complet d'un dossier client immobilier." },
    ],
  }),
  component: ClientDetail,
});

const TABS = ["Informations", "Devis", "Facturation", "Communication", "Suivi du dossier"] as const;

function ClientDetail() {
  const { clientId } = useParams({ from: "/clients/$clientId" });
  const { clients, validateQuote, addClientEvent } = useCrm();
  const client = clients.find((c) => c.id === clientId);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Informations");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!client) {
    return (
      <AppShell title="Fiche client">
        <p className="text-sm text-muted-foreground">Dossier introuvable.</p>
        <Link to="/clients" className="mt-4 inline-block text-sm text-primary hover:underline">
          Retour à la liste des clients
        </Link>
      </AppShell>
    );
  }

  const sendMail = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      addClientEvent(client.id, { label: "E-mail envoyé", date: "Aujourd'hui", detail: subject || "Suivi de dossier" }, "E-mail envoyé au client");
      setSubject("");
      setMessage("");
      toast.success("E-mail simulé envoyé", { description: "Aucun envoi réel — prototype de démonstration." });
    }, 900);
  };

  return (
    <AppShell title={client.name} subtitle={`${client.project} · Dossier ${client.id}`}>
      <Link to="/clients" className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Liste des clients
      </Link>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              tab === t ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:border-primary/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {tab === "Informations" && (
            <div className="panel animate-rise p-5">
              <SectionTitle>Informations client</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nom" value={client.name} />
                <Field label="Projet immobilier" value={client.project} />
                <Field label="E-mail" value={client.email} />
                <Field label="Téléphone" value={client.phone} />
                <Field label="Statut du dossier" value={client.dossier} />
                <Field label="Montant" value={client.amount ? `${client.amount.toLocaleString("fr-FR")} MAD` : "À définir"} />
              </div>
            </div>
          )}

          {tab === "Devis" && (
            <div className="panel animate-rise p-5">
              <SectionTitle action={<HumanCheckBadge />}>Devis</SectionTitle>
              <div className="space-y-3">
                {client.quotes.map((q) => (
                  <div key={q.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:shadow-soft">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{q.label}</p>
                      <p className="text-xs text-muted-foreground">{q.id}</p>
                    </div>
                    <span className="ml-auto text-sm font-medium">{q.amount.toLocaleString("fr-FR")} MAD</span>
                    <StatusBadge
                      label={q.status}
                      tone={q.status === "Validé" ? "success" : q.status === "Refusé" ? "danger" : "warning"}
                    />
                    {q.status === "En attente" && (
                      <button
                        onClick={() => {
                          validateQuote(client.id, q.id);
                          toast.success(`Devis ${q.id} validé`, { description: "Validation humaine enregistrée." });
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift"
                      >
                        <Check className="h-3.5 w-3.5" /> Valider le devis
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Facturation" && (
            <div className="panel animate-rise p-5">
              <SectionTitle action={<HumanCheckBadge>Confirmation humaine du paiement</HumanCheckBadge>}>
                Facturation & paiements
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                {client.invoices.length === 0 && <p className="text-sm text-muted-foreground">Aucune facture émise.</p>}
                {client.invoices.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-lg border bg-background p-4 ${
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Communication" && (
            <div className="panel animate-rise p-5">
              <SectionTitle>Communication</SectionTitle>
              <form onSubmit={sendMail} className="space-y-3">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet de l'e-mail"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Votre message…"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift disabled:opacity-60"
                  >
                    <Mail className="h-4 w-4" /> {sending ? "Envoi en cours…" : "Envoyer l'e-mail"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addClientEvent(client.id, { label: "Relance envoyée", date: "Aujourd'hui", detail: "Relance de suivi de dossier" }, "Relance envoyée au client");
                      toast.success("Relance simulée envoyée");
                    }}
                    className="flex items-center gap-2 rounded-lg border border-primary/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[oklch(0.45_0.07_63)] transition-colors hover:bg-primary/15"
                  >
                    <RefreshCcw className="h-4 w-4" /> Envoyer une relance
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">Simulation — aucun e-mail réel n'est envoyé.</p>
              </form>
            </div>
          )}

          {tab === "Suivi du dossier" && (
            <div className="panel animate-rise p-5">
              <SectionTitle>Suivi global du dossier</SectionTitle>
              <Timeline items={client.timeline} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="panel p-5">
            <SectionTitle>Notifications</SectionTitle>
            <ul className="space-y-2">
              {client.notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                  <Bell className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
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
            <p className="display-title text-sm uppercase tracking-[0.15em] text-primary">Timeline du dossier</p>
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
