
export interface LocationResult {
    name: string;
    lat: number;
    lng: number;
    address?: string;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const geocodingService = {
    searchLocation: async (query: string): Promise<LocationResult[]> => {
        if (!query || query.length < 3) return [];

        try {
            const params = new URLSearchParams({
                q: query,
                format: 'json',
                addressdetails: '1',
                limit: '5'
            });

            const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Geocoding service unavailable');
            }

            const data = await response.json();

            return data.map((item: any) => ({
                name: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                address: item.display_name
            }));
        } catch (error) {
            console.error('Geocoding error:', error);
            return [];
        }
    }
};
