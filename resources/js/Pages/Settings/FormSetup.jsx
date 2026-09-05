import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import useCan from '@/hooks/useCan';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'luntian-form-setup-category';

const inputClass =
    'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

function TypeCrud({
    title,
    description,
    items,
    canManage,
    storeRoute,
    updateRoute,
    destroyRoute,
    emptyLabel,
    category = null,
}) {
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({
        name: '',
        is_active: true,
        sort_order: items.length + 1,
    });

    const editForm = useForm({
        name: '',
        is_active: true,
        sort_order: 0,
    });

    useEffect(() => {
        setEditingId(null);
        createForm.setData({
            name: '',
            is_active: true,
            sort_order: items.length + 1,
        });
        createForm.clearErrors();
        editForm.reset();
        editForm.clearErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, items.length]);

    const storeUrl = category
        ? route(storeRoute, category)
        : route(storeRoute);
    const updateUrl = (id) =>
        category
            ? route(updateRoute, { category, formOption: id })
            : route(updateRoute, id);
    const destroyUrl = (id) =>
        category
            ? route(destroyRoute, { category, formOption: id })
            : route(destroyRoute, id);

    const startEdit = (type) => {
        setEditingId(type.id);
        editForm.setData({
            name: type.name,
            is_active: type.is_active,
            sort_order: type.sort_order,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(storeUrl, {
            preserveScroll: true,
            onSuccess: () => createForm.reset('name'),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(updateUrl(editingId), {
            preserveScroll: true,
            onSuccess: () => cancelEdit(),
        });
    };

    const deleteType = (id) => {
        if (!confirm(`Delete this ${title.toLowerCase()}?`)) {
            return;
        }

        router.delete(destroyUrl(id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {description}
                </p>
            </div>

            {canManage && (
                <form
                    onSubmit={submitCreate}
                    className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[1fr_120px_120px_auto] dark:border-slate-700"
                >
                    <div>
                        <input
                            type="text"
                            placeholder={`${title} name`}
                            className={inputClass}
                            value={createForm.data.name}
                            onChange={(e) =>
                                createForm.setData('name', e.target.value)
                            }
                        />
                        <InputError
                            message={createForm.errors.name}
                            className="mt-1"
                        />
                    </div>
                    <input
                        type="number"
                        min="0"
                        placeholder="Sort"
                        className={inputClass}
                        value={createForm.data.sort_order}
                        onChange={(e) =>
                            createForm.setData('sort_order', e.target.value)
                        }
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <input
                            type="checkbox"
                            checked={createForm.data.is_active}
                            onChange={(e) =>
                                createForm.setData('is_active', e.target.checked)
                            }
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        Active
                    </label>
                    <button
                        type="submit"
                        disabled={createForm.processing}
                        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
                    >
                        Add
                    </button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                Sort
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                Status
                            </th>
                            {canManage && (
                                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={canManage ? 4 : 3}
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    {emptyLabel}
                                </td>
                            </tr>
                        ) : (
                            items.map((type) => (
                                <tr key={type.id}>
                                    {editingId === type.id ? (
                                        <>
                                            <td className="px-4 py-3">
                                                <input
                                                    className={inputClass}
                                                    value={editForm.data.name}
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={editForm.errors.name}
                                                    className="mt-1"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className={inputClass}
                                                    value={editForm.data.sort_order}
                                                    onChange={(e) =>
                                                        editForm.setData(
                                                            'sort_order',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            editForm.data.is_active
                                                        }
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                'is_active',
                                                                e.target.checked,
                                                            )
                                                        }
                                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                                    />
                                                    Active
                                                </label>
                                            </td>
                                            <td className="px-4 py-3">
                                                <form
                                                    onSubmit={submitEdit}
                                                    className="flex gap-2"
                                                >
                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            editForm.processing
                                                        }
                                                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                {type.name}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {type.sort_order}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        'inline-flex rounded-md px-2 py-1 text-xs font-medium ' +
                                                        (type.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                                                    }
                                                >
                                                    {type.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            {canManage && (
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEdit(type)
                                                            }
                                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteType(type.id)
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:text-red-400"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function buildCategories({
    expenseTypes,
    incidentTypes,
    employmentTypes,
    employmentStatuses,
    formOptions,
    formOptionCategories,
}) {
    const fixed = [
        {
            id: 'expense_type',
            group: 'Reimburse',
            label: 'Expense Type',
            description: 'Manage dropdown options for the reimbursement form.',
            items: expenseTypes,
            props: {
                storeRoute: 'settings.form-setup.expense-types.store',
                updateRoute: 'settings.form-setup.expense-types.update',
                destroyRoute: 'settings.form-setup.expense-types.destroy',
            },
        },
        {
            id: 'incident_type',
            group: 'Incident',
            label: 'Incident Type',
            description: 'Manage dropdown options for the incident report form.',
            items: incidentTypes,
            props: {
                storeRoute: 'settings.form-setup.incident-types.store',
                updateRoute: 'settings.form-setup.incident-types.update',
                destroyRoute: 'settings.form-setup.incident-types.destroy',
            },
        },
        {
            id: 'employment_type',
            group: 'Employees',
            label: 'Employment Type',
            description: 'Manage dropdown options for employee employment type.',
            items: employmentTypes,
            props: {
                storeRoute: 'settings.form-setup.employment-types.store',
                updateRoute: 'settings.form-setup.employment-types.update',
                destroyRoute: 'settings.form-setup.employment-types.destroy',
            },
        },
        {
            id: 'employment_status',
            group: 'Employees',
            label: 'Employment Status',
            description: 'Manage dropdown options for employee employment status.',
            items: employmentStatuses,
            props: {
                storeRoute: 'settings.form-setup.employment-statuses.store',
                updateRoute: 'settings.form-setup.employment-statuses.update',
                destroyRoute: 'settings.form-setup.employment-statuses.destroy',
            },
        },
    ];

    const dynamic = formOptionCategories.map((category) => {
        const group =
            category.key === 'leave_type'
                ? 'Leave'
                : category.key === 'injury_type'
                  ? 'Incident'
                  : category.key === 'discipline_level'
                    ? 'Discipline'
                    : 'Employees';

        return {
            id: category.key,
            group,
            label: category.label,
            description: category.description,
            items: formOptions[category.key] || [],
            props: {
                category: category.key,
                storeRoute: 'settings.form-setup.options.store',
                updateRoute: 'settings.form-setup.options.update',
                destroyRoute: 'settings.form-setup.options.destroy',
            },
        };
    });

    return [...fixed, ...dynamic];
}

export default function FormSetup({
    expenseTypes = [],
    incidentTypes = [],
    employmentTypes = [],
    employmentStatuses = [],
    formOptions = {},
    formOptionCategories = [],
}) {
    const { flash } = usePage().props;
    const canManage = useCan('settings.form_setup.manage');
    const [search, setSearch] = useState('');
    const [activeId, setActiveId] = useState(null);

    const categories = useMemo(
        () =>
            buildCategories({
                expenseTypes,
                incidentTypes,
                employmentTypes,
                employmentStatuses,
                formOptions,
                formOptionCategories,
            }),
        [
            expenseTypes,
            incidentTypes,
            employmentTypes,
            employmentStatuses,
            formOptions,
            formOptionCategories,
        ],
    );

    useEffect(() => {
        const saved =
            typeof window !== 'undefined'
                ? window.sessionStorage.getItem(STORAGE_KEY)
                : null;
        const exists = categories.some((category) => category.id === saved);
        setActiveId(exists ? saved : categories[0]?.id || null);
    }, [categories]);

    const selectCategory = (id) => {
        setActiveId(id);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(STORAGE_KEY, id);
        }
    };

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return categories;
        }

        return categories.filter(
            (category) =>
                category.label.toLowerCase().includes(query) ||
                category.group.toLowerCase().includes(query) ||
                category.description.toLowerCase().includes(query),
        );
    }, [categories, search]);

    const grouped = useMemo(() => {
        const groups = {};
        filteredCategories.forEach((category) => {
            if (!groups[category.group]) {
                groups[category.group] = [];
            }
            groups[category.group].push(category);
        });
        return groups;
    }, [filteredCategories]);

    const activeCategory =
        categories.find((category) => category.id === activeId) ||
        filteredCategories[0] ||
        categories[0] ||
        null;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Form Set Up
                </h1>
            }
        >
            <Head title="Form Set Up" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                        {flash.error}
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-4 lg:self-start">
                        <div className="mb-3">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Categories
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Search or pick a dropdown to manage.
                            </p>
                        </div>

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search category…"
                            className={inputClass + ' mb-3'}
                        />

                        <div className="mb-3 lg:hidden">
                            <select
                                className={inputClass}
                                value={activeCategory?.id || ''}
                                onChange={(e) => selectCategory(e.target.value)}
                            >
                                {filteredCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.group} · {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="hidden max-h-[70vh] space-y-4 overflow-y-auto pr-1 lg:block">
                            {Object.keys(grouped).length === 0 ? (
                                <p className="px-2 py-6 text-center text-sm text-slate-500">
                                    No matching category.
                                </p>
                            ) : (
                                Object.entries(grouped).map(
                                    ([group, items]) => (
                                        <div key={group}>
                                            <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                {group}
                                            </div>
                                            <div className="space-y-1">
                                                {items.map((category) => {
                                                    const isActive =
                                                        activeCategory?.id ===
                                                        category.id;

                                                    return (
                                                        <button
                                                            key={category.id}
                                                            type="button"
                                                            onClick={() =>
                                                                selectCategory(
                                                                    category.id,
                                                                )
                                                            }
                                                            className={
                                                                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ' +
                                                                (isActive
                                                                    ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                                                                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800')
                                                            }
                                                        >
                                                            <span>
                                                                {category.label}
                                                            </span>
                                                            <span
                                                                className={
                                                                    'ml-2 rounded-md px-1.5 py-0.5 text-[11px] font-medium ' +
                                                                    (isActive
                                                                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200'
                                                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')
                                                                }
                                                            >
                                                                {
                                                                    category
                                                                        .items
                                                                        .length
                                                                }
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ),
                                )
                            )}
                        </div>
                    </aside>

                    <div>
                        {activeCategory ? (
                            <TypeCrud
                                key={activeCategory.id}
                                title={activeCategory.label}
                                description={activeCategory.description}
                                items={activeCategory.items}
                                canManage={canManage}
                                emptyLabel={`No ${activeCategory.label.toLowerCase()} options yet.`}
                                {...activeCategory.props}
                            />
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-16 text-center text-slate-500 dark:border-slate-700">
                                Select a category to manage its options.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
