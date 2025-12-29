import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Use CDN for reliable marker loading
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Green marker for destination
const DestIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FitBoundsProps {
    start: [number, number];
    end?: [number, number];
    routePath?: [number, number][];
}

// Component to fit map bounds to show route
function FitBounds({ start, end, routePath }: FitBoundsProps) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const bounds = L.latLngBounds([start]);

        if (end) {
            bounds.extend(end);
        }

        if (routePath && routePath.length > 0) {
            routePath.forEach(coord => bounds.extend(coord));
        }

        map.fitBounds(bounds, { padding: [50, 50] });
    }, [map, start, end, routePath]);

    return null;
}

// Component to recenter map when position changes IF no route is active
function RecenterMap({ position, hasRoute }: { position: [number, number], hasRoute: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (!hasRoute) {
            map.setView(position);
        }
    }, [position, map, hasRoute]);
    return null;
}

interface LiveMapProps {
    position: [number, number];
    destination?: [number, number];
    routePath?: [number, number][];
}

const LiveMap = ({ position, destination, routePath }: LiveMapProps) => {
    const hasRoute = !!(destination || (routePath && routePath.length > 0));

    return (
        <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Current Location */}
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>

            {/* Destination Marker */}
            {destination && (
                <Marker position={destination} icon={DestIcon}>
                    <Popup>Destination</Popup>
                </Marker>
            )}

            {/* Route Line */}
            {routePath && (
                <Polyline
                    positions={routePath}
                    pathOptions={{ color: 'blue', weight: 4, opacity: 0.7 }}
                />
            )}

            {hasRoute ? (
                <FitBounds start={position} end={destination} routePath={routePath} />
            ) : (
                <RecenterMap position={position} hasRoute={hasRoute} />
            )}
        </MapContainer>
    );
};

export default LiveMap;
