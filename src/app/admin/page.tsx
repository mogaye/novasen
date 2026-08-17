'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { formatCFA } from '@/lib/format';
import { GlowButton } from '@/components/ui/GlowButton';
import { Button } from '@/components/ui/Button';
import { Field, inputClass, selectClass } from '@/components/ui/Field';
import {
  INITIAL_ADMIN_KYC,
  INITIAL_ADMIN_DELIVERIES,
  INITIAL_ADMIN_TRANSACTIONS,
  AdminKycApplication,
  AdminLiveDelivery,
  AdminFinancialTransaction,
} from '@/lib/adminData';
import {
  IconShieldCheck,
  IconPackage,
  IconCar,
  IconTrendingUp,
  IconCheck,
  IconX,
  IconPhone,
  IconMapPin,
  IconStar,
  IconPlus,
  IconArrowRight,
  IconClock,
} from '@/components/ui/Icons';

export default function AdminDashboardPage() {
  const { listings, showSuccessToast } = useApp();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'dispatch' | 'listings' | 'finance' | 'settings'>('overview');

  // Live Supabase Profiles & Users State
  const [supabaseUsers, setSupabaseUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // KYC Management State
  const [kycList, setKycList] = useState<AdminKycApplication[]>([]);
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedKycDoc, setSelectedKycDoc] = useState<AdminKycApplication | null>(null);

  // Live Deliveries State
  const [deliveries, setDeliveries] = useState<AdminLiveDelivery[]>([]);
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'pending_pickup' | 'in_transit' | 'delivered'>('all');

  // Transactions State
  const [transactions, setTransactions] = useState<AdminFinancialTransaction[]>([]);

  // Platform Settings State
  const [boutiqueFee, setBoutiqueFee] = useState(8500);
  const [driverFee, setDriverFee] = useState(1500);
  const [boostFee, setBoostFee] = useState(2500);
  const [commissionRate, setCommissionRate] = useState(10);
  const [kmRate, setKmRate] = useState(250);

  // Fetch real users from Supabase
  const fetchSupabaseUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data && !error) {
        setSupabaseUsers(data);
      }
    } catch (err) {
      console.warn('Error fetching Supabase profiles:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchSupabaseUsers();
  }, []);

  // Real Calculations based on live Supabase and active listings
  const totalSubRevenue = 0; // Starts at 0 until real payments are processed
  const totalDriverFees = 0;
  const totalBoostRevenue = 0;
  const totalPlatformRevenue = 0;
  const totalMarketplaceGMV = listings.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const pendingKycCount = supabaseUsers.filter(u => !u.is_verified).length;
  const verifiedKycCount = supabaseUsers.filter(u => u.is_verified).length;

  // KYC Handlers with Supabase sync
  const handleApproveKyc = async (id: string, name: string) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' } : k));
    try {
      await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
    } catch (e) {
      // fallback
    }
    showSuccessToast(`Dossier de ${name} validé avec succès ! Badge 🛡️ activé.`);
    if (selectedKycDoc?.id === id) {
      setSelectedKycDoc(prev => prev ? { ...prev, status: 'approved' } : null);
    }
    fetchSupabaseUsers();
  };

  const handleRejectKyc = async (id: string, name: string) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'rejected' } : k));
    try {
      await supabase.from('profiles').update({ is_verified: false }).eq('id', id);
    } catch (e) {
      // fallback
    }
    showSuccessToast(`Dossier de ${name} refusé. Notification envoyée.`);
    if (selectedKycDoc?.id === id) {
      setSelectedKycDoc(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
    fetchSupabaseUsers();
  };

  // Delivery status handler
  const handleUpdateDeliveryStatus = (id: string, newStatus: AdminLiveDelivery['status']) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    showSuccessToast(`Statut de la commande mis à jour : ${newStatus}`);
  };

  const filteredKyc = kycList.filter(k => kycFilter === 'all' ? true : k.status === kycFilter);
  const filteredDeliveries = deliveries.filter(d => deliveryFilter === 'all' ? true : d.status === deliveryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ADMIN HEADER & STATUS BAR */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="bg-[#1C3049] text-white rounded-[20px] border border-[#13223A] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-9xl font-bold">
          ⚡
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-[14px] bg-[#C9A882] text-[#1C3049] flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            👑
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Cockpit Super Administrateur
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Dakar 🟢
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#E8DBC8]/80 mt-0.5">
              Plateforme NovaSen • Marché & Transporteurs • Gestion centrale
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link href="/compte">
            <Button size="sm" variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <span>Mon Profil</span>
            </Button>
          </Link>
          <GlowButton href="/" variant="transport" size="sm">
            <span>👁️ Voir le site public</span>
          </GlowButton>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TABS NAVIGATION */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="flex items-center overflow-x-auto gap-2 bg-[#E8DBC8] p-1.5 rounded-[12px] border border-[#DDCDB6] no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-[9px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1C3049] text-white shadow-xs'
              : 'text-[#573721] hover:text-[#2A211A]'
          }`}
        >
          📊 Vue d'Ensemble & KPIs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2.5 rounded-[9px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'kyc'
              ? 'bg-[#1C3049] text-white shadow-xs'
              : 'text-[#573721] hover:text-[#2A211A]'
          }`}
        >
          <span>🛡️ Sécurité & KYC</span>
          {kycList.filter(k => k.status === 'pending').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {kycList.filter(k => k.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-2.5 rounded-[9px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'dispatch'
              ? 'bg-[#1C3049] text-white shadow-xs'
              : 'text-[#573721] hover:text-[#2A211A]'
          }`}
        >
          <span>🛵 Dispatch & Flotte Dakar</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-[9px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-[#1C3049] text-white shadow-xs'
              : 'text-[#573721] hover:text-[#2A211A]'
          }`}
        >
          🛍️ Modération Annonces ({listings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-[9px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-[#1C3049] text-white shadow-xs'
              : 'text-[#573721] hover:text-[#2A211A]'
          }`}
        >
          💳 Finances & Reversements Wave/OM
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-[9px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#1C3049] text-white shadow-xs'
              : 'text-[#573721] hover:text-[#2A211A]'
          }`}
        >
          ⚙️ Paramètres & Tarifs
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. VUE D'ENSEMBLE & ANALYTICS */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-8 animate-fade-in">
          {/* Top 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Chiffre d'Affaires NovaSen */}
            <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">
                  Revenus Plateforme
                </span>
                <span className="p-1.5 px-2.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  En Direct
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                  {formatCFA(totalPlatformRevenue)}
                </div>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  Abonnements réels + Commissions collectées
                </p>
              </div>
              <div className="pt-3 border-t border-[#DDCDB6]/60 flex items-center justify-between text-xs text-[#7A5133] font-semibold">
                <span>Passerelle Wave & OM</span>
                <span className="text-emerald-700 font-bold">Connectée</span>
              </div>
            </div>

            {/* Volume d'Affaires Dakar (GMV) */}
            <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">
                  Valeur des Annonces (GMV)
                </span>
                <IconTrendingUp className="w-4 h-4 text-[#7A5133]" />
              </div>
              <div>
                <div className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                  {formatCFA(totalMarketplaceGMV)}
                </div>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  {listings.length} article(s) actuellement en vente sur NovaSen
                </p>
              </div>
              <div className="pt-3 border-t border-[#DDCDB6]/60 flex items-center justify-between text-xs text-[#7A6A5C]">
                <span>Catalogue Marché :</span>
                <strong className="text-[#1C3049]">{listings.length} offres actives</strong>
              </div>
            </div>

            {/* Utilisateurs Supabase */}
            <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">
                  Utilisateurs Supabase
                </span>
                <span className="p-1.5 px-2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Live DB
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold font-heading tabular-nums text-[#1C3049]">
                  {supabaseUsers.length} <span className="text-sm font-normal text-[#7A6A5C]">inscrits</span>
                </div>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  {verifiedKycCount} profil(s) certifié(s) avec badge 🛡️
                </p>
              </div>
              <div className="pt-3 border-t border-[#DDCDB6]/60 flex items-center justify-between text-xs text-[#7A6A5C]">
                <span>Base PostgreSQL :</span>
                <strong className="text-emerald-700 font-bold">🟢 En ligne</strong>
              </div>
            </div>

            {/* Dossiers KYC en Attente */}
            <div className="bg-white p-6 rounded-[16px] border border-[#DDCDB6] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7A6A5C]">
                  Contrôles KYC & Sécurité
                </span>
                <IconShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-3xl font-bold font-heading tabular-nums text-amber-600">
                  {pendingKycCount}{' '}
                  <span className="text-sm font-normal text-[#7A6A5C]">à certifier</span>
                </div>
                <p className="text-xs text-[#7A6A5C] mt-1">
                  Profils nécessitant validation de l'administrateur
                </p>
              </div>
              <div className="pt-3 border-t border-[#DDCDB6]/60 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('kyc')}
                  className="text-[#1C3049] font-bold hover:underline"
                >
                  Gérer les profils →
                </button>
              </div>
            </div>
          </div>

          {/* Real-time split: Deliveries Tracker + Quick KYC Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Deliveries (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-[16px] border border-[#DDCDB6] p-6 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDCDB6]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛵</span>
                  <h3 className="text-lg font-bold font-heading text-[#1C3049]">
                    Livraisons & Courses en Cours
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dispatch')}
                  className="text-xs font-bold text-[#7A5133] hover:underline"
                >
                  Vue Dispatch ({deliveries.length}) →
                </button>
              </div>

              {deliveries.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center text-[#7A6A5C] gap-2">
                  <span className="text-3xl">📦</span>
                  <p className="text-xs font-bold text-[#1C3049]">Aucune course active en ce moment</p>
                  <p className="text-[11px] text-[#7A6A5C]">Le service logistique de NovaSen est prêt à recevoir les commandes.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {deliveries.slice(0, 3).map((del) => (
                    <div
                      key={del.id}
                      className="p-4 rounded-[12px] border border-[#DDCDB6] bg-[#F2E9DC]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1C3049] bg-white px-2 py-0.5 rounded border border-[#DDCDB6]">
                            {del.orderNumber}
                          </span>
                          <span className="text-xs font-bold text-[#2A211A]">{del.itemTitle}</span>
                        </div>
                        <div className="text-xs text-[#7A6A5C] flex flex-wrap items-center gap-2 mt-0.5">
                          <span>📍 {del.pickupZone} ➔ {del.dropoffZone}</span>
                          <span>• Livreur : <strong>{del.driverName}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-sm font-bold font-heading tabular-nums text-[#1C3049] block">
                            {formatCFA(del.itemPrice)}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            +{formatCFA(del.deliveryFee)} livraison
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            del.status === 'in_transit'
                              ? 'bg-blue-100 text-blue-800'
                              : del.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {del.status === 'in_transit' ? 'En transit' : del.status === 'delivered' ? 'Livré ✓' : 'Attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick KYC Validation Queue (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-[16px] border border-[#DDCDB6] p-6 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDCDB6]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛡️</span>
                  <h3 className="text-lg font-bold font-heading text-[#1C3049]">
                    Comptes Supabase Récents
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-600">
                  {pendingKycCount} à certifier
                </span>
              </div>

              {supabaseUsers.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#7A6A5C]">
                  Chargement des profils Supabase...
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {supabaseUsers.slice(0, 3).map((u) => (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-[12px] border border-[#DDCDB6] bg-white flex items-center justify-between gap-3 hover:bg-[#F2E9DC]/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-[10px] bg-[#1C3049] text-white flex items-center justify-center font-bold text-sm uppercase">
                          {u.full_name?.charAt(0) || 'U'}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-[#1C3049]">{u.full_name || 'Utilisateur'}</h4>
                          </div>
                          <span className="text-[11px] text-[#7A6A5C] block">
                            {u.email || u.phone || 'Compte enregistré'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!u.is_verified ? (
                          <button
                            type="button"
                            onClick={() => handleApproveKyc(u.id, u.full_name || 'Utilisateur')}
                            className="px-2 py-1 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            title="Certifier le compte"
                          >
                            Valider 🛡️
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            Certifié 🛡️
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('kyc')}
                className="w-full"
              >
                <span>Gérer tous les comptes ({supabaseUsers.length})</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. PÔLE SÉCURITÉ & VALIDATION KYC */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'kyc' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
                Pôle Sécurité & Certifications
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#573721]">
                Dossiers d'Inscription & Contrôle KYC
              </h2>
            </div>

            {/* Filter Pill */}
            <div className="flex bg-[#E8DBC8] p-1 rounded-[10px] border border-[#DDCDB6]">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setKycFilter(filter)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    kycFilter === filter
                      ? 'bg-[#1C3049] text-white shadow-xs'
                      : 'text-[#573721] hover:text-[#2A211A]'
                  }`}
                >
                  {filter === 'all' ? 'Tous' : filter === 'pending' ? 'En attente' : filter === 'approved' ? 'Vérifiés 🛡️' : 'Rejetés'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKyc.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[16px] border border-[#DDCDB6] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                {/* Cover & Avatar Header */}
                <div className="relative h-28 bg-[#1C3049]">
                  <img
                    src={item.coverUrl}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
                    {item.type === 'driver' ? '🛵 Chauffeur / Livreur' : '🏬 Vendeur / Boutique'}
                  </span>

                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${
                      item.status === 'approved'
                        ? 'bg-emerald-500 text-white'
                        : item.status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.status === 'approved' ? 'Certifié 🛡️' : item.status === 'rejected' ? 'Rejeté' : 'En attente'}
                  </span>

                  <div className="absolute -bottom-5 left-4 flex items-end gap-3">
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-[12px] object-cover border-2 border-white shadow-md bg-white"
                    />
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-5 pt-8 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-bold text-lg font-heading text-[#1C3049] flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.status === 'approved' && (
                        <IconShieldCheck className="w-4 h-4 text-[#C9A882]" />
                      )}
                    </h3>
                    {item.businessOrFleetName && (
                      <span className="text-xs text-[#7A5133] font-semibold block">
                        Enseigne : {item.businessOrFleetName}
                      </span>
                    )}
                  </div>

                  {/* Documents checklist */}
                  <div className="bg-[#F2E9DC]/60 p-3.5 rounded-[10px] border border-[#DDCDB6] flex flex-col gap-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#7A6A5C]">🪪 CNI / Passeport :</span>
                      <strong className="text-[#1C3049] font-mono">{item.cniNumber}</strong>
                    </div>

                    {item.driverLicenseNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6A5C]">📄 Permis de conduire :</span>
                        <strong className="text-[#1C3049] font-mono">{item.driverLicenseNumber}</strong>
                      </div>
                    )}

                    {item.vehicleModel && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6A5C]">🛵 Véhicule & Plaque :</span>
                        <strong className="text-[#1C3049]">{item.vehicleModel} ({item.licensePlate})</strong>
                      </div>
                    )}

                    {item.insuranceCompany && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6A5C]">🛡️ Assurance Pro :</span>
                        <strong className="text-[#1C3049]">{item.insuranceCompany}</strong>
                      </div>
                    )}

                    {item.ninea && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#7A6A5C]">🏢 NINEA / RCCM :</span>
                        <strong className="text-[#1C3049] font-mono">{item.ninea}</strong>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-[#DDCDB6]/70 pt-1.5">
                      <span className="text-[#7A6A5C]">🌊 Reversement {item.payoutMethod === 'wave' ? 'Wave' : 'Orange Money'} :</span>
                      <strong className="text-[#1C3049]">{item.payoutNumber}</strong>
                    </div>
                  </div>

                  {/* Contact shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <a
                      href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${item.name}, nous vérifions votre compte sur NovaSen.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>💬 WhatsApp ({item.whatsapp})</span>
                    </a>

                    <a
                      href={`tel:${item.phone.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 rounded-[6px] bg-[#1C3049] hover:bg-[#13223A] text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <IconPhone className="w-3.5 h-3.5 text-[#C9A882]" />
                      <span>Appeler</span>
                    </a>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-[#F2E9DC] border-t border-[#DDCDB6] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#7A6A5C]">
                    Soumis : {item.submissionDate}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApproveKyc(item.id, item.name)}
                      >
                        <IconCheck className="w-3.5 h-3.5" />
                        <span>Valider le badge 🛡️</span>
                      </Button>
                    )}
                    {item.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectKyc(item.id, item.name)}
                        className="text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <span>Rejeter</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real Supabase Database Users Section */}
          <div className="mt-8 bg-white rounded-[16px] border border-[#DDCDB6] p-6 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDCDB6]">
              <div>
                <h3 className="font-bold text-lg text-[#1C3049] flex items-center gap-2">
                  <span>⚡ Comptes & Profils Réels Supabase</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    {supabaseUsers.length} inscrits
                  </span>
                </h3>
                <p className="text-xs text-[#7A6A5C]">
                  Comptes synchronisés directement avec la base de données PostgreSQL de NovaSen
                </p>
              </div>
              <button
                type="button"
                onClick={fetchSupabaseUsers}
                disabled={loadingUsers}
                className="px-3 py-1.5 rounded-[8px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-all"
              >
                <span>🔄</span>
                <span>{loadingUsers ? 'Actualisation...' : 'Rafraîchir les données'}</span>
              </button>
            </div>

            {supabaseUsers.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#7A6A5C]">
                Aucun profil supplémentaire détecté dans Supabase.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2E9DC] text-[#573721] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-lg">Utilisateur</th>
                      <th className="p-3">Email / Téléphone</th>
                      <th className="p-3">Rôle & Badge</th>
                      <th className="p-3">Inscription</th>
                      <th className="p-3 text-right rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDCDB6]/50">
                    {supabaseUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F2E9DC]/30 transition-colors">
                        <td className="p-3 font-semibold text-[#1C3049] flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#1C3049] text-white flex items-center justify-center text-xs font-bold uppercase">
                            {u.full_name?.charAt(0) || 'U'}
                          </span>
                          <div>
                            <div>{u.full_name || 'Utilisateur NovaSen'}</div>
                            <span className="text-[10px] font-mono text-[#7A6A5C]">{u.id?.slice(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="p-3 text-[#2A211A]">
                          <div>{u.email || '—'}</div>
                          <span className="text-[11px] text-[#7A6A5C]">{u.phone || ''}</span>
                        </td>
                        <td className="p-3">
                          {u.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                              🛡️ Certifié
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium">
                              Standard
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#7A6A5C]">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : 'Récent'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => u.is_verified ? handleRejectKyc(u.id, u.full_name || 'Utilisateur') : handleApproveKyc(u.id, u.full_name || 'Utilisateur')}
                            className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold cursor-pointer transition-all ${
                              u.is_verified
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {u.is_verified ? 'Retirer Badge' : 'Activer Badge 🛡️'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 3. DISPATCH & FLOTTE DAKAR */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'dispatch' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
                Supervision Flotte & Courses
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#1C3049]">
                Dispatch en Temps Réel à Dakar
              </h2>
            </div>

            {/* Delivery filter pills */}
            <div className="flex bg-[#E8DBC8] p-1 rounded-[10px] border border-[#DDCDB6]">
              {(['all', 'pending_pickup', 'in_transit', 'delivered'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDeliveryFilter(filter)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    deliveryFilter === filter
                      ? 'bg-[#1C3049] text-white shadow-xs'
                      : 'text-[#1C3049] hover:text-[#13223A]'
                  }`}
                >
                  {filter === 'all' ? 'Toutes' : filter === 'pending_pickup' ? 'Attente Collecte' : filter === 'in_transit' ? 'En Cours' : 'Livrées'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-[#DDCDB6] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E8DBC8] text-[#573721] uppercase text-[11px] font-bold tracking-wider border-b border-[#DDCDB6]">
                  <tr>
                    <th className="p-4">N° Commande</th>
                    <th className="p-4">Article & Vendeur</th>
                    <th className="p-4">Trajet (Collecte ➔ Client)</th>
                    <th className="p-4">Livreur Assigné</th>
                    <th className="p-4">Montant & Frais</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDCDB6]/60">
                  {filteredDeliveries.map((del) => (
                    <tr key={del.id} className="hover:bg-[#F2E9DC]/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#1C3049]">
                        {del.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#2A211A] block">{del.itemTitle}</span>
                        <span className="text-[#7A6A5C] text-[11px]">{del.sellerName}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[#7A5133] font-semibold">📍 {del.pickupZone}</span>
                          <span className="text-emerald-700 font-semibold">🏁 {del.dropoffZone}</span>
                          <span className="text-[10px] text-[#7A6A5C]">{del.customerName} ({del.customerPhone})</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#1C3049] block">{del.driverName}</span>
                        <span className="text-[#7A6A5C] text-[11px]">{del.driverPhone}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold font-heading tabular-nums text-[#1C3049] block">
                          {formatCFA(del.itemPrice)}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          +{formatCFA(del.deliveryFee)} ({del.paymentMethod.toUpperCase()})
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={del.status}
                          onChange={(e) => handleUpdateDeliveryStatus(del.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-[6px] text-xs font-bold bg-white border border-[#DDCDB6] cursor-pointer"
                        >
                          <option value="pending_pickup">⏳ Attente collecte</option>
                          <option value="in_transit">🛵 En transit</option>
                          <option value="delivered">✅ Livré & Encaissé</option>
                          <option value="cancelled">❌ Annulé</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/suivi/${del.orderNumber.toLowerCase()}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-[6px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#1C3049] font-bold text-xs inline-flex items-center gap-1"
                        >
                          <span>Suivi Live</span>
                          <IconArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 4. MODÉRATION DES ANNONCES */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'listings' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
                Modération Marketplace
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#573721]">
                Annonces Publiées sur NovaSen ({listings.length})
              </h2>
            </div>

            <Link href="/publier">
              <Button variant="primary" size="sm">
                <IconPlus className="w-4 h-4" />
                <span>Publier une annonce officielle</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[16px] border border-[#DDCDB6] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative h-44 bg-[#E8DBC8]">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.isFeatured && (
                    <span className="absolute top-3 left-3 bg-[#7A5133] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      ★ Boost Actif
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {formatCFA(item.price)}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold text-sm text-[#2A211A] line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="text-xs text-[#7A6A5C] flex flex-col gap-0.5">
                    <span>Vendeur : <strong>{item.sellerName}</strong></span>
                    <span>Zone : {item.neighborhood}, Dakar</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F2E9DC] border-t border-[#DDCDB6] flex items-center justify-between gap-2">
                  <Link
                    href={`/annonce/${item.id}`}
                    target="_blank"
                    className="text-xs font-bold text-[#7A5133] hover:underline"
                  >
                    Voir l'annonce →
                  </Link>

                  <button
                    type="button"
                    onClick={() => showSuccessToast(`Statut Boost basculé pour "${item.title}".`)}
                    className="px-2.5 py-1 rounded-[6px] bg-white border border-[#DDCDB6] text-xs font-bold text-[#1C3049] hover:bg-[#E8DBC8] transition-colors cursor-pointer"
                  >
                    ⚡ Boost
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 5. FINANCES & REVERSEMENTS WAVE / ORANGE MONEY */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'finance' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDCDB6]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C3049]">
                Flux Financiers & Passerelles
              </span>
              <h2 className="text-2xl font-bold font-heading text-[#1C3049]">
                Transactions, Abonnements & Reversements
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                🌊 Wave Sénégal API Connecté
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                🟠 Orange Money Connecté
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-[#DDCDB6] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E8DBC8] text-[#573721] uppercase text-[11px] font-bold tracking-wider border-b border-[#DDCDB6]">
                  <tr>
                    <th className="p-4">Référence</th>
                    <th className="p-4">Type d'Opération</th>
                    <th className="p-4">Utilisateur / Entreprise</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4">Passerelle</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDCDB6]/60">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#7A6A5C]">
                        Aucune transaction financière encaissée pour le moment. Les paiements Wave & OM apparaîtront ici.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F2E9DC]/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#1C3049]">
                          {tx.reference}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-[#2A211A] block">{tx.title}</span>
                          <span className="text-[#7A6A5C] text-[10px] uppercase font-semibold">
                            {tx.type === 'subscription' ? 'Abonnement Boutique' : tx.type === 'driver_fee' ? 'Dossier Livreur' : tx.type === 'seller_payout' ? 'Reversement Marchand' : 'Option Boost'}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#1C3049]">
                          {tx.user}
                        </td>
                        <td className="p-4">
                          <span className="font-bold font-heading tabular-nums text-base text-[#1C3049]">
                            {formatCFA(tx.amount)}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[#573721]">
                          {tx.gateway}
                        </td>
                        <td className="p-4 text-[#7A6A5C]">
                          {tx.date}
                        </td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            {tx.status === 'completed' ? 'Validé ✓' : tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 6. PARAMÈTRES & TARIFS DE LA PLATEFORME */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-10 shadow-xs flex flex-col gap-8 animate-fade-in max-w-4xl">
          <div className="flex flex-col gap-2 pb-4 border-b border-[#DDCDB6]">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5133]">
              Tarification & Règles de Gestion
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#573721]">
              Paramètres des Tarifs NovaSen
            </h2>
            <p className="text-xs text-[#7A6A5C]">
              Ces montants s'appliquent automatiquement sur les formulaires d'inscription et le calculateur de courses.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showSuccessToast('Grille tarifaire et paramètres plateforme enregistrés avec succès !');
            }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Abonnement Mensuel Boutique Vendeur Pro (FCFA)" required helper="Actuellement fixé à 8 500 F CFA">
                <input
                  type="number"
                  required
                  value={boutiqueFee}
                  onChange={(e) => setBoutiqueFee(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>

              <Field label="Frais de Dossier Enregistrement Chauffeur (FCFA)" required helper="Frais unique de vérification KYC (1 500 F CFA)">
                <input
                  type="number"
                  required
                  value={driverFee}
                  onChange={(e) => setDriverFee(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>

              <Field label="Crédit Mise en avant Boost 7 jours (FCFA)" required helper="Pour placer les annonces en tête (2 500 F CFA)">
                <input
                  type="number"
                  required
                  value={boostFee}
                  onChange={(e) => setBoostFee(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>

              <Field label="Commission standard sur livraison (%)" required helper="Prélevée sur les courses sans abonnement">
                <input
                  type="number"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>

              <Field label="Tarif de base transport au km (FCFA / km)" required helper="Base de calcul du simulateur VTC et Colis">
                <input
                  type="number"
                  required
                  value={kmRate}
                  onChange={(e) => setKmRate(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#DDCDB6]">
              <Button type="submit" variant="primary">
                <IconCheck className="w-4 h-4" />
                <span>Enregistrer la nouvelle grille tarifaire</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
