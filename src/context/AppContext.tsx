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
  const [userPlan, setUserPlan] = useState<SellerPlanId>('particulier');
  const [driverPlan, setDriverPlan] = useState<DriverPlanId>('commission');
  
  const [userListingsCount, setUserListingsCount] = useState<number>(0);
  const [featuredRemaining, setFeaturedRemaining] = useState<number>(0);
  
  const [isSellerRegistered, setIsSellerRegistered] = useState<boolean>(false);
  const [sellerShopName, setSellerShopName] = useState<string>('');
  
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
    id: 'drv-user',
    fullName: 'Mon Profil Chauffeur',
    fleetName: '',
    avatarUrl: '',
    coverUrl: '',
    phone: '',
    whatsapp: '',
    email: '',
    vehicleType: 'moto',
    vehicleModel: '',
    licensePlate: '',
    cniNumber: '',
    driverLicenseNumber: '',
    carteGriseNumber: '',
    insuranceCompany: '',
    baseZoneId: 'plateau',
    rating: 5.0,
    totalDeliveries: 0,
    isVerified: false,
    payoutMethod: 'wave',
    payoutNumber: '',
    activityTypes: {
      passengers: false,
      parcels: true,
    },
  });

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
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('novasen_custom_listings');
          if (saved) localCustom = JSON.parse(saved);
        } catch (e) {}
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

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

        const combined = [...mapped];
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
        setListings(combined);
      } else {
        const combined = [...localCustom];
        for (const init of INITIAL_LISTINGS) {
          if (!combined.some((c) => String(c.id) === String(init.id))) {
            combined.push(init);
          }
        }
        setListings(combined);
      }
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
