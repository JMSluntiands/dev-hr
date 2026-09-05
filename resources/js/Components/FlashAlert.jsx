import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function readFlash(page) {
    return {
        success: page.flash?.success ?? page.props?.flash?.success ?? null,
        error: page.flash?.error ?? page.props?.flash?.error ?? null,
    };
}

export default function FlashAlert() {
    const page = usePage();
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');

    useEffect(() => {
        const flash = readFlash(page);

        if (flash.success) {
            setMessage(flash.success);
            setType('success');
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
        }
    }, [page]);

    useEffect(() => {
        const removeSuccessListener = router.on('flash', (event) => {
            const flash = event.detail.flash;

            if (flash.success) {
                setMessage(flash.success);
                setType('success');
            } else if (flash.error) {
                setMessage(flash.error);
                setType('error');
            }
        });

        return () => removeSuccessListener();
    }, []);

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timer = setTimeout(() => setMessage(null), 5000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message) {
        return null;
    }

    const styles =
        type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
            : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200';

    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[100] max-w-sm">
            <div
                className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg ${styles}`}
                role="status"
            >
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                        {type === 'success' ? (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.5 11 14.5 15.5 10"
                                />
                                <circle cx="12" cy="12" r="9" />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path
                                    strokeLinecap="round"
                                    d="M12 8v5M12 16h.01"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1 text-sm font-medium">{message}</div>
                    <button
                        type="button"
                        onClick={() => setMessage(null)}
                        className="shrink-0 rounded-md px-1 text-xs opacity-70 transition hover:opacity-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
