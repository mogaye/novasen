'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
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

  const { signInWithIdentifier, signUpWithPhoneOrEmail, sendOtpCode, verifyOtpCode, user } = useAuth();

  // Auth Methods & Modes (Password is the default classic method)
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // OTP flow states
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpDestination, setOtpDestination] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-redirect if user logs in via email link
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, router, redirectPath]);

  // If already logged in
  if (user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl border border-[#DDCDB6] p-8 text-center shadow-xl">
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

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone ou votre adresse email.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Veuillez entrer votre nom complet.');
      return;
    }

    setLoading(true);
    try {
      const { error, destination } = await sendOtpCode(cleanIdentifier);
      if (error) {
        setErrorMsg(error.message || "Erreur lors de l'envoi du code de vérification.");
      } else {
        setOtpDestination(destination || cleanIdentifier);
        setOtpStep('verify');
        setCountdown(45);
        setSuccessMsg(`Code de sécurité envoyé à : ${cleanIdentifier}`);
        // Focus first OTP input box
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const token = otpCode.join('').trim();
    if (token.length < 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code de vérification.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await verifyOtpCode(identifier.trim(), token, fullName);
      if (error) {
        setErrorMsg(error.message || 'Code de vérification incorrect ou expiré.');
      } else {
        setSuccessMsg('Compte vérifié avec succès ! Connexion en cours...');
        setTimeout(() => {
          router.push(redirectPath);
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la validation du code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit typing
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    const newOtp = [...otpCode];
    newOtp[index] = cleanVal.slice(-1);
    setOtpCode(newOtp);

    // Auto-advance
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto submit if 6 digits are filled
    if (index === 5 && cleanVal) {
      const fullToken = [...newOtp.slice(0, 5), cleanVal.slice(-1)].join('');
      if (fullToken.length === 6) {
        setTimeout(() => {
          verifyOtpCode(identifier.trim(), fullToken, fullName).then(({ error }) => {
            if (error) {
              setErrorMsg(error.message || 'Code de vérification incorrect.');
            } else {
              setSuccessMsg('Code vérifié avec succès !');
              setTimeout(() => router.push(redirectPath), 500);
            }
          });
        }, 100);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtpCode(newOtp);
    if (pasted.length === 6) {
      otpInputRefs.current[5]?.focus();
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  // Handle Classic Password Login / Signup
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone ou votre adresse email.');
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
            setErrorMsg('Numéro / Email ou mot de passe incorrect.');
          } else {
            setErrorMsg(error.message || 'Erreur lors de la connexion.');
          }
        } else {
          setSuccessMsg('Connexion réussie ! Bienvenue sur NovaSen...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 500);
        }
      } else {
        // Sign Up
        if (!fullName.trim()) {
          setErrorMsg('Veuillez entrer votre nom complet.');
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
      {/* Brand Header */}
      <div className="max-w-md w-full text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DBC8] border border-[#DDCDB6] text-[#573721] text-xs font-bold mb-3 shadow-xs">
          <IconShieldCheck className="w-4 h-4 text-[#7A5133]" />
          <span>Accès Sécurisé • NovaSen Sénégal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#573721] font-heading">
          Nova<span className="text-[#7A5133]">Sen</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6A5C] mt-2 max-w-xs mx-auto">
          Plateforme nationale pour vos achats, ventes et livraisons partout au Sénégal.
        </p>
      </div>

      {/* Auth Card */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl border border-[#DDCDB6] p-6 sm:p-8 shadow-2xl">
        
        {/* Toggle Mode: Sign in vs Sign up */}
        <div className="flex bg-[#F2E9DC] p-1 rounded-2xl border border-[#DDCDB6] mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setOtpStep('request');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
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
              setOtpStep('request');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#573721] shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Method Toggle: Password (Default) vs OTP */}
        <div className="flex items-center justify-center gap-2 mb-5 p-1 bg-[#FAF6F0] rounded-xl border border-[#E8DBC8] text-[11px] font-semibold text-[#7A6A5C]">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'password'
                ? 'bg-[#7A5133] text-white font-bold shadow-xs'
                : 'hover:text-[#573721]'
            }`}
          >
            <span>🔑 Mot de passe (Classique)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setOtpStep('request');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'otp'
                ? 'bg-[#7A5133] text-white font-bold shadow-xs'
                : 'hover:text-[#573721]'
            }`}
          >
            <span>💬 Code sans mot de passe (OTP)</span>
          </button>
        </div>

        {/* Feedback messages */}
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

        {/* ───────────────────────────────────────────────────────────── */}
        {/* OPTION 1 : CODE DE VÉRIFICATION OTP */}
        {/* ───────────────────────────────────────────────────────────── */}
        {authMethod === 'otp' && (
          <div>
            {otpStep === 'request' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                    />
                  </div>
                )}

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
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                  />
                  <p className="text-[11px] text-[#7A6A5C] mt-1.5">
                    💡 Vous recevrez un code à 6 chiffres pour valider votre accès instantanément.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi du code...</span>
                    </>
                  ) : (
                    'Envoyer mon code de vérification 📨'
                  )}
                </button>
              </form>
            ) : (
              /* Étape 2 : Saisie du code OTP */
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#E8DBC8] text-[#7A5133] flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                    🔢
                  </div>
                  <h3 className="text-sm font-bold text-[#573721]">Saisissez le code de sécurité</h3>
                  <p className="text-xs text-[#7A6A5C] mt-1">
                    Entrez les 6 chiffres envoyés à <strong className="text-[#573721]">{identifier}</strong>
                  </p>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-2 sm:gap-2.5">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={`otp-${idx}`}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-extrabold bg-[#FAF7F2] border-2 border-[#DDCDB6] rounded-xl text-[#573721] focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/20 transition"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading || otpCode.join('').length < 6}
                  className="w-full py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Vérification...</span>
                    </>
                  ) : (
                    'Confirmer et entrer 🚀'
                  )}
                </button>

                {/* Resend & Change Identifier Footer */}
                <div className="flex items-center justify-between text-xs text-[#7A6A5C] pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('request');
                      setOtpCode(['', '', '', '', '', '']);
                    }}
                    className="hover:text-[#573721] hover:underline cursor-pointer"
                  >
                    ← Changer de numéro / email
                  </button>

                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={handleSendOtp}
                    className="font-bold text-[#7A5133] hover:text-[#573721] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {countdown > 0 ? `Renvoyer (${countdown}s)` : 'Renvoyer le code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* OPTION 2 : CONNEXION PAR MOT DE PASSE */}
        {/* ───────────────────────────────────────────────────────────── */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in">
            {/* Full Name only on Registration */}
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
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
                />
              </div>
            )}

            {/* Identifier: Phone Number or Email */}
            <div>
              <label className="block text-xs font-semibold text-[#573721] mb-1.5">
                Numéro de téléphone ou Email *
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: 70 590 87 25 ou contact@gmail.com"
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#573721]">
                  Mot de passe sécurisé *
                </label>
                {password && (
                  <span className="text-[11px] font-semibold text-[#573721]">
                    Sécurité : {passwordStrength.label}
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
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#DDCDB6] rounded-xl text-sm focus:outline-none focus:border-[#7A5133] focus:ring-2 focus:ring-[#7A5133]/15 pr-14 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7A6A5C] hover:text-[#2A211A] cursor-pointer"
                >
                  {showPassword ? 'Masquer' : 'Voir'}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="w-full bg-[#EFE5D6] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-[#7A5133] hover:bg-[#573721] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification sécurisée...</span>
                </>
              ) : mode === 'signin' ? (
                'Se connecter et entrer'
              ) : (
                'Créer mon compte et entrer'
              )}
            </button>
          </form>
        )}

        {/* Security & Features Footer */}
        <div className="mt-6 pt-5 border-t border-[#EFE5D6] grid grid-cols-2 gap-2 text-center text-[11px] text-[#7A6A5C]">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Accès vérifié Supabase</span>
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
