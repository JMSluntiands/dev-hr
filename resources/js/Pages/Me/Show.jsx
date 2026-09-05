import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function initials(name = '') {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function Detail({ label, value, className = '' }) {
    return (
        <div className={className}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
                {value || '—'}
            </dd>
        </div>
    );
}

function StatusBadge({ status }) {
    const key = String(status || '')
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const styles = {
        active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        resigned: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        terminated: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    };

    return (
        <span
            className={
                'inline-flex w-fit rounded-md px-2 py-1 text-xs font-medium capitalize ' +
                (styles[key] || styles.inactive)
            }
        >
            {status || '—'}
        </span>
    );
}

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
            <h2 className="mb-4 border-b border-slate-100 pb-3 text-base font-semibold text-slate-800 dark:border-slate-800 dark:text-white">
                {title}
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
        </section>
    );
}

export default function Show({ employee, userName, userEmail }) {
    if (!employee) {
        return (
            <AuthenticatedLayout
                header={
                    <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Me
                    </h1>
                }
            >
                <Head title="Me" />

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                    <p className="font-semibold">No HR employee record found</p>
                    <p className="mt-1">
                        Your account ({userEmail || userName}) is not linked to an
                        employee profile yet. Ask HR to add your record with the same
                        email address.
                    </p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Me
                </h1>
            }
        >
            <Head title="Me" />

            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Your profile details as saved in HR. Contact HR if anything needs
                updating.
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b]">
                {employee.photo_url ? (
                    <img
                        src={employee.photo_url}
                        alt={employee.full_name}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
                        {initials(employee.full_name)}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {employee.full_name}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {employee.employee_number}
                        {employee.department ? ` · ${employee.department}` : ''}
                        {employee.position ? ` · ${employee.position}` : ''}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {employee.email}
                    </p>
                </div>
                <StatusBadge status={employee.employment_status} />
            </div>

            <div className="space-y-4">
                <Section title="Personal information">
                    <Detail label="First name" value={employee.first_name} />
                    <Detail label="Middle name" value={employee.middle_name} />
                    <Detail label="Last name" value={employee.last_name} />
                    <Detail label="Phone" value={employee.phone} />
                    <Detail label="Date of birth" value={employee.date_of_birth} />
                    <Detail label="Gender" value={employee.gender} />
                    <Detail label="Civil status" value={employee.civil_status} />
                    <Detail
                        label="Address"
                        value={employee.address}
                        className="sm:col-span-2"
                    />
                </Section>

                <Section title="Emergency contact">
                    <Detail label="Name" value={employee.emergency_contact_name} />
                    <Detail
                        label="Relation"
                        value={employee.emergency_contact_relation}
                    />
                    <Detail label="Phone" value={employee.emergency_contact_phone} />
                    <Detail
                        label="Emergency contact address"
                        value={
                            employee.emergency_contact_same_address
                                ? employee.address || 'Same as employee address'
                                : employee.emergency_contact_address
                        }
                        className="sm:col-span-2"
                    />
                </Section>

                <Section title="Employment">
                    <Detail label="Employee ID" value={employee.employee_number} />
                    <Detail label="Department" value={employee.department} />
                    <Detail label="Position" value={employee.position} />
                    <Detail label="Employment type" value={employee.employment_type} />
                    <Detail label="Date hired" value={employee.date_hired} />
                    <Detail label="Work location" value={employee.work_location} />
                    <Detail
                        label="Immediate supervisor"
                        value={employee.immediate_supervisor}
                    />
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <StatusBadge status={employee.employment_status} />
                        </dd>
                    </div>
                </Section>

                <Section title="Government information">
                    <Detail label="TIN" value={employee.tin} />
                    <Detail label="SSS number" value={employee.sss_number} />
                    <Detail
                        label="PhilHealth number"
                        value={employee.philhealth_number}
                    />
                    <Detail label="Pag-IBIG number" value={employee.pagibig_number} />
                    <Detail label="NBI clearance" value={employee.nbi_clearance} />
                    <Detail
                        label="Police clearance"
                        value={employee.police_clearance}
                    />
                </Section>
            </div>
        </AuthenticatedLayout>
    );
}
