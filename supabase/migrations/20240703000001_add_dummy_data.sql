-- Add dummy entities
INSERT INTO entities (id, name, description) VALUES
('ent-001', 'Pacific Insurance Group', 'West coast insurance operations'),
('ent-002', 'Atlantic Insurance Partners', 'East coast insurance operations'),
('ent-003', 'Midwest Insurance Alliance', 'Central states insurance operations')
ON CONFLICT (id) DO NOTHING;

-- Add dummy regions
INSERT INTO regions (id, entity_id, name, description) VALUES
('reg-001', 'ent-001', 'Northwest Region', 'Washington, Oregon, Idaho'),
('reg-002', 'ent-001', 'Southwest Region', 'California, Nevada, Arizona'),
('reg-003', 'ent-002', 'Northeast Region', 'New York, Massachusetts, Connecticut'),
('reg-004', 'ent-002', 'Southeast Region', 'Florida, Georgia, South Carolina'),
('reg-005', 'ent-003', 'North Central Region', 'Minnesota, Wisconsin, Michigan'),
('reg-006', 'ent-003', 'South Central Region', 'Texas, Oklahoma, Louisiana')
ON CONFLICT (id) DO NOTHING;

-- Add dummy locations
INSERT INTO locations (id, region_id, name, address, city, state, zip_code, phone, email, allowed_ip_ranges) VALUES
('loc-001', 'reg-001', 'Seattle Office', '500 Pine Street', 'Seattle', 'WA', '98101', '206-555-1000', 'seattle@pacificins.com', ARRAY['192.168.1.0/24']),
('loc-002', 'reg-001', 'Portland Office', '350 Oak Avenue', 'Portland', 'OR', '97205', '503-555-2000', 'portland@pacificins.com', ARRAY['192.168.2.0/24']),
('loc-003', 'reg-002', 'San Francisco Office', '1 Market Street', 'San Francisco', 'CA', '94105', '415-555-3000', 'sf@pacificins.com', ARRAY['192.168.3.0/24']),
('loc-004', 'reg-002', 'Los Angeles Office', '555 Wilshire Blvd', 'Los Angeles', 'CA', '90036', '213-555-4000', 'la@pacificins.com', ARRAY['192.168.4.0/24']),
('loc-005', 'reg-003', 'New York Office', '100 Broadway', 'New York', 'NY', '10006', '212-555-5000', 'nyc@atlanticins.com', ARRAY['192.168.5.0/24']),
('loc-006', 'reg-003', 'Boston Office', '200 State Street', 'Boston', 'MA', '02109', '617-555-6000', 'boston@atlanticins.com', ARRAY['192.168.6.0/24']),
('loc-007', 'reg-004', 'Miami Office', '800 Ocean Drive', 'Miami', 'FL', '33139', '305-555-7000', 'miami@atlanticins.com', ARRAY['192.168.7.0/24']),
('loc-008', 'reg-004', 'Atlanta Office', '1200 Peachtree St', 'Atlanta', 'GA', '30309', '404-555-8000', 'atlanta@atlanticins.com', ARRAY['192.168.8.0/24']),
('loc-009', 'reg-005', 'Minneapolis Office', '300 Nicollet Mall', 'Minneapolis', 'MN', '55403', '612-555-9000', 'minneapolis@midwestins.com', ARRAY['192.168.9.0/24']),
('loc-010', 'reg-005', 'Detroit Office', '400 Woodward Ave', 'Detroit', 'MI', '48226', '313-555-0100', 'detroit@midwestins.com', ARRAY['192.168.10.0/24']),
('loc-011', 'reg-006', 'Dallas Office', '1000 Main Street', 'Dallas', 'TX', '75201', '214-555-0200', 'dallas@midwestins.com', ARRAY['192.168.11.0/24']),
('loc-012', 'reg-006', 'Houston Office', '1500 Louisiana St', 'Houston', 'TX', '77002', '713-555-0300', 'houston@midwestins.com', ARRAY['192.168.12.0/24'])
ON CONFLICT (id) DO NOTHING;

