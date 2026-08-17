'use client';

import React, { useState } from 'react';
import {
  SimulatorInputs,
  DEFAULT_PASSENGER_SIMULATOR,
  DEFAULT_PARCEL_MOTO_SIMULATOR,
  DEFAULT_PARCEL_AUTO_SIMULATOR,
  calculateEarnings,
} from '@/lib/earnings';
import { formatCFA, formatNumber } from '@/lib/format';
import { FuelType } from '@/lib/types';
import { RangeSlider } from './ui/Range';
import { IconCar, IconPackage, IconTrendingUp, IconFuel, IconWrench, IconCheck } from './ui/Icons';

interface EarningsSimulatorProps {
  initialVehiclePrice?: number;
  initialFuelType?: FuelType;
  initialConsumption?: number;
  initialMode?: 'passagers' | 'colis';
  compact?: boolean;
}

export function EarningsSimulator({
  initialVehiclePrice,
  initialFuelType,
  initialConsumption,
  initialMode = 'passagers',
  compact = false,
}: EarningsSimulatorProps) {
  const [inputs, setInputs] = useState<SimulatorInputs>(() => {
    const base =
      initialMode === 'passagers'
        ? { ...DEFAULT_PASSENGER_SIMULATOR }
        : { ...DEFAULT_PARCEL_MOTO_SIMULATOR };

    if (initialVehiclePrice !== undefined) base.vehiclePrice = initialVehiclePrice;
    if (initialFuelType !== undefined) base.fuelType = initialFuelType;
    if (initialConsumption !== undefined) base.consumption = initialConsumption;
    return base;
  });

  const result = calculateEarnings(inputs);

  const handleModeChange = (mode: 'passagers' | 'colis') => {
    if (mode === 'passagers') {
      setInputs({
        ...DEFAULT_PASSENGER_SIMULATOR,
        vehiclePrice: initialVehiclePrice || 3000000,
        fuelType: initialFuelType || 'Essence',
        consumption: initialConsumption || 7.5,
      });
    } else {
      setInputs({
        ...DEFAULT_PARCEL_MOTO_SIMULATOR,
        vehiclePrice: initialVehiclePrice || 650000,
        fuelType: initialFuelType || 'Essence',
        consumption: initialConsumption || 2.5,
      });
    }
  };

  return (
    <div
      id="simulateur"
      className="bg-white rounded-[10px] border border-[#DDCDB6] p-6 sm:p-8 shadow-xs flex flex-col gap-8"
    >
      {/* Title & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDCDB6] pb-6">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#7A5133] uppercase tracking-widest mb-1">
            <IconTrendingUp className="w-4 h-4 text-[#1C3049]" />
            <span>Rentabilité & Amortissement</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[#573721]">
            Simulateur de revenus
          </h3>
          <p className="text-sm text-[#7A6A5C]">
            Ajustez vos paramètres : estimation transparente calculée sur le terrain dakarois.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-[#E8DBC8] p-1 rounded-[6px] border border-[#DDCDB6] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleModeChange('passagers')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              inputs.mode === 'passagers'
                ? 'bg-[#1C3049] text-white shadow-sm'
                : 'text-[#573721] hover:text-[#2A211A]'
            }`}
          >
            <IconCar className="w-4 h-4" />
            <span>Passagers</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('colis')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              inputs.mode === 'colis'
                ? 'bg-[#1C3049] text-white shadow-sm'
                : 'text-[#573721] hover:text-[#2A211A]'
            }`}
          >
            <IconPackage className="w-4 h-4" />
            <span>Colis</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Column */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RangeSlider
              label="Missions / jour"
              value={inputs.missionsPerDay}
              min={2}
              max={30}
              step={1}
              unit="courses"
              onChange={(val) => setInputs((prev) => ({ ...prev, missionsPerDay: val }))}
              helper={inputs.mode === 'passagers' ? 'Moyenne VTC : 12-16 / jour' : 'Moyenne livreur : 15-20 / jour'}
            />

            <RangeSlider
              label="Jours travaillés / mois"
              value={inputs.daysWorkedPerMonth}
              min={10}
              max={31}
              step={1}
              unit="jours"
              onChange={(val) => setInputs((prev) => ({ ...prev, daysWorkedPerMonth: val }))}
              helper="Standard : 26 jours (6j / 7)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RangeSlider
              label="Panier moyen / course"
              value={inputs.averageFare}
              min={600}
              max={5000}
              step={50}
              formatDisplay={(val) => formatCFA(val)}
              onChange={(val) => setInputs((prev) => ({ ...prev, averageFare: val }))}
              helper={inputs.mode === 'passagers' ? 'Course moyenne : 1 850 F' : 'Colis moyen : 1 400 F'}
            />

            <RangeSlider
              label="Distance moyenne / course"
              value={inputs.kmPerMission}
              min={2}
              max={25}
              step={0.5}
              unit="km"
              onChange={(val) => setInputs((prev) => ({ ...prev, kmPerMission: val }))}
              helper="Ex: Plateau ⇄ Médina = 2,9 km, Almadies = 16 km"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#DDCDB6]/60">
            <div>
              <label className="text-[0.78rem] uppercase tracking-wider font-semibold text-[#7A6A5C] block mb-1">
                Carburant
              </label>
              <select
                value={inputs.fuelType}
                onChange={(e) => setInputs((prev) => ({ ...prev, fuelType: e.target.value as FuelType }))}
                className="w-full min-h-[46px] px-3 bg-[#E8DBC8]/60 text-sm font-semibold rounded-[4px] border border-[#DDCDB6] focus:outline-none"
              >
                <option value="Essence">Essence (990 F/L)</option>
                <option value="Gasoil">Gasoil (815 F/L)</option>
              </select>
            </div>

            <RangeSlider
              label="Conso (L/100)"
              value={inputs.consumption}
              min={1.5}
              max={15}
              step={0.1}
              unit="L"
              onChange={(val) => setInputs((prev) => ({ ...prev, consumption: val }))}
            />

            <RangeSlider
              label="Prix véhicule"
              value={inputs.vehiclePrice}
              min={300000}
              max={12000000}
              step={50000}
              formatDisplay={(val) => formatCFA(val)}
              onChange={(val) => setInputs((prev) => ({ ...prev, vehiclePrice: val }))}
            />
          </div>

          {/* Pricing Formula Toggle (Commission vs Forfait) */}
          <div className="bg-[#F2E9DC] p-4 rounded-[6px] border border-[#DDCDB6] flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#573721]">
              Formule plateforme appliquée :
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputs((prev) => ({ ...prev, pricingPlan: 'recommend' }))}
                className={`py-2 px-2 rounded-[4px] border transition-colors ${
                  inputs.pricingPlan === 'recommend'
                    ? 'bg-[#1C3049] text-white border-[#1C3049]'
                    : 'bg-white text-[#2A211A] border-[#DDCDB6]'
                }`}
              >
                ⭐ Recommandée
              </button>
              <button
                type="button"
                onClick={() => setInputs((prev) => ({ ...prev, pricingPlan: 'commission' }))}
                className={`py-2 px-2 rounded-[4px] border transition-colors ${
                  inputs.pricingPlan === 'commission'
                    ? 'bg-[#1C3049] text-white border-[#1C3049]'
                    : 'bg-white text-[#2A211A] border-[#DDCDB6]'
                }`}
              >
                Commission (18%)
              </button>
              <button
                type="button"
                onClick={() => setInputs((prev) => ({ ...prev, pricingPlan: 'forfait' }))}
                className={`py-2 px-2 rounded-[4px] border transition-colors ${
                  inputs.pricingPlan === 'forfait'
                    ? 'bg-[#1C3049] text-white border-[#1C3049]'
                    : 'bg-white text-[#2A211A] border-[#DDCDB6]'
                }`}
              >
                Forfait (2 500 F/j)
              </button>
            </div>
          </div>
        </div>

        {/* Results & Payback Column */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#F2E9DC] p-6 rounded-[8px] border border-[#DDCDB6] gap-6">
          {/* Main Net Benefice Banner */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A6A5C]">
              Bénéfice net estimé / mois
            </span>
            {/* RULE OF COLOR: Dark Blue Tabular Numbers */}
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tabular-nums text-[#1C3049]">
              {formatCFA(result.netIncome)}
            </div>
            <p className="text-xs text-[#7A6A5C] mt-1">
              Après déduction carburant, entretien, assurance et plateforme.
            </p>
          </div>

          {/* Payback period */}
          {result.paybackMonths !== null && (
            <div className="bg-white p-4 rounded-[6px] border border-[#DDCDB6] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#1C3049]" />
                <span className="text-sm font-semibold text-[#2A211A]">Amortissement véhicule :</span>
              </div>
              <span className="text-xl font-bold font-heading tabular-nums text-[#1C3049]">
                ~{result.paybackMonths} mois
              </span>
            </div>
          )}

          {/* Breakdown Stacked Bar */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6A5C]">
              Répartition de la recette ({formatCFA(result.grossRevenue)})
            </span>
            <div className="w-full h-4 rounded-[4px] bg-[#DDCDB6] overflow-hidden flex sim-bar-transition border border-[#DDCDB6]">
              <div
                style={{ width: `${result.breakdown.netPercent}%` }}
                className="bg-[#1C3049] h-full"
                title={`Bénéfice Net : ${Math.round(result.breakdown.netPercent)}%`}
              />
              <div
                style={{ width: `${result.breakdown.platformPercent}%` }}
                className="bg-[#7A5133] h-full"
                title={`Plateforme : ${Math.round(result.breakdown.platformPercent)}%`}
              />
              <div
                style={{ width: `${result.breakdown.fuelPercent}%` }}
                className="bg-[#C9A882] h-full"
                title={`Carburant : ${Math.round(result.breakdown.fuelPercent)}%`}
              />
              <div
                style={{ width: `${result.breakdown.chargesPercent}%` }}
                className="bg-[#9B4A32] h-full"
                title={`Entretien & Assurance : ${Math.round(result.breakdown.chargesPercent)}%`}
              />
            </div>

            {/* Breakdown Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#2A211A] pt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#7A6A5C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#1C3049]" />
                  <span>Net :</span>
                </span>
                <span className="font-bold tabular-nums text-[#1C3049]">{formatCFA(result.netIncome)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#7A6A5C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#7A5133]" />
                  <span>Plateforme :</span>
                </span>
                <span className="font-bold tabular-nums text-[#1C3049]">{formatCFA(result.platformFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#7A6A5C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#C9A882]" />
                  <span>Carburant :</span>
                </span>
                <span className="font-bold tabular-nums text-[#1C3049]">{formatCFA(result.fuelCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#7A6A5C]">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#9B4A32]" />
                  <span>Entretien :</span>
                </span>
                <span className="font-bold tabular-nums text-[#1C3049]">{formatCFA(result.maintenanceCharges)}</span>
              </div>
            </div>
          </div>

          {/* POINT DE BASCULE RECOMMENDATION BANNER */}
          <div className="p-4 bg-white rounded-[6px] border border-[#C9A882]/70 text-xs text-[#2A211A] flex items-start gap-2.5 shadow-xs">
            <IconCheck className="w-4 h-4 text-[#7A5133] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-[#573721] block mb-0.5">Conseil d’optimisation NovaSen :</span>
              {result.recommendationText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
