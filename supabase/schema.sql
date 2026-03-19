-- =============================================
-- SCHEMA SUIVI DES POSTULATIONS
-- À exécuter dans Supabase > SQL Editor
-- =============================================

-- Table principale des postulations
CREATE TABLE postulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  institution TEXT NOT NULL,
  infos_societe TEXT,
  infos_poste TEXT,

  date_postulation DATE,
  date_entree DATE,
  date_relance DATE,
  date_entretien_1 DATE,
  date_entretien_2 DATE,

  chomage BOOLEAN DEFAULT FALSE,
  refus BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_postulations_user_id ON postulations(user_id);
CREATE INDEX idx_postulations_date_postulation ON postulations(date_postulation);

-- Row Level Security (chaque user ne voit que ses données)
ALTER TABLE postulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own postulations"
  ON postulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own postulations"
  ON postulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own postulations"
  ON postulations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own postulations"
  ON postulations FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER postulations_updated_at
  BEFORE UPDATE ON postulations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();