-- Add dummy employees
INSERT INTO employees (id, first_name, last_name, email, role, phone, hire_date) VALUES
('emp-001', 'John', 'Smith', 'john.smith@pacificins.com', 'manager', '206-555-1001', '2020-01-15'),
('emp-002', 'Sarah', 'Johnson', 'sarah.johnson@pacificins.com', 'agent', '206-555-1002', '2020-03-10'),
('emp-003', 'Michael', 'Williams', 'michael.williams@pacificins.com', 'agent', '503-555-2001', '2020-02-20'),
('emp-004', 'Emily', 'Brown', 'emily.brown@pacificins.com', 'manager', '415-555-3001', '2019-11-05'),
('emp-005', 'David', 'Jones', 'david.jones@pacificins.com', 'agent', '213-555-4001', '2021-01-10'),
('emp-006', 'Jennifer', 'Garcia', 'jennifer.garcia@atlanticins.com', 'manager', '212-555-5001', '2019-08-15'),
('emp-007', 'Robert', 'Miller', 'robert.miller@atlanticins.com', 'agent', '617-555-6001', '2020-05-22'),
('emp-008', 'Lisa', 'Davis', 'lisa.davis@atlanticins.com', 'agent', '305-555-7001', '2021-03-15'),
('emp-009', 'James', 'Rodriguez', 'james.rodriguez@atlanticins.com', 'manager', '404-555-8001', '2019-10-10'),
('emp-010', 'Patricia', 'Martinez', 'patricia.martinez@midwestins.com', 'manager', '612-555-9001', '2020-04-01'),
('emp-011', 'Thomas', 'Hernandez', 'thomas.hernandez@midwestins.com', 'agent', '313-555-0101', '2021-02-15'),
('emp-012', 'Jessica', 'Lopez', 'jessica.lopez@midwestins.com', 'agent', '214-555-0201', '2020-07-20'),
('emp-013', 'Daniel', 'Gonzalez', 'daniel.gonzalez@midwestins.com', 'manager', '713-555-0301', '2019-12-01')
ON CONFLICT (id) DO NOTHING;

-- Link employees to locations
INSERT INTO employee_locations (employee_id, location_id) VALUES
('emp-001', 'loc-001'),
('emp-002', 'loc-001'),
('emp-003', 'loc-002'),
('emp-004', 'loc-003'),
('emp-005', 'loc-004'),
('emp-006', 'loc-005'),
('emp-007', 'loc-006'),
('emp-008', 'loc-007'),
('emp-009', 'loc-008'),
('emp-010', 'loc-009'),
('emp-011', 'loc-010'),
('emp-012', 'loc-011'),
('emp-013', 'loc-012')
ON CONFLICT (employee_id, location_id) DO NOTHING;

-- Add dummy customers and link them to locations
INSERT INTO customers (id, name, email, phone, address, city, state, zip_code, status, location_id, last_contact) VALUES
('cust-001', 'Jane Cooper', 'jane.cooper@example.com', '(555) 123-4567', '123 Main St', 'Seattle', 'WA', '98101', 'active', 'loc-001', '2023-06-15'),
('cust-002', 'Robert Fox', 'robert.fox@example.com', '(555) 234-5678', '456 Oak Ave', 'Portland', 'OR', '97205', 'pending', 'loc-002', '2023-06-10'),
('cust-003', 'Esther Howard', 'esther.howard@example.com', '(555) 345-6789', '789 Pine St', 'San Francisco', 'CA', '94105', 'active', 'loc-003', '2023-06-05'),
('cust-004', 'Cameron Williamson', 'cameron.williamson@example.com', '(555) 456-7890', '101 Market St', 'Los Angeles', 'CA', '90036', 'inactive', 'loc-004', '2023-05-20'),
('cust-005', 'Brooklyn Simmons', 'brooklyn.simmons@example.com', '(555) 567-8901', '202 Broadway', 'New York', 'NY', '10006', 'active', 'loc-005', '2023-06-18'),
('cust-006', 'Leslie Alexander', 'leslie.alexander@example.com', '(555) 678-9012', '303 State St', 'Boston', 'MA', '02109', 'active', 'loc-006', '2023-06-20'),
('cust-007', 'Dianne Russell', 'dianne.russell@example.com', '(555) 789-0123', '404 Ocean Dr', 'Miami', 'FL', '33139', 'pending', 'loc-007', '2023-06-12'),
('cust-008', 'Theresa Webb', 'theresa.webb@example.com', '(555) 890-1234', '505 Peachtree St', 'Atlanta', 'GA', '30309', 'active', 'loc-008', '2023-06-08'),
('cust-009', 'Kathryn Murphy', 'kathryn.murphy@example.com', '(555) 901-2345', '606 Nicollet Mall', 'Minneapolis', 'MN', '55403', 'inactive', 'loc-009', '2023-05-25'),
('cust-010', 'Cody Fisher', 'cody.fisher@example.com', '(555) 012-3456', '707 Woodward Ave', 'Detroit', 'MI', '48226', 'active', 'loc-010', '2023-06-17'),
('cust-011', 'Jerome Bell', 'jerome.bell@example.com', '(555) 123-4567', '808 Main St', 'Dallas', 'TX', '75201', 'active', 'loc-011', '2023-06-19'),
('cust-012', 'Bessie Cooper', 'bessie.cooper@example.com', '(555) 234-5678', '909 Louisiana St', 'Houston', 'TX', '77002', 'pending', 'loc-012', '2023-06-11'),
('cust-013', 'Courtney Henry', 'courtney.henry@example.com', '(555) 345-6789', '1010 Pike St', 'Seattle', 'WA', '98101', 'active', 'loc-001', '2023-06-16'),
('cust-014', 'Devon Lane', 'devon.lane@example.com', '(555) 456-7890', '1111 Burnside St', 'Portland', 'OR', '97205', 'active', 'loc-002', '2023-06-14'),
('cust-015', 'Darrell Steward', 'darrell.steward@example.com', '(555) 567-8901', '1212 Mission St', 'San Francisco', 'CA', '94105', 'inactive', 'loc-003', '2023-05-30')
ON CONFLICT (id) DO NOTHING;

