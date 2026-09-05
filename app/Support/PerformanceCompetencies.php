<?php

namespace App\Support;

class PerformanceCompetencies
{
    /**
     * @return list<array{key: string, title: string, question: string, rubric: array<int, string>}>
     */
    public static function all(): array
    {
        return [
            [
                'key' => 'accuracy',
                'title' => 'Accuracy in task execution',
                'question' => 'Does the employee consistently ensure that no critical or minor details are missed when performing tasks?',
                'rubric' => [
                    1 => 'Frequently misses details; work often needs rework or correction.',
                    2 => 'Occasionally misses important details; accuracy is inconsistent.',
                    3 => 'Usually accurate; occasional minor oversights that are corrected promptly.',
                    4 => 'Consistently accurate with few errors; checks own work carefully.',
                    5 => 'Exceptionally thorough; catches issues early and delivers error-free work.',
                ],
            ],
            [
                'key' => 'cross_referencing',
                'title' => 'Cross-referencing resources',
                'question' => 'Is the employee able to effectively verify and cross-check resources and information to ensure accuracy?',
                'rubric' => [
                    1 => 'Rarely verifies sources; relies on incomplete or unchecked information.',
                    2 => 'Sometimes checks sources but misses contradictions or outdated data.',
                    3 => 'Generally verifies key facts; may skip deeper cross-checks under pressure.',
                    4 => 'Reliably cross-checks multiple sources before acting or reporting.',
                    5 => 'Proactively validates information thoroughly and flags inconsistencies early.',
                ],
            ],
            [
                'key' => 'comprehension',
                'title' => 'Comprehension of instructions',
                'question' => 'Does the employee fully grasp instructions and follow through without requiring excessive guidance or corrections?',
                'rubric' => [
                    1 => 'Often misunderstands instructions; needs repeated clarification.',
                    2 => 'Grasps basics but frequently needs follow-up guidance.',
                    3 => 'Understands most instructions with occasional clarifying questions.',
                    4 => 'Quickly understands and executes with minimal supervision.',
                    5 => 'Fully grasps intent and nuances; anticipates next steps correctly.',
                ],
            ],
            [
                'key' => 'teamwork',
                'title' => 'Teamwork and support',
                'question' => 'Does the employee collaborate effectively, help colleagues, and contribute positively to the team?',
                'rubric' => [
                    1 => 'Works in isolation; rarely supports teammates or shares information.',
                    2 => 'Participates when asked but seldom offers help proactively.',
                    3 => 'Cooperates with the team and helps when workload allows.',
                    4 => 'Actively supports colleagues and strengthens team outcomes.',
                    5 => 'Sets a strong example of collaboration; elevates team performance.',
                ],
            ],
            [
                'key' => 'initiative',
                'title' => 'Initiative to learn and ask meaningful questions',
                'question' => 'Does the employee seek to understand, ask useful questions, and apply learning to improve their work?',
                'rubric' => [
                    1 => 'Shows little curiosity; waits to be told what to do.',
                    2 => 'Asks basic questions but rarely applies new learning independently.',
                    3 => 'Asks relevant questions and applies feedback with guidance.',
                    4 => 'Proactively learns and improves processes based on feedback.',
                    5 => 'Drives continuous learning; asks insightful questions that improve outcomes.',
                ],
            ],
            [
                'key' => 'daily_output',
                'title' => 'Meeting daily output expectations',
                'question' => 'Does the employee reliably meet the expected volume, pace, or throughput for their role day to day?',
                'rubric' => [
                    1 => 'Frequently falls short of daily output expectations.',
                    2 => 'Meets expectations inconsistently; pace often lags.',
                    3 => 'Meets expected output on most days with occasional shortfalls.',
                    4 => 'Consistently meets daily targets with steady, reliable pace.',
                    5 => 'Regularly meets or exceeds output expectations without sacrificing quality.',
                ],
            ],
            [
                'key' => 'task_management',
                'title' => 'Task management and allocation',
                'question' => 'Does the employee prioritize, organize, and allocate tasks (their own or shared work) effectively?',
                'rubric' => [
                    1 => 'Poor prioritization; deadlines and dependencies are often missed.',
                    2 => 'Organizes some work but struggles with competing priorities.',
                    3 => 'Manages most tasks adequately; may need help with complex prioritization.',
                    4 => 'Plans and prioritizes well; keeps shared work moving smoothly.',
                    5 => 'Excellent organizer; balances priorities and allocates effort optimally.',
                ],
            ],
            [
                'key' => 'communication',
                'title' => 'Communication of delays or challenges',
                'question' => 'Does the employee promptly and clearly communicate blockers, risks, or delays so others can respond?',
                'rubric' => [
                    1 => 'Does not raise issues until they become critical problems.',
                    2 => 'Sometimes flags delays late or with incomplete context.',
                    3 => 'Usually communicates blockers, though timing or clarity may vary.',
                    4 => 'Promptly and clearly escalates risks and delays with useful context.',
                    5 => 'Anticipates and communicates challenges early so the team can adapt.',
                ],
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_column(self::all(), 'key');
    }

    /**
     * @return array{1: string, 2: string, 3: string, 4: string, 5: string}
     */
    public static function ratingLabels(): array
    {
        return [
            1 => 'Poor',
            2 => 'Fair',
            3 => 'OK',
            4 => 'Good',
            5 => 'Excellent',
        ];
    }
}
