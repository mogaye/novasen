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
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5]">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET GAUCHE : FORMULAIRE ÉPURÉ (INSPIRATION STYLE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 bg-white z-10">
        <div>
          {/* Logo NovaSen */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A5133] to-[#573721] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
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
              className="text-xs text-[#7A6A5C] hover:text-[#573721] font-medium flex items-center gap-1 transition"
            >
              <span>← Retour au site</span>
            </Link>
          </div>

          {/* Titre & Sous-titre */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2A211A] tracking-tight font-heading">
              {mode === 'signin' ? 'Bon retour parmi nous' : 'Commencez dès maintenant'}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6A5C] mt-2">
              {mode === 'signin'
                ? 'Saisissez vos identifiants pour accéder à votre espace.'
                : 'Rejoignez des milliers de vendeurs, acheteurs et transporteurs au Sénégal.'}
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex bg-[#F4EDE2] p-1 rounded-xl border border-[#E8DBC8] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#573721] shadow-xs'
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
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#573721] shadow-xs'
                  : 'text-[#7A6A5C] hover:text-[#2A211A]'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5 animate-fadeIn">
              <span className="font-bold text-base leading-none">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-start gap-2.5 animate-fadeIn">
              <span className="font-bold text-base leading-none">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom complet à l'inscription */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#573721] mb-1.5">
                  Nom complet (Prénom & Nom)
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Cheikh Ndiaye"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                />
              </div>
            )}

            {/* Email ou Téléphone */}
            <div>
              <label className="block text-xs font-bold text-[#573721] mb-1.5">
                Numéro de téléphone ou Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: 77 000 12 34 ou contact@exemple.sn"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#573721]">
                  Mot de passe
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert("Pour réinitialiser votre mot de passe, contactez le support NovaSen via WhatsApp ou par email.")}
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
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#DDCDB6] rounded-xl text-sm text-[#2A211A] placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 pr-14 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7A6A5C] hover:text-[#2A211A] cursor-pointer"
                >
                  {showPassword ? 'Masquer' : 'Voir'}
                </button>
              </div>

              {/* Jauge de mot de passe à l'inscription */}
              {mode === 'signup' && password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#7A6A5C] mb-1">
                    <span>Force du mot de passe :</span>
                    <span className="text-[#573721]">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
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
                  J&apos;accepte les <Link href="/contact" className="text-[#7A5133] font-bold hover:underline">Conditions Générales</Link> de NovaSen.
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
                  <span>Vérification...</span>
                </>
              ) : mode === 'signin' ? (
                'Se connecter'
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Lien bascule bas de formulaire */}
          <div className="mt-6 text-center text-xs text-[#7A6A5C]">
            {mode === 'signin' ? (
              <p>
                Vous n&apos;avez pas de compte ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#7A5133] hover:underline cursor-pointer"
                >
                  S&apos;inscrire gratuitement
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

        {/* Footer Sécurité & Badges */}
        <div className="pt-6 mt-8 border-t border-[#EFE5D6] flex items-center justify-between text-[11px] text-[#7A6A5C]">
          <div className="flex items-center gap-1.5">
            <IconShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sécurité SSL 256-bit</span>
          </div>
          <span>NovaSen Sénégal 🇸🇳</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET DROIT : MOCKUP DASHBOARD DYNAMIQUE (INSPIRATION 2 STYLE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#1C3049] via-[#142336] to-[#0A121C] text-white flex-col justify-between p-10 xl:p-14">
        {/* Glow ambient background effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#7A5133]/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#204060]/30 blur-[130px] pointer-events-none" />

        {/* Top Tag & Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Écosystème National Sénégalais</span>
          </div>
          <span className="text-xs text-white/60">14 Régions connectées</span>
        </div>

        {/* Hero Copy & Mockup Container */}
        <div className="relative z-10 my-auto py-6">
          <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-black font-heading leading-tight tracking-tight text-white mb-3 max-w-lg">
            La solution la plus simple pour votre commerce et transport au Sénégal.
          </h2>
          <p className="text-white/70 text-xs xl:text-sm leading-relaxed max-w-md mb-6">
            Gérez vos annonces de vente, suivez vos livraisons express et réservez vos trajets en direct.
          </p>

          {/* DASHBOARD MOCKUP (Exact Inspiration 2 Style) */}
          <div className="relative max-w-lg w-full">
            {/* Main Mockup Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-5 text-gray-900 border border-gray-100">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold text-gray-500 ml-2">Aperçu NovaSen Pro</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  En direct • 100% Actif
                </span>
              </div>

              {/* Stat Widgets Row */}
              <div className="grid grid-cols-2 gap-3 my-3.5">
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE5D6]">
                  <span className="text-[10px] text-gray-500 font-semibold block">Ventes & Commandes</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-base font-extrabold text-[#573721]">845 000 F</span>
                    <span className="text-[10px] text-emerald-600 font-bold">+24%</span>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE5D6]">
                  <span className="text-[10px] text-gray-500 font-semibold block">Courses & Trajets</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-base font-extrabold text-[#1C3049]">18 Trajets</span>
                    <span className="text-[10px] text-emerald-600 font-bold">5.0 ⭐</span>
                  </div>
                </div>
              </div>

              {/* Mini Activity Table */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Dernières Activités
                </div>

                {/* Item 1 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100/80 transition text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#7A5133]/15 text-[#7A5133] flex items-center justify-center font-bold text-xs">
                      🛍️
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-[11px]">iPhone 15 Pro Max • Dakar</p>
                      <p className="text-[9px] text-gray-400">Acheteur : Moussa Sow</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Payé Wave ✓
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100/80 transition text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1C3049]/15 text-[#1C3049] flex items-center justify-center font-bold text-xs">
                      🚗
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-[11px]">Dakar ➔ Saint-Louis (3 pl.)</p>
                      <p className="text-[9px] text-gray-400">Chauffeur : Ibrahima Diallo</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Confirmé
                  </span>
                </div>
              </div>
            </div>

            {/* Overlaid Floating Mini Card (Inspiration 2 popup effect) */}
            <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-2xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                ✓
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-gray-800">Paiement reçu avec succès</p>
                <p className="text-[10px] text-emerald-600 font-bold">+ 45 000 FCFA • Wave Instantané</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Partner Logos (Inspiration 2 footer style) */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/50">Moyens acceptés :</span>
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
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#7A6A5C]">
          Chargement...
        </div>
      }
    >
      <ConnexionContent />
    </Suspense>
  );
}
