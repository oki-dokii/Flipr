
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Truck, MapPin } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629 // India center
};

interface MapComponentProps {
    origin: { lat: number; lng: number; label?: string };
    destination: { lat: number; lng: number; label?: string };
    currentLocation?: { lat: number; lng: number };
    routePolyline?: string; // Encoded polyline string
    apiKey: string;
}

const LIBRARIES: ("geometry" | "places" | "drawing" | "visualization")[] = ["geometry"];

const MapComponent = ({ origin, destination, currentLocation, routePolyline, apiKey }: MapComponentProps) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const pathRef = useRef<google.maps.Polyline | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    // Fit bounds when map or coordinates change
    useEffect(() => {
        if (map && origin && destination) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(origin);
            bounds.extend(destination);
            if (currentLocation) {
                bounds.extend(currentLocation);
            }
            map.fitBounds(bounds);
        }
    }, [map, origin, destination, currentLocation]);

    // Confirm API is loaded before accessing window.google
    if (loadError) return <div className="w-full h-full bg-red-900/20 flex items-center justify-center text-red-500">Error loading maps: {loadError.message}</div>;
    if (!isLoaded) return <div className="w-full h-full bg-muted flex items-center justify-center">Loading Map...</div>;

    // Decode polyline if provided, otherwise draw straight line
    let decodedPath;
    try {
        decodedPath = routePolyline
            ? window.google.maps.geometry.encoding.decodePath(routePolyline)
            : [origin, destination];
    } catch (e) {
        console.error("Failed to decode polyline", e);
        decodedPath = [origin, destination];
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={5}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            {/* Origin Marker */}
            <Marker
                position={origin}
                label="O"
                title="Origin"
            />

            {/* Destination Marker */}
            <Marker
                position={destination}
                label="D"
                title="Destination"
            />

            {/* Current Truck Position */}
            {currentLocation && (
                <Marker
                    position={currentLocation}
                    icon={{
                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 6,
                        fillColor: "#00C49F", // Teal color
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#FFFFFF",
                        rotation: 0 // You can calculate bearing if needed
                    }}
                    title="Current Location"
                />
            )}

            {/* Route Line */}
            <Polyline
                path={decodedPath}
                options={{
                    strokeColor: "#00C49F",
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                }}
            />
        </GoogleMap>
    );
};

export default MapComponent;
