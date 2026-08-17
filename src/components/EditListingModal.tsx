'use client';

import React, { useState, useEffect } from 'react';
import { Listing, ZoneId, Condition } from '@/lib/types';
import { ZONES, SENEGAL_REGIONS } from '@/lib/zones';
import { Button } from '@/components/ui/Button';
import { IconX, IconCheck, IconPackage } from '@/components/ui/Icons';
import { formatCFA } from '@/lib/format';

interface EditListingModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSave: (listingId: string, updatedData: Partial<Listing>) => Promise<{ success: boolean; error?: string }>;
}

export function EditListingModal({ isOpen, listing, onClose, onSave }: EditListingModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [soldCount, setSoldCount] = useState<number>(0);
  const [condition, setCondition] = useState<Condition>('Bon état');
  const [zoneId, setZoneId] = useState<ZoneId>('plateau');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (listing) {
      setTitle(listing.title || '');
      setPrice(String(listing.price || ''));
      setQuantity(listing.quantity ?? 1);
      setSoldCount(listing.soldCount ?? 0);
      setCondition(listing.condition || 'Bon état');
      setZoneId((listing.zoneId as ZoneId) || 'plateau');
      setDescription(listing.description || '');
      setIsFeatured(listing.isFeatured || false);
      setErrorMsg(null);
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const availableStock = Math.max(0, quantity - soldCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const selectedZone = ZONES.find((z) => z.id === zoneId);

    const res = await onSave(listing.id, {
      title,
      price: Number(price) || 0,
      quantity: Math.max(1, Number(quantity) || 1),
      soldCount: Math.max(0, Number(soldCount) || 0),
      condition,
      zoneId,
      neighborhood: selectedZone?.name || listing.neighborhood,
      region: selectedZone?.region || listing.region || 'Dakar',
      description,
      isFeatured,
    });

    setSaving(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Erreur lors de la mise à jour de l’annonce.');
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-[8px] border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] font-medium placeholder-[#A89A8C] focus:outline-none focus:ring-2 focus:ring-[#7A5133] focus:border-transparent transition-all';
  const selectClass =
    'w-full px-3.5 py-2.5 rounded-[8px] border border-[#DDCDB6] bg-[#FAF8F5] text-sm text-[#2A211A] font-medium focus:outline-none focus:ring-2 focus:ring-[#7A5133] focus:border-transparent transition-all cursor-pointer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-[16px] border border-[#DDCDB6] shadow-2xl max-w-xl w-full my-8 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DDCDB6] bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-[8px] bg-[#E8DBC8] text-[#573721]">✏️</span>
            <div>
              <h2 className="font-bold font-heading text-lg text-[#573721]">
                Modifier l’annonce & Stock
              </h2>
              <p className="text-xs text-[#7A6A5C]">
                Mettez à jour le prix, les exemplaires en stock et la description.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A6A5C] hover:bg-[#E8DBC8] hover:text-[#573721] transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Status Pill */}
        <div className="px-6 pt-4">
          <div className="p-3 rounded-[8px] bg-[#FAF6F0] border border-[#DDCDB6] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <IconPackage className="w-4 h-4 text-[#7A5133]" />
              <span className="text-[#573721] font-semibold">Stock disponible actuel :</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                availableStock > 3
                  ? 'bg-emerald-100 text-emerald-800'
                  : availableStock > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {availableStock > 0
                ? `${availableStock} exemplaire(s) restant(s)`
                : 'Rupture de stock'}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[8px]">
              {errorMsg}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#573721] mb-1.5">
              Titre de l’annonce <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Ex: iPhone 13 Pro 128 Go Bleu..."
            />
          </div>

          {/* Price & Quantity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#573721] mb-1.5">
                Prix de vente (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
                placeholder="Ex: 350000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#573721] mb-1.5">
                Nombre total d'exemplaires (Stock) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-[6px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer border border-[#DDCDB6] shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  required
                  min="1"
                  max="9999"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`${inputClass} text-center font-bold text-base`}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-10 h-10 rounded-[6px] bg-[#E8DBC8] hover:bg-[#DDCDB6] text-[#573721] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer border border-[#DDCDB6] shrink-0"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Condition & Zone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#573721] mb-1.5">
                État de l’article
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className={selectClass}
              >
                <option value="Neuf">Neuf (dans l'emballage)</option>
                <option value="Comme neuf">Comme neuf</option>
                <option value="Bon état">Bon état</option>
                <option value="Pour pièces">Pour pièces / À réparer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#573721] mb-1.5">
                Localisation (Zone / Quartier)
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value as ZoneId)}
                className={selectClass}
              >
                {SENEGAL_REGIONS.map((reg) => {
                  const regZones = ZONES.filter((z) => z.region.toLowerCase() === reg.name.toLowerCase());
                  if (regZones.length === 0) return null;
                  return (
                    <optgroup key={`edit-reg-${reg.id}`} label={`${reg.badge} Région de ${reg.name}`}>
                      {regZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#573721] mb-1.5">
              Description détaillée
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Détails, caractéristiques, accessoires..."
            />
          </div>

          {/* Featured Toggle */}
          <div className="p-3 bg-[#FAF8F5] rounded-[8px] border border-[#DDCDB6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#573721] block">Mise en avant (Boost)</span>
              <span className="text-[0.72rem] text-[#7A6A5C]">Afficher en tête des recherches sur NovaSen</span>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-[#7A5133] rounded cursor-pointer accent-[#7A5133]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDCDB6]">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>Sauvegarder les modifications</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
