-- ================================================================
-- SafeBite — Food Quality Inspection & Compliance Management
-- DML (Data Manipulation Language) — Seed / Sample Data
-- ================================================================
-- Run this file AFTER schema.sql to populate the database with
-- sample data for development and testing.
-- ================================================================

USE SafeBite;


-- ================================================================
-- CORE DATA
-- ================================================================

-- Food Manufacturers
INSERT INTO Food_Manufacturer VALUES
(1, 'Ravi',    'Sharma', 'LIC1001', '12 MG Road',      'Delhi',     'Delhi',       '110001', '2018-03-15'),
(2, 'Priya',   'Nair',   'LIC1002', '45 Link Road',    'Mumbai',    'Maharashtra', '400001', '2019-07-22'),
(3, 'Kiran',   'Rao',    'LIC1003', '78 Brigade Road', 'Bangalore', 'Karnataka',   '560001', '2017-11-10'),
(4, 'Suresh',  'Mehta',  'LIC1004', '33 Anna Salai',   'Chennai',   'Tamil Nadu',  '600001', '2020-05-18'),
(5, 'Deepika', 'Pillai', 'LIC1005', '19 Park Street',  'Kolkata',   'West Bengal', '700001', '2021-01-09');

-- Manufacturer Contacts
INSERT INTO Manufacturer_Contact VALUES
(1, '9876543210'),
(1, '9876543211'),
(2, '9845231076'),
(2, '9845231077'),
(3, '9731456820'),
(3, '9731456821'),
(4, '9600112233'),
(4, '9600112234'),
(5, '9433221100'),
(5, '9433221101');

-- Food Categories
INSERT INTO Food_Category VALUES
(1, 'Dairy',     'Milk and milk-based products',    'High',   'Y'),
(2, 'Bakery',    'Baked and flour-based items',     'Medium', 'Y'),
(3, 'Beverages', 'Packaged drinks and juices',      'Low',    'Y'),
(4, 'Snacks',    'Processed and packaged snacks',   'Medium', 'Y'),
(5, 'Frozen',    'Frozen and refrigerated products','High',   'Y');

-- Category Storage Guidelines
INSERT INTO Category_Storage_Guidelines VALUES
(1, 'Store below 4 degrees Celsius'),
(1, 'Keep away from direct sunlight'),
(1, 'Consume within 2 days of opening'),
(2, 'Store in dry and ventilated place'),
(2, 'Keep away from moisture'),
(3, 'Store in cool storage between 8-12 degrees'),
(3, 'Keep sealed after opening'),
(4, 'Store at room temperature'),
(4, 'Keep away from humidity'),
(5, 'Store below minus 18 degrees Celsius'),
(5, 'Do not refreeze after thawing');

-- Food Products
INSERT INTO Food_Product VALUES
(1, 'Full Cream Milk',   7,  'Approved', 1, 1),
(2, 'Whole Wheat Bread', 5,  'Approved', 2, 2),
(3, 'Mango Fruit Juice', 10, 'Approved', 3, 3),
(4, 'Masala Chips',      60, 'Approved', 4, 4),
(5, 'Frozen Peas',       90, 'Approved', 5, 5);

-- Product Certifications
INSERT INTO Product_Certifications VALUES
(1, 'FSSAI'),
(1, 'ISO 22000'),
(2, 'FSSAI'),
(2, 'AGMARK'),
(3, 'FSSAI'),
(3, 'ISO 22000'),
(3, 'BIS'),
(4, 'FSSAI'),
(4, 'BIS'),
(5, 'FSSAI'),
(5, 'AGMARK');

-- Food Batches
INSERT INTO Food_Batch VALUES
(1, 101, 'B-MLK-101', '2024-01-01', '2024-01-08', 'Expired'),
(2, 201, 'B-BRD-201', '2024-02-01', '2024-02-06', 'Recalled'),
(3, 301, 'B-JCE-301', '2024-03-01', '2024-03-11', 'Active'),
(4, 401, 'B-CHP-401', '2024-03-05', '2024-05-05', 'Active'),
(5, 501, 'B-PEA-501', '2024-01-20', '2024-07-20', 'Active');


-- ================================================================
-- INSPECTION & AGENCY DATA
-- ================================================================

-- Inspection Agencies
INSERT INTO Inspection_Agency VALUES
(1, 'Food Safety Standards Authority', 'ACC101', 'North', 'north@fssai.gov.in'),
(2, 'State Health Inspection Dept',    'ACC102', 'West',  'west@shid.gov.in'),
(3, 'National Quality Control Board',  'ACC103', 'South', 'south@nqcb.org'),
(4, 'Eastern Food Regulatory Agency',  'ACC104', 'East',  'east@efra.gov.in'),
(5, 'Central Food Testing Bureau',     'ACC105', 'North', 'central@cftb.gov.in'),
(6, 'Western Food Regulatory Board',   'ACC106', 'West',  'west@wfrb.gov.in');

