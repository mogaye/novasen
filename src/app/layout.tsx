import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Archivo, Public_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { AuthGate } from '@/components/AuthGate';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LiveChatWidget } from '@/components/LiveChatWidget';
import { OnboardingController } from '@/components/OnboardingController';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NovaSen • Marché & Logistique de Transport au Sénégal',
  description:
    'La plateforme sénégalaise réunissant les petites annonces et le transport à la demande : achetez, vendez et faites livrer vos marchandises avec paiement à la livraison dans tout le Sénégal (Dakar, Thiès, Touba, Saint-Louis, Mbour, Ziguinchor et toutes les régions).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-service="market" className={`${archivo.variable} ${publicSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-[#F2E9DC] text-[#2A211A]">
        <AuthProvider>
          <AuthGate>
            <AppProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <LiveChatWidget />
              <Suspense fallback={null}>
                <OnboardingController />
              </Suspense>
            </AppProvider>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
