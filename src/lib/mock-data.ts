export type LeadStatus =
  | "Nouveau"
  | "Premier contact"
  | "Qualification en cours"
  | "Qualifié"
  | "RDV programmé"
  | "Converti"
  | "Perdu";

export const LEAD_STATUSES: LeadStatus[] = [
  "Nouveau",
  "Premier contact",
  "Qualification en cours",
  "Qualifié",
  "RDV programmé",
  "Converti",
  "Perdu",
];

export type Channel =
  | "Instagram"
  | "TikTok"
  | "Avito"
  | "Site web"
  | "LinkedIn"
  | "Prospection directe"
  | "Partenariat";

export const CHANNELS: Channel[] = [
  "Instagram",
  "TikTok",
  "Avito",
  "Site web",
  "LinkedIn",
  "Prospection directe",
  "Partenariat",
];

export type TimelineEvent = { label: string; date: string; detail?: string };
export type ChatMessage = { from: "agent" | "lead"; text: string; time: string };
export type Interaction = {
  type: "Message IA" | "Appel" | "E-mail" | "WhatsApp" | "Visite";
  label: string;
  date: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  channel: Channel;
  project: string;
  interest: string;
  status: LeadStatus;
  createdAt: string; // ISO
  lastContact: string; // ISO
  budget: string;
  budgetValue: number;
  score: number;
  appointment?: { date: string; time: string; consultant: string };
  timeline: TimelineEvent[];
  interactions: Interaction[];
  conversation: ChatMessage[];
};

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const conv = (name: string, project: string, budget: string): ChatMessage[] => [
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
  { from: "lead", text: `Sous 3 mois, autour de ${budget}.`, time: "09:24" },
  { from: "agent", text: "Parfait. Souhaitez-vous un financement bancaire ou un achat comptant ?", time: "09:25" },
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

const tl = (interest: string, created: string, last: string): TimelineEvent[] => [
  { label: "Réception du lead", date: fmtDate(created), detail: "Formulaire capté et enregistré" },
  { label: "Premier contact automatique", date: fmtDate(created), detail: "Message envoyé par l'agent IA" },
  { label: "Collecte d'informations", date: fmtDate(last), detail: `Intérêt : ${interest}` },
  { label: "Qualification", date: fmtDate(last), detail: "Critères vérifiés par l'agent IA" },
];

const inter = (channel: Channel, last: string): Interaction[] => [
  { type: "Message IA", label: `Séquence de qualification via ${channel}`, date: fmtDate(last) },
  { type: "WhatsApp", label: "Relance automatique — sans réponse 48 h", date: fmtDate(last) },
  { type: "Appel", label: "Appel de confirmation par un consultant", date: fmtDate(last) },
];

const CONSULTANTS = ["Houda Bennis", "Réda Alami", "Salma Cherkaoui"];

type Seed = [
  id: string,
  name: string,
  channel: Channel,
  project: string,
  interest: string,
  status: LeadStatus,
  created: string,
  last: string,
  budget: number,
  city: string,
  score: number,
];

const SEEDS: Seed[] = [
  ["L-001", "Yassine Bennani", "Instagram", "Villa à Souissi", "Projet Souissi Prestige", "Nouveau", "2026-09-08", "2026-09-08", 4.2, "Rabat", 62, ],
  ["L-002", "Salma Chraibi", "Site web", "Appartement à Harhoura", "Résidence Harhoura Plage", "Nouveau", "2026-09-08", "2026-09-09", 1.6, "Témara", 48],
  ["L-003", "Omar El Fassi", "LinkedIn", "Projet Rabat Océan", "Projet Rabat Océan", "Premier contact", "2026-09-06", "2026-09-07", 3.1, "Rabat", 71],
  ["L-004", "Nadia Alaoui", "Avito", "Appartement à Témara", "Résidence Témara Centre", "Premier contact", "2026-09-05", "2026-09-07", 1.2, "Témara", 44],
  ["L-005", "Karim Tazi", "Partenariat", "Villa à Harhoura", "Villas Harhoura Bay", "Qualification en cours", "2026-09-03", "2026-09-06", 5.4, "Casablanca", 83],
  ["L-006", "Imane Berrada", "Instagram", "Appartement à Rabat Océan", "Projet Rabat Océan", "Qualification en cours", "2026-09-02", "2026-09-06", 2.0, "Rabat", 66],
  ["L-007", "Hamza Sebti", "Prospection directe", "Villa à Souissi", "Projet Souissi Prestige", "Qualifié", "2026-08-30", "2026-09-05", 6.0, "Rabat", 91],
  ["L-008", "Leila Benjelloun", "Site web", "Appartement à Harhoura", "Résidence Harhoura Plage", "Qualifié", "2026-08-29", "2026-09-04", 1.8, "Témara", 74],
  ["L-009", "Mehdi Ouazzani", "LinkedIn", "Projet Rabat Océan", "Projet Rabat Océan", "RDV programmé", "2026-08-28", "2026-09-03", 2.5, "Rabat", 88],
  ["L-010", "Sofia Idrissi", "Instagram", "Villa à Harhoura", "Villas Harhoura Bay", "RDV programmé", "2026-08-27", "2026-09-02", 4.8, "Rabat", 86],
  ["L-011", "Rachid Amrani", "Avito", "Appartement à Témara", "Résidence Témara Centre", "Converti", "2026-08-10", "2026-08-28", 1.3, "Témara", 95],
  ["L-012", "Hind Lahlou", "Partenariat", "Villa à Souissi", "Projet Souissi Prestige", "Converti", "2026-08-05", "2026-08-26", 5.1, "Rabat", 94],
  ["L-013", "Adil Naciri", "Prospection directe", "Appartement à Harhoura", "Résidence Harhoura Plage", "Perdu", "2026-08-02", "2026-08-22", 1.1, "Témara", 22],
  ["L-014", "Meryem Kabbaj", "Site web", "Projet Rabat Océan", "Projet Rabat Océan", "Perdu", "2026-07-30", "2026-08-20", 2.2, "Salé", 18],
  ["L-015", "Younes Skalli", "Instagram", "Villa à Harhoura", "Villas Harhoura Bay", "Nouveau", "2026-09-09", "2026-09-09", 3.9, "Rabat", 57],
  ["L-016", "Ghita Bouhaddou", "TikTok", "Appartement à Témara", "Résidence Témara Centre", "Nouveau", "2026-09-09", "2026-09-09", 1.4, "Témara", 39],
  ["L-017", "Anas Belkadi", "TikTok", "Studio à Harhoura", "Résidence Harhoura Plage", "Premier contact", "2026-09-07", "2026-09-08", 0.9, "Témara", 41],
  ["L-018", "Zineb Marrakchi", "Avito", "Appartement à Rabat Océan", "Projet Rabat Océan", "Qualification en cours", "2026-09-04", "2026-09-08", 2.3, "Rabat", 68],
  ["L-019", "Tarik Benslimane", "LinkedIn", "Plateau bureaux Agdal", "Bureaux Agdal Business", "Qualifié", "2026-08-31", "2026-09-06", 7.5, "Rabat", 89],
  ["L-020", "Nawal Ait Ali", "Partenariat", "Villa à Harhoura", "Villas Harhoura Bay", "RDV programmé", "2026-08-26", "2026-09-05", 4.4, "Casablanca", 84],
  ["L-021", "Ilyas Berrechid", "Site web", "Terrain à Sidi Yahya", "Terrains Sidi Yahya", "Premier contact", "2026-09-05", "2026-09-07", 3.3, "Témara", 52],
  ["L-022", "Sanaa Guessous", "Instagram", "Appartement à Souissi", "Projet Souissi Prestige", "Qualification en cours", "2026-09-01", "2026-09-06", 2.9, "Rabat", 70],
  ["L-023", "Mohamed Zeroual", "Prospection directe", "Villa à Souissi", "Projet Souissi Prestige", "Qualifié", "2026-08-25", "2026-09-04", 8.2, "Rabat", 92],
  ["L-024", "Kenza Filali", "TikTok", "Appartement à Harhoura", "Résidence Harhoura Plage", "Perdu", "2026-08-12", "2026-08-24", 1.5, "Témara", 25],
  ["L-025", "Reda Bouazza", "Avito", "Appartement à Témara", "Résidence Témara Centre", "Converti", "2026-07-28", "2026-08-18", 1.7, "Témara", 90],
  ["L-026", "Amine Ouarzazi", "LinkedIn", "Plateau bureaux Agdal", "Bureaux Agdal Business", "Qualification en cours", "2026-09-02", "2026-09-08", 6.1, "Rabat", 76],
  ["L-027", "Lamia Sqalli", "Site web", "Villa à Harhoura", "Villas Harhoura Bay", "Nouveau", "2026-09-08", "2026-09-09", 5.0, "Rabat", 60],
  ["L-028", "Othmane Rifai", "Partenariat", "Programme Rabat Océan — lot C", "Projet Rabat Océan", "Qualifié", "2026-08-24", "2026-09-03", 9.4, "Casablanca", 93],
  ["L-029", "Dounia Mekouar", "Instagram", "Appartement à Témara", "Résidence Témara Centre", "Premier contact", "2026-09-06", "2026-09-08", 1.35, "Témara", 46],
  ["L-030", "Khalid Bennis", "Prospection directe", "Terrain à Sidi Yahya", "Terrains Sidi Yahya", "RDV programmé", "2026-08-29", "2026-09-05", 4.6, "Témara", 81],
];

const slug = (name: string) => name.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").trim().replace(/ +/g, ".");

export const MOCK_LEADS: Lead[] = SEEDS.map(
  ([id, name, channel, project, interest, status, created, last, budget, city, score], i) => {
    const lead: Lead = {
      id,
      name,
      email: `${slug(name)}@exemple.ma`,
      phone: `+212 6 ${String(10 + (i % 80)).padStart(2, "0")} ${String(20 + i).padStart(2, "0")} ${String(30 + i).padStart(2, "0")} ${String(40 + i).padStart(2, "0")}`,
      city,
      channel,
      project,
      interest,
      status,
      createdAt: created,
      lastContact: last,
      budget: `${budget.toLocaleString("fr-FR")} MDH`,
      budgetValue: budget,
      score,
      timeline: tl(interest, created, last),
      interactions: inter(channel, last),
      conversation: conv(name.split(" ")[0] ?? name, project, `${budget.toLocaleString("fr-FR")} MDH`),
    };
    if (status === "RDV programmé") {
      lead.appointment = {
        date: fmtDate("2026-09-12"),
        time: ["10:00", "14:00", "16:30"][i % 3] ?? "14:00",
        consultant: CONSULTANTS[i % 3] ?? "Houda Bennis",
      };
      lead.timeline.push({
        label: "Rendez-vous confirmé",
        date: fmtDate("2026-09-12"),
        detail: "Créneau réservé par l'agent IA",
      });
    }
    return lead;
  },
);

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
  {
    id: "C-105",
    name: "Reda Bouazza",
    project: "Appartement à Témara",
    dossier: "En cours",
    amount: 1700000,
    email: "reda.bouazza@exemple.ma",
    phone: "+212 6 62 41 08 77",
    quotes: [{ id: "D-2220", label: "Accompagnement acquisition", amount: 58000, status: "Validé" }],
    invoices: [
      { id: "F-5530", label: "Acompte conseil", amount: 20000, status: "Payée", due: "25/08/2026" },
      { id: "F-5531", label: "Solde mission", amount: 38000, status: "En attente", due: "30/09/2026" },
    ],
    notifications: [{ id: "N-7", label: "Compromis en préparation", tone: "info", date: "05/09/2026" }],
    timeline: [
      { label: "Lead converti en client", date: "18/08/2026" },
      { label: "Sélection de biens envoyée", date: "22/08/2026" },
      { label: "Visite réalisée", date: "01/09/2026" },
    ],
  },
  {
    id: "C-106",
    name: "Résidences Atlas Invest",
    project: "Villas Harhoura Bay — tranche 1",
    dossier: "Ouvert",
    amount: 12500000,
    email: "invest@atlas-residences.ma",
    phone: "+212 5 37 45 12 90",
    quotes: [{ id: "D-2225", label: "Stratégie de commercialisation", amount: 280000, status: "En attente" }],
    invoices: [],
    notifications: [{ id: "N-8", label: "Devis D-2225 envoyé", tone: "info", date: "07/09/2026" }],
    timeline: [
      { label: "Ouverture du dossier", date: "03/09/2026" },
      { label: "Réunion de cadrage", date: "06/09/2026" },
    ],
  },
  {
    id: "C-107",
    name: "Nawal Ait Ali",
    project: "Villa à Harhoura",
    dossier: "En cours",
    amount: 4400000,
    email: "nawal.aitali@exemple.ma",
    phone: "+212 6 70 33 21 55",
    quotes: [{ id: "D-2228", label: "Accompagnement acquisition premium", amount: 132000, status: "En attente" }],
    invoices: [{ id: "F-5540", label: "Acompte mission", amount: 44000, status: "En retard", due: "02/09/2026" }],
    notifications: [{ id: "N-9", label: "Relance de paiement envoyée", tone: "warning", date: "06/09/2026" }],
    timeline: [
      { label: "Lead converti en client", date: "20/08/2026" },
      { label: "Devis émis", date: "26/08/2026" },
    ],
  },
  {
    id: "C-108",
    name: "Tarik Benslimane",
    project: "Bureaux Agdal Business",
    dossier: "Clôturé",
    amount: 7500000,
    email: "tarik.benslimane@exemple.ma",
    phone: "+212 6 44 91 27 63",
    quotes: [{ id: "D-2180", label: "Recherche & négociation bureaux", amount: 190000, status: "Validé" }],
    invoices: [{ id: "F-5480", label: "Mission complète", amount: 190000, status: "Payée", due: "15/07/2026" }],
    notifications: [{ id: "N-10", label: "Dossier clôturé", tone: "info", date: "18/07/2026" }],
    timeline: [
      { label: "Ouverture du dossier", date: "02/05/2026" },
      { label: "Bail signé", date: "12/07/2026" },
      { label: "Dossier clôturé", date: "18/07/2026" },
    ],
  },
];

