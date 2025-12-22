import { useEffect, useRef } from 'react';
import { dbService } from '@/services/db';

const INACTIVITY_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

export const useSafetyMonitor = (tripId: string | null, userId: string | null) => {
    const lastUpdateRef = useRef<number>(Date.now());

    useEffect(() => {
        if (!tripId || !userId) return;

        const interval = setInterval(() => {
            const timeSinceLastUpdate = Date.now() - lastUpdateRef.current;

            if (timeSinceLastUpdate > INACTIVITY_THRESHOLD_MS) {
                // Trigger generic inactivity alert
                // In a real app, we would verify with the backend if the trip is actually updated
                // For this client-side demo, we'll just log it or trigger a local alert
                console.warn("High inactivity detected!");
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [tripId, userId]);

    const recordUpdate = () => {
        lastUpdateRef.current = Date.now();
    };

    return { recordUpdate };
};
