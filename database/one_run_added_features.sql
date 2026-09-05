-- =============================================================================
-- Luntian HR Portal — ONE-RUN SQL (newly added features)
-- Generated: 2026-09-05 17:54:53 Asia/Manila
-- Target DB: luntian (shared) | Table prefix: hr_
-- Safe to re-run on servers that already have older HR tables.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- hr_inventory_item_types
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_inventory_item_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code_prefix` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_inventory_item_types_name_unique` (`name`),
  UNIQUE KEY `hr_inventory_item_types_code_prefix_unique` (`code_prefix`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_inventory_assets
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_inventory_assets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `item_code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `allocated_to_employee_id` bigint(20) unsigned DEFAULT NULL,
  `allocated_to_name` varchar(255) DEFAULT NULL,
  `condition` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `date_arrived` date DEFAULT NULL,
  `date_purchased` date DEFAULT NULL,
  `service_months` smallint(5) unsigned NOT NULL DEFAULT 38,
  `brand` varchar(255) DEFAULT NULL,
  `picture_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`picture_paths`)),
  `created_by_user_id` bigint(20) unsigned DEFAULT NULL,
  `inventory_request_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_inventory_assets_item_code_unique` (`item_code`),
  KEY `hr_inventory_assets_allocated_to_employee_id_foreign` (`allocated_to_employee_id`),
  KEY `hr_inventory_assets_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `hr_inventory_assets_inventory_request_id_foreign` (`inventory_request_id`),
  CONSTRAINT `hr_inventory_assets_allocated_to_employee_id_foreign` FOREIGN KEY (`allocated_to_employee_id`) REFERENCES `hr_employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_inventory_assets_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_inventory_assets_inventory_request_id_foreign` FOREIGN KEY (`inventory_request_id`) REFERENCES `hr_inventory_requests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_performance_reviews
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_performance_reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reviewed_by_user_id` bigint(20) unsigned NOT NULL,
  `supervisor_name` varchar(255) NOT NULL,
  `employee_id` bigint(20) unsigned NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `employee_number` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `review_date` date NOT NULL,
  `overall_score` decimal(4,2) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Submitted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_performance_reviews_reviewed_by_user_id_foreign` (`reviewed_by_user_id`),
  KEY `hr_performance_reviews_employee_id_foreign` (`employee_id`),
  CONSTRAINT `hr_performance_reviews_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hr_performance_reviews_reviewed_by_user_id_foreign` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_performance_review_ratings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_performance_review_ratings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `performance_review_id` bigint(20) unsigned NOT NULL,
  `competency_key` varchar(255) NOT NULL,
  `competency_title` varchar(255) NOT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `explanation` text NOT NULL,
  `sort_order` smallint(5) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `perf_review_competency_unique` (`performance_review_id`,`competency_key`),
  CONSTRAINT `hr_performance_review_ratings_performance_review_id_foreign` FOREIGN KEY (`performance_review_id`) REFERENCES `hr_performance_reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Column upgrades on existing tables
-- -----------------------------------------------------------------------------

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_items' AND COLUMN_NAME = 'quantity');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_inventory_items` ADD COLUMN `quantity` INT UNSIGNED NOT NULL DEFAULT 0 AFTER `description`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_discipline_records' AND COLUMN_NAME = 'counts_for_progress');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_discipline_records` ADD COLUMN `counts_for_progress` TINYINT(1) NOT NULL DEFAULT 1 AFTER `status`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'date_purchased');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_inventory_assets` ADD COLUMN `date_purchased` DATE NULL AFTER `date_arrived`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'service_months');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_inventory_assets` ADD COLUMN `service_months` SMALLINT UNSIGNED NOT NULL DEFAULT 38 AFTER `date_purchased`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'status');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_inventory_assets` ADD COLUMN `status` VARCHAR(255) NULL AFTER `condition`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'picture_paths');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_inventory_assets` ADD COLUMN `picture_paths` JSON NULL AFTER `brand`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__exists := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'inventory_request_id');
SET @__sql := IF(@__exists = 0, 'ALTER TABLE `hr_inventory_assets` ADD COLUMN `inventory_request_id` BIGINT UNSIGNED NULL AFTER `created_by_user_id`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

-- Migrate legacy picture_path → picture_paths (if old column still exists)
SET @__has_old := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'picture_path');
SET @__has_new := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND COLUMN_NAME = 'picture_paths');
SET @__sql := IF(@__has_old > 0 AND @__has_new > 0, 'UPDATE `hr_inventory_assets` SET `picture_paths` = JSON_ARRAY(`picture_path`) WHERE `picture_path` IS NOT NULL AND `picture_path` != \'\' AND (`picture_paths` IS NULL OR JSON_LENGTH(`picture_paths`) = 0)', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

SET @__sql := IF(@__has_old > 0, 'ALTER TABLE `hr_inventory_assets` DROP COLUMN `picture_path`', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

-- FK: inventory_assets.inventory_request_id → inventory_requests
SET @__fk := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hr_inventory_assets' AND CONSTRAINT_NAME = 'hr_inventory_assets_inventory_request_id_foreign' AND CONSTRAINT_TYPE = 'FOREIGN KEY');
SET @__sql := IF(@__fk = 0, 'ALTER TABLE `hr_inventory_assets` ADD CONSTRAINT `hr_inventory_assets_inventory_request_id_foreign` FOREIGN KEY (`inventory_request_id`) REFERENCES `hr_inventory_requests` (`id`) ON DELETE SET NULL', 'SELECT 1');
PREPARE __stmt FROM @__sql;
EXECUTE __stmt;
DEALLOCATE PREPARE __stmt;

-- -----------------------------------------------------------------------------
-- Seed: inventory item types
-- -----------------------------------------------------------------------------
INSERT INTO `hr_inventory_item_types` (`name`, `code_prefix`, `is_active`, `sort_order`, `created_at`, `updated_at`)
SELECT v.name, v.code_prefix, 1, v.sort_order, NOW(), NOW()
FROM (
  SELECT 'Laptop' AS name, 'LAP-' AS code_prefix, 1 AS sort_order UNION ALL
  SELECT 'Mouse', 'MOU-', 2 UNION ALL
  SELECT 'Keyboard', 'KEY-', 3 UNION ALL
  SELECT 'Charger', 'CHG-', 4 UNION ALL
  SELECT 'Power Cord', 'COR-', 5 UNION ALL
  SELECT 'Monitor', 'MON-', 6 UNION ALL
  SELECT 'Laptop Stand', 'LST-', 7 UNION ALL
  SELECT 'Laptop Sleeve', 'LSL-', 8 UNION ALL
  SELECT 'Storage Bag', 'STB-', 9 UNION ALL
  SELECT 'Bag', 'BAG-', 10 UNION ALL
  SELECT 'Company Phone', 'CPH-', 11 UNION ALL
  SELECT 'Table', 'TAB-', 12 UNION ALL
  SELECT 'Miscellaneous', 'MSC-', 13 UNION ALL
  SELECT 'Portable Monitor', 'PMO-', 14
) AS v
WHERE NOT EXISTS (
  SELECT 1 FROM `hr_inventory_item_types` t
  WHERE t.name = v.name OR t.code_prefix = v.code_prefix
);

-- -----------------------------------------------------------------------------
-- Seed / upsert: inventory request categories (hr_inventory_items)
-- -----------------------------------------------------------------------------
INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-LAP-001', 'Laptop', 'Standard company laptop', 26, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-MOU-001', 'Mouse', 'USB / wireless mouse', 17, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-KEY-001', 'Keyboard', 'Standard keyboard', 14, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-CHG-001', 'Charger', 'Device charger', 2, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-PC-001', 'Power Cord', 'Power cable', 0, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-MON-001', 'Monitor', 'External display monitor', 6, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-PMON-001', 'Portable Monitor', 'Portable display', 11, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-STAND-001', 'Laptop Stand', 'Laptop stand', 13, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-SLEEVE-001', 'Laptop Sleeve', 'Laptop sleeve', 5, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-SBAG-001', 'Storage Bag', 'Storage bag', 7, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-BAG-001', 'Bag', 'Company bag', 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-PHONE-001', 'Company Phone', 'Company mobile phone', 5, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-TBL-001', 'Table', 'Office table', 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-MISC-001', 'Miscellaneous', 'Other inventory items', 62, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
VALUES ('IT-HS-001', 'Headset', 'Headset with microphone', 8, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `quantity` = VALUES(`quantity`), `is_active` = 1, `updated_at` = NOW();

-- -----------------------------------------------------------------------------
-- Record migrations so artisan migrate will skip these
-- -----------------------------------------------------------------------------
SET @__batch := (SELECT COALESCE(MAX(batch), 0) + 1 FROM `hr_migrations`);
INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_201000_add_quantity_and_seed_inventory_categories', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_201000_add_quantity_and_seed_inventory_categories');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_203500_add_counts_for_progress_to_discipline_records', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_203500_add_counts_for_progress_to_discipline_records');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_210000_create_performance_reviews_tables', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_210000_create_performance_reviews_tables');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_214500_create_inventory_assets_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_214500_create_inventory_assets_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_215500_create_inventory_item_types_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_215500_create_inventory_item_types_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_223000_add_purchase_and_status_to_inventory_assets', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_223000_add_purchase_and_status_to_inventory_assets');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_04_235900_convert_inventory_asset_pictures_to_json', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_04_235900_convert_inventory_asset_pictures_to_json');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_09_05_170000_add_inventory_request_id_to_inventory_assets', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_09_05_170000_add_inventory_request_id_to_inventory_assets');

SET FOREIGN_KEY_CHECKS = 1;

-- Done.
