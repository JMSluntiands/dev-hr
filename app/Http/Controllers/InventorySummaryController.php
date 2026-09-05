<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventorySummaryController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'inventory.summary'), 403);

        $this->permissions->grantMissingPermissionKey('inventory.summary');

        $categories = InventoryItem::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'quantity'])
            ->map(fn (InventoryItem $item) => [
                'id' => $item->id,
                'code' => $item->code,
                'name' => $item->name,
                'total_count' => (int) $item->quantity,
            ]);

        return Inertia::render('Inventory/Summary', [
            'categories' => $categories,
            'grandTotal' => $categories->sum('total_count'),
        ]);
    }
}
