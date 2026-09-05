import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart',
    'click',
];

/**
 * Auto logout after `lifetimeMinutes` of browser inactivity.
 */
export default function useIdleLogout(lifetimeMinutes = 15, enabled = true) {
    const timerRef = useRef(null);
    const loggingOutRef = useRef(false);

    useEffect(() => {
        if (!enabled || lifetimeMinutes <= 0) {
            return undefined;
        }

        const timeoutMs = lifetimeMinutes * 60 * 1000;

        const logout = () => {
            if (loggingOutRef.current) {
                return;
            }

            loggingOutRef.current = true;

            router.post(
                route('logout'),
                {},
                {
                    replace: true,
                    onFinish: () => {
                        loggingOutRef.current = false;
                    },
                    onError: () => {
                        window.location.href = route('login');
                    },
                },
            );
        };

        const resetTimer = () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }

            timerRef.current = window.setTimeout(logout, timeoutMs);
        };

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, resetTimer, { passive: true });
        });

        resetTimer();

        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }

            ACTIVITY_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, resetTimer);
            });
        };
    }, [lifetimeMinutes, enabled]);
}
