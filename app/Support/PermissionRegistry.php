<?php

namespace App\Support;

class PermissionRegistry
{
    /**
     * Central list of all buttons/features that need permission checks.
     * Add new buttons here whenever we create them.
     *
     * @return list<array{key: string, label: string, group: string, description?: string}>
     */
    public static function definitions(): array
    {
        return [
            [
                'key' => 'dashboard.view',
                'label' => 'View Dashboard',
                'group' => 'Dashboard',
                'description' => 'Access the dashboard page',
            ],
            [
                'key' => 'me.view',
                'label' => 'View Me',
                'group' => 'Overview',
                'description' => 'View your own HR employee profile details',
            ],
            [
                'key' => 'activity_log.view',
                'label' => 'View Activity Log',
                'group' => 'Settings',
                'description' => 'Open system-wide activity log (employees see own actions)',
            ],
            [
                'key' => 'employees.view',
                'label' => 'View Employees',
                'group' => 'Employees',
                'description' => 'Open Employees data table',
            ],
            [
                'key' => 'employees.create',
                'label' => 'Add Employee button',
                'group' => 'Employees',
                'description' => 'Show and use + Add employee button',
            ],
            [
                'key' => 'employees.edit',
                'label' => 'Edit Employee button',
                'group' => 'Employees',
                'description' => 'Show and use Edit button on employee rows',
            ],
            [
                'key' => 'attendance.view',
                'label' => 'View Attendance',
                'group' => 'Attendance',
                'description' => 'Access Attendance module',
            ],
            [
                'key' => 'leave.request',
                'label' => 'Leave Request',
                'group' => 'Leave',
                'description' => 'Employee leave request page',
            ],
            [
                'key' => 'leave.credits',
                'label' => 'Leave Credits',
                'group' => 'Leave',
                'description' => 'View leave credit balances',
            ],
            [
                'key' => 'leave.approvals',
                'label' => 'Leave for Approval',
                'group' => 'Leave',
                'description' => 'Approve/reject pending leave requests (datatable)',
            ],
            [
                'key' => 'leave.history',
                'label' => 'Leave History',
                'group' => 'Leave',
                'description' => 'View past leave requests and outcomes',
            ],
            [
                'key' => 'reimburse.review',
                'label' => 'For Review Reimbursement',
                'group' => 'Reimburse',
                'description' => 'Review pending reimbursement requests',
            ],
            [
                'key' => 'reimburse.create',
                'label' => 'Reimbursement Request',
                'group' => 'Reimburse',
                'description' => 'Submit reimbursement request form',
            ],
            [
                'key' => 'reimburse.list',
                'label' => 'List of Reimbursement',
                'group' => 'Reimburse',
                'description' => 'Browse reimbursement records',
            ],
            [
                'key' => 'reimburse.report',
                'label' => 'Report of Reimbursement',
                'group' => 'Reimburse',
                'description' => 'View reimbursement reports',
            ],
            [
                'key' => 'discipline.view',
                'label' => 'Progressive Discipline',
                'group' => 'Discipline',
                'description' => 'View progressive discipline records (employees see their own)',
            ],
            [
                'key' => 'discipline.create',
                'label' => 'Add Discipline Record',
                'group' => 'Discipline',
                'description' => 'Add progressive discipline records',
            ],
            [
                'key' => 'discipline.manage',
                'label' => 'Manage Discipline Records',
                'group' => 'Discipline',
                'description' => 'View all discipline records in the organization',
            ],
            [
                'key' => 'incident.view',
                'label' => 'View Incident Reports',
                'group' => 'Incident',
                'description' => 'Open Incident Report list',
            ],
            [
                'key' => 'incident.create',
                'label' => 'Submit Incident Report',
                'group' => 'Incident',
                'description' => 'Fill out and submit incident report form',
            ],
            [
                'key' => 'incident.manage',
                'label' => 'Manage / Approve Incident Reports',
                'group' => 'Incident',
                'description' => 'Approve or reject pending reports and manage all incident records',
            ],
            [
                'key' => 'performance.view',
                'label' => 'View Performance Reviews',
                'group' => 'Performance',
                'description' => 'Open Performance Review list and view review details',
            ],
            [
                'key' => 'performance.create',
                'label' => 'Conduct Performance Review',
                'group' => 'Performance',
                'description' => 'Fill out and submit performance reviews for employees',
            ],
            [
                'key' => 'performance.manage',
                'label' => 'Manage Performance Reviews',
                'group' => 'Performance',
                'description' => 'View all performance reviews across the organization',
            ],
            [
                'key' => 'inventory.summary',
                'label' => 'Inventory Summary',
                'group' => 'Inventory',
                'description' => 'View inventory overview totals by category',
            ],
            [
                'key' => 'inventory.items',
                'label' => 'List of my items',
                'group' => 'Inventory',
                'description' => 'View inventory items allocated to you (or all items if manage)',
            ],
            [
                'key' => 'inventory.manage',
                'label' => 'Manage inventory items',
                'group' => 'Inventory',
                'description' => 'View all inventory assets and add new items',
            ],
            [
                'key' => 'inventory.request',
                'label' => 'Request item',
                'group' => 'Inventory',
                'description' => 'Request new inventory items',
            ],
            [
                'key' => 'inventory.approvals',
                'label' => 'Item for Approval',
                'group' => 'Inventory',
                'description' => 'Approve or decline pending inventory item requests',
            ],
            [
                'key' => 'inventory.decommission',
                'label' => 'Decommission Request',
                'group' => 'Inventory',
                'description' => 'Request item decommission',
            ],
            [
                'key' => 'inventory.settings',
                'label' => 'Inventory Setting',
                'group' => 'Inventory',
                'description' => 'Manage item description codes used for inventory Item IDs',
            ],
            [
                'key' => 'settings.account.view',
                'label' => 'View Account settings',
                'group' => 'Settings',
                'description' => 'See Google Workspace synced emails',
            ],
            [
                'key' => 'settings.role.update',
                'label' => 'Change account role',
                'group' => 'Settings',
                'description' => 'Use role dropdown on Account page',
            ],
            [
                'key' => 'settings.permissions.view',
                'label' => 'View Permissions',
                'group' => 'Settings',
                'description' => 'Open Permissions settings page',
            ],
            [
                'key' => 'settings.permissions.update',
                'label' => 'Edit Permissions',
                'group' => 'Settings',
                'description' => 'Check/uncheck permission boxes per account',
            ],
            [
                'key' => 'settings.form_setup.view',
                'label' => 'View Form Set Up',
                'group' => 'Settings',
                'description' => 'Open Form Set Up settings page',
            ],
            [
                'key' => 'settings.form_setup.manage',
                'label' => 'Manage Form Set Up',
                'group' => 'Settings',
                'description' => 'Add, edit, and delete form dropdown options',
            ],
            [
                'key' => 'profile.view',
                'label' => 'View Profile',
                'group' => 'Profile',
                'description' => 'Access Profile page',
            ],
            [
                'key' => 'profile.update',
                'label' => 'Update Profile',
                'group' => 'Profile',
                'description' => 'Edit profile and password',
            ],
        ];
    }

