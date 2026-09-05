import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import SearchableSelect from '@/Components/SearchableSelect';
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

export default function Create({ employees = [], disciplineLevels = [] }) {
    const defaultLevel =
        disciplineLevels.find((level) => level.name === 'Verbal Warning')?.name ||
        disciplineLevels[0]?.name ||
        'Verbal Warning';

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        incident_date: '',
        offense_type: '',
        discipline_level: defaultLevel,
        incident_description: '',
        action_taken: '',
        next_review_date: '',
    });

    const employeeOptions = employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        employee_number: employee.employee_number,
        department: employee.department,
        position: employee.position,
    }));

    const selectedEmployee = employees.find(
        (employee) => String(employee.id) === String(data.employee_id),
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('discipline.store'));
    };

    const errorMessages = Object.values(errors);

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Add Discipline Record
                </h1>
            }
        >
            <Head title="Add Discipline Record" />

            <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Record progressive discipline details for an employee.
                </p>
                <Link
                    href={route('discipline.index')}
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
                    <Field label="Employee" required>
                        <SearchableSelect
                            value={selectedEmployee?.name ?? ''}
                            onChange={(value) => {
                                const employee = employees.find(
                                    (item) => item.name === value,
                                );
                                setData('employee_id', employee ? String(employee.id) : '');
                            }}
                            options={employeeOptions}
                            placeholder="Select employee"
                            emptyMessage="No employees found"
                            inputClassName={inputClass}
                        />
                        <InputError message={errors.employee_id} />
                    </Field>

                    <Field label="Incident Date" required>
                        <input
                            type="date"
                            className={inputClass}
                            value={data.incident_date}
                            onChange={(e) =>
                                setData('incident_date', e.target.value)
                            }
                        />
                        <InputError message={errors.incident_date} />
                    </Field>

                    <Field label="Offense Type" required>
                        <input
                            className={inputClass}
                            value={data.offense_type}
                            onChange={(e) =>
                                setData('offense_type', e.target.value)
                            }
                            placeholder="Late attendance, policy violation..."
                        />
                        <InputError message={errors.offense_type} />
                    </Field>

                    <Field label="Discipline Level" required>
                        <select
                            className={inputClass}
                            value={data.discipline_level}
                            onChange={(e) =>
                                setData('discipline_level', e.target.value)
                            }
                        >
                            {disciplineLevels.map((level) => (
                                <option key={level.id} value={level.name}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.discipline_level} />
                    </Field>

                    <div className="sm:col-span-2">
                        <Field label="Incident Description" required>
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.incident_description}
                                onChange={(e) =>
                                    setData('incident_description', e.target.value)
                                }
                            />
                            <InputError message={errors.incident_description} />
                        </Field>
                    </div>

                    <div className="sm:col-span-2">
                        <Field label="Action Taken / Notes">
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.action_taken}
                                onChange={(e) =>
                                    setData('action_taken', e.target.value)
                                }
                            />
                            <InputError message={errors.action_taken} />
                        </Field>
                    </div>

                    <Field label="Next Review Date (Optional)">
                        <input
                            type="date"
                            className={inputClass}
                            value={data.next_review_date}
                            onChange={(e) =>
                                setData('next_review_date', e.target.value)
                            }
                        />
                        <InputError message={errors.next_review_date} />
                    </Field>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <Link
                        href={route('discipline.index')}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-40"
                    >
                        Save record
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
