import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Summary({ categories = [], grandTotal = 0 }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Inventory Summary
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Total count per item category.
                    </p>
                </div>
            }
        >
            <Head title="Inventory Summary" />

            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            Inventory overview
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Counts by category
                        </p>
                    </div>
                    <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">Grand total</span>
                        <span className="ms-2 font-semibold text-slate-800 dark:text-white">
                            {grandTotal}
                        </span>
                    </div>
                </div>

                {categories.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
                        <p className="font-medium text-slate-800 dark:text-white">
                            No inventory categories yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Add items to the inventory catalog to see totals here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {category.name}
                                        </h3>
                                        {category.code && (
                                            <p className="mt-0.5 font-mono text-xs text-slate-400">
                                                {category.code}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
                                    <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        {category.total_count}
                                    </div>
                                    <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Total count
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
