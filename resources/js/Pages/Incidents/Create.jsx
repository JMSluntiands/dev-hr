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

export default function Create({
    incidentTypes,
    employees,
    canChooseEmployee,
    defaults,
    injuryOptions,
}) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        company: defaults.company || 'Luntian',
        employee_id: '',
        location_area: '',
        incident_date: '',
        incident_time: '',
        incident_type_id: '',
        details: '',
        witness: '',
        has_injury: false,
        injury_types: [],
        injury_details: '',
        report_date: defaults.report_date,
        report_time: defaults.report_time,
        action_taken: '',
        attachments: [],
    });

    const toggleInjuryType = (option) => {
        setData(
            'injury_types',
            data.injury_types.includes(option)
                ? data.injury_types.filter((item) => item !== option)
                : [...data.injury_types, option],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('incident.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Incident Report
                </h1>
            }
        >
            <Head title="Incident Report" />

            <div className="mx-auto max-w-3xl space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Company" required>
                                <input
                                    className={inputClass + ' bg-slate-50 dark:bg-slate-800/60'}
                                    value={data.company}
                                    readOnly
                                />
                                <InputError message={errors.company} />
                            </Field>

                            {canChooseEmployee ? (
                                <Field label="Employee Name" required>
                                    <select
                                        className={inputClass}
                                        value={data.employee_id}
                                        onChange={(e) =>
                                            setData('employee_id', e.target.value)
                                        }
                                    >
                                        <option value="">Select employee</option>
                                        {employees.map((employee) => (
                                            <option
                                                key={employee.id}
                                                value={employee.id}
                                            >
                                                {employee.name} ({employee.employee_number})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.employee_id} />
                                </Field>
                            ) : (
                                <Field label="Employee Name" required>
                                    <input
                                        className={
                                            inputClass +
                                            ' bg-slate-50 dark:bg-slate-800/60'
                                        }
                                        value={defaults.employee_name}
                                        readOnly
                                    />
                                </Field>
                            )}
                        </div>

                        <Field label="Specific Area of Location" required>
                            <input
                                className={inputClass}
                                value={data.location_area}
                                onChange={(e) =>
                                    setData('location_area', e.target.value)
                                }
                                placeholder="e.g. Warehouse A, Lobby, Parking"
                            />
                            <InputError message={errors.location_area} />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Date of Incident" required>
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

                            <Field label="Time of Incident" required>
                                <input
                                    type="time"
                                    className={inputClass}
                                    value={data.incident_time}
                                    onChange={(e) =>
                                        setData('incident_time', e.target.value)
                                    }
                                />
                                <InputError message={errors.incident_time} />
                            </Field>
                        </div>

                        <Field label="Incident Type" required>
                            <select
                                className={inputClass}
                                value={data.incident_type_id}
                                onChange={(e) =>
                                    setData('incident_type_id', e.target.value)
                                }
                            >
                                <option value="">Select Incident Type</option>
                                {incidentTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.incident_type_id} />
                        </Field>

                        <Field label="Details of Incident" required>
                            <textarea
                                rows={4}
                                className={inputClass}
                                value={data.details}
                                onChange={(e) =>
                                    setData('details', e.target.value)
                                }
                            />
                            <InputError message={errors.details} />
                        </Field>

                        <Field label="Witness of Incident">
                            <input
                                className={inputClass}
                                value={data.witness}
                                onChange={(e) =>
                                    setData('witness', e.target.value)
                                }
                                placeholder="Name of witness (if any)"
                            />
                            <InputError message={errors.witness} />
                        </Field>

                        <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Safety &amp; Injury <span className="text-red-500">*</span>
                            </p>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="radio"
                                        name="has_injury"
                                        checked={data.has_injury === true}
                                        onChange={() => setData('has_injury', true)}
                                        className="text-teal-600 focus:ring-teal-500"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="radio"
                                        name="has_injury"
                                        checked={data.has_injury === false}
                                        onChange={() => {
                                            setData('has_injury', false);
                                            setData('injury_types', []);
                                            setData('injury_details', '');
                                        }}
                                        className="text-teal-600 focus:ring-teal-500"
                                    />
                                    No
                                </label>
                            </div>
                            <InputError message={errors.has_injury} />

                            {data.has_injury && (
                                <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Types of Injuries
                                        </p>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {injuryOptions.map((option) => (
                                                <label
                                                    key={option}
                                                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={data.injury_types.includes(
                                                            option,
                                                        )}
                                                        onChange={() =>
                                                            toggleInjuryType(option)
                                                        }
                                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={errors.injury_types} />
                                    </div>

                                    <Field label="Additional Injury Details" required>
                                        <textarea
                                            rows={3}
                                            className={inputClass}
                                            value={data.injury_details}
                                            onChange={(e) =>
                                                setData(
                                                    'injury_details',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.injury_details} />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Report Filling Date" required>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={data.report_date}
                                    onChange={(e) =>
                                        setData('report_date', e.target.value)
                                    }
                                />
                                <InputError message={errors.report_date} />
                            </Field>

                            <Field label="Time Report" required>
                                <input
                                    type="time"
                                    className={inputClass}
                                    value={data.report_time}
                                    onChange={(e) =>
                                        setData('report_time', e.target.value)
                                    }
                                />
                                <InputError message={errors.report_time} />
                            </Field>
                        </div>

                        <Field label="Action Taken">
                            <textarea
                                rows={3}
                                className={inputClass}
                                value={data.action_taken}
                                onChange={(e) =>
                                    setData('action_taken', e.target.value)
                                }
                            />
                            <InputError message={errors.action_taken} />
                        </Field>

                        <Field label="Attachments">
                            <input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200"
                                onChange={(e) =>
                                    setData(
                                        'attachments',
                                        Array.from(e.target.files || []),
                                    )
                                }
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                You can upload multiple files (jpg, png, pdf, doc).
                            </p>
                            <InputError message={errors.attachments} />
                            {errors['attachments.0'] && (
                                <InputError message={errors['attachments.0']} />
                            )}
                        </Field>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <Link
                                href={route('incident.index')}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50"
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
