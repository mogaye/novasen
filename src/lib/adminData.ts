export interface AdminKycApplication {
  id: string;
  type: 'driver' | 'seller';
  name: string;
  businessOrFleetName?: string;
  avatarUrl: string;
  coverUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  zone: string;
  cniNumber: string;
  driverLicenseNumber?: string;
  vehicleModel?: string;
  licensePlate?: string;
  carteGriseNumber?: string;
  insuranceCompany?: string;
  ninea?: string;
  payoutMethod: 'wave' | 'orange_money';
  payoutNumber: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminLiveDelivery {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  sellerName: string;
  driverName: string;
  driverPhone: string;
  pickupZone: string;
  dropoffZone: string;
  itemTitle: string;
  itemPrice: number;
  deliveryFee: number;
  paymentMethod: 'wave' | 'orange_money' | 'cash';
  status: 'pending_pickup' | 'in_transit' | 'delivered' | 'cancelled';
  time: string;
}

export interface AdminFinancialTransaction {
  id: string;
  type: 'subscription' | 'driver_fee' | 'boost' | 'seller_payout' | 'delivery_commission';
  title: string;
  user: string;
  amount: number;
  gateway: 'Wave Sénégal' | 'Orange Money';
  date: string;
  status: 'completed' | 'processing' | 'failed';
  reference: string;
}

export const INITIAL_ADMIN_KYC: AdminKycApplication[] = [
  {
    id: 'kyc-101',
    type: 'driver',
    name: 'Ibrahima Sarr',
    businessOrFleetName: 'Sarr Moto Express',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
    phone: '+221 77 000 45 67',
    whatsapp: '+221 77 000 45 67',
    email: 'ibrahima.sarr@novasen.sn',
    zone: 'Plateau & Médina',
    cniNumber: '1 758 1993 02918',
    driverLicenseNumber: 'SN-DK-2019-94827',
    vehicleModel: 'Yamaha MT-07 & Top-Case 45L',
    licensePlate: 'DK-4928-BA',
    carteGriseNumber: 'CG-2020-48291',
    insuranceCompany: 'AXA Assurances Sénégal',
    payoutMethod: 'wave',
    payoutNumber: '+221 77 000 45 67',
    submissionDate: 'Aujourd’hui, 14:15',
    status: 'pending',
  },
  {
    id: 'kyc-102',
    type: 'seller',
    name: 'Khady Ndiaye',
    businessOrFleetName: 'Teranga Wax & Bazin Couture',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    phone: '+221 78 000 29 80',
    whatsapp: '+221 78 000 29 80',
    email: 'contact@terangawax.sn',
    zone: 'Sandaga & Plateau',
    cniNumber: '2 849 1996 03921',
    ninea: '009847291 2V5',
    payoutMethod: 'orange_money',
    payoutNumber: '+221 78 000 29 80',
    submissionDate: 'Aujourd’hui, 13:40',
    status: 'pending',
  },
  {
    id: 'kyc-103',
    type: 'driver',
    name: 'Cheikh Tidiane Ba',
    businessOrFleetName: 'Dakar VTC Élite',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80',
    phone: '+221 70 000 11 44',
    whatsapp: '+221 70 000 11 44',
    email: 'cheikh.ba@novasen.sn',
    zone: 'Almadies & Ngor',
    cniNumber: '1 758 1988 01849',
    driverLicenseNumber: 'SN-DK-2016-39182',
    vehicleModel: 'Peugeot 301 Berline Climatisation',
    licensePlate: 'DK-8920-CA',
    carteGriseNumber: 'CG-2019-10928',
    insuranceCompany: 'Sonac Assurances',
    payoutMethod: 'wave',
    payoutNumber: '+221 70 000 11 44',
    submissionDate: 'Hier, 18:20',
    status: 'approved',
  },
  {
    id: 'kyc-104',
    type: 'seller',
    name: 'Aminata Fall',
    businessOrFleetName: 'Dakar Électro Boutique',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    phone: '+221 77 000 28 19',
    whatsapp: '+221 77 000 28 19',
    email: 'contact@dakarelectro.sn',
    zone: 'Médina',
    cniNumber: '1 758 1994 02938',
    ninea: '009482739 2V3',
    payoutMethod: 'wave',
    payoutNumber: '+221 77 000 28 19',
    submissionDate: 'Il y a 2 jours',
    status: 'approved',
  },
];

export const INITIAL_ADMIN_DELIVERIES: AdminLiveDelivery[] = [
  {
    id: 'del-1',
    orderNumber: 'CMD-DK-8942',
    customerName: 'Fatou Bintou Sow',
    customerPhone: '+221 77 459 28 11',
    sellerName: 'Dakar Électro Boutique',
    driverName: 'Abdoulaye Diallo (Diallo Express)',
    driverPhone: '+221 77 890 12 34',
    pickupZone: 'Médina (Rue 11)',
    dropoffZone: 'Almadies (Zone Ambassades)',
    itemTitle: 'iPhone 14 Pro Max 256GB Gold',
    itemPrice: 580000,
    deliveryFee: 2500,
    paymentMethod: 'wave',
    status: 'in_transit',
    time: 'En cours (ETA 12 min)',
  },
  {
    id: 'del-2',
    orderNumber: 'CMD-DK-8943',
    customerName: 'Mamadou Lamine Diop',
    customerPhone: '+221 76 341 90 22',
    sellerName: 'Teranga Wax & Bazin',
    driverName: 'Moussa Ndiaye (Dakar Rapide)',
    driverPhone: '+221 78 456 78 90',
    pickupZone: 'Sandaga',
    dropoffZone: 'Yoff Virage',
    itemTitle: 'Ensemble Bazin Getzner Riche Brodé',
    itemPrice: 85000,
    deliveryFee: 2000,
    paymentMethod: 'orange_money',
    status: 'pending_pickup',
    time: 'En attente de ramassage',
  },
  {
    id: 'del-3',
    orderNumber: 'CMD-DK-8941',
    customerName: 'Aïssatou Ba',
    customerPhone: '+221 77 204 88 19',
    sellerName: 'Auto Motors Dakar',
    driverName: 'Ousmane Cissé (SenVeloce)',
    driverPhone: '+221 76 234 56 78',
    pickupZone: 'Mermoz',
    dropoffZone: 'Plateau',
    itemTitle: 'Casque Moto Intégral Shark D-Skwal',
    itemPrice: 45000,
    deliveryFee: 1500,
    paymentMethod: 'cash',
    status: 'delivered',
    time: 'Livré & Encaissé à 13:50',
  },
  {
    id: 'del-4',
    orderNumber: 'CMD-DK-8940',
    customerName: 'Babacar Seck',
    customerPhone: '+221 70 991 43 00',
    sellerName: 'High-Tech Mariste',
    driverName: 'Cheikh Tidiane Ba',
    driverPhone: '+221 70 892 11 44',
    pickupZone: 'Grand Yoff',
    dropoffZone: 'Ouakam Cité Avion',
    itemTitle: 'MacBook Air M2 16GB / 512GB Gris',
    itemPrice: 720000,
    deliveryFee: 3000,
    paymentMethod: 'wave',
    status: 'delivered',
    time: 'Livré & Encaissé à 12:30',
  },
];

export const INITIAL_ADMIN_TRANSACTIONS: AdminFinancialTransaction[] = [
  {
    id: 'tx-501',
    type: 'subscription',
    title: 'Abonnement Vendeur Pro (30 jours)',
    user: 'Dakar Électro Boutique (Aminata Fall)',
    amount: 6500,
    gateway: 'Wave Sénégal',
    date: 'Aujourd’hui, 14:10',
    status: 'completed',
    reference: 'WAVE-SUB-948271',
  },
  {
    id: 'tx-502',
    type: 'driver_fee',
    title: 'Frais de dossier validation chauffeur',
    user: 'Ibrahima Sarr (Sarr Moto Express)',
    amount: 1500,
    gateway: 'Wave Sénégal',
    date: 'Aujourd’hui, 13:55',
    status: 'completed',
    reference: 'WAVE-DRV-382910',
  },
  {
    id: 'tx-503',
    type: 'seller_payout',
    title: 'Reversement automatique vente livrée #CMD-DK-8941',
    user: 'Auto Motors Dakar (M. Diagne)',
    amount: 45000,
    gateway: 'Wave Sénégal',
    date: 'Aujourd’hui, 13:52',
    status: 'completed',
    reference: 'WAVE-REV-749281',
  },
  {
    id: 'tx-504',
    type: 'boost',
    title: 'Mise en avant Annonce Boost (7 jours)',
    user: 'Immo Prestige Almadies',
    amount: 2500,
    gateway: 'Orange Money',
    date: 'Aujourd’hui, 11:20',
    status: 'completed',
    reference: 'OM-BST-847291',
  },
  {
    id: 'tx-505',
    type: 'subscription',
    title: 'Abonnement Vendeur Pro (30 jours)',
    user: 'Teranga Wax & Bazin (Khady Ndiaye)',
    amount: 6500,
    gateway: 'Orange Money',
    date: 'Hier, 17:30',
    status: 'completed',
    reference: 'OM-SUB-194820',
  },
];
