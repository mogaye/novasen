'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ZONES } from '@/lib/zones';
import { ZoneId } from '@/lib/types';
import { IconMapPin, IconX, IconCheck } from './Icons';

interface LocationSearchInputProps {
  label?: string;
  value: ZoneId;
  customText?: string;
  onChange: (zoneId: ZoneId, displayName: string) => void;
  placeholder?: string;
  className?: string;
  accentColor?: 'market' | 'transport';
}

export function LocationSearchInput({
  label,
  value,
  customText,
  onChange,
  placeholder = 'Rechercher un quartier ou lieu à Dakar...',
  className = '',
  accentColor = 'transport',
}: LocationSearchInputProps) {
  const currentZone = ZONES.find((z) => z.id === value);
  const [query, setQuery] = useState(customText !== undefined ? customText : (currentZone?.name || ''));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync if value prop changes from outside (e.g. preset selection)
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

  // Filter zones only when there is an actual search query
  const trimmedQuery = query.trim().toLowerCase();
  const filteredZones = trimmedQuery
    ? ZONES.filter((z) =>
        z.name.toLowerCase().includes(trimmedQuery) ||
        (z.description && z.description.toLowerCase().includes(trimmedQuery))
      )
    : ZONES;

  const handleSelect = (zoneId: ZoneId, name: string) => {
    setQuery(name);
    onChange(zoneId, name);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    setIsOpen(true);

    if (text.trim() === '') {
      onChange(value, '');
      return;
    }

    // Try finding exact or closest matching zone without false matching on empty string
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
  };

  const isTransport = accentColor === 'transport';

  return (
    <div ref={containerRef} className={`relative flex flex-col justify-end gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between min-h-[22px]">
          <label className="text-xs uppercase tracking-wider font-bold text-[#573721] truncate">
            {label}
          </label>
          <span className="text-[10px] font-medium text-[#7A6A5C] bg-[#F2E9DC] px-2 py-0.5 rounded-full shrink-0">
            Dakar & Régions
          </span>
        </div>
      )}

      <div className="relative flex items-center">
        <span className="absolute left-3.5 flex items-center pointer-events-none text-[#7A6A5C]">
          <IconMapPin className={`w-4 h-4 ${isTransport ? 'text-[#1C3049]' : 'text-[#7A5133]'}`} />
        </span>

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full h-12 pl-10 pr-10 bg-white text-[#2A211A] text-sm font-semibold rounded-xl border border-[#DDCDB6] shadow-xs focus:outline-none transition-all ${
            isTransport
              ? 'focus:ring-2 focus:ring-[#1C3049] focus:border-[#1C3049]'
              : 'focus:ring-2 focus:ring-[#7A5133] focus:border-[#7A5133]'
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-[#7A6A5C] hover:text-[#2A211A] rounded-full hover:bg-black/5 cursor-pointer transition-colors"
            aria-label="Effacer le lieu"
          >
            <IconX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-[10px] border border-[#DDCDB6] shadow-2xl overflow-hidden max-h-64 overflow-y-auto animate-fade-in divide-y divide-[#DDCDB6]/40">
          <div className="p-2.5 bg-[#F2E9DC] text-[0.72rem] font-bold uppercase tracking-wider text-[#7A6A5C] flex items-center justify-between">
            <span>{trimmedQuery ? 'Résultats de recherche' : 'Tous les quartiers de Dakar'}</span>
            <span>{filteredZones.length} lieu(x)</span>
          </div>

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
                      : 'hover:bg-[#F2E9DC] text-[#2A211A]'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{zone.name}</span>
                      {zone.popular && (
                        <span className="text-[0.68rem] bg-white px-1.5 py-0.2 rounded text-[#7A5133] border border-[#DDCDB6]">
                          Populaire
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
            <div className="p-4 text-center text-xs text-[#7A6A5C]">
              <span>Aucun quartier pré-enregistré pour "{query}". Vous pouvez conserver ce nom de lieu précis.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
