'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceMode,
  Listing,
  SellerPlanId,
  DriverPlanId,
  DriverAssignment,
  ZoneId,
  SellerProfile,
  DriverProfile,
  DriverTrip,
} from '@/lib/types';
import { INITIAL_LISTINGS } from '@/lib/listings';
import { INITIAL_DRIVERS } from '@/lib/drivers';
import { SELLER_PLANS } from '@/lib/plans';
import { supabase } from '@/lib/supabase';

export interface OrderItem {
  id: string;
  type: 'passagers' | 'colis';
  originId: ZoneId;
  destinationId: ZoneId;
  fare: number;
  paymentMethod: 'cash' | 'wave' | 'orange_money';
  listingTitle?: string;
  itemPrice?: number;
  codAmount?: number;
  driver?: DriverAssignment;
  status: 'pending' | 'assigned' | 'in_transit' | 'completed';
  createdAt: string;
  estimatedMinutes: number;
}

interface AppContextType {
  activeService: ServiceMode;
  setActiveService: (service: ServiceMode) => void;
  listings: Listing[];
  fetchListings: () => Promise<void>;
  addListing: (listingData: Partial<Listing>) => Promise<{ success: boolean; error?: string; isQuotaReached?: boolean; data?: any }>;
  deleteListing: (listingId: string) => Promise<{ success: boolean; error?: string }>;
  driverTrips: DriverTrip[];
  addDriverTrip: (tripData: Partial<DriverTrip>) => Promise<{ success: boolean; error?: string }>;
  deleteDriverTrip: (tripId: string) => Promise<{ success: boolean; error?: string }>;
  userPlan: SellerPlanId;
  setUserPlan: (plan: SellerPlanId) => void;
  driverPlan: DriverPlanId;
  setDriverPlan: (plan: DriverPlanId) => void;
  userListingsCount: number;
  featuredRemaining: number;
  useFeaturedCredit: () => boolean;
  activeOrder: OrderItem | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<OrderItem | null>>;
  createOrder: (orderData: Partial<OrderItem>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  isSellerRegistered: boolean;
  setIsSellerRegistered: (val: boolean) => void;
  sellerShopName: string;
  setSellerShopName: (name: string) => void;
  sellerProfile: SellerProfile;
  updateSellerProfile: (data: Partial<SellerProfile>) => void;
  driverProfile: DriverProfile;
  updateDriverProfile: (data: Partial<DriverProfile>) => void;
  drivers: DriverProfile[];
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  showSuccessToast: (message: string) => void;
  toastMessage: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeService, setActiveServiceState] = useState<ServiceMode>('market');
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [userPlan, setUserPlanState] = useState<SellerPlanId>('particulier');
  const [driverPlan, setDriverPlanState] = useState<DriverPlanId>('none');
  
  const [userListingsCount, setUserListingsCount] = useState<number>(0);
  const [featuredRemaining, setFeaturedRemaining] = useState<number>(0);
  
  const [isSellerRegistered, setIsSellerRegistered] = useState<boolean>(false);
  const [sellerShopName, setSellerShopName] = useState<string>('');

