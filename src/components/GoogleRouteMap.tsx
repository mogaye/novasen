'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ZoneId } from '@/lib/types';
import { getZone, ZONES } from '@/lib/zones';
import { loadGoogleMaps, GOOGLE_MAPS_API_KEY } from '@/lib/googleMaps';
import { RouteMap } from './RouteMap';

interface GoogleRouteMapProps {
  originId: ZoneId;
  destinationId: ZoneId;
  originCustomText?: string;
  destinationCustomText?: string;
  mode?: 'passagers' | 'colis';
  vehicleType?: 'moto' | 'voiture' | 'camionnette';
  className?: string;
}

export function GoogleRouteMap({
  originId,
  destinationId,
  originCustomText,
  destinationCustomText,
  mode = 'passagers',
  vehicleType = 'moto',
  className = 'h-72 sm:h-96 w-full',
}: GoogleRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(!GOOGLE_MAPS_API_KEY);
  const [distanceInfo, setDistanceInfo] = useState<{ distanceText?: string; durationText?: string } | null>(null);

  const originZone = getZone(originId) || ZONES[0];
  const destZone = getZone(destinationId) || ZONES[15];

  const originName = originCustomText || originZone.name;
  const destName = destinationCustomText || destZone.name;

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setUseFallback(true);
      return;
    }

    let isMounted = true;

    async function initMap() {
      try {
        const maps = await loadGoogleMaps();
        if (!isMounted || !mapContainerRef.current) return;

        // Origin & Destination coordinates approximation or names
        const directionsService = new maps.DirectionsService();
        const directionsRenderer = new maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#1C3049',
            strokeWeight: 5,
            strokeOpacity: 0.85,
          },
        });

        const map = new maps.Map(mapContainerRef.current, {
          zoom: 12,
          center: { lat: 14.7167, lng: -17.4677 }, // Dakar center
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#F2E9DC' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#D9E6EF' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#FFFFFF' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#E8DBC8' }],
            },
          ],
        });

        directionsRenderer.setMap(map);

        const originQuery = originName.includes('Sénégal') ? originName : `${originName}, Sénégal`;
        const destQuery = destName.includes('Sénégal') ? destName : `${destName}, Sénégal`;

        directionsService.route(
          {
            origin: originQuery,
            destination: destQuery,
            travelMode: maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result);
              const leg = result.routes[0]?.legs[0];
              if (leg && isMounted) {
                setDistanceInfo({
                  distanceText: leg.distance?.text,
                  durationText: leg.duration?.text,
                });
              }
            } else {
              console.warn('Google Maps directions fallback:', status);
              // In case Google fails finding route, keep map centered on Senegal
            }
          }
        );
      } catch (err) {
        console.warn('Google Maps script error, using fallback:', err);
        if (isMounted) setUseFallback(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [originName, destName]);

  if (useFallback) {
    return (
      <RouteMap
        originId={originId}
        destinationId={destinationId}
        mode={mode}
        vehicleType={vehicleType}
        className={className}
      />
    );
  }

  return (
    <div className={`relative bg-[#E8DBC8] rounded-[12px] border border-[#DDCDB6] overflow-hidden ${className}`}>
      {/* Real Google Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Info Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-[#DDCDB6] shadow-sm max-w-[85%] truncate">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1C3049] animate-ping shrink-0" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C3049] truncate">
          <span>🗺️ Google Maps Live</span>
          <span className="text-[#7A6A5C]">•</span>
          <span className="truncate">
            {originName} → {destName}
          </span>
          {distanceInfo?.distanceText && (
            <span className="bg-[#1C3049] text-white px-2 py-0.5 rounded text-[10px] shrink-0 font-extrabold">
              {distanceInfo.distanceText} ({distanceInfo.durationText})
            </span>
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#DDCDB6] text-[0.72rem] text-[#2A211A] shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A5133]" />
          <span className="font-semibold">Départ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C3049]" />
          <span className="font-semibold">Arrivée</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#1C3049]" />
          <span className="font-bold">{mode === 'passagers' ? 'VTC' : vehicleType}</span>
        </div>
      </div>
    </div>
  );
}
