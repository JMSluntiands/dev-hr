<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reimbursement extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'expense_type_id',
        'is_bulk',
        'description',
        'purchased_date',
        'amount',
        'notes',
        'receipt_path',
        'evidence_receipt_path',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'completed_at',
        'completed_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_bulk' => 'boolean',
            'purchased_date' => 'date',
            'amount' => 'decimal:2',
            'reviewed_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function expenseType(): BelongsTo
    {
        return $this->belongsTo(ExpenseType::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
