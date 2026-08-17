'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { formatCFA } from '@/lib/format';
import { CategoryVisual } from './ui/CategoryVisual';
import { useApp } from '@/context/AppContext';
import { IconMapPin, IconPackage, IconArrowRight, IconShieldCheck, IconStar } from './ui/Icons';

interface ListingCardProps {
  listing: Listing;
  showDeliveryButton?: boolean;
}

export function ListingCard({ listing, showDeliveryButton = true }: ListingCardProps) {
  const { toggleFavorite, isFavorite } = useApp();
  const favorited = isFavorite(listing.id);

  return (
    <article
      className="group bg-white rounded-[16px] border border-[#DDCDB6] p-3 sm:p-3.5 flex flex-col justify-between hover-card-lift relative overflow-hidden shadow-xs hover:shadow-md hover:border-[#7A5133] transition-all h-full"
      aria-label={listing.title}
    >
      <div className="flex flex-col gap-2.5">
        {/* Visual Thumbnail with Badges */}
        <div className="relative rounded-[12px] overflow-hidden bg-[#FAF8F5]">
          <Link href={`/annonce/${listing.id}`} className="block focus:outline-none">
            <CategoryVisual
              category={listing.category}
              vehicleType={listing.vehicleType}
              imageUrl={listing.imageUrl || listing.images?.[0]}
              className="h-32 sm:h-40 md:h-44 w-full group-hover:scale-[1.03] transition-transform duration-300 object-cover"
            />
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col items-start gap-1 pointer-events-none">
            {listing.isVerifiedShop && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1C3049]/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs border border-white/20">
                <IconShieldCheck className="w-2.5 h-2.5 text-[#C9A882]" />
                <span>Boutique</span>
              </span>
            )}
            {listing.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7A5133]/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs border border-white/20">
                <IconStar className="w-2.5 h-2.5 text-[#E8DBC8]" />
                <span>En avant</span>
              </span>
            )}
          </div>

          {/* Interactive Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs hover:bg-white text-xs flex items-center justify-center shadow-md border border-[#DDCDB6] transition-transform active:scale-90 cursor-pointer"
            title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <span className={favorited ? 'text-red-500 scale-110 transition-transform' : 'text-gray-400'}>
              {favorited ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* Price & Location */}
        <div className="flex items-baseline justify-between gap-2">
          {/* RULE OF COLOR: Tabular Numbers in Dark Blue */}
          <span className="text-base sm:text-lg font-extrabold font-heading tabular-nums text-[#1C3049] leading-tight">
            {formatCFA(listing.price)}
          </span>
          <span className="text-[11px] font-medium text-[#7A6A5C] truncate shrink-0 flex items-center gap-0.5">
            <IconMapPin className="w-3 h-3 text-[#7A5133]" />
            {listing.neighborhood}
          </span>
        </div>

        {/* Title */}
        <Link href={`/annonce/${listing.id}`} className="focus:outline-none">
          <h3 className="font-bold text-xs sm:text-sm text-[#2A211A] group-hover:text-[#7A5133] transition-colors line-clamp-2 min-h-[2.4rem] leading-snug">
            {listing.title}
          </h3>
        </Link>

        {/* Seller Shop Link & Stock */}
        <div className="flex items-center justify-between text-[11px] text-[#7A6A5C] pt-1.5 border-t border-[#DDCDB6]/50">
          <Link
            href={`/boutique/${encodeURIComponent(listing.sellerName)}`}
            className="font-semibold text-[#7A5133] hover:underline truncate max-w-[120px]"
            title={`Visiter la boutique de ${listing.sellerName}`}
          >
            🏪 {listing.sellerName}
          </Link>
          {(() => {
            const avail = Math.max(0, (listing.quantity ?? 1) - (listing.soldCount ?? 0));
            if (avail <= 0) {
              return (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  Épuisé
                </span>
              );
            }
            if (avail === 1) {
              return (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  ⚡ 1 restant
                </span>
              );
            }
            return (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                📦 {avail} en stock
              </span>
            );
          })()}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-[#DDCDB6]/60 flex items-center justify-between gap-1.5 text-xs">
        <Link
          href={`/annonce/${listing.id}`}
          className="font-bold text-[#573721] hover:text-[#7A5133] flex items-center gap-1 py-1 text-[11px] sm:text-xs"
        >
          <span>Détails</span>
          <IconArrowRight className="w-3 h-3" />
        </Link>

        {showDeliveryButton && (
          (() => {
            const isOutOfStock = Math.max(0, (listing.quantity ?? 1) - (listing.soldCount ?? 0)) <= 0;
            if (isOutOfStock) {
              return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] bg-gray-200 text-gray-500 font-bold text-[10px] sm:text-[11px] shrink-0 cursor-not-allowed">
                  <span>Épuisé</span>
                </span>
              );
            }
            return (
              <Link
                href={`/livraison?annonceId=${listing.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] bg-[#1C3049] hover:bg-[#2A4365] text-white font-bold text-[10px] sm:text-[11px] shadow-xs transition-colors shrink-0"
                title="Commander la livraison express"
              >
                <IconPackage className="w-3.5 h-3.5 text-[#C9A882]" />
                <span>Livrer</span>
              </Link>
            );
          })()
        )}
      </div>
    </article>
  );
}
