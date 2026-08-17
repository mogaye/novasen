import { Zone, ZoneId } from './types';

export const ZONES: Zone[] = [
  { id: 'plateau', name: 'Plateau', x: 0, y: 0, description: 'Centre des affaires et ministères', popular: true },
  { id: 'medina', name: 'Médina', x: 1.5, y: 1.5, description: 'Quartier historique et commerçant', popular: true },
  { id: 'pointe', name: 'Point E', x: 3, y: 2.5, description: 'Zone résidentielle et ambassades', popular: true },
  { id: 'liberte6', name: 'Liberté 6', x: 5, y: 4, description: 'Carrefour central et commerces', popular: true },
  { id: 'mermoz', name: 'Mermoz Sacré-Cœur', x: 4.5, y: 5.5, description: 'Quartier résidentiel prisé', popular: true },
  { id: 'grandyoff', name: 'Grand Yoff', x: 7, y: 5, description: 'Grand quartier populaire et animé', popular: true },
  { id: 'ouakam', name: 'Ouakam', x: 5, y: 8, description: 'Monument de la Renaissance, Mamelles', popular: true },
  { id: 'almadies', name: 'Almadies', x: 5.5, y: 10.5, description: 'Pointe des Almadies, restaurants, bord de mer', popular: true },
  { id: 'ngor', name: 'Ngor', x: 7, y: 11, description: 'Île de Ngor, plage et village traditionnel', popular: false },
  { id: 'yoff', name: 'Yoff', x: 8.5, y: 10, description: 'Plage BCEAO et tradition léboue', popular: false },
  { id: 'parcelles', name: 'Parcelles Assainies', x: 10, y: 7, description: 'Grands marchés et vie de quartier', popular: true },
  { id: 'pikine', name: 'Pikine', x: 12, y: 5, description: 'Grand carrefour de la banlieue', popular: true },
  { id: 'guediawaye', name: 'Guédiawaye', x: 13.5, y: 7, description: 'Corniche de Guédiawaye et commerces', popular: true },
  { id: 'thiaroye', name: 'Thiaroye', x: 14, y: 4.5, description: 'Gare TER et zone marchande', popular: false },
  { id: 'rufisque', name: 'Rufisque', x: 18, y: 3, description: 'Ville historique et carrefour autoroutier', popular: true },
  { id: 'aibd', name: 'Aéroport AIBD', x: 34, y: -2, description: 'Aéroport International Blaise Diagne (Dias)', popular: true },
];

export const ZONES_BY_ID = ZONES.reduce<Record<ZoneId, Zone>>((acc, zone) => {
  acc[zone.id] = zone;
  return acc;
}, {} as Record<ZoneId, Zone>);

export function getZone(id: ZoneId): Zone {
  return ZONES_BY_ID[id] || ZONES[0];
}
