import React from 'react';
import type { Metadata } from 'next';
import { ModernNixtioLanding } from '@/components/ModernNixtioLanding';

export const metadata: Metadata = {
  title: 'NovaSen • Découvrir la Plateforme N°1 au Sénégal',
  description: 'Le marché sénégalais au creux de votre main, livré en express. Achetez, vendez et faites transporter vos marchandises en toute confiance.',
};

export default function LandingPage() {
  return <ModernNixtioLanding />;
}
