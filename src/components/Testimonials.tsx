'use client';

import React from 'react';

export function Testimonials() {
  const REVIEWS = [
    {
      name: 'Awa Diallo',
      role: 'Boutique Awa Bazin • Médina, Dakar',
      avatar: '👩🏾',
      stars: 5,
      comment:
        '« Grâce aux livreurs NovaSen, je n’ai plus aucun problème d’impayés sur mes commandes de Bazin. Le coursier livre mes clientes aux Almadies ou à Pikine et me reverse le montant par Wave instantanément. »',
      badge: '🛡️ Vendeuse Vérifiée',
      date: 'Client vérifié',
    },
    {
      name: 'Modou Ndiaye',
      role: 'Chauffeur VTC & Livreur • Mermoz, Dakar',
      avatar: '👨🏾',
      stars: 5,
      comment:
        '« La formule flotte à 1 500 F CFA est imbattable à Dakar ! Dès mes premières courses, tous les gains me reviennent à 100%. Je combine transport de passagers le matin et livraison de colis l’après-midi. »',
      badge: '★ Chauffeur Flotte Or',
      date: 'Chauffeur certifié',
    },
    {
      name: 'Ibrahima Ba',
      role: 'Éleveur Ladoum & Agro • Rufisque, Dakar',
      avatar: '👨🏾‍🌾',
      stars: 5,
      comment:
        '« J’ai vendu mes béliers Ladoum en toute confiance grâce à la visibilité sur NovaSen. L’acheteur a pu vérifier le carnet vétérinaire et payer directement à la livraison. C’est la vraie Teranga moderne ! »',
      badge: '✓ Vendeur Certifié',
      date: 'Éleveur certifié',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 sm:py-16 border-t border-[#DDCDB6]">
      {/* Section Header */}
      <div className="text-center flex flex-col gap-3 mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DBC8] border border-[#DDCDB6] text-xs font-bold uppercase tracking-widest text-[#7A5133] mx-auto">
          <span>⭐ Avis & Témoignages Clients</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#2A211A] tracking-tight">
          Ce que disent nos commerçants & chauffeurs
        </h2>
        <p className="text-sm sm:text-base text-[#7A6A5C] leading-relaxed">
          Plus de 12 000 Dakarois achètent, vendent et se déplacent chaque jour en toute sérénité avec NovaSen.
        </p>
      </div>

      {/* 3 Testimonial Cards Aligned in One Perfect Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {REVIEWS.map((r, idx) => (
          <div
            key={`review-${idx}`}
            className="bg-white rounded-[20px] border border-[#DDCDB6] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-sm hover:shadow-md hover:border-[#7A5133] transition-all duration-300 relative group"
          >
            {/* Top Stars & Badge */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#DDCDB6]/50">
              <div className="flex text-amber-500 text-base">
                {'★'.repeat(r.stars)}
              </div>
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8DBC8] text-[#573721] border border-[#DDCDB6]">
                {r.badge}
              </span>
            </div>

            {/* Comment */}
            <p className="text-xs sm:text-sm text-[#4E3D30] italic leading-relaxed flex-1">
              {r.comment}
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#DDCDB6]/60">
              <div className="w-11 h-11 rounded-full bg-[#F2E9DC] border border-[#DDCDB6] flex items-center justify-center text-2xl shadow-xs shrink-0">
                {r.avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <strong className="text-sm font-bold text-[#2A211A] truncate">{r.name}</strong>
                <span className="text-[11px] text-[#7A6A5C] truncate">{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
