<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $this->permissions->syncDefinitions();
        $this->permissions->grantMissingPermissionKey('activity_log.view');
        abort_unless($this->permissions->userHas($user->fresh(), 'activity_log.view'), 403);

        $search = trim((string) $request->string('search'));
        $module = trim((string) $request->string('module'));
        $perPage = (int) $request->integer('per_page', 25);

        if (! in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 25;
        }

        $canViewAll = in_array($user->role, ['admin', 'hr', 'manager'], true);

        $modules = ActivityLog::query()
            ->when(! $canViewAll, fn ($query) => $query->where('user_id', $user->id))
            ->select('module')
            ->distinct()
            ->orderBy('module')
            ->pluck('module');

        $logs = ActivityLog::query()
            ->with(['user:id,name,email'])
            ->when(! $canViewAll, fn ($query) => $query->where('user_id', $user->id))
            ->when($module !== '', fn ($query) => $query->where('module', $module))
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('description', 'like', $like)
                        ->orWhere('action', 'like', $like)
                        ->orWhere('module', 'like', $like)
                        ->orWhereHas('user', function ($userQuery) use ($like) {
                            $userQuery->where('name', 'like', $like)
                                ->orWhere('email', 'like', $like);
                        });
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (ActivityLog $log) => [
                'id' => $log->id,
                'module' => $log->module,
                'action' => $log->action,
                'description' => $log->description,
                'user_name' => $log->user?->name ?? 'System',
                'user_email' => $log->user?->email,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('ActivityLog/Index', [
            'logs' => $logs,
            'modules' => $modules,
            'canViewAll' => $canViewAll,
            'filters' => [
                'search' => $search,
                'module' => $module,
                'per_page' => $perPage,
            ],
        ]);
    }
}
