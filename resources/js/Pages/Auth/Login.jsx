import InputError from '@/Components/InputError';
import LuntianLogo from '@/Components/LuntianLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, error, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <Head title="Log in" />

            {/* Light grid */}
            <div
                className="pointer-events-none absolute inset-0 bg-[#f3fbf9] dark:hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(45, 212, 191, 0.18) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(45, 212, 191, 0.18) 1px, transparent 1px),
                        linear-gradient(135deg, rgba(45, 212, 191, 0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px, 48px 48px, 24px 24px',
                }}
            />

            {/* Dark grid */}
            <div
                className="pointer-events-none absolute inset-0 hidden bg-[#0b1220] dark:block"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
                        linear-gradient(135deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px, 48px 48px, 24px 24px',
                }}
            />

            <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>

            <div className="relative z-10 w-full max-w-[420px]">
                <div className="rounded-2xl border border-slate-200/80 bg-white px-7 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-[#121a2b] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:px-9 sm:py-10">
                    <div className="mb-7 flex justify-center">
                        <LuntianLogo />
                    </div>

                    <h1 className="font-display text-center text-[1.85rem] font-extrabold uppercase leading-none tracking-[0.22em] text-slate-800 sm:text-[2.1rem] dark:text-white">
                        <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-300 dark:via-teal-400 dark:to-emerald-300">
                            HR Portal
                        </span>
                    </h1>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-teal-600 dark:text-teal-400">
                            {status}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                            {error}
                        </div>
                    )}

                    <div className="mt-7 space-y-4">
                        <a
                            href={route('google.redirect')}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.1 44 32 44 24c0-1.3-.1-2.7-.4-3.5z"
                                />
                            </svg>
                            Sign in with Google Workspace
                        </a>

                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            <span className="text-xs uppercase tracking-wider text-slate-400">
                                or
                            </span>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                        </div>
                    </div>

                    <form onSubmit={submit} className="mt-4 space-y-4">
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                            Use your{' '}
                            <span className="font-semibold text-teal-700 dark:text-teal-400">
                                @luntiands.com
                            </span>{' '}
                            email only.
                        </p>
                        <div>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teal-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m4 7 8 6 8-6"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="name@luntiands.com"
                                    className="block w-full rounded-xl border-0 bg-[#eef3f8] py-3.5 pl-11 pr-4 text-slate-800 shadow-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 dark:bg-[#e8eef5] dark:text-slate-900"
                                />
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teal-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7 10V8a5 5 0 0 1 10 0v2"
                                        />
                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                        />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Password"
                                    className="block w-full rounded-xl border-0 bg-[#eef3f8] py-3.5 pl-11 pr-12 text-slate-800 shadow-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 dark:bg-[#e8eef5] dark:text-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-teal-600 hover:text-teal-700"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3l18 18"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.6 10.7a2 2 0 0 0 2.7 2.7"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.9 5.2A10.5 10.5 0 0 1 12 5c5 0 9.3 3.1 11 7.5a12.3 12.3 0 0 1-4.2 5.1M6.1 6.1A12.3 12.3 0 0 0 1 12.5C2.7 16.9 7 20 12 20c1.5 0 2.9-.3 4.2-.8"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2 12.5C3.7 8.1 8 5 12 5s8.3 3.1 10 7.5c-1.7 4.4-6 7.5-10 7.5S3.7 16.9 2 12.5Z"
                                            />
                                            <circle cx="12" cy="12.5" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <label className="flex items-center gap-2.5 pt-1">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-500 dark:bg-slate-800"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                Remember me
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-40 dark:focus:ring-offset-[#121a2b]"
                        >
                            Sign in
                            <span aria-hidden="true">→</span>
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                    Use your Luntian account to access the HR Portal.
                </p>

                {canResetPassword && (
                    <p className="mt-2 text-center text-sm">
                        <Link
                            href={route('password.request')}
                            className="text-teal-700 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                            Forgot password?
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
