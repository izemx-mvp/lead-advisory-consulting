import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import heroVilla from "@/assets/hero-villa.jpg";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lead Advisory Consulting — Espace CRM immobilier" },
      {
        name: "description",
        content:
          "Accès à la plateforme CRM immobilière de Lead Advisory Consulting : prospection, clients, reporting et agents IA.",
      },
      { property: "og:title", content: "Lead Advisory Consulting — Espace CRM immobilier" },
      {
        property: "og:description",
        content: "Plateforme CRM immobilière premium pour Lead Advisory Consulting, Harhoura, Témara.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const enter = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 700);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-14 lg:px-20">
        <Logo />
        <p className="mt-12 text-xs uppercase tracking-[0.35em] text-primary">Espace client</p>
        <h1 className="display-title mt-3 text-4xl uppercase leading-tight lg:text-5xl">
          Votre partenaire stratégique en immobilier
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Plateforme CRM immobilière intelligente — prospection assistée par agents IA, gestion des
          dossiers clients, reporting et automatisation marketing.
        </p>

        <form onSubmit={enter} className="mt-10 max-w-md space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Identifiant</label>
            <input
              defaultValue="consultant@leadadvisory.ma"
              className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Mot de passe</label>
            <input
              type="password"
              defaultValue="demonstration"
              className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </div>
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary transition-all hover:shadow-lift disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Connexion…" : "Accéder à la plateforme"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Écran illustratif — prototype de démonstration, aucune authentification réelle.
          </p>
        </form>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={heroVilla}
          alt="Villa de standing à Souissi au coucher du soleil"
          width={1600}
          height={1100}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.004_60)] via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-[oklch(0.96_0.01_84)]">
          <span className="rounded-full border border-primary/60 bg-[oklch(0.16_0.004_60)]/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">
            Opportunité exclusive
          </span>
          <h2 className="display-title mt-4 text-3xl uppercase">Harhoura · Témara · Rabat</h2>
          <p className="mt-2 max-w-md text-sm text-[oklch(0.85_0.01_84)]">
            16 ans d'expérience au service des investisseurs et des particuliers.
          </p>
        </div>
      </div>
    </div>
  );
}
