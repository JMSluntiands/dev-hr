<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Employee extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'photo_path',
        'phone',
        'date_of_birth',
        'gender',
        'civil_status',
        'address',
        'emergency_contact_name',
        'emergency_contact_relation',
        'emergency_contact_phone',
        'emergency_contact_same_address',
        'emergency_contact_address',
        'emergency_contact_same_address',
        'emergency_contact_address',
        'employee_number',
        'department',
        'position',
        'employment_type',
        'date_hired',
        'employment_status',
        'work_location',
        'immediate_supervisor',
        'tin',
        'sss_number',
        'philhealth_number',
        'pagibig_number',
        'nbi_clearance',
        'police_clearance',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'date_hired' => 'date',
            'emergency_contact_same_address' => 'boolean',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return collect([$this->first_name, $this->middle_name, $this->last_name])
            ->filter()
            ->implode(' ');
    }

    /**
     * Format: YYMM### (e.g. 2608001 for Aug 2026, first hire that month).
     */
    public static function generateEmployeeNumber(CarbonInterface $dateHired): string
    {
        $prefix = $dateHired->format('ym');

        return DB::transaction(function () use ($prefix) {
            $latest = static::query()
                ->where('employee_number', 'like', $prefix.'%')
                ->whereRaw('CHAR_LENGTH(employee_number) = ?', [7])
                ->lockForUpdate()
                ->orderByDesc('employee_number')
                ->value('employee_number');

            $sequence = 1;

            if (is_string($latest) && preg_match('/^'.$prefix.'(\d{3})$/', $latest, $matches)) {
                $sequence = ((int) $matches[1]) + 1;
            }

            if ($sequence > 999) {
                throw new \RuntimeException('Employee ID sequence for '.$prefix.' is full.');
            }

            return $prefix.str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
        });
    }
}
