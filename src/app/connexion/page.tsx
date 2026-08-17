'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { IconShieldCheck } from '@/components/ui/Icons';

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

  const { signInWithIdentifier, sendOtpCode, verifyOtpCode, user } = useAuth();

  // Mode: 'signin' ou 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Étape de vérification de sécurité par code (OTP)
  const [otpStep, setOtpStep] = useState<'form' | 'verify'>('form');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Countdown timer pour renvoi de code
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-redirect si déjà connecté
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, router, redirectPath]);

  // Gestion des inputs OTP à 6 chiffres
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    const newCode = [...otpCode];

    if (cleanVal.length > 1) {
      // Si collé
      const pasted = cleanVal.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setOtpCode(newCode);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newCode[index] = cleanVal;
    setOtpCode(newCode);

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Soumission du formulaire initial (Connexion directe ou Déclenchement vérification Inscription)
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
        // Connexion sécurisée existante
        const { error } = await signInWithIdentifier(cleanIdentifier, password);
        if (error) {
          if (
            error.message?.includes('Invalid login credentials') ||
            error.message?.includes('invalid_grant')
          ) {
            setErrorMsg('Numéro/Email ou mot de passe incorrect. Avez-vous vérifié votre compte ?');
          } else {
            setErrorMsg(error.message || 'Erreur lors de la connexion.');
          }
        } else {
          setSuccessMsg('Connexion réussie ! Redirection...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 500);
        }
      } else {
        // Inscription avec VÉRIFICATION OBLIGATOIRE
        if (!fullName.trim() || fullName.trim().length < 3) {
          setErrorMsg('Veuillez entrer votre prénom et nom complet.');
          setLoading(false);
          return;
        }

        // Envoi du code de confirmation sécurisé
        const { error, isEmail, destination } = await sendOtpCode(cleanIdentifier);
        if (error) {
          setErrorMsg(error.message || "Impossible d'envoyer le code de vérification.");
        } else {
          setOtpStep('verify');
          setCountdown(60);
          setSuccessMsg(
            isEmail
              ? `🔒 Code de sécurité envoyé à : ${destination || cleanIdentifier}. Veuillez saisir les 6 chiffres.`
              : `🔒 Code de sécurité envoyé au : ${destination || cleanIdentifier}. Veuillez saisir les 6 chiffres.`
          );
          setTimeout(() => {
            otpInputRefs.current[0]?.focus();
          }, 150);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Validation du code OTP à 6 chiffres
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const token = otpCode.join('').trim();
    if (token.length < 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code reçu.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyOtpCode(
        identifier.trim(),
        token,
        fullName.trim(),
        password.trim()
      );

      if (error) {
        setErrorMsg('Code incorrect ou expiré. Veuillez vérifier et réessayer.');
      } else {
        setSuccessMsg('✓ Identité et compte certifiés avec succès ! Connexion...');
        setTimeout(() => {
          router.push(redirectPath);
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la vérification.');
    } finally {
      setLoading(false);
    }
  };

  // Si déjà connecté
  if (user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[#F8F6F0]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DBC8] p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#573721] font-heading mb-2">Compte Sécurisé & Actif</h2>
          <p className="text-sm text-[#7A6A5C] mb-6">
            Vous êtes connecté en toute sécurité sur NovaSen.
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

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* VOLET GAUCHE (50%) : FORMULAIRE SÉCURISÉ AVEC VÉRIFICATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-8 sm:py-12 bg-white z-10">
        {/* Top bar avec Logo */}
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

                {/* Bouton de Soumission */}
                <button
                  type="submit"
                  disabled={loading || (mode === 'signup' && !agreeTerms)}
                  className="w-full mt-2 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{mode === 'signin' ? 'Connexion en cours...' : 'Génération du code...'}</span>
                    </>
                  ) : mode === 'signin' ? (
                    'Se connecter'
                  ) : (
                    'Vérifier et Créer mon compte 🔒'
                  )}
                </button>
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
            /* ÉTAPE DE VÉRIFICATION DU CODE OTP (6 CHIFFRES) */
            /* ───────────────────────────────────────────────────────────── */
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 text-2xl font-black shadow-inner">
                  🔢
                </div>
                <h2 className="text-2xl font-extrabold text-[#1C1917] font-heading">
                  Vérification de sécurité
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] mt-2">
                  Un code à 6 chiffres a été envoyé pour certifier que vous êtes bien le propriétaire de :
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-[#FAF8F5] border border-[#E7E2D6] rounded-lg text-sm font-bold text-[#573721]">
                  {identifier}
                </div>
              </div>

              {/* Alertes d'état OTP */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-base leading-none">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
                  <span className="font-bold text-base leading-none">✓</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 6 Cases de saisie */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpCode.map((digit, idx) => (
                  <input
                    key={`otp-box-${idx}`}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black bg-[#FAF8F5] border-2 border-[#DDCDB6] rounded-xl text-[#573721] focus:bg-white focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/20 transition"
                  />
                ))}
              </div>

              {/* Bouton de validation OTP */}
              <button
                type="submit"
                disabled={loading || otpCode.join('').length < 6}
                className="w-full py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Certification en cours...</span>
                  </>
                ) : (
                  'Valider mon code et Activer mon compte ✓'
                )}
              </button>

              {/* Actions en bas */}
              <div className="flex items-center justify-between text-xs text-[#78716C] pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('form');
                    setOtpCode(['', '', '', '', '', '']);
                    setErrorMsg(null);
                  }}
                  className="hover:text-[#573721] hover:underline cursor-pointer"
                >
                  ← Modifier le numéro / email
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={handleSubmit}
                  className="font-bold text-[#7A5133] hover:text-[#573721] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {countdown > 0 ? `Renvoyer le code (${countdown}s)` : 'Renvoyer un nouveau code'}
                </button>
              </div>
            </form>
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
