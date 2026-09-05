<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmploymentStatusRequest;
use App\Http\Requests\StoreEmploymentTypeRequest;
use App\Http\Requests\StoreExpenseTypeRequest;
use App\Http\Requests\StoreFormOptionRequest;
use App\Http\Requests\StoreIncidentTypeRequest;
use App\Http\Requests\UpdateEmploymentStatusRequest;
use App\Http\Requests\UpdateEmploymentTypeRequest;
use App\Http\Requests\UpdateExpenseTypeRequest;
use App\Http\Requests\UpdateFormOptionRequest;
use App\Http\Requests\UpdateIncidentTypeRequest;
use App\Models\DisciplineRecord;
use App\Models\Employee;
use App\Models\EmploymentStatus;
use App\Models\EmploymentType;
use App\Models\ExpenseType;
use App\Models\FormOption;
use App\Models\Incident;
use App\Models\IncidentType;
use App\Models\LeaveRequest;
use App\Services\ActivityLogger;
use App\Support\FormOptionRegistry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FormSetupController extends Controller
{
    public function index(): Response
    {
        $formOptions = [];

        foreach (FormOptionRegistry::keys() as $category) {
            $formOptions[$category] = FormOption::query()
                ->category($category)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'category', 'name', 'is_active', 'sort_order', 'created_at']);
        }

        return Inertia::render('Settings/FormSetup', [
            'expenseTypes' => ExpenseType::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'is_active', 'sort_order', 'created_at']),
            'incidentTypes' => IncidentType::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'is_active', 'sort_order', 'created_at']),
            'employmentTypes' => EmploymentType::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'is_active', 'sort_order', 'created_at']),
            'employmentStatuses' => EmploymentStatus::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'is_active', 'sort_order', 'created_at']),
            'formOptions' => $formOptions,
            'formOptionCategories' => collect(FormOptionRegistry::categories())
                ->map(fn (array $meta, string $key) => [
                    'key' => $key,
                    'label' => $meta['label'],
                    'description' => $meta['description'],
                ])
                ->values(),
        ]);
    }

    public function storeExpenseType(StoreExpenseTypeRequest $request): RedirectResponse
    {
        $expenseType = ExpenseType::query()->create($request->validated());

        ActivityLogger::log(
            'Form Set Up',
            'created',
            'Added expense type "'.$expenseType->name.'"',
            $expenseType,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Expense type added.');
    }

    public function updateExpenseType(UpdateExpenseTypeRequest $request, ExpenseType $expenseType): RedirectResponse
    {
        $expenseType->update($request->validated());

        ActivityLogger::log(
            'Form Set Up',
            'updated',
            'Updated expense type "'.$expenseType->name.'"',
            $expenseType,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Expense type updated.');
    }

    public function destroyExpenseType(ExpenseType $expenseType): RedirectResponse
    {
        if ($expenseType->reimbursements()->exists()) {
            return redirect()
                ->route('settings.form-setup')
                ->with('error', 'Cannot delete expense type that is used in reimbursements.');
        }

        $name = $expenseType->name;
        $expenseType->delete();

        ActivityLogger::log(
            'Form Set Up',
            'deleted',
            'Deleted expense type "'.$name.'"',
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Expense type deleted.');
    }

    public function storeIncidentType(StoreIncidentTypeRequest $request): RedirectResponse
    {
        $incidentType = IncidentType::query()->create($request->validated());

        ActivityLogger::log(
            'Form Set Up',
            'created',
            'Added incident type "'.$incidentType->name.'"',
            $incidentType,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Incident type added.');
    }

    public function updateIncidentType(UpdateIncidentTypeRequest $request, IncidentType $incidentType): RedirectResponse
    {
        $incidentType->update($request->validated());

        ActivityLogger::log(
            'Form Set Up',
            'updated',
            'Updated incident type "'.$incidentType->name.'"',
            $incidentType,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Incident type updated.');
    }

    public function destroyIncidentType(IncidentType $incidentType): RedirectResponse
    {
        if ($incidentType->incidents()->exists()) {
            return redirect()
                ->route('settings.form-setup')
                ->with('error', 'Cannot delete incident type that is used in reports.');
        }

        $name = $incidentType->name;
        $incidentType->delete();

        ActivityLogger::log(
            'Form Set Up',
            'deleted',
            'Deleted incident type "'.$name.'"',
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Incident type deleted.');
    }

    public function storeEmploymentType(StoreEmploymentTypeRequest $request): RedirectResponse
    {
        $employmentType = EmploymentType::query()->create($request->validated());

        ActivityLogger::log(
            'Form Set Up',
            'created',
            'Added employment type "'.$employmentType->name.'"',
            $employmentType,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Employment type added.');
    }

    public function updateEmploymentType(UpdateEmploymentTypeRequest $request, EmploymentType $employmentType): RedirectResponse
    {
        $oldName = $employmentType->name;
        $employmentType->update($request->validated());

        if ($oldName !== $employmentType->name) {
            Employee::query()
                ->where('employment_type', $oldName)
                ->update(['employment_type' => $employmentType->name]);
        }

        ActivityLogger::log(
            'Form Set Up',
            'updated',
            'Updated employment type "'.$employmentType->name.'"',
            $employmentType,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Employment type updated.');
    }

    public function destroyEmploymentType(EmploymentType $employmentType): RedirectResponse
    {
        if (Employee::query()->where('employment_type', $employmentType->name)->exists()) {
            return redirect()
                ->route('settings.form-setup')
                ->with('error', 'Cannot delete employment type that is used by employees.');
        }

        $name = $employmentType->name;
        $employmentType->delete();

        ActivityLogger::log(
            'Form Set Up',
            'deleted',
            'Deleted employment type "'.$name.'"',
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Employment type deleted.');
    }

    public function storeEmploymentStatus(StoreEmploymentStatusRequest $request): RedirectResponse
    {
        $employmentStatus = EmploymentStatus::query()->create($request->validated());

        ActivityLogger::log(
            'Form Set Up',
            'created',
            'Added employment status "'.$employmentStatus->name.'"',
            $employmentStatus,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Employment status added.');
    }

    public function updateEmploymentStatus(UpdateEmploymentStatusRequest $request, EmploymentStatus $employmentStatus): RedirectResponse
    {
        $oldName = $employmentStatus->name;
        $employmentStatus->update($request->validated());

        if ($oldName !== $employmentStatus->name) {
            Employee::query()
                ->where('employment_status', $oldName)
                ->update(['employment_status' => $employmentStatus->name]);
        }

        ActivityLogger::log(
            'Form Set Up',
            'updated',
            'Updated employment status "'.$employmentStatus->name.'"',
            $employmentStatus,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Employment status updated.');
    }

    public function destroyEmploymentStatus(EmploymentStatus $employmentStatus): RedirectResponse
    {
        if (Employee::query()->where('employment_status', $employmentStatus->name)->exists()) {
            return redirect()
                ->route('settings.form-setup')
                ->with('error', 'Cannot delete employment status that is used by employees.');
        }

        $name = $employmentStatus->name;
        $employmentStatus->delete();

        ActivityLogger::log(
            'Form Set Up',
            'deleted',
            'Deleted employment status "'.$name.'"',
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Employment status deleted.');
    }

    public function storeFormOption(StoreFormOptionRequest $request, string $category): RedirectResponse
    {
        $option = FormOption::query()->create([
            ...$request->validated(),
            'category' => $category,
        ]);

        $label = FormOptionRegistry::categories()[$category]['label'] ?? $category;

        ActivityLogger::log(
            'Form Set Up',
            'created',
            'Added '.$label.' "'.$option->name.'"',
            $option,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', $label.' added.');
    }

    public function updateFormOption(
        UpdateFormOptionRequest $request,
        string $category,
        FormOption $formOption,
    ): RedirectResponse {
        abort_unless($formOption->category === $category, 404);

        $oldName = $formOption->name;
        $formOption->update($request->validated());

        if ($oldName !== $formOption->name) {
            $this->renameOptionUsages($category, $oldName, $formOption->name);
        }

        $label = FormOptionRegistry::categories()[$category]['label'] ?? $category;

        ActivityLogger::log(
            'Form Set Up',
            'updated',
            'Updated '.$label.' "'.$formOption->name.'"',
            $formOption,
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', $label.' updated.');
    }

    public function destroyFormOption(string $category, FormOption $formOption): RedirectResponse
    {
        abort_unless($formOption->category === $category, 404);

        if ($this->optionIsInUse($category, $formOption->name)) {
            $label = FormOptionRegistry::categories()[$category]['label'] ?? $category;

            return redirect()
                ->route('settings.form-setup')
                ->with('error', 'Cannot delete '.$label.' that is already in use.');
        }

        $name = $formOption->name;
        $label = FormOptionRegistry::categories()[$category]['label'] ?? $category;
        $formOption->delete();

        ActivityLogger::log(
            'Form Set Up',
            'deleted',
            'Deleted '.$label.' "'.$name.'"',
        );

        return redirect()
            ->route('settings.form-setup')
            ->with('success', $label.' deleted.');
    }

    private function renameOptionUsages(string $category, string $oldName, string $newName): void
    {
        match ($category) {
            'gender' => Employee::query()->where('gender', $oldName)->update(['gender' => $newName]),
            'civil_status' => Employee::query()->where('civil_status', $oldName)->update(['civil_status' => $newName]),
            'department' => Employee::query()->where('department', $oldName)->update(['department' => $newName]),
            'emergency_contact_relation' => Employee::query()->where('emergency_contact_relation', $oldName)->update(['emergency_contact_relation' => $newName]),
            'leave_type' => LeaveRequest::query()->where('leave_type', $oldName)->update(['leave_type' => $newName]),
            'injury_type' => Incident::query()
                ->whereJsonContains('injury_types', $oldName)
                ->get()
                ->each(function (Incident $incident) use ($oldName, $newName) {
                    $types = collect($incident->injury_types ?? [])
                        ->map(fn ($type) => $type === $oldName ? $newName : $type)
                        ->values()
                        ->all();

                    $incident->update(['injury_types' => $types]);
                }),
            'discipline_level' => DisciplineRecord::query()
                ->where('discipline_level', $oldName)
                ->update(['discipline_level' => $newName]),
            default => null,
        };
    }

    private function optionIsInUse(string $category, string $name): bool
    {
        return match ($category) {
            'gender' => Employee::query()->where('gender', $name)->exists(),
            'civil_status' => Employee::query()->where('civil_status', $name)->exists(),
            'department' => Employee::query()->where('department', $name)->exists(),
            'emergency_contact_relation' => Employee::query()->where('emergency_contact_relation', $name)->exists(),
            'leave_type' => LeaveRequest::query()->where('leave_type', $name)->exists(),
            'injury_type' => Incident::query()->whereJsonContains('injury_types', $name)->exists(),
            'discipline_level' => DisciplineRecord::query()->where('discipline_level', $name)->exists(),
            default => false,
        };
    }
}
