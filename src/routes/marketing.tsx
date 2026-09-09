import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Instagram, Linkedin, Sparkles, Send, ChevronDown } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionTitle, StatusBadge } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import { FAQ, GENERATED_POSTS } from "@/lib/mock-data";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Automatisation marketing — CRM Lead Advisory Consulting" },
      { name: "description", content: "Génération de contenus, préparation des publications et FAQ client." },
      { property: "og:title", content: "Automatisation marketing — CRM Lead Advisory Consulting" },
      { property: "og:description", content: "Préparer et publier les contenus immobiliers du cabinet." },
    ],
  }),
  component: MarketingPage,
});

const THEMES = Object.keys(GENERATED_POSTS);

function MarketingPage() {
  const { posts, publishPost, addPost } = useCrm();
  const [theme, setTheme] = useState(THEMES[0]!);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const generate = () => {
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(GENERATED_POSTS[theme] ?? "");
      setLoading(false);
      toast.success("Post généré", { description: "Contenu de démonstration pré-rédigé." });
    }, 1100);
  };

  return (
    <AppShell title="Marketing" subtitle="Contenus, publications et FAQ client">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel animate-rise p-5">
          <SectionTitle>Génération de contenus</SectionTitle>
          <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Type de bien ou thématique
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                  theme === t ? "border-primary bg-primary/15 font-semibold" : "border-border text-muted-foreground hover:border-primary/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-all hover:shadow-lift disabled:opacity-60"
          >
            <Sparkles className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Génération en cours…" : "Générer le post"}
          </button>

          {output && (
            <div className="animate-rise mt-4 rounded-lg border border-border bg-background p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed">{output}</p>
              <button
                onClick={() => {
                  addPost({
                    id: `P-${Date.now()}`,
                    title: `${theme} — nouveau brouillon`,
                    network: "Instagram",
                    status: "Brouillon",
                    excerpt: output.split("\n")[1] ?? output.slice(0, 80),
                  });
                  toast.success("Brouillon ajouté à la galerie");
                }}
                className="mt-3 rounded-lg border border-primary/50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[oklch(0.45_0.07_63)] transition-colors hover:bg-primary/15"
              >
                Enregistrer comme brouillon
              </button>
            </div>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">
            Contenus pré-rédigés — aucune génération IA réelle.
          </p>
        </div>

        <div className="panel animate-rise p-5" style={{ animationDelay: "100ms" }}>
          <SectionTitle>Préparation des publications</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((p, i) => {
              const Icon = p.network === "Instagram" ? Instagram : Linkedin;
              return (
                <article
                  key={p.id}
                  className="animate-rise flex flex-col rounded-lg border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="mb-3 h-20 rounded-md bg-gradient-to-br from-[oklch(0.86_0.045_75)] to-[oklch(0.62_0.08_63)]" />
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <p className="text-sm font-semibold">{p.title}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge
                      label={p.status}
                      tone={p.status === "Publié" ? "success" : p.status === "Prêt" ? "gold" : "neutral"}
                    />
                    {p.status !== "Publié" && (
                      <button
                        onClick={() => {
                          publishPost(p.id);
                          toast.success(`Publié sur ${p.network}`, { description: "Simulation — aucune connexion réelle." });
                        }}
                        className="flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary transition-all hover:shadow-lift"
                      >
                        <Send className="h-3 w-3" /> Publier
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="panel animate-rise mt-6 p-5">
        <SectionTitle>FAQ client</SectionTitle>
        <div className="divide-y divide-border">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-medium">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <div
                className="grid overflow-hidden transition-all duration-300"
                style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}
              >
                <div className="min-h-0">
                  <p className="pb-4 text-sm text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
