# Lead Navigator

Prototype frontend premium CRM IA pour Lead Advisory Consulting
Crée un prototype frontend premium, moderne et hautement interactif (sans backend réel, sans base de données réelle, sans authentification réelle, sans API réelle, sans intégration externe réelle) d'une plateforme CRM immobilière intelligente destinée à Lead Advisory Consulting, cabinet de conseil en immobilier basé à Harhoura, Témara, Maroc.

Ce prototype est un outil de démonstration commerciale : il doit être visuellement impressionnant, donner l'impression d'un produit avancé et réellement fonctionnel, tout en restant entièrement piloté par des données mockées et de l'état frontend local.

Identité visuelle à reprendre fidèlement (basée sur le site officiel)

Reproduis l'univers visuel du site institutionnel de Lead Advisory Consulting dans toute l'application (navigation, dashboard, cartes, boutons, tableaux, modales, notifications) :

Fond principal : évite le blanc pur comme couleur de fond dominante. Utilise à la place un fond neutre chaud et légèrement teinté, par exemple un beige/crème très clair (proche de #F5F1EA ou #F2EDE4) ou un gris-anthracite doux pour les zones sombres, afin d'obtenir un rendu premium et moins agressif visuellement. Réserve le blanc pur uniquement à de petites zones de contraste (cartes, icônes) si nécessaire.

Couleur d'accent : dorée/bronze chaude (proche de #C4935B), utilisée pour les boutons d'action, les icônes de mise en avant, les bordures actives, les badges premium et les éléments de rareté/exclusivité.

Texte principal : noir profond quasi-charbon (#0D0D0D) sur les fonds clairs.

Section sombre : conserve une section footer/contact sur fond noir profond (#0D0D0D) avec texte blanc et touches dorées, comme sur le site.

Logo : logo doré stylisé représentant un toit de maison géométrique au-dessus du nom "LEAD ADVISORY CONSULTING", à afficher dans le header et le footer du prototype.

Typographie : titres en majuscules ou semi-majuscules, style serif/élégant pour les grands titres ("VOTRE PARTENAIRE STRATÉGIQUE EN IMMOBILIER"), texte courant en sans-serif propre et aéré, hiérarchie typographique nette entre titres, sous-titres et corps de texte.

Style visuel global : esthétique immobilier premium/haut de gamme, grandes photos d'architecture et de façades de standing en arrière-plan de hero, cartes avec coins légèrement arrondis, ombres douces, fond légèrement teinté plutôt que blanc pur, mise en avant de badges/labels (ex. "Opportunité exclusive", "Livré", "16 ans d'expérience").

Continuité de marque : le prototype doit clairement ressembler à un espace applicatif conçu spécifiquement pour Lead Advisory Consulting (mêmes couleurs, même logo, même ton visuel que le site vitrine), et non à un template CRM générique.

Structure générale de l'application

Crée une navigation principale (sidebar ou topbar sur fond clair teinté avec logo doré) permettant de basculer entre les modules suivants, avec un tableau de bord d'accueil premium comme point d'entrée après un écran de connexion illustratif (non fonctionnel, juste esthétique et cohérent avec l'identité de marque) :

Tableau de bord

Prospection / Leads

Clients / Ventes

Reporting / KPI

Marketing

Base de connaissances (agents IA)

Page "Tableau de bord"

Affiche des cartes KPI premium en haut de page (nombre de leads actifs, taux de conversion, nombre de clients actifs, chiffre d'affaires généré), avec icônes dorées et légères animations d'apparition/compteur au chargement, sur un fond légèrement teinté (pas blanc pur).

Affiche un aperçu du pipeline de leads (mini-vue des statuts) et un aperçu des dossiers clients récents, chacun cliquable pour naviguer vers le module complet.

Affiche un fil d'activité récente mock (ex. "Nouveau lead reçu via Instagram", "Devis validé pour Client X") avec badges de statut colorés.

1. Module Prospection et gestion des leads (module central du MVP)

Page "Pipeline des leads"

Vue pipeline en colonnes (Nouveau, Premier contact, Qualification en cours, Qualifié, Rendez-vous programmé, Converti, Perdu), avec cartes de leads mock déplaçables par glisser-déposer ou changement de statut en un clic, avec transition animée légère lors du déplacement.

Génère 10 à 15 leads mock avec nom, canal d'origine (Prospection directe, Instagram, LinkedIn, Site web, Avito, Partenariat agence), projet immobilier d'intérêt cohérent avec les biens du site (ex. villa à Souissi, appartement à Harhoura, projet à Rabat Océan), statut, date de dernier contact.

Filtres cliquables par canal d'origine et par statut au-dessus du pipeline.

Barre de recherche pour filtrer les leads par nom (fonctionnelle sur les données mock en frontend).

Drawer/panneau "Fiche lead détaillée"

S'ouvre en drawer latéral animé au clic sur une carte lead, affichant : coordonnées fictives, canal d'origine avec icône, statut de qualification (badge coloré), historique/timeline chronologique animée des événements (réception du lead, premier contact automatique, informations collectées, qualification, proposition de rendez-vous).

Section "Agent IA de prospection" présentée comme un fil de conversation simulé (bulles de chat) montrant le premier contact automatique, la collecte d'informations, la qualification selon des critères, et la proposition/réservation automatique d'un rendez-vous — clairement présentée comme une simulation de l'agent IA.

Boutons d'action "Convertir en client" et "Marquer comme perdu" en bas du drawer, représentant le point de bascule vers l'intervention humaine pour la conversion et la clôture ; au clic, mettent à jour le statut du lead et affichent une notification toast de confirmation animée.

2. Module Gestion du client et administration des ventes

Page "Liste des clients"

Tableau moderne listant les clients mock (issus de leads convertis) avec colonnes triables/filtrables : nom, projet immobilier, statut du dossier (badge coloré), montant du devis.

Ligne de tableau cliquable ouvrant la fiche client.

Page "Fiche client"

Vue détaillée avec onglets ou sections : Informations client, Devis, Facturation/Paiements, Communication, Suivi du dossier.

Devis : liste de devis mock avec montants et statuts (En attente, Validé, Refusé) sous forme de badges ; bouton "Valider le devis" déclenchant une animation de changement de statut et une notification de confirmation.

Facturation et paiements : liste de factures mock avec statut de paiement (Payée, En attente, En retard) présentée en cartes ou tableau avec indicateurs visuels colorés.

Envoi d'e-mails : formulaire simulé (objet, message) avec bouton d'envoi déclenchant une confirmation visuelle animée, sans envoi réel.

Relances : bouton "Envoyer une relance" ajoutant un événement animé à la timeline du dossier.

Notifications : liste de notifications mock liées au dossier (ex. "Devis validé", "Paiement reçu"), avec icônes et code couleur.

Suivi global du dossier : timeline verticale récapitulative animée de toutes les étapes et actions du dossier client.

Badge "Validation humaine requise" affiché sur les actions sensibles (validation de devis, confirmation de paiement) pour illustrer l'intervention humaine nécessaire.

3. Module Reporting et KPI

Page "Tableau de bord / KPI"

Cartes KPI animées (compteurs) : nombre total de leads, taux de conversion, nombre de clients actifs, chiffre d'affaires généré, avec valeurs mock réalistes.

Graphiques (courbes/barres) illustrant l'évolution des leads et clients dans le temps, avec données mock statiques, légendes et tooltips au survol.

Section "Performances commerciales" comparant les canaux d'acquisition (Instagram, LinkedIn, Site web, Avito, Partenariats, Prospection directe) via un graphique ou des barres de progression colorées.

Encart visuel signalant les points nécessitant davantage d'efforts (ex. canal ou étape du pipeline avec taux de conversion plus faible mis en évidence avec une couleur d'alerte douce).

4. Module Automatisation marketing

Page "Marketing"

Section "Génération de contenus" : formulaire simulé (sélection d'un type de bien ou d'une thématique) avec bouton "Générer le post" affichant, avec une légère animation de chargement puis apparition, un exemple de texte de post mock pré-rédigé (pas de génération IA réelle en arrière-plan).

Section "Préparation des publications" : galerie de brouillons de publications mock avec statut (Brouillon, Prêt, Publié) sous forme de cartes avec aperçu visuel.

Section "Publication automatisée" : bouton "Publier" sur un brouillon simulant le passage au statut "Publié" avec icône du réseau visé (Instagram, LinkedIn) et animation de confirmation, sans connexion réelle.

Section "FAQ" : accordéon de questions/réponses statiques mock pertinentes pour un client immobilier (ex. modalités de visite, documents nécessaires, étapes d'achat), avec animation d'ouverture/fermeture fluide.

5. Module Base de connaissances et paramétrage des agents IA

Page "Base de connaissances"

Liste de fiches d'informations métier mock (ex. critères de qualification des leads, informations sur les projets immobiliers, réponses types), présentée en cartes ou tableau éditable.

Boutons "Ajouter une information" et "Modifier" ouvrant une modale animée avec formulaire simulé ; la sauvegarde met à jour la liste affichée dans l'état frontend uniquement.

Section "Paramétrage des agents IA" présentant des champs/toggles mock illustrant les réglages ajustables par le client pour ses agents IA (prospection, gestion clientèle), sans logique de configuration réelle en arrière-plan.

Parcours de démonstration à rendre pleinement interactifs

Parcours 1 — Suivi d'un lead : tableau de bord → pipeline → ouverture de la fiche lead → consultation de la timeline et du fil de conversation IA simulé → conversion en client.

Parcours 2 — Gestion d'un dossier client : liste des clients → fiche client → validation d'un devis → simulation d'envoi d'e-mail et de relance.

Parcours 3 — Pilotage de l'activité : tableau de bord → module Reporting/KPI → exploration des graphiques et de l'encart de performance par canal.

Parcours 4 — Préparation marketing : module Marketing → génération d'un post mock → passage de brouillon à publié.

Parcours 5 — Mise à jour de la base de connaissances : ajout ou modification d'une fiche d'information métier mock via modale.

Interactivité frontend attendue

Toutes les actions suivantes doivent produire une réaction visuelle immédiate en utilisant uniquement de l'état local frontend et des mock data, sans aucun appel réseau réel : navigation entre pages, ouverture de fiches/drawers/modales, changement de statut (pipeline, devis, publication), filtres et recherche, notifications toast, changement d'étape dans les workflows, tri/interaction sur les tableaux, survol des graphiques et KPI, simulation du fil de conversation de l'agent IA, simulation de prise de rendez-vous.

Éléments à simuler plutôt qu'à réellement implémenter

Aucune authentification réelle (écran de connexion illustratif possible, sans vérification réelle).

Aucun appel API, aucune intégration réelle aux réseaux sociaux, à WhatsApp, à Avito ou à un système d'e-mailing.

Aucune génération IA réelle : tout contenu attribué à un "agent IA" provient de mock data pré-écrites affichées de façon crédible.

Aucun calcul réel de KPI : tous les chiffres et graphiques sont des données statiques mock.

Toute action (valider, publier, envoyer, relancer, convertir) modifie uniquement l'état frontend local et affiche un retour visuel animé.

Éléments à NE PAS inclure dans ce prototype

N'implémente pas de module de service après-vente (prise de rendez-vous pour remise des clés, collecte de remarques post-livraison, suivi des demandes clients après livraison) : cette fonctionnalité est explicitement prévue ultérieurement. Si tu souhaites l'évoquer, ajoute uniquement une mention discrète "Module à venir" dans la navigation, sans développer aucune page ou fonctionnalité associée.

N'affiche aucune grille tarifaire, coût d'hébergement ou détail de capacité IA : ces éléments relèvent de la proposition commerciale, pas du prototype.

N'invente aucun critère de qualification précis, aucune règle métier, aucun champ de données, canal ou parcours utilisateur non mentionné dans les sources fournies.

Résultat attendu

Un prototype web frontend premium, entièrement navigable, animé et interactif avec des mock data réalistes, reprenant fidèlement l'identité visuelle du site de Lead Advisory Consulting (palette beige/crème clair ou anthracite, noir, doré — sans fond blanc pur dominant — logo, style immobilier haut de gamme). Il doit illustrer de façon commercialement convaincante une plateforme CRM immobilière modulaire avec agents IA simulés sur la prospection/qualification des leads, la gestion client/ventes, le reporting/KPI, l'automatisation marketing et la base de connaissances des agents IA — avec des points d'intervention humaine visibles sur les étapes de validation et de décision, et sans aucune fonctionnalité de service après-vente développée (uniquement mentionnée comme future).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a1f4465a-9ba7-43bc-9cb4-04f8c95c4e1f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
