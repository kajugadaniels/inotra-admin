"use client";

import { useMemo } from "react";
import { Map, Marker, type MapMouseEvent } from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: -1.9441, lng: 30.0619 };

type ListingMapProps = {
    latitude: string;
    longitude: string;
    disabled?: boolean;
    onLocationSelect: (lat: string, lng: string) => void;
};

const ListingMap = ({
    latitude,
    longitude,
    disabled = false,
    onLocationSelect,
}: ListingMapProps) => {
    const coords = useMemo(() => {
        const lat = Number(latitude);
        const lng = Number(longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }
        return null;
    }, [latitude, longitude]);

    const center = coords ?? DEFAULT_CENTER;

    const handleClick = (event: MapMouseEvent) => {
        if (disabled) return;
        const latLng = event.detail.latLng;
        if (!latLng) return;
        const lat = latLng.lat.toFixed(6);
        const lng = latLng.lng.toFixed(6);
        onLocationSelect(lat, lng);
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/60">
            <Map
                center={center}
                zoom={coords ? 14 : 11}
                onClick={handleClick}
                gestureHandling={disabled ? "none" : "greedy"}
                disableDefaultUI
                className="h-64 w-full"
            >
                {coords ? <Marker position={coords} /> : null}
            </Map>
        </div>
    );
};

export default ListingMap;
