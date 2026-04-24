create database if not exists SafeBite;
use SafeBite;

-- 1. FOOD_MANUFACTURER
CREATE TABLE Food_Manufacturer (
    manufacturer_id     INT AUTO_INCREMENT PRIMARY KEY,
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
    FOREIGN KEY (manufacturer_id) REFERENCES Food_Manufacturer(manufacturer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 2. FOOD_CATEGORY
CREATE TABLE Food_Category (
    category_id         INT AUTO_INCREMENT PRIMARY KEY,
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
    FOREIGN KEY (category_id) REFERENCES Food_Category(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. FOOD_PRODUCT
CREATE TABLE Food_Product (
    product_id          INT AUTO_INCREMENT PRIMARY KEY,
    product_name        VARCHAR(100) NOT NULL,
    shelf_life          INT NOT NULL,
    approval_status     VARCHAR(20) NOT NULL,
    manufacturer_id     INT NOT NULL,
    category_id         INT NOT NULL,
    FOREIGN KEY (manufacturer_id) REFERENCES Food_Manufacturer(manufacturer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Food_Category(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Multi-valued: certifications
CREATE TABLE Product_Certifications (
    product_id          INT NOT NULL,
    certification       VARCHAR(50) NOT NULL,
    PRIMARY KEY (product_id, certification),
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. INSPECTION_AGENCY
CREATE TABLE Inspection_Agency (
    agency_id           INT AUTO_INCREMENT PRIMARY KEY,
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
    FOREIGN KEY (agency_id) REFERENCES Inspection_Agency(agency_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. FOOD_INSPECTOR
CREATE TABLE Food_Inspector (
    inspector_id        INT AUTO_INCREMENT PRIMARY KEY,
    first_name          VARCHAR(50) NOT NULL,
    last_name           VARCHAR(50) NOT NULL,
    designation         VARCHAR(50) NOT NULL,
    assigned_region     VARCHAR(50) NOT NULL,
    contact_number      VARCHAR(15) NOT NULL,
    agency_id           INT NOT NULL,
    FOREIGN KEY (agency_id) REFERENCES Inspection_Agency(agency_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. INSPECTION_SCHEDULE
CREATE TABLE Inspection_Schedule (
    schedule_id         INT AUTO_INCREMENT PRIMARY KEY,
    product_id          INT NOT NULL,
    batch_id            INT NOT NULL,
    inspector_id        INT NOT NULL,
    scheduled_date      DATE NOT NULL,
    inspection_type     VARCHAR(50) NOT NULL,
    priority_level      VARCHAR(20) NOT NULL,
    FOREIGN KEY (product_id, batch_id) REFERENCES Food_Batch(product_id, batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (inspector_id) REFERENCES Food_Inspector(inspector_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. INSPECTION
CREATE TABLE Inspection (
    inspection_id       INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id         INT NOT NULL UNIQUE,
    inspection_date     DATE NOT NULL,
    inspection_result   VARCHAR(20) NOT NULL,
    risk_score          INT NOT NULL,
    remarks             VARCHAR(150),
    FOREIGN KEY (schedule_id) REFERENCES Inspection_Schedule(schedule_id) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (inspection_id) REFERENCES Inspection(inspection_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 10. LABORATORY
CREATE TABLE Laboratory (
    lab_id              INT AUTO_INCREMENT PRIMARY KEY,
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
    parameter_id        INT AUTO_INCREMENT PRIMARY KEY,
    parameter_name      VARCHAR(50) NOT NULL,
    unit_of_measure     VARCHAR(20) NOT NULL,
    permissible_limit   INT NOT NULL,
    testing_method      VARCHAR(50) NOT NULL,
    severity_level      VARCHAR(20) NOT NULL
);

-- 12. LAB_TEST
CREATE TABLE Lab_Test (
    test_id             INT AUTO_INCREMENT PRIMARY KEY,
    inspection_id       INT NOT NULL,
    lab_id              INT NOT NULL,
    parameter_id        INT NOT NULL,
    test_result         INT NOT NULL,
    result_status       VARCHAR(20) NOT NULL,
    FOREIGN KEY (inspection_id) REFERENCES Inspection(inspection_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (lab_id) REFERENCES Laboratory(lab_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (parameter_id) REFERENCES Test_Parameter(parameter_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 13. COMPLIANCE_STANDARD
CREATE TABLE Compliance_Standard (
    standard_id         INT AUTO_INCREMENT PRIMARY KEY,
    standard_name       VARCHAR(100) NOT NULL,
    issuing_authority   VARCHAR(100) NOT NULL,
    effective_date      DATE NOT NULL,
    severity_level      VARCHAR(20) NOT NULL,
    category_id         INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Food_Category(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 14. COMPLIANCE_RECORD
CREATE TABLE Compliance_Record (
    compliance_id       INT AUTO_INCREMENT PRIMARY KEY,
    product_id          INT NOT NULL,
    batch_id            INT NOT NULL,
    standard_id         INT NOT NULL,
    compliance_status   VARCHAR(20) NOT NULL,
    checked_date        DATE NOT NULL,
    violation_count     INT NOT NULL,
    FOREIGN KEY (product_id, batch_id) REFERENCES Food_Batch(product_id, batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (standard_id) REFERENCES Compliance_Standard(standard_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 15. VIOLATION_TYPE (Weak Entity)
CREATE TABLE Violation_Type (
    standard_id         INT NOT NULL,
    violation_id        INT NOT NULL,
    violation_name      VARCHAR(100) NOT NULL,
    description         VARCHAR(150),
    severity_level      VARCHAR(20) NOT NULL,
    penalty_range       VARCHAR(50) NOT NULL,
    PRIMARY KEY (standard_id, violation_id),
    FOREIGN KEY (standard_id) REFERENCES Compliance_Standard(standard_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 16. CONSUMER
CREATE TABLE Consumer (
    consumer_id         INT AUTO_INCREMENT PRIMARY KEY,
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
    recall_id           INT AUTO_INCREMENT PRIMARY KEY,
    product_id          INT NOT NULL,
    recall_reason       VARCHAR(150) NOT NULL,
    recall_date         DATE NOT NULL,
    recall_level        VARCHAR(20) NOT NULL,
    recall_status       VARCHAR(20) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 18. COMPLAINT
CREATE TABLE Complaint (
    complaint_id        INT AUTO_INCREMENT PRIMARY KEY,
    consumer_id         INT NOT NULL,
    product_id          INT NOT NULL,
    complaint_date      DATE NOT NULL,
    complaint_type      VARCHAR(50) NOT NULL,
    status              VARCHAR(20) NOT NULL,
    FOREIGN KEY (consumer_id) REFERENCES Consumer(consumer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Food_Product(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 19. ENFORCEMENT_ACTION
CREATE TABLE Enforcement_Action (
    action_id           INT AUTO_INCREMENT PRIMARY KEY,
    compliance_id       INT,
    complaint_id        INT,
    action_type         VARCHAR(50) NOT NULL,
    action_date         DATE NOT NULL,
    penalty_amount      INT NOT NULL,
    action_status       VARCHAR(20) NOT NULL,
    FOREIGN KEY (compliance_id) REFERENCES Compliance_Record(compliance_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (complaint_id) REFERENCES Complaint(complaint_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 20. SYSTEM_USER
CREATE TABLE System_User (
    user_id             INT AUTO_INCREMENT PRIMARY KEY,
    username            VARCHAR(50) NOT NULL UNIQUE,
    role                VARCHAR(30) NOT NULL,
    account_status      VARCHAR(20) NOT NULL,
    last_login          DATE,
    inspector_id        INT NOT NULL UNIQUE,
    FOREIGN KEY (inspector_id) REFERENCES Food_Inspector(inspector_id) ON DELETE CASCADE ON UPDATE CASCADE
);
