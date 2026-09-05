<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class InventoryAsset extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'item_code',
        'name',
        'description',
        'type',
        'allocated_to_employee_id',
        'allocated_to_name',
        'condition',
        'status',
        'remarks',
        'date_arrived',
        'date_purchased',
        'service_months',
        'brand',
        'picture_paths',
        'created_by_user_id',
        'inventory_request_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_arrived' => 'date',
            'date_purchased' => 'date',
            'service_months' => 'integer',
            'picture_paths' => 'array',
        ];
    }

    /**
     * @return list<string>
     */
    public function picturePathList(): array
    {
        $paths = $this->picture_paths;

        if (! is_array($paths)) {
            return [];
        }

        return array_values(array_filter($paths, fn ($path) => is_string($path) && $path !== ''));
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function allocatedTo(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'allocated_to_employee_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * @return BelongsTo<InventoryRequest, $this>
     */
    public function inventoryRequest(): BelongsTo
    {
        return $this->belongsTo(InventoryRequest::class);
    }

    public function serviceEndsAt(): ?CarbonInterface
    {
        if (! $this->date_purchased) {
            return null;
        }

        $months = (int) ($this->service_months ?: 38);

        return $this->date_purchased->copy()->addMonthsNoOverflow($months);
    }

    /**
     * Remaining service coverage from purchase date (default 38 months).
     */
    public function serviceLengthLabel(?CarbonInterface $asOf = null): string
    {
        $endsAt = $this->serviceEndsAt();

        if (! $endsAt) {
            return '—';
        }

        $asOf ??= Carbon::now()->startOfDay();
        $endsAt = $endsAt->copy()->startOfDay();

        if ($asOf->greaterThan($endsAt)) {
            return 'Expired';
        }

        $diff = $asOf->diff($endsAt);

        return sprintf(
            '%d year%s, %d month%s, %d day%s',
            $diff->y,
            $diff->y === 1 ? '' : 's',
            $diff->m,
            $diff->m === 1 ? '' : 's',
            $diff->d,
            $diff->d === 1 ? '' : 's',
        );
    }
}
