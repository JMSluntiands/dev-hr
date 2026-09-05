import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

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

export default function ItemShow({ item, canManage = false }) {
    const { flash } = usePage().props;

    const removeItem = () => {
        if (
            !window.confirm(
                `Delete ${item.item_code} (${item.name})? This cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(route('inventory.items.destroy', item.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Item details
                </h1>
            }
        >
            <Head title={`${item.item_code} - ${item.name}`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={route('inventory.items')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                    Back to list
                </Link>

                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route('inventory.items.print', item.id)}
                        className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300"
                    >
                        Print label
                    </Link>
                    {canManage && (
                        <>
                            <Link
                                href={route('inventory.items.edit', item.id)}
                                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                            >
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={removeItem}
                                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {flash?.success && (
                <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {flash.success}
                </div>
            )}

            <div className="mb-6 flex flex-wrap items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b]">
                {(item.pictures || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {item.pictures.map((picture) => (
                            <a
                                key={picture.path}
                                href={picture.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={picture.url}
                                    alt={item.name}
                                    className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                />
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400 dark:bg-slate-800">
                        No photo
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm text-teal-700 dark:text-teal-300">
                        {item.item_code}
                    </p>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {[item.type, item.brand, item.status].filter(Boolean).join(' · ') ||
                            '—'}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Description" value={item.description} className="sm:col-span-2" />
                    <Detail label="Allocated to" value={item.allocated_to} />
                    <Detail label="Item condition" value={item.condition} />
                    <Detail label="Status" value={item.status} />
                    <Detail label="Remarks" value={item.remarks} className="sm:col-span-2" />
                    <Detail label="Date arrived" value={item.date_arrived} />
                    <Detail label="Date purchased" value={item.date_purchased} />
                    <Detail
                        label="Bought through request"
                        value={
                            item.purchase_request
                                ? [
                                      item.purchase_request.item_code,
                                      item.purchase_request.item_name,
                                      item.purchase_request.requester,
                                      item.purchase_request.status,
                                  ]
                                      .filter(Boolean)
                                      .join(' · ')
                                : 'No'
                        }
                        className="sm:col-span-2"
                    />
                    <Detail
                        label={`Service length (${item.service_months || 38} months)`}
                        value={item.service_length}
                    />
                    <Detail label="Brand / manufacturer" value={item.brand} />
                </dl>
            </div>
        </AuthenticatedLayout>
    );
}
