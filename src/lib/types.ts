export type ServiceMode = 'market' | 'transport';

export type ZoneId =
  | 'plateau'
  | 'medina'
  | 'pointe'
  | 'liberte6'
  | 'mermoz'
  | 'grandyoff'
  | 'ouakam'
  | 'almadies'
  | 'ngor'
  | 'yoff'
  | 'parcelles'
  | 'pikine'
  | 'guediawaye'
  | 'thiaroye'
  | 'rufisque'
  | 'aibd'
  | 'keur_massar'
  | 'yeumbeul'
  | 'thies'
  | 'mbour'
  | 'saly'
  | 'touba'
  | 'diourbel'
  | 'saint_louis'
  | 'kaolack'
  | 'ziguinchor'
  | 'tambacounda'
  | 'kolda'
  | 'fatick'
  | 'louga'
  | 'matam'
  | 'kaffrine'
  | 'kedougou'
  | 'sedhiou'
  | (string & {});

export interface Zone {
  id: ZoneId;
  name: string;
  region: string;
  department?: string;
  x: number; // km from Plateau
  y: number; // km from Plateau
  description?: string;
  popular?: boolean;
  keywords?: string[];
}

export type CategoryId =
  | 'vehicules'
  | 'telephones'
  | 'electronique'
  | 'immobilier'
  | 'maison'
  | 'mode'
  | 'alimentation'
  | 'elevage'
  | 'sports_loisirs'
  | 'services'
  | 'divers';

export type Condition = 'Neuf' | 'Comme neuf' | 'Bon état' | 'Occasion' | 'Reconditionné' | 'Importé' | 'Pour pièces';

export type FuelType = 'Essence' | 'Gasoil' | 'Diesel' | 'Électrique' | 'Hybride';
export type TransmissionType = 'Manuelle' | 'Automatique';

export interface Listing {
  id: string;
  title: string;
  price: number; // in CFA
  category: CategoryId;
  zoneId: ZoneId;
  neighborhood: string;
  region: string;
  condition: Condition;
  sellerName: string;
  sellerSeniority: string;
  relativeDate: string;
  description: string;
  isVerifiedShop?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  images?: string[];
  
  // Specific to vehicles
  year?: number;
  transmission?: TransmissionType;
  fuel?: FuelType;
  mileage?: number;
  consumption?: number; // L/100km
  eligiblePassengers?: boolean;
  eligibleParcels?: boolean;
  vehicleType?: 'moto' | 'voiture' | 'camionnette';
}

export type PassengerClass = 'eco' | 'confort' | 'confort_plus';
export type ParcelClass = 'moto' | 'voiture' | 'camionnette';
export type PaymentMethod = 'cash' | 'wave' | 'orange_money';

export interface FareCalculation {
  distanceKm: number;
  durationMinutes: number;
  isRushHour: boolean;
  passengerFares: {
    eco: number;
    confort: number;
    confort_plus: number;
  };
  parcelFares: {
    moto: number;
    voiture: number;
    camionnette: number;
  };
}

export interface DriverAssignment {
  name: string;
  rating: number;
  tripsCount: number;
  vehicleModel: string;
  licensePlate: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  avatarUrl?: string;
  coverUrl?: string;
  etaMinutes: number;
  totalMissions?: number;
  baseZone?: string;
  isVerified?: boolean;
}

export interface SellerProfile {
  name: string;
  shopName: string;
  avatarUrl: string;
  coverUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  zoneId: ZoneId;
  payoutMethod: 'wave' | 'orange_money' | 'bank';
  payoutNumber: string;
  cniNumber: string;
  ninea?: string;
  rccm?: string;
  isVerified: boolean;
  rating?: number;
  totalSales?: number;
}

export interface DriverProfile {
  id: string;
  fullName: string;
  fleetName?: string;
  avatarUrl: string;
  coverUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  vehicleType: 'moto' | 'voiture' | 'camionnette';
  vehicleModel: string;
  licensePlate: string;
  cniNumber: string;
  driverLicenseNumber: string;
  carteGriseNumber: string;
  insuranceCompany: string;
  baseZoneId: ZoneId;
  rating: number;
  totalDeliveries: number;
  isVerified: boolean;
  payoutMethod: 'wave' | 'orange_money';
  payoutNumber: string;
  activityTypes: {
    passengers: boolean;
    parcels: boolean;
  };
}

export type SellerPlanId = 'particulier' | 'boutique' | 'boutique_pro';
export type DriverPlanId = 'commission' | 'forfait' | 'flotte';

export interface SellerPlan {
  id: SellerPlanId;
  name: string;
  price: number; // CFA / month (0 for particulier)
  maxActiveListings: number; // -1 for unlimited
  commissionRate: number; // e.g. 0, 0.06, 0.04
  featuredPerMonth: number;
  features: string[];
  popular?: boolean;
}

export interface DriverPlan {
  id: DriverPlanId;
  name: string;
  price: number; // fixed cost or daily rate
  commissionRate: number;
  description: string;
  features: string[];
}

export interface ReviewItem {
  id: string;
  targetId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBuyer?: boolean;
}

