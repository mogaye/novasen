'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { IconCar, IconPackage, IconPlus, IconUser, IconX } from './ui/Icons';
import { GlowButton } from './ui/GlowButton';
import { GlobalSearchModal } from './GlobalSearchModal';

export function Header() {
  const pathname = usePathname();
  const { activeService, setActiveService, userListingsCount, userPlan } = useApp();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close menu on route change or ESC key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Synchronize route with active service
  useEffect(() => {
    if (pathname.startsWith('/transport') || pathname.startsWith('/livraison') || pathname.startsWith('/livreur')) {
      setActiveService('transport');
    } else if (pathname.startsWith('/marche') || pathname.startsWith('/publier') || pathname.startsWith('/vendeur')) {
      setActiveService('market');
    }
  }, [pathname, setActiveService]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isMarket = activeService === 'market';

  if (pathname === '/connexion') {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-[#F2E9DC]/95 backdrop-blur-md border-b border-[#DDCDB6] transition-all duration-300 ${
        isMarket
          ? 'shadow-[0_4px_20px_-8px_rgba(122,81,51,0.15)]'
          : 'shadow-[0_4px_20px_-8px_rgba(28,48,73,0.18)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-4 lg:gap-5 shrink-0">
          <Link
            href="/"
            className="flex flex-col group cursor-pointer focus:outline-none shrink-0"
            onClick={() => setActiveService('market')}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-[1.65rem] font-bold tracking-tight text-[#573721] font-heading whitespace-nowrap">
                Nova<span className={isMarket ? 'text-[#7A5133]' : 'text-[#1C3049]'}>Sen</span>
              </span>
            </div>
            <span className="text-[0.65rem] sm:text-[0.68rem] text-[#7A6A5C] tracking-wide whitespace-nowrap">
              Marché & Transport
            </span>
          </Link>

          {/* Quick Dual Service Pill Switch */}
          <div className="hidden md:flex items-center bg-[#E8DBC8] p-1 rounded-full border border-[#DDCDB6] shadow-xs shrink-0">
            <Link
              href="/marche"
              onClick={() => setActiveService('market')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap tracking-wide transition-all cursor-pointer ${
                isMarket
                  ? 'bg-[#7A5133] text-white shadow-xs'
                  : 'text-[#573721] hover:text-[#2A211A]'
              }`}
              title="Aller au Marché"
            >
              <span>🛍️ Marché</span>
            </Link>
            <Link
              href="/transport"
              onClick={() => setActiveService('transport')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap tracking-wide transition-all cursor-pointer ${
                !isMarket
                  ? 'bg-[#1C3049] text-white shadow-xs'
                  : 'text-[#1C3049] hover:text-[#13223A]'
              }`}
              title="Aller au Transport"
            >
              <span>🚗 Transport</span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-sm font-semibold text-[#2A211A] shrink-0">
          <Link
            href="/marche"
            onClick={() => setActiveService('market')}
            className={`hover:text-[#7A5133] transition-colors py-1 whitespace-nowrap ${
              pathname.startsWith('/marche') || pathname.startsWith('/annonce')
                ? 'text-[#7A5133] font-bold border-b-2 border-[#7A5133]'
                : ''
            }`}
          >
            Le Marché
          </Link>
          <Link
            href="/transport"
            onClick={() => setActiveService('transport')}
            className={`hover:text-[#1C3049] transition-colors py-1 whitespace-nowrap ${
              pathname.startsWith('/transport')
                ? 'text-[#1C3049] font-bold border-b-2 border-[#1C3049]'
                : ''
            }`}
          >
            Passagers & Colis
          </Link>
          <Link
            href="/tarifs"
            className={`hover:text-[#573721] transition-colors py-1 whitespace-nowrap ${
              pathname === '/tarifs' ? 'text-[#573721] font-bold border-b-2 border-[#573721]' : ''
            }`}
          >
            Grille Tarifaire
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 lg:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 min-h-[42px] px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F2E9DC] text-[#573721] text-xs font-bold border border-[#DDCDB6] transition-all shadow-xs"
            title="Recherche globale (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="hidden xl:inline text-stone-500 font-normal">Rechercher...</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] bg-stone-100 border border-stone-300 rounded text-stone-600 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Favorites Wishlist Link */}
          <Link
            href="/marche?favorites=true"
            className="inline-flex items-center gap-1.5 min-h-[42px] px-3 py-1.5 rounded-full bg-white hover:bg-[#F2E9DC] text-[#573721] text-xs font-bold border border-[#DDCDB6] transition-colors shadow-xs whitespace-nowrap"
            title="Mes annonces favorites"
          >
            <span>❤️</span>
            <span className="hidden md:inline whitespace-nowrap">Favoris</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#7A5133] text-white text-[10px] font-bold">
              {useApp().favorites.length}
            </span>
          </Link>

          <GlowButton
            href="/publier"
            variant={isMarket ? 'market' : 'transport'}
            size="sm"
            className="shrink-0"
          >
            <IconPlus className="w-3.5 h-3.5 text-[#E8DBC8]" />
            <span className="whitespace-nowrap">Déposer une annonce</span>
          </GlowButton>

          {user ? (
            <Link
              href="/compte"
              className="inline-flex items-center gap-2 min-h-[42px] px-4 py-1.5 rounded-full bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#2A211A] text-xs sm:text-sm font-semibold border border-[#DDCDB6] transition-colors whitespace-nowrap shadow-xs"
              title="Mon espace personnel & dashboard"
            >
              <IconUser className="w-4 h-4 text-[#573721]" />
              <span className="hidden md:inline whitespace-nowrap">{profile?.full_name?.split(' ')[0] || 'Mon Espace'}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isMarket ? 'bg-[#7A5133]' : 'bg-[#1C3049]'
                }`}
              />
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-1.5 rounded-full bg-[#7A5133] hover:bg-[#573721] text-white text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-xs"
              title="Se connecter ou créer un compte"
            >
              <IconUser className="w-4 h-4 text-white" />
              <span className="whitespace-nowrap">Connexion</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/publier"
            className="px-3 py-2 rounded-[4px] bg-[var(--accent)] text-white text-xs font-bold"
          >
            Publier
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-[4px] bg-[#E8DBC8] text-[#2A211A] border border-[#DDCDB6]"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <IconX className="w-6 h-6" /> : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-20 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start">
          <div
            className="bg-[#F2E9DC] border-b border-[#DDCDB6] p-6 flex flex-col gap-4 shadow-xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-2 bg-[#E8DBC8] p-1 rounded-[6px] border border-[#DDCDB6]">
              <Link
                href="/marche"
                onClick={() => {
                  setActiveService('market');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-center text-xs font-bold rounded-[4px] block transition-colors ${
                  isMarket ? 'bg-[#7A5133] text-white shadow-xs' : 'text-[#573721]'
                }`}
              >
                Acheter & Vendre (Marché)
              </Link>
              <Link
                href="/transport"
                onClick={() => {
                  setActiveService('transport');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-center text-xs font-bold rounded-[4px] block transition-colors ${
                  !isMarket ? 'bg-[#1C3049] text-white shadow-xs' : 'text-[#1C3049]'
                }`}
              >
                Faire Transporter
              </Link>
            </div>

            <nav className="flex flex-col gap-2 divide-y divide-[#DDCDB6]/50">
              <Link
                href="/marche"
                className="py-3 text-base font-semibold text-[#2A211A] flex items-center justify-between"
              >
                <span>Le Marché (Petites Annonces)</span>
                <span className="text-xs text-[#7A6A5C]">40 offres</span>
              </Link>
              <Link
                href="/transport"
                className="py-3 text-base font-semibold text-[#1C3049] flex items-center justify-between"
              >
                <span>Transport Passagers & Colis</span>
                <span className="text-xs text-[#1C3049] font-bold">Dakar</span>
              </Link>
              <Link
                href="/tarifs"
                className="py-3 text-base font-medium text-[#2A211A]"
              >
                Grilles Tarifaires Vendeurs & Chauffeurs
              </Link>
              <Link
                href="/vendeur"
                className="py-3 text-base font-medium text-[#7A5133]"
              >
                Ouvrir une Boutique Vendeur
              </Link>
              <Link
                href="/livreur"
                className="py-3 text-base font-medium text-[#1C3049]"
              >
                Devenir Livreur / Chauffeur
              </Link>
              <Link
                href="/compte"
                className="py-3 text-base font-medium text-[#2A211A] flex items-center justify-between"
              >
                <span>Mon Espace & Quota</span>
                <span className="text-xs bg-[#E8DBC8] px-2 py-0.5 rounded text-[#573721] font-semibold">
                  {userPlan.toUpperCase()}
                </span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-base font-bold text-emerald-800 flex items-center justify-between"
              >
                <span>🎧 Assistance & Opérateurs Directs</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  24/7
                </span>
              </Link>
            </nav>

            <Link
              href="/publier"
              className="w-full text-center py-3.5 rounded-[4px] bg-[var(--accent)] text-white font-semibold shadow-md"
            >
              Déposer une annonce gratuite
            </Link>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Global Predictive Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
