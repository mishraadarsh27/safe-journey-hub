
export interface RouteResult {
    coordinates: [number, number][]; // Array of [lat, lng]
    distance: number; // in meters
    duration: number; // in seconds
}

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1';

export const routingService = {
    getRoute: async (start: { lat: number, lng: number }, end: { lat: number, lng: number }): Promise<RouteResult | null> => {
        try {
            // OSRM takes {longitude},{latitude}
            const startStr = `${start.lng},${start.lat}`;
            const endStr = `${end.lng},${end.lat}`;

            const url = `${OSRM_BASE_URL}/driving/${startStr};${endStr}?overview=full&geometries=geojson`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Routing service unavailable');
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                return null;
            }

            const route = data.routes[0];

            // OSRM returns GeoJSON coordinates as [lng, lat], we need [lat, lng] for Leaflet
            const coordinates: [number, number][] = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

            return {
                coordinates,
                distance: route.distance,
                duration: route.duration
            };
        } catch (error) {
            console.error('Routing error:', error);
            return null;
        }
    }
};
