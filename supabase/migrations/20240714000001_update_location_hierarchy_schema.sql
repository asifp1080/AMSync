-- Update entities table with new fields
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS legal_entity_type TEXT,
ADD COLUMN IF NOT EXISTS ein TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS license_expiration_date DATE,
ADD COLUMN IF NOT EXISTS gl_policy_number TEXT,
ADD COLUMN IF NOT EXISTS gl_policy_expiration_date DATE,
ADD COLUMN IF NOT EXISTS e_and_o_policy_number TEXT,
ADD COLUMN IF NOT EXISTS e_and_o_policy_expiration_date DATE,
ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT;

-- Update regions table with new fields
ALTER TABLE regions
ADD COLUMN IF NOT EXISTS uploaded_documents JSONB;

-- Update locations table with new fields
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS address_line_1 TEXT,
ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS time_zone TEXT,
ADD COLUMN IF NOT EXISTS operating_hours JSONB,
ADD COLUMN IF NOT EXISTS ip_whitelist TEXT[],
ADD COLUMN IF NOT EXISTS assigned_employees TEXT[],
ADD COLUMN IF NOT EXISTS assigned_policies TEXT[],
ADD COLUMN IF NOT EXISTS stripe_location_account_id TEXT,
ADD COLUMN IF NOT EXISTS uploaded_documents JSONB;

-- Add the tables to the realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'regions'
  ) THEN
    alter publication supabase_realtime add table regions;
  END IF;
END
$$;