-- Add dummy policies and link them to customers and locations
INSERT INTO policies (id, customer_id, location_id, policy_number, policy_type, premium, start_date, end_date, status) VALUES
('pol-001', 'cust-001', 'loc-001', 'POL-2023-001', 'Auto Insurance', 1200.00, '2023-01-15', '2024-01-14', 'active'),
('pol-002', 'cust-001', 'loc-001', 'POL-2023-002', 'Home Insurance', 950.00, '2023-02-20', '2024-02-19', 'active'),
('pol-003', 'cust-001', 'loc-001', 'POL-2023-003', 'Life Insurance', 750.00, '2023-07-01', '2024-06-30', 'pending'),
('pol-004', 'cust-002', 'loc-002', 'POL-2023-004', 'Auto Insurance', 1100.00, '2023-03-10', '2024-03-09', 'active'),
('pol-005', 'cust-003', 'loc-003', 'POL-2023-005', 'Business Insurance', 2500.00, '2023-04-15', '2024-04-14', 'active'),
('pol-006', 'cust-003', 'loc-003', 'POL-2023-006', 'Liability Insurance', 1800.00, '2023-05-20', '2024-05-19', 'active'),
('pol-007', 'cust-004', 'loc-004', 'POL-2023-007', 'Travel Insurance', 350.00, '2023-01-01', '2023-12-31', 'active'),
('pol-008', 'cust-005', 'loc-005', 'POL-2023-008', 'Auto Insurance', 1300.00, '2023-02-15', '2024-02-14', 'active'),
('pol-009', 'cust-005', 'loc-005', 'POL-2023-009', 'Home Insurance', 1050.00, '2023-03-20', '2024-03-19', 'active'),
('pol-010', 'cust-005', 'loc-005', 'POL-2023-010', 'Life Insurance', 800.00, '2023-04-25', '2024-04-24', 'active'),
('pol-011', 'cust-005', 'loc-005', 'POL-2023-011', 'Health Insurance', 2200.00, '2023-05-30', '2024-05-29', 'active'),
('pol-012', 'cust-006', 'loc-006', 'POL-2023-012', 'Auto Insurance', 1250.00, '2023-01-10', '2024-01-09', 'active'),
('pol-013', 'cust-007', 'loc-007', 'POL-2023-013', 'Home Insurance', 980.00, '2023-02-05', '2024-02-04', 'pending'),
('pol-014', 'cust-008', 'loc-008', 'POL-2023-014', 'Business Insurance', 2700.00, '2023-03-15', '2024-03-14', 'active'),
('pol-015', 'cust-008', 'loc-008', 'POL-2023-015', 'Liability Insurance', 1900.00, '2023-04-20', '2024-04-19', 'active')
ON CONFLICT (id) DO NOTHING;

-- Add dummy communications
INSERT INTO communications (id, customer_id, from_user, type, content, date) VALUES
('comm-001', 'cust-001', 'System', 'email', 'Policy renewal notification sent', '2023-06-15'),
('comm-002', 'cust-001', 'emp-001', 'call', 'Discussed policy options and premium changes', '2023-06-10'),
('comm-003', 'cust-001', 'System', 'message', 'SMS reminder about upcoming payment', '2023-06-05'),
('comm-004', 'cust-002', 'emp-003', 'email', 'New policy confirmation', '2023-06-12'),
('comm-005', 'cust-003', 'emp-004', 'call', 'Claim status update', '2023-06-08'),
('comm-006', 'cust-004', 'System', 'email', 'Policy expiration notice', '2023-05-20'),
('comm-007', 'cust-005', 'emp-006', 'message', 'Welcome message for new customer', '2023-06-18'),
('comm-008', 'cust-006', 'emp-007', 'email', 'Policy document delivery', '2023-06-20'),
('comm-009', 'cust-007', 'System', 'email', 'Payment receipt', '2023-06-12'),
('comm-010', 'cust-008', 'emp-009', 'call', 'Policy review discussion', '2023-06-08')
ON CONFLICT (id) DO NOTHING;

