import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Archivo, Public_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { AuthGate } from '@/components/AuthGate';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LiveChatWidget } from '@/components/LiveChatWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';
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

export const viewport: Viewport = {
  themeColor: '#7A5133',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://novasen.sn'),
  title: {
    default: 'NovaSen • Marché & Logistique de Transport au Sénégal',
    template: '%s | NovaSen Sénégal',
  },
  description:
    'La plateforme sénégalaise réunissant les petites annonces et le transport à la demande : achetez, vendez et faites livrer vos marchandises avec paiement sécurisé (Wave, Orange Money, Cash) dans tout le Sénégal (Dakar, Thiès, Touba, Saint-Louis, Mbour, Ziguinchor et les 14 régions).',
  keywords: [
    'NovaSen',
    'Sénégal',
    'Dakar',
    'Petites annonces Sénégal',
    'Livraison express Dakar',
    'VTC Dakar',
    'Transport Sénégal',
    'Wave',
    'Orange Money',
    'PayDunya Sénégal',
    'Commerce Dakar',
  ],
  authors: [{ name: 'NovaSen Technologies SN' }],
  creator: 'NovaSen SN',
  publisher: 'NovaSen Technologies S.A.R.L',
  applicationName: 'NovaSen',
  generator: 'Next.js',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: 'https://novasen.sn',
    siteName: 'NovaSen Sénégal',
    title: 'NovaSen • Marché & Logistique de Transport au Sénégal',
    description:
      'Achetez, vendez et faites livrer à Dakar et dans tout le Sénégal avec paiement Wave, Orange Money et Cash à la livraison.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'NovaSen Sénégal - Marché et Transport Express',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaSen • Marché & Logistique de Transport au Sénégal',
    description: 'La 1ère plateforme intégrant marché et livraison express au Sénégal.',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-novasen',
  },
  alternates: {
    canonical: 'https://novasen.sn',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NovaSen Technologies',
  url: 'https://novasen.sn',
  logo: 'https://novasen.sn/logo.png',
  description: 'Plateforme technologique de petites annonces et de logistique de transport au Sénégal.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dakar',
    addressLocality: 'Dakar',
    addressRegion: 'Dakar',
    addressCountry: 'SN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+221-78-913-90-36',
    contactType: 'customer service',
    areaServed: 'SN',
    availableLanguage: ['French', 'Wolof'],
  },
  sameAs: [
    'https://facebook.com/novasen',
    'https://instagram.com/novasen.sn',
    'https://linkedin.com/company/novasen-sn',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-service="market" className={`${archivo.variable} ${publicSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#F2E9DC] text-[#2A211A]">
        <AuthProvider>
          <AuthGate>
            <AppProvider>
              <Header />
              <main className="flex-1 pb-16 lg:pb-0">{children}</main>
              <Footer />
              <LiveChatWidget />
              <MobileBottomNav />
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
