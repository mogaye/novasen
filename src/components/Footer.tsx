'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoWave, LogoOrangeMoney, LogoCard } from './PaymentLogos';

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/connexion') {
    return null;
  }
  return (
    <footer className="bg-[#13223A] text-[#F2E9DC] border-t border-[#1C3049] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-heading">
                Nova<span className="text-[#C9A882]">Sen</span>
              </span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#1C3049] text-[#E8DBC8] text-[0.7rem] font-semibold uppercase tracking-wider border border-[#C9A882]/30">
                Sénégal
              </span>
            </div>
            <p className="text-sm text-[#E8DBC8]/80 leading-relaxed">
              La première plateforme sénégalaise réunissant les petites annonces et le transport à la demande comme bras logistique direct.
            </p>
            <div className="text-xs text-[#E8DBC8]/60 mt-2">
              Dakar • Thiès • Touba • Saint-Louis • Mbour • Ziguinchor • Partout au Sénégal
            </div>
          </div>

          {/* Marché */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A882]">
              Le Marché
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#E8DBC8]/90">
              <li>
                <Link href="/marche" className="hover:text-white transition-colors">
                  Toutes les annonces
                </Link>
              </li>
              <li>
                <Link href="/marche?category=vehicules" className="hover:text-white transition-colors">
                  Véhicules & Deux-roues
                </Link>
              </li>
              <li>
                <Link href="/marche?category=telephones" className="hover:text-white transition-colors">
                  Téléphones & Tablettes
                </Link>
              </li>
              <li>
                <Link href="/publier" className="hover:text-white transition-colors">
                  Déposer une annonce
                </Link>
              </li>
              <li>
                <Link href="/vendeur" className="hover:text-white transition-colors">
                  Ouvrir une Boutique vérifiée
                </Link>
              </li>
            </ul>
          </div>

          {/* Livraison & Colis */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A882]">
              Livraison & Coursiers
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#E8DBC8]/90">
              <li>
                <Link href="/transport" className="hover:text-white transition-colors">
                  Service Livraison Colis Express
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-white transition-colors">
                  Annuaire des Livreurs Certifiés
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="hover:text-white transition-colors">
                  Paiement à la livraison (COD)
                </Link>
              </li>
              <li>
                <Link href="/livreur" className="hover:text-white transition-colors">
                  Devenir livreur partenaire (0% commission)
                </Link>
              </li>
              <li>
                <Link href="/tarifs#bascule" className="hover:text-white transition-colors">
                  Forfaits Livreurs (1 500 F / 35 000 F / 400 000 F)
                </Link>
              </li>
            </ul>
          </div>

          {/* Tarifs & Légal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C9A882]">
              Transparence & Tarifs
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#E8DBC8]/90">
              <li>
                <Link href="/tarifs" className="hover:text-white transition-colors">
                  Grille tarifaire complète
                </Link>
              </li>
              <li>
                <Link href="/tarifs#bascule" className="hover:text-white transition-colors">
                  Point de bascule Forfait vs Commission
                </Link>
              </li>
              <li>
                <Link href="/compte" className="hover:text-white transition-colors">
                  Espace personnel & Quotas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>🎧 Contact Direct Opérateurs</span>
                </Link>
              </li>
              <li className="pt-2 text-xs text-[#E8DBC8]/80 font-bold uppercase tracking-wider">
                Moyens de paiement sécurisés :
              </li>
              <li className="pt-1 flex items-center flex-wrap gap-2">
                <div className="bg-white px-2 py-1 rounded-md">
                  <LogoWave className="h-4" />
                </div>
                <div className="bg-white px-2 py-1 rounded-md">
                  <LogoOrangeMoney className="h-4" />
                </div>
                <div className="bg-white px-2 py-1 rounded-md">
                  <LogoCard className="h-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1C3049] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DBC8]/60">
          <p>© {new Date().getFullYear()} NovaSen. Plateforme commerciale et logistique nationale du Sénégal.</p>
          <p className="flex items-center gap-2">
            <span>Déployé à travers tout le Sénégal • 14 Régions</span>
            <span>•</span>
            <span>FCFA (XOF)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
