-- ================================================================
-- SafeBite — Food Quality Inspection & Compliance Management
-- DDL (Data Definition Language) — Schema & Structure
-- ================================================================
-- Run this file FIRST to create the database and all tables.
-- Then run seed.sql to populate with sample data.
-- ================================================================

CREATE DATABASE IF NOT EXISTS SafeBite;
USE SafeBite;


-- ================================================================
-- CORE TABLES
-- ================================================================

-- 1. FOOD_MANUFACTURER
CREATE TABLE Food_Manufacturer (
    manufacturer_id     INT PRIMARY KEY,
    first_name          VARCHAR(50) NOT NULL,
    last_name           VARCHAR(50) NOT NULL,
    license_number      VARCHAR(50) NOT NULL UNIQUE,
    street              VARCHAR(100) NOT NULL,
    city                VARCHAR(50) NOT NULL,
    state               VARCHAR(50) NOT NULL,
    pincode             VARCHAR(10) NOT NULL,
    registration_date   DATE NOT NULL
);

-- Multi-valued: contact numbers
CREATE TABLE Manufacturer_Contact (
    manufacturer_id     INT NOT NULL,
    contact_number      VARCHAR(15) NOT NULL,
    PRIMARY KEY (manufacturer_id, contact_number),
    FOREIGN KEY (manufacturer_id) REFERENCES Food_Manufacturer(manufacturer_id)
);

-- 2. FOOD_CATEGORY
CREATE TABLE Food_Category (
    category_id         INT PRIMARY KEY,
    category_name       VARCHAR(50) NOT NULL UNIQUE,
    description         VARCHAR(150),
    risk_level          VARCHAR(20) NOT NULL,
    is_active           CHAR(1) NOT NULL
);

-- Multi-valued: storage guidelines
CREATE TABLE Category_Storage_Guidelines (
    category_id         INT NOT NULL,
    guideline           VARCHAR(150) NOT NULL,
    PRIMARY KEY (category_id, guideline),
    FOREIGN KEY (category_id) REFERENCES Food_Category(category_id)
);

-- 3. FOOD_PRODUCT
CREATE TABLE Food_Product (
    product_id          INT PRIMARY KEY,
    product_name        VARCHAR(100) NOT NULL,
    shelf_life          INT NOT NULL,
    approval_status     VARCHAR(20) NOT NULL,
    manufacturer_id     INT NOT NULL,
    category_id         INT NOT NULL,
    FOREIGN KEY (manufacturer_id) REFERENCES Food_Manufacturer(manufacturer_id),
    FOREIGN KEY (category_id) REFERENCES Food_Category(category_id)
);

-- Multi-valued: certifications
CREATE TABLE Product_Certifications (
    product_id          INT NOT NULL,
    certification       VARCHAR(50) NOT NULL,
    PRIMARY KEY (product_id, certification),
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id)
);

-- 4. FOOD_BATCH (Weak Entity)
CREATE TABLE Food_Batch (
    product_id          INT NOT NULL,
    batch_id            INT NOT NULL,
    batch_number        VARCHAR(50) NOT NULL,
    production_date     DATE NOT NULL,
    expiry_date         DATE NOT NULL,
    batch_status        VARCHAR(20) NOT NULL,
    PRIMARY KEY (product_id, batch_id),
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id)
);

-- Derived: shelf_remaining = expiry_date - CURDATE()
-- Use in queries: SELECT batch_id, DATEDIFF(expiry_date, CURDATE()) AS shelf_remaining FROM Food_Batch;


-- ================================================================
-- INSPECTION & AGENCY TABLES
-- ================================================================

-- 5. INSPECTION_AGENCY
CREATE TABLE Inspection_Agency (
    agency_id           INT PRIMARY KEY,
    agency_name         VARCHAR(100) NOT NULL,
    accreditation_number VARCHAR(50) NOT NULL UNIQUE,
    region              VARCHAR(50) NOT NULL,
    email               VARCHAR(100) NOT NULL UNIQUE
);

-- Multi-valued: contact numbers
CREATE TABLE Agency_Contact (
    agency_id           INT NOT NULL,
    contact_number      VARCHAR(15) NOT NULL,
    PRIMARY KEY (agency_id, contact_number),
    FOREIGN KEY (agency_id) REFERENCES Inspection_Agency(agency_id)
);

