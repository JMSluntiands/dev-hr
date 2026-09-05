import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

function roleLabel(role) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

function initials(name = '') {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export default function Permissions({
    permissionGroups,
    accounts,
    accountPermissions,
}) {
    const { flash } = usePage().props;
    const firstAccountId = accounts[0]?.id ?? null;
    const firstTab = permissionGroups[0]?.group ?? null;
    const [activeUserId, setActiveUserId] = useState(firstAccountId);
    const [activeTab, setActiveTab] = useState(firstTab);
    const [selected, setSelected] = useState(
        firstAccountId ? accountPermissions[firstAccountId] || [] : [],
    );
    const [saving, setSaving] = useState(false);

    const activeAccount = useMemo(
        () => accounts.find((account) => account.id === activeUserId) || null,
        [accounts, activeUserId],
    );

    const activeGroup = useMemo(
        () =>
            permissionGroups.find((group) => group.group === activeTab) ||
            permissionGroups[0] ||
            null,
        [permissionGroups, activeTab],
    );

    useEffect(() => {
        if (!activeUserId && accounts[0]) {
            setActiveUserId(accounts[0].id);
        }
    }, [accounts, activeUserId]);

    useEffect(() => {
        if (
            permissionGroups.length > 0 &&
            !permissionGroups.some((group) => group.group === activeTab)
        ) {
            setActiveTab(permissionGroups[0].group);
        }
    }, [permissionGroups, activeTab]);

    useEffect(() => {
        if (!activeUserId) {
            setSelected([]);
            return;
        }

        setSelected(accountPermissions[activeUserId] || []);
    }, [activeUserId, accountPermissions]);

    const toggle = (key) => {
        setSelected((current) =>
            current.includes(key)
                ? current.filter((item) => item !== key)
                : [...current, key],
        );
    };

    const toggleGroup = (keys, checked) => {
        setSelected((current) => {
            if (checked) {
                return [...new Set([...current, ...keys])];
            }

            return current.filter((key) => !keys.includes(key));
        });
    };

    const tabCount = (group) => {
        const keys = group.items.map((item) => item.key);
        return keys.filter((key) => selected.includes(key)).length;
    };

    const save = () => {
        if (!activeUserId) {
            return;
        }

        setSaving(true);
        router.put(
            route('settings.permissions.update'),
            {
                user_id: activeUserId,
                permissions: selected,
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Permissions
                </h1>
            }
        >
            <Head title="Permissions" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Account permissions
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Choose an account, then open a function tab (Employees,
                            Attendance, Leave, …) to set access.
                        </p>
                    </div>

                    {accounts.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                            <p className="font-medium text-slate-800 dark:text-white">
                                No synced accounts yet
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Permissions appear here after users sign in with
                                Google Workspace.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-0 border-b border-slate-200 dark:border-slate-700 lg:grid-cols-[280px_1fr]">
                                <div className="max-h-[32rem] overflow-y-auto border-b border-slate-200 dark:border-slate-700 lg:border-b-0 lg:border-r">
                                    <div className="border-b border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-700">
                                        Accounts
                                    </div>
                                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {accounts.map((account) => {
                                            const isActive =
                                                account.id === activeUserId;

                                            return (
                                                <li key={account.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveUserId(
                                                                account.id,
                                                            )
                                                        }
                                                        className={
                                                            'flex w-full items-center gap-3 px-4 py-3 text-left transition ' +
                                                            (isActive
                                                                ? 'bg-teal-50 dark:bg-teal-950/40'
                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50')
                                                        }
                                                    >
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                                                            {initials(
                                                                account.name,
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div
                                                                className={
                                                                    'truncate text-sm font-medium ' +
                                                                    (isActive
                                                                        ? 'text-teal-900 dark:text-teal-200'
                                                                        : 'text-slate-900 dark:text-white')
                                                                }
                                                            >
                                                                {account.name}
                                                            </div>
                                                            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                                {account.email}
                                                            </div>
                                                            <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                                {roleLabel(
                                                                    account.role,
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="min-w-0">
                                    {activeAccount && (
                                        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {activeAccount.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {activeAccount.email} ·{' '}
                                                {roleLabel(activeAccount.role)}
                                            </p>
                                        </div>
                                    )}

                                    <div
                                        className="flex gap-1 overflow-x-auto border-b border-slate-200 px-2 pt-2 dark:border-slate-700"
                                        role="tablist"
                                        aria-label="Permission functions"
                                    >
                                        {permissionGroups.map((group) => {
                                            const isActive =
                                                group.group ===
                                                (activeGroup?.group ??
                                                    activeTab);
                                            const enabled = tabCount(group);

                                            return (
                                                <button
                                                    key={group.group}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={isActive}
                                                    onClick={() =>
                                                        setActiveTab(
                                                            group.group,
                                                        )
                                                    }
                                                    className={
                                                        'shrink-0 rounded-t-lg px-3 py-2 text-sm font-semibold transition ' +
                                                        (isActive
                                                            ? 'border border-b-0 border-slate-200 bg-white text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-teal-300'
                                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200')
                                                    }
                                                >
                                                    {group.group}
                                                    <span
                                                        className={
                                                            'ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold ' +
                                                            (enabled > 0
                                                                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300'
                                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')
                                                        }
                                                    >
                                                        {enabled}/
                                                        {group.items.length}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="p-4" role="tabpanel">
                                        {activeGroup ? (
                                            <>
                                                <div className="mb-3 flex items-center justify-between gap-3">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {activeGroup.group}{' '}
                                                            functions
                                                        </h3>
                                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                            Toggle access for
                                                            this module only.
                                                        </p>
                                                    </div>
                                                    <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <input
                                                            type="checkbox"
                                                            checked={activeGroup.items.every(
                                                                (item) =>
                                                                    selected.includes(
                                                                        item.key,
                                                                    ),
                                                            )}
                                                            onChange={(e) =>
                                                                toggleGroup(
                                                                    activeGroup.items.map(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item.key,
                                                                    ),
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                        Select all
                                                    </label>
                                                </div>

                                                <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                                                    {activeGroup.items.map(
                                                        (permission) => (
                                                            <label
                                                                key={
                                                                    permission.key
                                                                }
                                                                className="flex cursor-pointer items-start gap-3 border-b border-slate-100 px-3 py-3 last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selected.includes(
                                                                        permission.key,
                                                                    )}
                                                                    onChange={() =>
                                                                        toggle(
                                                                            permission.key,
                                                                        )
                                                                    }
                                                                    className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                                                />
                                                                <span className="min-w-0">
                                                                    <span className="block font-medium text-slate-900 dark:text-white">
                                                                        {
                                                                            permission.label
                                                                        }
                                                                    </span>
                                                                    {permission.description && (
                                                                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                                                                            {
                                                                                permission.description
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    <span className="mt-1 block font-mono text-[11px] text-slate-400">
                                                                        {
                                                                            permission.key
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm text-slate-500">
                                                No permission groups available.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={save}
                                    disabled={saving || !activeUserId}
                                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-40"
                                >
                                    Save permissions
                                    {activeAccount
                                        ? ` for ${activeAccount.name}`
                                        : ''}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
