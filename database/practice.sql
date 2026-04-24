use SafeBite;
SELECT * FROM Food_Manufacturer;
SELECT * FROM Food_Category;
SELECT * FROM Manufacturer_Contact;
SELECT * FROM Category_Storage_Guidelines;
SELECT * FROM Food_Product;
SELECT * FROM Product_Certifications;
SELECT * FROM Food_Batch;
SELECT * FROM Inspection_Agency;
SELECT * FROM Agency_Contact;
SELECT * FROM Food_Inspector;
SELECT * FROM Inspection_Schedule;
SELECT * FROM Inspection;
SELECT * FROM Sample_Collection;
SELECT * FROM Laboratory;
SELECT * FROM Test_Parameter;
SELECT * FROM Lab_Test;
SELECT * FROM Compliance_Standard;
SELECT * FROM Compliance_Record;
SELECT * FROM Violation_Type;
SELECT * FROM Consumer;
SELECT * FROM Recall_Notice;
SELECT * FROM Complaint;
SELECT * FROM Enforcement_Action;
SELECT * FROM System_User;

 -- Verifying UNIQUE on license_number 
INSERT INTO Food_Manufacturer (manufacturer_id, first_name, last_name, license_number, street, city, state, pincode, registration_date) VALUES (6, 'Test', 'User', 'LIC1001', '10 Test Road', 'Delhi', 'Delhi', '110004', '2024-01-01');
-- Verifying NOT NULL on product_name 
INSERT INTO Food_Product (product_id, product_name, shelf_life, approval_status, manufacturer_id, category_id) VALUES (6, NULL, 30, 'Approved', 1, 1);

-- Adding NOT NULL on remarks 
ALTER TABLE Inspection MODIFY remarks VARCHAR(150) NOT NULL;
-- Verify NOT NULL â€” try inserting NULL remarks 
INSERT INTO Inspection (inspection_id, schedule_id, inspection_date, inspection_result, risk_score, remarks) VALUES (6, 5, '2024-04-01', 'Pass', 30, NULL);

ALTER TABLE Inspection ADD CONSTRAINT chk_risk_score CHECK (risk_score BETWEEN 0 AND 100);
-- Verify â€” try inserting invalid risk_score (150)
INSERT INTO Inspection (inspection_id, schedule_id, inspection_date, inspection_result, risk_score, remarks) VALUES (6, 5, '2024-04-01', 'Fail', 150, 'Test entry');

ALTER TABLE Recall_Notice ALTER COLUMN recall_status SET DEFAULT 'Active';
-- Verify DEFAULT â€” insert recall without recall_status 
INSERT INTO Recall_Notice (recall_id, product_id, recall_reason, recall_date, recall_level) VALUES (6, 3, 'Test contamination issue', '2024-04-05', 'Class II');

SELECT recall_id, product_id, recall_reason, recall_level, recall_status FROM Recall_Notice WHERE recall_id = 6;

SELECT SUM(penalty_amount) AS total_penalty_collected FROM Enforcement_Action WHERE action_status = 'Completed';

SELECT AVG(risk_score) AS avg_risk_score, MAX(risk_score) AS     highest_risk_score, MIN(risk_score) AS lowest_risk_score FROM Inspection;

SELECT status, COUNT(*) AS total_complaints FROM Complaint GROUP BY status;

SELECT standard_id, SUM(violation_count) AS total_violations FROM    Compliance_Record GROUP BY standard_id HAVING SUM(violation_count) > 0;

SELECT ROUND(AVG(risk_score),2) AS avg_risk, ROUND(VARIANCE(risk_score),2) AS variance_risk, ROUND(STDDEV(risk_score),2) AS stddev_risk FROM Inspection;

SELECT product_id, 'Active Batch' AS source FROM Food_Batch WHERE batch_status = 'Active' UNION SELECT product_id, 'Active Recall' FROM Recall_Notice WHERE recall_status = 'Active';

SELECT inspector_id, CONCAT(first_name,' ',last_name) AS name, 'North Region' AS region FROM Food_Inspector WHERE assigned_region = 'North' UNION ALL SELECT inspector_id, CONCAT(first_name,' ',last_name), 'Senior Inspector' FROM Food_Inspector WHERE designation = 'Senior Inspector';

SELECT DISTINCT inspector_id FROM Food_Inspector WHERE assigned_region = 'North' AND inspector_id IN (SELECT inspector_id FROM System_User);

SELECT DISTINCT inspector_id FROM Inspection_Schedule WHERE inspector_id NOT IN (SELECT inspector_id FROM Food_Inspector WHERE assigned_region = 'North');	

SELECT inspector_id AS person_id, CONCAT(first_name,' ',last_name) AS person_name, 'Inspector' AS role FROM Food_Inspector UNION SELECT consumer_id, CONCAT(first_name,' ',last_name), 'Consumer' FROM Consumer;

SELECT CONCAT(first_name,' ',last_name) AS inspector_name, designation, assigned_region FROM Food_Inspector WHERE agency_id IN (SELECT agency_id FROM Inspection_Agency WHERE region = 'North');

SELECT inspection_id, inspection_date, inspection_result, risk_score FROM Inspection WHERE risk_score > (SELECT AVG(risk_score) FROM Inspection);

SELECT product_id, product_name, approval_status FROM Food_Product WHERE product_id IN (SELECT product_id FROM Compliance_Record WHERE compliance_status = 'Non-Compliant');

SELECT CONCAT(CO.first_name,' ',CO.last_name) AS consumer_name, CO.email FROM Consumer CO WHERE EXISTS (SELECT 1 FROM Complaint C JOIN Recall_Notice RN ON C.product_id = RN.product_id WHERE C.consumer_id = CO.consumer_id AND RN.recall_status = 'Active');

SELECT I.inspection_id, CONCAT(FI.first_name,' ',FI.last_name) AS inspector_name, FP.product_name, FB.batch_number, I.inspection_date, I.inspection_result, I.risk_score FROM Inspection I INNER JOIN Inspection_Schedule ISC ON I.schedule_id = ISC.schedule_id INNER JOIN Food_Inspector FI ON ISC.inspector_id = FI.inspector_id INNER JOIN Food_Batch FB ON ISC.product_id = FB.product_id AND ISC.batch_id = FB.batch_id INNER JOIN Food_Product FP ON FB.product_id = FP.product_id;