-- 6. FOOD_INSPECTOR
CREATE TABLE Food_Inspector (
    inspector_id        INT PRIMARY KEY,
    first_name          VARCHAR(50) NOT NULL,
    last_name           VARCHAR(50) NOT NULL,
    designation         VARCHAR(50) NOT NULL,
    assigned_region     VARCHAR(50) NOT NULL,
    contact_number      VARCHAR(15) NOT NULL,
    agency_id           INT NOT NULL,
    FOREIGN KEY (agency_id) REFERENCES Inspection_Agency(agency_id)
);

-- 7. INSPECTION_SCHEDULE
CREATE TABLE Inspection_Schedule (
    schedule_id         INT PRIMARY KEY,
    product_id          INT NOT NULL,
    batch_id            INT NOT NULL,
    inspector_id        INT NOT NULL,
    scheduled_date      DATE NOT NULL,
    inspection_type     VARCHAR(50) NOT NULL,
    priority_level      VARCHAR(20) NOT NULL,
    FOREIGN KEY (product_id, batch_id) REFERENCES Food_Batch(product_id, batch_id),
    FOREIGN KEY (inspector_id) REFERENCES Food_Inspector(inspector_id)
);

-- 8. INSPECTION
CREATE TABLE Inspection (
    inspection_id       INT PRIMARY KEY,
    schedule_id         INT NOT NULL UNIQUE,
    inspection_date     DATE NOT NULL,
    inspection_result   VARCHAR(20) NOT NULL,
    risk_score          INT NOT NULL,
    remarks             VARCHAR(150),
    FOREIGN KEY (schedule_id) REFERENCES Inspection_Schedule(schedule_id)
);

-- 9. SAMPLE_COLLECTION (Weak Entity)
CREATE TABLE Sample_Collection (
    inspection_id       INT NOT NULL,
    sample_id           INT NOT NULL,
    sample_type         VARCHAR(50) NOT NULL,
    quantity_collected  INT NOT NULL,
    collection_date     DATE NOT NULL,
    seal_number         VARCHAR(50) NOT NULL,
    PRIMARY KEY (inspection_id, sample_id),
    FOREIGN KEY (inspection_id) REFERENCES Inspection(inspection_id)
);


-- ================================================================
-- LABORATORY & TESTING TABLES
-- ================================================================

-- 10. LABORATORY
CREATE TABLE Laboratory (
    lab_id              INT PRIMARY KEY,
    lab_name            VARCHAR(100) NOT NULL,
    lab_type            VARCHAR(50) NOT NULL,
    accreditation_code  VARCHAR(50) NOT NULL UNIQUE,
    street              VARCHAR(100) NOT NULL,
    city                VARCHAR(50) NOT NULL,
    state               VARCHAR(50) NOT NULL,
    pincode             VARCHAR(10) NOT NULL,
    contact_number      VARCHAR(15) NOT NULL
);

-- 11. TEST_PARAMETER
CREATE TABLE Test_Parameter (
    parameter_id        INT PRIMARY KEY,
    parameter_name      VARCHAR(50) NOT NULL,
    unit_of_measure     VARCHAR(20) NOT NULL,
    permissible_limit   INT NOT NULL,
    testing_method      VARCHAR(50) NOT NULL,
    severity_level      VARCHAR(20) NOT NULL
);

-- 12. LAB_TEST
CREATE TABLE Lab_Test (
    test_id             INT PRIMARY KEY,
    inspection_id       INT NOT NULL,
    lab_id              INT NOT NULL,
    parameter_id        INT NOT NULL,
    test_result         INT NOT NULL,
    result_status       VARCHAR(20) NOT NULL,
    FOREIGN KEY (inspection_id) REFERENCES Inspection(inspection_id),
    FOREIGN KEY (lab_id) REFERENCES Laboratory(lab_id),
    FOREIGN KEY (parameter_id) REFERENCES Test_Parameter(parameter_id)
);


-- ================================================================
-- COMPLIANCE & ENFORCEMENT TABLES
-- ================================================================

