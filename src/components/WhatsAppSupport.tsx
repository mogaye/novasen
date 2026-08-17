'use client';

import React, { useState } from 'react';
import { IconX, IconArrowRight, IconShieldCheck } from './ui/Icons';

export function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const QUICK_QUESTIONS = [
    'Comment fonctionne la livraison NovaSen ?',
    'Je souhaite vendre un article à Dakar',
    'Comment devenir chauffeur / livreur ?',
    'Faire une réclamation sur une commande',
  ];

  const handleSend = (text: string) => {
    const message = encodeURIComponent(text || userMsg || 'Bonjour NovaSen, j’aimerais avoir une information.');
    window.open(`https://wa.me/221705908725?text=${message}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Interactive Popup Modal */}
      {isOpen && (
        <div className="mb-3 w-[320px] sm:w-[360px] bg-white rounded-[16px] border border-[#DDCDB6] shadow-2xl overflow-hidden flex flex-col animate-scale-up">
          {/* Header */}
          <div className="bg-[#1C3049] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-xl font-bold text-white shadow-xs">
                  💬
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1C3049]" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight text-white">Support Teranga Dakar</h4>
                <p className="text-[0.7rem] text-emerald-400 font-medium">En ligne • Réponse en 2 min</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF6F0] flex flex-col gap-3 text-xs max-h-[320px] overflow-y-auto">
            <div className="bg-white p-3 rounded-[10px] rounded-tl-none border border-[#DDCDB6] shadow-xs text-[#2A211A] leading-relaxed">
              <p className="font-semibold text-[#573721]">Dalal ak jàmm ! 👋</p>
              <p className="mt-1">
                Bienvenue sur <strong>NovaSen</strong>. Une question sur un achat, une vente ou une course express à Dakar ? Notre équipe locale est là pour vous aider 7j/7 !
              </p>
            </div>

            <span className="text-[0.68rem] uppercase tracking-wider font-bold text-[#7A6A5C] mt-1">
              Questions fréquentes :
            </span>

            <div className="flex flex-col gap-1.5">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={`quick-q-${idx}`}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="p-2.5 rounded-[8px] bg-white hover:bg-[#E8DBC8] border border-[#DDCDB6] text-left text-xs font-semibold text-[#573721] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{q}</span>
                  <IconArrowRight className="w-3.5 h-3.5 shrink-0 text-[#7A5133]" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer / Custom input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(userMsg);
            }}
            className="p-3 bg-white border-t border-[#DDCDB6] flex items-center gap-2"
          >
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-[#FAF6F0] border border-[#DDCDB6] rounded-[8px] px-3 py-2 text-xs focus:outline-none focus:border-[#7A5133]"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-[8px] text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-[999px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-500"
        aria-label="Contacter le Support WhatsApp"
      >
        <span className="text-xl">💬</span>
        <span className="font-bold text-xs tracking-wide hidden sm:inline">
          Support Teranga WhatsApp
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
      </button>
    </div>
  );
}
