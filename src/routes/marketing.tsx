import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Instagram,
  Linkedin,
  Sparkles,
  Send,
  X,
  Hash,
  ImagePlus,
  ArrowUp,
  ArrowDown,
  Check,
  Settings2,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionTitle, StatusBadge } from "@/components/app/ui-bits";
import { useCrm } from "@/lib/crm-store";
import { GENERATED_POSTS } from "@/lib/mock-data";
import villaImg from "@/assets/prop-villa-souissi.jpg";
import harhouraImg from "@/assets/prop-harhoura.jpg";
import oceanImg from "@/assets/prop-rabat-ocean.jpg";

const POST_IMAGES = [villaImg, harhouraImg, oceanImg];

const LIBRARY = [
  { id: "img-villa", label: "Villa Souissi", src: villaImg },
  { id: "img-harhoura", label: "Harhoura Bay", src: harhouraImg },
  { id: "img-ocean", label: "Rabat Océan", src: oceanImg },
];

const HASHTAGS = [
  "#ImmobilierMaroc",
  "#Rabat",
  "#Harhoura",
  "#Témara",
  "#VillaDeLuxe",
  "#Investissement",
  "#LeadAdvisoryConsulting",
  "#BienÀVendre",
  "#RealEstate",
  "#Souissi",
  "#Résidentiel",
  "#OpportunitéImmobilière",
];

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Community Manager AI — CRM Lead Advisory Consulting" },
      {
        name: "description",
        content: "Génération et préparation des contenus publicitaires pour les réseaux sociaux.",
      },
      { property: "og:title", content: "Community Manager AI — CRM Lead Advisory Consulting" },
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
  const [composer, setComposer] = useState(false);

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
    <AppShell title="Community Manager AI" subtitle="Générer et préparer les contenus publicitaires">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel animate-rise p-5">
          <div className="flex items-start justify-between gap-3">
            <SectionTitle>Génération de contenus</SectionTitle>
            <button
              onClick={() => setComposer(true)}
              className="press flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift"
            >
              <Settings2 className="h-3.5 w-3.5" /> Configurer un post
            </button>
          </div>
          <label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Type de bien ou thématique
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`press rounded-full border px-3 py-1.5 text-xs ${
                  theme === t
                    ? "border-primary bg-primary/15 font-semibold"
                    : "border-border text-muted-foreground hover:border-primary/60"
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
              <div className="mt-3 flex flex-wrap gap-2">
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
                  className="rounded-lg border border-primary/50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/15"
                >
                  Enregistrer comme brouillon
                </button>
                <button
                  onClick={() => setComposer(true)}
                  className="rounded-lg border border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/60"
                >
                  Personnaliser le post
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="panel animate-rise p-5" style={{ animationDelay: "100ms" }}>
          <SectionTitle>Préparation des publications</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((p, i) => {
              const Icon = p.network === "Instagram" ? Instagram : Linkedin;
              return (
                <article
                  key={p.id}
                  className="animate-rise group flex flex-col overflow-hidden rounded-lg border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lift"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="mb-3 overflow-hidden rounded-md">
                    <img
                      src={POST_IMAGES[i % POST_IMAGES.length]}
                      alt={p.title}
                      loading="lazy"
                      width={1024}
                      height={640}
                      className="h-24 w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
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
                          toast.success(`Publié sur ${p.network}`, {
                            description: "Simulation — aucune connexion réelle.",
                          });
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

      {composer && (
        <PostComposer
          theme={theme}
          initialText={output ?? GENERATED_POSTS[theme] ?? ""}
          onClose={() => setComposer(false)}
          onSave={(post) => {
            addPost(post);
            setComposer(false);
          }}
        />
      )}
    </AppShell>
  );
}

/* ---------------- Pop-up de configuration du post ---------------- */

function PostComposer({
  theme,
  initialText,
  onClose,
  onSave,
}: {
  theme: string;
  initialText: string;
  onClose: () => void;
  onSave: (post: { id: string; title: string; network: "Instagram" | "LinkedIn"; status: "Brouillon" | "Prêt"; excerpt: string }) => void;
}) {
  const [network, setNetwork] = useState<"Instagram" | "LinkedIn">("Instagram");
  const [tags, setTags] = useState<string[]>(["#ImmobilierMaroc", "#Rabat"]);
  const [images, setImages] = useState<string[]>(["img-villa"]);
  const [description, setDescription] = useState(initialText);
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleImage = (id: string) =>
    setImages((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const moveImage = (index: number, delta: number) =>
    setImages((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item!);
      return next;
    });

  const submit = () => {
    if (!description.trim()) {
      toast.error("Ajoutez une description avant de valider.");
      return;
    }
    if (images.length === 0) {
      toast.error("Sélectionnez au moins une image.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave({
        id: `P-${Date.now()}`,
        title: `${theme} — ${network}`,
        network,
        status: "Prêt",
        excerpt: `${description.split("\n").find(Boolean)?.slice(0, 90) ?? ""} ${tags.slice(0, 3).join(" ")}`.trim(),
      });
      toast.success("Post configuré et prêt à publier", {
        description: `${images.length} image(s) · ${tags.length} hashtag(s)`,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-rise flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lift">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Community Manager AI</p>
            <h2 className="text-lg font-semibold">Configuration du post</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="press rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 md:grid-cols-2">
          {/* Réseau + hashtags */}
          <section className="space-y-5">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Réseau</p>
              <div className="flex gap-2">
                {(["Instagram", "LinkedIn"] as const).map((n) => {
                  const Icon = n === "Instagram" ? Instagram : Linkedin;
                  return (
                    <button
                      key={n}
                      onClick={() => setNetwork(n)}
                      className={`press flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                        network === n
                          ? "border-primary bg-primary/15 font-semibold"
                          : "border-border text-muted-foreground hover:border-primary/60"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {n}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <Hash className="h-3.5 w-3.5" /> Hashtags ({tags.length} sélectionné{tags.length > 1 ? "s" : ""})
              </p>
              <div className="flex flex-wrap gap-2">
                {HASHTAGS.map((t) => {
                  const on = tags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`press flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        on
                          ? "border-primary bg-primary/15 font-semibold"
                          : "border-border text-muted-foreground hover:border-primary/60"
                      }`}
                    >
                      {on && <Check className="h-3 w-3" />} {t}
                    </button>
                  );
                })}
              </div>
              {tags.length > 0 && (
                <p className="mt-2 break-words text-xs text-muted-foreground">{tags.join(" ")}</p>
              )}
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <ImagePlus className="h-3.5 w-3.5" /> Images
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LIBRARY.map((img) => {
                  const rank = images.indexOf(img.id);
                  return (
                    <button
                      key={img.id}
                      onClick={() => toggleImage(img.id)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        rank > -1 ? "border-primary" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={img.src} alt={img.label} loading="lazy" className="h-20 w-full object-cover" />
                      {rank > -1 && (
                        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-primary">
                          {rank + 1}
                        </span>
                      )}
                      <span className="block truncate px-1 py-1 text-[10px] text-muted-foreground">{img.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Ordre + description */}
          <section className="space-y-5">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Ordre d'affichage des images
              </p>
              {images.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                  Aucune image sélectionnée.
                </p>
              ) : (
                <ul className="space-y-2">
                  {images.map((id, i) => {
                    const img = LIBRARY.find((x) => x.id === id)!;
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-sidebar/40 p-2"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <img src={img.src} alt={img.label} className="h-10 w-14 rounded object-cover" />
                        <span className="flex-1 truncate text-xs">{img.label}</span>
                        <button
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          aria-label="Monter"
                          className="press rounded border border-border p-1 text-muted-foreground disabled:opacity-30"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveImage(i, 1)}
                          disabled={i === images.length - 1}
                          aria-label="Descendre"
                          className="press rounded border border-border p-1 text-muted-foreground disabled:opacity-30"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => toggleImage(id)}
                          aria-label="Retirer"
                          className="press rounded border border-border p-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <label
                htmlFor="post-description"
                className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                Description du post
              </label>
              <textarea
                id="post-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                placeholder="Rédigez votre texte marketing…"
                className="w-full rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{description.length} caractères</span>
                <button
                  onClick={() => {
                    setDescription(`${GENERATED_POSTS[theme] ?? ""}\n\n${tags.join(" ")}`.trim());
                    toast.success("Description générée");
                  }}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Sparkles className="h-3 w-3" /> Générer la description
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/60"
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary transition-all hover:shadow-lift disabled:opacity-60"
          >
            <Sparkles className={`h-3.5 w-3.5 ${saving ? "animate-spin" : ""}`} />
            {saving ? "Préparation…" : "Valider le post"}
          </button>
        </footer>
      </div>
    </div>
  );
}
