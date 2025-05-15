-- Add additional fields to employees table
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS middle_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS employment_type TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS supervisor_id UUID,
ADD COLUMN IF NOT EXISTS termination_date DATE,
ADD COLUMN IF NOT EXISTS access_level TEXT,
ADD COLUMN IF NOT EXISTS system_permissions TEXT[],
ADD COLUMN IF NOT EXISTS salary NUMERIC,
ADD COLUMN IF NOT EXISTS pay_frequency TEXT,
ADD COLUMN IF NOT EXISTS bank_account_info TEXT,
ADD COLUMN IF NOT EXISTS tax_information TEXT,
ADD COLUMN IF NOT EXISTS availability JSON,
ADD COLUMN IF NOT EXISTS working_hours JSON,
ADD COLUMN IF NOT EXISTS performance_reviews JSON,
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS training_completed TEXT[],
ADD COLUMN IF NOT EXISTS documents JSON;

-- Add supervisor relationship
ALTER TABLE employees
ADD CONSTRAINT IF NOT EXISTS employees_supervisor_id_fkey
FOREIGN KEY (supervisor_id)
REFERENCES employees(id);

-- Update realtime publication
alter publication supabase_realtime add table employees;