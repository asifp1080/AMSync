-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_name TEXT NOT NULL,
  group_description TEXT,
  group_manager_id UUID REFERENCES employees(id),
  group_tags TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_locations mapping table (join table)
CREATE TABLE IF NOT EXISTS group_locations (
  mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  added_on TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, location_id)
);

-- Enable realtime for the new tables
alter publication supabase_realtime add table groups;
alter publication supabase_realtime add table group_locations;
