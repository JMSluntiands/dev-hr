import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

function DataTable({ title, description, columns, rows, emptyMessage, renderRow }) {
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

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => renderRow(row))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AttachEvidenceButton({ id }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const onFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('evidence_receipt', file);

        setUploading(true);
        router.post(route('reimburse.evidence', id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            },
        });
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.webp,image/*,application/pdf"
                className="hidden"
                onChange={onFileChange}
            />
            <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
            >
                {uploading ? 'Uploading...' : 'Attach receipt'}
            </button>
        </div>
    );
}

export default function Review({ forReceipt = [], completed = [] }) {
    const { flash, errors } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    For Review Reimbursement
                </h1>
            }
        >
            <Head title="For Review Reimbursement" />

            <div className="space-y-6">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        {flash.error}
                    </div>
                )}
                {errors?.evidence_receipt && (
                    <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                        {errors.evidence_receipt}
                    </div>
                )}

                <DataTable
                    title="For Receipt Attachment"
                    description="Approved requests waiting for admin evidence of receipt."
                    columns={[
                        'Employee',
                        'Expense Type',
                        'Description',
                        'Purchased Date',
                        'Amount',
                        'Employee Receipt',
                        'Actions',
                    ]}
                    rows={forReceipt}
                    emptyMessage="No reimbursements waiting for receipt attachment."
                    renderRow={(item) => (
                        <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                        >
                            <td className="px-4 py-3">
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {item.employee_name}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {item.employee_email}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.expense_type}
                            </td>
                            <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.description}
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.purchased_date}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                PHP {item.amount}
                            </td>
                            <td className="px-4 py-3">
                                {item.receipt_url ? (
                                    <a
                                        href={item.receipt_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-semibold text-teal-600 hover:text-teal-500"
                                    >
                                        View
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400">
                                        None
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <AttachEvidenceButton id={item.id} />
                            </td>
                        </tr>
                    )}
                />

                <DataTable
                    title="Completed Reimbursed"
                    description="Reimbursements with admin receipt evidence attached."
                    columns={[
                        'Employee',
                        'Expense Type',
                        'Description',
                        'Purchased Date',
                        'Amount',
                        'Completed',
                        'Evidence',
                    ]}
                    rows={completed}
                    emptyMessage="No completed reimbursements yet."
                    renderRow={(item) => (
                        <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                        >
                            <td className="px-4 py-3">
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {item.employee_name}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {item.employee_email}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.expense_type}
                            </td>
                            <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.description}
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.purchased_date}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                PHP {item.amount}
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                {item.completed_at || '—'}
                            </td>
                            <td className="px-4 py-3">
                                {item.evidence_receipt_url ? (
                                    <a
                                        href={item.evidence_receipt_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-semibold text-teal-600 hover:text-teal-500"
                                    >
                                        View
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-400">
                                        —
                                    </span>
                                )}
                            </td>
                        </tr>
                    )}
                />
            </div>
        </AuthenticatedLayout>
    );
}
