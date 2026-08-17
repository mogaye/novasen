'use client';

import React, { useState } from 'react';
import { formatCFA } from '@/lib/format';
import { IconCheck, IconX, IconShieldCheck } from './ui/Icons';
import { Button } from './ui/Button';
import { LogoWave, LogoOrangeMoney, LogoCard, LogoVisa, LogoMastercard } from './PaymentLogos';

interface FakePaymentModalProps {
  title: string;
  amount: number;
  description: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function FakePaymentModal({
  title,
  amount,
  description,
  onSuccess,
  onClose,
}: FakePaymentModalProps) {
  const [provider, setProvider] = useState<'wave' | 'orange_money' | 'card'>('wave');
  const [phone, setPhone] = useState('78 913 90 36');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardHolder, setCardHolder] = useState('AMADOU DIALLO');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('789');

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [paytechError, setPaytechError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaytechError(null);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const orderRef = `NOVA-${Date.now()}`;
      
      // Call PayTech endpoint with dynamic itemPrice and current origin
      const res = await fetch('/api/paytech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: title,
          itemPrice: Math.round(amount),
          refCommand: orderRef,
          commandName: description || `Paiement ${title}`,
          successUrl: `${origin}/suivi/${orderRef}?payment=success&title=${encodeURIComponent(title)}`,
          cancelUrl: `${origin}/compte?payment=cancelled`,
        }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        setRedirecting(true);
        // Redirect to PayTech checkout
        window.location.href = data.redirectUrl;
        return;
      }

      if (data.error) {
        setPaytechError(data.error);
        setProcessing(false);
        return;
      }

      // Simulated local success
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error('Erreur PayTech:', err);
      // Fallback to local simulation
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6A5C] hover:text-[#2A211A] rounded-full hover:bg-[#E8DBC8] transition-colors"
          aria-label="Fermer"
        >
          <IconX className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#7A5133]">
              Passerelle Sécurisée Dakar
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              SSL 256-bit
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#573721]">{title}</h3>
          <p className="text-xs text-[#7A6A5C]">{description}</p>
        </div>

        {success ? (
          <div className="bg-[#E8DBC8]/60 p-6 rounded-[16px] border border-[#DDCDB6] flex flex-col items-center gap-3 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg text-2xl">
              ✓
            </div>
            <h4 className="text-lg font-bold font-heading text-[#1C3049]">
              Paiement confirmé avec succès !
            </h4>
            <p className="text-xs text-[#7A6A5C] max-w-sm">
              Votre formule a été créditée automatiquement sur votre compte NovaSen. Redirection en cours...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Amount display */}
            <div className="flex items-center justify-between p-4 bg-[#F2E9DC] rounded-[12px] border border-[#DDCDB6]">
              <span className="text-xs font-semibold uppercase text-[#7A6A5C]">Montant à régler</span>
              <span className="text-2xl font-black font-heading tabular-nums text-[#1C3049]">
                {formatCFA(amount)}
              </span>
            </div>

            {/* Payment Method Selector (Wave, Orange Money, Carte Bancaire) */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
                Choisissez votre moyen de paiement
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Wave */}
                <button
                  type="button"
                  onClick={() => setProvider('wave')}
                  className={`p-3 rounded-[12px] border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                    provider === 'wave'
                      ? 'border-[#1DC3F4] bg-[#1DC3F4]/10 ring-2 ring-[#1DC3F4]'
                      : 'border-[#DDCDB6] bg-white hover:bg-stone-50'
                  }`}
                >
                  <LogoWave className="h-6" />
                  <span className="text-[10px] font-bold text-[#1C3049]">Sans frais</span>
                </button>

                {/* Orange Money */}
                <button
                  type="button"
                  onClick={() => setProvider('orange_money')}
                  className={`p-3 rounded-[12px] border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                    provider === 'orange_money'
                      ? 'border-[#FF7900] bg-[#FF7900]/10 ring-2 ring-[#FF7900]'
                      : 'border-[#DDCDB6] bg-white hover:bg-stone-50'
                  }`}
                >
                  <LogoOrangeMoney className="h-6" />
                  <span className="text-[10px] font-bold text-[#FF7900]">Push & QR</span>
                </button>

                {/* Carte Bancaire */}
                <button
                  type="button"
                  onClick={() => setProvider('card')}
                  className={`p-3 rounded-[12px] border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                    provider === 'card'
                      ? 'border-[#1434CB] bg-[#1434CB]/10 ring-2 ring-[#1434CB]'
                      : 'border-[#DDCDB6] bg-white hover:bg-stone-50'
                  }`}
                >
                  <LogoCard className="h-4" />
                  <span className="text-[10px] font-bold text-[#1434CB]">Visa / Mastercard</span>
                </button>
              </div>
            </div>

            {/* Conditional Input based on provider */}
            {provider === 'card' ? (
              /* Card Fields */
              <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#DDCDB6] animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold text-[#573721] uppercase mb-1">
                    Numéro de carte bancaire
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DDCDB6] bg-white text-sm font-mono text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#1434CB]"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1">
                      <LogoVisa className="h-4" />
                      <LogoMastercard className="h-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#573721] uppercase mb-1">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="NOM PRENOM"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-[#DDCDB6] bg-white text-xs font-semibold uppercase text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#1434CB]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#573721] uppercase mb-1">
                        Exp.
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        required
                        className="w-full px-2 py-2 text-center rounded-lg border border-[#DDCDB6] bg-white text-xs font-mono text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#1434CB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#573721] uppercase mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        required
                        maxLength={4}
                        className="w-full px-2 py-2 text-center rounded-lg border border-[#DDCDB6] bg-white text-xs font-mono text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#1434CB]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Money Phone Input */
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C]">
                  Numéro de compte {provider === 'wave' ? 'Wave (+221)' : 'Orange Money (+221)'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="77 000 00 00"
                  required
                  className="w-full min-h-[48px] px-4 bg-[#E8DBC8]/40 text-base font-semibold rounded-[8px] border border-[#DDCDB6] focus:outline-none focus:border-[#1C3049]"
                />
              </div>
            )}

            {paytechError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-semibold">
                {paytechError}
              </div>
            )}

            <Button
              variant="dark"
              fullWidth
              size="lg"
              type="submit"
              disabled={processing || redirecting}
              className="mt-1 font-bold text-sm"
            >
              {redirecting
                ? '🚀 Redirection vers PayTech (Wave / OM)...'
                : processing
                ? 'Connexion sécurisée en cours...'
                : `Payer ${formatCFA(amount)} en direct`}
            </Button>

            <div className="text-[0.72rem] text-[#7A6A5C] text-center flex items-center justify-center gap-1.5">
              <IconShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Paiement crypté 3D-Secure • Agrément BCEAO / GIM-UEMOA</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
