import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

function Field({ label, required = false, optional = false, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
                {required && <span className="text-red-500"> *</span>}
                {optional && (
                    <span className="font-normal text-slate-500"> (optional)</span>
                )}
            </span>
            {children}
        </label>
    );
}

const inputClass =
    'block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const readOnlyClass =
    'block w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200';

export default function Create({ nextItemCode = '' }) {
    const { data, setData, post, processing, errors } = useForm({
        item_name: '',
        details: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory.request.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    New request
                </h1>
            }
        >
            <Head title="New request" />

            <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Submit a new inventory item request.
                </p>
                <Link
                    href={route('inventory.request')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>
            </div>

            <div className="mx-auto max-w-2xl">
                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-8"
                >
                    <div className="space-y-5">
                        <Field label="Request number" required>
                            <input
                                type="text"
                                readOnly
                                className={readOnlyClass}
                                value={nextItemCode}
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Auto-generated as YYYYMMDD-000 (assigned on submit).
                            </p>
                            <InputError message={errors.item_code} />
                        </Field>

                        <Field label="Item name" required>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="e.g. Laptop, Mouse, Monitor"
                                value={data.item_name}
                                onChange={(e) =>
                                    setData('item_name', e.target.value)
                                }
                            />
                            <InputError message={errors.item_name} />
                        </Field>

                        <Field label="Details" optional>
                            <textarea
                                rows={4}
                                className={inputClass}
                                placeholder="Specifications, quantity, or reason for the request"
                                value={data.details}
                                onChange={(e) =>
                                    setData('details', e.target.value)
                                }
                            />
                            <InputError message={errors.details} />
                        </Field>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e69816] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Submitting...' : 'Submit request'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
