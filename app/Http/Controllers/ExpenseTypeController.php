<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseTypeRequest;
use App\Http\Requests\UpdateExpenseTypeRequest;
use App\Models\ExpenseType;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseTypeController extends Controller
{
    public function index(): Response
    {
        $expenseTypes = ExpenseType::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'is_active', 'sort_order', 'created_at']);

        return Inertia::render('Settings/FormSetup', [
            'expenseTypes' => $expenseTypes,
        ]);
    }

    public function store(StoreExpenseTypeRequest $request): RedirectResponse
    {
        ExpenseType::query()->create($request->validated());

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Expense type added.');
    }

    public function update(UpdateExpenseTypeRequest $request, ExpenseType $expenseType): RedirectResponse
    {
        $expenseType->update($request->validated());

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Expense type updated.');
    }

    public function destroy(ExpenseType $expenseType): RedirectResponse
    {
        if ($expenseType->reimbursements()->exists()) {
            return redirect()
                ->route('settings.form-setup')
                ->with('error', 'Cannot delete expense type that is used in reimbursements.');
        }

        $expenseType->delete();

        return redirect()
            ->route('settings.form-setup')
            ->with('success', 'Expense type deleted.');
    }
}