export const ACTIVITY = [
  { label: "Nouveau lead reçu via Instagram", who: "Younes Skalli", time: "il y a 12 min", tone: "info" as const },
  { label: "Lead capté via TikTok", who: "Ghita Bouhaddou", time: "il y a 48 min", tone: "info" as const },
  { label: "Devis validé", who: "Rachid Amrani — D-2202", time: "il y a 2 h", tone: "success" as const },
  { label: "Rendez-vous programmé par l'agent IA", who: "Sofia Idrissi", time: "il y a 4 h", tone: "info" as const },
  { label: "Lead qualifié — budget 8,2 MDH", who: "Mohamed Zeroual", time: "il y a 6 h", tone: "success" as const },
  { label: "Facture en retard", who: "Groupe Bennis Immo — F-5521", time: "hier", tone: "warning" as const },
  { label: "Relance de paiement envoyée", who: "Nawal Ait Ali — F-5540", time: "hier", tone: "warning" as const },
  { label: "Lead converti en client", who: "Hind Lahlou", time: "il y a 3 j", tone: "success" as const },
];

export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "info" | "success" | "warning";
  read: boolean;
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "AN-1", title: "3 nouveaux leads Instagram", detail: "Captés ce matin par l'agent de prospection", time: "il y a 12 min", tone: "info", read: false },
  { id: "AN-2", title: "Rendez-vous confirmé", detail: "Sofia Idrissi — 12 sept. à 14:00", time: "il y a 4 h", tone: "success", read: false },
  { id: "AN-3", title: "Validation humaine requise", detail: "Devis D-2216 — Groupe Bennis Immo", time: "il y a 5 h", tone: "warning", read: false },
  { id: "AN-4", title: "Facture en retard", detail: "F-5521 — 96 000 MAD depuis le 31/08", time: "hier", tone: "warning", read: false },
  { id: "AN-5", title: "Publication prête", detail: "Post LinkedIn « Investir à Harhoura » à valider", time: "hier", tone: "info", read: true },
  { id: "AN-6", title: "Lead converti", detail: "Reda Bouazza — dossier C-105 ouvert", time: "il y a 3 j", tone: "success", read: true },
];

