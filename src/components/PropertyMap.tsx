import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Property } from '../types';

interface PropertyMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onSelectProperty,
  center = [19.0760, 72.8777], // Default Mumbai
  zoom = 11
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapCenter: L.LatLngTuple = [center[0], center[1]];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(mapCenter, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(mapCenter, zoom);
    }

    const map = mapInstanceRef.current;

    // Remove existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add property markers
    properties.forEach((prop) => {
      if (!prop.latitude || !prop.longitude) return;

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `<div style="
          background: #0f172a;
          color: #60a5fa;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 8px;
          border: 2px solid #2563eb;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
        ">${prop.priceFormatted}</div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });

      const marker = L.marker([prop.latitude, prop.longitude], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.style.width = '200px';
      popupContent.innerHTML = `
        <div style="font-family: system-ui, sans-serif; cursor: pointer;">
          <img src="${prop.images[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${prop.priceFormatted}</div>
          <div style="font-weight: 700; font-size: 11px; color: #334155; margin-bottom: 2px;">${prop.title}</div>
          <div style="font-size: 10px; color: #64748b;">${prop.locality}, ${prop.city}</div>
          <button id="view-btn-${prop.id}" style="
            width: 100%;
            margin-top: 8px;
            background: #2563eb;
            color: #ffffff;
            font-weight: 800;
            font-size: 11px;
            padding: 6px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          ">View Details</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-btn-${prop.id}`);
        if (btn) {
          btn.onclick = () => onSelectProperty(prop);
        }
      });
    });

    if (properties.length > 0 && properties[0].latitude) {
      map.panTo([properties[0].latitude, properties[0].longitude]);
    }

  }, [properties, center, zoom, onSelectProperty]);

  return (
    <div className="w-full h-full min-h-[450px] rounded-2xl overflow-hidden shadow-md border border-slate-200 relative">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
