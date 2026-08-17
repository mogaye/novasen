'use client';

import React, { useState } from 'react';
import { ReviewItem } from '@/lib/types';
import { INITIAL_REVIEWS } from '@/lib/mockReviews';

interface ReviewsSectionProps {
  targetId: string;
  targetName: string;
  targetType: 'driver' | 'seller';
  themeColor?: string;
}

export function ReviewsSection({
  targetId,
  targetName,
  targetType,
  themeColor = '#7A5133',
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const existing = INITIAL_REVIEWS.filter(
      (r) => r.targetId === targetId || r.targetId === targetName
    );
    if (existing.length > 0) return existing;
    return [
      {
        id: `rev-default-${targetId}`,
        targetId,
        authorName: 'Client Vérifié NovaSen (Dakar)',
        rating: 5,
        comment: `Excellent service avec ${targetName}, transaction sécurisée et très rapide !`,
        date: 'Récemment',
        verifiedBuyer: true,
      },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-user-${Date.now()}`,
      targetId,
      authorName: newAuthor.trim(),
      rating: newRating,
      comment: newComment.trim(),
      date: 'À l’instant',
      verifiedBuyer: true,
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    setShowForm(false);
    setSubmittedMessage('Votre avis vérifié a été publié avec succès ! Merci de votre confiance.');
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#DDCDB6] p-6 sm:p-8 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDCDB6]/70">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2A211A] flex items-center gap-2">
            <span>⭐</span>
            <span>Avis & Évaluations Clients</span>
          </h2>
          <p className="text-sm text-[#6E5949] mt-1">
            Retours d’expérience vérifiés par NovaSen Trust & Safety
          </p>
        </div>

        {/* Global Rating & Add Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#F2E9DC] px-4 py-2 rounded-xl border border-[#DDCDB6]">
            <span className="text-2xl font-black text-[#1C3049]">{averageRating}</span>
            <div className="flex flex-col">
              <div className="flex text-amber-500 text-sm">
                {'★'.repeat(Math.round(Number(averageRating)))}
                {'☆'.repeat(5 - Math.round(Number(averageRating)))}
              </div>
              <span className="text-[11px] font-bold text-[#6E5949]">
                {reviews.length} avis vérifié{reviews.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            {showForm ? 'Fermer' : '✍️ Donner mon avis'}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {submittedMessage && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <span className="text-lg">✅</span>
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 p-6 rounded-2xl bg-[#F8F5F0] border-2 border-dashed border-[#DDCDB6] space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#2A211A] text-base">
              Laisser une évaluation pour {targetName}
            </h3>
            {/* Interactive Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`text-2xl transition-transform hover:scale-125 ${
                    star <= newRating ? 'text-amber-500' : 'text-stone-300'
                  }`}
                  title={`${star} étoile(s)`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#573721] uppercase mb-1">
                Votre Nom & Quartier à Dakar
              </label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Ex: Ibrahima Ndiaye (Almadies)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDCDB6] bg-white text-sm text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#7A5133]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#573721] uppercase mb-1">
                Expérience
              </label>
              <div className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-[#DDCDB6] text-xs font-semibold text-[#1C3049]">
                <span>🛡️ Acheteur / Passager vérifié</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#573721] uppercase mb-1">
              Votre commentaire
            </label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Racontez votre expérience : ponctualité, qualité de l'article, amabilité..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDCDB6] bg-white text-sm text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#7A5133]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-300 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95"
              style={{ backgroundColor: themeColor }}
            >
              Publier mon avis vérifié
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="mt-6 space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#DDCDB6]/70 hover:border-[#DDCDB6] transition-all flex flex-col gap-2"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2A211A] text-sm sm:text-base">
                  {rev.authorName}
                </span>
                {rev.verifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    <span>✓</span>
                    <span>Vérifié</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500 text-xs">
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>
                <span className="text-xs text-stone-500">{rev.date}</span>
              </div>
            </div>
            <p className="text-sm text-[#4E3D30] leading-relaxed italic">
              « {rev.comment} »
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
