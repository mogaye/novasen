'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ConnexionPage from '@/app/connexion/page';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // If auth is checking session on startup
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2E9DC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-1 text-3xl font-bold font-heading text-[#573721]">
            <span>Nova</span>
            <span className="text-[#7A5133]">Sen</span>
          </div>
          <div className="w-8 h-8 border-3 border-[#7A5133]/20 border-t-[#7A5133] rounded-full animate-spin" />
          <p className="text-xs text-[#7A6A5C] tracking-wide font-medium">
            Vérification de la session sécurisée...
          </p>
        </div>
      </div>
    );
  }

  // Allow public browsing for landing page, home page, and public catalog/info pages
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/landing' ||
    pathname === '/connexion' ||
    pathname.startsWith('/marche') ||
    pathname.startsWith('/transport') ||
    pathname.startsWith('/tarifs') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/annonce') ||
    pathname.startsWith('/boutique');

  // If user is NOT authenticated and trying to access a private route, show Connexion gateway
  if (!user && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#F2E9DC]">
        <ConnexionPage />
      </div>
    );
  }

  // Allow access
  return <>{children}</>;
}
