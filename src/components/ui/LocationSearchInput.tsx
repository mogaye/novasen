'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ZONES, SENEGAL_REGIONS, searchZones } from '@/lib/zones';
import { ZoneId } from '@/lib/types';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if customText changes externally
  useEffect(() => {
    if (customText !== undefined) {
      setQuery(customText);
    }
  }, [customText]);

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
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-[#DDCDB6] shadow-2xl overflow-hidden max-h-80 flex flex-col animate-fade-in divide-y divide-[#DDCDB6]/40">
          
          {/* Header with Search & Regions Filter Chips */}
          <div className="p-2.5 bg-[#FAF6F0] flex flex-col gap-2 border-b border-[#DDCDB6]">
            <div className="flex items-center justify-between text-[0.72rem] font-bold uppercase tracking-wider text-[#7A6A5C]">
              <span className="flex items-center gap-1">
                <IconSearch className="w-3 h-3 text-[#1C3049]" />
                {trimmedQuery ? `Résultats pour « ${query} »` : 'Lieux & Villes du Sénégal'}
              </span>
              <span className="bg-[#E8DBC8] text-[#1C3049] px-2 py-0.5 rounded-full text-[10px]">
                {filteredZones.length} résultat(s)
              </span>
            </div>

            {/* Quick region filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {REGION_SHORTCUTS.map((reg) => {
                const isActive = selectedRegionFilter === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedRegionFilter(reg.id)}
                    className={`px-2.5 py-1 rounded-md whitespace-nowrap text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1C3049] text-white shadow-xs'
                        : 'bg-white text-[#573721] border border-[#DDCDB6] hover:bg-[#F2E9DC]'
                    }`}
                  >
                    {reg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Address Direct Validation Option */}
          {query.trim() && (
            <div className="p-2 bg-[#F2E9DC]/60 border-b border-[#DDCDB6]">
              <button
                type="button"
                onClick={handleCustomValidate}
                className="w-full text-left px-3 py-2 rounded-lg bg-white border border-[#DDCDB6] hover:border-[#1C3049] flex items-center justify-between gap-2 text-xs font-semibold text-[#1C3049] hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">📍</span>
                  <span className="truncate">
                    Utiliser l'adresse exacte : <strong className="text-[#7A5133]">« {query.trim()} »</strong>
                  </span>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-[#1C3049] text-white px-2 py-1 rounded">
                  Valider ↵
                </span>
              </button>
            </div>
          )}

          {/* Scrollable list of locations */}
          <div className="overflow-y-auto max-h-60 divide-y divide-[#DDCDB6]/30">
            {filteredZones.length > 0 ? (
              filteredZones.map((zone) => {
                const isSelected = zone.id === value;
                return (
                  <button
                    key={`suggest-${zone.id}`}
                    type="button"
                    onClick={() => handleSelect(zone.id, zone.name)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E8DBC8] text-[#1C3049] font-bold'
                        : 'hover:bg-[#FAF6F0] text-[#2A211A]'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#2A211A]">{zone.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8DBC8] px-1.5 py-0.5 rounded text-[#1C3049] border border-[#DDCDB6]">
                          {zone.region}
                        </span>
                        {zone.popular && (
                          <span className="text-[10px] bg-amber-50 px-1.5 py-0.5 rounded text-amber-800 border border-amber-200 font-medium">
                            Populaire ⭐
                          </span>
                        )}
                      </div>
                      {zone.description && (
                        <span className="text-xs text-[#7A6A5C] line-clamp-1">{zone.description}</span>
                      )}
                    </div>

                    {isSelected && <IconCheck className="w-4 h-4 text-[#1C3049] shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[#7A6A5C] flex flex-col gap-2">
                <span>Aucune ville ou quartier pré-enregistré pour "{query}".</span>
                <button
                  type="button"
                  onClick={handleCustomValidate}
                  className="self-center px-3 py-1.5 bg-[#1C3049] text-white rounded-lg text-xs font-bold hover:bg-[#13223A] transition-all cursor-pointer shadow-xs"
                >
                  Valider « {query} » comme adresse personnalisée
                </button>
              </div>
            )}
          </div>

          {/* Footer Helper */}
          <div className="p-2 bg-[#F2E9DC]/40 text-[11px] text-[#7A6A5C] text-center">
            💡 Vous pouvez taper n’importe quelle adresse, rue ou repère précis et appuyer sur <strong>Entrée</strong> ou <strong>Valider</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
