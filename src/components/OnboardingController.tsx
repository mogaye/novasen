'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OnboardingModal } from './OnboardingModal';

export function OnboardingController() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Ne pas afficher sur la page connexion elle-même pour ne pas bloquer le formulaire
    if (pathname === '/connexion') {
      setIsOpen(false);
      return;
    }

    const forceOnboarding = searchParams?.get('onboarding') === 'true';
    const isDone = typeof window !== 'undefined' ? localStorage.getItem('novasen_onboarding_done') : 'true';

    // Si demandé explicitement OU si l'utilisateur est connecté pour la première fois sans avoir fait l'onboarding
    if (forceOnboarding || (user && !isDone)) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [user, pathname, searchParams]);

  const handleComplete = () => {
    setIsOpen(false);
  };

  return <OnboardingModal isOpen={isOpen} onComplete={handleComplete} />;
}
