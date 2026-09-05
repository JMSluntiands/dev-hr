<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePerformanceReviewRequest;
use App\Models\Employee;
use App\Models\PerformanceReview;
use App\Models\PerformanceReviewRating;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use App\Support\PerformanceCompetencies;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceReviewController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('performance.view');
        $this->permissions->grantMissingPermissionKey('performance.create');
        $this->permissions->grantMissingPermissionKey('performance.manage');

        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'performance.view'), 403);

        $canManage = $this->permissions->userHas($user, 'performance.manage');
        $canCreate = $this->permissions->userHas($user, 'performance.create');
        $search = trim((string) $request->string('search'));
        $perPage = (int) $request->integer('per_page', 10);

        if (! in_array($perPage, [10, 25, 50], true)) {
            $perPage = 10;
        }

        $ownEmployeeIds = $this->employeeIdsForUser($user);

        $reviews = PerformanceReview::query()
            ->with(['reviewedBy:id,name,email'])
            ->when($canManage, function ($query) {
                // HR/Admin: all reviews
            }, function ($query) use ($canCreate, $user, $ownEmployeeIds) {
                $query->where(function ($query) use ($canCreate, $user, $ownEmployeeIds) {
                    $query->whereIn('employee_id', $ownEmployeeIds);

                    if ($canCreate) {
                        $query->orWhere('reviewed_by_user_id', $user->id);
                    }
                });
            })
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('employee_name', 'like', $like)
                        ->orWhere('supervisor_name', 'like', $like)
                        ->orWhere('department', 'like', $like)
                        ->orWhere('employee_number', 'like', $like);
                });
            })
            ->orderByDesc('review_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (PerformanceReview $review) => [
                'id' => $review->id,
                'employee_name' => $review->employee_name,
                'employee_number' => $review->employee_number,
                'department' => $review->department,
                'position' => $review->position,
                'supervisor_name' => $review->supervisor_name,
                'reviewed_by' => $review->reviewedBy?->name,
                'review_date' => optional($review->review_date)->format('Y-m-d'),
                'overall_score' => $review->overall_score !== null
                    ? number_format((float) $review->overall_score, 2)
                    : null,
                'status' => $review->status ?: 'Submitted',
                'created_at' => $review->created_at?->format('M j, Y'),
            ]);

        $isOwnView = ! $canManage && ! $canCreate;

        return Inertia::render('Performance/Index', [
            'reviews' => $reviews,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'canCreate' => $canCreate || $canManage,
            'canManage' => $canManage,
            'isOwnView' => $isOwnView,
        ]);
    }

    public function create(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('performance.create');
        $this->permissions->grantMissingPermissionKey('performance.manage');

        $user = $request->user();
        abort_unless(
            $this->permissions->userHas($user, 'performance.create')
                || $this->permissions->userHas($user, 'performance.manage'),
            403,
        );

        $canManage = $this->permissions->userHas($user, 'performance.manage');
        $supervisorName = $this->supervisorNameForUser($user);

        return Inertia::render('Performance/Create', [
            'employees' => $this->employeeOptionsForReviewer($user, $canManage),
            'competencies' => PerformanceCompetencies::all(),
            'ratingLabels' => PerformanceCompetencies::ratingLabels(),
            'supervisorName' => $supervisorName,
            'defaultReviewDate' => now()->toDateString(),
        ]);
    }

    public function store(StorePerformanceReviewRequest $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless(
            $this->permissions->userHas($user, 'performance.create')
                || $this->permissions->userHas($user, 'performance.manage'),
            403,
        );

        $canManage = $this->permissions->userHas($user, 'performance.manage');
        $validated = $request->validated();
        $employee = Employee::query()->findOrFail($validated['employee_id']);

        $allowedIds = collect($this->employeeOptionsForReviewer($user, $canManage))
            ->pluck('id')
            ->all();

        abort_unless(in_array((int) $employee->id, $allowedIds, true), 403);

        $competencyMap = collect(PerformanceCompetencies::all())->keyBy('key');
        $ratingsInput = collect($validated['ratings'])->keyBy('competency_key');

        $scores = [];
        foreach (PerformanceCompetencies::keys() as $key) {
            $scores[] = (int) $ratingsInput[$key]['rating'];
        }
        $overall = count($scores) > 0 ? round(array_sum($scores) / count($scores), 2) : null;

        $review = DB::transaction(function () use (
            $user,
            $validated,
            $employee,
            $competencyMap,
            $ratingsInput,
            $overall,
        ) {
            $review = PerformanceReview::query()->create([
                'reviewed_by_user_id' => $user->id,
                'supervisor_name' => $validated['supervisor_name'],
                'employee_id' => $employee->id,
                'employee_name' => $employee->full_name,
                'employee_number' => $employee->employee_number,
                'department' => $employee->department,
                'position' => $employee->position,
                'review_date' => $validated['review_date'],
                'overall_score' => $overall,
                'status' => 'Submitted',
            ]);

            $sort = 0;
            foreach (PerformanceCompetencies::keys() as $key) {
                $meta = $competencyMap[$key];
                $row = $ratingsInput[$key];

                PerformanceReviewRating::query()->create([
                    'performance_review_id' => $review->id,
                    'competency_key' => $key,
                    'competency_title' => $meta['title'],
                    'rating' => (int) $row['rating'],
                    'explanation' => $row['explanation'],
                    'sort_order' => $sort++,
                ]);
            }

            return $review;
        });

        ActivityLogger::log(
            'Performance',
            'review_submitted',
            'Submitted performance review for '.$employee->full_name,
            $review,
            ['overall_score' => $overall],
        );

        return redirect()
            ->route('performance.show', $review)
            ->with('success', 'Performance review submitted for '.$employee->full_name.'.');
    }

    public function show(Request $request, PerformanceReview $performance): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'performance.view'), 403);
        abort_unless($this->canViewReview($user, $performance), 403);

        $performance->load(['ratings', 'reviewedBy:id,name,email']);

        $labels = PerformanceCompetencies::ratingLabels();
        $competencyMap = collect(PerformanceCompetencies::all())->keyBy('key');

        return Inertia::render('Performance/Show', [
            'review' => [
                'id' => $performance->id,
                'employee_name' => $performance->employee_name,
                'employee_number' => $performance->employee_number,
                'department' => $performance->department,
                'position' => $performance->position,
                'supervisor_name' => $performance->supervisor_name,
                'reviewed_by' => $performance->reviewedBy?->name,
                'review_date' => optional($performance->review_date)->format('Y-m-d'),
                'overall_score' => $performance->overall_score !== null
                    ? number_format((float) $performance->overall_score, 2)
                    : null,
                'status' => $performance->status ?: 'Submitted',
                'created_at' => $performance->created_at?->format('M j, Y g:i A'),
                'ratings' => $performance->ratings->map(function (PerformanceReviewRating $rating) use ($labels, $competencyMap) {
                    $meta = $competencyMap[$rating->competency_key] ?? null;

                    return [
                        'key' => $rating->competency_key,
                        'title' => $rating->competency_title,
                        'question' => $meta['question'] ?? null,
                        'rating' => $rating->rating,
                        'rating_label' => $labels[$rating->rating] ?? (string) $rating->rating,
                        'explanation' => $rating->explanation,
                        'rubric' => $meta['rubric'] ?? [],
                    ];
                })->values(),
            ],
        ]);
    }

    /**
     * @return list<array{id: int, name: string, employee_number: ?string, department: ?string, position: ?string}>
     */
    private function employeeOptionsForReviewer($user, bool $canManage): array
    {
        $query = Employee::query()
            ->whereRaw('LOWER(employment_status) = ?', ['active'])
            ->orderBy('last_name')
            ->orderBy('first_name');

        if (! $canManage) {
            $names = $this->supervisorMatchNames($user);

            if ($names === []) {
                return [];
            }

            $query->where(function ($query) use ($names) {
                foreach ($names as $index => $name) {
                    $method = $index === 0 ? 'whereRaw' : 'orWhereRaw';
                    $query->{$method}('LOWER(TRIM(immediate_supervisor)) = ?', [strtolower($name)]);
                }
            });
        }

        return $query
            ->get(['id', 'first_name', 'middle_name', 'last_name', 'employee_number', 'department', 'position'])
            ->map(fn (Employee $employee) => [
                'id' => $employee->id,
                'name' => $employee->full_name,
                'employee_number' => $employee->employee_number,
                'department' => $employee->department,
                'position' => $employee->position,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function supervisorMatchNames($user): array
    {
        $names = [];

        if (filled($user->name)) {
            $names[] = trim((string) $user->name);
        }

        $own = Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->get(['first_name', 'middle_name', 'last_name']);

        foreach ($own as $employee) {
            $full = trim($employee->full_name);
            if ($full !== '') {
                $names[] = $full;
            }
        }

        return array_values(array_unique(array_filter($names)));
    }

    private function supervisorNameForUser($user): string
    {
        $own = Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->first(['first_name', 'middle_name', 'last_name']);

        if ($own && filled($own->full_name)) {
            return $own->full_name;
        }

        return (string) ($user->name ?? '');
    }

    /**
     * @return list<int>
     */
    private function employeeIdsForUser($user): array
    {
        return Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    private function canViewReview($user, PerformanceReview $review): bool
    {
        if ($this->permissions->userHas($user, 'performance.manage')) {
            return true;
        }

        if ((int) $review->reviewed_by_user_id === (int) $user->id) {
            return true;
        }

        return in_array((int) $review->employee_id, $this->employeeIdsForUser($user), true);
    }
}