-- Add dummy transactions
INSERT INTO transactions (id, customer_id, policy_id, location_id, transaction_id, type, amount, date, status) VALUES
('trans-001', 'cust-001', 'pol-001', 'loc-001', 'TRX-2023-001', 'payment', 100.00, '2023-06-01', 'completed'),
('trans-002', 'cust-001', 'pol-002', 'loc-001', 'TRX-2023-002', 'payment', 79.17, '2023-06-01', 'completed'),
('trans-003', 'cust-002', 'pol-004', 'loc-002', 'TRX-2023-003', 'payment', 91.67, '2023-06-05', 'completed'),
('trans-004', 'cust-003', 'pol-005', 'loc-003', 'TRX-2023-004', 'payment', 208.33, '2023-06-10', 'completed'),
('trans-005', 'cust-003', 'pol-006', 'loc-003', 'TRX-2023-005', 'payment', 150.00, '2023-06-10', 'completed'),
('trans-006', 'cust-004', 'pol-007', 'loc-004', 'TRX-2023-006', 'payment', 29.17, '2023-06-15', 'completed'),
('trans-007', 'cust-005', 'pol-008', 'loc-005', 'TRX-2023-007', 'payment', 108.33, '2023-06-15', 'completed'),
('trans-008', 'cust-005', 'pol-009', 'loc-005', 'TRX-2023-008', 'payment', 87.50, '2023-06-15', 'completed'),
('trans-009', 'cust-005', 'pol-010', 'loc-005', 'TRX-2023-009', 'payment', 66.67, '2023-06-15', 'completed'),
('trans-010', 'cust-005', 'pol-011', 'loc-005', 'TRX-2023-010', 'payment', 183.33, '2023-06-15', 'completed'),
('trans-011', 'cust-006', 'pol-012', 'loc-006', 'TRX-2023-011', 'payment', 104.17, '2023-06-20', 'pending'),
('trans-012', 'cust-008', 'pol-014', 'loc-008', 'TRX-2023-012', 'payment', 225.00, '2023-06-20', 'pending'),
('trans-013', 'cust-008', 'pol-015', 'loc-008', 'TRX-2023-013', 'payment', 158.33, '2023-06-20', 'pending'),
('trans-014', 'cust-001', 'pol-001', 'loc-001', 'TRX-2023-014', 'refund', 25.00, '2023-06-25', 'completed'),
('trans-015', 'cust-003', 'pol-005', 'loc-003', 'TRX-2023-015', 'adjustment', -50.00, '2023-06-25', 'completed')
ON CONFLICT (id) DO NOTHING;

-- Add user roles for employees
INSERT INTO user_roles (user_id, role, entity_id, region_id, location_id) VALUES
('emp-001', 'location_manager', NULL, NULL, 'loc-001'),
('emp-002', 'agent', NULL, NULL, 'loc-001'),
('emp-003', 'agent', NULL, NULL, 'loc-002'),
('emp-004', 'location_manager', NULL, NULL, 'loc-003'),
('emp-005', 'agent', NULL, NULL, 'loc-004'),
('emp-006', 'location_manager', NULL, NULL, 'loc-005'),
('emp-007', 'agent', NULL, NULL, 'loc-006'),
('emp-008', 'agent', NULL, NULL, 'loc-007'),
('emp-009', 'location_manager', NULL, NULL, 'loc-008'),
('emp-010', 'location_manager', NULL, NULL, 'loc-009'),
('emp-011', 'agent', NULL, NULL, 'loc-010'),
('emp-012', 'agent', NULL, NULL, 'loc-011'),
('emp-013', 'location_manager', NULL, NULL, 'loc-012')
ON CONFLICT (user_id) DO NOTHING;

alter publication supabase_realtime add table entities;
alter publication supabase_realtime add table regions;
alter publication supabase_realtime add table locations;
alter publication supabase_realtime add table employees;
alter publication supabase_realtime add table employee_locations;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table policies;
alter publication supabase_realtime add table communications;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table user_roles;