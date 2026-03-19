# Suivi des Postulations

Application web de suivi des candidatures, construite avec React + Supabase.

## Stack technique

- **Frontend** : React 18 + Vite
- **UI** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Hébergement** : Vercel

---

## Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd suivi-postulations
npm install
```

### 2. Configurer Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans **SQL Editor**, exécutez le contenu du fichier `supabase/schema.sql`
4. Récupérez vos clés dans **Settings → API**

### 3. Variables d'environnement

Copiez `.env.example` en `.env.local` et remplissez vos clés :

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

### 4. Lancer en développement

```bash
npm run dev
```

---

## Structure du projet

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   ├── postulations/
│   │   ├── PostulationTable.jsx
│   │   ├── PostulationForm.jsx
│   │   └── PostulationRow.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── StatCard.jsx
│       ├── EntretiensAVenir.jsx
│       └── RelancesTable.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── SuiviPage.jsx
│   └── DashboardPage.jsx
├── hooks/
│   ├── usePostulations.js
│   └── useAuth.js
├── lib/
│   └── supabase.js
├── App.jsx
└── main.jsx
```

---

## Déploiement sur Vercel

```bash
npm install -g vercel
vercel
```

Ajoutez vos variables d'environnement dans le dashboard Vercel.