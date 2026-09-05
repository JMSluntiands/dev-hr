import ApplicationLogo from '@/Components/ApplicationLogo';
import FlashAlert from '@/Components/FlashAlert';
import SidebarLink from '@/Components/SidebarLink';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const SIDEBAR_KEY = 'luntian-sidebar-collapsed';
const SIDEBAR_SCROLL_KEY = 'luntian-sidebar-scroll';
const iconClass = 'h-5 w-5';

function DashboardIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5V5.75A1.75 1.75 0 0 1 5.75 4h4.5A1.75 1.75 0 0 1 12 5.75v4.75M4 18.25v-4.5A1.75 1.75 0 0 1 5.75 12h4.5A1.75 1.75 0 0 1 12 13.75v4.5M12.75 10.5V5.75A1.75 1.75 0 0 1 14.5 4h4.5A1.75 1.75 0 0 1 20.75 5.75V10.5M12.75 18.25v-4.5A1.75 1.75 0 0 1 14.5 12h4.5a1.75 1.75 0 0 1 1.75 1.75v4.5" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
            <circle cx="9.5" cy="7.5" r="3.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 19v-1a3.5 3.5 0 0 0-2.5-3.35M16.5 4.2a3.5 3.5 0 0 1 0 6.6" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <rect x="3.5" y="5" width="17" height="15" rx="2" />
            <path strokeLinecap="round" d="M8 3.5V7M16 3.5V7M3.5 10h17" />
        </svg>
    );
}

function LeaveCreditsIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h15M4.5 12h15M4.5 16.5h9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5v15" />
        </svg>
    );
}

function LeaveApprovalIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.5 11 13.5 15.5 9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 5.5h13A2 2 0 0 1 20.5 7.5v11A2 2 0 0 1 18.5 20.5h-13A2 2 0 0 1 3.5 18.5v-11A2 2 0 0 1 5.5 5.5Z" />
        </svg>
    );
}

function ReimburseIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16v9H4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M8 14.5h2" />
        </svg>
    );
}

function ReimburseReportIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19V9.5M10 19V5M15 19v-6.5M20 19V8" />
        </svg>
    );
}

function DisciplineIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 19.5 7v5c0 4.5-3.2 7.8-7.5 8.5C7.7 19.8 4.5 16.5 4.5 12V7L12 3.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.2 11.2 14l3.5-3.8" />
        </svg>
    );
}

function IncidentIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4.5M12 16.5h.01" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 4.8 3.8 16.2A2 2 0 0 0 5.5 19h13a2 2 0 0 0 1.7-2.8L13.7 4.8a2 2 0 0 0-3.4 0Z" />
        </svg>
    );
}

function PerformanceIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19V10.5M10 19V5M15 19v-5.5M20 19V8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H4m0 0 3-3m-3 3 3 3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 5.5h6.5A2.5 2.5 0 0 1 19 8v8a2.5 2.5 0 0 1-2.5 2.5H10" />
        </svg>
    );
}

function ChevronIcon({ collapsed }) {
    return (
        <svg
            className={'h-4 w-4 transition-transform ' + (collapsed ? 'rotate-180' : '')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
    );
}

function PermissionsIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11V8.5a3.5 3.5 0 1 1 7 0V11" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11h10a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 17 20H7a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 7 11Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.5v2" />
        </svg>
    );
}

function FormSetupIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 12.5h8M8 16h5" />
        </svg>
    );
}

function InventorySummaryIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5 9 9l3.5 4.5L16 8.5l3.5 8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5h16" />
        </svg>
    );
}

function InventoryListIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h15v9h-15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10.5h8M8 13.5h5" />
        </svg>
    );
}

function InventoryRequestIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" />
        </svg>
    );
}

function InventoryDecommissionIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12M9.5 7.5V6A1.5 1.5 0 0 1 11 4.5h2A1.5 1.5 0 0 1 14.5 6v1.5M8 7.5v10A1.5 1.5 0 0 0 9.5 19h5a1.5 1.5 0 0 0 1.5-1.5v-10" />
        </svg>
    );
}

function InventorySettingsIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1.724 1.724 0 0 1 3.35 0 1.724 1.724 0 0 0 2.573 1.066 1.724 1.724 0 0 1 2.37 2.37 1.724 1.724 0 0 0 1.065 2.572 1.724 1.724 0 0 1 0 3.35 1.724 1.724 0 0 0-1.066 2.573 1.724 1.724 0 0 1-2.37 2.37 1.724 1.724 0 0 0-2.572 1.065 1.724 1.724 0 0 1-3.35 0 1.724 1.724 0 0 0-2.573-1.066 1.724 1.724 0 0 1-2.37-2.37 1.724 1.724 0 0 0-1.065-2.572 1.724 1.724 0 0 1 0-3.35 1.724 1.724 0 0 0 1.066-2.573 1.724 1.724 0 0 1 2.37-2.37 1.724 1.724 0 0 0 2.572-1.065Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

function ActivityLogIcon() {
    return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 12h8M8 17h5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5Z" />
        </svg>
    );
}

const navigation = [
    {
        label: 'Overview',
        items: [
            {
                name: 'Dashboard',
                href: 'dashboard',
                routeName: 'dashboard',
                icon: <DashboardIcon />,
                permission: 'dashboard.view',
            },
            {
                name: 'Me',
                href: 'me.show',
                routeName: 'me.show',
                icon: <UserIcon />,
                permission: 'me.view',
            },
        ],
    },
    {
        label: 'HR Management',
        items: [
            {
                name: 'Employees',
                href: 'employees.index',
                routeName: 'employees.index',
                icon: <UsersIcon />,
                permission: 'employees.view',
            },
            {
                name: 'Attendance',
                href: 'attendance.index',
                routeName: 'attendance.index',
                icon: <ClockIcon />,
                permission: 'attendance.view',
            },
            {
                name: 'Progressive Discipline',
                href: 'discipline.index',
                routeName: 'discipline.index',
                icon: <DisciplineIcon />,
                permission: 'discipline.view',
                // Employees only see this menu when they have their own records.
                ownRecordsOnly: true,
            },
            {
                name: 'Performance Review',
                href: 'performance.index',
                routeName: 'performance.index',
                icon: <PerformanceIcon />,
                permission: 'performance.view',
            },
        ],
    },
    {
        label: 'Incident',
        items: [
            {
                name: 'Incident Report',
                href: 'incident.index',
                routeName: 'incident.index',
                icon: <IncidentIcon />,
                permission: 'incident.view',
            },
            {
                name: 'Incident for Approval',
                href: 'incident.approvals',
                routeName: 'incident.approvals',
                icon: <LeaveApprovalIcon />,
                permission: 'incident.manage',
                countKey: 'incident',
            },
        ],
    },
    {
        label: 'Leave',
        items: [
            {
                name: 'Leave Request',
                href: 'leave.request',
                routeName: 'leave.request',
                icon: <CalendarIcon />,
                permission: 'leave.request',
            },
            {
                name: 'Leave for Approval',
                href: 'leave.approvals',
                routeName: 'leave.approvals',
                icon: <LeaveApprovalIcon />,
                permission: 'leave.approvals',
                countKey: 'leave',
            },
            {
                name: 'Leave Credits',
                href: 'leave.credits',
                routeName: 'leave.credits',
                icon: <LeaveCreditsIcon />,
                permission: 'leave.credits',
            },
        ],
    },
    {
        label: 'Reimburse',
        items: [
            {
                name: 'Reimbursement Request',
                href: 'reimburse.list',
                routeName: 'reimburse.list',
                icon: <ReimburseIcon />,
                permission: 'reimburse.list',
                countKey: 'reimburse',
            },
            {
                name: 'For Review Reimbursement',
                href: 'reimburse.review',
                routeName: 'reimburse.review',
                icon: <LeaveApprovalIcon />,
                permission: 'reimburse.review',
                countKey: 'reimburseReceipt',
            },
            {
                name: 'Report of Reimbursement',
                href: 'reimburse.report',
                routeName: 'reimburse.report',
                icon: <ReimburseReportIcon />,
                permission: 'reimburse.report',
            },
        ],
    },
    {
        label: 'Inventory',
        items: [
            {
                name: 'Inventory Summary',
                href: 'inventory.summary',
                routeName: 'inventory.summary',
                icon: <InventorySummaryIcon />,
                permission: 'inventory.summary',
            },
            {
                name: 'List of my items',
                href: 'inventory.items',
                routeName: 'inventory.items',
                icon: <InventoryListIcon />,
                permission: 'inventory.items',
            },
            {
                name: 'Request item',
                href: 'inventory.request',
                routeName: 'inventory.request',
                icon: <InventoryRequestIcon />,
                permission: 'inventory.request',
            },
            {
                name: 'Item for Approval',
                href: 'inventory.approvals',
                routeName: 'inventory.approvals',
                icon: <LeaveApprovalIcon />,
                permission: 'inventory.approvals',
                countKey: 'inventory',
            },
            {
                name: 'Decommission Request',
                href: 'inventory.decommission',
                routeName: 'inventory.decommission',
                icon: <InventoryDecommissionIcon />,
                permission: 'inventory.decommission',
            },
            {
                name: 'Inventory Setting',
                href: 'inventory.settings',
                routeName: 'inventory.settings',
                icon: <InventorySettingsIcon />,
                permission: 'inventory.settings',
            },
        ],
    },
    {
        label: 'Settings',
        items: [
            {
                name: 'Account',
                href: 'settings.index',
                routeName: 'settings.index',
                icon: <SettingsIcon />,
                permission: 'settings.account.view',
            },
            {
                name: 'Permissions',
                href: 'settings.permissions',
                routeName: 'settings.permissions',
                icon: <PermissionsIcon />,
                permission: 'settings.permissions.view',
            },
            {
                name: 'Form Set Up',
                href: 'settings.form-setup',
                routeName: 'settings.form-setup',
                icon: <FormSetupIcon />,
                permission: 'settings.form_setup.view',
            },
            {
                name: 'Activity Log',
                href: 'activity-log.index',
                routeName: 'activity-log.index',
                icon: <ActivityLogIcon />,
                permission: 'activity_log.view',
            },
            {
                name: 'Profile',
                href: 'profile.edit',
                routeName: 'profile.edit',
                icon: <UserIcon />,
                permission: 'profile.view',
            },
        ],
    },
];

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page.props.auth.user;
    const permissions = page.props.auth?.permissions || [];
    const approvalCounts = page.props.approvalCounts || {};
    const disciplineOwnCount = page.props.disciplineOwnCount || 0;
    const navRef = useRef(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return localStorage.getItem(SIDEBAR_KEY) === '1';
    });

    useEffect(() => {
        localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
    }, [collapsed]);

    const saveSidebarScroll = () => {
        if (!navRef.current || typeof window === 'undefined') {
            return;
        }

        sessionStorage.setItem(
            SIDEBAR_SCROLL_KEY,
            String(navRef.current.scrollTop),
        );
    };

    useLayoutEffect(() => {
        if (!navRef.current || typeof window === 'undefined') {
            return;
        }

        const saved = Number(sessionStorage.getItem(SIDEBAR_SCROLL_KEY) || 0);
        if (!Number.isNaN(saved)) {
            navRef.current.scrollTop = saved;
        }
    }, [page.url]);

    const closeMobile = () => setMobileOpen(false);
    const toggleCollapsed = () => setCollapsed((current) => !current);

    const can = (permission) => {
        if (!permission) {
            return true;
        }

        // Before permissions are seeded, don't hide everything.
        if (permissions.length === 0) {
            return true;
        }

        return permissions.includes(permission);
    };

    const visibleNavigation = navigation
        .map((section) => ({
            ...section,
            items: section.items
                .filter((item) => {
                    if (!can(item.permission)) {
                        return false;
                    }

                    // For employees: Progressive Discipline only when they have a record.
                    if (item.ownRecordsOnly) {
                        if (can('discipline.manage') || can('discipline.create')) {
                            return true;
                        }

                        return disciplineOwnCount > 0;
                    }

                    return true;
                })
                .map((item) => {
                    if (
                        item.routeName === 'inventory.items' &&
                        can('inventory.manage')
                    ) {
                        return { ...item, name: 'List of items' };
                    }

                    return item;
                }),
        }))
        .filter((section) => section.items.length > 0);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#0b1220]">
            {mobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
                    aria-label="Close sidebar"
                    onClick={closeMobile}
                />
            )}

            <aside
                className={
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-[#121a2b] ' +
                    (collapsed ? 'lg:w-20' : 'lg:w-72') +
                    ' w-72 ' +
                    (mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
                }
            >
                <div
                    className={
                        'flex h-16 items-center border-b border-slate-200 dark:border-slate-800 ' +
                        (collapsed ? 'justify-center px-2' : 'justify-between gap-2 px-4')
                    }
                >
                    <Link
                        href={route('dashboard')}
                        onClick={closeMobile}
                        className={
                            'min-w-0 ' +
                            (collapsed ? 'flex items-center justify-center' : '')
                        }
                        title="LUNTIAN HR Portal"
                    >
                        {collapsed ? (
                            <span className="text-lg font-extrabold tracking-wide text-[#f5a623]">
                                L
                            </span>
                        ) : (
                            <>
                                <ApplicationLogo compact />
                                <div className="mt-0.5 font-display text-[0.65rem] font-bold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-400">
                                    HR Portal
                                </div>
                            </>
                        )}
                    </Link>

                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        className="hidden shrink-0 items-center justify-center p-1 text-slate-400 transition hover:text-teal-700 lg:inline-flex dark:text-slate-500 dark:hover:text-teal-400"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronIcon collapsed={collapsed} />
                    </button>
                </div>

                <nav
                    ref={navRef}
                    onScroll={saveSidebarScroll}
                    className={
                        'flex-1 space-y-6 overflow-y-auto py-5 ' +
                        (collapsed ? 'px-2' : 'px-3')
                    }
                >
                    {visibleNavigation.map((section) => (
                        <div key={section.label}>
                            {!collapsed && (
                                <div className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                    {section.label}
                                </div>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <SidebarLink
                                        key={item.name}
                                        href={route(item.href)}
                                        active={route().current(item.routeName)}
                                        icon={item.icon}
                                        collapsed={collapsed}
                                        badge={
                                            item.countKey
                                                ? approvalCounts[item.countKey] || 0
                                                : 0
                                        }
                                        onClick={() => {
                                            saveSidebarScroll();
                                            closeMobile();
                                        }}
                                    >
                                        {item.name}
                                    </SidebarLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div
                    className={
                        'border-t border-slate-200 dark:border-slate-800 ' +
                        (collapsed ? 'p-2' : 'p-4')
                    }
                >
                    {!collapsed && (
                        <div className="mb-3 rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-900/70">
                            <div className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                {user.name}
                            </div>
                            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {user.email}
                            </div>
                        </div>
                    )}

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        onClick={closeMobile}
                        title={collapsed ? 'Log out' : undefined}
                        className={
                            'flex w-full items-center rounded-xl text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400 ' +
                            (collapsed
                                ? 'justify-center px-2 py-2.5'
                                : 'gap-3 px-3 py-2.5')
                        }
                    >
                        <LogoutIcon />
                        {!collapsed && <span>Log out</span>}
                    </Link>
                </div>
            </aside>

            <div
                className={
                    'transition-all duration-200 ' +
                    (collapsed ? 'lg:pl-20' : 'lg:pl-72')
                }
            >
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-[#121a2b]/90 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        </button>

                        <div className="min-w-0">
                            {header || (
                                <h1 className="truncate text-lg font-semibold text-slate-800 dark:text-white">
                                    Dashboard
                                </h1>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="hidden text-right sm:block">
                            <div className="text-sm font-medium text-slate-800 dark:text-white">
                                {user.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Employee
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>

            <FlashAlert />
        </div>
    );
}
