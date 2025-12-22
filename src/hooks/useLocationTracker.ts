
import { useEffect, useState, useRef } from 'react';
import { dbService } from '@/services/db';

const UPDATE_INTERVAL_MS = 10000; // Update DB every 10 seconds max

export const useLocationTracker = (tripId: string | null) => {
    const [location, setLocation] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported");
            return;
        }

        const handlePosition = async (position: GeolocationPosition) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocation([lat, lng]);
            setError(null);

            // Throttle database updates
            const now = Date.now();
            if (tripId && (now - lastUpdateRef.current > UPDATE_INTERVAL_MS)) {
                try {
                    await dbService.updateTripLocation(tripId, lat, lng);
                    lastUpdateRef.current = now;
                    console.log("📍 Location updated in DB", lat, lng);
                } catch (err) {
                    console.error("Failed to update location in DB", err);
                }
            }
        };

        const handleError = (err: GeolocationPositionError) => {
            setError(err.message);
        };

        const watchId = navigator.geolocation.watchPosition(
            handlePosition,
            handleError,
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 5000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [tripId]);

    return { location, error };
};
