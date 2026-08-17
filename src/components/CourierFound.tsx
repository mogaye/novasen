'use client';

import React from 'react';
import { DriverAssignment } from '@/lib/types';
import { formatCFA } from '@/lib/format';
import { IconCar, IconCheck, IconPhone, IconStar, IconX, IconShieldCheck } from './ui/Icons';
import { Button } from './ui/Button';

interface CourierFoundProps {
  driver: DriverAssignment;
  fare: number;
  type: 'passagers' | 'colis';
  paymentMethod: 'cash' | 'wave' | 'orange_money';
  onClose: () => void;
}

export function CourierFound({
  driver,
  fare,
  type,
  paymentMethod,
  onClose,
}: CourierFoundProps) {
  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case 'cash':
        return 'Espèces (Paiement en main propre)';
      case 'wave':
        return 'Wave Mobile Money';
      case 'orange_money':
        return 'Orange Money Sénégal';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="driver-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-[10px] border border-[#DDCDB6] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6A5C] hover:text-[#2A211A] rounded-[4px] hover:bg-[#E8DBC8] transition-colors"
          aria-label="Fermer la fenêtre"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* Header Status */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1C3049] text-[#C9A882] flex items-center justify-center font-bold">
            <IconCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#7A5133] uppercase tracking-wider">
              <IconShieldCheck className="w-3.5 h-3.5" />
              <span>Chauffeur & Livreur vérifié NovaSen</span>
            </div>
            <h3 id="driver-modal-title" className="text-xl sm:text-2xl font-bold font-heading text-[#573721]">
              {type === 'passagers' ? 'Votre chauffeur est en route !' : 'Votre livreur arrive !'}
            </h3>
          </div>
        </div>

        {/* Driver Profile Card */}
        <div className="bg-[#F2E9DC] p-5 rounded-[8px] border border-[#DDCDB6] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#1C3049] text-white flex items-center justify-center font-heading font-bold text-xl border-2 border-white shadow-sm">
                {driver.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#2A211A] font-heading">{driver.name}</h4>
                <div className="flex items-center gap-2 text-xs text-[#7A6A5C]">
                  <span className="flex items-center text-[#7A5133] font-bold">
                    <IconStar className="w-3.5 h-3.5 mr-0.5 text-[#C9A882]" />
                    {driver.rating}
                  </span>
                  <span>•</span>
                  <span>{driver.tripsCount} courses certifiées</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#7A6A5C]">Arrivée dans</span>
              <p className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
                ~{driver.etaMinutes} min
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#DDCDB6] text-sm">
            <div>
              <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Véhicule</span>
              <span className="font-semibold text-[#2A211A]">{driver.vehicleModel}</span>
            </div>
            <div>
              <span className="text-xs text-[#7A6A5C] uppercase tracking-wider block font-medium">Immatriculation</span>
              <span className="font-mono font-bold text-[#1C3049] bg-white px-2 py-0.5 rounded-[4px] border border-[#DDCDB6] inline-block">
                {driver.licensePlate}
              </span>
            </div>
          </div>
        </div>

        {/* Fare and Payment Summary */}
        <div className="flex items-center justify-between p-4 bg-[#E8DBC8] rounded-[6px] border border-[#DDCDB6]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6A5C]">
              Montant de la course
            </span>
            <span className="text-xs text-[#2A211A]/80">{getPaymentLabel()}</span>
          </div>
          {/* RULE OF COLOR: Dark Blue Tabular Numbers */}
          <span className="text-2xl font-bold font-heading tabular-nums text-[#1C3049]">
            {formatCFA(fare)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${driver.phone}`}
            className="flex-1 min-h-[48px] px-4 py-2.5 rounded-[4px] bg-[#1C3049] hover:bg-[#13223A] text-white text-sm font-semibold flex items-center justify-center gap-2 border border-[#13223A] transition-colors"
          >
            <IconPhone className="w-4 h-4" />
            <span>Appeler ({driver.phone})</span>
          </a>
          <Button variant="outline" onClick={onClose} className="sm:w-auto">
            Fermer le suivi
          </Button>
        </div>
      </div>
    </div>
  );
}
