import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';

export default function PrintLabel({ item }) {
    const qrValue = item.qr_value || item.item_code;

    useEffect(() => {
        const timer = setTimeout(() => window.print(), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-6 print:bg-white print:p-0">
            <Head title={`Label - ${item.item_code}`} />

            <div className="mx-auto mb-4 flex max-w-md justify-end gap-2 print:hidden">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                >
                    Print
                </button>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Back
                </button>
            </div>

            <div className="mx-auto max-w-md rounded-xl border-2 border-slate-800 bg-white p-6 print:border print:shadow-none">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
                            Luntian HR · Inventory
                        </p>
                        <h1 className="mt-3 text-2xl font-bold tracking-wide text-slate-900">
                            {item.item_code}
                        </h1>
                        <p className="mt-1 text-lg font-semibold text-slate-800">
                            {item.name}
                        </p>
                    </div>

                    <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-1.5">
                        <QRCodeSVG
                            value={qrValue}
                            size={112}
                            level="M"
                            includeMargin={false}
                            bgColor="#ffffff"
                            fgColor="#0f172a"
                        />
                    </div>
                </div>

                <dl className="mt-4 space-y-1.5 text-sm text-slate-700">
                    {item.type && (
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Type</dt>
                            <dd className="font-medium">{item.type}</dd>
                        </div>
                    )}
                    {item.brand && (
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Brand</dt>
                            <dd className="font-medium">{item.brand}</dd>
                        </div>
                    )}
                    {item.allocated_to && (
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Allocated to</dt>
                            <dd className="font-medium">{item.allocated_to}</dd>
                        </div>
                    )}
                    {item.date_arrived && (
                        <div className="flex justify-between gap-3">
                            <dt className="text-slate-500">Date arrived</dt>
                            <dd className="font-medium">{item.date_arrived}</dd>
                        </div>
                    )}
                </dl>

                <p className="mt-4 text-center text-[10px] text-slate-400">
                    Scan QR to open item record · {item.item_code}
                </p>
            </div>
        </div>
    );
}
