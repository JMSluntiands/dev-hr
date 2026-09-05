<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceReviewRating extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'performance_review_id',
        'competency_key',
        'competency_title',
        'rating',
        'explanation',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<PerformanceReview, $this>
     */
    public function review(): BelongsTo
    {
        return $this->belongsTo(PerformanceReview::class, 'performance_review_id');
    }
}