-- Agency Contacts
INSERT INTO Agency_Contact VALUES
(1, '9811111111'),
(1, '9811111112'),
(2, '9822222222'),
(2, '9822222223'),
(3, '9833333333'),
(3, '9833333334'),
(4, '9844444444'),
(4, '9844444445'),
(5, '9855555555'),
(5, '9855555556'),
(6, '9877001122');

-- Food Inspectors
INSERT INTO Food_Inspector VALUES
(1, 'Rajesh', 'Kumar',  'Senior Inspector', 'North', '9111111111', 1),
(2, 'Anita',  'Singh',  'Inspector',        'West',  '9222222222', 2),
(3, 'Vikas',  'Rao',    'Inspector',        'South', '9333333333', 3),
(4, 'Meena',  'Joshi',  'Senior Inspector', 'North', '9444444444', 1),
(5, 'Arjun',  'Pillai', 'Inspector',        'East',  '9555555555', 4),
(6, 'Sneha',  'Kapoor', 'Inspector',        'West',  '9666666666', 6);

-- Inspection Schedules
INSERT INTO Inspection_Schedule VALUES
(1, 1, 101, 1, '2024-01-03', 'Routine',  'High'),
(2, 2, 201, 2, '2024-02-04', 'Surprise', 'High'),
(3, 3, 301, 3, '2024-03-04', 'Routine',  'Medium'),
(4, 4, 401, 4, '2024-03-06', 'Surprise', 'Medium'),
(5, 5, 501, 5, '2024-01-22', 'Routine',  'Low'),
(6, 5, 501, 5, '2024-04-01', 'Surprise', 'High'),
(7, 5, 501, 5, '2024-04-02', 'Surprise', 'High'),
(8, 5, 501, 1, '2024-04-10', 'Surprise', 'High');

-- Inspections
INSERT INTO Inspection VALUES
(1, 1, '2024-01-03', 'Pass', 12, 'All parameters within limits'),
(2, 2, '2024-02-04', 'Fail', 72, 'Severe hygiene violation detected'),
(3, 3, '2024-03-04', 'Pass', 18, 'Minor labelling issue noted'),
(4, 4, '2024-03-06', 'Pass', 22, 'Packaging slightly damaged'),
(5, 5, '2024-01-22', 'Fail', 55, 'Bacterial count exceeded limit');

-- Sample Collections
INSERT INTO Sample_Collection VALUES
(1, 1, 'Liquid', 3, '2024-01-03', 'SEAL-1001'),
(2, 1, 'Solid',  2, '2024-02-04', 'SEAL-2001'),
(3, 1, 'Liquid', 2, '2024-03-04', 'SEAL-3001'),
(4, 1, 'Solid',  1, '2024-03-06', 'SEAL-4001'),
(5, 1, 'Liquid', 4, '2024-01-22', 'SEAL-5001');


-- ================================================================
-- LABORATORY & TESTING DATA
-- ================================================================

-- Laboratories
INSERT INTO Laboratory VALUES
(1, 'National Food Testing Lab',  'Government', 'LAB-GOV-001', '10 Rajpath',   'Delhi',     'Delhi',       '110002', '9811000001'),
(2, 'SafeTest Analytical Labs',   'Private',    'LAB-PVT-002', '22 Marine Dr', 'Mumbai',    'Maharashtra', '400002', '9822000002'),
(3, 'QualityCheck Laboratory',    'Private',    'LAB-PVT-003', '55 MG Road',   'Bangalore', 'Karnataka',   '560002', '9833000003'),
(4, 'Southern Food Analysis Lab', 'Government', 'LAB-GOV-004', '7 Anna Nagar', 'Chennai',   'Tamil Nadu',  '600002', '9844000004'),
(5, 'Eastern Diagnostics Centre', 'Private',    'LAB-PVT-005', '3 Salt Lake',  'Kolkata',   'West Bengal', '700003', '9855000005');

-- Test Parameters
INSERT INTO Test_Parameter VALUES
(1, 'Bacteria Count', 'CFU/ml', 100, 'Culture Plate Test', 'High'),
(2, 'pH Level',       'pH',     7,   'Digital pH Meter',   'Medium'),
(3, 'Preservatives',  'mg/kg',  50,  'HPLC Analysis',      'Low'),
(4, 'Moisture',       '%',      15,  'Oven Drying Method', 'Medium'),
(5, 'Heavy Metals',   'ppb',    5,   'AAS Spectroscopy',   'High');

-- Lab Tests
INSERT INTO Lab_Test VALUES
(1, 1, 1, 1, 85,  'Pass'),
(2, 2, 2, 1, 145, 'Fail'),
(3, 3, 3, 2, 6,   'Pass'),
(4, 4, 4, 3, 38,  'Pass'),
(5, 5, 5, 5, 7,   'Fail');