    /**
     * Default permissions granted to each role.
     *
     * @return array<string, list<string>>
     */
    public static function defaultRoleMap(): array
    {
        $all = collect(self::definitions())->pluck('key')->all();

        return [
            'admin' => $all,
            'hr' => [
                'dashboard.view',
                'me.view',
                'activity_log.view',
                'employees.view',
                'employees.create',
                'employees.edit',
                'attendance.view',
                'leave.request',
                'leave.credits',
                'leave.approvals',
                'leave.history',
                'reimburse.review',
                'reimburse.create',
                'reimburse.list',
                'reimburse.report',
                'discipline.view',
                'discipline.create',
                'discipline.manage',
                'incident.view',
                'incident.create',
                'incident.manage',
                'performance.view',
                'performance.create',
                'performance.manage',
                'inventory.summary',
                'inventory.items',
                'inventory.manage',
                'inventory.request',
                'inventory.approvals',
                'inventory.decommission',
                'inventory.settings',
                'settings.account.view',
                'settings.role.update',
                'settings.permissions.view',
                'settings.form_setup.view',
                'settings.form_setup.manage',
                'profile.view',
                'profile.update',
            ],
            'manager' => [
                'dashboard.view',
                'me.view',
                'activity_log.view',
                'employees.view',
                'attendance.view',
                'leave.request',
                'leave.credits',
                'leave.approvals',
                'leave.history',
                'reimburse.review',
                'reimburse.create',
                'reimburse.list',
                'reimburse.report',
                'discipline.view',
                'discipline.create',
                'discipline.manage',
                'incident.view',
                'incident.create',
                'incident.manage',
                'performance.view',
                'performance.create',
                'inventory.summary',
                'inventory.items',
                'inventory.manage',
                'inventory.request',
                'inventory.approvals',
                'inventory.decommission',
                'inventory.settings',
                'profile.view',
                'profile.update',
            ],
            'employee' => [
                'dashboard.view',
                'me.view',
                'activity_log.view',
                'leave.request',
                'leave.credits',
                'leave.history',
                'reimburse.create',
                'reimburse.list',
                'discipline.view',
                'incident.view',
                'incident.create',
                'performance.view',
                'inventory.summary',
                'inventory.items',
                'inventory.request',
                'inventory.decommission',
                'profile.view',
                'profile.update',
            ],
        ];
    }
}