SELECT FP.product_id, FP.product_name, FC.category_name, CR.compliance_status, CR.violation_count, CR.checked_date FROM Food_Product FP INNER JOIN Food_Category FC ON FP.category_id = FC.category_id LEFT JOIN Food_Batch FB ON FP.product_id = FB.product_id LEFT JOIN Compliance_Record CR ON FB.product_id = CR.product_id AND FB.batch_id = CR.batch_id;

SELECT CS.standard_id, CS.standard_name, CS.severity_level, FP.product_name, CR.compliance_status, CR.violation_count FROM Compliance_Record CR RIGHT JOIN Compliance_Standard CS ON CR.standard_id = CS.standard_id LEFT JOIN Food_Batch FB ON CR.product_id = FB.product_id AND CR.batch_id = FB.batch_id LEFT JOIN Food_Product FP ON FB.product_id = FP.product_id;

SELECT A.inspector_id AS inspector1_id, CONCAT(A.first_name,' ',A.last_name) AS inspector1_name, B.inspector_id AS inspector2_id, CONCAT(B.first_name,' ',B.last_name) AS inspector2_name, IA.agency_name FROM Food_Inspector A INNER JOIN Food_Inspector B ON A.agency_id = B.agency_id AND A.inspector_id < B.inspector_id INNER JOIN Inspection_Agency IA ON A.agency_id = IA.agency_id;

CREATE VIEW View_Complete_Inspection_Summary AS SELECT I.inspection_id, FP.product_name, CONCAT(FM.first_name,' ',FM.last_name) AS manufacturer_name, CONCAT(FI.first_name,' ',FI.last_name) AS inspector_name, FB.batch_number, I.inspection_date, I.inspection_result, I.risk_score, CASE WHEN I.risk_score >= 60 THEN 'High Risk' WHEN I.risk_score >= 30 THEN 'Medium Risk' ELSE 'Low Risk' END AS risk_classification, I.remarks FROM Inspection I INNER JOIN Inspection_Schedule ISC ON I.schedule_id = ISC.schedule_id INNER JOIN Food_Inspector FI ON ISC.inspector_id = FI.inspector_id INNER JOIN Food_Batch FB ON ISC.product_id = FB.product_id AND ISC.batch_id = FB.batch_id INNER JOIN Food_Product FP ON FB.product_id = FP.product_id INNER JOIN Food_Manufacturer FM ON FP.manufacturer_id = FM.manufacturer_id;

SELECT * FROM View_Complete_Inspection_Summary;


CREATE VIEW View_Compliance_Dashboard AS SELECT FP.product_name, FC.category_name, CS.standard_name, CS.severity_level, CR.compliance_status, CR.violation_count, IF(CR.violation_count > 0, 'Yes', 'No') AS is_violated, CR.checked_date, EA.action_type, EA.penalty_amount, EA.action_status FROM Compliance_Record CR INNER JOIN Food_Batch FB ON CR.product_id = FB.product_id AND CR.batch_id = FB.batch_id INNER JOIN Food_Product FP ON FB.product_id = FP.product_id INNER JOIN Food_Category FC ON FP.category_id = FC.category_id INNER JOIN Compliance_Standard CS ON CR.standard_id = CS.standard_id LEFT JOIN Enforcement_Action EA ON CR.compliance_id = EA.compliance_id;

SELECT * FROM View_Compliance_Dashboard;

CREATE VIEW View_Penalty_Actions AS
SELECT action_id, action_type, penalty_amount, action_status
FROM Enforcement_Action WHERE penalty_amount > 0;

-- Show before update
SELECT * FROM View_Penalty_Actions;

-- Update through view
UPDATE View_Penalty_Actions
SET action_status = 'Reviewed'
WHERE action_id = 3;

-- Show after update
SELECT * FROM View_Penalty_Actions;

drop view view_penalty_actions;
-- Create view
CREATE VIEW View_Manufacturer_ProductCount AS
SELECT CONCAT(FM.first_name,' ',FM.last_name) AS manufacturer_name,
FM.city, COUNT(FP.product_id) AS total_products
FROM Food_Manufacturer FM
LEFT JOIN Food_Product FP ON FM.manufacturer_id = FP.manufacturer_id
GROUP BY FM.manufacturer_id, FM.first_name, FM.last_name, FM.city;

-- Query view
SELECT * FROM View_Manufacturer_ProductCount;

-- Drop view
DROP VIEW View_Manufacturer_ProductCount;


DELIMITER $$ 
CREATE TRIGGER trg_before_inspection_insert
BEFORE INSERT ON Inspection 
FOR EACH ROW 
BEGIN 
IF NEW.inspection_result = 'Fail' AND NEW.risk_score >= 50 THEN
SET NEW.remarks = CONCAT('[AUTO-FLAGGED] ', NEW.remarks); 
END IF; 
END$$ 
DELIMITER ;

INSERT INTO Inspection_Schedule VALUES
(6, 5, 501, 5, '2024-04-01', 'Surprise', 'High');

INSERT INTO Inspection (inspection_id, schedule_id, inspection_date, inspection_result, risk_score, remarks) VALUES (6, 6, '2024-04-01', 'Fail', 65, 'Contamination detected in sample');

SELECT inspection_id, inspection_result, risk_score, remarks FROM Inspection WHERE inspection_id = 6;


-- Step 1: Create trigger
DELIMITER $$
CREATE TRIGGER trg_after_inspection_fail
AFTER INSERT ON Inspection
FOR EACH ROW
BEGIN
    IF NEW.inspection_result = 'Fail' THEN
        UPDATE Food_Batch FB
        INNER JOIN Inspection_Schedule ISC ON ISC.schedule_id = NEW.schedule_id
        SET FB.batch_status = 'High Risk'
        WHERE FB.product_id = ISC.product_id AND FB.batch_id = ISC.batch_id;
    END IF;
END$$
DELIMITER ;

-- Step 2: Add new schedule
INSERT INTO Inspection_Schedule VALUES
(7, 5, 501, 5, '2024-04-02', 'Surprise', 'High');

-- Step 3: Insert failed inspection â€” trigger fires automatically
INSERT INTO Inspection
(inspection_id, schedule_id, inspection_date, inspection_result, risk_score, remarks)
VALUES (7, 7, '2024-04-02', 'Fail', 70, 'Severe bacterial contamination found');