-- ================================================================
-- COMPLIANCE & ENFORCEMENT DATA
-- ================================================================

-- Compliance Standards
INSERT INTO Compliance_Standard VALUES
(1, 'FSSAI Dairy Product Norms',    'FSSAI', '2020-01-01', 'High',   1),
(2, 'Bakery and Confectionery Act', 'FSSAI', '2019-05-10', 'Medium', 2),
(3, 'Packaged Beverage Standards',  'FSSAI', '2021-03-15', 'Low',    3),
(4, 'Snack Food Safety Guidelines', 'FSSAI', '2022-06-01', 'Medium', 4),
(5, 'Frozen Food Handling Norms',   'FSSAI', '2020-09-20', 'High',   5);

-- Compliance Records
INSERT INTO Compliance_Record VALUES
(1, 1, 101, 1, 'Compliant',     '2024-01-04', 0),
(2, 2, 201, 2, 'Non-Compliant', '2024-02-05', 3),
(3, 3, 301, 3, 'Compliant',     '2024-03-05', 0),
(4, 4, 401, 4, 'Compliant',     '2024-03-07', 1),
(5, 5, 501, 5, 'Non-Compliant', '2024-01-23', 2);

-- Violation Types
INSERT INTO Violation_Type VALUES
(1, 1, 'Bacterial Contamination', 'Bacteria count exceeds permissible limit', 'High',   '10000-25000'),
(2, 1, 'Poor Hygiene Practices',  'Unclean production environment found',     'High',   '8000-15000'),
(3, 1, 'Incorrect Labelling',     'Nutritional info missing or incorrect',    'Low',    '2000-5000'),
(4, 1, 'Excess Preservatives',    'Chemical preservatives beyond safe limit', 'Medium', '6000-12000'),
(5, 1, 'Improper Freezing',       'Freezing temperature not maintained',      'High',   '8000-18000');


-- ================================================================
-- CONSUMER & COMPLAINT DATA
-- ================================================================

-- Consumers
INSERT INTO Consumer VALUES
(1, 'Amit',    'Sharma', '9000000001', 'amit.sharma@gmail.com',   '5 Nehru Nagar',  'Delhi',     'Delhi',       '110003', '2023-01-05'),
(2, 'Neha',    'Verma',  '9000000002', 'neha.verma@gmail.com',    '12 Bandra West', 'Mumbai',    'Maharashtra', '400003', '2023-02-10'),
(3, 'Rohit',   'Mehta',  '9000000003', 'rohit.mehta@gmail.com',   '8 Koramangala',  'Bangalore', 'Karnataka',   '560003', '2023-03-20'),
(4, 'Kavitha', 'Rajan',  '9000000004', 'kavitha.rajan@gmail.com', '22 T Nagar',     'Chennai',   'Tamil Nadu',  '600003', '2023-04-15'),
(5, 'Arun',    'Das',    '9000000005', 'arun.das@gmail.com',      '7 Salt Lake',    'Kolkata',   'West Bengal', '700002', '2023-05-01'),
(6, 'Priya',   'Das',    '9100000006', 'priya.das@gmail.com',     '8 Lake Road',    'Pune',      'Maharashtra', '411001', '2024-03-01');

-- Recall Notices
INSERT INTO Recall_Notice VALUES
(1, 2, 'Hygiene violation found during surprise inspection', '2024-02-10', 'Class II',  'Active'),
(2, 5, 'Bacterial contamination confirmed in lab test',      '2024-01-24', 'Class I',   'Active'),
(3, 1, 'Contamination risk identified in follow-up audit',   '2024-01-09', 'Class I',   'Closed'),
(4, 4, 'Excess preservatives detected beyond safe limit',    '2024-03-10', 'Class III', 'Closed'),
(5, 3, 'Minor packaging integrity issue - precautionary',    '2024-03-13', 'Class III', 'Closed'),
(7, 2, 'Mold contamination found in production facility',    '2024-04-12', 'Class I',   'Active');

-- Complaints
INSERT INTO Complaint VALUES
(1, 1, 1, '2024-01-06', 'Foreign Object', 'Resolved'),
(2, 2, 2, '2024-02-08', 'Bad Taste',      'Under Review'),
(3, 3, 3, '2024-03-09', 'Packaging Leak', 'Resolved'),
(4, 4, 5, '2024-01-25', 'Foul Smell',     'Escalated'),
(5, 5, 4, '2024-03-10', 'Stale Product',  'Under Review'),
(6, 3, 4, '2024-04-13', 'Foreign Object', 'Escalated');

