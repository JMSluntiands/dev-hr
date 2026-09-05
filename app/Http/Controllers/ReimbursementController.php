<?php

namespace App\Http\Controllers;

use App\Http\Requests\AttachReimbursementEvidenceRequest;
use App\Http\Requests\StoreReimbursementRequest;
use App\Http\Requests\UpdateReimbursementStatusRequest;
use App\Models\ExpenseType;
use App\Models\Reimbursement;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReimbursementController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'reimburse.list'), 403);

        $canReview = $this->permissions->userHas($user, 'reimburse.review');

        // Employee: own requests. Reviewer: all (approve/decline pending rows).
        $reimbursements = Reimbursement::query()
            ->with(['expenseType:id,name', 'user:id,name,email'])
            ->when(! $canReview, fn ($query) => $query->where('user_id', $user->id))
            ->latest()
            ->get()
            ->map(fn (Reimbursement $item) => $this->mapReimbursement($item));

        return Inertia::render('Reimburse/Index', [
            'reimbursements' => $reimbursements,
            'canReview' => $canReview,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'reimburse.create'), 403);

        $expenseTypes = ExpenseType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Reimburse/Create', [
            'expenseTypes' => $expenseTypes,
        ]);
    }

    public function store(StoreReimbursementRequest $request): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'reimburse.create'), 403);

        $validated = $request->validated();
        $receiptPath = null;

        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        $reimbursement = Reimbursement::query()->create([
            'user_id' => $request->user()->id,
            'expense_type_id' => $validated['expense_type_id'],
            'is_bulk' => $validated['is_bulk'] ?? false,
            'description' => $validated['description'],
            'purchased_date' => $validated['purchased_date'],
            'amount' => $validated['amount'],
            'notes' => $validated['notes'] ?? null,
            'receipt_path' => $receiptPath,
            'status' => 'pending',
        ]);

        ActivityLogger::log(
            'Reimburse',
            'submitted',
            'Submitted reimbursement of '.number_format((float) $reimbursement->amount, 2),
            $reimbursement,
            [
                'amount' => $reimbursement->amount,
                'expense_type_id' => $reimbursement->expense_type_id,
            ],
        );

        return redirect()
            ->route('reimburse.list')
            ->with('success', 'Reimbursement submitted successfully.');
    }

    public function review(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'reimburse.review'), 403);

        $forReceipt = Reimbursement::query()
            ->with(['expenseType:id,name', 'user:id,name,email'])
            ->where('status', 'for_receipt')
            ->latest()
            ->get()
            ->map(fn (Reimbursement $item) => $this->mapReimbursement($item));

        $completed = Reimbursement::query()
            ->with(['expenseType:id,name', 'user:id,name,email'])
            ->where('status', 'completed')
            ->latest('completed_at')
            ->get()
            ->map(fn (Reimbursement $item) => $this->mapReimbursement($item));

        return Inertia::render('Reimburse/Review', [
            'forReceipt' => $forReceipt,
            'completed' => $completed,
        ]);
    }

    public function updateStatus(
        UpdateReimbursementStatusRequest $request,
        Reimbursement $reimbursement,
    ): RedirectResponse {
        abort_unless($this->permissions->userHas($request->user(), 'reimburse.review'), 403);

        if ($reimbursement->status !== 'pending') {
            return back()->with('error', 'Only pending reimbursements can be reviewed.');
        }

        $validated = $request->validated();
        $status = $validated['status'] === 'approved' ? 'for_receipt' : 'rejected';

        $reimbursement->update([
            'status' => $status,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $validated['review_notes'] ?? null,
        ]);

        ActivityLogger::log(
            'Reimburse',
            $status,
            ($status === 'for_receipt' ? 'Approved' : 'Declined').' reimbursement of '.number_format((float) $reimbursement->amount, 2),
            $reimbursement,
            [
                'amount' => $reimbursement->amount,
                'status' => $status,
                'review_notes' => $validated['review_notes'] ?? null,
            ],
        );

        $message = $status === 'for_receipt'
            ? 'Reimbursement approved. It is now waiting for receipt attachment.'
            : 'Reimbursement declined.';

        return redirect()
            ->route('reimburse.list')
            ->with('success', $message);
    }

    public function attachEvidence(
        AttachReimbursementEvidenceRequest $request,
        Reimbursement $reimbursement,
    ): RedirectResponse {
        abort_unless($this->permissions->userHas($request->user(), 'reimburse.review'), 403);

        if ($reimbursement->status !== 'for_receipt') {
            return back()->with('error', 'Only approved reimbursements awaiting receipt can be completed.');
        }

        $path = $request->file('evidence_receipt')->store('reimbursement-evidence', 'public');

        if ($reimbursement->evidence_receipt_path) {
            Storage::disk('public')->delete($reimbursement->evidence_receipt_path);
        }

        $reimbursement->update([
            'evidence_receipt_path' => $path,
            'status' => 'completed',
            'completed_at' => now(),
            'completed_by' => $request->user()->id,
        ]);

        ActivityLogger::log(
            'Reimburse',
            'completed',
            'Attached evidence and completed reimbursement of '.number_format((float) $reimbursement->amount, 2),
            $reimbursement,
            [
                'amount' => $reimbursement->amount,
                'status' => 'completed',
            ],
        );

        return redirect()
            ->route('reimburse.review')
            ->with('success', 'Evidence attached. Reimbursement marked as completed.');
    }

    public function report(Request $request): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'reimburse.report'), 403);

        $from = $request->string('from')->toString() ?: null;
        $to = $request->string('to')->toString() ?: null;

        $reimbursements = Reimbursement::query()
            ->with(['expenseType:id,name', 'user:id,name,email'])
            ->where('status', 'completed')
            ->when($from, fn ($query) => $query->whereDate('completed_at', '>=', $from))
            ->when($to, fn ($query) => $query->whereDate('completed_at', '<=', $to))
            ->latest('completed_at')
            ->get()
            ->map(fn (Reimbursement $item) => $this->mapReimbursement($item));

        $total = $reimbursements->sum(
            fn (array $item) => (float) str_replace(',', '', $item['amount']),
        );

        return Inertia::render('Reimburse/Report', [
            'reimbursements' => $reimbursements,
            'filters' => [
                'from' => $from,
                'to' => $to,
            ],
            'totalAmount' => number_format($total, 2),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function mapReimbursement(Reimbursement $item): array
    {
        return [
            'id' => $item->id,
            'employee_name' => $item->user?->name,
            'employee_email' => $item->user?->email,
            'expense_type' => $item->expenseType?->name,
            'description' => $item->description,
            'purchased_date' => $item->purchased_date?->format('Y-m-d'),
            'amount' => number_format((float) $item->amount, 2),
            'status' => $item->status,
            'is_bulk' => $item->is_bulk,
            'notes' => $item->notes,
            'review_notes' => $item->review_notes,
            'receipt_url' => $item->receipt_path
                ? Storage::disk('public')->url($item->receipt_path)
                : null,
            'evidence_receipt_url' => $item->evidence_receipt_path
                ? Storage::disk('public')->url($item->evidence_receipt_path)
                : null,
            'completed_at' => $item->completed_at?->format('Y-m-d'),
            'created_at' => $item->created_at?->toDateTimeString(),
        ];
    }
}