-- 13. COMPLIANCE_STANDARD
CREATE TABLE Compliance_Standard (
    standard_id         INT PRIMARY KEY,
    standard_name       VARCHAR(100) NOT NULL,
    issuing_authority   VARCHAR(100) NOT NULL,
    effective_date      DATE NOT NULL,
    severity_level      VARCHAR(20) NOT NULL,
    category_id         INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Food_Category(category_id)
);

-- 14. COMPLIANCE_RECORD
CREATE TABLE Compliance_Record (
    compliance_id       INT PRIMARY KEY,
    product_id          INT NOT NULL,
    batch_id            INT NOT NULL,
    standard_id         INT NOT NULL,
    compliance_status   VARCHAR(20) NOT NULL,
    checked_date        DATE NOT NULL,
    violation_count     INT NOT NULL,
    FOREIGN KEY (product_id, batch_id) REFERENCES Food_Batch(product_id, batch_id),
    FOREIGN KEY (standard_id) REFERENCES Compliance_Standard(standard_id)
);

-- Derived: is_violated = violation_count > 0
-- Use: SELECT compliance_id, IF(violation_count > 0, 'Yes', 'No') AS is_violated FROM Compliance_Record;

-- 15. VIOLATION_TYPE (Weak Entity)
CREATE TABLE Violation_Type (
    standard_id         INT NOT NULL,
    violation_id        INT NOT NULL,
    violation_name      VARCHAR(100) NOT NULL,
    description         VARCHAR(150),
    severity_level      VARCHAR(20) NOT NULL,
    penalty_range       VARCHAR(50) NOT NULL,
    PRIMARY KEY (standard_id, violation_id),
    FOREIGN KEY (standard_id) REFERENCES Compliance_Standard(standard_id)
);


-- ================================================================
-- CONSUMER & COMPLAINT TABLES
-- ================================================================

-- 16. CONSUMER
CREATE TABLE Consumer (
    consumer_id         INT PRIMARY KEY,
    first_name          VARCHAR(50) NOT NULL,
    last_name           VARCHAR(50) NOT NULL,
    contact_number      VARCHAR(15) NOT NULL,
    email               VARCHAR(100) NOT NULL UNIQUE,
    street              VARCHAR(100) NOT NULL,
    city                VARCHAR(50) NOT NULL,
    state               VARCHAR(50) NOT NULL,
    pincode             VARCHAR(10) NOT NULL,
    registration_date   DATE NOT NULL
);

-- 17. RECALL_NOTICE
CREATE TABLE Recall_Notice (
    recall_id           INT PRIMARY KEY,
    product_id          INT NOT NULL,
    recall_reason       VARCHAR(150) NOT NULL,
    recall_date         DATE NOT NULL,
    recall_level        VARCHAR(20) NOT NULL,
    recall_status       VARCHAR(20) NOT NULL DEFAULT 'Active',
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id)
);

-- 18. COMPLAINT
CREATE TABLE Complaint (
    complaint_id        INT PRIMARY KEY,
    consumer_id         INT NOT NULL,
    product_id          INT NOT NULL,
    complaint_date      DATE NOT NULL,
    complaint_type      VARCHAR(50) NOT NULL,
    status              VARCHAR(20) NOT NULL,
    FOREIGN KEY (consumer_id) REFERENCES Consumer(consumer_id),
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id)
);

-- 19. ENFORCEMENT_ACTION
CREATE TABLE Enforcement_Action (
    action_id           INT PRIMARY KEY,
    compliance_id       INT,
    complaint_id        INT,
    action_type         VARCHAR(50) NOT NULL,
    action_date         DATE NOT NULL,
    penalty_amount      INT NOT NULL,
    action_status       VARCHAR(20) NOT NULL,
    FOREIGN KEY (compliance_id) REFERENCES Compliance_Record(compliance_id),
    FOREIGN KEY (complaint_id) REFERENCES Complaint(complaint_id)
);


-- ================================================================
-- SYSTEM & AUTH TABLES
-- ================================================================

-- 20. SYSTEM_USER
CREATE TABLE System_User (
    user_id             INT PRIMARY KEY,
    username            VARCHAR(50) NOT NULL UNIQUE,
    role                VARCHAR(30) NOT NULL,
    account_status      VARCHAR(20) NOT NULL,
    last_login          DATE,
    inspector_id        INT NOT NULL UNIQUE,
    FOREIGN KEY (inspector_id) REFERENCES Food_Inspector(inspector_id)
);


