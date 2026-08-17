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

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [user, router, redirectPath]);

  // Si déjà connecté
  if (user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
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

  // Soumission du formulaire (Connexion ou Inscription classique)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Veuillez renseigner votre email ou votre numéro de téléphone.');
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
        // Connexion standard
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
        // Inscription standard
        if (!fullName.trim()) {
          setErrorMsg('Veuillez entrer votre nom complet (Prénom & Nom).');
          setLoading(false);
          return;
        }

        const { error } = await signUpWithPhoneOrEmail(cleanIdentifier, password, fullName.trim());
        if (error) {
          if (error.message?.includes('already registered')) {
            setErrorMsg('Ce numéro ou cet email est déjà inscrit. Veuillez vous connecter.');
          } else {
            setErrorMsg(error.message || "Erreur lors de l'enregistrement du compte.");
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-gradient-to-b from-[#F2E9DC] via-[#EFE5D6] to-[#E8DBC8]">
      {/* En-tête NovaSen */}
      <div className="max-w-md w-full text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DBC8] border border-[#DDCDB6] text-[#573721] text-xs font-bold mb-3 shadow-xs">
          <IconShieldCheck className="w-4 h-4 text-[#7A5133]" />
          <span>Accès Sécurisé • NovaSen Sénégal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#573721] font-heading">
          Nova<span className="text-[#7A5133]">Sen</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6A5C] mt-2 max-w-xs mx-auto">
          {mode === 'signin'
            ? 'Connectez-vous pour accéder à vos annonces et commandes.'
            : 'Rejoignez NovaSen et commencez à acheter et vendre partout au Sénégal.'}
        </p>
      </div>

      {/* Carte du Formulaire Normal */}
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#DDCDB6] p-6 sm:p-8 shadow-2xl">
        {/* Sélecteur Simple : Se connecter / Créer un compte */}
        <div className="flex bg-[#F2E9DC] p-1.5 rounded-2xl border border-[#DDCDB6] mb-6">
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
            Créer un compte
          </button>
        </div>

        {/* Messages d'erreur ou succès */}
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

        {/* Formulaire Normal Unique */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom complet (uniquement à l'inscription) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#573721] mb-1.5">
                Nom complet (Prénom & Nom) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Cheikh Ndiaye"
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
              />
            </div>
          )}

          {/* Email ou Téléphone */}
          <div>
            <label className="block text-xs font-semibold text-[#573721] mb-1.5">
              Numéro de téléphone ou Email *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ex: 77 000 12 34 ou contact@gmail.com"
              className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#573721]">
                Mot de passe *
              </label>
              {mode === 'signup' && password && (
                <span className="text-[11px] font-semibold text-[#573721]">
                  Niveau : {passwordStrength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 pr-14 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7A6A5C] hover:text-[#2A211A] cursor-pointer"
              >
                {showPassword ? 'Masquer' : 'Voir'}
              </button>
            </div>

            {/* Barre de force du mot de passe (à l'inscription) */}
            {mode === 'signup' && password && (
              <div className="w-full bg-[#EFE5D6] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
            )}
          </div>

          {/* Bouton Principal de Soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Chargement...</span>
              </>
            ) : mode === 'signin' ? (
              'Se connecter'
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        {/* Lien Bas de page pour basculer facilement */}
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
                className="font-bold text-[#7A5133] hover:underline cursor-pointer"
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
                className="font-bold text-[#7A5133] hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>

        {/* Footer Sécurité & Zones */}
        <div className="mt-6 pt-5 border-t border-[#EFE5D6] grid grid-cols-2 gap-2 text-center text-[11px] text-[#7A6A5C]">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Connexion Sécurisée</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>14 Régions du Sénégal</span>
          </div>
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
