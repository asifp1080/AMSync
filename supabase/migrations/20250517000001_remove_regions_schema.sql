-- Drop foreign key constraints first
ALTER TABLE locations DROP CONSTRAINT IF EXISTS locations_region_id_fkey;

-- Update locations table to remove region_id dependency
ALTER TABLE locations DROP COLUMN IF EXISTS region_id;

-- Drop the regions table
DROP TABLE IF EXISTS regions;

-- Add direct entity_id foreign key to locations if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'locations_entity_id_fkey') THEN
    ALTER TABLE locations ADD CONSTRAINT locations_entity_id_fkey 
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make entity_id NOT NULL in locations table
ALTER TABLE locations ALTER COLUMN entity_id SET NOT NULL;
