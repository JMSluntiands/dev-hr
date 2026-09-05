import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import SearchableSelect from '@/Components/SearchableSelect';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

function Section({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
            <div className="mb-5 border-b border-slate-100 pb-4 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        </section>
    );
}

export default function Edit({
    employee,
    employmentTypes = [],
    employmentStatuses = [],
    genders = [],
    civilStatuses = [],
    departments = [],
    emergencyContactRelations = [],
    supervisors = [],
}) {
    const { data, setData, put, post, transform, processing, errors } = useForm({
        photo: null,
        remove_photo: false,
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        date_of_birth: employee.date_of_birth || '',
        gender: employee.gender || '',
        civil_status: employee.civil_status || '',
        address: employee.address || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_relation: employee.emergency_contact_relation || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        emergency_contact_same_address:
            employee.emergency_contact_same_address ?? false,
        emergency_contact_address: employee.emergency_contact_address || '',
        department: employee.department || '',
        position: employee.position || '',
        employment_type: employee.employment_type || '',
        date_hired: employee.date_hired || '',
        employment_status: employee.employment_status || '',
        work_location: employee.work_location || '',
        immediate_supervisor: employee.immediate_supervisor || '',
        tin: employee.tin || '',
        sss_number: employee.sss_number || '',
        philhealth_number: employee.philhealth_number || '',
        pagibig_number: employee.pagibig_number || '',
        nbi_clearance: employee.nbi_clearance || '',
        police_clearance: employee.police_clearance || '',
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    const displayPhoto =
        photoPreview ||
        (!data.remove_photo ? employee.photo_url : null);

    const submit = (e) => {
        e.preventDefault();

        if (data.photo instanceof File) {
            transform((formData) => ({
                ...formData,
                _method: 'put',
            }));

            post(route('employees.update', employee.id), {
                forceFormData: true,
            });

            return;
        }

        put(route('employees.update', employee.id));
    };

    const errorMessages = Object.values(errors);

    const handlePhotoChange = (event) => {
        const file = event.target.files[0] ?? null;
        setData((current) => ({
            ...current,
            photo: file,
            remove_photo: false,
        }));

        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }

        setPhotoPreview(file ? URL.createObjectURL(file) : null);
    };

    const toggleRemovePhoto = (checked) => {
        setData((current) => ({
            ...current,
            remove_photo: checked,
            photo: checked ? null : current.photo,
        }));

        if (checked && photoPreview) {
            URL.revokeObjectURL(photoPreview);
            setPhotoPreview(null);
        }
    };

    const toggleSameAddress = (checked) => {
        setData((current) => ({
            ...current,
            emergency_contact_same_address: checked,
            emergency_contact_address: checked ? '' : current.emergency_contact_address,
        }));
    };

    useEffect(() => {
        if (data.emergency_contact_same_address) {
            setData('emergency_contact_address', data.address);
        }
    }, [data.address, data.emergency_contact_same_address]);

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Edit employee
                </h1>
            }
        >
            <Head title={`Edit ${employee.full_name}`} />

            <div className="mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Update personal, employment, and government information.
                </p>
                <Link
                    href={route('employees.index')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {errorMessages.length > 0 && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                        Please fix the highlighted fields below before saving.
                    </div>
                )}

                <Section
                    title="Personal Information"
                    description="Basic identity and contact details of the employee."
                >
                    <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-600 text-sm font-semibold text-white">
                            {displayPhoto ? (
                                <img
                                    src={displayPhoto}
                                    alt={employee.full_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                'Photo'
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <Field label="Employee photo">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePhotoChange}
                                    className={inputClass}
                                />
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    JPG, PNG, or WEBP. Max 2MB.
                                </p>
                                <InputError message={errors.photo} />
                            </Field>
                            {employee.photo_url && (
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={data.remove_photo}
                                        onChange={(e) =>
                                            toggleRemovePhoto(e.target.checked)
                                        }
                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                                    />
                                    Remove current photo
                                </label>
                            )}
                        </div>
                    </div>

                    <Field label="First name" required>
                        <input
                            className={inputClass}
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} />
                    </Field>

                    <Field label="Middle name">
                        <input
                            className={inputClass}
                            value={data.middle_name}
                            onChange={(e) => setData('middle_name', e.target.value)}
                        />
                        <InputError message={errors.middle_name} />
                    </Field>

                    <Field label="Last name" required>
                        <input
                            className={inputClass}
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} />
                    </Field>

                    <Field label="Email" required>
                        <input
                            type="email"
                            className={inputClass}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@luntiands.com"
                        />
                        <InputError message={errors.email} />
                    </Field>

                    <Field label="Phone">
                        <input
                            className={inputClass}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <InputError message={errors.phone} />
                    </Field>

                    <Field label="Date of birth">
                        <input
                            type="date"
                            className={inputClass}
                            value={data.date_of_birth}
                            onChange={(e) =>
                                setData('date_of_birth', e.target.value)
                            }
                        />
                        <InputError message={errors.date_of_birth} />
                    </Field>

                    <Field label="Gender">
                        <select
                            className={inputClass}
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            <option value="">Select gender</option>
                            {genders.map((option) => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.gender} />
                    </Field>

                    <Field label="Civil status">
                        <select
                            className={inputClass}
                            value={data.civil_status}
                            onChange={(e) =>
                                setData('civil_status', e.target.value)
                            }
                        >
                            <option value="">Select status</option>
                            {civilStatuses.map((option) => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.civil_status} />
                    </Field>

                    <div className="sm:col-span-2">
                        <Field label="Address">
                            <textarea
                                rows={3}
                                className={inputClass}
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                            <InputError message={errors.address} />
                        </Field>
                    </div>

                    <Field label="Emergency contact name">
                        <input
                            className={inputClass}
                            value={data.emergency_contact_name}
                            onChange={(e) =>
                                setData('emergency_contact_name', e.target.value)
                            }
                        />
                        <InputError message={errors.emergency_contact_name} />
                    </Field>

                    <Field label="Relation">
                        <select
                            className={inputClass}
                            value={data.emergency_contact_relation}
                            onChange={(e) =>
                                setData(
                                    'emergency_contact_relation',
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">Select relation</option>
                            {emergencyContactRelations.map((option) => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.emergency_contact_relation}
                        />
                    </Field>

                    <Field label="Emergency contact phone">
                        <input
                            className={inputClass}
                            value={data.emergency_contact_phone}
                            onChange={(e) =>
                                setData(
                                    'emergency_contact_phone',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError message={errors.emergency_contact_phone} />
                    </Field>

                    <div className="sm:col-span-2">
                        <label className="flex items-start gap-3 rounded-xl bg-[#eef3f8] px-3.5 py-3 dark:bg-slate-900">
                            <input
                                type="checkbox"
                                checked={data.emergency_contact_same_address}
                                onChange={(e) =>
                                    toggleSameAddress(e.target.checked)
                                }
                                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                Same as employee address
                            </span>
                        </label>
                        <InputError
                            message={errors.emergency_contact_same_address}
                        />
                    </div>

                    {!data.emergency_contact_same_address && (
                        <div className="sm:col-span-2">
                            <Field label="Emergency contact address">
                                <textarea
                                    rows={3}
                                    className={inputClass}
                                    value={data.emergency_contact_address}
                                    onChange={(e) =>
                                        setData(
                                            'emergency_contact_address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter emergency contact address"
                                />
                                <InputError
                                    message={errors.emergency_contact_address}
                                />
                            </Field>
                        </div>
                    )}
                </Section>

                <Section
                    title="Employment Information"
                    description="Job role, department, and employment details. Employee ID stays the same after creation."
                >
                    <Field label="Date hired" required>
                        <input
                            type="date"
                            className={inputClass}
                            value={data.date_hired}
                            onChange={(e) =>
                                setData('date_hired', e.target.value)
                            }
                        />
                        <InputError message={errors.date_hired} />
                    </Field>

                    <Field label="Employee ID">
                        <input
                            className={
                                inputClass + ' cursor-not-allowed opacity-80'
                            }
                            value={employee.employee_number}
                            readOnly
                            tabIndex={-1}
                        />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Employee ID cannot be changed.
                        </p>
                    </Field>

                    <Field label="Department" required>
                        <select
                            className={inputClass}
                            value={data.department}
                            required
                            onChange={(e) =>
                                setData('department', e.target.value)
                            }
                        >
                            <option value="">Select Department</option>
                            {departments.map((option) => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.department} />
                    </Field>

                    <Field label="Position">
                        <input
                            className={inputClass}
                            value={data.position}
                            onChange={(e) => setData('position', e.target.value)}
                        />
                        <InputError message={errors.position} />
                    </Field>

                    <Field label="Employment type">
                        <select
                            className={inputClass}
                            value={data.employment_type}
                            onChange={(e) =>
                                setData('employment_type', e.target.value)
                            }
                        >
                            <option value="">Select type</option>
                            {employmentTypes.map((type) => (
                                <option key={type.id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.employment_type} />
                    </Field>

                    <Field label="Employment status" required>
                        <select
                            className={inputClass}
                            value={data.employment_status}
                            onChange={(e) =>
                                setData('employment_status', e.target.value)
                            }
                        >
                            <option value="">Select status</option>
                            {employmentStatuses.map((status) => (
                                <option key={status.id} value={status.name}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.employment_status} />
                    </Field>

                    <Field label="Work location">
                        <input
                            className={inputClass}
                            value={data.work_location}
                            onChange={(e) =>
                                setData('work_location', e.target.value)
                            }
                        />
                        <InputError message={errors.work_location} />
                    </Field>

                    <Field label="Immediate supervisor">
                        <SearchableSelect
                            value={data.immediate_supervisor}
                            onChange={(value) =>
                                setData('immediate_supervisor', value)
                            }
                            options={supervisors}
                            placeholder="Search employee..."
                            emptyMessage="No employees found"
                            inputClassName={inputClass}
                        />
                        <InputError message={errors.immediate_supervisor} />
                    </Field>
                </Section>

                <Section
                    title="Government Information"
                    description="Government-issued numbers and clearances for payroll and compliance."
                >
                    <Field label="TIN">
                        <input
                            className={inputClass}
                            value={data.tin}
                            onChange={(e) => setData('tin', e.target.value)}
                            placeholder="XXX-XXX-XXX-XXX"
                        />
                        <InputError message={errors.tin} />
                    </Field>

                    <Field label="SSS number">
                        <input
                            className={inputClass}
                            value={data.sss_number}
                            onChange={(e) =>
                                setData('sss_number', e.target.value)
                            }
                        />
                        <InputError message={errors.sss_number} />
                    </Field>

                    <Field label="PhilHealth number">
                        <input
                            className={inputClass}
                            value={data.philhealth_number}
                            onChange={(e) =>
                                setData('philhealth_number', e.target.value)
                            }
                        />
                        <InputError message={errors.philhealth_number} />
                    </Field>

                    <Field label="Pag-IBIG number">
                        <input
                            className={inputClass}
                            value={data.pagibig_number}
                            onChange={(e) =>
                                setData('pagibig_number', e.target.value)
                            }
                        />
                        <InputError message={errors.pagibig_number} />
                    </Field>

                    <Field label="NBI Clearance">
                        <input
                            className={inputClass}
                            value={data.nbi_clearance}
                            onChange={(e) =>
                                setData('nbi_clearance', e.target.value)
                            }
                            placeholder="Reference or control number"
                        />
                        <InputError message={errors.nbi_clearance} />
                    </Field>

                    <Field label="Police Clearance">
                        <input
                            className={inputClass}
                            value={data.police_clearance}
                            onChange={(e) =>
                                setData('police_clearance', e.target.value)
                            }
                            placeholder="Reference or control number"
                        />
                        <InputError message={errors.police_clearance} />
                    </Field>
                </Section>

                <div className="flex justify-end gap-3">
                    <Link
                        href={route('employees.index')}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-40"
                    >
                        Save changes
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
