import { SellerPlan, DriverPlan } from './types';

export const SELLER_PLANS: SellerPlan[] = [
  {
    id: 'particulier',
    name: 'Particulier',
    price: 0,
    maxActiveListings: 3,
    commissionRate: 0,
    featuredPerMonth: 0,
    features: [
      'Jusqu’à 3 annonces actives simultanées',
      '0 % de commission sur les ventes',
      'Vente directe de la main à la main ou avec livraison',
      'Paiement à la livraison possible avec livreur NovaSen',
    ],
  },
  {
    id: 'boutique',
    name: 'Boutique',
    price: 6500,
    maxActiveListings: 30,
    commissionRate: 0.06,
    featuredPerMonth: 1,
    popular: true,
    features: [
      'Jusqu’à 30 annonces actives simultanées',
      'Badge officiel « Boutique vérifiée »',
      '1 mise en avant offerte chaque mois (valeur 1 000 F)',
      'Commission 6 % prélevée uniquement si livraison NovaSen',
      'Statistiques de vues et clics en temps réel',
      '0 % de commission si vente en direct de la main à la main',
    ],
  },
  {
    id: 'boutique_pro',
    name: 'Boutique Pro',
    price: 15000,
    maxActiveListings: -1, // Unlimited
    commissionRate: 0.04,
    featuredPerMonth: 5,
    features: [
      'Nombre d’annonces illimité',
      'Badge « Boutique Pro & Vérifiée » en tête de liste',
      '5 mises en avant offertes chaque mois (valeur 5 000 F)',
      'Commission réduite à 4 % (uniquement sur livraison)',
      'Frais de livraison remisés à −20 % pour vos clients',
      'Page boutique personnalisée dédiée',
      'Support prioritaire 7j/7 par WhatsApp et téléphone',
    ],
  },
];

export const DRIVER_PLANS: DriverPlan[] = [
  {
    id: 'commission',
    name: 'Commission à la course',
    price: 0,
    commissionRate: 0.18,
    description: 'Idéal pour démarrer ou rouler à temps partiel sans aucun engagement.',
    features: [
      '18 % prélevés par mission réalisée',
      'Aucun abonnement ni frais fixe journalier',
      'Vous ne payez que lorsque vous gagnez de l’argent',
      'Liberté totale d’horaires et de zones d’activité',
    ],
  },
  {
    id: 'forfait',
    name: 'Forfait Journée',
    price: 2500,
    commissionRate: 0,
    description: 'La formule gagnante dès 10 missions colis ou 8 courses passagers par jour.',
    features: [
      '2 500 CFA par jour travaillé',
      '0 % de commission sur l’ensemble de vos courses',
      '100 % des gains de la journée restent dans votre poche',
      'Rentabilité maximale pour les chauffeurs et livreurs actifs',
    ],
  },
  {
    id: 'flotte',
    name: 'Flotte Partenaire',
    price: 25000,
    commissionRate: 0.12,
    description: 'Dédié aux gestionnaires de flottes de 3 véhicules et plus.',
    features: [
      '25 000 CFA / mois par véhicule enregistré',
      'Commission réduite à 12 % sur toute la flotte',
      'Tableau de bord de gestion multi-chauffeurs',
      'Gestion centralisée des versements et pièces d’entretien',
    ],
  },
];

export const FEATURED_LISTING_PRICE = 1000; // 1 000 F for 7 days
export const DRIVER_REGISTRATION_FEE = 10000; // 10 000 F one-off
