-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add organization_id to entities table
ALTER TABLE entities ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_entities_organization_id ON entities(organization_id);
