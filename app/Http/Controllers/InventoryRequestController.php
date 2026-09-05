<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryRequestRequest;
use App\Http\Requests\UpdateInventoryRequestStatusRequest;
use App\Models\InventoryRequest;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryRequestController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.request'), 403);

        $this->permissions->grantMissingPermissionKey('inventory.approvals');

        $canApprove = $this->permissions->userHas($user, 'inventory.approvals');

        $requests = InventoryRequest::query()
            ->with(['user:id,name,email'])
            ->when(! $canApprove, fn ($query) => $query->where('user_id', $user->id))
            ->latest()
            ->get()
            ->map(fn (InventoryRequest $item) => $this->mapRequest($item, includeEmployee: $canApprove));

        return Inertia::render('Inventory/Request', [
            'myRequests' => $requests,
            'canApprove' => $canApprove,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.request'), 403);

        return Inertia::render('Inventory/Create', [
            'nextItemCode' => $this->peekNextItemCode(),
        ]);
    }

    public function store(StoreInventoryRequestRequest $request): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.request'), 403);

        $validated = $request->validated();

        $inventoryRequest = InventoryRequest::query()->create([
            'user_id' => $request->user()->id,
            'inventory_item_id' => null,
            'item_code' => $this->generateItemCode(),
            'item_name' => $validated['item_name'],
            'details' => $validated['details'] ?? null,
            'status' => 'pending',
        ]);

        ActivityLogger::log(
            'Inventory',
            'submitted',
            'Requested '.$inventoryRequest->item_name.' ('.$inventoryRequest->item_code.')',
            $inventoryRequest,
            [
                'item_code' => $inventoryRequest->item_code,
                'item_name' => $inventoryRequest->item_name,
            ],
        );

        return redirect()
            ->route('inventory.request')
            ->with('success', 'Item request submitted. Request number: '.$inventoryRequest->item_code);
    }

    public function approvals(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.approvals'), 403);

        $requests = InventoryRequest::query()
            ->with(['user:id,name,email'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn (InventoryRequest $item) => $this->mapRequest($item, includeEmployee: true));

        return Inertia::render('Inventory/Approvals', [
            'requests' => $requests,
        ]);
    }

    public function updateStatus(
        UpdateInventoryRequestStatusRequest $request,
        InventoryRequest $inventoryRequest,
    ): RedirectResponse {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.approvals'), 403);

        if ($inventoryRequest->status !== 'pending') {
            return back()->with('error', 'Only pending item requests can be reviewed.');
        }

        $validated = $request->validated();
        $status = $validated['status'];

        $inventoryRequest->update([
            'status' => $status,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $validated['review_notes'] ?? null,
        ]);

        ActivityLogger::log(
            'Inventory',
            $status,
            ucfirst($status).' item request '.$inventoryRequest->item_name.' ('.$inventoryRequest->item_code.')',
            $inventoryRequest,
            [
                'item_code' => $inventoryRequest->item_code,
                'status' => $status,
            ],
        );

        return redirect()
            ->route('inventory.approvals')
            ->with('success', 'Item request '.$status.'.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mapRequest(InventoryRequest $item, bool $includeEmployee = false): array
    {
        return [
            'id' => $item->id,
            'item_code' => $item->item_code,
            'item_name' => $item->item_name,
            'details' => $item->details,
            'status' => $item->status,
            'review_notes' => $item->review_notes,
            'created_at' => $item->created_at?->format('M j, Y g:i A'),
            'employee_name' => $includeEmployee ? $item->user?->name : null,
            'employee_email' => $includeEmployee ? $item->user?->email : null,
        ];
    }

    private function peekNextItemCode(): string
    {
        return $this->buildItemCode($this->nextSequenceForToday());
    }

    private function generateItemCode(): string
    {
        return $this->buildItemCode($this->nextSequenceForToday());
    }

    private function nextSequenceForToday(): int
    {
        $prefix = now()->format('Ymd');

        $lastCode = InventoryRequest::query()
            ->where('item_code', 'like', $prefix.'-%')
            ->orderByDesc('item_code')
            ->value('item_code');

        if (! $lastCode) {
            return 1;
        }

        $sequence = (int) substr((string) $lastCode, -3);

        return $sequence + 1;
    }

    private function buildItemCode(int $sequence): string
    {
        return now()->format('Ymd').'-'.str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
    }
}
