<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Incident extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'company',
        'reported_by_user_id',
        'employee_id',
        'employee_name',
        'location_area',
        'incident_date',
        'incident_time',
        'incident_type_id',
        'details',
        'witness',
        'has_injury',
        'injury_types',
        'injury_details',
        'report_date',
        'report_time',
        'action_taken',
        'status',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'incident_date' => 'date',
            'report_date' => 'date',
            'has_injury' => 'boolean',
            'injury_types' => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    public function reportedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by_user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function incidentType(): BelongsTo
    {
        return $this->belongsTo(IncidentType::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(IncidentAttachment::class);
    }
}
