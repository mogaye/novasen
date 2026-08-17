'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ZoneId } from '@/lib/types';
import { ZONES, ZONES_BY_ID } from '@/lib/zones';

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
  const origin = ZONES_BY_ID[originId] || ZONES[0];
  const destination = ZONES_BY_ID[destinationId] || ZONES[7];

  const pathRef = useRef<SVGPathElement>(null);
  const [vehiclePos, setVehiclePos] = useState<{ x: number; y: number; angle: number }>({ x: 0, y: 0, angle: 0 });

  // Map coordinate projection: convert zone (x, y) km to SVG canvas (0..720, 0..420)
  // Dakar Peninsula extends from Almadies (x=5.5, y=10.5) to Plateau (0,0) and eastwards to Rufisque (18,3), AIBD (34,-2).
  const projectCoords = (x: number, y: number) => {
    // Canvas bounds
    // X goes from 0 (Plateau/Almadies west) to 36 (AIBD east)
    // Y goes from -3 (AIBD south) to 12 (Ngor north)
    const svgX = 60 + (x / 36) * 600;
    // Invert Y because higher y is North
    const svgY = 360 - ((y + 3) / 15) * 310;
    return { x: svgX, y: svgY };
  };

  const origPoint = projectCoords(origin.x, origin.y);
  const destPoint = projectCoords(destination.x, destination.y);

  // Generate a slightly curved road trajectory
  const midX = (origPoint.x + destPoint.x) / 2 + (destPoint.y - origPoint.y) * 0.15;
  const midY = (origPoint.y + destPoint.y) / 2 - (destPoint.x - origPoint.x) * 0.15;
  const routePathD = `M ${origPoint.x} ${origPoint.y} Q ${midX} ${midY} ${destPoint.x} ${destPoint.y}`;

  // Vehicle movement animation loop along SVG curve
  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();
    const duration = 4000; // 4 seconds loop

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
  }, [originId, destinationId]);

  return (
    <div
      className={`relative bg-[#E8DBC8] rounded-[8px] border border-[#DDCDB6] overflow-hidden flex flex-col justify-between select-none ${className}`}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-[4px] border border-[#DDCDB6] shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#1C3049] animate-pulse" />
        <span className="text-xs font-bold text-[#1C3049] uppercase tracking-wider">
          Réseau Dakar • {origin.name} → {destination.name}
        </span>
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
            <stop offset="100%" stopColor="#1C3049" />
          </linearGradient>
        </defs>

        {/* Ocean Background */}
        <rect width="100%" height="100%" fill="url(#oceanGrad)" />

        {/* Dakar Peninsula Coastline Outline */}
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

        {/* Main Road Arteries (Autoroute de l'Avenir, VDN, Corniche Ouest) */}
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
        <path
          d="M 150 70 Q 250 140 360 210"
          fill="none"
          stroke="#DDCDB6"
          strokeWidth="3"
        />

        {/* Ngor and Gorée Islands */}
        <circle cx="135" cy="35" r="7" fill="#E8DBC8" stroke="#DDCDB6" strokeWidth="1.5" />
        <circle cx="85" cy="355" r="5" fill="#E8DBC8" stroke="#DDCDB6" strokeWidth="1.5" />

        {/* All Dakar Zones as Nodes */}
        {ZONES.map((zone) => {
          const pt = projectCoords(zone.x, zone.y);
          const isSelected = zone.id === originId || zone.id === destinationId;
          const isOrigin = zone.id === originId;

          return (
            <g key={`map-zone-${zone.id}`} className="transition-transform duration-300">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 7 : 4}
                fill={isOrigin ? '#7A5133' : zone.id === destinationId ? '#1C3049' : '#C9A882'}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 2.5 : 1}
              />
              <text
                x={pt.x + (zone.x > 15 ? -8 : 8)}
                y={pt.y + (zone.y < 3 ? 12 : -6)}
                textAnchor={zone.x > 15 ? 'end' : 'start'}
                fontSize={isSelected ? '10' : '8'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                fill={isSelected ? '#13223A' : '#7A6A5C'}
                className="select-none font-sans"
              >
                {zone.name}
              </text>
            </g>
          );
        })}

        {/* The active calculated route line */}
        <path
          ref={pathRef}
          d={routePathD}
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          className="filter drop-shadow-sm"
        />

        {/* Origin Marker Ping */}
        <circle cx={origPoint.x} cy={origPoint.y} r="10" fill="none" stroke="#7A5133" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="7;16;7" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Destination Marker Ping */}
        <circle cx={destPoint.x} cy={destPoint.y} r="10" fill="none" stroke="#1C3049" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="7;16;7" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Animated Moving Vehicle Marker */}
        {vehiclePos.x > 0 && (
          <g
            transform={`translate(${vehiclePos.x}, ${vehiclePos.y}) rotate(${vehiclePos.angle})`}
            className="filter drop-shadow-md"
          >
            <rect x="-10" y="-6" width="20" height="12" rx="3" fill="#1C3049" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="-5" cy="6" r="2.5" fill="#2A211A" />
            <circle cx="5" cy="6" r="2.5" fill="#2A211A" />
            <circle cx="-5" cy="-6" r="2.5" fill="#2A211A" />
            <circle cx="5" cy="-6" r="2.5" fill="#2A211A" />
            <rect x="2" y="-3" width="5" height="6" rx="1" fill="#C9A882" />
          </g>
        )}
      </svg>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-[4px] border border-[#DDCDB6] text-[0.7rem] text-[#2A211A]">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7A5133]" />
          <span>Départ</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C3049]" />
          <span>Arrivée</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-[#1C3049]" />
          <span>{mode === 'passagers' ? 'VTC' : vehicleType}</span>
        </div>
      </div>
    </div>
  );
}
