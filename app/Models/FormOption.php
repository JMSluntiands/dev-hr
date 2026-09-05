<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class FormOption extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'category',
        'name',
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
     * @param  Builder<FormOption>  $query
     * @return Builder<FormOption>
     */
    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * @param  Builder<FormOption>  $query
     * @return Builder<FormOption>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public static function activeOptions(string $category): array
    {
        return static::query()
            ->category($category)
            ->active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (FormOption $option) => [
                'id' => $option->id,
                'name' => $option->name,
            ])
            ->all();
    }

    /**
     * @return list<string>
     */
    public static function activeNames(string $category): array
    {
        return static::query()
            ->category($category)
            ->active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->pluck('name')
            ->all();
    }
}
