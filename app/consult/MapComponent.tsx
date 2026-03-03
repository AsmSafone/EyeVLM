'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
    doctors: Array<{
        id: number;
        name: Record<string, string>;
        clinic: Record<string, string>;
        coords: [number, number];
    }>;
    language: string;
}

export default function Map({ doctors, language }: MapProps) {
    // Center on Dhaka, Bangladesh
    const center: [number, number] = [23.794, 90.404];

    return (
        <MapContainer center={center} zoom={11} scrollWheelZoom={false} className="w-full h-full rounded-3xl z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {doctors.map(doc => (
                <Marker key={doc.id} position={doc.coords}>
                    <Popup>
                        <strong className="font-bold">{doc.name[language as 'en' | 'bn'] || doc.name.en}</strong>
                        <br />
                        <span className="text-xs">{doc.clinic[language as 'en' | 'bn'] || doc.clinic.en}</span>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
