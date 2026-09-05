<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryItemTypeRequest;
use App\Http\Requests\UpdateInventoryItemTypeRequest;
use App\Models\InventoryItemType;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventorySettingController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('inventory.settings');

        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.settings'), 403);

        $canManage = $this->permissions->userHas($user, 'inventory.settings');

        $types = InventoryItemType::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (InventoryItemType $type) => [
                'id' => $type->id,
                'name' => $type->name,
                'code_prefix' => $type->code_prefix,
                'is_active' => $type->is_active,
                'sort_order' => $type->sort_order,
            ]);

        return Inertia::render('Inventory/Settings', [
            'types' => $types,
            'canManage' => $canManage,
        ]);
    }

    public function store(StoreInventoryItemTypeRequest $request): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.settings'), 403);

        $validated = $request->validated();

        $type = InventoryItemType::query()->create([
            'name' => $validated['name'],
            'code_prefix' => $validated['code_prefix'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? (InventoryItemType::query()->max('sort_order') + 1),
        ]);

        ActivityLogger::log(
            'Inventory',
            'item_type_created',
            'Added inventory item type '.$type->name.' ('.$type->code_prefix.')',
            $type,
        );

        return back()->with('success', 'Item description saved.');
    }

    public function update(
        UpdateInventoryItemTypeRequest $request,
        InventoryItemType $inventoryItemType,
    ): RedirectResponse {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.settings'), 403);

        $validated = $request->validated();

        $inventoryItemType->update([
            'name' => $validated['name'],
            'code_prefix' => $validated['code_prefix'],
            'is_active' => $validated['is_active'] ?? $inventoryItemType->is_active,
            'sort_order' => $validated['sort_order'] ?? $inventoryItemType->sort_order,
        ]);

        ActivityLogger::log(
            'Inventory',
            'item_type_updated',
            'Updated inventory item type '.$inventoryItemType->name.' ('.$inventoryItemType->code_prefix.')',
            $inventoryItemType,
        );

        return back()->with('success', 'Item description updated.');
    }

    public function destroy(Request $request, InventoryItemType $inventoryItemType): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'inventory.settings'), 403);

        $label = $inventoryItemType->name.' ('.$inventoryItemType->code_prefix.')';
        $inventoryItemType->delete();

        ActivityLogger::log(
            'Inventory',
            'item_type_deleted',
            'Deleted inventory item type '.$label,
        );

        return back()->with('success', 'Item description removed.');
    }
}
