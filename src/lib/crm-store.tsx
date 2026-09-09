import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  MOCK_CLIENTS,
  MOCK_KNOWLEDGE,
  MOCK_LEADS,
  MOCK_POSTS,
  type Client,
  type KnowledgeItem,
  type Lead,
  type LeadStatus,
  type Post,
  type TimelineEvent,
} from "./mock-data";

type Ctx = {
  leads: Lead[];
  clients: Client[];
  posts: Post[];
  knowledge: KnowledgeItem[];
  setLeadStatus: (id: string, status: LeadStatus) => void;
  convertLead: (id: string) => void;
  validateQuote: (clientId: string, quoteId: string) => void;
  addQuote: (clientId: string, quote: Client["quotes"][number]) => void;
  payInvoice: (clientId: string, invoiceId: string) => void;
  addInvoice: (clientId: string, invoice: Client["invoices"][number]) => void;
  addClientEvent: (clientId: string, event: TimelineEvent, notif?: string) => void;
  publishPost: (id: string) => void;
  addPost: (post: Post) => void;
  upsertKnowledge: (item: KnowledgeItem) => void;
};

const CrmContext = createContext<Ctx | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(MOCK_KNOWLEDGE);

  const value = useMemo<Ctx>(
    () => ({
      leads,
      clients,
      posts,
      knowledge,
      setLeadStatus: (id, status) =>
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l))),
      convertLead: (id) => {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: "Converti" } : l)));
        setClients((prev) => {
          const lead = leads.find((l) => l.id === id);
          if (!lead || prev.some((c) => c.name === lead.name)) return prev;
          const newClient: Client = {
            id: `C-${200 + prev.length}`,
            name: lead.name,
            project: lead.project,
            dossier: "Ouvert",
            amount: 0,
            email: lead.email,
            phone: lead.phone,
            quotes: [
              { id: `D-${3000 + prev.length}`, label: "Accompagnement acquisition", amount: 65000, status: "En attente" },
            ],
            invoices: [],
            notifications: [{ id: "N-new", label: "Dossier créé depuis un lead converti", tone: "info", date: "Aujourd'hui" }],
            timeline: [{ label: "Lead converti en client", date: "Aujourd'hui" }],
          };
          return [newClient, ...prev];
        });
      },
      validateQuote: (clientId, quoteId) =>
        setClients((prev) =>
          prev.map((c) =>
            c.id !== clientId
              ? c
              : {
                  ...c,
                  quotes: c.quotes.map((q) => (q.id === quoteId ? { ...q, status: "Validé" as const } : q)),
                  notifications: [
                    { id: `N-${Date.now()}`, label: `Devis ${quoteId} validé`, tone: "success" as const, date: "Aujourd'hui" },
                    ...c.notifications,
                  ],
                  timeline: [...c.timeline, { label: `Devis ${quoteId} validé`, date: "Aujourd'hui" }],
                },
          ),
        ),
      addClientEvent: (clientId, event, notif) =>
        setClients((prev) =>
          prev.map((c) =>
            c.id !== clientId
              ? c
              : {
                  ...c,
                  timeline: [...c.timeline, event],
                  notifications: notif
                    ? [{ id: `N-${Date.now()}`, label: notif, tone: "info" as const, date: "Aujourd'hui" }, ...c.notifications]
                    : c.notifications,
                },
          ),
        ),
      publishPost: (id) =>
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Publié" } : p))),
      addPost: (post) => setPosts((prev) => [post, ...prev]),
      upsertKnowledge: (item) =>
        setKnowledge((prev) =>
          prev.some((k) => k.id === item.id) ? prev.map((k) => (k.id === item.id ? item : k)) : [item, ...prev],
        ),
    }),
    [leads, clients, posts, knowledge],
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used inside CrmProvider");
  return ctx;
}
