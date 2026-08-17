import { SellerPlan, DriverPlan } from './types';

export const SELLER_PLANS: SellerPlan[] = [
  {
    id: 'particulier',
    name: 'Particulier Gratuit',
    price: 0,
    maxActiveListings: 3,
    commissionRate: 0,
    featuredPerMonth: 0,
    features: [
      'Strictement limité à 3 annonces actives maximum',
      '0 % de commission sur vos ventes directes',
      'Vente de la main à la main ou livraison par coursier',
      'Encaissement à la livraison NovaSen COD possible',
    ],
  },
  {
    id: 'boutique',
    name: 'Boutique Pro',
    price: 6500,
    maxActiveListings: 30,
    commissionRate: 0.06,
    featuredPerMonth: 1,
    popular: true,
    features: [
      'Jusqu’à 30 annonces actives simultanées',
      'Badge officiel « Boutique vérifiée »',
      '1 mise en avant offerte par mois (valeur 1 000 F)',
      'Statistiques de vues et contacts acheteurs',
      '0 % de commission si vente directe en main propre',
      'Commission 6 % uniquement si livraison NovaSen',
    ],
  },
  {
    id: 'boutique_pro',
    name: 'Boutique Illimitée',
    price: 15000,
    maxActiveListings: -1, // Unlimited
    commissionRate: 0.04,
    featuredPerMonth: 5,
    features: [
      'Nombre d’annonces illimité (aucune restriction)',
      'Badge « Boutique Pro & Vérifiée » prioritaire',
      '5 mises en avant offertes chaque mois (valeur 5 000 F)',
      'Commission réduite à 4 % (uniquement sur livraison)',
      'Frais de livraison remisés à −20 % pour vos clients',
      'Page boutique vitrine personnalisée dédiée',
      'Assistance prioritaire 7j/7 par WhatsApp et téléphone',
    ],
  },
];

export const DRIVER_PLANS: DriverPlan[] = [
  {
    id: 'journalier',
    name: 'Pass Journée (24h)',
    price: 1500,
    period: 'jour',
    commissionRate: 0,
    description: 'Accès 24 heures sans engagement : 1 500 F pour rouler et livrer toute la journée.',
    features: [
      '1 500 CFA / 24h d’activité complète',
      '0 % de commission sur toutes vos courses et livraisons',
      'Missions colis et passagers illimitées dans la journée',
      'Paiement et activation instantanés par Wave ou Orange Money',
      '100 % de vos gains encaissés vous appartiennent',
    ],
  },
  {
    id: 'mensuel',
    name: 'Abonnement Mensuel Chauffeur',
    price: 25000,
    period: 'mois',
    commissionRate: 0,
    popular: true,
    description: 'La formule illimitée au mois (25 000 F / mois) : la plus rentable pour les professionnels.',
    features: [
      '25 000 CFA / mois (accès 30 jours illimité)',
      '0 % de commission sur l’ensemble de vos courses',
      'Économisez par rapport au pass journalier (~833 F/jour)',
      'Visibilité prioritaire sur les demandes de courses à Dakar',
      'Badge officiel « Chauffeur Vérifié & Prioritaire »',
      'Assistance dédiée 7j/7 et support prioritaire',
    ],
  },
  {
    id: 'flotte',
    name: 'Flotte Partenaire (Multi-véhicules)',
    price: 25000,
    period: 'mois',
    commissionRate: 0,
    description: 'Pour les gestionnaires et groupements de transporteurs (3 véhicules et plus).',
    features: [
      '25 000 CFA / mois par véhicule de la flotte',
      '0 % de commission sur toute la flotte',
      'Tableau de bord de gestion multi-chauffeurs',
      'Suivi centralisé des versements et chauffeurs',
    ],
  },
];

export const FEATURED_LISTING_PRICE = 1000; // 1 000 F for 7 days
export const DRIVER_REGISTRATION_FEE = 10000; // 10 000 F one-off

