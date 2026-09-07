-- =============================================================================
-- Default admin for fresh DB (u501101592_luntian)
-- Run AFTER one_run_full_hostinger.sql  (or run via artisan seeder — preferred)
-- =============================================================================
-- Login (email / password):
--   Email:    admin@luntiands.com
--   Password: LuntianAdmin@2026
-- Change this password after first login.
--
-- Preferred on server:
--   php artisan db:seed --class=DefaultAdminSeeder
-- =============================================================================

SET NAMES utf8mb4;

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

-- Note: permissions are synced when admin first logs in via Google,
-- or run: php artisan db:seed --class=DefaultAdminSeeder
