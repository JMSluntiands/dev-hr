<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerformanceReview extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'reviewed_by_user_id',
        'supervisor_name',
        'employee_id',
        'employee_name',
        'employee_number',
        'department',
        'position',
        'review_date',
        'overall_score',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'review_date' => 'date',
            'overall_score' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return HasMany<PerformanceReviewRating, $this>
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(PerformanceReviewRating::class)->orderBy('sort_order');
    }
}
