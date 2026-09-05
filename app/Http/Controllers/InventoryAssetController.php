<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryAssetRequest;
use App\Http\Requests\UpdateInventoryAssetRequest;
use App\Models\Employee;
use App\Models\InventoryAsset;
use App\Models\InventoryItemType;
use App\Models\InventoryRequest;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InventoryAssetController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('inventory.items');
        $this->permissions->grantMissingPermissionKey('inventory.manage');

        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.items'), 403);

        $canManage = $this->permissions->userHas($user, 'inventory.manage');
        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'item_code';
        $direction = $request->string('direction')->toString() === 'desc' ? 'desc' : 'asc';
        $perPage = (int) $request->integer('per_page', 10);

        if (! in_array($perPage, [10, 25, 50], true)) {
            $perPage = 10;
        }

        $allowedSorts = [
            'item_code',
            'name',
            'description',
            'type',
            'allocated_to_name',
            'condition',
            'status',
            'remarks',
            'date_arrived',
            'date_purchased',
            'brand',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'item_code';
        }

        $ownEmployeeIds = $this->employeeIdsForUser($user);

        $items = InventoryAsset::query()
            ->with(['allocatedTo:id,employee_number,first_name,middle_name,last_name'])
            ->when(! $canManage, function ($query) use ($ownEmployeeIds) {
                $query->whereIn('allocated_to_employee_id', $ownEmployeeIds ?: [0]);
            })
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('item_code', 'like', $like)
                        ->orWhere('name', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('type', 'like', $like)
                        ->orWhere('allocated_to_name', 'like', $like)
                        ->orWhere('condition', 'like', $like)
                        ->orWhere('status', 'like', $like)
                        ->orWhere('remarks', 'like', $like)
                        ->orWhere('brand', 'like', $like);
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (InventoryAsset $asset) => $this->serializeAsset($asset));

        return Inertia::render('Inventory/Items', [
            'items' => $items,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'canManage' => $canManage,
            'isOwnView' => ! $canManage,
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $this->permissions->grantMissingPermissionKey('inventory.manage');

        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.manage'), 403);

        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'item_code';
        $direction = $request->string('direction')->toString() === 'desc' ? 'desc' : 'asc';

        $allowedSorts = [
            'item_code',
            'name',
            'description',
            'type',
            'allocated_to_name',
            'condition',
            'status',
            'remarks',
            'date_arrived',
            'date_purchased',
            'brand',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'item_code';
        }

        $assets = InventoryAsset::query()
            ->with(['allocatedTo:id,employee_number,first_name,middle_name,last_name'])
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('item_code', 'like', $like)
                        ->orWhere('name', 'like', $like)
                        ->orWhere('description', 'like', $like)
                        ->orWhere('type', 'like', $like)
                        ->orWhere('allocated_to_name', 'like', $like)
                        ->orWhere('condition', 'like', $like)
                        ->orWhere('status', 'like', $like)
                        ->orWhere('remarks', 'like', $like)
                        ->orWhere('brand', 'like', $like);
                });
            })
            ->orderBy($sort, $direction)
            ->get();

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Inventory Items');

        $headers = [
            'Item ID',
            'Item Name',
            'Description',
            'Type',
            'Allocated To',
            'Item Condition',
            'Remarks',
            'Date Arrived',
            'Brand / Manufacturer',
            'Date Purchased',
            'Status',
            'Service Length',
        ];

        $sheet->fromArray($headers, null, 'A1');

        $row = 2;
        foreach ($assets as $asset) {
            $sheet->fromArray([
                $asset->item_code,
                $asset->name,
                $asset->description,
                $asset->type,
                $asset->allocated_to_name ?: $asset->allocatedTo?->full_name,
                $asset->condition,
                $asset->remarks,
                optional($asset->date_arrived)->format('Y-m-d'),
                $asset->brand,
                optional($asset->date_purchased)->format('Y-m-d'),
                $asset->status,
                $asset->serviceLengthLabel(),
            ], null, 'A'.$row);
            $row++;
        }

        $sheet->getStyle('A1:L1')->getFont()->setBold(true);
        foreach (range('A', 'L') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $filename = 'inventory-items-'.now()->format('Y-m-d-His').'.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            (new Xlsx($spreadsheet))->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function create(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('inventory.manage');
        abort_unless($this->permissions->userHas($request->user(), 'inventory.manage'), 403);

        return Inertia::render('Inventory/ItemCreate', $this->formProps());
    }

    public function store(StoreInventoryAssetRequest $request): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.manage'), 403);

        $asset = $this->persistAsset($request, new InventoryAsset, $request->user()->id);

        ActivityLogger::log(
            'Inventory',
            'asset_created',
            'Added inventory item '.$asset->item_code.' ('.$asset->name.')',
            $asset,
        );

        return redirect()
            ->route('inventory.items')
            ->with('success', 'Inventory item '.$asset->item_code.' saved.');
    }

    public function show(Request $request, InventoryAsset $asset): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.items'), 403);
        abort_unless($this->canViewAsset($user, $asset), 403);

        $asset->load([
            'allocatedTo:id,first_name,middle_name,last_name,employee_number',
            'inventoryRequest.user:id,name',
        ]);

        return Inertia::render('Inventory/ItemShow', [
            'item' => $this->serializeAsset($asset, true),
            'canManage' => $this->permissions->userHas($user, 'inventory.manage'),
        ]);
    }

    public function edit(Request $request, InventoryAsset $asset): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.manage'), 403);

        $asset->load([
            'allocatedTo:id,first_name,middle_name,last_name',
            'inventoryRequest.user:id,name',
        ]);

        return Inertia::render('Inventory/ItemEdit', [
            ...$this->formProps(),
            'item' => [
                ...$this->serializeAsset($asset, true),
                'allocated_to_employee_id' => $asset->allocated_to_employee_id
                    ? (string) $asset->allocated_to_employee_id
                    : '',
            ],
        ]);
    }

    public function update(UpdateInventoryAssetRequest $request, InventoryAsset $asset): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.manage'), 403);

        $this->persistAsset($request, $asset);

        ActivityLogger::log(
            'Inventory',
            'asset_updated',
            'Updated inventory item '.$asset->item_code.' ('.$asset->name.')',
            $asset->fresh(),
        );

        return redirect()
            ->route('inventory.items.show', $asset)
            ->with('success', 'Inventory item '.$asset->item_code.' updated.');
    }

    public function destroy(Request $request, InventoryAsset $asset): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.manage'), 403);

        $label = $asset->item_code.' ('.$asset->name.')';

        if ($asset->picturePathList() !== []) {
            Storage::disk('public')->delete($asset->picturePathList());
        }

        $asset->delete();

        ActivityLogger::log(
            'Inventory',
            'asset_deleted',
            'Deleted inventory item '.$label,
        );

        return redirect()
            ->route('inventory.items')
            ->with('success', 'Inventory item '.$label.' deleted.');
    }

    public function printLabel(Request $request, InventoryAsset $asset): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.items'), 403);
        abort_unless($this->canViewAsset($user, $asset), 403);

        return Inertia::render('Inventory/PrintLabel', [
            'item' => [
                'id' => $asset->id,
                'item_code' => $asset->item_code,
                'name' => $asset->name,
                'type' => $asset->type,
                'brand' => $asset->brand,
                'allocated_to' => $asset->allocated_to_name,
                'date_arrived' => optional($asset->date_arrived)->format('Y-m-d'),
                'qr_value' => route('inventory.items.show', $asset),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(): array
    {
        return [
            'employees' => Employee::query()
                ->whereRaw('LOWER(employment_status) = ?', ['active'])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'middle_name', 'last_name', 'employee_number', 'department'])
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'employee_number' => $employee->employee_number,
                    'department' => $employee->department,
                ])
                ->values()
                ->all(),
            'conditions' => [
                'New',
                'Good',
                'Fair',
                'Need Repair',
                'Needs Repair',
                'Working-Active',
                'Working - Stock',
                'Stock',
                'Need Repair- Stock',
                'Decom - Stock',
                'Damaged',
                'For Disposal',
            ],
            'statuses' => [
                'Active',
                'For Storage',
                'For Decommission',
                'Possible Decommission',
            ],
            'itemTypes' => InventoryItemType::query()
                ->active()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'code_prefix'])
                ->map(fn (InventoryItemType $type) => [
                    'id' => $type->id,
                    'name' => $type->name,
                    'code_prefix' => $type->normalizedPrefix(),
                    'suggested_code' => $this->nextItemCode($type->normalizedPrefix()),
                ])
                ->values()
                ->all(),
            'purchaseRequests' => InventoryRequest::query()
                ->with(['user:id,name'])
                ->whereIn('status', ['approved', 'pending'])
                ->latest()
                ->get()
                ->map(fn (InventoryRequest $request) => [
                    'id' => $request->id,
                    'item_code' => $request->item_code,
                    'item_name' => $request->item_name,
                    'details' => $request->details,
                    'status' => $request->status,
                    'requester' => $request->user?->name,
                    'label' => trim(
                        $request->item_code
                        .' · '.$request->item_name
                        .($request->user?->name ? ' · '.$request->user->name : '')
                        .' ('.$request->status.')'
                    ),
                ])
                ->values()
                ->all(),
        ];
    }

    private function persistAsset(
        StoreInventoryAssetRequest|UpdateInventoryAssetRequest $request,
        InventoryAsset $asset,
        ?int $createdByUserId = null,
    ): InventoryAsset {
        $validated = $request->validated();

        $typeName = $validated['type'] ?? null;
        $itemType = $typeName
            ? InventoryItemType::query()->active()->where('name', $typeName)->first()
            : null;

        $itemCode = filled($validated['item_code'] ?? null)
            ? strtoupper(trim((string) $validated['item_code']))
            : ($asset->exists
                ? $asset->item_code
                : $this->nextItemCode($itemType?->normalizedPrefix()));

        $employee = null;
        if (! empty($validated['allocated_to_employee_id'])) {
            $employee = Employee::query()->find($validated['allocated_to_employee_id']);
        }

        $picturePaths = $asset->picturePathList();

        $removePictures = array_values(array_filter(
            (array) $request->input('remove_pictures', []),
            fn ($path) => is_string($path) && $path !== '',
        ));

        if ($removePictures !== []) {
            $toDelete = array_values(array_intersect($picturePaths, $removePictures));
            if ($toDelete !== []) {
                Storage::disk('public')->delete($toDelete);
            }
            $picturePaths = array_values(array_diff($picturePaths, $removePictures));
        }

        if ($request->hasFile('pictures')) {
            foreach ($request->file('pictures', []) as $file) {
                if (! $file) {
                    continue;
                }
                $picturePaths[] = $file->store('inventory-assets', 'public');
            }
        }

        $picturePaths = array_values(array_slice($picturePaths, 0, 10));

        $boughtThroughRequest = $request->boolean('bought_through_request');
        $inventoryRequestId = $boughtThroughRequest
            ? ($validated['inventory_request_id'] ?? null)
            : null;

        $payload = [
            'item_code' => $itemCode,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? null,
            'allocated_to_employee_id' => $employee?->id,
            'allocated_to_name' => $employee?->full_name,
            'condition' => $validated['condition'] ?? null,
            'status' => $validated['status'] ?? null,
            'remarks' => $validated['remarks'] ?? null,
            'date_arrived' => $validated['date_arrived'] ?? null,
            'date_purchased' => $validated['date_purchased'] ?? null,
            'service_months' => $asset->service_months ?: 38,
            'brand' => $validated['brand'] ?? null,
            'picture_paths' => $picturePaths,
            'inventory_request_id' => $inventoryRequestId,
        ];

        if (! $asset->exists && $createdByUserId) {
            $payload['created_by_user_id'] = $createdByUserId;
            $payload['service_months'] = 38;
        }

        $asset->fill($payload)->save();

        return $asset->refresh();
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeAsset(InventoryAsset $asset, bool $detailed = false): array
    {
        $picturePaths = $asset->picturePathList();
        $pictures = array_map(
            fn (string $path) => [
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
            ],
            $picturePaths,
        );

        $data = [
            'id' => $asset->id,
            'item_code' => $asset->item_code,
            'name' => $asset->name,
            'description' => $asset->description,
            'type' => $asset->type,
            'allocated_to' => $asset->allocated_to_name
                ?: $asset->allocatedTo?->full_name,
            'condition' => $asset->condition,
            'status' => $asset->status,
            'remarks' => $asset->remarks,
            'date_arrived' => optional($asset->date_arrived)->format('Y-m-d'),
            'date_purchased' => optional($asset->date_purchased)->format('Y-m-d'),
            'service_length' => $asset->serviceLengthLabel(),
            'service_months' => (int) ($asset->service_months ?: 38),
            'brand' => $asset->brand,
            'pictures' => $pictures,
            'picture_url' => $pictures[0]['url'] ?? null,
            'bought_through_request' => (bool) $asset->inventory_request_id,
            'inventory_request_id' => $asset->inventory_request_id,
            'purchase_request' => $asset->inventoryRequest
                ? [
                    'id' => $asset->inventoryRequest->id,
                    'item_code' => $asset->inventoryRequest->item_code,
                    'item_name' => $asset->inventoryRequest->item_name,
                    'status' => $asset->inventoryRequest->status,
                    'requester' => $asset->inventoryRequest->user?->name,
                ]
                : null,
        ];

        if ($detailed) {
            $data['allocated_to_employee_id'] = $asset->allocated_to_employee_id;
        }

        return $data;
    }

    private function nextItemCode(?string $prefix = null): string
    {
        $prefix = $prefix ?: 'IT-';

        if (! str_ends_with($prefix, '-')) {
            $prefix .= '-';
        }

        $prefix = strtoupper($prefix);

        return DB::transaction(function () use ($prefix) {
            $latest = InventoryAsset::query()
                ->where('item_code', 'like', $prefix.'%')
                ->lockForUpdate()
                ->orderByDesc('item_code')
                ->value('item_code');

            $seq = 1;
            if ($latest && preg_match('/-(\d+)$/', $latest, $matches)) {
                $seq = ((int) $matches[1]) + 1;
            }

            return $prefix.str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
        });
    }

    /**
     * @return list<int>
     */
    private function employeeIdsForUser($user): array
    {
        return Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    private function canViewAsset($user, InventoryAsset $asset): bool
    {
        if ($this->permissions->userHas($user, 'inventory.manage')) {
            return true;
        }

        return in_array(
            (int) $asset->allocated_to_employee_id,
            $this->employeeIdsForUser($user),
            true,
        );
    }
}
