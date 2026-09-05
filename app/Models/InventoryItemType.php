<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class InventoryItemType extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code_prefix',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @param  Builder<InventoryItemType>  $query
     * @return Builder<InventoryItemType>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function normalizedPrefix(): string
    {
        $prefix = strtoupper(trim((string) $this->code_prefix));

        if ($prefix !== '' && ! str_ends_with($prefix, '-')) {
            $prefix .= '-';
        }

        return $prefix;
    }
}
