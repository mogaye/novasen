'use client';

import React from 'react';
import Link from 'next/link';
import { CategoryId, Condition, ZoneId } from '@/lib/types';
import { ZONES, SENEGAL_REGIONS } from '@/lib/zones';
import { CATEGORIES } from '@/lib/listings';
import { Field, selectClass } from './ui/Field';
import { Button } from './ui/Button';
import {
  IconCar,
  IconPackage,
  IconX,
  IconShieldCheck,
  IconArrowRight,
  IconStar,
  IconPhone,
} from './ui/Icons';

export interface FilterState {
  category: CategoryId | 'all';
  zoneId: ZoneId | 'all';
  condition: Condition | 'all';
  minPrice: string;
  maxPrice: string;
  transportEligibility: 'all' | 'passagers' | 'colis' | 'both';
  searchQuery: string;
  sortBy: 'date_desc' | 'price_asc' | 'price_desc';
}

export interface FilterPanelProps {
  filters: FilterState;
  setFilters?: React.Dispatch<React.SetStateAction<FilterState>>;
  onChange?: (filters: FilterState) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function FilterPanel({
  filters,
  setFilters,
  onChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
}: FilterPanelProps) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    if (onChange) {
      onChange({ ...filters, [key]: value });
    } else if (setFilters) {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const POPULAR_ZONES: { id: ZoneId; name: string; icon: string }[] = [
    { id: 'almadies', name: 'Almadies', icon: '🌊' },
    { id: 'plateau', name: 'Plateau', icon: '🏛️' },
    { id: 'keur_massar', name: 'Keur Massar', icon: '🏙️' },
    { id: 'thies', name: 'Thiès', icon: '🚂' },
    { id: 'saly', name: 'Saly / Mbour', icon: '🏖️' },
    { id: 'touba', name: 'Touba', icon: '🕌' },
    { id: 'saint_louis', name: 'Saint-Louis', icon: '🏛️' },
    { id: 'ziguinchor', name: 'Ziguinchor', icon: '🌴' },
  ];

  return (
    <div
      className={`flex flex-col gap-6 ${
        isOpenMobile
          ? 'fixed inset-4 z-50 overflow-y-auto shadow-2xl bg-[#FAF6F0] p-4 rounded-[12px] sm:static sm:inset-auto sm:z-auto sm:shadow-none sm:p-0'
          : 'hidden lg:flex'
      }`}
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. PANNEAU DE FILTRES PRINCIPAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside className="bg-white rounded-[12px] border border-[#DDCDB6] p-5 flex flex-col gap-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DDCDB6] pb-3">
          <h3 className="font-bold text-base font-heading text-[#573721] flex items-center gap-2">
            <span>Filtres de recherche</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-[#7A6A5C] hover:text-[#7A5133] font-medium underline cursor-pointer"
            >
              Réinitialiser
            </button>
            {isOpenMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-[4px] bg-[#E8DBC8] text-[#2A211A]"
                aria-label="Fermer les filtres"
              >
                <IconX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Catégories */}
        <Field label="Catégorie">
          <select
            value={filters.category}
            onChange={(e) => update('category', e.target.value as CategoryId | 'all')}
            className={selectClass}
          >
            <option value="all">Toutes les catégories (80+ annonces)</option>
            {CATEGORIES.map((cat) => (
              <option key={`filter-cat-${cat.id}`} value={cat.id}>
                {cat.icon} {cat.name} {cat.count ? `(${cat.count})` : ''}
              </option>
            ))}
          </select>
        </Field>

        {/* Quartier / Région du Sénégal */}
        <Field label="Localisation (14 Régions)">
          <select
            value={filters.zoneId}
            onChange={(e) => update('zoneId', e.target.value as ZoneId | 'all')}
            className={selectClass}
          >
            <option value="all">🇸🇳 Tout le Sénégal (14 Régions & Villes)</option>
            {SENEGAL_REGIONS.map((reg) => {
              const regZones = ZONES.filter((z) => z.region.toLowerCase() === reg.name.toLowerCase());
              if (regZones.length === 0) return null;
              return (
                <optgroup key={`reg-group-${reg.id}`} label={`${reg.badge} Région de ${reg.name} (${regZones.length} localités)`}>
                  {regZones.map((zone) => (
                    <option key={`filter-zone-${zone.id}`} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </Field>

        {/* Éligibilité au Transport */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#DDCDB6]/60">
          <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
            Flotte & Livraison
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                update(
                  'transportEligibility',
                  filters.transportEligibility === 'passagers' ? 'all' : 'passagers'
                )
              }
              className={`p-2.5 rounded-[6px] border flex items-center justify-center gap-1.5 transition-colors ${
                filters.transportEligibility === 'passagers'
                  ? 'bg-[#1C3049] text-white border-[#1C3049] font-bold shadow-xs'
                  : 'bg-[#F2E9DC] text-[#2A211A] border-[#DDCDB6]'
              }`}
            >
              <IconCar className="w-3.5 h-3.5" />
              <span>VTC Passagers</span>
            </button>
            <button
              type="button"
              onClick={() =>
                update(
                  'transportEligibility',
                  filters.transportEligibility === 'colis' ? 'all' : 'colis'
                )
              }
              className={`p-2.5 rounded-[6px] border flex items-center justify-center gap-1.5 transition-colors ${
                filters.transportEligibility === 'colis'
                  ? 'bg-[#7A5133] text-white border-[#7A5133] font-bold shadow-xs'
                  : 'bg-[#F2E9DC] text-[#2A211A] border-[#DDCDB6]'
              }`}
            >
              <IconPackage className="w-3.5 h-3.5" />
              <span>Livreurs Colis</span>
            </button>
          </div>
        </div>

        {/* Budget Min et Max */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#DDCDB6]/60">
          <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
            Budget (FCFA)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => update('minPrice', e.target.value)}
              className="w-full min-h-[44px] px-3 bg-[#F2E9DC]/60 text-xs rounded-[6px] border border-[#DDCDB6] focus:outline-none focus:border-[#7A5133]"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => update('maxPrice', e.target.value)}
              className="w-full min-h-[44px] px-3 bg-[#F2E9DC]/60 text-xs rounded-[6px] border border-[#DDCDB6] focus:outline-none focus:border-[#7A5133]"
            />
          </div>
        </div>

        {/* État */}
        <Field label="État de l’article">
          <select
            value={filters.condition}
            onChange={(e) => update('condition', e.target.value as Condition | 'all')}
            className={selectClass}
          >
            <option value="all">Tous les états</option>
            <option value="Neuf">Neuf</option>
            <option value="Comme neuf">Comme neuf</option>
            <option value="Bon état">Bon état</option>
            <option value="Occasion">Occasion</option>
            <option value="Reconditionné">Reconditionné</option>
            <option value="Importé">Importé</option>
          </select>
        </Field>

        {isOpenMobile && (
          <Button variant="primary" fullWidth onClick={onCloseMobile} className="mt-2">
            Voir les résultats
          </Button>
        )}
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. WIDGET TOP QUARTIERS DAKAR (ACCÈS RAPIDE 1-CLIC) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-5 flex flex-col gap-3 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A5133] flex items-center justify-between">
          <span>Top Quartiers Dakar</span>
          <span className="text-[0.68rem] text-[#7A6A5C] lowercase">1-clic</span>
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {POPULAR_ZONES.map((z) => (
            <button
              key={`pop-z-${z.id}`}
              type="button"
              onClick={() => update('zoneId', filters.zoneId === z.id ? 'all' : z.id)}
              className={`px-2.5 py-1.5 rounded-[6px] text-xs font-semibold text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                filters.zoneId === z.id
                  ? 'bg-[#7A5133] text-white shadow-xs font-bold'
                  : 'bg-[#F2E9DC]/70 hover:bg-[#E8DBC8] text-[#573721]'
              }`}
            >
              <span>{z.icon}</span>
              <span className="truncate">{z.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. WIDGET VENDEUR / OUVRIR MA BOUTIQUE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#E8DBC8] to-[#DDCDB6] rounded-[12px] border border-[#C9A882] p-5 flex flex-col gap-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#7A5133] text-white flex items-center justify-center text-sm shadow-xs">
            🛍️
          </span>
          <div>
            <h4 className="text-xs font-bold text-[#573721] uppercase tracking-wide">
              Vendez sur NovaSen
            </h4>
            <p className="text-[0.72rem] text-[#7A6A5C]">3 annonces gratuites offertes</p>
          </div>
        </div>

        <p className="text-xs text-[#573721]/90 leading-relaxed">
          Ouvrez votre boutique vérifiée et faites livrer vos colis avec encaissement Wave / Orange Money par nos coursiers.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <Link href="/publier">
            <Button variant="primary" fullWidth className="text-xs min-h-[40px]">
              <span>Déposer une annonce</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link
            href="/vendeur"
            className="text-center text-xs font-bold text-[#7A5133] hover:underline"
          >
            Formules Boutique Pro →
          </Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. WIDGET TRANSPORT & COURSES EXPRESS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#1C3049] text-white rounded-[12px] border border-[#13223A] p-5 flex flex-col gap-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#2A4365] text-[#C9A882] flex items-center justify-center text-sm">
            🛵
          </span>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wide">
              Livraison Express Dakar
            </h4>
            <p className="text-[0.72rem] text-[#C9A882]">2 940 chauffeurs actifs</p>
          </div>
        </div>

        <p className="text-xs text-[#E8DBC8]/80 leading-relaxed">
          Commandez une course ou faites livrer un colis d'un quartier à un autre en moins de 45 minutes.
        </p>

        <Link href="/transport">
          <Button variant="secondary" fullWidth className="text-xs min-h-[40px] bg-[#2A4365] hover:bg-[#325078] text-white border-[#3A5D8A]">
            <span>Calculer un itinéraire</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. GARANTIES & SÉCURITÉ NOVASEN */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[12px] border border-[#DDCDB6] p-4 flex flex-col gap-2.5 text-xs text-[#573721]">
        <div className="flex items-center gap-2 font-bold text-[#7A5133]">
          <IconShieldCheck className="w-4 h-4" />
          <span>Garantie Teranga & Sécurité</span>
        </div>
        <ul className="flex flex-col gap-1.5 text-[0.72rem] text-[#7A6A5C]">
          <li className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Remise en mains propres ou par coursier</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Paiement après vérification du produit</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Support client dakarois 7j/7</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
