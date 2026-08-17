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
    description: 'Accès 24 heures sans engagement : 1 500 F pour recevoir des missions de livraison de colis en direct.',
    features: [
      '1 500 CFA / 24h d’activité complète',
      '0 % de commission sur toutes vos livraisons',
      'Fixez librement vos prix avec chaque vendeur ou client',
      'Missions colis et marchandises illimitées dans la journée',
      'Activation instantanée par Wave ou Orange Money',
      '100 % de vos revenus vous appartiennent',
    ],
  },
  {
    id: 'mensuel',
    name: 'Abonnement Mensuel Pro',
    price: 35000,
    period: 'mois',
    commissionRate: 0,
    popular: true,
    description: 'La formule professionnelle au mois (35 000 F / mois) : la plus rentable pour les coursiers réguliers.',
    features: [
      '35 000 CFA / mois (accès 30 jours illimité)',
      '0 % de commission sur toutes vos livraisons',
      'Fixez librement vos tarifs de transport sans intermédiaire',
      'Référencement prioritaire dans l’annuaire des livreurs certifiés',
      'Badge officiel « Livreur Vérifié & Recommandé »',
      'Assistance prioritaire 7j/7 par WhatsApp',
    ],
  },
  {
    id: 'annuel',
    name: 'Abonnement Annuel Illimité',
    price: 400000,
    period: 'an',
    commissionRate: 0,
    description: 'Engagement annuel tout compris (400 000 F / an) : visibilité maximale et économies garanties.',
    features: [
      '400 000 CFA / an (12 mois d’accès illimité)',
      '0 % de commission toute l’année sur vos courses',
      'Économisez 20 000 F par rapport au tarif mensuel',
      'Mise en avant VIP en tête de l’annuaire des livreurs à Dakar',
      'Badge officiel Gold « Partenaire Transporteur Officiel »',
      'Ligne directe support dédiée 24/7',
    ],
  },
];

export const FEATURED_LISTING_PRICE = 1000; // 1 000 F for 7 days
export const DRIVER_REGISTRATION_FEE = 10000; // 10 000 F one-off

