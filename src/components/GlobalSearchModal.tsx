'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { INITIAL_DRIVERS } from '@/lib/drivers';
import { formatCFA } from '@/lib/format';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { listings } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedListings = trimmed
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(trimmed) ||
          l.category.toLowerCase().includes(trimmed) ||
          l.neighborhood.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const matchedDrivers = trimmed
    ? INITIAL_DRIVERS.filter(
        (d) =>
          d.fullName.toLowerCase().includes(trimmed) ||
          d.fleetName?.toLowerCase().includes(trimmed) ||
          d.vehicleModel.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  // Unique shops
  const uniqueShops = Array.from(new Set(listings.map((l) => l.sellerName)));
  const matchedShops = trimmed
    ? uniqueShops.filter((s) => s.toLowerCase().includes(trimmed)).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl border border-[#DDCDB6] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#DDCDB6] flex items-center gap-3 bg-[#FAF8F5]">
          <span className="text-xl text-[#7A5133]">🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit (ex: iPhone, voiture, robe), une boutique ou un chauffeur..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#2A211A] font-medium focus:outline-none placeholder:text-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 text-xs px-2 py-1 rounded-md"
            >
              Effacer
            </button>
          )}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#2A211A] p-1 text-sm font-bold ml-2"
          >
            ✕
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!query.trim() && (
            <div className="py-8 text-center text-stone-400 text-sm">
              <p className="font-semibold text-[#573721]">Recherche globale instantanée</p>
              <p className="text-xs text-[#7A6A5C] mt-1">
                Tapez un mot-clé pour explorer les annonces, boutiques et chauffeurs certifiés de Dakar.
              </p>
            </div>
          )}

          {query.trim() && (
            <>
              {/* Listings Results */}
              {matchedListings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#7A5133] uppercase tracking-wider mb-2">
                    🛍️ Annonces ({matchedListings.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedListings.map((l) => (
                      <Link
                        key={l.id}
                        href={`/annonce/${l.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F2E9DC] transition-colors border border-transparent hover:border-[#DDCDB6]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={l.imageUrl || l.images?.[0]}
                            alt={l.title}
                            className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#2A211A]">{l.title}</p>
                            <p className="text-xs text-[#7A6A5C]">{l.neighborhood}, Dakar</p>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-[#1C3049] tabular-nums whitespace-nowrap">
                          {formatCFA(l.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Shops Results */}
              {matchedShops.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#7A5133] uppercase tracking-wider mb-2">
                    🏬 Boutiques Certifiées ({matchedShops.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedShops.map((shop, idx) => (
                      <Link
                        key={idx}
                        href={`/boutique/${encodeURIComponent(shop)}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F2E9DC] transition-colors border border-transparent hover:border-[#DDCDB6]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold text-sm">
                            🏬
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#2A211A]">{shop}</p>
                            <p className="text-xs text-emerald-600 font-semibold">✓ Boutique Vérifiée</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#7A5133]">Voir vitrine →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Drivers Results */}
              {matchedDrivers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#1C3049] uppercase tracking-wider mb-2">
                    🛵 Chauffeurs & Flottes ({matchedDrivers.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedDrivers.map((d) => (
                      <Link
                        key={d.id}
                        href={`/chauffeur/${d.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F2E9DC] transition-colors border border-transparent hover:border-[#DDCDB6]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={d.avatarUrl}
                            alt={d.fullName}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#2A211A]">{d.fullName}</p>
                            <p className="text-xs text-[#1C3049] font-medium">{d.vehicleModel}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#1C3049]">Réserver →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchedListings.length === 0 && matchedShops.length === 0 && matchedDrivers.length === 0 && (
                <div className="py-8 text-center text-stone-400 text-sm">
                  Aucun résultat trouvé pour « {query} ».
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
