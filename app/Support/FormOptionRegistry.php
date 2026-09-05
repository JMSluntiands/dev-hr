<?php

namespace App\Support;

class FormOptionRegistry
{
    /**
     * @return array<string, array{label: string, description: string, used_by: string}>
     */
    public static function categories(): array
    {
        return [
            'gender' => [
                'label' => 'Gender',
                'description' => 'Manage gender options for the employee form.',
                'used_by' => 'employees.gender',
            ],
            'civil_status' => [
                'label' => 'Civil Status',
                'description' => 'Manage civil status options for the employee form.',
                'used_by' => 'employees.civil_status',
            ],
            'department' => [
                'label' => 'Department',
                'description' => 'Manage department options for the employee form.',
                'used_by' => 'employees.department',
            ],
            'emergency_contact_relation' => [
                'label' => 'Emergency Contact Relation',
                'description' => 'Manage relation options for emergency contact person.',
                'used_by' => 'employees.emergency_contact_relation',
            ],
            'leave_type' => [
                'label' => 'Leave Type',
                'description' => 'Manage leave type options for leave requests.',
                'used_by' => 'leave_requests.leave_type',
            ],
            'injury_type' => [
                'label' => 'Injury Type',
                'description' => 'Manage injury type options for incident reports.',
                'used_by' => 'incidents.injury_types',
            ],
            'discipline_level' => [
                'label' => 'Discipline Level',
                'description' => 'Manage discipline level options for progressive discipline records.',
                'used_by' => 'discipline_records.discipline_level',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_keys(self::categories());
    }
}
