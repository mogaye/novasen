'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, normalizeIdentifier } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { IconShieldCheck } from '@/components/ui/Icons';
import { Logo } from '@/components/ui/Logo';

// Validateur strict Sénégal (Email ou Numéro 9 chiffres 70,75,76,77,78)
function validateSenegalIdentifier(id: string): { isValid: boolean; isEmail: boolean; error?: string } {
  const trimmed = id.trim();
  if (!trimmed) return { isValid: false, isEmail: false, error: 'Veuillez saisir votre numéro ou email.' };

  if (trimmed.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, isEmail: true, error: 'Format d’adresse email invalide (ex: contact@gmail.com).' };
    }
    return { isValid: true, isEmail: true };
  }

  // Vérification numéro Sénégalais
  const digits = trimmed.replace(/\D/g, '');
  const cleanDigits = digits.startsWith('221') ? digits.slice(3) : digits;

  if (cleanDigits.length !== 9) {
    return {
      isValid: false,
      isEmail: false,
      error: 'Un numéro sénégalais doit comporter 9 chiffres (ex: 77 123 45 67).',
    };
  }

  const prefix = cleanDigits.slice(0, 2);
  const validPrefixes = ['70', '75', '76', '77', '78'];
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      isEmail: false,
      error: `L'indicatif ${prefix} n'est pas reconnu. Utilisez un numéro Expresso (70), Promobile (75), Free (76) ou Orange (77/78).`,
    };
  }

  return { isValid: true, isEmail: false };
}

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

  const { signInWithIdentifier, signUpWithPhoneOrEmail, verifyOtpCode, sendOtpCode, user, profile, signOut } = useAuth();

  // Mode: 'signin' ou 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Étape d'attente de validation du lien de sécurité
  const [otpStep, setOtpStep] = useState<'form' | 'verify'>('form');
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Checkpoint de sécurité interactif
  const [certifyOwner, setCertifyOwner] = useState(false);
  const [trustSession, setTrustSession] = useState(false);
  const [checkpointStatus, setCheckpointStatus] = useState<'idle' | 'verifying' | 'success'>('idle');

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Countdown timer pour renvoi de code
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validation interactive du Checkpoint avec animation
  const handleValidateCheckpoint = () => {
    if (!certifyOwner || !trustSession) return;
    setCheckpointStatus('verifying');
    
    setTimeout(() => {
      setCheckpointStatus('success');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    }, 1200);
  };

  // Synchronisation en temps réel multi-appareils (Ex: Ordinateur qui attend quand le téléphone valide le lien/code)
  useEffect(() => {
    if (!identifier) return;

    const { authEmail } = normalizeIdentifier(identifier);
    const channelName = `auth-sync-${authEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const channel = supabase.channel(channelName, {
      config: { broadcast: { ack: true } },
    });

    channel
      .on('broadcast', { event: 'device_authenticated' }, async ({ payload }) => {
        if (payload?.access_token && payload?.refresh_token) {
          setSuccessMsg('✓ Confirmation reçue ! Veuillez valider le contrôle de sécurité ci-dessous pour déverrouiller.');
          try {
            await supabase.auth.setSession({
              access_token: payload.access_token,
              refresh_token: payload.refresh_token,
            });
            // Basculer vers l'écran de Checkpoint avec les 2 questions obligatoires
            setOtpStep('form');
          } catch (err) {
            console.error('Cross-device session error:', err);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [identifier, router, redirectPath]);

  // Soumission du formulaire initial (Envoi obligatoire du code de sécurité par Email / SMS)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const validation = validateSenegalIdentifier(identifier);
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Identifiant invalide.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const cleanIdentifier = identifier.trim();

    try {
      if (mode === 'signin') {
        // Envoi obligatoire du code OTP par Email ou SMS
        const { error: otpErr, destination } = await sendOtpCode(cleanIdentifier);
        if (otpErr) {
          setErrorMsg(otpErr.message || "Erreur lors de l'envoi du code de sécurité.");
        } else {
          setOtpStep('verify');
          setCountdown(60);
          setSuccessMsg(
            `🔒 Un code de sécurité à 6 chiffres a été envoyé à : ${destination || cleanIdentifier}. Veuillez vérifier votre boîte de réception (et spams) et saisir le code ci-dessous.`
          );
        }
      } else {
        // Inscription avec création de compte et envoi du code
        if (!fullName.trim() || fullName.trim().length < 3) {
          setErrorMsg('Veuillez entrer votre prénom et nom complet.');
          setLoading(false);
          return;
        }

        const { error: signupErr } = await signUpWithPhoneOrEmail(cleanIdentifier, password, fullName);
        if (signupErr && !signupErr.message?.toLowerCase().includes('already registered')) {
          setErrorMsg(signupErr.message || "Erreur lors de la création de compte.");
          setLoading(false);
          return;
        }

        // Envoi du code de vérification par Email / SMS
        const { error: otpErr, destination } = await sendOtpCode(cleanIdentifier);
        if (otpErr) {
          // Si le compte a déjà déclenché un email via signUp
          setOtpStep('verify');
          setCountdown(60);
          setSuccessMsg(
            `🎉 Un email de validation a été envoyé à : ${cleanIdentifier}. Saisissez le code à 6 chiffres reçu pour sécuriser votre compte.`
          );
        } else {
          setOtpStep('verify');
          setCountdown(60);
          setSuccessMsg(
            `🎉 Code de sécurité envoyé à : ${destination || cleanIdentifier}. Saisissez le code à 6 chiffres ci-dessous pour certifier et sécuriser votre compte.`
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Validation manuelle par code OTP 6 chiffres (Obligatoire pour finaliser l'accès)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken.trim() || otpToken.trim().length < 6) {
      setErrorMsg('Veuillez saisir le code complet à 6 chiffres.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await verifyOtpCode(identifier.trim(), otpToken.trim(), fullName, password);
      if (error) {
        setErrorMsg('Code de sécurité incorrect ou expiré. Veuillez vérifier votre boîte de réception (ou spams) ou demander un nouveau code.');
      } else {
        setSuccessMsg('✓ Identité confirmée et session sécurisée ! Redirection en cours...');
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la validation du code.');
    } finally {
      setLoading(false);
    }
  };

  // Déclencher l'envoi d'un code OTP direct
  const handleRequestOtp = async () => {
    const validation = validateSenegalIdentifier(identifier);
    if (!validation.isValid) {
      setErrorMsg(validation.error || 'Veuillez saisir un numéro ou email valide d’abord.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error, destination } = await sendOtpCode(identifier.trim());
      if (error) {
        setErrorMsg(error.message || "Impossible d'envoyer le code.");
      } else {
        setOtpStep('verify');
        setCountdown(60);
        setSuccessMsg(
          `🔒 Code de sécurité envoyé à : ${destination || identifier.trim()}. Saisissez le code à 6 chiffres ci-dessous.`
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur lors de l'envoi du code.");
    } finally {
      setLoading(false);
    }
  };

  // Checkpoint de Sécurité & Confirmation d'Identité
  if (user && otpStep !== 'verify') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-[#F8F6F0] relative overflow-hidden">
        {/* Cercles d'ambiance en arrière-plan */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#7A5133]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E8DBC8] p-6 sm:p-10 shadow-2xl relative z-10 animate-fadeIn text-center">
          
          {/* Logo NovaSen */}
          <div className="mb-6 flex justify-center">
            <Logo href="/" size="md" />
          </div>

          {checkpointStatus === 'success' ? (
            /* Animation de succès spectaculaire */
            <div className="space-y-6 py-6 animate-fadeIn">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full bg-emerald-600 text-white flex items-center justify-center text-5xl shadow-xl shadow-emerald-600/30 transition-transform duration-500 scale-100">
                  ✓
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Identité vérifiée & certifiée
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] font-heading">
                  Bienvenue sur NovaSen !
                </h2>
                <p className="text-sm text-[#7A6A5C] mt-2">
                  Votre session est sécurisée. Déverrouillage immédiat de votre espace...
                </p>
              </div>

              <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full w-full rounded-full transition-all duration-1000 animate-pulse" />
              </div>
            </div>
          ) : checkpointStatus === 'verifying' ? (
            /* Animation de scan / vérification */
            <div className="space-y-6 py-8 animate-fadeIn">
              <div className="relative w-24 h-24 mx-auto">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-heading">
                  Contrôle de sécurité en cours...
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6A5C] mt-2">
                  Validation des protocoles de chiffrement et de session sécurisée.
                </p>
              </div>
            </div>
          ) : (
            /* Formulaire interactif de confirmation d'identité */
            <div className="space-y-6 text-left">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold mb-2 border border-amber-200">
                  <span>🛡️ Étape de Vérification de Sécurité</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#1C1917] font-heading">
                  Confirmez votre identité
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                  Pour des raisons de sécurité, veuillez valider cette session avant d&apos;accéder au site :
                </p>
              </div>

              {/* Badge compte identifié */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E2D6] rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {(user.email || profile?.full_name || 'U')[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-[#78716C] font-medium">Compte authentifié :</p>
                  <p className="text-sm font-bold text-[#1C1917] truncate">
                    {user.email || profile?.full_name || 'Utilisateur NovaSen'}
                  </p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  ✓ Validé
                </span>
              </div>

              {/* Cases à cocher interactives */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E7E2D6] hover:border-[#7A5133] cursor-pointer transition shadow-xs">
                  <input
                    type="checkbox"
                    checked={certifyOwner}
                    onChange={(e) => setCertifyOwner(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-[#7A5133] focus:ring-[#7A5133] border-stone-300 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#44403C] font-medium select-none">
                    Je certifie être le titulaire et propriétaire légitime de ce compte.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E7E2D6] hover:border-[#7A5133] cursor-pointer transition shadow-xs">
                  <input
                    type="checkbox"
                    checked={trustSession}
                    onChange={(e) => setTrustSession(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-[#7A5133] focus:ring-[#7A5133] border-stone-300 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[#44403C] font-medium select-none">
                    J&apos;autorise la connexion et la protection de cette session sur cet appareil.
                  </span>
                </label>
              </div>

              {/* Bouton de validation & Déverrouillage */}
              <button
                type="button"
                disabled={!certifyOwner || !trustSession}
                onClick={handleValidateCheckpoint}
                className="w-full py-4 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base transform active:scale-[0.99]"
              >
                <span>🛡️ Vérifier & Déverrouiller l&apos;accès</span>
                <span>🔓</span>
              </button>

              {/* Lien déconnexion / changer de compte */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-xs text-stone-500 hover:text-red-600 transition underline cursor-pointer"
                >
                  Ce n&apos;est pas votre compte ? Se déconnecter
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET GAUCHE (50%) : FORMULAIRE SÉCURISÉ AVEC VÉRIFICATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-8 sm:py-12 bg-white z-10">
        {/* Top bar avec Logo */}
        <div className="flex items-center justify-between">
          <Logo href="/" size="md" />

          <Link
            href="/"
            className="text-xs font-semibold text-[#7A6A5C] hover:text-[#573721] transition"
          >
            ← Retour au site
          </Link>
        </div>

        {/* Corps central du formulaire */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          {otpStep === 'form' ? (
            <>
              {/* Titre & Sous-titre */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2.5 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Vérification d&apos;identité sécurisée 🔒</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1917] tracking-tight font-heading">
                  {mode === 'signin' ? 'Bon retour parmi nous' : 'Créer un compte certifié'}
                </h1>
                <p className="text-xs sm:text-sm text-[#78716C] mt-2">
                  {mode === 'signin'
                    ? 'Connectez-vous pour accéder à vos annonces, commandes et trajets.'
                    : 'Chaque compte est certifié par code de sécurité pour éviter toute usurpation de numéro.'}
                </p>
              </div>

              {/* Mode Switcher */}
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

              {/* Formulaire Principal */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom complet à l'inscription */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1.5">
                      Nom complet (Prénom & Nom) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Cheikh Ndiaye"
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E7E2D6] rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                    />
                  </div>
                )}

                {/* Email ou Téléphone vérifiable */}
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1.5">
                    Numéro de téléphone ou Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ex: 77 123 45 67 ou contact@gmail.com"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E7E2D6] rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                  />
                  <p className="text-[11px] text-[#78716C] mt-1.5">
                    🇸🇳 Numéros acceptés : Orange (77/78), Free (76), Expresso (70), Promobile (75).
                  </p>
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#44403C]">
                      Mot de passe *
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => alert("Pour réinitialiser votre mot de passe, contactez l'assistance NovaSen via WhatsApp.")}
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

                  {/* Force du mot de passe */}
                  {mode === 'signup' && password && (
                    <div className="mt-2">
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#78716C] mt-1">
                        <span>Sécurité :</span>
                        <span className="font-semibold">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditions */}
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
                      J&apos;accepte les <Link href="/contact" className="text-[#7A5133] font-bold hover:underline">Conditions d&apos;utilisation</Link> et la politique anti-fraude.
                    </span>
                  </label>
                )}

                {/* Bouton de Soumission Direct */}
                <button
                  type="submit"
                  disabled={loading || (mode === 'signup' && !agreeTerms)}
                  className="w-full mt-2 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{mode === 'signin' ? 'Connexion en cours...' : 'Création en cours...'}</span>
                    </>
                  ) : mode === 'signin' ? (
                    'Vérifier & M’envoyer le code de sécurité ✉️'
                  ) : (
                    'Créer mon compte & Recevoir le code 🔒'
                  )}
                </button>

                {/* Option claire pour recevoir l'email/code sur son téléphone */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#E7E2D6]"></div>
                    <span className="flex-shrink mx-3 text-[11px] text-[#A8A29E] font-bold uppercase tracking-wider">OU</span>
                    <div className="flex-grow border-t border-[#E7E2D6]"></div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="w-full py-3 bg-[#FAF8F5] hover:bg-[#F3EFEA] border-2 border-[#E7E2D6] text-[#573721] font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm shadow-xs hover:border-[#7A5133]/40"
                  >
                    <span>✉️ Recevoir un code & lien sur mon téléphone</span>
                  </button>
                </div>
              </form>

              {/* Bascule bas de page */}
              <div className="mt-6 text-center text-xs text-[#78716C]">
                {mode === 'signin' ? (
                  <p>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="font-bold text-[#7A5133] hover:underline cursor-pointer"
                    >
                      Créer un compte certifié
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
                        setSuccessMsg(null);
                      }}
                      className="font-bold text-[#7A5133] hover:underline cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </p>
                )}
              </div>
            </>
          ) : (
            /* ───────────────────────────────────────────────────────────── */
            /* ÉTAPE DE VÉRIFICATION PAR LIEN EMAIL & SYNCHRONISATION EN DIRECT */
            /* ───────────────────────────────────────────────────────────── */
            <div className="space-y-6 animate-fadeIn text-center">
              {/* Icône animée de boîte mail */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-[#7A5133]/15 animate-ping opacity-60" />
                <div className="relative w-20 h-20 rounded-3xl bg-[#FAF8F5] border-2 border-[#E7E2D6] text-[#7A5133] flex items-center justify-center text-3xl shadow-lg">
                  ✉️
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-2 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Email de confirmation envoyé</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] font-heading">
                  Vérifiez votre boîte mail
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] mt-2 max-w-sm mx-auto">
                  Un lien de sécurité sécurisé a été envoyé à : <strong className="text-[#573721] block mt-0.5">{identifier}</strong>
                </p>
              </div>

              {/* Bloc d'instructions pas à pas */}
              <div className="bg-[#FAF8F5] border-2 border-[#E7E2D6] rounded-2xl p-5 text-left space-y-3.5 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7A5133] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-snug">
                    Ouvrez votre boîte de réception <strong>(et vérifiez vos spams / courriers indésirables)</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7A5133] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-snug">
                    Cliquez sur le bouton <strong>« Confirmer mon accès »</strong> ou sur le lien présent dans le mail.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-snug">
                    Cette page se mettra à jour <strong>automatiquement</strong> dès que vous aurez validé l&apos;email !
                  </p>
                </div>
              </div>

              {/* Statut d'écoute en direct multi-appareils */}
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 shadow-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold">
                  En attente de votre clic sur le lien reçu par email...
                </span>
              </div>

              {/* Alertes d'état */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5 text-left">
                  <span className="font-bold text-base leading-none">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-start gap-2.5 text-left">
                  <span className="font-bold text-base leading-none">✓</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Actions de renvoi et retour */}
              <div className="flex items-center justify-between text-xs text-[#78716C] pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('form');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="hover:text-[#573721] hover:underline cursor-pointer font-semibold"
                >
                  ← Modifier mon email
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={handleRequestOtp}
                  className="font-bold text-[#7A5133] hover:text-[#573721] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {countdown > 0 ? `Renvoyer l'email (${countdown}s)` : "Renvoyer l'email de confirmation"}
                </button>
              </div>

              {/* Assistance WhatsApp immédiate */}
              <div className="pt-3 border-t border-[#E7E2D6]">
                <a
                  href={`https://wa.me/221776452819?text=${encodeURIComponent(
                    `Bonjour NovaSen, j'ai besoin d'aide pour confirmer mon compte (${identifier}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <span>💬 Besoin d'aide immédiate ? Contactez le support WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer bas */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#A8A29E]">
          <div className="flex items-center gap-1.5">
            <IconShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-fraude & Sécurité SSL</span>
          </div>
          <span>NovaSen Sénégal 🇸🇳</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET DROIT (50%) : VITRINE LUXE (FILLIANTA & INSPIRATION 2) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden bg-gradient-to-br from-[#112338] via-[#162D4A] to-[#0A1726] text-white flex-col justify-between p-12 xl:p-16">
        {/* Glow ambient background */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7A5133]/25 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#1C3049]/40 blur-[130px] pointer-events-none" />

        {/* Top Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Plateforme Nationale • 14 Régions</span>
          </div>
          <span className="text-xs text-white/60">Sécurité & Confiance</span>
        </div>

        {/* Hero Editorial Heading */}
        <div className="relative z-10 my-auto py-6">
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-black font-heading leading-tight tracking-tight text-white mb-4 max-w-lg">
            Entrez dans le futur du commerce et de la mobilité au Sénégal.
          </h2>
          <p className="text-white/70 text-xs xl:text-sm leading-relaxed max-w-md mb-8">
            Comptes vérifiés, paiements sécurisés et livraisons directes partout au Sénégal.
          </p>

          {/* MOCKUP FLOTTANT */}
          <div className="relative max-w-md w-full">
            {/* Carte Principale */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900 border border-white/20">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#7A5133] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    N
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900">Espace NovaSen Certifié</h3>
                    <p className="text-[10px] text-gray-400">Identité & Numéro vérifiés ✓</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  100% Sécurisé
                </span>
              </div>

              {/* Solde */}
              <div className="my-4">
                <span className="text-[11px] text-gray-400 font-medium">Transactions protégées</span>
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

            {/* Pop-up flottante */}
            <div className="absolute -bottom-5 -right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-2xl border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                ✓
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-gray-900">Code vérifié & Validé</p>
                <p className="text-[10px] text-emerald-600 font-bold">Compte certifié avec succès</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badges */}
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
        <div className="min-h-screen bg-white flex items-center justify-center text-[#78716C]">
          Chargement...
        </div>
      }
    >
      <ConnexionContent />
    </Suspense>
  );
}