-- ================================================================
-- CONSTRAINTS (added after table creation)
-- ================================================================

ALTER TABLE Inspection MODIFY remarks VARCHAR(150) NOT NULL;
ALTER TABLE Inspection ADD CONSTRAINT chk_risk_score CHECK (risk_score BETWEEN 0 AND 100);


-- ================================================================
-- AUDIT LOG TABLE (for triggers)
-- ================================================================

CREATE TABLE Compliance_Audit_Log (
    log_id              INT AUTO_INCREMENT PRIMARY KEY,
    compliance_id       INT,
    old_status          VARCHAR(20),
    new_status          VARCHAR(20),
    old_violation_count INT,
    new_violation_count INT,
    changed_on          DATETIME
);


-- ================================================================
-- TRIGGERS
-- ================================================================

DELIMITER $$

-- Auto-flag failed inspections with high risk
CREATE TRIGGER trg_before_inspection_insert
BEFORE INSERT ON Inspection
FOR EACH ROW
BEGIN
    IF NEW.inspection_result = 'Fail' AND NEW.risk_score >= 50 THEN
        SET NEW.remarks = CONCAT('[AUTO-FLAGGED] ', NEW.remarks);
    END IF;
END$$

-- Auto-update batch status on failed inspection
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

-- Audit log on compliance record changes
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

-- Prevent deletion of failed inspections
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


-- ================================================================
-- VIEWS
-- ================================================================

CREATE VIEW View_Complete_Inspection_Summary AS
SELECT
    I.inspection_id,
    FP.product_name,
    CONCAT(FM.first_name, ' ', FM.last_name) AS manufacturer_name,
    CONCAT(FI.first_name, ' ', FI.last_name) AS inspector_name,
    FB.batch_number,
    I.inspection_date,
    I.inspection_result,
    I.risk_score,
    CASE
        WHEN I.risk_score >= 60 THEN 'High Risk'
        WHEN I.risk_score >= 30 THEN 'Medium Risk'
        ELSE 'Low Risk'
    END AS risk_classification,
    I.remarks
FROM Inspection I
INNER JOIN Inspection_Schedule ISC ON I.schedule_id = ISC.schedule_id
INNER JOIN Food_Inspector FI ON ISC.inspector_id = FI.inspector_id
INNER JOIN Food_Batch FB ON ISC.product_id = FB.product_id AND ISC.batch_id = FB.batch_id
INNER JOIN Food_Product FP ON FB.product_id = FP.product_id
INNER JOIN Food_Manufacturer FM ON FP.manufacturer_id = FM.manufacturer_id;


CREATE VIEW View_Compliance_Dashboard AS
SELECT
    FP.product_name,
    FC.category_name,
    CS.standard_name,
    CS.severity_level,
    CR.compliance_status,
    CR.violation_count,
    IF(CR.violation_count > 0, 'Yes', 'No') AS is_violated,
    CR.checked_date,
    EA.action_type,
    EA.penalty_amount,
    EA.action_status
FROM Compliance_Record CR
INNER JOIN Food_Batch FB ON CR.product_id = FB.product_id AND CR.batch_id = FB.batch_id
INNER JOIN Food_Product FP ON FB.product_id = FP.product_id
INNER JOIN Food_Category FC ON FP.category_id = FC.category_id
INNER JOIN Compliance_Standard CS ON CR.standard_id = CS.standard_id
LEFT JOIN Enforcement_Action EA ON CR.compliance_id = EA.compliance_id;


-- ================================================================
-- STORED PROCEDURES
-- ================================================================

DELIMITER $$

-- Update compliance status for violated records
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