-- Step 4: Verify batch status updated
SELECT product_id, batch_id, batch_number, batch_status
FROM Food_Batch WHERE product_id = 5 AND batch_id = 501;

-- Step 1: Create audit log table
CREATE TABLE Compliance_Audit_Log (
    log_id              INT AUTO_INCREMENT PRIMARY KEY,
    compliance_id       INT,
    old_status          VARCHAR(20),
    new_status          VARCHAR(20),
    old_violation_count INT,
    new_violation_count INT,
    changed_on          DATETIME
);

-- Step 2: Create trigger
DELIMITER $$
CREATE TRIGGER trg_after_compliance_update
AFTER UPDATE ON Compliance_Record
FOR EACH ROW
BEGIN
    IF OLD.compliance_status != NEW.compliance_status OR
       OLD.violation_count != NEW.violation_count THEN
        INSERT INTO Compliance_Audit_Log
        (compliance_id, old_status, new_status, old_violation_count, new_violation_count, changed_on)
        VALUES
        (OLD.compliance_id, OLD.compliance_status, NEW.compliance_status,
         OLD.violation_count, NEW.violation_count, NOW());
    END IF;
END$$
DELIMITER ;

-- Step 3: Update compliance record â€” trigger fires automatically
UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant', violation_count = 4
WHERE compliance_id = 1;

-- Step 4: Verify audit log
SELECT * FROM Compliance_Audit_Log;

-- Step 5: Revert back to original
UPDATE Compliance_Record
SET compliance_status = 'Compliant', violation_count = 0
WHERE compliance_id = 1;

drop table Compliance_Audit_Log;

-- Step 1: Create trigger
DELIMITER $$
CREATE TRIGGER trg_before_inspection_delete
BEFORE DELETE ON Inspection
FOR EACH ROW
BEGIN
    IF OLD.inspection_result = 'Fail' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Cannot delete a failed inspection record. It is required for compliance history.';
    END IF;
END$$
DELIMITER ;

-- Step 2: Try to delete a failed inspection â€” trigger blocks it
DELETE FROM Inspection WHERE inspection_id = 2;

-- Step 3: Verify all records still intact
SELECT inspection_id, inspection_result, risk_score, remarks
FROM Inspection WHERE inspection_id <= 5;

DELIMITER $$
CREATE PROCEDURE proc_update_compliance_status()
BEGIN
    DECLARE v_rows_updated INT;

    UPDATE Compliance_Record
    SET compliance_status = 'Non-Compliant'
    WHERE violation_count > 0
    AND compliance_status != 'Non-Compliant';

    SELECT ROW_COUNT() INTO v_rows_updated;

    SELECT v_rows_updated AS records_updated,
           'Compliance status updated successfully' AS message;

    SELECT compliance_id, product_id, batch_id,
           compliance_status, violation_count
    FROM Compliance_Record;
END$$
DELIMITER ;
SET SQL_SAFE_UPDATES = 0;
CALL proc_update_compliance_status();
SET SQL_SAFE_UPDATES = 1;
UPDATE Compliance_Record 
SET compliance_status = 'Compliant' 
WHERE compliance_id = 4;

DELIMITER $$
CREATE PROCEDURE proc_safebite_dashboard()
BEGIN
    DECLARE v_total_manufacturers INT;
    DECLARE v_total_inspections INT;
    DECLARE v_total_passed INT;
    DECLARE v_total_failed INT;
    DECLARE v_total_penalty INT;
    DECLARE v_total_active_recalls INT;
    DECLARE v_total_complaints INT;

    SELECT COUNT(*) INTO v_total_manufacturers
    FROM Food_Manufacturer;

    SELECT COUNT(*) INTO v_total_inspections
    FROM Inspection WHERE inspection_id <= 5;

    SELECT COUNT(*) INTO v_total_passed
    FROM Inspection
    WHERE inspection_result = 'Pass'
    AND inspection_id <= 5;

    SELECT COUNT(*) INTO v_total_failed
    FROM Inspection
    WHERE inspection_result = 'Fail'
    AND inspection_id <= 5;

    SELECT SUM(penalty_amount) INTO v_total_penalty
    FROM Enforcement_Action
    WHERE action_status = 'Completed';

    SELECT COUNT(*) INTO v_total_active_recalls
    FROM Recall_Notice
    WHERE recall_status = 'Active'
    AND recall_id <= 5;

    SELECT COUNT(*) INTO v_total_complaints
    FROM Complaint;

    SELECT v_total_manufacturers   AS total_manufacturers,
           v_total_inspections     AS total_inspections,
           v_total_passed          AS total_passed,
           v_total_failed          AS total_failed,
           v_total_penalty         AS total_penalty_collected,
           v_total_active_recalls  AS active_recalls,
           v_total_complaints      AS total_complaints;
END$$
DELIMITER ;

CALL proc_safebite_dashboard();

DELIMITER $$
CREATE PROCEDURE proc_compliance_penalty_summary()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_compliance_id INT;
    DECLARE v_product_name VARCHAR(100);
    DECLARE v_status VARCHAR(20);
    DECLARE v_violation_count INT;
    DECLARE v_penalty INT;
    DECLARE v_is_violated VARCHAR(5);
    DECLARE v_total_penalty INT DEFAULT 0;

    DECLARE cur CURSOR FOR
        SELECT CR.compliance_id, FP.product_name,
               CR.compliance_status, CR.violation_count,
               IFNULL(EA.penalty_amount, 0)
        FROM Compliance_Record CR
        INNER JOIN Food_Batch FB ON CR.product_id = FB.product_id
                                 AND CR.batch_id = FB.batch_id
        INNER JOIN Food_Product FP ON FB.product_id = FP.product_id
        LEFT JOIN Enforcement_Action EA ON CR.compliance_id = EA.compliance_id
        WHERE CR.compliance_id <= 5;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_compliance_id, v_product_name,
                      v_status, v_violation_count, v_penalty;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        IF v_violation_count > 0 THEN
            SET v_is_violated = 'Yes';
        ELSE
            SET v_is_violated = 'No';
        END IF;

        SET v_total_penalty = v_total_penalty + v_penalty;

        SELECT v_compliance_id AS compliance_id,
               v_product_name AS product_name,
               v_status AS compliance_status,
               v_violation_count AS violation_count,
               v_is_violated AS is_violated,
               v_penalty AS penalty_amount;
    END LOOP;
    CLOSE cur;

    SELECT v_total_penalty AS total_penalty_collected;
