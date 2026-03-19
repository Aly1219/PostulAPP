# PostulAPP 📋

Application web de suivi des candidatures d'emploi, construite avec React et Supabase.

🔗 **[Accéder à l'application](https://postulapplication.vercel.app)**

---

## Fonctionnalités

### 📊 Dashboard
- Statistiques en temps réel : postulations du mois, en cours, chômage non déclaré, total, refus
- Entretiens à venir
- Relances J+15
- Répartition par institution et par poste

### 📝 Suivi des postulations
- Ajout, modification et suppression de candidatures
- Suivi des dates : postulation, entrée en fonction, relance, entretiens
- Validation : la date d'entrée ne peut pas être antérieure à la date de postulation
- Filtres : toutes / en cours / refus
- Journal de notes par postulation avec support Markdown
- Catégories de notes : entretien, relance, contact, document, autre

### 🏢 Catalogue d'entreprises
- Fiche par entreprise : site web, adresse, contact RH, notes
- Système de favoris ⭐
- Recherche et filtre par favoris
- Compteur de postulations par entreprise

### 🔐 Authentification
- Inscription et connexion par email
- Chaque utilisateur ne voit que ses propres données (Row Level Security)

---

## Stack technique

| Outil | Rôle |
|---|---|
| React 18 + Vite | Frontend |
| Tailwind CSS | Styles |
| Supabase | Base de données PostgreSQL + Auth |
| Vercel | Hébergement et déploiement |
| react-markdown | Rendu Markdown dans les notes |
| date-fns | Manipulation des dates |

---

## Structure du projet

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   └── postulations/
│       ├── PostulationTable.jsx
│       ├── PostulationForm.jsx
│       └── NotesJournal.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── SuiviPage.jsx
│   ├── DashboardPage.jsx
│   └── EntreprisesPage.jsx
├── hooks/
│   ├── usePostulations.js
│   ├── useNotes.js
│   ├── useEntreprises.js
│   └── useAuth.js
├── lib/
│   └── supabase.js
├── App.jsx
└── main.jsx
```