<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentAttachment extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'incident_id',
        'original_name',
        'path',
        'mime_type',
        'size',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}