export const MONTHLY = [
  { mois: "Jan", leads: 34, clients: 4, ca: 180 },
  { mois: "Fév", leads: 39, clients: 5, ca: 210 },
  { mois: "Mar", leads: 47, clients: 6, ca: 245 },
  { mois: "Avr", leads: 42, clients: 6, ca: 232 },
  { mois: "Mai", leads: 55, clients: 8, ca: 288 },
  { mois: "Juin", leads: 61, clients: 9, ca: 305 },
  { mois: "Juil", leads: 58, clients: 7, ca: 264 },
  { mois: "Août", leads: 74, clients: 12, ca: 356 },
  { mois: "Sept", leads: 83, clients: 14, ca: 402 },
];

export const CHANNEL_PERF = [
  { canal: "Instagram", leads: 96, conversion: 21 },
  { canal: "TikTok", leads: 71, conversion: 12 },
  { canal: "LinkedIn", leads: 64, conversion: 26 },
  { canal: "Site web", leads: 78, conversion: 18 },
  { canal: "Avito", leads: 52, conversion: 9 },
  { canal: "Partenariat", leads: 38, conversion: 31 },
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
  {
    id: "P-5",
    title: "Bureaux Agdal Business — dernières surfaces",
    network: "LinkedIn",
    status: "Prêt",
    excerpt: "Plateaux modulables au cœur de l'Agdal : une opportunité rare pour les entreprises.",
  },
  {
    id: "P-6",
    title: "Villas Harhoura Bay — visite privée",
    network: "Instagram",
    status: "Brouillon",
    excerpt: "Vue océan, patios ombragés et prestations sur mesure. Visites sur rendez-vous.",
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
    id: "K-7",
    category: "Critères de qualification",
    title: "Leads non qualifiés",
    content:
      "Budget hors marché, zone non couverte ou absence de projet à moins de 12 mois : le lead est classé « Perdu » avec motif.",
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
    id: "K-8",
    category: "Projets immobiliers",
    title: "Bureaux Agdal Business",
    content: "Plateaux professionnels modulables à l'Agdal, destinés aux entreprises et professions libérales.",
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
  {
    id: "K-9",
    category: "Réponses types",
    title: "Délai de réponse",
    content: "L'agent IA répond en moins de 2 minutes ; un consultant reprend la main sous 24 h ouvrées.",
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
