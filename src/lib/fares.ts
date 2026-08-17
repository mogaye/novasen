import { Zone, ZoneId, FareCalculation } from './types';
import { getZone } from './zones';

function round10(val: number): number {
  return Math.round(val / 10) * 10;
}

export function isCurrentlyRushHour(date = new Date()): boolean {
  const hour = date.getHours();
  // 7h-9h (7:00 to 8:59) and 17h-20h (17:00 to 19:59)
  return (hour >= 7 && hour < 9) || (hour >= 17 && hour < 20);
}

export function calculateTripMetrics(originId: ZoneId, destinationId: ZoneId, forceRushHour?: boolean): {
  distanceKm: number;
  durationMinutes: number;
  isRushHour: boolean;
  isInterurban: boolean;
} {
  const origin = getZone(originId);
  const destination = getZone(destinationId);

  let flightDistance = Math.hypot(destination.x - origin.x, destination.y - origin.y);
  if (originId === destinationId) {
    flightDistance = 1.5; // Short intra-neighborhood trip
  }

  // Road sinuosity factor (1.30 to 1.35)
  const distanceKm = Math.round(flightDistance * 1.32 * 10) / 10;

  const isInterurban = distanceKm > 35 || origin.region !== destination.region;

  // Average speed: 22 km/h in urban city traffic, 72 km/h on national highways
  const avgSpeed = isInterurban ? (distanceKm > 150 ? 78 : 65) : 22;
  const baseMinutes = (distanceKm / avgSpeed) * 60;

  const isRushHour = forceRushHour !== undefined ? forceRushHour : isCurrentlyRushHour();
  // Rush hour impacts urban trips more heavily
  const rushFactor = isRushHour ? (isInterurban ? 1.15 : 1.45) : 1.0;
  const durationMinutes = Math.round(baseMinutes * rushFactor);

  return {
    distanceKm,
    durationMinutes,
    isRushHour,
    isInterurban,
  };
}

export function calculateFares(originId: ZoneId, destinationId: ZoneId, forceRushHour?: boolean): FareCalculation {
  const { distanceKm, durationMinutes, isRushHour, isInterurban } = calculateTripMetrics(originId, destinationId, forceRushHour);

  const passengerSurge = isRushHour ? 1.2 : 1.0;

  if (isInterurban) {
    // Interurban / Régional (Tarifs dégressifs réalistes pour trajets inter-régions au Sénégal)
    // Éco (style VTC partagé / confort): 1 500 F base + 45 F/km
    const ecoRaw = (1500 + distanceKm * 48) * passengerSurge;
    const ecoFare = round10(Math.max(2500, ecoRaw));

    // Confort (VTC privé climatisé): 2 500 F base + 65 F/km
    const confortRaw = (2500 + distanceKm * 68) * passengerSurge;
    const confortFare = round10(Math.max(3800, confortRaw));

    // Confort + (Berline / SUV Privé): 4 000 F base + 95 F/km
    const confortPlusRaw = (4000 + distanceKm * 98) * passengerSurge;
    const confortPlusFare = round10(Math.max(5500, confortPlusRaw));

    // Colis Interurbain:
    // Moto / Express bagage léger (<= 5 kg): 1 200 F base + 35 F/km
    const motoRaw = 1200 + distanceKm * 38;
    const motoFare = round10(Math.max(2000, motoRaw));

    // Voiture Colis (<= 30 kg): 2 000 F base + 50 F/km
    const voitureRaw = 2000 + distanceKm * 52;
    const voitureFare = round10(Math.max(3500, voitureRaw));

    // Camionnette Fret régional (<= 300 kg): 6 000 F base + 90 F/km
    const camionnetteRaw = 6000 + distanceKm * 95;
    const camionnetteFare = round10(Math.max(8000, camionnetteRaw));

    return {
      distanceKm,
      durationMinutes,
      isRushHour,
      passengerFares: {
        eco: ecoFare,
        confort: confortFare,
        confort_plus: confortPlusFare,
      },
      parcelFares: {
        moto: motoFare,
        voiture: voitureFare,
        camionnette: camionnetteFare,
      },
    };
  }

  // Intra-Urbain (Dakar et agglomération)
  // PASSAGERS:
  // Éco: 300 F + 170 F/km + 15 F/min, minimum 570 F
  const ecoRaw = (300 + distanceKm * 170 + durationMinutes * 15) * passengerSurge;
  const ecoFare = round10(Math.max(570, ecoRaw));

  // Confort: 400 F + 215 F/km + 20 F/min, minimum 680 F
  const confortRaw = (400 + distanceKm * 215 + durationMinutes * 20) * passengerSurge;
  const confortFare = round10(Math.max(680, confortRaw));

  // Confort +: 500 F + 290 F/km + 28 F/min, minimum 800 F
  const confortPlusRaw = (500 + distanceKm * 290 + durationMinutes * 28) * passengerSurge;
  const confortPlusFare = round10(Math.max(800, confortPlusRaw));

  // COLIS:
  // Moto (<= 5 kg): 500 F + 130 F/km, minimum 700 F
  const motoRaw = 500 + distanceKm * 130;
  const motoFare = round10(Math.max(700, motoRaw));

  // Voiture (<= 30 kg): 800 F + 190 F/km, minimum 1 200 F
  const voitureRaw = 800 + distanceKm * 190;
  const voitureFare = round10(Math.max(1200, voitureRaw));

  // Camionnette (<= 300 kg): 2 500 F + 320 F/km, minimum 4 000 F
  const camionnetteRaw = 2500 + distanceKm * 320;
  const camionnetteFare = round10(Math.max(4000, camionnetteRaw));

  return {
    distanceKm,
    durationMinutes,
    isRushHour,
    passengerFares: {
      eco: ecoFare,
      confort: confortFare,
      confort_plus: confortPlusFare,
    },
    parcelFares: {
      moto: motoFare,
      voiture: voitureFare,
      camionnette: camionnetteFare,
    },
  };
}
