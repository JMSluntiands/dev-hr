import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const inputClass =
    'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white';

export default function Settings({ types = [], canManage = false }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({
        name: '',
        code_prefix: '',
        is_active: true,
        sort_order: types.length + 1,
    });

    const editForm = useForm({
        name: '',
        code_prefix: '',
        is_active: true,
        sort_order: 0,
    });

    const startEdit = (type) => {
        setEditingId(type.id);
        editForm.setData({
            name: type.name,
            code_prefix: type.code_prefix,
            is_active: type.is_active,
            sort_order: type.sort_order,
        });
        editForm.clearErrors();
    };

    const cancelEdit = () => {
        setEditingId(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('inventory.settings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                createForm.setData('sort_order', types.length + 2);
                createForm.setData('is_active', true);
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('inventory.settings.update', editingId), {
            preserveScroll: true,
            onSuccess: () => cancelEdit(),
        });
    };

    const removeType = (type) => {
        if (
            !window.confirm(
                `Remove "${type.name}" (${type.code_prefix}) from inventory settings?`,
            )
        ) {
            return;
        }

        editForm.delete(route('inventory.settings.destroy', type.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Inventory Setting
                </h1>
            }
        >
            <Head title="Inventory Setting" />

            {flash?.success && (
                <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {flash.success}
                </div>
            )}

            <div className="mb-4 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
                Item description codes used when adding inventory items
            </div>

            <div className="space-y-4">
                {canManage && (
                    <form
                        onSubmit={submitCreate}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                        <h2 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">
                            Add item description
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-4">
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Item description
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData('name', e.target.value)
                                    }
                                    placeholder="e.g. Laptop"
                                    className={inputClass}
                                />
                                <InputError
                                    message={createForm.errors.name}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.code_prefix}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'code_prefix',
                                            e.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="e.g. LAP-"
                                    className={inputClass}
                                />
                                <InputError
                                    message={createForm.errors.code_prefix}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/60">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Item description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Status
                                </th>
                                {canManage && (
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {types.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={canManage ? 4 : 3}
                                        className="px-4 py-8 text-center text-slate-500"
                                    >
                                        No item descriptions yet.
                                    </td>
                                </tr>
                            ) : (
                                types.map((type) =>
                                    editingId === type.id ? (
                                        <tr key={type.id} className="bg-teal-50/40 dark:bg-teal-950/20">
                                            <td className="px-4 py-3" colSpan={canManage ? 4 : 3}>
                                                <form
                                                    onSubmit={submitEdit}
                                                    className="grid gap-3 sm:grid-cols-5"
                                                >
                                                    <input
                                                        type="text"
                                                        value={editForm.data.name}
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editForm.data.code_prefix}
                                                        onChange={(e) =>
                                                            editForm.setData(
                                                                'code_prefix',
                                                                e.target.value.toUpperCase(),
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />
                                                    <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                                                        <input
                                                            type="checkbox"
                                                            checked={editForm.data.is_active}
                                                            onChange={(e) =>
                                                                editForm.setData(
                                                                    'is_active',
                                                                    e.target.checked,
                                                                )
                                                            }
                                                        />
                                                        Active
                                                    </label>
                                                    <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={editForm.processing}
                                                            className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            editForm.errors.name ||
                                                            editForm.errors.code_prefix
                                                        }
                                                        className="sm:col-span-5"
                                                    />
                                                </form>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={type.id}>
                                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                                                {type.name}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-200">
                                                {type.code_prefix}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        'inline-flex rounded-md px-2 py-1 text-xs font-semibold ' +
                                                        (type.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                                                    }
                                                >
                                                    {type.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            {canManage && (
                                                <td className="px-4 py-3 text-right">
                                                    <div className="inline-flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(type)}
                                                            className="text-sm font-semibold text-teal-700 hover:text-teal-600 dark:text-teal-400"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeType(type)}
                                                            className="text-sm font-semibold text-rose-600 hover:text-rose-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ),
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
