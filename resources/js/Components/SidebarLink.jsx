import { Link } from '@inertiajs/react';

function Badge({ count, active = false, collapsed = false }) {
    if (!count || count < 1) {
        return null;
    }

    const label = count > 99 ? '99+' : String(count);

    if (collapsed) {
        return (
            <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold leading-none text-white">
                {label}
            </span>
        );
    }

    return (
        <span
            className={
                'ms-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold leading-none ' +
                (active
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-500 text-white')
            }
        >
            {label}
        </span>
    );
}

export default function SidebarLink({
    href,
    active = false,
    icon = null,
    children,
    onClick,
    collapsed = false,
    badge = 0,
    nested = false,
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            title={
                collapsed
                    ? badge > 0
                        ? `${children} (${badge})`
                        : children
                    : undefined
            }
            className={
                'group relative flex items-center rounded-xl text-sm font-medium transition ' +
                (collapsed
                    ? 'justify-center px-2 py-2.5'
                    : nested
                      ? 'gap-3 py-2 pe-3 ps-10'
                      : 'gap-3 px-3 py-2.5') +
                ' ' +
                (active
                    ? nested
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white')
            }
        >
            {icon && (
                <span
                    className={
                        'relative shrink-0 ' +
                        (active && !nested
                            ? 'text-white'
                            : active && nested
                              ? 'text-teal-600 dark:text-teal-400'
                              : 'text-slate-400 group-hover:text-teal-600 dark:text-slate-500 dark:group-hover:text-teal-400')
                    }
                >
                    {icon}
                    {collapsed && <Badge count={badge} collapsed />}
                </span>
            )}
            <span
                className={
                    'truncate transition-all ' +
                    (collapsed
                        ? 'pointer-events-none absolute w-0 overflow-hidden opacity-0'
                        : 'opacity-100')
                }
            >
                {children}
            </span>
            {!collapsed && (
                <Badge count={badge} active={active && !nested} />
            )}
        </Link>
    );
}
