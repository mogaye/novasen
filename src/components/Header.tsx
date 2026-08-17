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
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close dropdown on route change
  useEffect(() => {
    setNavDropdownOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#nav-dropdown-container')) {
        setNavDropdownOpen(false);
      }
    };
    if (navDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [navDropdownOpen]);

  const NAV_ITEMS = [
    {
      href: '/accueil',
      label: 'Accueil',
      badge: 'Portail',
      icon: '🏠',
      desc: 'Page d’accueil et vue d’ensemble',
      isActive: pathname === '/accueil',
    },
    {
      href: '/marche',
      label: 'Le Marché',
      badge: 'Boutiques & Ventes',
      icon: '🛍️',
      desc: 'Petites annonces et commerçants de Dakar',
      isActive: pathname.startsWith('/marche') || pathname.startsWith('/annonce'),
      onClick: () => setActiveService('market'),
    },
    {
      href: '/transport',
      label: 'Passagers & Colis',
      badge: 'VTC & Livraisons',
      icon: '🚗',
      desc: 'Courses rapides et logistique express',
      isActive: pathname.startsWith('/transport'),
      onClick: () => setActiveService('transport'),
    },
    {
      href: '/boutique',
      label: 'Ma Boutique',
      badge: 'Espace Vendeur',
      icon: '🏬',
      desc: 'Gestion des annonces, quotas et vitrine',
      isActive: pathname === '/boutique',
    },
    {
      href: '/tarifs',
      label: 'Grille Tarifaire',
      badge: '0% Commission',
      icon: '💳',
      desc: 'Abonnements et forfaits chauffeurs',
      isActive: pathname === '/tarifs',
    },
    {
      href: '/',
      label: 'Présentation',
      badge: 'À propos',
      icon: '📄',
      desc: 'Découvrir la plateforme NovaSen',
      isActive: pathname === '/',
    },
  ];

  const currentNav = NAV_ITEMS.find((item) => item.isActive) || NAV_ITEMS[0];

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
            href="/accueil"
            className="flex flex-col group cursor-pointer focus:outline-none shrink-0"
            onClick={() => setActiveService('market')}
            title="Page d'accueil NovaSen"
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

        {/* Desktop Navigation Dropdown */}
        <div id="nav-dropdown-container" className="hidden lg:block relative shrink-0">
          <button
            type="button"
            onClick={() => setNavDropdownOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs sm:text-sm border transition-all duration-200 cursor-pointer shadow-xs ${
              navDropdownOpen
                ? 'bg-[#573721] text-white border-[#573721] shadow-md ring-2 ring-[#7A5133]/20'
                : 'bg-white/80 hover:bg-white text-[#573721] border-[#DDCDB6]'
            }`}
            aria-expanded={navDropdownOpen}
            aria-haspopup="true"
          >
            <span className="text-base">{currentNav.icon}</span>
            <span>{currentNav.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              navDropdownOpen ? 'bg-white/20 text-white' : 'text-[#7A6A5C] bg-[#E8DBC8]/60'
            }`}>
              Menu
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                navDropdownOpen ? 'rotate-180 text-white' : 'text-[#7A5133]'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu Panel */}
          {navDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-[18px] border border-[#DDCDB6] shadow-2xl p-2.5 z-50 flex flex-col gap-1 animate-scale-up backdrop-blur-md">
              <div className="px-3 py-2 border-b border-[#DDCDB6]/60 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6A5C]">
                  Navigation NovaSen
                </span>
              </div>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setNavDropdownOpen(false);
                  }}
                  className={`flex items-start gap-3 p-2.5 rounded-[12px] transition-all ${
                    item.isActive
                      ? 'bg-[#E8DBC8]/70 text-[#573721] font-bold border border-[#DDCDB6]'
                      : 'hover:bg-[#FAF8F5] text-[#2A211A]'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5 p-1 bg-white rounded-lg border border-[#DDCDB6]/50 shadow-2xs">
                    {item.icon}
                  </span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold leading-tight truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF8F5] text-[#7A5133] border border-[#DDCDB6] font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A6A5C] font-normal leading-tight mt-0.5 line-clamp-1">
                      {item.desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 lg:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 min-h-[42px] px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F2E9DC] text-[#573721] text-xs font-bold border border-[#DDCDB6] transition-all shadow-xs cursor-pointer"
            title="Recherche globale (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="hidden xl:inline text-stone-500 font-normal">Rechercher...</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] bg-stone-100 border border-stone-300 rounded text-stone-600 font-mono">
              ⌘K
            </kbd>
          </button>

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

        {/* Mobile / Tablet Header Controls (visible below lg) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {/* Quick Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 rounded-full bg-white/90 text-[#573721] border border-[#DDCDB6] shadow-xs flex items-center justify-center text-sm cursor-pointer hover:bg-white transition-all"
            title="Rechercher"
            aria-label="Rechercher"
          >
            🔍
          </button>

          {/* User Account / Login */}
          {user ? (
            <Link
              href="/compte"
              className="w-9 h-9 rounded-full bg-[#E8DBC8] text-[#573721] border border-[#DDCDB6] shadow-xs flex items-center justify-center text-sm"
              title="Mon Espace"
            >
              <IconUser className="w-4 h-4 text-[#573721]" />
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="px-3 py-1.5 rounded-full bg-[#7A5133] hover:bg-[#573721] text-white font-bold text-xs shadow-xs transition-all"
              title="Connexion"
            >
              Connexion
            </Link>
          )}

          {/* Clean Menu Déroulant Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 ${
              mobileMenuOpen
                ? 'bg-[#573721] text-white border-[#573721]'
                : 'bg-white hover:bg-[#E8DBC8] text-[#573721] border-[#DDCDB6]'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label="Menu déroulant"
          >
            {mobileMenuOpen ? (
              <>
                <IconX className="w-4 h-4 text-white" />
                <span>Fermer</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#573721]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modern Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-20 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start overflow-y-auto animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#F2E9DC] border-b border-[#DDCDB6] p-5 flex flex-col gap-4 shadow-2xl rounded-b-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dual Service Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-[#E8DBC8] p-1 rounded-xl border border-[#DDCDB6]">
              <Link
                href="/marche"
                onClick={() => {
                  setActiveService('market');
                  setMobileMenuOpen(false);
                }}
                className={`py-2.5 text-center text-xs font-bold rounded-lg block transition-all ${
                  isMarket
                    ? 'bg-[#7A5133] text-white shadow-xs'
                    : 'text-[#573721] hover:bg-[#DDCDB6]'
                }`}
              >
                🛍️ Le Marché Dakar
              </Link>
              <Link
                href="/transport"
                onClick={() => {
                  setActiveService('transport');
                  setMobileMenuOpen(false);
                }}
                className={`py-2.5 text-center text-xs font-bold rounded-lg block transition-all ${
                  !isMarket
                    ? 'bg-[#1C3049] text-white shadow-xs'
                    : 'text-[#1C3049] hover:bg-[#DDCDB6]'
                }`}
              >
                🚗 Transport & Colis
              </Link>
            </div>

            {/* Prominent Tarifs & Abonnements Pro Card */}
            <Link
              href="/tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-gradient-to-r from-[#7A5133] to-[#573721] text-white p-4 rounded-2xl shadow-md border border-[#A3744B] flex items-center justify-between group hover:scale-[1.01] transition-transform"
            >
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black uppercase tracking-wider">
                    ★ Formules & Abonnements
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">
                  Grille Tarifaire & Abonnements Pro
                </h4>
                <p className="text-[11px] text-[#E8DBC8] leading-tight">
                  Boutique Vendeur (6 500 F) • Chauffeur (1 500 F) • Wave & OM
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Link>

            {/* Full Navigation List */}
            <nav className="flex flex-col gap-1 divide-y divide-[#DDCDB6]/60">
              <Link
                href="/accueil"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-sm sm:text-base font-bold flex items-center justify-between ${
                  pathname === '/accueil' ? 'text-[#7A5133]' : 'text-[#2A211A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏠</span>
                  <span>Accueil NovaSen</span>
                </div>
                <span className="text-[11px] bg-[#E8DBC8] text-[#573721] px-2 py-0.5 rounded-full font-bold">
                  2 Univers
                </span>
              </Link>

              <Link
                href="/marche"
                onClick={() => {
                  setActiveService('market');
                  setMobileMenuOpen(false);
                }}
                className={`py-3 text-sm sm:text-base font-semibold flex items-center justify-between ${
                  pathname.startsWith('/marche') ? 'text-[#7A5133] font-bold' : 'text-[#2A211A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🛍️</span>
                  <span>Le Marché (Petites Annonces)</span>
                </div>
                <span className="text-xs text-[#7A6A5C]">40 offres</span>
              </Link>

              <Link
                href="/transport"
                onClick={() => {
                  setActiveService('transport');
                  setMobileMenuOpen(false);
                }}
                className={`py-3 text-sm sm:text-base font-semibold flex items-center justify-between ${
                  pathname.startsWith('/transport') ? 'text-[#1C3049] font-bold' : 'text-[#1C3049]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🚗</span>
                  <span>Transport Passagers & Colis</span>
                </div>
                <span className="text-[11px] bg-[#1C3049]/10 text-[#1C3049] px-2 py-0.5 rounded-full font-bold">
                  Dakar & Régions
                </span>
              </Link>

              <Link
                href="/tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-sm sm:text-base font-semibold flex items-center justify-between ${
                  pathname === '/tarifs' ? 'text-[#7A5133] font-bold' : 'text-[#2A211A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">💳</span>
                  <span>Grille Tarifaire (Abonnements)</span>
                </div>
                <span className="text-xs text-[#7A5133] font-bold">Voir prix</span>
              </Link>

              <Link
                href="/boutique"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-sm sm:text-base font-semibold flex items-center justify-between ${
                  pathname === '/boutique' ? 'text-[#7A5133] font-bold' : 'text-[#573721]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏬</span>
                  <span>Ma Boutique (Gestion Annonces)</span>
                </div>
                <span className="text-[11px] bg-[#E8DBC8] text-[#573721] px-2 py-0.5 rounded font-bold">
                  Mes Annonces
                </span>
              </Link>

              <Link
                href="/vendeur"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm sm:text-base font-medium text-[#7A5133] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🏪</span>
                  <span>Ouvrir une Boutique Vendeur Pro</span>
                </div>
                <span className="text-[11px] text-[#7A5133]">Formule Pro</span>
              </Link>

              <Link
                href="/livreur"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm sm:text-base font-medium text-[#1C3049] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🛵</span>
                  <span>Devenir Livreur / Chauffeur</span>
                </div>
                <span className="text-[11px] bg-[#1C3049]/10 text-[#1C3049] px-2 py-0.5 rounded font-bold">
                  1 500 F/j • 25 000 F/m
                </span>
              </Link>

              <Link
                href="/compte"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm sm:text-base font-medium text-[#2A211A] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">👤</span>
                  <span>Mon Espace Personnel</span>
                </div>
                <span className="text-xs bg-[#E8DBC8] px-2 py-0.5 rounded text-[#573721] font-semibold">
                  {userPlan.toUpperCase()}
                </span>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm sm:text-base font-bold text-emerald-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🎧</span>
                  <span>Assistance Opérateurs & WhatsApp</span>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  24/7
                </span>
              </Link>
            </nav>

            {/* Primary Action Button */}
            <Link
              href="/publier"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#7A5133] to-[#573721] text-white font-bold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <IconPlus className="w-4 h-4 text-white" />
              <span>Déposer une annonce gratuite</span>
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
