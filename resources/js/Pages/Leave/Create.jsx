import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

function Field({ label, required = false, children }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
                {required && <span className="text-teal-600"> *</span>}
            </span>
            {children}
        </label>
    );
}

const inputClass =
    'block w-full rounded-xl border-0 bg-[#eef3f8] px-3.5 py-2.5 text-slate-800 shadow-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

export default function Create({ leaveTypes = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('leave.store'));
    };

    const errorMessages = Object.values(errors);

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Request leave
                </h1>
            }
        >
            <Head title="Request leave" />

            <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Fill out leave type, dates, and reason for approval.
                </p>
                <Link
                    href={route('leave.request')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>
            </div>

            <form
                onSubmit={submit}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6"
            >
                {errorMessages.length > 0 && (
                    <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                        Please fix the highlighted fields below before saving.
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Field label="Leave Type" required>
                            <select
                                className={inputClass}
                                value={data.leave_type}
                                onChange={(e) =>
                                    setData('leave_type', e.target.value)
                                }
                            >
                                <option value="">Select leave type</option>
                                {leaveTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.leave_type} />
                        </Field>
                    </div>

                    <Field label="Start Date" required>
                        <input
                            type="date"
                            className={inputClass}
                            value={data.start_date}
                            onChange={(e) =>
                                setData('start_date', e.target.value)
                            }
                        />
                        <InputError message={errors.start_date} />
                    </Field>

                    <Field label="End Date" required>
                        <input
                            type="date"
                            className={inputClass}
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                        />
                        <InputError message={errors.end_date} />
                    </Field>

                    <div className="sm:col-span-2">
                        <Field label="Reason" required>
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.reason}
                                onChange={(e) =>
                                    setData('reason', e.target.value)
                                }
                            />
                            <InputError message={errors.reason} />
                        </Field>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <Link
                        href={route('leave.request')}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-40"
                    >
                        Submit request
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
