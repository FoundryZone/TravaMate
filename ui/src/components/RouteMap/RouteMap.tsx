'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Polyline, Marker } from 'leaflet';
import styles from './RouteMap.module.css';

export interface MapCity {
  id: string;
  name: string;
  emoji: string;
  coordinates: [number, number];
  index: number;
  image?: string;
}

interface RouteMapProps {
  cities: MapCity[];
  center: [number, number];
  zoom: number;
  aiOptimized: boolean;
}

export default function RouteMap({ cities, center, zoom, aiOptimized }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const polylineRef = useRef<Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then(L => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, { zoomControl: true }).setView(center, zoom);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then(L => {
      const map = mapRef.current;
      if (!map) return;

      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      polylineRef.current?.remove();
      polylineRef.current = null;

      if (cities.length === 0) {
        map.setView(center, zoom);
        return;
      }

      const coords = cities.map(c => c.coordinates);

      cities.forEach(city => {
        const hasImage = !!city.image;

        const innerHtml = hasImage
          ? `<img class="rmPhotoImg" src="${city.image}" alt="${city.name}" onerror="this.style.display='none';this.nextElementSibling.style.background='none'" /><div class="rmOverlay"><span class="rmOverlayName">${city.name}</span></div>`
          : `<span class="rmEmoji">${city.emoji}</span>`;

        const icon = L.divIcon({
          html: `
            <div class="rmMarker${hasImage ? '' : ' rmMarkerNoImg'}">
              <div class="rmCard">
                ${innerHtml}
                <span class="rmBadge">${city.index}</span>
              </div>
              <div class="rmPin"></div>
            </div>`,
          className: '',
          iconSize: [96, 90],
          iconAnchor: [48, 90],
        });

        const marker = L.marker(city.coordinates, { icon })
          .bindTooltip(city.name, { permanent: false, direction: 'top', offset: [0, -94] })
          .addTo(map);
        markersRef.current.push(marker);
      });

      if (cities.length > 1) {
        polylineRef.current = L.polyline(coords, {
          color: '#7C3AED',
          weight: 2.5,
          dashArray: '6 4',
          opacity: 0.8,
        }).addTo(map);
      }

      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [64, 64] });
    });
  }, [cities, center, zoom]);

  const cityCount = cities.length;
  const caption = cityCount === 0
    ? 'Select cities to see your route'
    : `${cityCount} ${cityCount === 1 ? 'city' : 'cities'}${aiOptimized ? ' • AI optimized' : ''}`;

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.map} />
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
