export type LeadStatus =
  | "Nouveau"
  | "Premier contact"
  | "Qualification en cours"
  | "Qualifié"
  | "Rendez-vous programmé"
  | "Converti"
  | "Perdu";

export const LEAD_STATUSES: LeadStatus[] = [
  "Nouveau",
  "Premier contact",
  "Qualification en cours",
  "Qualifié",
  "Rendez-vous programmé",
  "Converti",
  "Perdu",
];

export type Channel =
  | "Prospection directe"
  | "Instagram"
  | "LinkedIn"
  | "Site web"
  | "Avito"
  | "Partenariat agence";

export const CHANNELS: Channel[] = [
  "Prospection directe",
  "Instagram",
  "LinkedIn",
  "Site web",
  "Avito",
  "Partenariat agence",
];

export type TimelineEvent = { label: string; date: string; detail?: string };
export type ChatMessage = { from: "agent" | "lead"; text: string; time: string };

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  channel: Channel;
  project: string;
  status: LeadStatus;
  lastContact: string;
  budget: string;
  timeline: TimelineEvent[];
  conversation: ChatMessage[];
};

const conv = (name: string, project: string): ChatMessage[] => [
  {
    from: "agent",
    text: `Bonjour ${name}, ici l'assistant de Lead Advisory Consulting. Merci pour votre intérêt concernant ${project}. Puis-je vous poser quelques questions ?`,
    time: "09:12",
  },
  { from: "lead", text: "Bonjour, oui bien sûr.", time: "09:18" },
  {
    from: "agent",
    text: "Quel est votre horizon d'acquisition et votre enveloppe budgétaire envisagée ?",
    time: "09:19",
  },
  { from: "lead", text: "Sous 3 mois, autour de 2,5 MDH.", time: "09:24" },
  {
    from: "agent",
    text: "Parfait. Souhaitez-vous un financement bancaire ou un achat comptant ?",
    time: "09:25",
  },
  { from: "lead", text: "Crédit bancaire, dossier déjà entamé.", time: "09:31" },
  {
    from: "agent",
    text: "Merci. Votre demande correspond à nos critères de qualification. Je vous propose un rendez-vous conseil avec un consultant : jeudi 14h ou vendredi 11h ?",
    time: "09:32",
  },
  { from: "lead", text: "Jeudi 14h me convient.", time: "09:40" },
  {
    from: "agent",
    text: "Rendez-vous confirmé jeudi à 14h. Un consultant prend le relais pour la suite du dossier.",
    time: "09:40",
  },
];

const tl = (project: string): TimelineEvent[] => [
  { label: "Réception du lead", date: "02/09/2026", detail: "Formulaire capté et enregistré" },
  { label: "Premier contact automatique", date: "02/09/2026", detail: "Message envoyé par l'agent IA" },
  { label: "Collecte d'informations", date: "03/09/2026", detail: `Intérêt : ${project}` },
  { label: "Qualification", date: "04/09/2026", detail: "Lead qualifié par l'agent IA" },
  { label: "Proposition de rendez-vous", date: "05/09/2026", detail: "Créneau proposé et réservé" },
];