-- Dashboard summary procedure
CREATE PROCEDURE proc_safebite_dashboard()
BEGIN
    DECLARE v_total_manufacturers INT;
    DECLARE v_total_inspections INT;
    DECLARE v_total_passed INT;
    DECLARE v_total_failed INT;
    DECLARE v_total_penalty INT;
    DECLARE v_total_active_recalls INT;
    DECLARE v_total_complaints INT;

    SELECT COUNT(*) INTO v_total_manufacturers FROM Food_Manufacturer;
    SELECT COUNT(*) INTO v_total_inspections FROM Inspection WHERE inspection_id <= 5;
    SELECT COUNT(*) INTO v_total_passed FROM Inspection WHERE inspection_result = 'Pass' AND inspection_id <= 5;
    SELECT COUNT(*) INTO v_total_failed FROM Inspection WHERE inspection_result = 'Fail' AND inspection_id <= 5;
    SELECT SUM(penalty_amount) INTO v_total_penalty FROM Enforcement_Action WHERE action_status = 'Completed';
    SELECT COUNT(*) INTO v_total_active_recalls FROM Recall_Notice WHERE recall_status = 'Active' AND recall_id <= 5;
    SELECT COUNT(*) INTO v_total_complaints FROM Complaint;

    SELECT v_total_manufacturers   AS total_manufacturers,
           v_total_inspections     AS total_inspections,
           v_total_passed          AS total_passed,
           v_total_failed          AS total_failed,
           v_total_penalty         AS total_penalty_collected,
           v_total_active_recalls  AS active_recalls,
           v_total_complaints      AS total_complaints;
END$$

-- Compliance penalty summary with cursor
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
        INNER JOIN Food_Batch FB ON CR.product_id = FB.product_id AND CR.batch_id = FB.batch_id
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

-- Recall report with cursor
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
               CONCAT(FM.first_name, ' ', FM.last_name),
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

-- Manufacturer safety report with cursor
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
        SELECT manufacturer_id, CONCAT(first_name, ' ', last_name), city
        FROM Food_Manufacturer;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_mid, v_mname, v_city;
        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        SELECT COUNT(*) INTO v_product_count FROM Food_Product WHERE manufacturer_id = v_mid;
        SELECT COUNT(*) INTO v_complaint_count FROM Complaint C
            INNER JOIN Food_Product FP ON C.product_id = FP.product_id WHERE FP.manufacturer_id = v_mid;
        SELECT COUNT(*) INTO v_recall_count FROM Recall_Notice RN
            INNER JOIN Food_Product FP ON RN.product_id = FP.product_id WHERE FP.manufacturer_id = v_mid AND RN.recall_id <= 5;

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

-- Safe consumer insert with exception handling
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

-- Safe recall status update with exception handling
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

    SELECT COUNT(*) INTO v_count FROM Recall_Notice WHERE recall_id = p_recall_id;

    IF v_count = 0 THEN
        SELECT CONCAT('Error: Recall ID ', p_recall_id, ' does not exist in the system.') AS Message;
    ELSE
        UPDATE Recall_Notice SET recall_status = p_new_status WHERE recall_id = p_recall_id;
        SELECT CONCAT('Recall ID ', p_recall_id, ' status updated to ', p_new_status, ' successfully.') AS Message;
    END IF;
END$$

DELIMITER ;


-- ================================================================
-- NORMALIZATION DEMONSTRATION TABLES (Academic only)
-- These are NOT part of the production schema.
-- ================================================================

-- 1NF Demo — non-atomic certifications column
CREATE TABLE Food_Product_Raw (
    product_id       INT          NOT NULL,
    product_name     VARCHAR(100) NOT NULL,
    shelf_life       INT          NOT NULL,
    approval_status  VARCHAR(20)  NOT NULL,
    manufacturer_id  INT          NOT NULL,
    category_id      INT          NOT NULL,
    certifications   VARCHAR(200) NOT NULL
);

-- 2NF/3NF/BCNF Demo — partial & transitive dependencies
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
);

-- 4NF Demo — multi-valued dependencies
CREATE TABLE Food_Product_MVD (
    product_id         INT          NOT NULL,
    category_id        INT          NOT NULL,
    certification      VARCHAR(50)  NOT NULL,
    storage_guideline  VARCHAR(150) NOT NULL
);

-- 5NF Demo — join dependency
CREATE TABLE Inspector_Assignment_Raw (
    inspector_id  INT NOT NULL,
    agency_id     INT NOT NULL,
    product_id    INT NOT NULL,
    PRIMARY KEY (inspector_id, agency_id, product_id)
);