END$$
DELIMITER ;

CALL proc_compliance_penalty_summary();

DELIMITER $$
CREATE PROCEDURE proc_recall_report()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_recall_id INT;
    DECLARE v_product_name VARCHAR(100);
    DECLARE v_manufacturer_name VARCHAR(100);
    DECLARE v_recall_reason VARCHAR(150);
    DECLARE v_recall_level VARCHAR(20);
    DECLARE v_recall_status VARCHAR(20);
    DECLARE v_urgency VARCHAR(20);
    DECLARE cur CURSOR FOR
        SELECT RN.recall_id, FP.product_name,
               CONCAT(FM.first_name,' ',FM.last_name),
               RN.recall_reason, RN.recall_level, RN.recall_status
        FROM Recall_Notice RN
        INNER JOIN Food_Product FP ON RN.product_id = FP.product_id
        INNER JOIN Food_Manufacturer FM ON FP.manufacturer_id = FM.manufacturer_id
        WHERE RN.recall_id <= 5;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_recall_id, v_product_name, v_manufacturer_name,
                      v_recall_reason, v_recall_level, v_recall_status;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;
        IF v_recall_level = 'Class I' THEN
            SET v_urgency = 'CRITICAL';
        ELSEIF v_recall_level = 'Class II' THEN
            SET v_urgency = 'HIGH';
        ELSE
            SET v_urgency = 'MODERATE';
        END IF;
        SELECT v_recall_id AS recall_id,
               v_product_name AS product_name,
               v_manufacturer_name AS manufacturer_name,
               v_recall_level AS recall_level,
               v_recall_status AS recall_status,
               v_urgency AS urgency_flag;
    END LOOP;
    CLOSE cur;
END$$
DELIMITER ;

CALL proc_recall_report();

DELIMITER $$
CREATE PROCEDURE proc_manufacturer_safety_report()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_mid INT;
    DECLARE v_mname VARCHAR(100);
    DECLARE v_city VARCHAR(50);
    DECLARE v_product_count INT;
    DECLARE v_complaint_count INT;
    DECLARE v_recall_count INT;
    DECLARE v_safety_status VARCHAR(20);
    DECLARE cur CURSOR FOR
        SELECT manufacturer_id, CONCAT(first_name,' ',last_name), city
        FROM Food_Manufacturer;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_mid, v_mname, v_city;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;
        SELECT COUNT(*) INTO v_product_count
        FROM Food_Product
        WHERE manufacturer_id = v_mid;

        SELECT COUNT(*) INTO v_complaint_count
        FROM Complaint C
        INNER JOIN Food_Product FP ON C.product_id = FP.product_id
        WHERE FP.manufacturer_id = v_mid;

        SELECT COUNT(*) INTO v_recall_count
        FROM Recall_Notice RN
        INNER JOIN Food_Product FP ON RN.product_id = FP.product_id
        WHERE FP.manufacturer_id = v_mid
        AND RN.recall_id <= 5;

        IF v_recall_count > 0 AND v_complaint_count > 0 THEN
            SET v_safety_status = 'High Concern';
        ELSEIF v_complaint_count > 0 OR v_recall_count > 0 THEN
            SET v_safety_status = 'Monitor';
        ELSE
            SET v_safety_status = 'Safe';
        END IF;

        SELECT v_mname AS manufacturer_name,
               v_city AS city,
               v_product_count AS total_products,
               v_complaint_count AS total_complaints,
               v_recall_count AS total_recalls,
               v_safety_status AS safety_status;
    END LOOP;
    CLOSE cur;
END$$
DELIMITER ;

CALL proc_manufacturer_safety_report();

UPDATE Enforcement_Action 
SET action_status = 'Completed' 
WHERE action_id = 5;


-- Display each food product along with its manufacturer name and category name.
SELECT FP.product_id,
       FP.product_name,
       CONCAT(FM.first_name,' ',FM.last_name) AS manufacturer_name,
       FC.category_name,
       FC.risk_level
FROM Food_Product FP
INNER JOIN Food_Manufacturer FM ON FP.manufacturer_id = FM.manufacturer_id
INNER JOIN Food_Category FC ON FP.category_id = FC.category_id;

