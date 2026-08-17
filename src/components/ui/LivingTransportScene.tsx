'use client';

import React, { useEffect, useRef } from 'react';

interface LivingTransportSceneProps {
  isActive: boolean;
}

export function LivingTransportScene({ isActive }: LivingTransportSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Moving vehicles on the coastal road
    const vehicles = [
      { x: -50, yOffset: 30, speed: 4.8, type: 'taxi', scale: 1.1, color: '#EAB308', beamColor: '#FEF08A' },
      { x: 300, yOffset: -20, speed: 5.5, type: 'car', scale: 1.05, color: '#1E293B', beamColor: '#E0F2FE' },
      { x: 650, yOffset: 15, speed: 4.2, type: 'scooter', scale: 0.95, color: '#DC2626', beamColor: '#FEF08A' },
      { x: 120, yOffset: -40, speed: 3.2, type: 'car', scale: 0.8, color: '#FFFFFF', beamColor: '#FEF08A' },
      { x: 500, yOffset: -10, speed: 3.6, type: 'scooter', scale: 0.75, color: '#0284C7', beamColor: '#FEF08A' },
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
      const speedMult = isActive ? 1.5 : 0.7;

      const roadY = height * 0.78;

      // ─────────────────────────────────────────────────────────────
      // 1. ANIMATED CARS, TAXIS & SCOOTERS DRIVING
      // ─────────────────────────────────────────────────────────────
      vehicles.forEach((v) => {
        v.x += v.speed * speedMult;
        if (v.x > width + 150) v.x = -150;

        const vy = roadY + v.yOffset;
        const s = v.scale * Math.max(0.65, height / 650);

        ctx.save();
        ctx.translate(v.x, vy);

        // 1. Headlight Light Beam
        const beamLen = 170 * s;
        const beamW = 45 * s;
        const hGrad = ctx.createLinearGradient(35 * s, 0, 35 * s + beamLen, 0);
        hGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
        hGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.25)');
        hGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.moveTo(35 * s, -4 * s);
        ctx.lineTo(35 * s + beamLen, -beamW);
        ctx.lineTo(35 * s + beamLen, beamW);
        ctx.closePath();
        ctx.fill();

        // 2. Vehicle Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.beginPath();
        ctx.ellipse(0, 12 * s, 42 * s, 6 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. Draw Vehicle
        if (v.type === 'scooter') {
          // Wheels
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(-20 * s, 8 * s, 6.5 * s, 0, Math.PI * 2);
          ctx.arc(20 * s, 8 * s, 6.5 * s, 0, Math.PI * 2);
          ctx.fill();

          // Chassis
          ctx.fillStyle = v.color;
          ctx.beginPath();
          ctx.roundRect(-22 * s, -3 * s, 44 * s, 8 * s, 3 * s);
          ctx.fill();

          // Delivery Box (NovaSen)
          ctx.fillStyle = '#1C3049';
          ctx.strokeStyle = '#3874B0';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-22 * s, -20 * s, 15 * s, 16 * s, 2 * s);
          ctx.fill();
          ctx.stroke();

          // Driver
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.arc(4 * s, -24 * s, 5.5 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.roundRect(-3 * s, -18 * s, 12 * s, 14 * s, 2.5 * s);
          ctx.fill();

          // Headlight & Tail
          ctx.fillStyle = v.beamColor;
          ctx.beginPath();
          ctx.arc(22 * s, -2 * s, 3 * s, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(-22 * s, -2 * s, 2.5 * s, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Car / Taxi Body
          ctx.fillStyle = v.color;
          ctx.beginPath();
          ctx.roundRect(-38 * s, -6 * s, 76 * s, 14 * s, 3.5 * s);
          ctx.fill();

          // Cabin
          ctx.fillStyle = v.type === 'taxi' ? '#EAB308' : v.color;
          ctx.beginPath();
          ctx.roundRect(-20 * s, -20 * s, 42 * s, 15 * s, [7 * s, 10 * s, 0, 0]);
          ctx.fill();

          // Windshield
          ctx.fillStyle = 'rgba(186, 230, 253, 0.8)';
          ctx.beginPath();
          ctx.roundRect(-16 * s, -17 * s, 34 * s, 10 * s, 2.5 * s);
          ctx.fill();

          // Taxi Sign
          if (v.type === 'taxi') {
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.roundRect(-5 * s, -24 * s, 10 * s, 4 * s, 1.5 * s);
            ctx.fill();
          }

          // Wheels
          [-22, 22].forEach((wx) => {
            ctx.fillStyle = '#0F172A';
            ctx.beginPath();
            ctx.arc(wx * s, 8 * s, 7.5 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#94A3B8';
            ctx.beginPath();
            ctx.arc(wx * s, 8 * s, 3.5 * s, 0, Math.PI * 2);
            ctx.fill();
          });

          // Headlight
          ctx.fillStyle = v.beamColor;
          ctx.beginPath();
          ctx.arc(38 * s, 0, 3.5 * s, 0, Math.PI * 2);
          ctx.fill();

          // Red Tail
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(-38 * s, 0, 3 * s, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

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
