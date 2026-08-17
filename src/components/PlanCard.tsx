import React from 'react';
import { SellerPlan, DriverPlan } from '@/lib/types';
import { formatCFA } from '@/lib/format';
import { IconCheck, IconStar } from './ui/Icons';
import { Button } from './ui/Button';

interface PlanCardProps {
  plan: SellerPlan | DriverPlan;
  isCurrent?: boolean;
  onSelect?: () => void;
  type?: 'seller' | 'driver';
}

export function PlanCard({ plan, isCurrent = false, onSelect, type = 'seller' }: PlanCardProps) {
  const isPopular = 'popular' in plan && plan.popular;

  return (
    <div
      className={`relative bg-white rounded-[10px] border p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all ${
        isPopular
          ? 'border-[#7A5133] shadow-md ring-1 ring-[#7A5133]'
          : 'border-[#DDCDB6] shadow-xs'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7A5133] text-white px-3 py-0.5 rounded-[4px] text-[0.72rem] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <IconStar className="w-3 h-3 text-[#E8DBC8]" />
          <span>Recommandé pour commerçants</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-bold font-heading text-[#573721]">{plan.name}</h4>
          {'description' in plan && (
            <p className="text-xs text-[#7A6A5C] min-h-[32px]">{plan.description}</p>
          )}
        </div>

        {/* Pricing tag */}
        <div className="flex items-baseline gap-1 py-2 border-y border-[#DDCDB6]/60">
          {/* RULE OF COLOR: Dark Blue Tabular Numbers */}
          <span className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
            {plan.price === 0 ? 'Gratuit' : formatCFA(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-xs text-[#7A6A5C] font-semibold">
              {type === 'driver' && plan.id === 'forfait' ? '/ jour travaillé' : '/ mois'}
            </span>
          )}
        </div>

        {/* Features list */}
        <ul className="flex flex-col gap-3 text-sm text-[#2A211A]">
          {plan.features.map((feature, idx) => (
            <li key={`feat-${plan.id}-${idx}`} className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E8DBC8] text-[#7A5133] flex items-center justify-center shrink-0 mt-0.5">
                <IconCheck className="w-3 h-3" />
              </span>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-[#DDCDB6]/60">
        {isCurrent ? (
          <div className="w-full py-2.5 bg-[#E8DBC8] text-[#573721] font-bold text-xs uppercase tracking-wider text-center rounded-[4px] border border-[#DDCDB6]">
            ✓ Votre formule active
          </div>
        ) : (
          <Button
            variant={isPopular ? 'primary' : 'outline'}
            fullWidth
            onClick={onSelect}
          >
            {plan.price === 0 ? 'Choisir cette formule' : `Activer pour ${formatCFA(plan.price)}`}
          </Button>
        )}
      </div>
    </div>
  );
}