  // Persist userPlan & driverPlan
  const setUserPlan = (plan: SellerPlanId) => {
    setUserPlanState(plan);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('novasen_user_plan', plan);
      } catch (e) {}
    }
  };

  const setDriverPlan = (plan: DriverPlanId) => {
    setDriverPlanState(plan);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('novasen_driver_plan', plan);
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUserPlan = localStorage.getItem('novasen_user_plan') as SellerPlanId | null;
        if (savedUserPlan && SELLER_PLANS.some((p) => p.id === savedUserPlan)) {
          setUserPlanState(savedUserPlan);
        }
        const savedDriverPlan = localStorage.getItem('novasen_driver_plan') as DriverPlanId | null;
        if (savedDriverPlan && (savedDriverPlan === 'journalier' || savedDriverPlan === 'mensuel' || savedDriverPlan === 'flotte')) {
          setDriverPlanState(savedDriverPlan);
        }
      } catch (e) {}
    }
  }, []);
  
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>({
    name: 'Mon Profil',
    shopName: '',
    avatarUrl: '',
    coverUrl: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    zoneId: 'plateau',
    payoutMethod: 'wave',
    payoutNumber: '',
    cniNumber: '',
    ninea: '',
    rccm: '',
    isVerified: false,
    rating: 5.0,
    totalSales: 0,
  });

  const [driverProfile, setDriverProfile] = useState<DriverProfile>({
    id: 'drv-current',
    fullName: 'Mon Profil Chauffeur',
    avatarUrl: '',
    coverUrl: '',
    phone: '',
    whatsapp: '',
    email: '',
    vehicleType: 'voiture',
    vehicleModel: 'Véhicule VTC Dakar',
    licensePlate: 'DK-0000-XX',
    cniNumber: '',
    driverLicenseNumber: '',
    carteGriseNumber: '',
    insuranceCompany: '',
    baseZoneId: 'plateau',
    rating: 5.0,
    totalDeliveries: 0,
    isVerified: true,
    payoutMethod: 'wave',
    payoutNumber: '',
    activityTypes: {
      passengers: true,
      parcels: true,
    },
  });

  const INITIAL_DRIVER_TRIPS: DriverTrip[] = [
    {
      id: 'trip-1',
      driverId: 'drv-1',
      driverName: 'Mamadou Lamine Diop',
      driverPhone: '+221 77 512 84 90',
      driverWhatsapp: '+221 77 512 84 90',
      originZone: 'Plateau / Centre-ville',
      destinationZone: 'Almadies / Ngor / Virage',
      departureTime: 'Départ à 14h30',
      vehicleType: 'voiture',
      vehicleModel: 'Toyota Corolla Climatisée',
      tripType: 'passagers',
      price: 3500,
      availableSeats: 3,
      status: 'active',
      createdAt: "Aujourd'hui",
    },
    {
      id: 'trip-2',
      driverId: 'drv-2',
      driverName: 'Cheikhna Ndiaye',
      driverPhone: '+221 78 913 90 36',
      driverWhatsapp: '+221 70 590 87 25',
      originZone: 'Médina / Tilène',
      destinationZone: 'Guédiawaye / Pikine',
      departureTime: 'Départ immédiat',
      vehicleType: 'moto',
      vehicleModel: 'Honda Dio 110cc (Top Case)',
      tripType: 'colis',
      price: 2000,
      maxWeightKg: 15,
      status: 'active',
      createdAt: "Aujourd'hui",
    },
  ];

  const [driverTrips, setDriverTrips] = useState<DriverTrip[]>(INITIAL_DRIVER_TRIPS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        let deletedTripIds: string[] = [];
        const savedDeleted = localStorage.getItem('novasen_deleted_trip_ids');
        if (savedDeleted) deletedTripIds = JSON.parse(savedDeleted);

        const savedTrips = localStorage.getItem('novasen_driver_trips');
        let tripsToLoad = INITIAL_DRIVER_TRIPS;
        if (savedTrips) {
          const parsed = JSON.parse(savedTrips);
          if (Array.isArray(parsed) && parsed.length > 0) {
            tripsToLoad = parsed;
          }
        }
        setDriverTrips(tripsToLoad.filter((t) => !deletedTripIds.includes(String(t.id))));
      } catch (e) {}
    }
  }, []);

  const [drivers, setDrivers] = useState<DriverProfile[]>(INITIAL_DRIVERS);
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync data-service attribute on <html> document element
  const setActiveService = (service: ServiceMode) => {
    setActiveServiceState(service);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-service', service);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-service', activeService);
    }
  }, [activeService]);

  // Adjust featured quota when plan changes
  useEffect(() => {
    const currentPlanConfig = SELLER_PLANS.find((p) => p.id === userPlan);
    if (currentPlanConfig) {
      setFeaturedRemaining(currentPlanConfig.featuredPerMonth);
    }
  }, [userPlan]);

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(listingId);
      if (exists) {
        showSuccessToast('Retiré de vos favoris');
        return prev.filter((id) => id !== listingId);
      } else {
        showSuccessToast('❤️ Ajouté à vos favoris');
        return [...prev, listingId];
      }
    });
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  const useFeaturedCredit = (): boolean => {
    if (featuredRemaining > 0) {
      setFeaturedRemaining((prev) => prev - 1);
      return true;
    }
    return false;
  };

  // Fetch real listings from Supabase
  const fetchListings = async () => {
    try {
      let localCustom: Listing[] = [];
      let deletedIds: string[] = [];

      if (typeof window !== 'undefined') {
        try {
          const savedCustom = localStorage.getItem('novasen_custom_listings');
          if (savedCustom) localCustom = JSON.parse(savedCustom);

          const savedDeleted = localStorage.getItem('novasen_deleted_listing_ids');
          if (savedDeleted) deletedIds = JSON.parse(savedDeleted);
        } catch (e) {}
      }

      const isNotDeleted = (id: string | number) => !deletedIds.includes(String(id));

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      let combined: Listing[] = [];

      if (data && !error) {
        const mapped: Listing[] = data.map((d: any) => ({
          id: String(d.id),
          title: d.title || 'Annonce NovaSen',
          price: Number(d.price) || 0,
          category: d.category || 'vehicules',
          zoneId: (d.zone_id as ZoneId) || 'plateau',
          neighborhood: d.address || d.zone_id || 'Dakar',
          region: 'Dakar',
          condition: d.condition || 'Bon état',
          sellerName: d.phone || 'Vendeur NovaSen',
          sellerSeniority: 'Membre certifié',
          relativeDate: d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR') : "Aujourd'hui",
          description: d.description || '',
          isVerifiedShop: false,
          isFeatured: d.is_featured || false,
          imageUrl: d.images?.[0] || '',
          images: d.images && d.images.length > 0 ? d.images : (d.imageUrl ? [d.imageUrl] : []),
        }));

        combined = [...mapped];
        for (const item of localCustom) {
          if (!combined.some((c) => String(c.id) === String(item.id))) {
            combined.push(item);
          }
        }
        for (const init of INITIAL_LISTINGS) {
          if (!combined.some((c) => String(c.id) === String(init.id))) {
            combined.push(init);
          }
        }
      } else {
        combined = [...localCustom];
        for (const init of INITIAL_LISTINGS) {
          if (!combined.some((c) => String(c.id) === String(init.id))) {
            combined.push(init);
          }
        }
      }

      // Filter out all deleted listings permanently
      const finalFiltered = combined.filter((item) => isNotDeleted(item.id));
      const activeCustomCount = localCustom.filter((item) => isNotDeleted(item.id)).length;

      setListings(finalFiltered);
      setUserListingsCount(activeCustomCount);
    } catch (err) {
      console.error('Error fetching listings from Supabase:', err);
    }
  };

  // Fetch real drivers from Supabase
  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'chauffeur');

      if (data && !error) {
        const mapped: DriverProfile[] = data.map((d: any) => ({
          id: d.id,
          fullName: d.full_name || 'Chauffeur NovaSen',
          fleetName: d.shop_name || 'NovaSen Express',
          avatarUrl: d.avatar_url || '',
          coverUrl: d.cover_url || '',
          phone: d.phone || '',
          whatsapp: d.whatsapp || '',
          email: d.email || '',
          vehicleType: (d.vehicle_type || 'moto') as any,
          vehicleModel: d.vehicle_type || 'Moto Standard',
          licensePlate: d.vehicle_plate || 'DK-0000-SN',
          cniNumber: '',
          driverLicenseNumber: '',
          carteGriseNumber: '',
          insuranceCompany: '',
          baseZoneId: (d.zone_id || 'plateau') as ZoneId,
          rating: Number(d.rating) || 5.0,
          totalDeliveries: 0,
          isVerified: d.is_verified || false,
          payoutMethod: 'wave',
          payoutNumber: d.phone || '',
          activityTypes: {
            passengers: true,
            parcels: true,
          },
        }));
        setDrivers(mapped);
      }
    } catch (err) {
      console.error('Error fetching drivers from Supabase:', err);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchDrivers();
  }, []);

  const addListing = async (listingData: Partial<Listing>): Promise<{ success: boolean; error?: string; isQuotaReached?: boolean; data?: any }> => {
    try {
      // 1. Strict Quota Enforcement
      const currentPlanConfig = SELLER_PLANS.find((p) => p.id === userPlan) || SELLER_PLANS[0];
      if (currentPlanConfig.maxActiveListings !== -1 && userListingsCount >= currentPlanConfig.maxActiveListings) {
        return {
          success: false,
          isQuotaReached: true,
          error: `Limite atteinte : votre formule actuelle (${currentPlanConfig.name}) est strictement limitée à ${currentPlanConfig.maxActiveListings} annonce(s). Passez à la formule Boutique pour publier davantage.`,
        };
      }

      const { data: userData } = await supabase.auth.getUser();

      const insertPayload = {
        user_id: userData.user?.id || null,
        title: listingData.title || 'Nouvelle annonce',
        price: Number(listingData.price) || 0,
        category: listingData.category || 'vehicules',
        zone_id: listingData.zoneId || 'plateau',
        address: listingData.neighborhood || 'Dakar',
        condition: listingData.condition || 'Bon état',
        description: listingData.description || '',
        images: listingData.images || (listingData.imageUrl ? [listingData.imageUrl] : []),
        is_featured: listingData.isFeatured || false,
        phone: listingData.sellerName || '',
      };

      const { data, error } = await supabase
        .from('listings')
        .insert(insertPayload)
        .select()
        .single();

      const newListingItem: Listing = {
        id: String(data?.id || `cust-${Date.now()}`),
        title: insertPayload.title,
        price: insertPayload.price,
        category: insertPayload.category as any,
        zoneId: insertPayload.zone_id as ZoneId,
        neighborhood: insertPayload.address,
        region: 'Dakar',
        condition: insertPayload.condition as any,
        sellerName: insertPayload.phone || 'Vendeur NovaSen',
        sellerSeniority: 'Nouveau vendeur',
        relativeDate: "Aujourd'hui",
        description: insertPayload.description,
        isVerifiedShop: false,
        isFeatured: insertPayload.is_featured,
        imageUrl: insertPayload.images[0] || '',
        images: insertPayload.images,
      };

      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('novasen_custom_listings');
          const list = saved ? JSON.parse(saved) : [];
          localStorage.setItem('novasen_custom_listings', JSON.stringify([newListingItem, ...list]));
        } catch (e) {}
      }

      setListings((prev) => [newListingItem, ...prev.filter((l) => String(l.id) !== String(newListingItem.id))]);
      setUserListingsCount((prev) => prev + 1);

      return { success: true, data: data || newListingItem };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors de la publication.' };
    }
  };

  const deleteListing = async (listingId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Delete from Supabase if online
      try {
        await supabase.from('listings').delete().eq('id', listingId);
      } catch (err) {
        console.warn('Could not delete from Supabase, removing locally', err);
      }

      // 2. Add to deleted IDs blacklist & remove from custom listings
      if (typeof window !== 'undefined') {
        try {
          const savedDeleted = localStorage.getItem('novasen_deleted_listing_ids');
          const deletedList: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
          if (!deletedList.includes(String(listingId))) {
            deletedList.push(String(listingId));
            localStorage.setItem('novasen_deleted_listing_ids', JSON.stringify(deletedList));
          }

          const saved = localStorage.getItem('novasen_custom_listings');
          if (saved) {
            const list: Listing[] = JSON.parse(saved);
            const filtered = list.filter((item) => String(item.id) !== String(listingId));
            localStorage.setItem('novasen_custom_listings', JSON.stringify(filtered));
          }
        } catch (e) {}
      }

      // 3. Update active listings state
      setListings((prev) => prev.filter((item) => String(item.id) !== String(listingId)));
      setUserListingsCount((prev) => Math.max(0, prev - 1));
      showSuccessToast('Annonce supprimée avec succès (1 place libérée sur votre quota)');

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erreur lors de la suppression' };
    }
  };

  const addDriverTrip = async (tripData: Partial<DriverTrip>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (driverPlan === 'none') {
        return {
          success: false,
          error: 'Vous devez avoir un forfait chauffeur actif (Pass 1 500 F/jour ou Abonnement 25 000 F/mois) pour publier une annonce de trajet.',
        };
      }

      const newTrip: DriverTrip = {
        id: `trip-${Date.now()}`,
        driverId: driverProfile.id || 'drv-me',
        driverName: driverProfile.fullName || 'Chauffeur NovaSen',
        driverPhone: driverProfile.phone || '+221 78 913 90 36',
        driverWhatsapp: driverProfile.whatsapp || '+221 70 590 87 25',
        originZone: tripData.originZone || 'Dakar Plateau',
        destinationZone: tripData.destinationZone || 'Almadies',
        departureTime: tripData.departureTime || 'Départ dans 30 min',
        vehicleType: tripData.vehicleType || 'voiture',
        vehicleModel: driverProfile.vehicleModel || tripData.vehicleModel || 'Véhicule VTC',
        tripType: tripData.tripType || 'mixte',
        price: Number(tripData.price) || 3000,
        availableSeats: tripData.availableSeats || 3,
        maxWeightKg: tripData.maxWeightKg || 20,
        status: 'active',
        createdAt: "Aujourd'hui",
      };

      setDriverTrips((prev) => [newTrip, ...prev]);

      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('novasen_driver_trips');
          const list = saved ? JSON.parse(saved) : [];
          localStorage.setItem('novasen_driver_trips', JSON.stringify([newTrip, ...list]));
        } catch (e) {}
      }

      showSuccessToast('Annonce de trajet publiée avec succès !');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur publication trajet' };
    }
  };

  const deleteDriverTrip = async (tripId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setDriverTrips((prev) => prev.filter((t) => String(t.id) !== String(tripId)));

      if (typeof window !== 'undefined') {
        try {
          const savedDeleted = localStorage.getItem('novasen_deleted_trip_ids');
          const deletedList: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
          if (!deletedList.includes(String(tripId))) {
            deletedList.push(String(tripId));
            localStorage.setItem('novasen_deleted_trip_ids', JSON.stringify(deletedList));
          }

          const saved = localStorage.getItem('novasen_driver_trips');
          if (saved) {
            const list: DriverTrip[] = JSON.parse(saved);
            const filtered = list.filter((t) => String(t.id) !== String(tripId));
            localStorage.setItem('novasen_driver_trips', JSON.stringify(filtered));
          }
        } catch (e) {}
      }

      showSuccessToast('Annonce de trajet supprimée avec succès');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur suppression trajet' };
    }
  };

  const createOrder = async (orderData: Partial<OrderItem>): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_id: userData.user?.id || null,
          order_type: orderData.type || 'colis',
          origin_zone: orderData.originId || 'plateau',
          destination_zone: orderData.destinationId || 'almadies',
          fare: orderData.fare || 1500,
          payment_method: orderData.paymentMethod || 'cash',
          cod_amount: orderData.codAmount || 0,
          item_price: orderData.itemPrice || 0,
          notes: orderData.listingTitle || '',
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, orderId: data.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateSellerProfile = (data: Partial<SellerProfile>) => {
    setSellerProfile((prev) => ({ ...prev, ...data }));
    if (data.shopName) {
      setSellerShopName(data.shopName);
    }
  };

  const updateDriverProfile = (data: Partial<DriverProfile>) => {
    setDriverProfile((prev) => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        activeService,
        setActiveService,
        listings,
        fetchListings,
        addListing,
        deleteListing,
        driverTrips,
        addDriverTrip,
        deleteDriverTrip,
        userPlan,
        setUserPlan,
        driverPlan,
        setDriverPlan,
        userListingsCount,
        featuredRemaining,
        useFeaturedCredit,
        activeOrder,
        setActiveOrder,
        createOrder,
        isSellerRegistered,
        setIsSellerRegistered,
        sellerShopName,
        setSellerShopName,
        sellerProfile,
        updateSellerProfile,
        driverProfile,
        updateDriverProfile,
        drivers,
        favorites,
        toggleFavorite,
        isFavorite,
        showSuccessToast,
        toastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
