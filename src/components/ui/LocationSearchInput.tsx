'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ZONES, SENEGAL_REGIONS, searchZones } from '@/lib/zones';
import { ZoneId } from '@/lib/types';
import { getSenegalPlacePredictions, PlacePrediction } from '@/lib/googleMaps';
import { IconMapPin, IconX, IconCheck, IconSearch, IconArrowRight } from './Icons';

interface LocationSearchInputProps {
  label?: string;
  value: ZoneId;
  customText?: string;
  onChange: (zoneId: ZoneId, displayName: string) => void;
  placeholder?: string;
  className?: string;
  accentColor?: 'market' | 'transport';
}

const REGION_SHORTCUTS = [
  { label: 'Tout le Sénégal', id: 'all' },
  { label: 'Dakar & Banlieue', id: 'Dakar' },
  { label: 'Thiès & Petite-Côte', id: 'Thiès' },
  { label: 'Touba & Diourbel', id: 'Diourbel' },
  { label: 'Saint-Louis & Nord', id: 'Saint-Louis' },
  { label: 'Casamance (Ziguinchor/Kolda)', id: 'Ziguinchor' },
  { label: 'Sénégal Oriental & Centre', id: 'Tambacounda' },
];

export function LocationSearchInput({
  label,
  value,
  customText,
  onChange,
  placeholder = 'Écrivez une rue, quartier ou ville au Sénégal...',
  className = '',
  accentColor = 'transport',
}: LocationSearchInputProps) {
  const currentZone = useMemo(() => ZONES.find((z) => z.id === value), [value]);
  const [query, setQuery] = useState(customText !== undefined ? customText : (currentZone?.name || ''));
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [googlePredictions, setGooglePredictions] = useState<PlacePrediction[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if customText changes externally
  useEffect(() => {
    if (customText !== undefined) {
      setQuery(customText);
    }
  }, [customText]);

  // Google Places autocomplete search when user types
  useEffect(() => {
    let active = true;
    if (query.trim().length >= 2) {
      getSenegalPlacePredictions(query.trim()).then((predictions) => {
        if (active) {
          setGooglePredictions(predictions);
        }
      });
    } else {
      setGooglePredictions([]);
    }
    return () => {
      active = false;
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // If user left input empty, restore current zone name
        if (!query.trim() && currentZone) {
          setQuery(currentZone.name);
          onChange(currentZone.id, currentZone.name);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, currentZone, onChange]);

  // Filter zones
  const trimmedQuery = query.trim().toLowerCase();
  const filteredZones = useMemo(() => {
    return searchZones(query, selectedRegionFilter === 'all' ? undefined : selectedRegionFilter);
  }, [query, selectedRegionFilter]);

  const handleSelect = (zoneId: ZoneId, name: string) => {
    setQuery(name);
    onChange(zoneId, name);
    setIsOpen(false);
  };

  const handleCustomValidate = () => {
    if (!query.trim()) return;
    // Find closest matching zone or fallback to current zone ID with custom text
    const match = filteredZones.length > 0 ? filteredZones[0] : (currentZone || ZONES[0]);
    onChange(match.id, query.trim());
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomValidate();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    setIsOpen(true);

    if (text.trim() === '') {
      onChange(value, '');
      return;
    }

    // Try finding exact or closest matching zone
    const match = ZONES.find((z) => z.name.toLowerCase() === text.trim().toLowerCase()) ||
                  ZONES.find((z) => z.name.toLowerCase().startsWith(text.trim().toLowerCase()));
    if (match) {
      onChange(match.id, text);
    } else {
      onChange(value, text);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
    onChange(value, '');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const isTransport = accentColor === 'transport';

  return (
    <div ref={containerRef} className={`relative flex flex-col justify-end gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between min-h-[22px]">
          <label className="text-xs uppercase tracking-wider font-bold text-[#573721] truncate flex items-center gap-1.5">
            <span>{label}</span>
          </label>
          <span className="text-[10px] font-semibold text-[#1C3049] bg-[#E8DBC8] px-2.5 py-0.5 rounded-full shrink-0 border border-[#DDCDB6]">
            🇸🇳 14 Régions du Sénégal
          </span>
        </div>
      )}

      {/* Input Bar */}
      <div className="relative flex items-center">
        <span className="absolute left-3.5 flex items-center pointer-events-none text-[#7A6A5C]">
          <IconMapPin className={`w-4 h-4 ${isTransport ? 'text-[#1C3049]' : 'text-[#7A5133]'}`} />
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full h-12 pl-10 pr-24 bg-white text-[#2A211A] text-sm font-semibold rounded-xl border border-[#DDCDB6] shadow-xs focus:outline-none transition-all ${
            isTransport
              ? 'focus:ring-2 focus:ring-[#1C3049] focus:border-[#1C3049]'
              : 'focus:ring-2 focus:ring-[#7A5133] focus:border-[#7A5133]'
          }`}
        />

        {/* Clear & Validate Shortcut Buttons */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-[#7A6A5C] hover:text-[#2A211A] rounded-full hover:bg-black/5 cursor-pointer transition-colors"
              aria-label="Effacer le lieu"
              title="Effacer"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
          {query.trim() && (
            <button
              type="button"
              onClick={handleCustomValidate}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-xs flex items-center gap-1 ${
                isTransport
                  ? 'bg-[#1C3049] text-white hover:bg-[#13223A]'
                  : 'bg-[#7A5133] text-white hover:bg-[#573721]'
              }`}
              title="Valider cette adresse"
            >
              <span>Valider</span>
              <IconCheck className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List with 14 Regions */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white rounded-2xl border-2 border-[#DDCDB6] shadow-[0_20px_60px_-15px_rgba(28,48,73,0.3)] flex flex-col animate-fade-in divide-y divide-[#DDCDB6]/40 overflow-hidden"
          style={{ minWidth: '100%' }}
        >
          {/* Header with Search & Regions Filter Chips */}
          <div className="p-3 bg-[#FAF6F0] flex flex-col gap-2.5 border-b border-[#DDCDB6]">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#7A6A5C]">
              <span className="flex items-center gap-1.5 text-[#1C3049]">
                <IconSearch className="w-3.5 h-3.5 text-[#1C3049]" />
                {trimmedQuery ? `Résultats pour « ${query} »` : 'Lieux & Villes du Sénégal'}
              </span>
              <span className="bg-[#E8DBC8] text-[#1C3049] font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-[#DDCDB6]">
                {filteredZones.length} résultat(s)
              </span>
            </div>

            {/* Quick region filter chips (clean, no ugly scrollbar) */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {REGION_SHORTCUTS.map((reg) => {
                const isActive = selectedRegionFilter === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedRegionFilter(reg.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1C3049] text-white shadow-xs scale-102'
                        : 'bg-white text-[#573721] border border-[#DDCDB6] hover:bg-[#F2E9DC]'
                    }`}
                  >
                    {reg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Address Direct Validation Option (if user typed text) */}
          {query.trim() && (
            <div className="p-2.5 bg-[#F2E9DC]/70 border-b border-[#DDCDB6]">
              <button
                type="button"
                onClick={handleCustomValidate}
                className="w-full text-left p-3 rounded-xl bg-white border-2 border-[#1C3049]/30 hover:border-[#1C3049] flex items-center justify-between gap-3 text-xs font-bold text-[#1C3049] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg">📍</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[#7A6A5C] uppercase tracking-wider font-semibold">
                      Utiliser cette adresse précise
                    </span>
                    <span className="truncate text-sm font-extrabold text-[#1C3049] group-hover:text-[#7A5133]">
                      « {query.trim()} »
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-extrabold uppercase tracking-wider bg-[#1C3049] group-hover:bg-[#13223A] text-white px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1">
                  <span>Valider</span>
                  <span>↵</span>
                </span>
              </button>
            </div>
          )}

          {/* Google Places Predictions (if available) */}
          {googlePredictions.length > 0 && (
            <div className="bg-[#FAF6F0] p-2 border-b border-[#DDCDB6] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#1C3049] px-2 flex items-center gap-1.5">
                <span>🗺️ Adresses Google Maps (Sénégal) :</span>
              </span>
              {googlePredictions.map((pred) => (
                <button
                  key={pred.placeId}
                  type="button"
                  onClick={() => {
                    const match = ZONES.find((z) => pred.description.toLowerCase().includes(z.name.toLowerCase())) || currentZone || ZONES[0];
                    handleSelect(match.id, pred.mainText || pred.description);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#E8DBC8] flex items-center justify-between text-xs font-semibold text-[#1C3049] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm shrink-0">📍</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold truncate text-[#1C3049]">{pred.mainText}</span>
                      <span className="text-[10px] text-[#7A6A5C] truncate">{pred.secondaryText}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7A5133] font-bold shrink-0">Choisir →</span>
                </button>
              ))}
            </div>
          )}

          {/* Scrollable list of locations (Expanded height & spacious) */}
          <div className="overflow-y-auto max-h-72 divide-y divide-[#DDCDB6]/40">
            {filteredZones.length > 0 ? (
              filteredZones.map((zone) => {
                const isSelected = zone.id === value;
                return (
                  <button
                    key={`suggest-${zone.id}`}
                    type="button"
                    onClick={() => handleSelect(zone.id, zone.name)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8DBC8] text-[#1C3049] font-bold'
                        : 'hover:bg-[#FAF6F0] text-[#2A211A]'
                    }`}
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#2A211A]">{zone.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8DBC8] px-2 py-0.5 rounded text-[#1C3049] border border-[#DDCDB6]">
                          {zone.region}
                        </span>
                        {zone.department && zone.department !== zone.region && (
                          <span className="text-[10px] text-[#7A6A5C] font-semibold">
                            ({zone.department})
                          </span>
                        )}
                        {zone.popular && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold border border-amber-200">
                            ⭐ Hub
                          </span>
                        )}
                      </div>
                      {zone.description && (
                        <span className="text-xs text-[#7A6A5C] truncate">{zone.description}</span>
                      )}
                    </div>

                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-[#1C3049] text-white flex items-center justify-center shrink-0">
                        <IconCheck className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-xs text-[#7A6A5C] opacity-0 group-hover:opacity-100 transition-opacity">
                        Choisir →
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-[#7A6A5C] flex flex-col items-center gap-3">
                <span className="text-base">📍</span>
                <span className="font-medium">
                  Aucune localité trouvée avec le mot « {query} ».
                </span>
                <button
                  type="button"
                  onClick={handleCustomValidate}
                  className="px-4 py-2 bg-[#1C3049] text-white rounded-xl text-xs font-bold hover:bg-[#13223A] transition-all cursor-pointer shadow-md"
                >
                  Valider « {query} » comme adresse personnalisée ↵
                </button>
              </div>
            )}
          </div>

          {/* Footer Helper */}
          <div className="p-2.5 bg-[#FAF6F0] text-[11px] text-[#7A6A5C] text-center font-medium border-t border-[#DDCDB6]">
            🇸🇳 Tapez n’importe quelle adresse libre et cliquez sur <strong>Valider</strong> ou appuyez sur <strong>Entrée</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
