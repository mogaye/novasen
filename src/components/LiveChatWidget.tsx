'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GlowButton } from '@/components/ui/GlowButton';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'support';
  text: string;
  time: string;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Salam ! 👋 Bienvenue sur NovaSen. Que puis-je faire pour vous aujourd’hui ?',
      time: 'Maintenant',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    '📦 Comment publier une annonce ?',
    '🛵 Réserver un livreur ou VTC',
    '💳 Tarifs Wave & Orange Money',
    '🏢 Créer ma boutique certifiée',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Smart bot responses
    setTimeout(() => {
      let botReply = "Je suis à votre disposition ! Vous pouvez aussi joindre notre support direct par WhatsApp ou par téléphone 7j/7.";
      const lower = text.toLowerCase();

      if (lower.includes('publier') || lower.includes('annonce')) {
        botReply = "Pour publier, cliquez sur le bouton doré 'Publier une annonce' en haut à droite. Les 3 premières annonces sont 100% gratuites !";
      } else if (lower.includes('livreur') || lower.includes('vtc') || lower.includes('chauffeur') || lower.includes('course')) {
        botReply = "Vous pouvez estimer votre trajet en 1 clic dans l'onglet 'Transport & Colis' ou réserver directement un chauffeur certifié avec paiement Wave/OM à l'arrivée !";
      } else if (lower.includes('tarif') || lower.includes('wave') || lower.includes('orange') || lower.includes('prix')) {
        botReply = "La formule Boutique Pro est à 8 500 F CFA/mois et la formule Chauffeur Flotte est à 1 500 F CFA. Tous les paiements se font instantanément via Wave ou Orange Money.";
      } else if (lower.includes('boutique') || lower.includes('vendeur')) {
        botReply = "Vous pouvez activer votre vitrine boutique dans 'Devenir Vendeur Pro' pour obtenir votre bannière personnalisée, vos badges KYC et votre lien public partageable !";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[380px] h-[480px] sm:h-[520px] max-h-[75vh] bg-white rounded-[24px] shadow-2xl border border-[#DDCDB6] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1C3049] to-[#7A5133] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  🇸🇳
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white absolute bottom-0 right-0" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistance Opérateurs Dakar</h3>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span>En direct</span> • <span>7j/7</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="https://wa.me/221789139036"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs transition-colors"
                title="Contacter sur WhatsApp"
              >
                💬
              </a>
              <a
                href="tel:+221789139036"
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs transition-colors"
                title="Appeler le support"
              >
                📞
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Direct Link to /contact page */}
          <div className="bg-[#E8DBC8] px-3 py-1.5 text-[11px] text-[#573721] flex items-center justify-between border-b border-[#DDCDB6]">
            <span>Liaison directe avec notre équipe</span>
            <a href="/contact" className="font-bold text-[#1C3049] hover:underline flex items-center gap-0.5">
              <span>Page Contact</span> →
            </a>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-[#1C3049] text-white rounded-br-none'
                      : 'bg-white border border-[#DDCDB6] text-[#2A211A] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-[#DDCDB6] px-3 py-2 rounded-2xl w-fit text-xs text-stone-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A5133] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A5133] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A5133] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium ml-1">NovaSen écrit...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-white border-t border-[#DDCDB6]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 text-[11px] font-semibold bg-[#F2E9DC] hover:bg-[#E8DBC8] text-[#573721] px-2.5 py-1 rounded-full border border-[#DDCDB6] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#DDCDB6] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-3.5 py-2 rounded-full border border-[#DDCDB6] bg-[#FAF8F5] text-xs text-[#2A211A] focus:outline-none focus:ring-2 focus:ring-[#1C3049]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-[#1C3049] hover:bg-[#13223A] text-white flex items-center justify-center transition-all disabled:opacity-40"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button with Aaron Iker glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1C3049] hover:bg-[#13223A] text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#C9A882]/40"
      >
        <span className="text-xl">💬</span>
        <span className="text-xs font-bold hidden sm:inline">Besoin d'aide ?</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1" />
      </button>
    </div>
  );
}
