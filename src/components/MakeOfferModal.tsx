'use client';

import React, { useState } from 'react';
import { IconX, IconCheck, IconArrowRight, IconShieldCheck } from './ui/Icons';
import { formatCFA } from '@/lib/format';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  initialPrice: number;
  sellerName: string;
}

export function MakeOfferModal({
  isOpen,
  onClose,
  listingTitle,
  initialPrice,
  sellerName,
}: MakeOfferModalProps) {
  const [offerPrice, setOfferPrice] = useState<number>(Math.round(initialPrice * 0.9 / 500) * 500);
  const [submitted, setSubmitted] = useState(false);
  const [sellerResponse, setSellerResponse] = useState<'pending' | 'accepted' | 'counter'>('pending');

  const discountPercent = Math.round(((initialPrice - offerPrice) / initialPrice) * 100);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSellerResponse('pending');

    setTimeout(() => {
      if (discountPercent <= 15) {
        setSellerResponse('accepted');
      } else {
        setSellerResponse('counter');
      }
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-[16px] border border-[#DDCDB6] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#7A5133] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <h3 className="font-bold text-sm text-white">Négocier & Faire une offre</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!submitted ? (
          <form onSubmit={handleSubmitOffer} className="p-6 flex flex-col gap-5 text-xs">
            <div className="bg-[#FAF6F0] p-3.5 rounded-[8px] border border-[#DDCDB6] flex flex-col gap-1">
              <span className="text-[#7A6A5C] text-[0.72rem]">Article ciblé :</span>
              <strong className="text-[#573721] text-sm truncate">{listingTitle}</strong>
              <div className="flex items-center justify-between pt-2 border-t border-[#DDCDB6]/60 mt-1">
                <span className="text-[#7A6A5C]">Prix affiché :</span>
                <span className="font-bold text-sm tabular-nums text-[#1C3049]">
                  {formatCFA(initialPrice)}
                </span>
              </div>
            </div>

            {/* Quick discount chips */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#573721]">Offres suggérées :</span>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((pct) => {
                  const suggested = Math.round((initialPrice * (1 - pct / 100)) / 500) * 500;
                  return (
                    <button
                      key={`pct-${pct}`}
                      type="button"
                      onClick={() => setOfferPrice(suggested)}
                      className={`p-2.5 rounded-[8px] border text-center transition-all cursor-pointer ${
                        offerPrice === suggested
                          ? 'bg-[#7A5133] text-white font-bold border-[#7A5133] shadow-xs'
                          : 'bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#573721] border-[#DDCDB6]'
                      }`}
                    >
                      <span className="block text-[0.7rem] opacity-80">−{pct} %</span>
                      <strong className="tabular-nums text-xs">{formatCFA(suggested)}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom offer input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#573721]">Votre proposition de prix (FCFA) :</label>
              <input
                type="number"
                required
                min="1000"
                max={initialPrice}
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                className="w-full min-h-[48px] px-4 bg-[#FAF6F0] border-2 border-[#DDCDB6] focus:border-[#7A5133] rounded-[8px] font-bold text-lg tabular-nums text-[#1C3049] focus:outline-none"
              />
              <span className="text-[0.7rem] text-[#7A6A5C]">
                Rabais demandé : {discountPercent > 0 ? `${discountPercent} %` : '0 %'} (
                {formatCFA(initialPrice - offerPrice)} d'économie)
              </span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[8px] text-emerald-800 text-[0.72rem] leading-relaxed">
              💡 <strong>Conseil Teranga :</strong> Les offres avec moins de 15% de rabais sont acceptées dans 85% des cas par les marchands dakarois.
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-[8px] bg-[#7A5133] hover:bg-[#573721] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Envoyer mon offre à {sellerName}</span>
              <IconArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-6 flex flex-col items-center gap-4 text-center">
            {sellerResponse === 'pending' && (
              <>
                <div className="w-14 h-14 rounded-full bg-[#E8DBC8] flex items-center justify-center text-2xl animate-pulse">
                  ⏳
                </div>
                <h4 className="font-bold text-base text-[#573721]">Offre en cours d'examen...</h4>
                <p className="text-xs text-[#7A6A5C]">
                  {sellerName} consulte votre offre de <strong>{formatCFA(offerPrice)}</strong>.
                </p>
              </>
            )}

            {sellerResponse === 'accepted' && (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-bold text-base text-emerald-800">🎉 Offre acceptée par le vendeur !</h4>
                <p className="text-xs text-[#7A6A5C]">
                  Félicitations ! Vous pouvez dès à présent commander l'article au prix négocié de{' '}
                  <strong className="text-[#1C3049] text-sm">{formatCFA(offerPrice)}</strong>.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full mt-2 min-h-[44px] rounded-[8px] bg-[#1C3049] text-white font-bold text-xs"
                >
                  Finaliser avec livraison NovaSen
                </button>
              </>
            )}

            {sellerResponse === 'counter' && (
              <>
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold">
                  💬
                </div>
                <h4 className="font-bold text-base text-amber-900">Contre-proposition du vendeur</h4>
                <p className="text-xs text-[#7A6A5C]">
                  {sellerName} vous propose de couper la poire en deux à{' '}
                  <strong className="text-[#1C3049] text-sm">
                    {formatCFA(Math.round((initialPrice + offerPrice) / 2 / 500) * 500)}
                  </strong>
                  .
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full mt-2 min-h-[44px] rounded-[8px] bg-[#7A5133] text-white font-bold text-xs"
                >
                  Accepter la contre-proposition
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
