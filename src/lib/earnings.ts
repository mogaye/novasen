import { FuelType } from './types';

export interface SimulatorInputs {
  mode: 'passagers' | 'colis';
  pricingPlan: 'recommend' | 'commission' | 'forfait';
  missionsPerDay: number;
  daysWorkedPerMonth: number;
  averageFare: number;
  kmPerMission: number;
  vehiclePrice: number;
  consumption: number; // L/100km
  fuelType: FuelType;
  monthlyFixedMaintenance: number;
}

export interface SimulatorResult {
  grossRevenue: number;
  kmMonthly: number;
  fuelCost: number;
  maintenanceCharges: number;
  platformFee: number;
  netIncome: number;
  paybackMonths: number | null;
  chosenPlan: 'commission' | 'forfait';
  recommendedPlan: 'commission' | 'forfait';
  switchThresholdDailyRevenue: number;
  switchThresholdMissions: number;
  planGainMonthly: number; // Gain by using recommended plan vs other
  recommendationText: string;
  breakdown: {
    netPercent: number;
    platformPercent: number;
    fuelPercent: number;
    chargesPercent: number;
  };
}

export const FUEL_PRICES: Record<FuelType, number> = {
  Essence: 990,
  Gasoil: 815,
  Diesel: 815,
  Électrique: 150,
  Hybride: 750,
};

export const DEFAULT_PASSENGER_SIMULATOR: SimulatorInputs = {
  mode: 'passagers',
  pricingPlan: 'recommend',
  missionsPerDay: 14,
  daysWorkedPerMonth: 26,
  averageFare: 1850,
  kmPerMission: 8,
  vehiclePrice: 3000000,
  consumption: 7.5,
  fuelType: 'Essence',
  monthlyFixedMaintenance: 45000,
};

export const DEFAULT_PARCEL_MOTO_SIMULATOR: SimulatorInputs = {
  mode: 'colis',
  pricingPlan: 'recommend',
  missionsPerDay: 18,
  daysWorkedPerMonth: 26,
  averageFare: 1400,
  kmPerMission: 6,
  vehiclePrice: 650000,
  consumption: 2.5,
  fuelType: 'Essence',
  monthlyFixedMaintenance: 20000,
};

export const DEFAULT_PARCEL_AUTO_SIMULATOR: SimulatorInputs = {
  mode: 'colis',
  pricingPlan: 'recommend',
  missionsPerDay: 18,
  daysWorkedPerMonth: 26,
  averageFare: 1400,
  kmPerMission: 6,
  vehiclePrice: 2800000,
  consumption: 7.5,
  fuelType: 'Essence',
  monthlyFixedMaintenance: 45000,
};

export function calculateEarnings(inputs: SimulatorInputs): SimulatorResult {
  const {
    missionsPerDay,
    daysWorkedPerMonth,
    averageFare,
    kmPerMission,
    vehiclePrice,
    consumption,
    fuelType,
    monthlyFixedMaintenance,
    pricingPlan,
  } = inputs;

  const grossRevenue = missionsPerDay * averageFare * daysWorkedPerMonth;
  const kmMonthly = missionsPerDay * kmPerMission * daysWorkedPerMonth;
  const fuelPricePerLiter = FUEL_PRICES[fuelType] || 990;
  const fuelCost = (kmMonthly / 100) * consumption * fuelPricePerLiter;
  const maintenanceCharges = monthlyFixedMaintenance + 0.03 * grossRevenue;

  // Platform deduction options
  const passJourneeFee = 1500 * daysWorkedPerMonth;
  const abonnementMensuelFee = 25000;

  // Threshold: 25 000 / 1 500 = 16.67 days
  const recommendedPlan: 'commission' | 'forfait' = (1500 * daysWorkedPerMonth) >= 25000 ? 'forfait' : 'commission';

  let chosenPlan: 'commission' | 'forfait';
  if (pricingPlan === 'recommend') {
    chosenPlan = recommendedPlan;
  } else {
    chosenPlan = pricingPlan;
  }

  const platformFee = chosenPlan === 'commission' ? passJourneeFee : abonnementMensuelFee;
  const netIncome = Math.round(grossRevenue - platformFee - fuelCost - maintenanceCharges);

  const paybackMonths = netIncome > 0 && vehiclePrice > 0 ? +(vehiclePrice / netIncome).toFixed(1) : null;

  // Difference calculation
  const switchThresholdDailyRevenue = 25000 / 30;
  const switchThresholdMissions = Math.ceil(25000 / 1500);
  const planGainMonthly = Math.abs(Math.round(passJourneeFee - abonnementMensuelFee));

  let recommendationText = '';
  if (daysWorkedPerMonth >= 17) {
    recommendationText = `En travaillant ${daysWorkedPerMonth} jours/mois, l'Abonnement Mensuel (25 000 F) vous fait économiser ${new Intl.NumberFormat('fr-FR').format(planGainMonthly)} CFA par rapport au Pass Journée (1 500 F/jour) avec 0% de commission.`;
  } else {
    recommendationText = `Pour ${daysWorkedPerMonth} jours d'activité par mois, le Pass Journée (1 500 F/jour) reste le plus économique (${new Intl.NumberFormat('fr-FR').format(passJourneeFee)} CFA/mois) avec 0% de commission.`;
  }

  const netPercent = grossRevenue > 0 ? Math.max(0, (netIncome / grossRevenue) * 100) : 0;
  const platformPercent = grossRevenue > 0 ? (platformFee / grossRevenue) * 100 : 0;
  const fuelPercent = grossRevenue > 0 ? (fuelCost / grossRevenue) * 100 : 0;
  const chargesPercent = grossRevenue > 0 ? (maintenanceCharges / grossRevenue) * 100 : 0;

  return {
    grossRevenue,
    kmMonthly,
    fuelCost,
    maintenanceCharges,
    platformFee,
    netIncome,
    paybackMonths,
    chosenPlan,
    recommendedPlan,
    switchThresholdDailyRevenue,
    switchThresholdMissions,
    planGainMonthly,
    recommendationText,
    breakdown: {
      netPercent,
      platformPercent,
      fuelPercent,
      chargesPercent,
    },
  };
}
