'use client';

import React, { useState, useMemo, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ListingCard } from '@/components/ListingCard';
import { FilterPanel, FilterState } from '@/components/FilterPanel';
import { CategoryId, Condition, ZoneId } from '@/lib/types';
import { CATEGORIES } from '@/lib/listings';
import { IconSearch, IconArrowRight, IconArrowLeft } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

function MarketContent() {
  const searchParams = useSearchParams();
  const gridTopRef = useRef<HTMLDivElement>(null);
  const initialCategory = (searchParams.get('category') as CategoryId) || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialZone = (searchParams.get('zone') as ZoneId) || 'all';

  const { listings, favorites } = useApp();
  const isFavoritesOnly = searchParams.get('favorites') === 'true';
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination / Lot sizing state
  const [pageSize, setPageSize] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    zoneId: initialZone,
    condition: 'all',
    minPrice: '',
    maxPrice: '',
    transportEligibility: 'all',
    searchQuery: initialQuery,
    sortBy: 'date_desc',
  });

  const handleReset = () => {
    setFilters({
      category: 'all',
      zoneId: 'all',
      condition: 'all',
      minPrice: '',
      maxPrice: '',
      transportEligibility: 'all',
      searchQuery: '',
      sortBy: 'date_desc',
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Filter by favorites only if URL specifies ?favorites=true
        if (isFavoritesOnly && !favorites.includes(item.id)) {
          return false;
        }
        // Query search in title, description, seller, neighborhood
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchSeller = item.sellerName.toLowerCase().includes(query);
          const matchZone = item.neighborhood.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchSeller && !matchZone) return false;
        }

        // Category
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        // Zone
        if (filters.zoneId !== 'all' && item.zoneId !== filters.zoneId) {
          return false;
        }

        // Condition
        if (filters.condition !== 'all' && item.condition !== filters.condition) {
          return false;
        }

        // Price range
        if (filters.minPrice && item.price < Number(filters.minPrice)) {
          return false;
        }
        if (filters.maxPrice && item.price > Number(filters.maxPrice)) {
          return false;
        }

        // Transport eligibility
        if (filters.transportEligibility === 'passagers' && !item.eligiblePassengers) {
          return false;
        }
        if (filters.transportEligibility === 'colis' && !item.eligibleParcels) {
          return false;
        }
        if (filters.transportEligibility === 'both' && (!item.eligiblePassengers || !item.eligibleParcels)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        // Featured and newest first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [listings, filters]);

  // Paginated Batch Slice
  const totalItems = filteredListings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentBatch = filteredListings.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DDCDB6]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
            Place de Marché du Sénégal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#573721] tracking-tight mt-1">
            Toutes les annonces
          </h1>
          <p className="text-sm text-[#7A6A5C] mt-1">
            Achetez et vendez partout au Sénégal avec livraison sécurisée NovaSen.
          </p>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative min-w-[260px]">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A6A5C]">
              <IconSearch className="w-4 h-4 text-[#7A5133]" />
            </span>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              placeholder="Rechercher sur le marché..."
              className="w-full min-h-[48px] pl-10 pr-4 bg-white text-sm rounded-[4px] border border-[#DDCDB6] focus:outline-none focus:border-[#7A5133]"
            />
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
              setCurrentPage(1);
            }}
            className="min-h-[48px] px-3 bg-white text-sm font-semibold rounded-[4px] border border-[#DDCDB6] focus:outline-none focus:border-[#7A5133] cursor-pointer"
            aria-label="Trier les résultats"
          >
            <option value="date_desc">Tri : Plus récentes</option>
            <option value="price_asc">Prix : Croissant</option>
            <option value="price_desc">Prix : Décroissant</option>
          </select>

          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setMobileFilterOpen(true)}
          >
            <span>Filtres ({filteredListings.length})</span>
          </Button>
        </div>
      </div>

      {/* Horizontal Category Scroll Bar (All Devices) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        <button
          type="button"
          onClick={() => {
            setFilters((prev) => ({ ...prev, category: 'all' }));
            setCurrentPage(1);
          }}
          className={`px-3.5 py-2 rounded-[999px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
            filters.category === 'all'
              ? 'bg-[#7A5133] text-white border-[#7A5133] shadow-xs'
              : 'bg-white text-[#573721] border-[#DDCDB6] hover:bg-[#F2E9DC]'
          }`}
        >
          ✨ Toutes ({listings.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={`quick-chip-${cat.id}`}
            type="button"
            onClick={() => {
              setFilters((prev) => ({ ...prev, category: cat.id }));
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-[999px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
              filters.category === cat.id
                ? 'bg-[#7A5133] text-white border-[#7A5133] shadow-xs'
                : 'bg-white text-[#573721] border-[#DDCDB6] hover:bg-[#F2E9DC]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div ref={gridTopRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onReset={handleReset}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />
        </div>

        {/* Right Listings Results Grid */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          {/* Result Count and Batch Size Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#E8DBC8]/60 px-4 py-3 rounded-[8px] border border-[#DDCDB6] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#573721]">
                <strong className="text-[#1C3049] tabular-nums font-bold">{totalItems}</strong>{' '}
                annonce{totalItems > 1 ? 's' : ''} • Lot de {startIndex + 1} à {endIndex}
              </span>
            </div>

            {/* Batch Selector (12 / 24 / 36 par page) */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[#7A6A5C] font-medium">Afficher par lot :</span>
              <div className="inline-flex rounded-[6px] bg-white border border-[#DDCDB6] p-0.5">
                {[12, 24, 36].map((size) => (
                  <button
                    key={`size-${size}`}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-[4px] text-xs font-bold transition-all cursor-pointer ${
                      pageSize === size
                        ? 'bg-[#7A5133] text-white shadow-xs'
                        : 'text-[#7A6A5C] hover:text-[#2A211A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listings Grid - 2 colonnes soignées sur mobile, 3 sur tablette/bureau */}
          {currentBatch.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6 animate-fade-in">
              {currentBatch.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-[10px] border border-[#DDCDB6] p-12 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E8DBC8] flex items-center justify-center text-[#7A5133]">
                <IconSearch className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-[#573721]">
                Aucune annonce ne correspond à ces critères
              </h3>
              <p className="text-sm text-[#7A6A5C] max-w-md">
                Essayez d'élargir votre recherche en sélectionnant d'autres quartiers de Dakar ou en modifiant vos filtres de prix.
              </p>
              <Button variant="primary" onClick={handleReset} className="mt-2">
                Réinitialiser tous les filtres
              </Button>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────── */}
          {/* PAGINATION PAR LOTS (Page 1, 2, 3...) */}
          {/* ─────────────────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-[12px] border border-[#DDCDB6] shadow-xs mt-4">
              <div className="text-xs text-[#7A6A5C]">
                Page <strong className="text-[#1C3049]">{safeCurrentPage}</strong> sur{' '}
                <strong className="text-[#1C3049]">{totalPages}</strong> (Lot de {pageSize} annonces)
              </div>

              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => goToPage(safeCurrentPage - 1)}
                  className="px-3 py-1.5 rounded-[6px] border border-[#DDCDB6] text-xs font-bold text-[#573721] bg-[#F2E9DC] hover:bg-[#E8DBC8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <IconArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Précédent</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const hasGap = prev && page - prev > 1;
                    return (
                      <React.Fragment key={`page-num-${page}`}>
                        {hasGap && <span className="px-1 text-xs text-[#7A6A5C]">…</span>}
                        <button
                          type="button"
                          onClick={() => goToPage(page)}
                          className={`min-w-[34px] h-[34px] rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                            safeCurrentPage === page
                              ? 'bg-[#7A5133] text-white shadow-xs'
                              : 'bg-white hover:bg-[#F2E9DC] text-[#573721] border border-[#DDCDB6]'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                {/* Next Button */}
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => goToPage(safeCurrentPage + 1)}
                  className="px-3 py-1.5 rounded-[6px] border border-[#DDCDB6] text-xs font-bold text-[#573721] bg-[#F2E9DC] hover:bg-[#E8DBC8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center font-bold text-[#573721]">Chargement du marché...</div>}>
      <MarketContent />
    </Suspense>
  );
}
