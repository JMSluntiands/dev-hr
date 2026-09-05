import { usePage } from '@inertiajs/react';

export default function useCan(permission) {
    const permissions = usePage().props.auth?.permissions || [];

    if (Array.isArray(permission)) {
        return permission.some((key) => permissions.includes(key));
    }

    return permissions.includes(permission);
}
