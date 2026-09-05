<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /**
     * Legacy portal table (no hr_ prefix).
     */
    protected $connection = 'portal';

    protected $table = 'attendances';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'attendance_date',
        'clocked_in_at',
        'clocked_out_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
            'clocked_in_at' => 'datetime',
            'clocked_out_at' => 'datetime',
        ];
    }
}
