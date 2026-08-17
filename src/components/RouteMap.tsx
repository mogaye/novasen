'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ZoneId } from '@/lib/types';
import { ZONES, ZONES_BY_ID, getZone } from '@/lib/zones';

interface RouteMapProps {
  originId: ZoneId;
  destinationId: ZoneId;
  mode?: 'passagers' | 'colis';
  vehicleType?: 'moto' | 'voiture' | 'camionnette';
  className?: string;
}

export function RouteMap({
  originId,
  destinationId,
  mode = 'passagers',
  vehicleType = 'moto',
  className = 'h-72 sm:h-96 w-full',
}: RouteMapProps) {
  const origin = useMemo(() => getZone(originId) || ZONES[0], [originId]);
  const destination = useMemo(() => getZone(destinationId) || ZONES[15], [destinationId]);

  const pathRef = useRef<SVGPathElement>(null);
  const [vehiclePos, setVehiclePos] = useState<{ x: number; y: number; angle: number }>({ x: 0, y: 0, angle: 0 });

  // Determine if this is an intra-Dakar trip or a national interurban trip
  const isInterurban = useMemo(() => {
    return origin.x > 36 || destination.x > 36 || origin.y < -10 || destination.y < -10 || origin.region !== destination.region;
  }, [origin, destination]);

  // Compute dynamic projection bounds
  const projection = useMemo(() => {
    if (!isInterurban) {
      // Local Dakar Peninsula bounds
      return {
        project: (x: number, y: number) => {
          const svgX = 60 + (x / 36) * 600;
          const svgY = 360 - ((y + 3) / 15) * 310;
          return { x: Math.max(30, Math.min(690, svgX)), y: Math.max(30, Math.min(390, svgY)) };
        },
        relevantZones: ZONES.filter((z) => z.region === 'Dakar' || z.id === 'aibd' || z.id === 'thies'),
      };
    } else {
      // National Senegal bounds
      const minX = Math.min(origin.x, destination.x, 0) - 20;
      const maxX = Math.max(origin.x, destination.x, 240) + 30;
      const minY = Math.min(origin.y, destination.y, -180) - 20;
      const maxY = Math.max(origin.y, destination.y, 110) + 20;

      const spanX = Math.max(maxX - minX, 100);
      const spanY = Math.max(maxY - minY, 100);

      return {
        project: (x: number, y: number) => {
          const svgX = 70 + ((x - minX) / spanX) * 580;
          const svgY = 360 - ((y - minY) / spanY) * 300;
          return { x: Math.max(30, Math.min(690, svgX)), y: Math.max(30, Math.min(390, svgY)) };
        },
        relevantZones: ZONES.filter(
          (z) =>
            z.popular ||
            z.id === origin.id ||
            z.id === destination.id ||
            z.region === origin.region ||
            z.region === destination.region
        ),
      };
    }
  }, [origin, destination, isInterurban]);

  const origPoint = projection.project(origin.x, origin.y);
  const destPoint = projection.project(destination.x, destination.y);

  // Generate a slightly curved road trajectory
  const midX = (origPoint.x + destPoint.x) / 2 + (destPoint.y - origPoint.y) * 0.12;
  const midY = (origPoint.y + destPoint.y) / 2 - (destPoint.x - origPoint.x) * 0.12;
  const routePathD = `M ${origPoint.x} ${origPoint.y} Q ${midX} ${midY} ${destPoint.x} ${destPoint.y}`;

  // Vehicle movement animation loop along SVG curve
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = isInterurban ? 5000 : 3800; // Animation duration

    const animate = (currentTime: number) => {
      if (pathRef.current) {
        const path = pathRef.current;
        const totalLength = path.getTotalLength();
        if (totalLength > 0) {
          const elapsed = (currentTime - startTime) % duration;
          const progress = elapsed / duration;
          const point = path.getPointAtLength(progress * totalLength);

          // Calculate angle tangent
          const nextPoint = path.getPointAtLength(Math.min(totalLength, progress * totalLength + 1));
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

          setVehiclePos({ x: point.x, y: point.y, angle });
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [originId, destinationId, isInterurban]);

  return (
    <div
      className={`relative bg-[#E8DBC8] rounded-[12px] border border-[#DDCDB6] overflow-hidden flex flex-col justify-between select-none shadow-xs ${className}`}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-lg border border-[#DDCDB6] shadow-sm max-w-[85%] truncate">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1C3049] animate-ping shrink-0" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C3049] truncate">
          <span className="shrink-0">{isInterurban ? '🇸🇳 Interurbain' : '📍 Réseau Dakar'}</span>
          <span className="text-[#7A6A5C]">•</span>
          <span className="truncate">
            {origin.name} ({origin.region}) → {destination.name} ({destination.region})
          </span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 720 420"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Carte vectorielle des axes de transport du Sénégal"
      >
        <defs>
          {/* Ocean Gradient */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9E6EF" />
            <stop offset="100%" stopColor="#C8DAE7" />
          </linearGradient>

          {/* Route Gradient */}
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A5133" />
            <stop offset="50%" stopColor="#1C3049" />
            <stop offset="100%" stopColor="#1C3049" />
          </linearGradient>
        </defs>

        {/* Ocean Background */}
        <rect width="100%" height="100%" fill="url(#oceanGrad)" />

        {/* Territory Background Landmass */}
        {isInterurban ? (
          // Senegal National stylized territory polygon
          <path
            d="M 50 180 
               Q 120 120 220 80 
               Q 350 70 480 90 
               Q 620 120 680 180 
               Q 660 300 580 360 
               Q 440 390 320 380 
               Q 180 360 80 300 Z"
            fill="#F2E9DC"
            stroke="#DDCDB6"
            strokeWidth="2"
          />
        ) : (
          // Dakar Peninsula Coastline Outline
          <path
            d="M 60 340 
               C 40 320, 50 260, 70 230 
               C 85 200, 80 160, 95 120 
               C 105 90, 120 60, 145 45 
               C 170 30, 200 40, 230 65 
               C 270 100, 310 130, 370 160 
               C 430 190, 520 220, 680 260 
               L 720 420 L 0 420 Z"
            fill="#F2E9DC"
            stroke="#DDCDB6"
            strokeWidth="2"
          />
        )}

        {/* Highway Arteries & Axes */}
        {!isInterurban && (
          <>
            <path
              d="M 65 330 Q 110 200 150 70"
              fill="none"
              stroke="#DDCDB6"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
            <path
              d="M 65 330 Q 200 240 360 210 Q 520 240 680 260"
              fill="none"
              stroke="#DDCDB6"
              strokeWidth="4"
            />
            <circle cx="135" cy="35" r="7" fill="#E8DBC8" stroke="#DDCDB6" strokeWidth="1.5" />
            <circle cx="85" cy="355" r="5" fill="#E8DBC8" stroke="#DDCDB6" strokeWidth="1.5" />
          </>
        )}

        {/* Visible Hubs and Locations as Nodes */}
        {projection.relevantZones.map((zone) => {
          const pt = projection.project(zone.x, zone.y);
          const isOrigin = zone.id === origin.id;
          const isDest = zone.id === destination.id;
          const isSelected = isOrigin || isDest;

          return (
            <g key={`map-zone-${zone.id}`} className="transition-transform duration-300">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 8 : 4.5}
                fill={isOrigin ? '#7A5133' : isDest ? '#1C3049' : '#C9A882'}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 2.5 : 1}
              />
              {(isSelected || zone.popular) && (
                <text
                  x={pt.x + (pt.x > 500 ? -10 : 10)}
                  y={pt.y + (pt.y > 340 ? -8 : 12)}
                  textAnchor={pt.x > 500 ? 'end' : 'start'}
                  fontSize={isSelected ? '11' : '8.5'}
                  fontWeight={isSelected ? 'bold' : '600'}
                  fill={isSelected ? '#13223A' : '#7A6A5C'}
                  className="select-none font-sans"
                >
                  {zone.name.split(' (')[0]}
                </text>
              )}
            </g>
          );
        })}

        {/* The active calculated route line */}
        <path
          ref={pathRef}
          d={routePathD}
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          className="filter drop-shadow-md"
        />

        {/* Origin Marker Ping */}
        <circle cx={origPoint.x} cy={origPoint.y} r="12" fill="none" stroke="#7A5133" strokeWidth="2.5" opacity="0.7">
          <animate attributeName="r" values="8;20;8" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* Destination Marker Ping */}
        <circle cx={destPoint.x} cy={destPoint.y} r="12" fill="none" stroke="#1C3049" strokeWidth="2.5" opacity="0.7">
          <animate attributeName="r" values="8;20;8" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* Animated Moving Vehicle Marker */}
        {vehiclePos.x > 0 && (
          <g
            transform={`translate(${vehiclePos.x}, ${vehiclePos.y}) rotate(${vehiclePos.angle})`}
            className="filter drop-shadow-lg"
          >
            <rect x="-11" y="-7" width="22" height="14" rx="3.5" fill="#1C3049" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="-6" cy="7" r="2.5" fill="#2A211A" />
            <circle cx="6" cy="7" r="2.5" fill="#2A211A" />
            <circle cx="-6" cy="-7" r="2.5" fill="#2A211A" />
            <circle cx="6" cy="-7" r="2.5" fill="#2A211A" />
            <rect x="2" y="-3.5" width="6" height="7" rx="1.5" fill="#C9A882" />
          </g>
        )}
      </svg>

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
