'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { IconShieldCheck, IconMapPin, IconClock, IconCar, IconSmartphone } from '@/components/ui/Icons';

function calculatePasswordStrength(pass: string): { score: number; label: string; color: string } {
  if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 25, label: 'Faible', color: 'bg-red-500' };
  if (score === 2) return { score: 50, label: 'Moyen', color: 'bg-amber-500' };
  if (score === 3) return { score: 75, label: 'Fort', color: 'bg-emerald-500' };
  return { score: 100, label: 'Très sécurisé 🔒', color: 'bg-emerald-600' };
}

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/marche';

  const { signInWithIdentifier, signUpWithPhoneOrEmail, user } = useAuth();

  // Mode: 'signin' ou 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, router, redirectPath]);

  // Si déjà connecté
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F2E9DC]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#DDCDB6] p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#573721] font-heading mb-2">Vous êtes connecté !</h2>
          <p className="text-sm text-[#7A6A5C] mb-6">
            Bienvenue sur NovaSen. Votre session est active et sécurisée.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/marche"
              className="w-full py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition text-center shadow-md cursor-pointer"
            >
              Entrer sur le Marché 🛍️
            </Link>
            <Link
              href="/transport"
              className="w-full py-3.5 bg-[#1C3049] hover:bg-[#13223A] text-white font-bold rounded-xl transition text-center shadow-md cursor-pointer"
            >
              Accéder au Transport 🚗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone ou votre email.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        const { error } = await signInWithIdentifier(cleanIdentifier, password);
        if (error) {
          if (
            error.message?.includes('Invalid login credentials') ||
            error.message?.includes('invalid_grant')
          ) {
            setErrorMsg('Identifiant ou mot de passe incorrect.');
          } else {
            setErrorMsg(error.message || 'Erreur lors de la connexion.');
          }
        } else {
          setSuccessMsg('Connexion réussie ! Redirection en cours...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 500);
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Veuillez entrer votre nom complet (Prénom & Nom).');
          setLoading(false);
          return;
        }

        const { error } = await signUpWithPhoneOrEmail(cleanIdentifier, password, fullName.trim());
        if (error) {
          if (error.message?.includes('already registered')) {
            setErrorMsg('Ce compte existe déjà. Veuillez vous connecter.');
          } else {
            setErrorMsg(error.message || "Erreur lors de l'enregistrement.");
          }
        } else {
          setSuccessMsg('Compte créé avec succès ! Bienvenue sur NovaSen.');
          setTimeout(() => {
            router.push(redirectPath);
          }, 600);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF7F2]">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET GAUCHE : FORMULAIRE PRO & ÉPURÉ */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] xl:w-[45%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white shadow-2xl lg:shadow-none z-10">
        {/* Header / Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7A5133] to-[#573721] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#573721] tracking-tight font-heading">
                Nova<span className="text-[#7A5133]">Sen</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#7A6A5C]">
                Sénégal
              </span>
            </div>
          </Link>

          {/* Titre & Sous-titre */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A211A] tracking-tight font-heading">
              {mode === 'signin' ? 'Bon retour parmi nous 👋' : 'Créer votre compte 🚀'}
            </h1>
            <p className="text-sm text-[#7A6A5C] mt-2">
              {mode === 'signin'
                ? 'Saisissez vos identifiants pour accéder à vos commandes et annonces.'
                : 'Rejoignez le réseau national de commerce et de transport au Sénégal.'}
            </p>
          </div>

          {/* Switcher Mode Tabs (Inspiration 2/3 style) */}
          <div className="flex bg-[#F2E9DC]/70 p-1.5 rounded-2xl border border-[#DDCDB6] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#573721] shadow-sm'
                  : 'text-[#7A6A5C] hover:text-[#2A211A]'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#573721] shadow-sm'
                  : 'text-[#7A6A5C] hover:text-[#2A211A]'
              }`}
            >
              S&apos;inscrire
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <span className="font-bold text-base leading-none">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <span className="font-bold text-base leading-none">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulaire Unique */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom complet si Inscription */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#573721] mb-1.5">
                  Nom complet (Prénom & Nom)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Cheikh Ndiaye"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                  />
                </div>
              </div>
            )}

            {/* Email ou Téléphone */}
            <div>
              <label className="block text-xs font-bold text-[#573721] mb-1.5">
                Numéro de téléphone ou Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="77 000 12 34 ou contact@exemple.sn"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#573721]">
                  Mot de passe
                </label>
                {mode === 'signin' ? (
                  <button
                    type="button"
                    onClick={() => alert("Pour réinitialiser votre mot de passe, contactez l'assistance NovaSen via WhatsApp ou par email.")}
                    className="text-xs text-[#7A5133] hover:underline font-semibold cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                ) : (
                  password && (
                    <span className="text-[11px] font-bold text-[#573721]">
                      {passwordStrength.label}
                    </span>
                  )
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? 'Masquer' : 'Voir'}
                </button>
              </div>

              {/* Force du mot de passe */}
              {mode === 'signup' && password && (
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              )}
            </div>

            {/* Conditions si Inscription */}
            {mode === 'signup' && (
              <label className="flex items-start gap-2.5 text-xs text-[#7A6A5C] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-[#DDCDB6] text-[#7A5133] focus:ring-[#7A5133]"
                />
                <span>
                  J&apos;accepte les <Link href="/contact" className="text-[#7A5133] font-bold hover:underline">Conditions d&apos;utilisation</Link> et la politique de confidentialité de NovaSen.
                </span>
              </label>
            )}

            {/* Bouton de Soumission Principal */}
            <button
              type="submit"
              disabled={loading || (mode === 'signup' && !agreeTerms)}
              className="w-full mt-2 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Chargement sécurisé...</span>
                </>
              ) : mode === 'signin' ? (
                'Se connecter 🚀'
              ) : (
                'Créer mon compte 🚀'
              )}
            </button>
          </form>

          {/* Switch Footer */}
          <div className="mt-6 text-center text-xs text-[#7A6A5C]">
            {mode === 'signin' ? (
              <p>
                Vous n&apos;avez pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#7A5133] hover:underline cursor-pointer ml-1"
                >
                  Créer un compte
                </button>
              </p>
            ) : (
              <p>
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#7A5133] hover:underline cursor-pointer ml-1"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Pied de page Sécurité */}
        <div className="pt-6 border-t border-[#EFE5D6] flex items-center justify-between text-[11px] text-[#7A6A5C]">
          <div className="flex items-center gap-1.5">
            <IconShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sécurité SSL 256-bit Supabase</span>
          </div>
          <span className="font-semibold">NovaSen Sénégal 🇸🇳</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET DROIT : VITRINE PREMIUM (Inspiration 2 & 3 - Desktop) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#1C3049] via-[#142336] to-[#0A121C] text-white flex-col justify-between p-12 xl:p-16">
        {/* Glow ambient background effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7A5133]/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#204060]/30 blur-[130px] pointer-events-none" />

        {/* Top Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Réseau National • 14 Régions</span>
          </div>
          <span className="text-xs text-white/60">Teranga & Innovation</span>
        </div>

        {/* Main Editorial Hero Copy */}
        <div className="relative z-10 my-auto py-8">
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-black font-heading leading-tight tracking-tight text-white mb-4">
            Le carrefour du commerce et du transport au Sénégal.
          </h2>
          <p className="text-white/70 text-sm xl:text-base leading-relaxed max-w-lg mb-8">
            Achetez, vendez vos produits et réservez vos trajets et livraisons express en toute sérénité avec paiement sécurisé.
          </p>

          {/* Floating Showcase Cards (Inspiration style) */}
          <div className="space-y-3.5 max-w-md">
            {/* Card 1: Vente & Marché */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-xl hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#7A5133] text-white flex items-center justify-center text-lg shadow-md">
                  🛍️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">iPhone 15 Pro • Dakar</h4>
                  <p className="text-[11px] text-white/60">Vendeur certifié • Garanti</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-400">620 000 FCFA</span>
                <span className="block text-[10px] text-white/50">Wave validé ✓</span>
              </div>
            </div>

            {/* Card 2: Trajet & Transport */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-xl hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#1C3049] border border-white/20 text-white flex items-center justify-center text-lg shadow-md">
                  🚗
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Trajet Dakar ➔ Touba</h4>
                  <p className="text-[11px] text-white/60">Départ 14h30 • Chauffeur 4.9 ⭐</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-amber-300">5 000 FCFA / pl.</span>
                <span className="block text-[10px] text-white/50">Réservation directe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Partners / Badges */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white/80">Paiements acceptés :</span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] font-bold">Wave</span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] font-bold">Orange Money</span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] font-bold">Free Money</span>
          </div>
          <span className="text-[11px] text-white/50">© 2026 NovaSen</span>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F2E9DC] flex items-center justify-center text-[#7A6A5C]">
          Chargement...
        </div>
      }
    >
      <ConnexionContent />
    </Suspense>
  );
}
