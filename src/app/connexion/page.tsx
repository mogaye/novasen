'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { IconShieldCheck } from '@/components/ui/Icons';

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
  return { score: 100, label: 'Très sécurisé', color: 'bg-emerald-600' };
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
      <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[#F8F6F0]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DBC8] p-8 text-center shadow-xl">
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
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET GAUCHE (50%) : FORMULAIRE ÉPURÉ INSPIRÉ DE FILLIANTA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-8 sm:py-12 bg-white z-10">
        {/* Top bar avec Logo / Bouton retour */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#7A5133] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <span className="text-2xl font-black text-[#573721] tracking-tight font-heading">
                Nova<span className="text-[#7A5133]">Sen</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#7A6A5C]">
                Sénégal
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#7A6A5C] hover:text-[#573721] transition"
          >
            ← Accueil
          </Link>
        </div>

        {/* Corps central du formulaire */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          {/* Titre & Sous-titre */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight font-heading">
              {mode === 'signin' ? 'Bon retour' : 'Créer un compte'}
            </h1>
            <p className="text-sm text-[#78716C] mt-2">
              {mode === 'signin'
                ? 'Bienvenue sur NovaSen - Connectez-vous à votre espace'
                : 'Rejoignez la plateforme n°1 d’achats, ventes et transport au Sénégal'}
            </p>
          </div>

          {/* Toggle minimaliste Se connecter / S'inscrire */}
          <div className="flex bg-[#F5F2EB] p-1 rounded-xl border border-[#E7E2D6] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#573721] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
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
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#573721] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              S&apos;inscrire
            </button>
          </div>

          {/* Alertes d'état */}
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

          {/* Formulaire Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom complet à l'inscription */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#44403C] mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Cheikh Ndiaye"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E7E2D6] rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                />
              </div>
            )}

            {/* Email ou Téléphone */}
            <div>
              <label className="block text-xs font-bold text-[#44403C] mb-1.5">
                Numéro de téléphone ou Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="77 000 12 34 ou contact@novasen.sn"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E7E2D6] rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#44403C]">
                  Mot de passe
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert("Pour réinitialiser votre mot de passe, contactez l'assistance NovaSen via WhatsApp ou par email.")}
                    className="text-xs text-[#7A5133] hover:underline font-semibold cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E7E2D6] rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 pr-14 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  {showPassword ? 'Masquer' : 'Voir'}
                </button>
              </div>

              {/* Force du mot de passe à l'inscription */}
              {mode === 'signup' && password && (
                <div className="mt-2">
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#78716C] mt-1">
                    <span>Sécurité</span>
                    <span className="font-semibold">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Conditions d'utilisation à l'inscription */}
            {mode === 'signup' && (
              <label className="flex items-start gap-2.5 text-xs text-[#78716C] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-[#DDCDB6] text-[#7A5133] focus:ring-[#7A5133]"
                />
                <span>
                  J&apos;accepte les <Link href="/contact" className="text-[#7A5133] font-bold hover:underline">Conditions d&apos;utilisation</Link> de NovaSen.
                </span>
              </label>
            )}

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={loading || (mode === 'signup' && !agreeTerms)}
              className="w-full mt-2 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : mode === 'signin' ? (
                'Se connecter'
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Lien pour basculer en bas */}
          <div className="mt-6 text-center text-xs text-[#78716C]">
            {mode === 'signin' ? (
              <p>
                Vous n&apos;avez pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#7A5133] hover:underline cursor-pointer"
                >
                  S&apos;inscrire
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
                  className="font-bold text-[#7A5133] hover:underline cursor-pointer"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer bas */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#A8A29E]">
          <div className="flex items-center gap-1.5">
            <IconShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sécurité vérifiée SSL</span>
          </div>
          <span>NovaSen Sénégal 🇸🇳</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET DROIT (50%) : VITRINE HAUT DE GAMME (INSPIRATION 2 & 3) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden bg-gradient-to-br from-[#112338] via-[#162D4A] to-[#0A1726] text-white flex-col justify-between p-12 xl:p-16">
        {/* Glow ambient background effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7A5133]/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#1C3049]/40 blur-[130px] pointer-events-none" />

        {/* Top Tag & Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>14 Régions du Sénégal connectées</span>
          </div>
          <span className="text-xs text-white/60">Teranga • Sécurité</span>
        </div>

        {/* Hero Editorial Heading */}
        <div className="relative z-10 my-auto py-6">
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-black font-heading leading-tight tracking-tight text-white mb-4 max-w-lg">
            Entrez dans le futur du commerce et de la mobilité, aujourd&apos;hui.
          </h2>
          <p className="text-white/70 text-xs xl:text-sm leading-relaxed max-w-md mb-8">
            Achetez, vendez et réservez vos transports partout au Sénégal sur une plateforme unifiée et sécurisée.
          </p>

          {/* MOCKUP FLOTTANT (Inspiration 3 / 2 style) */}
          <div className="relative max-w-md w-full">
            {/* Carte Blanche Principale */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900 border border-white/20">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#7A5133] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    N
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900">Solde & Transactions</h3>
                    <p className="text-[10px] text-gray-400">Compte NovaSen certifié</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  Actif ✓
                </span>
              </div>

              {/* Solde */}
              <div className="my-4">
                <span className="text-[11px] text-gray-400 font-medium">Solde disponible</span>
                <div className="text-2xl font-black text-gray-900 mt-0.5">
                  1 245 000 <span className="text-sm font-bold text-[#7A5133]">FCFA</span>
                </div>
              </div>

              {/* Mini Cartes de Services */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">Marché & Ventes</span>
                  <span className="text-xs font-bold text-emerald-600">+ 850 000 FCFA</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">Transport & Trajets</span>
                  <span className="text-xs font-bold text-[#1C3049]">18 Courses (5.0 ⭐)</span>
                </div>
              </div>
            </div>

            {/* Carte Flottante Pop-up (Paiement Wave) */}
            <div className="absolute -bottom-5 -right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-2xl border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                ✓
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-gray-900">Paiement reçu</p>
                <p className="text-[10px] text-emerald-600 font-bold">+ 45 000 FCFA • Wave Direct</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Partners / Badges */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/50">Paiements acceptés :</span>
            <span className="text-[11px] font-extrabold tracking-wide text-white/90">Wave</span>
            <span className="text-[11px] font-extrabold tracking-wide text-white/90">Orange Money</span>
            <span className="text-[11px] font-extrabold tracking-wide text-white/90">Free Money</span>
          </div>
          <span className="text-[10px] text-white/40">© 2026 NovaSen</span>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-[#78716C]">
          Chargement...
        </div>
      }
    >
      <ConnexionContent />
    </Suspense>
  );
}
