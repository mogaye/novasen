'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IconX, IconArrowRight, IconShieldCheck, IconPackage, IconCar } from './ui/Icons';
import { formatCFA } from '@/lib/format';

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller' | 'driver' | 'system';
  senderName: string;
  text: string;
  time: string;
  isOffer?: boolean;
  offerAmount?: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle?: string;
  listingPrice?: number;
  sellerName?: string;
  sellerZone?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  listingTitle = 'Article en vente',
  listingPrice = 35000,
  sellerName = 'Vendeur Certifié',
  sellerZone = 'Médina, Dakar',
}: ChatModalProps) {
  const [activeTab, setActiveTab] = useState<'seller' | 'driver'>('seller');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-sys-1',
      sender: 'system',
      senderName: 'Sécurité NovaSen',
      text: '🔒 Conversation sécurisée. Ne transférez jamais d’argent à l’avance : payez uniquement à la livraison par coursier NovaSen.',
      time: '12:00',
    },
    {
      id: 'msg-1',
      sender: 'seller',
      senderName: sellerName,
      text: `Salam aleykoum ! L’article « ${listingTitle} » est bien disponible. Vous êtes dans quel quartier pour convenir de la remise ou de la livraison ?`,
      time: '12:01',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const QUICK_REPLIES = [
    'Est-ce toujours disponible ?',
    'Le livreur peut-il passer aujourd’hui ?',
    'Je propose un achat immédiat',
    'Quel est votre dernier prix ?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      senderName: 'Vous (Acheteur)',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulate realistic seller / driver response after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Parfait ! Je prépare le colis. Notre livreur NovaSen peut passer le récupérer et vous l’apporter avec paiement Wave ou espèces à la réception.';
      if (text.includes('dernier prix') || text.includes('propose')) {
        replyText = `Je peux vous accorder une petite remise spéciale Teranga ! Si vous confirmez avec livraison NovaSen maintenant, c’est bon.`;
      } else if (text.includes('aujourd’hui')) {
        replyText = `Oui tout à fait, le coursier peut être chez vous dans environ 35 à 45 minutes !`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: activeTab === 'seller' ? 'seller' : 'driver',
          senderName: activeTab === 'seller' ? sellerName : 'Chauffeur Coursier NovaSen',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-[16px] border border-[#DDCDB6] shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Chat Top Header */}
        <div className="bg-[#1C3049] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#7A5133] text-white flex items-center justify-center text-lg font-bold border border-[#C9A882]">
                {activeTab === 'seller' ? '🛍️' : '🛵'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1C3049]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  {activeTab === 'seller' ? sellerName : 'Coursier Flotte NovaSen'}
                </h3>
                <span className="text-[0.65rem] px-1.5 py-0.5 rounded-[4px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  En ligne
                </span>
              </div>
              <p className="text-[0.7rem] text-[#C9A882] truncate max-w-[200px]">
                {activeTab === 'seller' ? `${sellerZone} • Vendeur vérifié` : 'Assigné à la course'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer le chat"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Product Context Banner */}
        <div className="bg-[#E8DBC8] px-4 py-2.5 border-b border-[#DDCDB6] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-[#573721] truncate">{listingTitle}</span>
          </div>
          <span className="font-bold tabular-nums text-sm text-[#1C3049] shrink-0">
            {formatCFA(listingPrice)}
          </span>
        </div>

        {/* Tab Selection (Vendeur / Livreur) */}
        <div className="grid grid-cols-2 bg-[#FAF6F0] p-1 border-b border-[#DDCDB6] text-xs font-bold text-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('seller')}
            className={`py-2 rounded-[6px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'seller'
                ? 'bg-white text-[#7A5133] shadow-xs border border-[#DDCDB6]'
                : 'text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            <span>🛍️ Vendeur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('driver')}
            className={`py-2 rounded-[6px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'driver'
                ? 'bg-[#1C3049] text-white shadow-xs'
                : 'text-[#7A6A5C] hover:text-[#2A211A]'
            }`}
          >
            <span>🛵 Chauffeur / Livreur</span>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#FAF6F0] flex flex-col gap-3 text-xs">
          {messages.map((m) => {
            if (m.sender === 'system') {
              return (
                <div
                  key={m.id}
                  className="bg-[#E8DBC8]/70 border border-[#DDCDB6] rounded-[8px] p-2.5 text-center text-[#573721] text-[0.72rem] leading-relaxed my-1 flex items-center justify-center gap-1.5"
                >
                  <IconShieldCheck className="w-4 h-4 text-[#7A5133] shrink-0" />
                  <span>{m.text}</span>
                </div>
              );
            }

            const isMe = m.sender === 'buyer';

            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[82%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <span className="text-[0.65rem] text-[#7A6A5C] px-1 mb-0.5">
                  {m.senderName} • {m.time}
                </span>
                <div
                  className={`p-3 rounded-[12px] leading-relaxed text-xs shadow-xs ${
                    isMe
                      ? 'bg-[#7A5133] text-white rounded-tr-none'
                      : m.sender === 'driver'
                      ? 'bg-[#1C3049] text-white rounded-tl-none'
                      : 'bg-white text-[#2A211A] border border-[#DDCDB6] rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="self-start flex items-center gap-1.5 bg-white border border-[#DDCDB6] px-3 py-2 rounded-[12px] text-[#7A6A5C] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A5133] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A5133] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A5133] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[0.7rem] font-medium ml-1">En train d’écrire...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Carousel */}
        <div className="px-3 py-1.5 bg-white border-t border-[#DDCDB6] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 select-none">
          {QUICK_REPLIES.map((qr, idx) => (
            <button
              key={`qr-${idx}`}
              type="button"
              onClick={() => handleSendMessage(qr)}
              className="px-2.5 py-1 rounded-full bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#573721] text-[0.68rem] font-bold whitespace-nowrap border border-[#DDCDB6] transition-colors cursor-pointer"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-[#DDCDB6] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-[#FAF6F0] border border-[#DDCDB6] rounded-[8px] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#7A5133]"
          />
          <button
            type="submit"
            className="bg-[#7A5133] hover:bg-[#573721] text-white font-bold px-4 py-2.5 rounded-[8px] text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Envoyer</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
