'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const modalMapContainerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(!GOOGLE_MAPS_API_KEY);
  const [distanceInfo, setDistanceInfo] = useState<{ distanceText?: string; durationText?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const originZone = getZone(originId) || ZONES[0];
  const destZone = getZone(destinationId) || ZONES[15];

  const originName = originCustomText || originZone.name;
  const destName = destinationCustomText || destZone.name;

  const originQuery = originName.includes('Sénégal') ? originName : `${originName}, Sénégal`;
  const destQuery = destName.includes('Sénégal') ? destName : `${destName}, Sénégal`;

  // Initialize Embedded Map
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
  }, [originQuery, destQuery]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Initialize Fullscreen Modal Map when opened
  useEffect(() => {
    if (!isModalOpen || !GOOGLE_MAPS_API_KEY) return;

    let isMounted = true;

    async function initModalMap() {
      try {
        const maps = await loadGoogleMaps();
        if (!isMounted || !modalMapContainerRef.current) return;

        const directionsService = new maps.DirectionsService();
        const directionsRenderer = new maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#7A5133',
            strokeWeight: 6,
            strokeOpacity: 0.9,
          },
        });

        const map = new maps.Map(modalMapContainerRef.current, {
          zoom: 13,
          center: { lat: 14.7167, lng: -17.4677 },
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Add Traffic layer
        const trafficLayer = new maps.TrafficLayer();
        trafficLayer.setMap(map);

        directionsRenderer.setMap(map);

        directionsService.route(
          {
            origin: originQuery,
            destination: destQuery,
            travelMode: maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result);
            }
          }
        );
      } catch (e) {
        console.error('Error loading modal map:', e);
      }
    }

    const timer = setTimeout(initModalMap, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isModalOpen, originQuery, destQuery]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    originQuery
  )}&destination=${encodeURIComponent(destQuery)}`;

  return (
    <>
      {/* MAP PREVIEW WRAPPER */}
      <div
        onClick={() => setIsModalOpen(true)}
        className={`relative group bg-[#E8DBC8] rounded-[12px] border border-[#DDCDB6] overflow-hidden cursor-pointer shadow-xs hover:border-[#7A5133] transition-all ${className}`}
        title="Cliquez pour agrandir la carte en plein écran"
      >
        {useFallback ? (
          <RouteMap
            originId={originId}
            destinationId={destinationId}
            mode={mode}
            vehicleType={vehicleType}
            className="w-full h-full pointer-events-none"
          />
        ) : (
          <div ref={mapContainerRef} className="w-full h-full pointer-events-none" />
        )}

        {/* Top Route Info Header */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-[#DDCDB6] shadow-sm max-w-[85%] truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C3049] animate-ping shrink-0" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C3049] truncate">
            <span>🗺️ {useFallback ? 'Sénégal Trajet' : 'Google Maps Live'}</span>
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

        {/* Enlarge overlay prompt button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="bg-[#1C3049] hover:bg-[#13223A] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105"
          >
            <span>⛶ Agrandir la carte</span>
          </button>
        </div>

        {/* Hover Hint on Bottom Center */}
        <div className="absolute inset-x-0 bottom-0 py-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span>🔍 Cliquez n'importe où sur la carte pour ouvrir la vue détaillée en grand écran</span>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#DDCDB6] text-[0.72rem] text-[#2A211A] shadow-xs group-hover:hidden">
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

      {/* FULLSCREEN PORTAL MODAL DIALOG */}
      {mounted && isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl border-2 border-[#DDCDB6] flex flex-col overflow-hidden relative animate-scale-up"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#FAF6F0] border-b border-[#DDCDB6] flex items-center justify-between gap-4 flex-wrap shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#1C3049] text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                  🗺️
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-[#573721] truncate">
                    Itinéraire NovaSen & Carte Détaillée
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#7A6A5C] truncate">
                    <span className="font-bold text-[#1C3049]">{originName}</span>
                    <span>➔</span>
                    <span className="font-bold text-[#7A5133]">{destName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* External Google Maps GPS Link */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#1C3049] hover:bg-[#13223A] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Ouvrir dans Google Maps GPS</span>
                  <span>↗</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-[#E8DBC8] hover:bg-red-500 hover:text-white text-[#573721] font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                  title="Fermer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Large Map + Trajectory Details */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 min-h-0 bg-[#F2E9DC] overflow-hidden">
              {/* Left/Main Map Container (2 Cols on desktop) */}
              <div className="lg:col-span-2 relative h-full min-h-[350px] border-b lg:border-b-0 lg:border-r border-[#DDCDB6]">
                {useFallback ? (
                  <RouteMap
                    originId={originId}
                    destinationId={destinationId}
                    mode={mode}
                    vehicleType={vehicleType}
                    className="w-full h-full"
                  />
                ) : (
                  <div ref={modalMapContainerRef} className="w-full h-full" />
                )}
              </div>

              {/* Right Trajectory Breakdown Panel */}
              <div className="p-5 flex flex-col gap-4 overflow-y-auto bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A5133] border-b border-[#DDCDB6] pb-2">
                  Détails & Métriques du Trajet
                </h4>

                {/* Trajectory Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#DDCDB6] flex flex-col">
                    <span className="text-[11px] font-semibold text-[#7A6A5C]">Distance estimée</span>
                    <strong className="text-base font-extrabold text-[#1C3049]">
                      {distanceInfo?.distanceText || '12.4 km'}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#DDCDB6] flex flex-col">
                    <span className="text-[11px] font-semibold text-[#7A6A5C]">Temps de trajet</span>
                    <strong className="text-base font-extrabold text-[#7A5133]">
                      {distanceInfo?.durationText || '18 - 25 min'}
                    </strong>
                  </div>
                </div>

                {/* Turn-by-Turn Waypoints */}
                <div className="flex flex-col gap-3 pt-2">
                  <span className="text-xs font-bold text-[#573721]">Étapes du parcours :</span>

                  {/* Origin */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#DDCDB6]">
                    <div className="w-6 h-6 rounded-full bg-[#7A5133] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      A
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-[#7A5133] uppercase">Point de Collecte / Vendeur</span>
                      <span className="text-xs font-extrabold text-[#2A211A]">{originName}</span>
                      <span className="text-[10px] text-[#7A6A5C]">Région : {originZone.region}</span>
                    </div>
                  </div>

                  {/* Road axis */}
                  <div className="flex items-center gap-2 pl-3 text-xs text-[#7A6A5C] font-semibold">
                    <span className="w-0.5 h-6 bg-[#DDCDB6] ml-2.5" />
                    <span>Axe routier direct • Trafic fluide</span>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#DDCDB6]">
                    <div className="w-6 h-6 rounded-full bg-[#1C3049] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      B
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-[#1C3049] uppercase">Point de Livraison / Client</span>
                      <span className="text-xs font-extrabold text-[#2A211A]">{destName}</span>
                      <span className="text-[10px] text-[#7A6A5C]">Région : {destZone.region}</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch & Security Note */}
                <div className="mt-auto p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🛡️</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold">Suivi GPS Sécurisé NovaSen</span>
                    <span className="text-[11px] text-amber-800 leading-relaxed">
                      Le livreur suit le tracé officiel avec géolocalisation et encaissement sécurisé COD à la remise du colis.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-[#FAF6F0] border-t border-[#DDCDB6] flex items-center justify-between shrink-0">
              <span className="text-xs text-[#7A6A5C] font-medium hidden sm:inline">
                🇸🇳 Service de Livraison et Transport NovaSen Dakar & 14 Régions
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] text-xs font-bold transition-all cursor-pointer ml-auto"
              >
                Fermer la vue grand format
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
