<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ComingSoonController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DisciplineController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\FormSetupController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\InventoryAssetController;
use App\Http\Controllers\InventoryRequestController;
use App\Http\Controllers\InventorySettingController;
use App\Http\Controllers\InventorySummaryController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\MeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PerformanceReviewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReimbursementController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/me', [MeController::class, 'show'])->name('me.show');

    Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');

    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');

    Route::get('/attendance', [AttendanceController::class, 'index'])
        ->name('attendance.index');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])
        ->name('attendance.clock-in');

    Route::get('/leave/request', [LeaveController::class, 'requestForm'])->name('leave.request');
    Route::get('/leave/request/create', [LeaveController::class, 'create'])->name('leave.create');
    Route::post('/leave/request', [LeaveController::class, 'store'])->name('leave.store');
    Route::post('/leave/request/{leaveRequest}/cancel', [LeaveController::class, 'cancel'])->name('leave.cancel');

    Route::get('/leave/approvals', [LeaveController::class, 'approvals'])->name('leave.approvals');
    Route::post('/leave/approvals/{leaveRequest}/status', [LeaveController::class, 'updateStatus'])->name('leave.status');

    Route::get('/leave/history', [LeaveController::class, 'history'])->name('leave.history');

    Route::get('/reimburse/create', [ReimbursementController::class, 'create'])->name('reimburse.create');
    Route::post('/reimburse', [ReimbursementController::class, 'store'])->name('reimburse.store');
    Route::get('/reimburse/review', [ReimbursementController::class, 'review'])->name('reimburse.review');
    Route::post('/reimburse/{reimbursement}/status', [ReimbursementController::class, 'updateStatus'])
        ->name('reimburse.status');
    Route::post('/reimburse/{reimbursement}/evidence', [ReimbursementController::class, 'attachEvidence'])
        ->name('reimburse.evidence');
    Route::get('/reimburse/list', [ReimbursementController::class, 'index'])->name('reimburse.list');
    Route::get('/reimburse/report', [ReimbursementController::class, 'report'])->name('reimburse.report');

    Route::get('/discipline', [DisciplineController::class, 'index'])->name('discipline.index');
    Route::get('/discipline/create', [DisciplineController::class, 'create'])->name('discipline.create');
    Route::post('/discipline', [DisciplineController::class, 'store'])->name('discipline.store');
    Route::post('/discipline/employees/{employee}/reset-progress', [DisciplineController::class, 'resetProgress'])
        ->name('discipline.reset');
    Route::get('/discipline/{discipline}', [DisciplineController::class, 'show'])->name('discipline.show');
    Route::post('/discipline/{discipline}/status', [DisciplineController::class, 'updateStatus'])
        ->name('discipline.status');

    Route::get('/incident-report', [IncidentController::class, 'index'])->name('incident.index');
    Route::get('/incident-report/approvals', [IncidentController::class, 'approvals'])->name('incident.approvals');
    Route::post('/incident-report/{incident}/status', [IncidentController::class, 'updateStatus'])->name('incident.status');
    Route::get('/incident-report/create', [IncidentController::class, 'create'])->name('incident.create');
    Route::post('/incident-report', [IncidentController::class, 'store'])->name('incident.store');
    Route::get('/incident-report/{incident}', [IncidentController::class, 'show'])->name('incident.show');
    Route::delete('/incident-report/{incident}', [IncidentController::class, 'destroy'])->name('incident.destroy');

    Route::get('/performance-review', [PerformanceReviewController::class, 'index'])
        ->name('performance.index');
    Route::get('/performance-review/create', [PerformanceReviewController::class, 'create'])
        ->name('performance.create');
    Route::post('/performance-review', [PerformanceReviewController::class, 'store'])
        ->name('performance.store');
    Route::get('/performance-review/{performance}', [PerformanceReviewController::class, 'show'])
        ->name('performance.show');

    Route::get('/inventory/summary', [InventorySummaryController::class, 'index'])
        ->name('inventory.summary');

    Route::get('/inventory/my-items', [InventoryAssetController::class, 'index'])
        ->name('inventory.items');
    Route::get('/inventory/my-items/export', [InventoryAssetController::class, 'export'])
        ->name('inventory.items.export');
    Route::get('/inventory/my-items/create', [InventoryAssetController::class, 'create'])
        ->name('inventory.items.create');
    Route::post('/inventory/my-items', [InventoryAssetController::class, 'store'])
        ->name('inventory.items.store');
    Route::get('/inventory/my-items/{asset}/print', [InventoryAssetController::class, 'printLabel'])
        ->name('inventory.items.print');
    Route::get('/inventory/my-items/{asset}/edit', [InventoryAssetController::class, 'edit'])
        ->name('inventory.items.edit');
    Route::put('/inventory/my-items/{asset}', [InventoryAssetController::class, 'update'])
        ->name('inventory.items.update');
    Route::delete('/inventory/my-items/{asset}', [InventoryAssetController::class, 'destroy'])
        ->name('inventory.items.destroy');
    Route::get('/inventory/my-items/{asset}', [InventoryAssetController::class, 'show'])
        ->name('inventory.items.show');

    Route::get('/inventory/settings', [InventorySettingController::class, 'index'])
        ->name('inventory.settings');
    Route::post('/inventory/settings', [InventorySettingController::class, 'store'])
        ->name('inventory.settings.store');
    Route::put('/inventory/settings/{inventoryItemType}', [InventorySettingController::class, 'update'])
        ->name('inventory.settings.update');
    Route::delete('/inventory/settings/{inventoryItemType}', [InventorySettingController::class, 'destroy'])
        ->name('inventory.settings.destroy');

    Route::get('/inventory/request', [InventoryRequestController::class, 'index'])
        ->name('inventory.request');
    Route::get('/inventory/request/create', [InventoryRequestController::class, 'create'])
        ->name('inventory.request.create');
    Route::post('/inventory/request', [InventoryRequestController::class, 'store'])
        ->name('inventory.request.store');
    Route::get('/inventory/request/approvals', [InventoryRequestController::class, 'approvals'])
        ->name('inventory.approvals');
    Route::post('/inventory/request/{inventoryRequest}/status', [InventoryRequestController::class, 'updateStatus'])
        ->name('inventory.request.status');

    Route::get('/inventory/decommission', [ComingSoonController::class, 'inventoryDecommission'])
        ->name('inventory.decommission');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::patch('/settings/users/{user}/role', [SettingsController::class, 'updateRole'])
        ->name('settings.role.update');
    Route::get('/settings/permissions', [PermissionController::class, 'index'])
        ->name('settings.permissions');
    Route::put('/settings/permissions', [PermissionController::class, 'update'])
        ->name('settings.permissions.update');
    Route::get('/settings/form-setup', [FormSetupController::class, 'index'])
        ->name('settings.form-setup');
    Route::post('/settings/form-setup/expense-types', [FormSetupController::class, 'storeExpenseType'])
        ->name('settings.form-setup.expense-types.store');
    Route::put('/settings/form-setup/expense-types/{expenseType}', [FormSetupController::class, 'updateExpenseType'])
        ->name('settings.form-setup.expense-types.update');
    Route::delete('/settings/form-setup/expense-types/{expenseType}', [FormSetupController::class, 'destroyExpenseType'])
        ->name('settings.form-setup.expense-types.destroy');
    Route::post('/settings/form-setup/incident-types', [FormSetupController::class, 'storeIncidentType'])
        ->name('settings.form-setup.incident-types.store');
    Route::put('/settings/form-setup/incident-types/{incidentType}', [FormSetupController::class, 'updateIncidentType'])
        ->name('settings.form-setup.incident-types.update');
    Route::delete('/settings/form-setup/incident-types/{incidentType}', [FormSetupController::class, 'destroyIncidentType'])
        ->name('settings.form-setup.incident-types.destroy');
    Route::post('/settings/form-setup/employment-types', [FormSetupController::class, 'storeEmploymentType'])
        ->name('settings.form-setup.employment-types.store');
    Route::put('/settings/form-setup/employment-types/{employmentType}', [FormSetupController::class, 'updateEmploymentType'])
        ->name('settings.form-setup.employment-types.update');
    Route::delete('/settings/form-setup/employment-types/{employmentType}', [FormSetupController::class, 'destroyEmploymentType'])
        ->name('settings.form-setup.employment-types.destroy');
    Route::post('/settings/form-setup/employment-statuses', [FormSetupController::class, 'storeEmploymentStatus'])
        ->name('settings.form-setup.employment-statuses.store');
    Route::put('/settings/form-setup/employment-statuses/{employmentStatus}', [FormSetupController::class, 'updateEmploymentStatus'])
        ->name('settings.form-setup.employment-statuses.update');
    Route::delete('/settings/form-setup/employment-statuses/{employmentStatus}', [FormSetupController::class, 'destroyEmploymentStatus'])
        ->name('settings.form-setup.employment-statuses.destroy');
    Route::post('/settings/form-setup/options/{category}', [FormSetupController::class, 'storeFormOption'])
        ->name('settings.form-setup.options.store');
    Route::put('/settings/form-setup/options/{category}/{formOption}', [FormSetupController::class, 'updateFormOption'])
        ->name('settings.form-setup.options.update');
    Route::delete('/settings/form-setup/options/{category}/{formOption}', [FormSetupController::class, 'destroyFormOption'])
        ->name('settings.form-setup.options.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
