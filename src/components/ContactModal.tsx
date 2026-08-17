'use client';

import React, { useState } from 'react';
import { Listing } from '@/lib/types';
import { formatCFA } from '@/lib/format';
import { IconCheck, IconPhone, IconX, IconShieldCheck } from './ui/Icons';
import { Button } from './ui/Button';

interface ContactModalProps {
  listing: Listing;
  onClose: () => void;
}

export function ContactModal({ listing, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const fakePhone = '+221 77 645 28 19';

  const handleCopy = () => {
    navigator.clipboard.writeText(fakePhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-[10px] border border-[#DDCDB6] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6A5C] hover:text-[#2A211A] rounded-[4px] hover:bg-[#E8DBC8]"
          aria-label="Fermer"
        >
          <IconX className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider font-bold text-[#7A5133]">
            Coordonnées du vendeur
          </span>
          <h3 className="text-xl font-bold font-heading text-[#573721]">
            {listing.sellerName}
          </h3>
          <p className="text-xs text-[#7A6A5C]">
            {listing.sellerSeniority} • Localisé à {listing.neighborhood}
          </p>
        </div>

        <div className="bg-[#F2E9DC] p-4 rounded-[6px] border border-[#DDCDB6] flex flex-col gap-2">
          <span className="text-xs text-[#7A6A5C] font-semibold uppercase">Article concerné :</span>
          <p className="font-semibold text-sm text-[#2A211A] line-clamp-1">{listing.title}</p>
          <span className="text-lg font-bold font-heading tabular-nums text-[#1C3049]">
            {formatCFA(listing.price)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3.5 bg-[#E8DBC8] rounded-[4px] border border-[#DDCDB6]">
            <div className="flex items-center gap-2">
              <IconPhone className="w-4 h-4 text-[#1C3049]" />
              <span className="font-mono font-bold text-base text-[#1C3049]">{fakePhone}</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs font-bold uppercase tracking-wider text-[#7A5133] hover:underline"
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>

          <a
            href={`tel:${fakePhone}`}
            className="min-h-[48px] px-4 py-2.5 rounded-[4px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-[#13223A]"
          >
            <IconPhone className="w-4 h-4" />
            <span>Appeler le vendeur</span>
          </a>

          <a
            href={`https://wa.me/221776452819?text=${encodeURIComponent(
              `Bonjour, je vous contacte concernant votre annonce sur NovaSen : "${listing.title}" à ${formatCFA(listing.price)}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] px-4 py-2.5 rounded-[4px] bg-[#7A5133] hover:bg-[#573721] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-[#573721]"
          >
            <span>Contacter sur WhatsApp</span>
          </a>
        </div>

        <div className="text-[0.72rem] text-[#7A6A5C] flex items-center gap-2 pt-2 border-t border-[#DDCDB6]">
          <IconShieldCheck className="w-4 h-4 text-[#7A5133] shrink-0" />
          <span>Privilégiez la livraison NovaSen avec paiement à la réception pour une sécurité maximale.</span>
        </div>
      </div>
    </div>
  );
}
