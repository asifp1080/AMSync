-- Add new columns to entities table
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS entity_type TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS headquarters_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS time_zone TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS associated_regions TEXT[],
ADD COLUMN IF NOT EXISTS default_currency TEXT,
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS ip_whitelist TEXT[],
ADD COLUMN IF NOT EXISTS email_marketing_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sms_marketing_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferred_notification_channels TEXT[],
ADD COLUMN IF NOT EXISTS uploaded_documents JSONB;

-- Update existing entities to have a default entity_type
UPDATE entities SET entity_type = 'Corporate Owner' WHERE entity_type IS NULL;

-- Make entity_type required
ALTER TABLE entities ALTER COLUMN entity_type SET NOT NULL;

-- Entities table is already part of supabase_realtime publication
-- No need to add it again