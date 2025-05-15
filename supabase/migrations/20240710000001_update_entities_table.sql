-- Add new fields to entities table
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS entity_type TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS license_type TEXT,
ADD COLUMN IF NOT EXISTS license_exp_date DATE,
ADD COLUMN IF NOT EXISTS eo_policy_number TEXT,
ADD COLUMN IF NOT EXISTS eo_exp_date DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS time_zone TEXT;

-- Realtime is already enabled for entities table
-- No need to add it again to supabase_realtime publication
