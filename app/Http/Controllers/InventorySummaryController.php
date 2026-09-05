<?php

namespace App\Http\Controllers;

use App\Models\InventoryAsset;
use App\Models\InventoryItem;
use App\Models\InventoryItemType;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

        $countsByName = InventoryAsset::query()
            ->selectRaw('LOWER(TRIM(name)) as name_key, COUNT(*) as total')
            ->groupBy(DB::raw('LOWER(TRIM(name))'))
            ->pluck('total', 'name_key');

        $prefixByTypeName = InventoryItemType::query()
            ->get(['name', 'code_prefix'])
            ->mapWithKeys(fn (InventoryItemType $type) => [
                strtolower(trim($type->name)) => $type->normalizedPrefix(),
            ]);

        $countsByPrefix = [];
        foreach ($prefixByTypeName->unique() as $prefix) {
            if ($prefix === '') {
                continue;
            }

            $countsByPrefix[$prefix] = InventoryAsset::query()
                ->where('item_code', 'like', $prefix.'%')
                ->count();
        }

        $categories = InventoryItem::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'code', 'name'])
            ->map(function (InventoryItem $item) use ($countsByName, $prefixByTypeName, $countsByPrefix) {
                $nameKey = strtolower(trim((string) $item->name));
                $prefix = $prefixByTypeName[$nameKey] ?? null;

                $byName = (int) ($countsByName[$nameKey] ?? 0);
                $byPrefix = $prefix ? (int) ($countsByPrefix[$prefix] ?? 0) : 0;
                $total = $byName > 0 ? $byName : $byPrefix;

                return [
                    'id' => $item->id,
                    'code' => $item->code,
                    'name' => $item->name,
                    'total_count' => $total,
                ];
            });

        $selectedName = trim((string) $request->string('category'));
        $selectedCategory = null;
        $categoryItems = [];

        if ($selectedName !== '') {
            $selectedCategory = $categories->first(
                fn (array $category) => strcasecmp($category['name'], $selectedName) === 0
            );

            if ($selectedCategory) {
                $nameKey = strtolower(trim($selectedCategory['name']));
                $prefix = $prefixByTypeName[$nameKey] ?? null;
                $byName = (int) ($countsByName[$nameKey] ?? 0);

                $categoryItems = InventoryAsset::query()
                    ->with(['allocatedTo:id,employee_number,first_name,middle_name,last_name'])
                    ->when(
                        $byName > 0,
                        fn ($query) => $query->whereRaw('LOWER(TRIM(name)) = ?', [$nameKey]),
                        function ($query) use ($prefix, $nameKey) {
                            if ($prefix) {
                                $query->where('item_code', 'like', $prefix.'%');
                            } else {
                                $query->whereRaw('LOWER(TRIM(name)) = ?', [$nameKey]);
                            }
                        },
                    )
                    ->orderBy('item_code')
                    ->get()
                    ->map(fn (InventoryAsset $asset) => [
                        'id' => $asset->id,
                        'item_code' => $asset->item_code,
                        'name' => $asset->name,
                        'type' => $asset->type,
                        'allocated_to_name' => $asset->allocated_to_name
                            ?: $asset->allocatedTo?->full_name,
                        'condition' => $asset->condition,
                        'status' => $asset->status,
                        'brand' => $asset->brand,
                        'date_arrived' => optional($asset->date_arrived)->format('Y-m-d'),
                        'photo_url' => $this->firstPictureUrl($asset),
                    ])
                    ->values()
                    ->all();
            }
        }

        return Inertia::render('Inventory/Summary', [
            'categories' => $categories,
            'grandTotal' => $categories->sum('total_count'),
            'selectedCategory' => $selectedCategory,
            'categoryItems' => $categoryItems,
            'canOpenItem' => $this->permissions->userHas($user, 'inventory.items'),
        ]);
    }

    private function firstPictureUrl(InventoryAsset $asset): ?string
    {
        $paths = $asset->picture_paths;
        if (! is_array($paths) || $paths === []) {
            return null;
        }

        $first = $paths[0] ?? null;

        return $first ? Storage::disk('public')->url($first) : null;
    }
}
