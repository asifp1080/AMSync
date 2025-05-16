-- Update organizations table with all fields from the schema
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS address_line_1 TEXT,
ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA';

-- Update entities table with all fields from the schema
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS legal_entity_type TEXT,
ADD COLUMN IF NOT EXISTS ein TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS license_expiration_date DATE,
ADD COLUMN IF NOT EXISTS gl_policy_number TEXT,
ADD COLUMN IF NOT EXISTS gl_liability_coverage TEXT,
ADD COLUMN IF NOT EXISTS gl_policy_expiration_date DATE,
ADD COLUMN IF NOT EXISTS e_and_o_policy_number TEXT,
ADD COLUMN IF NOT EXISTS e_and_o_liability_coverage TEXT,
ADD COLUMN IF NOT EXISTS e_and_o_policy_expiration_date DATE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

-- Update locations table with all fields from the schema
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS address_line_1 TEXT,
ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS operating_hours JSONB,
ADD COLUMN IF NOT EXISTS ip_whitelist TEXT[],
ADD COLUMN IF NOT EXISTS assigned_employees TEXT[],
ADD COLUMN IF NOT EXISTS assigned_policies TEXT[],
ADD COLUMN IF NOT EXISTS stripe_location_account_id TEXT;

-- Update groups table with all fields from the schema
ALTER TABLE groups
ADD COLUMN IF NOT EXISTS group_description TEXT,
ADD COLUMN IF NOT EXISTS group_manager_id TEXT,
ADD COLUMN IF NOT EXISTS group_tags TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create group_locations mapping table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_locations (
  mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  added_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, location_id)
);

-- Group_locations table is already part of the realtime publication, no need to add it again
-- alter publication supabase_realtime add table group_locations;
