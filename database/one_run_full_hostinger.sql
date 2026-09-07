-- =============================================================================
-- Luntian HR Portal — FULL ONE-RUN SQL (Hostinger)
-- Database: u501101592_luntian
-- Generated: 2026-09-07 Asia/Manila
--
-- USE THIS FILE on a fresh Hostinger DB (not one_run_added_features.sql).
-- That older file assumes hr_inventory_items already exists.
--
-- phpMyAdmin steps:
--   1. Select database: u501101592_luntian
--   2. SQL tab (or Import)
--   3. Paste / upload this WHOLE file and Go
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- hr_users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'employee',
  `google_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_users_email_unique` (`email`),
  UNIQUE KEY `hr_users_google_id_unique` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_password_reset_tokens
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_sessions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_sessions_user_id_index` (`user_id`),
  KEY `hr_sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_cache
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `hr_cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_cache_locks
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `hr_cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_jobs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_job_batches
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_failed_jobs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_permissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'General',
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_permissions_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_role_permission
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_role_permission` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_role_permission_role_permission_id_unique` (`role`,`permission_id`),
  KEY `hr_role_permission_permission_id_foreign` (`permission_id`),
  CONSTRAINT `hr_role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `hr_permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_user_permission
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_user_permission` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_user_permission_user_id_permission_id_unique` (`user_id`,`permission_id`),
  KEY `hr_user_permission_permission_id_foreign` (`permission_id`),
  CONSTRAINT `hr_user_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `hr_permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hr_user_permission_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_employees
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_employees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_relation` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(255) DEFAULT NULL,
  `emergency_contact_same_address` tinyint(1) NOT NULL DEFAULT 0,
  `emergency_contact_address` text DEFAULT NULL,
  `employee_number` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `date_hired` date DEFAULT NULL,
  `employment_status` varchar(255) NOT NULL DEFAULT 'active',
  `work_location` varchar(255) DEFAULT NULL,
  `immediate_supervisor` varchar(255) DEFAULT NULL,
  `tin` varchar(255) DEFAULT NULL,
  `sss_number` varchar(255) DEFAULT NULL,
  `philhealth_number` varchar(255) DEFAULT NULL,
  `pagibig_number` varchar(255) DEFAULT NULL,
  `nbi_clearance` varchar(255) DEFAULT NULL,
  `police_clearance` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_employees_email_unique` (`email`),
  UNIQUE KEY `hr_employees_employee_number_unique` (`employee_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_employment_types
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_employment_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_employment_types_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_employment_statuses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_employment_statuses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_employment_statuses_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_form_options
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_form_options` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_form_options_category_name_unique` (`category`,`name`),
  KEY `hr_form_options_category_is_active_sort_order_index` (`category`,`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_activity_logs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_activity_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `module` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) unsigned DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_activity_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`),
  KEY `hr_activity_logs_module_created_at_index` (`module`,`created_at`),
  KEY `hr_activity_logs_user_id_created_at_index` (`user_id`,`created_at`),
  CONSTRAINT `hr_activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_expense_types
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_expense_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_expense_types_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_reimbursements
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_reimbursements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `expense_type_id` bigint(20) unsigned NOT NULL,
  `is_bulk` tinyint(1) NOT NULL DEFAULT 0,
  `description` text NOT NULL,
  `purchased_date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `evidence_receipt_path` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `completed_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_reimbursements_user_id_foreign` (`user_id`),
  KEY `hr_reimbursements_expense_type_id_foreign` (`expense_type_id`),
  KEY `hr_reimbursements_reviewed_by_foreign` (`reviewed_by`),
  KEY `hr_reimbursements_completed_by_foreign` (`completed_by`),
  CONSTRAINT `hr_reimbursements_completed_by_foreign` FOREIGN KEY (`completed_by`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_reimbursements_expense_type_id_foreign` FOREIGN KEY (`expense_type_id`) REFERENCES `hr_expense_types` (`id`),
  CONSTRAINT `hr_reimbursements_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_reimbursements_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_incident_types
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_incident_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_incident_types_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_incidents
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_incidents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company` varchar(255) NOT NULL DEFAULT 'Luntian',
  `reported_by_user_id` bigint(20) unsigned NOT NULL,
  `employee_id` bigint(20) unsigned DEFAULT NULL,
  `employee_name` varchar(255) NOT NULL,
  `location_area` varchar(255) NOT NULL,
  `incident_date` date NOT NULL,
  `incident_time` time NOT NULL,
  `incident_type_id` bigint(20) unsigned NOT NULL,
  `details` text NOT NULL,
  `witness` varchar(255) DEFAULT NULL,
  `has_injury` tinyint(1) NOT NULL DEFAULT 0,
  `injury_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`injury_types`)),
  `injury_details` text DEFAULT NULL,
  `report_date` date NOT NULL,
  `report_time` time NOT NULL,
  `action_taken` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'submitted',
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_incidents_reported_by_user_id_foreign` (`reported_by_user_id`),
  KEY `hr_incidents_employee_id_foreign` (`employee_id`),
  KEY `hr_incidents_incident_type_id_foreign` (`incident_type_id`),
  KEY `hr_incidents_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `hr_incidents_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_incidents_incident_type_id_foreign` FOREIGN KEY (`incident_type_id`) REFERENCES `hr_incident_types` (`id`),
  CONSTRAINT `hr_incidents_reported_by_user_id_foreign` FOREIGN KEY (`reported_by_user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hr_incidents_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_incident_attachments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_incident_attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `incident_id` bigint(20) unsigned NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `size` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_incident_attachments_incident_id_foreign` (`incident_id`),
  CONSTRAINT `hr_incident_attachments_incident_id_foreign` FOREIGN KEY (`incident_id`) REFERENCES `hr_incidents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_leave_requests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_leave_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `days` int(10) unsigned NOT NULL DEFAULT 1,
  `reason` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_leave_requests_user_id_foreign` (`user_id`),
  KEY `hr_leave_requests_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `hr_leave_requests_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_leave_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_leave_request_activities
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_leave_request_activities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `leave_request_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_leave_request_activities_leave_request_id_foreign` (`leave_request_id`),
  KEY `hr_leave_request_activities_user_id_foreign` (`user_id`),
  CONSTRAINT `hr_leave_request_activities_leave_request_id_foreign` FOREIGN KEY (`leave_request_id`) REFERENCES `hr_leave_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hr_leave_request_activities_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_discipline_records
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_discipline_records` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `recorded_by_user_id` bigint(20) unsigned NOT NULL,
  `employee_id` bigint(20) unsigned NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `incident_date` date NOT NULL,
  `offense_type` varchar(255) NOT NULL,
  `discipline_level` varchar(255) NOT NULL,
  `incident_description` text NOT NULL,
  `action_taken` text DEFAULT NULL,
  `next_review_date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `counts_for_progress` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_discipline_records_recorded_by_user_id_foreign` (`recorded_by_user_id`),
  KEY `hr_discipline_records_employee_id_foreign` (`employee_id`),
  CONSTRAINT `hr_discipline_records_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `hr_employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hr_discipline_records_recorded_by_user_id_foreign` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_inventory_items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_inventory_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_inventory_items_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- hr_inventory_requests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_inventory_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `inventory_item_id` bigint(20) unsigned DEFAULT NULL,
  `item_code` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_inventory_requests_user_id_foreign` (`user_id`),
  KEY `hr_inventory_requests_inventory_item_id_foreign` (`inventory_item_id`),
  KEY `hr_inventory_requests_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `hr_inventory_requests_inventory_item_id_foreign` FOREIGN KEY (`inventory_item_id`) REFERENCES `hr_inventory_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_inventory_requests_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `hr_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hr_inventory_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `hr_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- hr_migrations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  SELECT 'Portable Monitor', 'PMO-', 14 UNION ALL
  SELECT 'Headset', 'HS-', 15
) AS v
WHERE NOT EXISTS (
  SELECT 1 FROM `hr_inventory_item_types` t
  WHERE t.name = v.name OR t.code_prefix = v.code_prefix
);

-- -----------------------------------------------------------------------------
-- Seed: inventory request categories (hr_inventory_items)
-- -----------------------------------------------------------------------------
INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-LAP-001', 'Laptop', 'Standard company laptop', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-LAP-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-MOU-001', 'Mouse', 'USB / wireless mouse', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-MOU-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-KEY-001', 'Keyboard', 'Standard keyboard', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-KEY-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-CHG-001', 'Charger', 'Device charger', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-CHG-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-PC-001', 'Power Cord', 'Power cable', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-PC-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-MON-001', 'Monitor', 'External display monitor', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-MON-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-PMON-001', 'Portable Monitor', 'Portable display', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-PMON-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-STAND-001', 'Laptop Stand', 'Laptop stand', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-STAND-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-SLEEVE-001', 'Laptop Sleeve', 'Laptop sleeve', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-SLEEVE-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-SBAG-001', 'Storage Bag', 'Storage bag', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-SBAG-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-BAG-001', 'Bag', 'Company bag', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-BAG-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-PHONE-001', 'Company Phone', 'Company mobile phone', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-PHONE-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-TBL-001', 'Table', 'Office table', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-TBL-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-MISC-001', 'Miscellaneous', 'Other inventory items', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-MISC-001');

INSERT INTO `hr_inventory_items` (`code`, `name`, `description`, `quantity`, `is_active`, `created_at`, `updated_at`)
SELECT 'IT-HS-001', 'Headset', 'Headset with microphone', 0, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `hr_inventory_items` WHERE `code` = 'IT-HS-001');

-- -----------------------------------------------------------------------------
-- Seed: employment types / statuses (if empty)
-- -----------------------------------------------------------------------------
INSERT INTO `hr_employment_types` (`name`, `is_active`, `sort_order`, `created_at`, `updated_at`)
SELECT v.name, 1, v.sort_order, NOW(), NOW() FROM (
  SELECT 'Regular' AS name, 1 AS sort_order UNION ALL
  SELECT 'Probationary', 2 UNION ALL
  SELECT 'Contractual', 3 UNION ALL
  SELECT 'Intern', 4
) AS v WHERE NOT EXISTS (SELECT 1 FROM `hr_employment_types` t WHERE t.name = v.name);

INSERT INTO `hr_employment_statuses` (`name`, `is_active`, `sort_order`, `created_at`, `updated_at`)
SELECT v.name, 1, v.sort_order, NOW(), NOW() FROM (
  SELECT 'Active' AS name, 1 AS sort_order UNION ALL
  SELECT 'Inactive', 2 UNION ALL
  SELECT 'Resigned', 3 UNION ALL
  SELECT 'Terminated', 4
) AS v WHERE NOT EXISTS (SELECT 1 FROM `hr_employment_statuses` t WHERE t.name = v.name);

-- -----------------------------------------------------------------------------
-- Record migrations
-- -----------------------------------------------------------------------------
SET @__batch := (SELECT COALESCE(MAX(batch), 0) + 1 FROM `hr_migrations`);
INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '0001_01_01_000000_create_users_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '0001_01_01_000000_create_users_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '0001_01_01_000001_create_cache_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '0001_01_01_000001_create_cache_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '0001_01_01_000002_create_jobs_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '0001_01_01_000002_create_jobs_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_26_133319_add_google_id_to_users_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_26_133319_add_google_id_to_users_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_26_135546_create_employees_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_26_135546_create_employees_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_26_153846_add_role_to_users_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_26_153846_add_role_to_users_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_26_154001_create_permissions_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_26_154001_create_permissions_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_26_154002_create_role_permission_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_26_154002_create_role_permission_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_26_234700_create_user_permission_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_26_234700_create_user_permission_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_003700_create_expense_types_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_003700_create_expense_types_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_003701_create_reimbursements_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_003701_create_reimbursements_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_010000_create_incident_types_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_010000_create_incident_types_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_010001_create_incidents_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_010001_create_incidents_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_010002_create_incident_attachments_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_010002_create_incident_attachments_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_092500_create_leave_requests_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_092500_create_leave_requests_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_092501_create_leave_request_activities_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_092501_create_leave_request_activities_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_100000_create_activity_logs_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_100000_create_activity_logs_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_102300_create_employment_types_and_statuses_tables', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_102300_create_employment_types_and_statuses_tables');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_103500_create_form_options_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_103500_create_form_options_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_112400_seed_department_form_options', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_112400_seed_department_form_options');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_114800_add_emergency_contact_relation_to_employees', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_114800_add_emergency_contact_relation_to_employees');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_120400_add_emergency_contact_address_to_employees', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_120400_add_emergency_contact_address_to_employees');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_121800_add_photo_path_to_employees_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_121800_add_photo_path_to_employees_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_123300_add_clearances_to_employees_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_123300_add_clearances_to_employees_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_132600_create_discipline_records_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_132600_create_discipline_records_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_132601_seed_discipline_level_form_options', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_132601_seed_discipline_level_form_options');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_133200_add_review_fields_to_incidents_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_133200_add_review_fields_to_incidents_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_143000_create_inventory_tables', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_143000_create_inventory_tables');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_150000_add_review_fields_to_reimbursements_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_150000_add_review_fields_to_reimbursements_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_27_235900_add_status_to_discipline_records_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_27_235900_add_status_to_discipline_records_table');

INSERT INTO `hr_migrations` (`migration`, `batch`)
SELECT '2026_08_28_000100_add_evidence_and_completed_to_reimbursements_table', @__batch
WHERE NOT EXISTS (SELECT 1 FROM `hr_migrations` WHERE `migration` = '2026_08_28_000100_add_evidence_and_completed_to_reimbursements_table');

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

-- -----------------------------------------------------------------------------
-- Default admin (email/password login)
-- Email: admin@luntiands.com  Password: LuntianAdmin@2026
-- -----------------------------------------------------------------------------
INSERT INTO `hr_users` (`name`, `email`, `role`, `password`, `email_verified_at`, `created_at`, `updated_at`)
SELECT
  'Luntian Admin',
  'admin@luntiands.com',
  'admin',
  '$2y$10$/ZbQbohz/ATvdV.SKqJZ9.6qSUirsLDI3cm9euWj462gft61r3tmW',
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `hr_users` WHERE `email` = 'admin@luntiands.com'
);

-- Done. Select database u501101592_luntian first, then run this whole file.
-- On server also run: php artisan db:seed --class=DefaultAdminSeeder
-- (syncs admin permissions). Then: php artisan optimize:clear
