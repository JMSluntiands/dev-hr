import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function Field({ label, required = false, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
                {required && <span className="text-red-500"> *</span>}
            </span>
            {children}
        </label>
    );
}

const inputClass =
    'block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

export default function Create({ expenseTypes }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        expense_type_id: '',
        is_bulk: false,
        description: '',
        purchased_date: '',
        amount: '',
        notes: '',
        receipt: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('reimburse.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    New reimbursement request
                </h1>
            }
        >
            <Head title="New reimbursement request" />

            <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Fill out expense details and attach a receipt if available.
                </p>
                <Link
                    href={route('reimburse.list')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <label className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                            <input
                                type="checkbox"
                                checked={data.is_bulk}
                                onChange={(e) =>
                                    setData('is_bulk', e.target.checked)
                                }
                                className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                Bulk Reimbursement (submit multiple items in
                                one request)
                            </span>
                        </label>

                        <Field label="Expense Type" required>
                            <select
                                className={inputClass}
                                value={data.expense_type_id}
                                onChange={(e) =>
                                    setData('expense_type_id', e.target.value)
                                }
                            >
                                <option value="">Select Expense Type</option>
                                {expenseTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.expense_type_id} />
                        </Field>

                        <Field label="Expense Description" required>
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Purchased Date" required>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={data.purchased_date}
                                    onChange={(e) =>
                                        setData(
                                            'purchased_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.purchased_date} />
                            </Field>

                            <Field label="Amount (PHP)" required>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    className={inputClass}
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                />
                                <InputError message={errors.amount} />
                            </Field>
                        </div>

                        <Field label="Notes">
                            <textarea
                                rows={3}
                                className={inputClass}
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                            />
                            <InputError message={errors.notes} />
                        </Field>

                        <Field label="Upload Receipt / Photo">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200"
                                onChange={(e) =>
                                    setData('receipt', e.target.files[0] ?? null)
                                }
                            />
                            <InputError message={errors.receipt} />
                        </Field>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href={route('reimburse.list')}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
