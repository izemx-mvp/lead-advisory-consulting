import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatusBadge } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";

export const Route = createFileRoute("/clients/")({
  head: () => ({
    meta: [
      { title: "Clients & ventes — CRM Lead Advisory Consulting" },
      { name: "description", content: "Liste des dossiers clients, devis et montants du cabinet immobilier." },
      { property: "og:title", content: "Clients & ventes — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Gestion des dossiers clients issus des leads convertis." },
    ],
  }),
  component: ClientsPage,
});

type SortKey = "name" | "project" | "dossier" | "amount";

function ClientsPage() {
  const { clients } = useCrm();
  const navigate = useNavigate();
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "amount", dir: -1 });
  const [q, setQ] = useState("");
  const [dossier, setDossier] = useState<string | null>(null);

  const rows = useMemo(() => {
    const list = clients.filter(
      (c) =>
        (c.name.toLowerCase().includes(q.toLowerCase()) || c.project.toLowerCase().includes(q.toLowerCase())) &&
        (!dossier || c.dossier === dossier),
    );
    return [...list].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sort.dir;
      return String(av).localeCompare(String(bv)) * sort.dir;
    });
  }, [clients, q, dossier, sort]);

  const th = (key: SortKey, label: string, extra = "") => (
    <th
      className={`cursor-pointer select-none px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground ${extra}`}
      onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === 1 ? -1 : 1 }))}
    >
      <span className="inline-flex items-center gap-1">
        {label} <ArrowUpDown className="h-3 w-3" />
      </span>
    </th>
  );

  return (
    <AppShell title="Clients / Ventes" subtitle="Dossiers issus des leads convertis">
      <div className="panel mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un client ou un projet…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        {["Ouvert", "En cours", "Clôturé"].map((d) => (
          <button
            key={d}
            onClick={() => setDossier(dossier === d ? null : d)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
              dossier === d ? "border-primary bg-primary/15 font-semibold" : "border-border text-muted-foreground hover:border-primary/60"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-sidebar/60">
            <tr>
              {th("name", "Client")}
              {th("project", "Projet immobilier", "hidden md:table-cell")}
              {th("dossier", "Statut du dossier")}
              {th("amount", "Montant du devis")}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr
                key={c.id}
                onClick={() => navigate({ to: "/clients/$clientId", params: { clientId: c.id } })}
                className="animate-rise cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground md:hidden">{c.project}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.id}</p>
                </td>
                <td className="hidden px-4 py-4 text-sm md:table-cell">{c.project}</td>
                <td className="px-4 py-4">
                  <StatusBadge
                    label={c.dossier}
                    tone={c.dossier === "Clôturé" ? "neutral" : c.dossier === "En cours" ? "gold" : "info"}
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  {c.amount ? `${c.amount.toLocaleString("fr-FR")} MAD` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