const mk = (
  id: string,
  name: string,
  channel: Channel,
  project: string,
  status: LeadStatus,
  lastContact: string,
  budget: string,
): Lead => ({
  id,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@exemple.ma`,
  phone: "+212 6 00 00 00 00",
  channel,
  project,
  status,
  lastContact,
  budget,
  timeline: tl(project),
  conversation: conv(name.split(" ")[0] ?? name, project),
});

export const MOCK_LEADS: Lead[] = [
  mk("L-001", "Yassine Bennani", "Instagram", "Villa à Souissi", "Nouveau", "05/09/2026", "4,2 MDH"),
  mk("L-002", "Salma Chraibi", "Site web", "Appartement à Harhoura", "Nouveau", "05/09/2026", "1,6 MDH"),
  mk("L-003", "Omar El Fassi", "LinkedIn", "Projet Rabat Océan", "Premier contact", "04/09/2026", "3,1 MDH"),
  mk("L-004", "Nadia Alaoui", "Avito", "Appartement à Témara", "Premier contact", "04/09/2026", "1,2 MDH"),
  mk("L-005", "Karim Tazi", "Partenariat agence", "Villa à Harhoura", "Qualification en cours", "03/09/2026", "5,4 MDH"),
  mk("L-006", "Imane Berrada", "Instagram", "Appartement à Rabat Océan", "Qualification en cours", "03/09/2026", "2,0 MDH"),
  mk("L-007", "Hamza Sebti", "Prospection directe", "Villa à Souissi", "Qualifié", "02/09/2026", "6,0 MDH"),
  mk("L-008", "Leila Benjelloun", "Site web", "Appartement à Harhoura", "Qualifié", "02/09/2026", "1,8 MDH"),
  mk("L-009", "Mehdi Ouazzani", "LinkedIn", "Projet Rabat Océan", "Rendez-vous programmé", "01/09/2026", "2,5 MDH"),
  mk("L-010", "Sofia Idrissi", "Instagram", "Villa à Harhoura", "Rendez-vous programmé", "01/09/2026", "4,8 MDH"),
  mk("L-011", "Rachid Amrani", "Avito", "Appartement à Témara", "Converti", "28/08/2026", "1,3 MDH"),
  mk("L-012", "Hind Lahlou", "Partenariat agence", "Villa à Souissi", "Converti", "26/08/2026", "5,1 MDH"),
  mk("L-013", "Adil Naciri", "Prospection directe", "Appartement à Harhoura", "Perdu", "22/08/2026", "1,1 MDH"),
  mk("L-014", "Meryem Kabbaj", "Site web", "Projet Rabat Océan", "Perdu", "20/08/2026", "2,2 MDH"),
  mk("L-015", "Younes Skalli", "Instagram", "Villa à Harhoura", "Nouveau", "05/09/2026", "3,9 MDH"),
];

export type QuoteStatus = "En attente" | "Validé" | "Refusé";
export type InvoiceStatus = "Payée" | "En attente" | "En retard";

export type Client = {
  id: string;
  name: string;
  project: string;
  dossier: "Ouvert" | "En cours" | "Clôturé";
  amount: number;
  email: string;
  phone: string;
  quotes: { id: string; label: string; amount: number; status: QuoteStatus }[];
  invoices: { id: string; label: string; amount: number; status: InvoiceStatus; due: string }[];
  notifications: { id: string; label: string; tone: "success" | "info" | "warning"; date: string }[];
  timeline: TimelineEvent[];
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: "C-101",
    name: "Rachid Amrani",
    project: "Appartement à Témara",
    dossier: "En cours",
    amount: 1300000,
    email: "rachid.amrani@exemple.ma",
    phone: "+212 6 11 22 33 44",
    quotes: [
      { id: "D-2201", label: "Accompagnement acquisition", amount: 78000, status: "En attente" },
      { id: "D-2202", label: "Audit juridique du bien", amount: 22000, status: "Validé" },
    ],
    invoices: [
      { id: "F-5501", label: "Acompte conseil", amount: 26000, status: "Payée", due: "20/08/2026" },
      { id: "F-5502", label: "Solde mission", amount: 52000, status: "En attente", due: "20/09/2026" },
    ],
    notifications: [
      { id: "N-1", label: "Devis D-2202 validé", tone: "success", date: "28/08/2026" },
      { id: "N-2", label: "Paiement reçu — F-5501", tone: "success", date: "22/08/2026" },
    ],
    timeline: [
      { label: "Lead converti en client", date: "18/08/2026" },
      { label: "Devis envoyé", date: "20/08/2026" },
      { label: "Acompte réglé", date: "22/08/2026" },
      { label: "Audit juridique lancé", date: "28/08/2026" },
    ],
  },
  {
    id: "C-102",
    name: "Hind Lahlou",
    project: "Villa à Souissi",
    dossier: "Ouvert",
    amount: 5100000,
    email: "hind.lahlou@exemple.ma",
    phone: "+212 6 55 44 33 22",
    quotes: [{ id: "D-2210", label: "Conseil stratégique investissement", amount: 145000, status: "En attente" }],
    invoices: [{ id: "F-5510", label: "Acompte mission", amount: 48000, status: "En attente", due: "15/09/2026" }],
    notifications: [{ id: "N-3", label: "Devis D-2210 en attente de validation", tone: "warning", date: "01/09/2026" }],
    timeline: [
      { label: "Lead converti en client", date: "26/08/2026" },
      { label: "Réunion de cadrage", date: "29/08/2026" },
      { label: "Devis émis", date: "01/09/2026" },
    ],
  },
  {
    id: "C-103",
    name: "Groupe Bennis Immo",
    project: "Programme Rabat Océan — lot B",
    dossier: "En cours",
    amount: 8400000,
    email: "contact@bennisimmo.ma",
    phone: "+212 5 37 00 00 00",
    quotes: [
      { id: "D-2215", label: "Étude de marché & positionnement", amount: 210000, status: "Validé" },
      { id: "D-2216", label: "Commercialisation phase 2", amount: 320000, status: "En attente" },
    ],
    invoices: [
      { id: "F-5520", label: "Étude de marché", amount: 210000, status: "Payée", due: "10/08/2026" },
      { id: "F-5521", label: "Phase 2 — acompte", amount: 96000, status: "En retard", due: "31/08/2026" },
    ],
    notifications: [
      { id: "N-4", label: "Facture F-5521 en retard", tone: "warning", date: "01/09/2026" },
      { id: "N-5", label: "Étude de marché livrée", tone: "info", date: "10/08/2026" },
    ],
    timeline: [
      { label: "Ouverture du dossier", date: "02/07/2026" },
      { label: "Étude de marché livrée", date: "10/08/2026" },
      { label: "Lancement phase 2", date: "25/08/2026" },
    ],
  },
  {
    id: "C-104",
    name: "Fatima Zahra Idrissi",
    project: "Appartement à Harhoura",
    dossier: "Clôturé",
    amount: 1750000,
    email: "fz.idrissi@exemple.ma",
    phone: "+212 6 77 88 99 00",
    quotes: [{ id: "D-2190", label: "Accompagnement acquisition", amount: 62000, status: "Validé" }],
    invoices: [{ id: "F-5490", label: "Mission complète", amount: 62000, status: "Payée", due: "30/07/2026" }],
    notifications: [{ id: "N-6", label: "Dossier clôturé", tone: "info", date: "01/08/2026" }],
    timeline: [
      { label: "Lead converti en client", date: "12/06/2026" },
      { label: "Devis validé", date: "18/06/2026" },
      { label: "Acte signé", date: "28/07/2026" },
      { label: "Dossier clôturé", date: "01/08/2026" },
    ],
  },
];

export const ACTIVITY = [
  { label: "Nouveau lead reçu via Instagram", who: "Younes Skalli", time: "il y a 12 min", tone: "info" as const },
  { label: "Devis validé", who: "Rachid Amrani — D-2202", time: "il y a 2 h", tone: "success" as const },
  { label: "Rendez-vous programmé par l'agent IA", who: "Sofia Idrissi", time: "il y a 4 h", tone: "info" as const },
  { label: "Facture en retard", who: "Groupe Bennis Immo — F-5521", time: "hier", tone: "warning" as const },
  { label: "Lead converti en client", who: "Hind Lahlou", time: "il y a 3 j", tone: "success" as const },
];

export const MONTHLY = [
  { mois: "Avr", leads: 42, clients: 6 },
  { mois: "Mai", leads: 55, clients: 8 },
  { mois: "Juin", leads: 61, clients: 9 },
  { mois: "Juil", leads: 58, clients: 7 },
  { mois: "Août", leads: 74, clients: 12 },
  { mois: "Sept", leads: 83, clients: 14 },
];

export const CHANNEL_PERF = [
  { canal: "Instagram", leads: 96, conversion: 21 },
  { canal: "LinkedIn", leads: 64, conversion: 26 },
  { canal: "Site web", leads: 78, conversion: 18 },
  { canal: "Avito", leads: 52, conversion: 9 },
  { canal: "Partenariat agence", leads: 38, conversion: 31 },
  { canal: "Prospection directe", leads: 45, conversion: 14 },
];

export type Post = {
  id: string;
  title: string;
  network: "Instagram" | "LinkedIn";
  status: "Brouillon" | "Prêt" | "Publié";
  excerpt: string;
};

export const MOCK_POSTS: Post[] = [
  {
    id: "P-1",
    title: "Villa d'exception à Souissi",
    network: "Instagram",
    status: "Prêt",
    excerpt: "Une villa de standing au cœur de Souissi : volumes généreux, finitions haut de gamme.",
  },
  {
    id: "P-2",
    title: "Investir à Harhoura en 2026",
    network: "LinkedIn",
    status: "Brouillon",
    excerpt: "Le littoral de Harhoura confirme sa dynamique. Notre lecture du marché en 3 points.",
  },
  {
    id: "P-3",
    title: "Programme Rabat Océan — livré",
    network: "Instagram",
    status: "Publié",
    excerpt: "Livraison confirmée pour la première tranche du programme Rabat Océan.",
  },
  {
    id: "P-4",
    title: "16 ans d'expérience au service de votre patrimoine",
    network: "LinkedIn",
    status: "Brouillon",
    excerpt: "Depuis 16 ans, Lead Advisory Consulting accompagne investisseurs et particuliers.",
  },
];

export const GENERATED_POSTS: Record<string, string> = {
  Villa:
    "🏡 Villa d'exception — Souissi\nDes volumes rares, une architecture contemporaine et un jardin paysager au cœur du quartier le plus prisé de Rabat.\nVisite privée sur rendez-vous.\n#LeadAdvisoryConsulting #ImmobilierPremium #Souissi",
  Appartement:
    "🌊 Appartement vue mer — Harhoura\nLumière traversante, terrasse généreuse et accès direct au littoral.\nUne opportunité exclusive à saisir.\n#Harhoura #Temara #ImmobilierMaroc",
  "Projet neuf":
    "🚧 Programme Rabat Océan\nUne nouvelle tranche ouvre à la commercialisation : plans optimisés, prestations de standing, livraison planifiée.\nDemandez la plaquette.\n#RabatOcéan #Investissement",
  "Conseil investissement":
    "📈 Investir au Maroc en 2026\nRendement locatif, fiscalité, sélection des emplacements : nos consultants décryptent le marché.\n16 ans d'expérience à votre service.\n#Conseil #Patrimoine",
};

export type KnowledgeItem = {
  id: string;
  category: "Critères de qualification" | "Projets immobiliers" | "Réponses types";
  title: string;
  content: string;
};

export const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "K-1",
    category: "Critères de qualification",
    title: "Informations à collecter auprès d'un lead",
    content:
      "Type de bien recherché, zone géographique, horizon d'acquisition, enveloppe budgétaire, mode de financement envisagé.",
  },
  {
    id: "K-2",
    category: "Critères de qualification",
    title: "Passage de relais au consultant",
    content:
      "Un lead est transmis à un consultant humain dès qu'un rendez-vous est proposé et accepté par le prospect.",
  },
  {
    id: "K-3",
    category: "Projets immobiliers",
    title: "Villas à Souissi et Harhoura",
    content: "Biens de standing, surfaces généreuses, visites sur rendez-vous uniquement.",
  },
  {
    id: "K-4",
    category: "Projets immobiliers",
    title: "Programme Rabat Océan",
    content: "Programme résidentiel avec tranches successives ; première tranche livrée.",
  },
  {
    id: "K-5",
    category: "Réponses types",
    title: "Demande de visite",
    content:
      "Les visites sont organisées sur rendez-vous, du lundi au samedi, en présence d'un consultant Lead Advisory Consulting.",
  },
  {
    id: "K-6",
    category: "Réponses types",
    title: "Documents nécessaires",
    content: "Pièce d'identité, justificatifs de revenus et accord de principe bancaire le cas échéant.",
  },
];

export const FAQ = [
  {
    q: "Comment se déroule une visite de bien ?",
    a: "Les visites se font uniquement sur rendez-vous, accompagnées d'un consultant de Lead Advisory Consulting.",
  },
  {
    q: "Quels documents dois-je préparer ?",
    a: "Une pièce d'identité, vos justificatifs de revenus et, en cas de financement, un accord de principe bancaire.",
  },
  {
    q: "Quelles sont les étapes d'un achat ?",
    a: "Qualification du besoin, sélection des biens, visites, négociation, compromis puis signature de l'acte.",
  },
  {
    q: "Intervenez-vous en dehors de Témara et Rabat ?",
    a: "Notre cabinet est basé à Harhoura, Témara, et accompagne principalement les projets de la région Rabat-Témara.",
  },
];
