-- Update the location hierarchy structure to Organization → Entity → Location

-- First, create the organizations table if it doesn't exist already
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  tax_id TEXT,
  billing_email TEXT,
  billing_address TEXT,
  subscription_tier TEXT DEFAULT 'standard',
  subscription_status TEXT DEFAULT 'active',
  subscription_renewal_date TIMESTAMP WITH TIME ZONE
);

-- Add organization_id to entities table
ALTER TABLE entities ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Remove regions table and update locations to reference entities directly
ALTER TABLE locations ADD COLUMN IF NOT EXISTS entity_id UUID;

-- Update locations to reference entities directly
UPDATE locations
SET entity_id = regions.entity_id
FROM regions
WHERE locations.region_id = regions.id;

-- Make entity_id a foreign key
ALTER TABLE locations
ALTER COLUMN entity_id SET NOT NULL;

-- Drop the constraint if it exists before adding it
ALTER TABLE locations DROP CONSTRAINT IF EXISTS locations_entity_id_fkey;
ALTER TABLE locations ADD CONSTRAINT locations_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES entities(id);

-- Update user_roles table to reflect new hierarchy
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE user_roles DROP COLUMN IF EXISTS region_id;

-- Update the role types
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
  CHECK (role IN ('organization_admin', 'entity_admin', 'location_manager', 'agent', 'staff'));

-- Enable realtime for organizations table
alter publication supabase_realtime add table organizations;
