-- =============================================================================
-- Default admin for Hostinger DB (u501101592_luntian)
-- Run in phpMyAdmin AFTER schema exists.
-- =============================================================================
-- Login (email / password):
--   Email:    admin@luntiands.com
--   Password: LuntianAdmin@2026
-- Change this password after first login.
--
-- Preferred on server (also syncs permissions):
--   php artisan hr:bootstrap-admin
--   php artisan optimize:clear
-- =============================================================================

SET NAMES utf8mb4;

-- Create if missing
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

-- Always reset password/role if the row already exists (e.g. created via Google
-- with a random password that blocks documented email/password login).
UPDATE `hr_users`
SET
  `name` = 'Luntian Admin',
  `role` = 'admin',
  `password` = '$2y$10$/ZbQbohz/ATvdV.SKqJZ9.6qSUirsLDI3cm9euWj462gft61r3tmW',
  `email_verified_at` = COALESCE(`email_verified_at`, NOW()),
  `updated_at` = NOW()
WHERE `email` = 'admin@luntiands.com';

-- Note: for full permission sync, run on server:
--   php artisan hr:bootstrap-admin