-- Exceptional Handling : safely insert a new consumer â€” handle duplicate ID or email error gracefully.
DELIMITER $$
CREATE PROCEDURE proc_safe_insert_consumer (
    IN p_id INT,
    IN p_fname VARCHAR(50),
    IN p_lname VARCHAR(50),
    IN p_contact VARCHAR(15),
    IN p_email VARCHAR(100),
    IN p_street VARCHAR(100),
    IN p_city VARCHAR(50),
    IN p_state VARCHAR(50),
    IN p_pincode VARCHAR(10),
    IN p_date DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Error: Consumer could not be inserted. Duplicate ID or Email already exists.' AS Message;
    END;

    INSERT INTO Consumer
    (consumer_id, first_name, last_name, contact_number, email,
     street, city, state, pincode, registration_date)
    VALUES
    (p_id, p_fname, p_lname, p_contact, p_email,
     p_street, p_city, p_state, p_pincode, p_date);

    SELECT CONCAT('Consumer ', p_fname, ' ', p_lname, ' inserted successfully!') AS Message;
END$$
DELIMITER ;

-- Test 1: Valid insertion
CALL proc_safe_insert_consumer(6, 'Priya', 'Das', '9100000006',
'priya.das@gmail.com', '8 Lake Road', 'Pune', 'Maharashtra', '411001', '2024-03-01');

-- Test 2: Duplicate ID â€” triggers exception
CALL proc_safe_insert_consumer(1, 'Test', 'User', '9100000007',
'test@gmail.com', '1 Test Road', 'Delhi', 'Delhi', '110001', '2024-03-01');

-- Create a procedure with exception handling to safely update recall status â€” handle case where recall_id does not exist.
DELIMITER $$
CREATE PROCEDURE proc_safe_update_recall (
    IN p_recall_id INT,
    IN p_new_status VARCHAR(20)
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'Error: An unexpected SQL error occurred during recall update.' AS Message;
    END;

    SELECT COUNT(*) INTO v_count
    FROM Recall_Notice
    WHERE recall_id = p_recall_id;

    IF v_count = 0 THEN
        SELECT CONCAT('Error: Recall ID ', p_recall_id, ' does not exist in the system.') AS Message;
    ELSE
        UPDATE Recall_Notice
        SET recall_status = p_new_status
        WHERE recall_id = p_recall_id;
        SELECT CONCAT('Recall ID ', p_recall_id, ' status updated to ', p_new_status, ' successfully.') AS Message;
    END IF;
END$$
DELIMITER ;

-- Test 1: Valid recall_id
CALL proc_safe_update_recall(1, 'Closed');

-- Test 2: Non-existent recall_id
CALL proc_safe_update_recall(99, 'Closed');

-- Verify
SELECT recall_id, recall_status FROM Recall_Notice WHERE recall_id = 1;

-- Revert back
UPDATE Recall_Notice SET recall_status = 'Active' WHERE recall_id = 1;

SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME,
       REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'SafeBite'
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

-- Total count at bottom
SELECT COUNT(*) AS total_foreign_keys
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'SafeBite'
AND REFERENCED_TABLE_NAME IS NOT NULL;

SELECT COUNT(DISTINCT CONSTRAINT_NAME) AS total_fk_constraints
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'SafeBite'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ================================================================
-- NORMALIZATION DEMONSTRATION TABLES (Chapter 4)
-- These are hypothetical un-normalized tables created purely
-- for academic demonstration of normalization concepts.
-- They are NOT part of the actual SafeBite database schema.
-- The final normalized schema is defined above in this file.
-- ================================================================


-- ----------------------------------------------------------------
-- Table 1: Food_Product_Raw
-- Used for: 1NF Demonstration (Section 4.2)
-- Pitfall: certifications stored as comma-separated non-atomic
--          values in a single column â€” violates 1NF
-- ----------------------------------------------------------------

CREATE TABLE Food_Product_Raw (
    product_id       INT          NOT NULL,
    product_name     VARCHAR(100) NOT NULL,
    shelf_life       INT          NOT NULL,
    approval_status  VARCHAR(20)  NOT NULL,
    manufacturer_id  INT          NOT NULL,
    category_id      INT          NOT NULL,
    certifications   VARCHAR(200) NOT NULL
    -- certifications holds multiple values like 'FSSAI, ISO 22000, BIS'
    -- This is non-atomic and violates 1NF
);

INSERT INTO Food_Product_Raw VALUES
(1, 'Full Cream Milk',   7,  'Approved', 1, 1, 'FSSAI, ISO 22000'),
(2, 'Whole Wheat Bread', 5,  'Approved', 2, 2, 'FSSAI, AGMARK'),
(3, 'Mango Fruit Juice', 10, 'Approved', 3, 3, 'FSSAI, ISO 22000, BIS'),
(4, 'Masala Chips',      60, 'Approved', 4, 4, 'FSSAI, BIS'),
(5, 'Frozen Peas',       90, 'Approved', 5, 5, 'FSSAI, AGMARK');
 select * from food_product_raw;
-- 1NF Fix: Split into Food_Product + Product_Certifications
select * from product_certifications;
-- (Already implemented in the actual SafeBite schema above)


-- ----------------------------------------------------------------
-- Table 2: Inspection_Raw
-- Used for: 2NF, 3NF, BCNF Demonstration (Sections 4.3, 4.4, 4.5)
-- Pitfall 1 (2NF):  inspector details depend only on inspector_id
--                   not on the full composite key
-- Pitfall 2 (3NF):  parameter details depend on parameter_id
--                   not directly on inspection_id â€” transitive dep
-- Pitfall 3 (BCNF): agency_id â†’ agency_name, region
--                   agency_id is not a superkey â€” BCNF violation
-- ----------------------------------------------------------------

CREATE TABLE Inspection_Raw (
    inspection_id      INT         NOT NULL,
    inspector_id       INT         NOT NULL,
    first_name         VARCHAR(50) NOT NULL,
    last_name          VARCHAR(50) NOT NULL,
    designation        VARCHAR(50) NOT NULL,
    agency_id          INT         NOT NULL,
    agency_name        VARCHAR(100) NOT NULL,
    region             VARCHAR(50) NOT NULL,
    product_id         INT         NOT NULL,
    product_name       VARCHAR(100) NOT NULL,
    parameter_id       INT         NOT NULL,
    parameter_name     VARCHAR(50) NOT NULL,
    unit_of_measure    VARCHAR(20) NOT NULL,
    severity_level     VARCHAR(20) NOT NULL,
    inspection_date    DATE        NOT NULL,
    inspection_result  VARCHAR(20) NOT NULL,
    risk_score         INT         NOT NULL,
    PRIMARY KEY (inspection_id, inspector_id)
    -- Composite PK reveals partial and transitive dependencies
);

INSERT INTO Inspection_Raw VALUES
(1, 1, 'Rajesh', 'Kumar',  'Senior Inspector', 1,
 'Food Safety Standards Authority', 'North',
  1, 'Full Cream Milk',   1, 'Bacteria Count', 'CFU/ml', 'High',
  '2024-01-03', 'Pass', 12),
(2, 2, 'Anita',  'Singh',  'Inspector',        2,
 'State Health Inspection Dept',    'West',
  2, 'Whole Wheat Bread', 1, 'Bacteria Count', 'CFU/ml', 'High',
  '2024-02-04', 'Fail', 72),
(3, 3, 'Vikas',  'Rao',    'Inspector',        3,
 'National Quality Control Board',  'South',
  3, 'Mango Fruit Juice', 2, 'pH Level',       'pH',     'Medium',
  '2024-03-04', 'Pass', 18),
(4, 4, 'Meena',  'Joshi',  'Senior Inspector', 1,
 'Food Safety Standards Authority', 'North',
  4, 'Masala Chips',      3, 'Preservatives',  'mg/kg',  'Low',
  '2024-03-06', 'Pass', 22),
(5, 5, 'Arjun',  'Pillai', 'Inspector',        4,
 'Eastern Food Regulatory Agency',  'East',
  5, 'Frozen Peas',       5, 'Heavy Metals',   'ppb',    'High',
  '2024-01-22', 'Fail', 55);
  
select * from inspection_raw;

-- 2NF Fix: Separate Food_Inspector table (inspector details)
-- 3NF Fix: Separate Test_Parameter table (parameter details)
-- BCNF Fix: Separate Inspection_Agency table (agency details)
-- (All already implemented in the actual SafeBite schema above)

select * from food_inspector;
select * from inspection;
select * from inspection_detail;
SELECT 
product_id,
product_name
FROM Food_Product;

SELECT 
parameter_id,
parameter_name,
unit_of_measure,
severity_level
FROM Test_Parameter;
SELECT 
inspector_id,
first_name,
last_name,
designation,
agency_id,agency_name
FROM Food_Inspector;

SELECT 
agency_id,
agency_name,
region
FROM Inspection_Agency;

SELECT 
inspector_id,
first_name,
last_name,
designation,
agency_id
FROM Food_Inspector;

select * from food_inspector;
-- ----------------------------------------------------------------
-- Table 3: Food_Product_MVD
-- Used for: 4NF Demonstration (Section 4.6)
-- Pitfall: Two independent multi-valued dependencies coexist
--          product_id â†’â†’ certification
--          category_id â†’â†’ storage_guideline
--          Combining them generates spurious tuple combinations
-- ----------------------------------------------------------------

CREATE TABLE Food_Product_MVD (
    product_id         INT          NOT NULL,
    category_id        INT          NOT NULL,
    certification      VARCHAR(50)  NOT NULL,
    storage_guideline  VARCHAR(150) NOT NULL
    -- Two independent MVDs in one table â€” violates 4NF
    -- Every combination of certification Ã— guideline is generated
    -- Most rows are spurious (not real-world facts)
);

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

-- 4NF Fix: Separate into Product_Certifications + Category_Storage_Guidelines
-- (Already implemented in the actual SafeBite schema above)
select * from food_product_mvd;
select * from product_certifications;
select * from Category_Storage_Guidelines;

-- ----------------------------------------------------------------
-- Table 4: Inspector_Assignment_Raw
-- Used for: 5NF Demonstration (Section 4.7)
-- Pitfall: Three-way relationship between inspector, agency,
--          and product cannot be losslessly decomposed into
--          any two binary relations â€” join dependency exists
-- ----------------------------------------------------------------

CREATE TABLE Inspector_Assignment_Raw (
    inspector_id  INT NOT NULL,
    agency_id     INT NOT NULL,
    product_id    INT NOT NULL,
    PRIMARY KEY (inspector_id, agency_id, product_id)
    -- 3-way ternary relation â€” any two-way split generates
    -- spurious tuples when rejoined â€” violates 5NF
);

INSERT INTO Inspector_Assignment_Raw VALUES
(1, 1, 1),
(1, 1, 4),
(2, 2, 2),
(3, 3, 3),
(4, 1, 4),
(5, 4, 5);

select * from inspector_assignment_raw;
SELECT 
inspector_id,
agency_id
FROM Food_Inspector;

SELECT 
F.product_name,
I.inspector_id,
A.agency_name
FROM Inspection_Schedule S
JOIN Food_Inspector I 
ON S.inspector_id = I.inspector_id
JOIN Inspection_Agency A 
ON I.agency_id = A.agency_id
JOIN Food_Batch B 
ON S.batch_id = B.batch_id
JOIN Food_Product F 
ON B.product_id = F.product_id;

-- 5NF Fix: Decompose into three binary relations:
--   Inspector_Agency    (inspector_id, agency_id)
--   Agency_Product      (agency_id,    product_id)
--   Inspector_Product   (inspector_id, product_id)
-- Mapped to: Food_Inspector + Inspection_Schedule + Inspection_Agency
-- (Already implemented in the actual SafeBite schema above)


-- ================================================================
-- END OF NORMALIZATION DEMONSTRATION TABLES
-- ================================================================


START TRANSACTION;

-- Step 1: Insert new inspection schedule for Frozen Peas
INSERT INTO Inspection_Schedule
(schedule_id, product_id, batch_id, inspector_id,
scheduled_date, inspection_type, priority_level)
VALUES (8, 5, 501, 1, '2024-04-10', 'Surprise', 'High');

-- Step 2: Set savepoint after schedule is created
SAVEPOINT after_schedule;

-- Step 3: Insert the inspection result
INSERT INTO Inspection
(inspection_id, schedule_id, inspection_date,
inspection_result, risk_score, remarks)
VALUES (8, 8, '2024-04-10', 'Fail', 78,
'Critical bacterial contamination detected');

-- Step 4: Set savepoint after inspection is recorded
SAVEPOINT after_inspection;

-- Step 5: Update batch status to High Risk
UPDATE Food_Batch
SET batch_status = 'High Risk'
WHERE product_id = 5 AND batch_id = 501;

-- Step 6: Oops! Wrong batch updated â€” rollback to after_inspection
ROLLBACK TO after_inspection;

-- Step 7: Correct update applied
UPDATE Food_Batch
SET batch_status = 'High Risk'
WHERE product_id = 5 AND batch_id = 501;

-- Step 8: Commit all changes
COMMIT;

-- Step 9: Verify
SELECT inspection_id, inspection_date,
inspection_result, risk_score, remarks
FROM Inspection WHERE inspection_id = 8;

SELECT product_id, batch_id, batch_number, batch_status
FROM Food_Batch WHERE product_id = 5 AND batch_id = 501;

START TRANSACTION;

-- Step 1: Insert recall notice for Whole Wheat Bread
INSERT INTO Recall_Notice
(recall_id, product_id, recall_reason,
recall_date, recall_level, recall_status)
VALUES (7, 2, 'Mold contamination found in production facility',
'2024-04-12', 'Class I', 'Active');

-- Step 2: Set savepoint after recall is inserted
SAVEPOINT after_recall;

-- Step 3: Update batch status to Recalled
UPDATE Food_Batch
SET batch_status = 'Recalled'
WHERE product_id = 2 AND batch_id = 201;

-- Step 4: Set savepoint after batch update
SAVEPOINT after_batch;

-- Step 5: Attempt enforcement action â€” wrong compliance_id entered
INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (7, 99, NULL, 'Production Suspension',
'2024-04-12', 0, 'In Progress');
-- Oops! compliance_id = 99 does not exist â€” error detected

-- Step 6: Rollback only the failed enforcement action
ROLLBACK TO after_batch;

-- Step 7: Insert correct enforcement action
INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (7, 2, NULL, 'Production Suspension',
'2024-04-12', 0, 'In Progress');

-- Step 8: Commit all changes
COMMIT;

-- Step 9: Verify
SELECT recall_id, product_id, recall_reason,
recall_level, recall_status
FROM Recall_Notice WHERE recall_id = 7;

SELECT product_id, batch_id, batch_number, batch_status
FROM Food_Batch WHERE product_id = 2 AND batch_id = 201;

SELECT action_id, compliance_id, action_type,
penalty_amount, action_status
FROM Enforcement_Action WHERE action_id = 7;

START TRANSACTION;

-- Step 1: Insert consumer complaint for Masala Chips
INSERT INTO Complaint
(complaint_id, consumer_id, product_id,
complaint_date, complaint_type, status)
VALUES (6, 3, 4, '2024-04-13', 'Foreign Object', 'Under Review');

SAVEPOINT after_complaint;

-- Step 2: Insert enforcement action linked to complaint
INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (8, NULL, 6, 'Advisory Warning',
'2024-04-14', 3000, 'In Progress');

SAVEPOINT after_action;

-- Step 3: Oops! Wrong status entered â€” should be Escalated not Closed
UPDATE Complaint SET status = 'Closed'
WHERE complaint_id = 6;

-- Step 4: Rollback to after_action and apply correct status
ROLLBACK TO after_action;

UPDATE Complaint SET status = 'Escalated'
WHERE complaint_id = 6;

-- Step 5: Commit all changes
COMMIT;

-- Step 6: Verify
SELECT complaint_id, consumer_id, product_id,
complaint_date, complaint_type, status
FROM Complaint WHERE complaint_id = 6;

SELECT action_id, complaint_id, action_type,
penalty_amount, action_status
FROM Enforcement_Action WHERE action_id = 8;

select * from Enforcement_Action;

START TRANSACTION;
-- Step 1: Update compliance status for Full Cream Milk
UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant', violation_count = 4
WHERE compliance_id = 1;
SAVEPOINT after_compliance;
-- Step 2: Insert enforcement action
INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (9, 1, NULL, 'Mandatory Re-Inspection',
'2024-04-15', 0, 'In Progress');
-- Step 3: Oops! Non-existent batch_id = 999 entered â€” critical error
UPDATE Food_Batch SET batch_status = 'Suspended'
WHERE product_id = 1 AND batch_id = 999;
-- Step 4: Full rollback â€” undo every change
ROLLBACK;
-- Step 5: Verify all original data is fully restored
SELECT compliance_id, compliance_status, violation_count
FROM Compliance_Record WHERE compliance_id = 1;
SELECT action_id FROM Enforcement_Action WHERE action_id = 9;

START TRANSACTION;

-- Step 1: Add new agency and inspector
INSERT INTO Inspection_Agency
(agency_id, agency_name, accreditation_number, region, email)
VALUES (6, 'Western Food Regulatory Board',
'ACC106', 'West', 'west@wfrb.gov.in');

SAVEPOINT after_agency;

INSERT INTO Food_Inspector
(inspector_id, first_name, last_name, designation,
assigned_region, contact_number, agency_id)
VALUES (6, 'Sneha', 'Kapoor', 'Inspector',
'West', '9666666666', 6);

SAVEPOINT after_inspector;

-- Step 2: Add agency contact number
INSERT INTO Agency_Contact (agency_id, contact_number)
VALUES (6, '9877001122');

SAVEPOINT after_contact;

-- Step 3: Oops! Duplicate username detected
INSERT INTO System_User
(user_id, username, role, account_status, last_login, inspector_id)
VALUES (6, 'sneha.kapoor', 'Inspector', 'Active', NULL, 6);

-- Step 4: Rollback only account creation and insert correct username
ROLLBACK TO after_contact;

INSERT INTO System_User
(user_id, username, role, account_status, last_login, inspector_id)
VALUES (6, 'sneha.kapoor.west', 'Inspector', 'Active', NULL, 6);

-- Step 5: Commit all changes
COMMIT;

-- Step 6: Verify
SELECT inspector_id, first_name, last_name,
designation, assigned_region, agency_id
FROM Food_Inspector WHERE inspector_id = 6;

SELECT user_id, username, role, account_status, inspector_id
FROM System_User WHERE user_id = 6;

-- CONCURRENCY CONTROL
-- Inspector 1 acquires a lock on compliance record before updating
START TRANSACTION;
SELECT * FROM Compliance_Record
WHERE compliance_id = 5 FOR UPDATE;
-- Lock acquired â€” Inspector 2 must wait until this transaction commits
UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant'
WHERE compliance_id = 5;
COMMIT;
-- Lock released â€” Inspector 2 can now proceed

-- Transaction T1 starts at timestamp 10:00:01
-- Transaction T2 starts at timestamp 10:00:02
-- Both try to update the same Food_Batch row

-- T1 (older â€” higher priority) proceeds first
UPDATE Food_Batch SET batch_status = 'High Risk'
WHERE product_id = 5 AND batch_id = 501;
-- T1 timestamp: 10:00:01 â†’ allowed

-- T2 (newer â€” lower priority) must wait or be rolled back
-- T2 timestamp: 10:00:02 â†’ if T2 tries to write data
-- that T1 already read, T2 is rolled back and restarted

-- Inspector reads compliance record â€” no lock taken
SELECT compliance_status, violation_count
FROM Compliance_Record WHERE compliance_id = 3;
-- Inspector processes the data freely

-- At commit time â€” system checks if the row was
-- modified by another transaction during this time
-- If NO conflict â†’ COMMIT proceeds normally
-- If CONFLICT detected â†’ ROLLBACK and retry

-- No conflict scenario:
UPDATE Compliance_Record
SET violation_count = violation_count + 1
WHERE compliance_id = 3;
COMMIT; -- Allowed â€” no conflict found

-- GROWING PHASE â€” acquire all needed locks
START TRANSACTION;
SELECT * FROM Compliance_Record
WHERE compliance_id = 2 FOR UPDATE;   -- Lock 1 acquired
SELECT * FROM Enforcement_Action
WHERE compliance_id = 2 FOR UPDATE;   -- Lock 2 acquired
SELECT * FROM Food_Batch
WHERE product_id = 2 FOR UPDATE;      -- Lock 3 acquired
-- No locks released yet â€” still in growing phase

-- All operations performed
UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant'
WHERE compliance_id = 2;

INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (10, 2, NULL, 'Financial Penalty',
'2024-04-16', 12000, 'In Progress');

UPDATE Food_Batch SET batch_status = 'Recalled'
WHERE product_id = 2 AND batch_id = 201;

-- SHRINKING PHASE â€” all locks released together at COMMIT
COMMIT;
-- Lock 1, Lock 2, Lock 3 all released simultaneously

START TRANSACTION;

-- Lock only the specific compliance row for Frozen Peas
SELECT * FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501
FOR UPDATE;
-- Only this row is locked â€” all other compliance rows are accessible

UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant',
    violation_count = violation_count + 1
WHERE product_id = 5 AND batch_id = 501;

COMMIT;
-- Row lock released

START TRANSACTION;

-- Acquire WRITE lock on Food_Batch for bulk recall update
LOCK TABLE Food_Batch WRITE;

-- Update all active Frozen Peas batches to Recalled
UPDATE Food_Batch SET batch_status = 'Recalled'
WHERE product_id = 5;

-- Release table lock
UNLOCK TABLES;

COMMIT;

START TRANSACTION;

SELECT * FROM Inspection_Schedule
WHERE schedule_id = 3 FOR UPDATE;
-- Row locked

INSERT INTO Inspection
(inspection_id, schedule_id, inspection_date,
inspection_result, risk_score, remarks)
VALUES (9, 3, '2024-04-16', 'Pass', 20,
'All parameters within acceptable limits');

UPDATE Food_Batch SET batch_status = 'Active'
WHERE product_id = 3 AND batch_id = 301;

COMMIT;
-- All changes permanently saved
-- All locks released â€” waiting sessions can now proceed

START TRANSACTION;

SELECT * FROM Compliance_Record
WHERE compliance_id = 3 FOR UPDATE;
-- Row locked

UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant', violation_count = 2
WHERE compliance_id = 3;

-- Oops! Wrong compliance_id in enforcement action
INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (1, 3, NULL, 'Financial Penalty',
'2024-04-17', 8000, 'In Progress');
-- ERROR: Duplicate entry for primary key

ROLLBACK;
-- All changes undone â€” compliance update reversed
-- Row lock on compliance_id=3 released
-- Database fully restored to original state

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- SESSION A â€” Inspector Rajesh Kumar (inspector_id=1)
-- Updating compliance record for Frozen Peas
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

START TRANSACTION;
-- Step 1: Session A acquires row lock on compliance record
SELECT compliance_id, compliance_status, violation_count, checked_date
FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501
FOR UPDATE;
-- Row is now LOCKED by Session A
-- Session B attempting FOR UPDATE on same row will WAIT

-- Step 2: Session A updates compliance status
UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant',
    violation_count = violation_count + 2,
    checked_date = '2024-04-15'
WHERE product_id = 5 AND batch_id = 501;

SAVEPOINT after_compliance;

-- Step 3: Session A inserts enforcement action
INSERT INTO Enforcement_Action
(action_id, compliance_id, complaint_id, action_type,
action_date, penalty_amount, action_status)
VALUES (10, 5, NULL, 'Financial Penalty',
'2024-04-15', 20000, 'In Progress');

-- Step 4: Session A COMMITS â€” changes saved, row lock RELEASED
COMMIT;

SELECT compliance_id, compliance_status, violation_count, checked_date
FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501;

SELECT action_id, compliance_id, action_type,
penalty_amount, action_status
FROM Enforcement_Action
WHERE compliance_id = 5 and action_id=10;
-- Session B can now acquire the lock and proceed

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- SESSION B â€” Inspector Anita Singh (inspector_id=2)
-- Running concurrently â€” tries same compliance row
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

START TRANSACTION;

-- Step 1: Session B tries to lock same row
-- WAITS here until Session A releases the lock
SELECT compliance_id, compliance_status, violation_count,checked_date
FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501
FOR UPDATE;
-- Lock acquired AFTER Session A commits
-- Session B now sees Session A's fully committed values

-- Step 2: Session B updates checked_date as follow-up
UPDATE Compliance_Record
SET checked_date = '2024-04-16'
WHERE product_id = 5 AND batch_id = 501;

-- Step 3: Session B commits
COMMIT;

SELECT compliance_id, compliance_status, violation_count, checked_date
FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501;


-- row level shared lock 
START TRANSACTION;
-- Shared lock on one compliance row
SELECT *
FROM Compliance_Record
WHERE compliance_id = 5
LOCK IN SHARE MODE;
-- Other transactions can read this row
-- but cannot UPDATE or DELETE it
COMMIT;

-- table level shared lock
-- Acquire shared lock on Inspection table
LOCK TABLE Inspection READ;

-- Generate inspection report
SELECT inspection_id,
       inspection_result,
       risk_score
FROM Inspection
WHERE inspection_result = 'Fail';

-- Release lock
UNLOCK TABLES;
 
-- row level shared lock

START TRANSACTION;
SELECT compliance_id, compliance_status,
       violation_count, checked_date	
FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501
LOCK IN SHARE MODE;
-- Shared lock acquired on this specific row
-- Session B can ALSO read this row with LOCK IN SHARE MODE
-- But Session B CANNOT UPDATE or DELETE this row
-- until Session A commits and releases the shared lock
COMMIT;
-- Shared lock released â€” writes now permitted

-- Session A: Inspector Rajesh Kumar updating 
-- compliance record for Frozen Peas

START TRANSACTION;

SELECT compliance_id, compliance_status,
       violation_count, checked_date
FROM Compliance_Record
WHERE product_id = 5 AND batch_id = 501
FOR UPDATE;
-- Exclusive lock acquired on this specific row
-- Session B trying FOR UPDATE on same row â†’ BLOCKED, must WAIT
-- Session B trying LOCK IN SHARE MODE â†’ also BLOCKED
-- Only plain SELECT (without FOR UPDATE) can still read

UPDATE Compliance_Record
SET compliance_status = 'Non-Compliant',
    violation_count = violation_count + 2,
    checked_date = '2024-04-15'
WHERE product_id = 5 AND batch_id = 501;

COMMIT;
-- Exclusive lock released
-- Session B can now acquire lock and proceed
SELECT * FROM MANUFACTURES;
