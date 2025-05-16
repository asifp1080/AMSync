-- Update employees table with new fields from the Employee Schema document
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS middle_name TEXT,
  ADD COLUMN IF NOT EXISTS preferred_name TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS ssn TEXT,
  ADD COLUMN IF NOT EXISTS address_line_1 TEXT,
  ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
  ADD COLUMN IF NOT EXISTS employment_type TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES employees(id),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
  ADD COLUMN IF NOT EXISTS termination_date DATE,
  ADD COLUMN IF NOT EXISTS assigned_organization_id UUID REFERENCES organizations(id),
  ADD COLUMN IF NOT EXISTS assigned_entity_id UUID REFERENCES entities(id),
  ADD COLUMN IF NOT EXISTS assigned_groups UUID[],
  ADD COLUMN IF NOT EXISTS pay_rate DECIMAL,
  ADD COLUMN IF NOT EXISTS pay_rate_type TEXT,
  ADD COLUMN IF NOT EXISTS pay_frequency TEXT,
  ADD COLUMN IF NOT EXISTS gusto_employee_id TEXT,
  ADD COLUMN IF NOT EXISTS direct_deposit_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
  ADD COLUMN IF NOT EXISTS bank_routing_number TEXT,
  ADD COLUMN IF NOT EXISTS benefits_enrolled TEXT[],
  ADD COLUMN IF NOT EXISTS deductions JSONB,
  ADD COLUMN IF NOT EXISTS uploaded_documents JSONB,
  ADD COLUMN IF NOT EXISTS clock_in_out_records JSONB,
  ADD COLUMN IF NOT EXISTS current_status TEXT,
  ADD COLUMN IF NOT EXISTS assigned_shifts JSONB,
  ADD COLUMN IF NOT EXISTS time_off_requests JSONB,
  ADD COLUMN IF NOT EXISTS available_vacation_days INTEGER,
  ADD COLUMN IF NOT EXISTS available_sick_days INTEGER;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_assigned_organization_id ON employees(assigned_organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_assigned_entity_id ON employees(assigned_entity_id);

-- Enable realtime for the employees table
alter publication supabase_realtime add table employees;
