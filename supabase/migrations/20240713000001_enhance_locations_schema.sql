-- Enhance locations table with additional fields
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS location_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(20),
ADD COLUMN IF NOT EXISTS primary_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS hours_of_operation VARCHAR(255),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add the table to the realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'locations'
  ) THEN
    alter publication supabase_realtime add table locations;
  END IF;
END
$$;