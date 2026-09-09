import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import heroVilla from "@/assets/hero-villa.jpg";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Connexion — CRM Lead Advisory Consulting" },
      {
        name: "description",
        content:
          "Connexion à la plateforme CRM interne de Lead Advisory Consulting : prospection, dossiers clients, reporting et agents IA.",
      },
      { property: "og:title", content: "Connexion — CRM Lead Advisory Consulting" },
      {
        property: "og:description",
        content: "Plateforme CRM immobilière interne de Lead Advisory Consulting, Harhoura, Témara.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const STEPS = ["Vérification des accès…", "Chargement des données CRM…", "Préparation de votre espace…"];

  const enter = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 550);
    const t2 = setTimeout(() => setStep(2), 1100);
    setTimeout(() => {
      clearTimeout(t1);
      clearTimeout(t2);
      navigate({ to: "/dashboard" });
    }, 1700);
  };

  return (
    <div className="relative grid h-screen overflow-hidden lg:grid-cols-2">
      <div className="flex h-full flex-col justify-center overflow-y-auto px-8 py-8 lg:px-16">
        <Logo />

        <div className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-primary">Plateforme interne</p>
          <h1 className="display-title mt-2 text-3xl uppercase leading-tight lg:text-4xl">
            Connexion à votre espace de travail
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Prospection assistée par agents IA, dossiers clients, reporting et automatisation marketing.
          </p>
        </div>

        <form onSubmit={enter} className="mt-7 max-w-md space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Identifiant</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-card px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                defaultValue="consultant@leadadvisoryconsulting.ma"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Mot de passe</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-card px-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input type="password" defaultValue="leadadvisory" className="w-full bg-transparent py-3 text-sm outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-[var(--gold)]" />
              Rester connecté
            </label>
            <span className="cursor-pointer transition-colors hover:text-primary">Mot de passe oublié ?</span>
          </div>

          <button
            type="submit"
            className="press group flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary transition-all hover:shadow-lift disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Connexion…
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Accès réservé aux consultants Lead Advisory Consulting
          </p>
        </form>
      </div>

      <div className="relative hidden h-full lg:block">
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
            CRM immobilier
          </span>
          <h2 className="display-title mt-4 text-3xl uppercase">Harhoura · Témara · Rabat</h2>
        </div>
      </div>

      {loading && (
        <div className="animate-page fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background/85 backdrop-blur-md">
          <span className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-primary/25" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            <Logo compact />
          </span>
          <div className="text-center">
            <p className="display-title text-lg uppercase tracking-[0.16em]">Chargement de la plateforme</p>
            <p className="mt-1 text-sm text-muted-foreground">{STEPS[step]}</p>
          </div>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
