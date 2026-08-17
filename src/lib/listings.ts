import { CategoryId, Listing } from './types';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  count?: number;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'vehicules', name: 'Véhicules & Motos', icon: '🚗', description: 'Motos, scooters, voitures, camions' },
  { id: 'telephones', name: 'Téléphones & Tablettes', icon: '📱', description: 'Smartphones, iPhone, Samsung, accessoires' },
  { id: 'electronique', name: 'Électronique & Info', icon: '💻', description: 'Ordinateurs, TV, audio, électroménager' },
  { id: 'immobilier', name: 'Immobilier', icon: '🏠', description: 'Appartements, villas, terrains, bureaux' },
  { id: 'maison', name: 'Maison & Mobilier', icon: '🛋️', description: 'Meubles, décoration, cuisine' },
  { id: 'mode', name: 'Mode & Beauté', icon: '👗', description: 'Vêtements, chaussures, parfums, tissus' },
  { id: 'alimentation', name: 'Alimentation & Terroir', icon: '🌾', description: 'Produits locaux, céréales, épicerie' },
  { id: 'elevage', name: 'Élevage & Animaux', icon: '🐑', description: 'Moutons Ladoum, volaille, aliments' },
  { id: 'sports_loisirs', name: 'Sports & Loisirs', icon: '⚽', description: 'Équipements sportifs, vélos, jeux' },
  { id: 'services', name: 'Services & Emplois', icon: '🛠️', description: 'Artisans, réparations, cours, offres' },
  { id: 'divers', name: 'Autres & Divers', icon: '📦', description: 'Objets divers et bonnes affaires' },
];

// Real listings list (initialized empty - data is fetched live from Supabase)
export const INITIAL_LISTINGS: Listing[] = [];

export function getListingById(id: string, customListings: Listing[] = []): Listing | undefined {
  return customListings.find((l) => l.id === id);
}

export function filterListings(
  listings: Listing[],
  filters: {
    category?: string;
    zoneId?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
  }
): Listing[] {
  return listings.filter((l) => {
    if (filters.category && filters.category !== 'all' && l.category !== filters.category) {
      return false;
    }
    if (filters.zoneId && filters.zoneId !== 'all' && l.zoneId !== filters.zoneId) {
      return false;
    }
    if (filters.condition && filters.condition !== 'all' && l.condition !== filters.condition) {
      return false;
    }
    if (filters.minPrice !== undefined && l.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && l.price > filters.maxPrice) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchDesc = l.description.toLowerCase().includes(q);
      const matchNeighborhood = l.neighborhood.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchNeighborhood) {
        return false;
      }
    }
    return true;
  });
}