-- Enforcement Actions
INSERT INTO Enforcement_Action VALUES
(1, 2,    2,    'Financial Penalty',       '2024-02-12', 15000, 'Completed'),
(2, 2,    NULL, 'Production Suspension',   '2024-02-10', 0,     'Completed'),
(3, 5,    4,    'Financial Penalty',       '2024-01-25', 10000, 'Completed'),
(4, 5,    NULL, 'Mandatory Re-Inspection', '2024-01-27', 0,     'In Progress'),
(5, 4,    NULL, 'Advisory Warning',        '2024-03-09', 2000,  'Completed'),
(7, 2,    NULL, 'Production Suspension',   '2024-04-12', 0,     'In Progress'),
(8, NULL, 6,    'Advisory Warning',        '2024-04-14', 3000,  'In Progress');


-- ================================================================
-- SYSTEM USERS (Login accounts)
-- ================================================================

INSERT INTO System_User VALUES
(1, 'rajesh.kumar',      'Senior Inspector', 'Active',   '2024-03-10', 1),
(2, 'anita.singh',       'Inspector',        'Active',   '2024-03-08', 2),
(3, 'vikas.rao',         'Inspector',        'Active',   '2024-03-05', 3),
(4, 'meena.joshi',       'Senior Inspector', 'Active',   '2024-03-11', 4),
(5, 'arjun.pillai',      'Inspector',        'Inactive', '2024-02-28', 5),
(6, 'sneha.kapoor.west', 'Inspector',        'Active',   NULL,         6);


-- ================================================================
-- NORMALIZATION DEMO DATA (Academic only)
-- ================================================================

-- 1NF Demo data
INSERT INTO Food_Product_Raw VALUES
(1, 'Full Cream Milk',   7,  'Approved', 1, 1, 'FSSAI, ISO 22000'),
(2, 'Whole Wheat Bread', 5,  'Approved', 2, 2, 'FSSAI, AGMARK'),
(3, 'Mango Fruit Juice', 10, 'Approved', 3, 3, 'FSSAI, ISO 22000, BIS'),
(4, 'Masala Chips',      60, 'Approved', 4, 4, 'FSSAI, BIS'),
(5, 'Frozen Peas',       90, 'Approved', 5, 5, 'FSSAI, AGMARK');

-- 2NF/3NF/BCNF Demo data
INSERT INTO Inspection_Raw VALUES
(1, 1, 'Rajesh', 'Kumar',  'Senior Inspector', 1, 'Food Safety Standards Authority', 'North', 1, 'Full Cream Milk',   1, 'Bacteria Count', 'CFU/ml', 'High',   '2024-01-03', 'Pass', 12),
(2, 2, 'Anita',  'Singh',  'Inspector',        2, 'State Health Inspection Dept',    'West',  2, 'Whole Wheat Bread', 1, 'Bacteria Count', 'CFU/ml', 'High',   '2024-02-04', 'Fail', 72),
(3, 3, 'Vikas',  'Rao',    'Inspector',        3, 'National Quality Control Board',  'South', 3, 'Mango Fruit Juice', 2, 'pH Level',       'pH',     'Medium', '2024-03-04', 'Pass', 18),
(4, 4, 'Meena',  'Joshi',  'Senior Inspector', 1, 'Food Safety Standards Authority', 'North', 4, 'Masala Chips',      3, 'Preservatives',  'mg/kg',  'Low',    '2024-03-06', 'Pass', 22),
(5, 5, 'Arjun',  'Pillai', 'Inspector',        4, 'Eastern Food Regulatory Agency',  'East',  5, 'Frozen Peas',       5, 'Heavy Metals',   'ppb',    'High',   '2024-01-22', 'Fail', 55);

-- 4NF Demo data
INSERT INTO Food_Product_MVD VALUES
(1, 1, 'FSSAI',     'Store below 4 degrees Celsius'),
(1, 1, 'FSSAI',     'Keep away from direct sunlight'),
(1, 1, 'FSSAI',     'Consume within 2 days of opening'),
(1, 1, 'ISO 22000', 'Store below 4 degrees Celsius'),
(1, 1, 'ISO 22000', 'Keep away from direct sunlight'),
(1, 1, 'ISO 22000', 'Consume within 2 days of opening'),
(3, 3, 'FSSAI',     'Store in cool storage between 8-12 degrees'),
(3, 3, 'FSSAI',     'Keep sealed after opening'),
(3, 3, 'ISO 22000', 'Store in cool storage between 8-12 degrees'),
(3, 3, 'ISO 22000', 'Keep sealed after opening'),
(3, 3, 'BIS',       'Store in cool storage between 8-12 degrees'),
(3, 3, 'BIS',       'Keep sealed after opening');

-- 5NF Demo data
INSERT INTO Inspector_Assignment_Raw VALUES
(1, 1, 1),
(1, 1, 4),
(2, 2, 2),
(3, 3, 3),
(4, 1, 4),
(5, 4, 5);
