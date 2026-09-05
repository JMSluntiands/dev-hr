<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisciplineRecord extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'recorded_by_user_id',
        'employee_id',
        'employee_name',
        'incident_date',
        'offense_type',
        'discipline_level',
        'incident_description',
        'action_taken',
        'next_review_date',
        'status',
        'counts_for_progress',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'incident_date' => 'date',
            'next_review_date' => 'date',
            'counts_for_progress' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by_user_id');
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
