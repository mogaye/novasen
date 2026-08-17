'use client';

import React from 'react';
import { CategoryId } from '@/lib/types';
import {
  IconCar,
  IconSmartphone,
  IconLaptop,
  IconHome,
  IconArmchair,
  IconShirt,
  IconWrench,
  IconBike,
  IconTruck,
  IconPackage,
} from './Icons';

interface CategoryVisualProps {
  category: CategoryId;
  vehicleType?: 'moto' | 'voiture' | 'camionnette';
  className?: string;
  badgeLabel?: string;
  imageUrl?: string;
}

export function CategoryVisual({
  category,
  vehicleType,
  className = 'h-40 w-full',
  badgeLabel,
  imageUrl,
}: CategoryVisualProps) {
  const getIcon = () => {
    if (category === 'vehicules') {
      if (vehicleType === 'moto') return <IconBike className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      if (vehicleType === 'camionnette') return <IconTruck className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      return <IconCar className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
    }
    switch (category) {
      case 'telephones':
        return <IconSmartphone className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      case 'electronique':
        return <IconLaptop className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      case 'immobilier':
        return <IconHome className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      case 'maison':
        return <IconArmchair className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      case 'mode':
        return <IconShirt className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      case 'alimentation':
        return <span className="text-2xl sm:text-3xl">🌾</span>;
      case 'elevage':
        return <span className="text-2xl sm:text-3xl">🐑</span>;
      case 'sports_loisirs':
        return <span className="text-2xl sm:text-3xl">⚽</span>;
      case 'services':
        return <IconWrench className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      case 'divers':
        return <IconPackage className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
      default:
        return <IconCar className="w-7 h-7 sm:w-9 sm:h-9 text-[#7A5133]" />;
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'vehicules':
        return vehicleType === 'moto' ? 'Moto' : vehicleType === 'camionnette' ? 'Utilitaire' : 'Auto';
      case 'telephones':
        return 'Télécom';
      case 'electronique':
        return 'High-Tech';
      case 'immobilier':
        return 'Immobilier';
      case 'maison':
        return 'Maison';
      case 'mode':
        return 'Mode & Style';
      case 'alimentation':
        return 'Terroir & Vivres';
      case 'elevage':
        return 'Bétail & Ladoum';
      case 'sports_loisirs':
        return 'Sports & Loisirs';
      case 'services':
        return 'Prestations';
      case 'divers':
        return 'Divers';
      default:
        return 'Annonce';
    }
  };

  // If a real product image / base64 photo is supplied
  if (imageUrl) {
    return (
      <div
        className={`relative bg-[#F2E9DC] border border-[#DDCDB6]/70 rounded-[8px] overflow-hidden select-none group ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={badgeLabel || getCategoryLabel()}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Minimal Category Micro Badge in bottom corner */}
        <span className="absolute bottom-1.5 right-1.5 z-10 text-[0.6rem] sm:text-[0.68rem] uppercase tracking-wider font-bold text-[#2A211A] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-[4px] border border-[#DDCDB6]/80 leading-none shadow-xs">
          {badgeLabel || getCategoryLabel()}
        </span>
      </div>
    );
  }

  // Fallback to stylized geometric category thumbnail
  return (
    <div
      className={`relative bg-gradient-to-br from-[#F2E9DC] to-[#E8DBC8] border border-[#DDCDB6]/70 rounded-[8px] flex flex-col items-center justify-center overflow-hidden select-none p-2 sm:p-4 ${className}`}
    >
      {/* Geometric subtle pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pat" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#7A5133" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pat)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-1 sm:gap-1.5">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[8px] bg-white/90 border border-[#DDCDB6] shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
          {getIcon()}
        </div>
        <span className="text-[0.62rem] sm:text-[0.72rem] uppercase tracking-wider font-bold text-[#7A6A5C] bg-white/80 px-2 py-0.5 rounded-[4px] border border-[#DDCDB6]/60 leading-none">
          {badgeLabel || getCategoryLabel()}
        </span>
      </div>
    </div>
  );
}
