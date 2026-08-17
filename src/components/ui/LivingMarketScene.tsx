'use client';

import React, { useEffect, useRef } from 'react';

interface LivingMarketSceneProps {
  isActive: boolean;
}

export function LivingMarketScene({ isActive }: LivingMarketSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Pedestrians walking in the alleyway
    const walkers = [
      { x: 50, y: 340, speed: 1.2, dir: 1, scale: 0.85, color: '#F59E0B', boubou: 38, leg: 0, bag: true },
      { x: 280, y: 360, speed: 0.9, dir: -1, scale: 0.95, color: '#0284C7', boubou: 42, leg: 2, bag: false },
      { x: 480, y: 330, speed: 1.4, dir: 1, scale: 0.75, color: '#10B981', boubou: 34, leg: 4, bag: true },
      { x: 680, y: 375, speed: 1.0, dir: -1, scale: 1.05, color: '#E2E8F0', boubou: 45, leg: 1, bag: true },
      { x: 860, y: 320, speed: 1.1, dir: -1, scale: 0.7, color: '#DC2626', boubou: 30, leg: 3, bag: false },
    ];

    let time = 0;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      time += 0.05;
      const speedMult = isActive ? 1.4 : 0.6;

      // ─────────────────────────────────────────────────────────────
      // 1. ANIMATED PEDESTRIANS WALKING IN THE STREET
      // ─────────────────────────────────────────────────────────────
      walkers.forEach((w) => {
        w.x += w.speed * w.dir * speedMult;
        w.leg += 0.16 * speedMult;

        // Wrap around alley
        if (w.dir === 1 && w.x > width + 50) w.x = -50;
        if (w.dir === -1 && w.x < -50) w.x = width + 50;

        const s = w.scale * Math.max(0.65, height / 650);
        // Base ground level around bottom 35% of the screen
        const groundY = height * 0.75 + (w.y % 60);

        ctx.save();
        ctx.translate(w.x, groundY);

        const legSwing = Math.sin(w.leg) * 9 * s;
        const bob = Math.abs(Math.cos(w.leg)) * 2 * s;

        // Shadow on ground
        ctx.fillStyle = 'rgba(20, 10, 5, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 2 * s, 14 * s, 4 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Walking Legs
        ctx.fillStyle = '#2A1B0E';
        ctx.beginPath();
        ctx.roundRect(-3 * s - legSwing * 0.5, -12 * s, 3.5 * s, 13 * s, 1.5 * s);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(1.5 * s + legSwing * 0.5, -12 * s, 3.5 * s, 13 * s, 1.5 * s);
        ctx.fill();

        // Flowing Boubou
        ctx.fillStyle = w.color;
        ctx.beginPath();
        ctx.moveTo(-9 * s, -w.boubou * s - bob);
        ctx.lineTo(9 * s, -w.boubou * s - bob);
        ctx.lineTo(12 * s + legSwing * 0.2, -3 * s);
        ctx.lineTo(-12 * s - legSwing * 0.2, -3 * s);
        ctx.closePath();
        ctx.fill();

        // Head and Headdress
        ctx.fillStyle = '#1A0F08';
        ctx.beginPath();
        ctx.arc(0, -w.boubou * s - 8 * s - bob, 5 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = w.color;
        ctx.beginPath();
        ctx.arc(0, -w.boubou * s - 11 * s - bob, 4.5 * s, 0, Math.PI);
        ctx.fill();

        // Arm and Shopping Bag
        const armSwing = -legSwing * 0.6;
        ctx.fillStyle = '#1A0F08';
        ctx.beginPath();
        ctx.roundRect(6 * s * w.dir + armSwing, -w.boubou * s + 10 * s - bob, 2.5 * s, 14 * s, 1 * s);
        ctx.fill();

        if (w.bag) {
          ctx.fillStyle = '#C9A882';
          ctx.strokeStyle = '#7A5133';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(5 * s * w.dir + armSwing, -w.boubou * s + 20 * s - bob, 7 * s, 9 * s, 1.5 * s);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      });

      // ─────────────────────────────────────────────────────────────
      // 2. WARM GLOWING LANTERNS & STORE SCREENS
      // ─────────────────────────────────────────────────────────────
      // Smartphone screen glints on the left table
      for (let i = 0; i < 4; i++) {
        const px = width * (0.08 + i * 0.05);
        const py = height * 0.62;
        const pulse = (Math.sin(time * 3 + i * 1.2) + 1) * 0.5;

        const screenGlow = ctx.createRadialGradient(px, py, 1, px, py, 12);
        screenGlow.addColorStop(0, `rgba(186, 230, 253, ${0.5 + pulse * 0.5})`);
        screenGlow.addColorStop(1, 'rgba(186, 230, 253, 0)');
        ctx.fillStyle = screenGlow;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hanging lights along the top arch
      for (let j = 0; j < 7; j++) {
        const bx = width * (0.65 + j * 0.05);
        const by = height * (0.04 + j * 0.015) + Math.sin(time + j) * 1.5;
        const bPulse = Math.sin(time * 2.5 + j) * 0.25 + 0.75;

        const bulbGrad = ctx.createRadialGradient(bx, by, 1, bx, by, 10 * bPulse);
        bulbGrad.addColorStop(0, `rgba(254, 240, 138, ${0.95 * bPulse})`);
        bulbGrad.addColorStop(0.4, `rgba(251, 191, 36, ${0.4 * bPulse})`);
        bulbGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = bulbGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 10 * bPulse, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
