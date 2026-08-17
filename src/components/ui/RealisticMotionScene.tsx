'use client';

import React, { useEffect, useRef } from 'react';

interface RealisticMotionSceneProps {
  type: 'market' | 'transport';
  isActive: boolean;
}

export function RealisticMotionScene({ type, isActive }: RealisticMotionSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // ─────────────────────────────────────────────────────────────
    // 1. DATA FOR TRANSPORT (CARS & MOTORBIKES DRIVING ON ROAD)
    // ─────────────────────────────────────────────────────────────
    interface Vehicle {
      x: number;
      lane: number; // 0 (near/fast), 1 (mid), 2 (far/slow)
      type: 'car' | 'taxi' | 'scooter' | 'truck';
      speed: number;
      color: string;
      scale: number;
      wheelRotation: number;
      lightsColor: string;
    }

    const vehicleColors = ['#1C3049', '#7A5133', '#E8DBC8', '#F59E0B', '#3B82F6', '#FFFFFF', '#1E293B'];
    const vehicles: Vehicle[] = [
      // Foreground Lane (fast)
      { x: -50, lane: 0, type: 'taxi', speed: 4.8, color: '#EAB308', scale: 1.1, wheelRotation: 0, lightsColor: '#FEF08A' },
      { x: 320, lane: 0, type: 'car', speed: 5.2, color: '#1E293B', scale: 1.05, wheelRotation: 0, lightsColor: '#FEF08A' },
      { x: 750, lane: 0, type: 'scooter', speed: 4.2, color: '#DC2626', scale: 0.95, wheelRotation: 0, lightsColor: '#FEF08A' },
      // Mid Lane
      { x: 120, lane: 1, type: 'car', speed: 3.4, color: '#FFFFFF', scale: 0.8, wheelRotation: 0, lightsColor: '#FDE047' },
      { x: 540, lane: 1, type: 'scooter', speed: 3.1, color: '#0284C7', scale: 0.75, wheelRotation: 0, lightsColor: '#FDE047' },
      { x: 920, lane: 1, type: 'truck', speed: 2.8, color: '#573721', scale: 0.85, wheelRotation: 0, lightsColor: '#FDE047' },
      // Far Lane (distant slow)
      { x: 50, lane: 2, type: 'car', speed: 1.8, color: '#64748B', scale: 0.5, wheelRotation: 0, lightsColor: '#FEF9C3' },
      { x: 400, lane: 2, type: 'car', speed: 2.0, color: '#CBD5E1', scale: 0.5, wheelRotation: 0, lightsColor: '#FEF9C3' },
      { x: 680, lane: 2, type: 'scooter', speed: 1.7, color: '#F97316', scale: 0.45, wheelRotation: 0, lightsColor: '#FEF9C3' },
    ];

    // ─────────────────────────────────────────────────────────────
    // 2. DATA FOR MARKET (PEOPLE WALKING ACROSS THE BAZAAR)
    // ─────────────────────────────────────────────────────────────
    interface Person {
      x: number;
      yRatio: number;
      speed: number;
      direction: 1 | -1; // 1 = right, -1 = left
      scale: number;
      garmentColor: string;
      boubouLength: number;
      walkCycle: number;
      hasBag: boolean;
    }

    const waxColors = ['#D97706', '#0284C7', '#059669', '#DC2626', '#7C3AED', '#7A5133', '#C9A882', '#EA580C'];
    const people: Person[] = [
      { x: 60, yRatio: 0.82, speed: 1.3, direction: 1, scale: 1.0, garmentColor: '#D97706', boubouLength: 38, walkCycle: 0, hasBag: true },
      { x: 240, yRatio: 0.85, speed: 1.1, direction: -1, scale: 1.05, garmentColor: '#0284C7', boubouLength: 42, walkCycle: 2, hasBag: false },
      { x: 450, yRatio: 0.80, speed: 1.5, direction: 1, scale: 0.95, garmentColor: '#059669', boubouLength: 35, walkCycle: 4, hasBag: true },
      { x: 680, yRatio: 0.88, speed: 0.9, direction: -1, scale: 1.15, garmentColor: '#7A5133', boubouLength: 46, walkCycle: 1, hasBag: true },
      { x: 880, yRatio: 0.76, speed: 1.2, direction: -1, scale: 0.8, garmentColor: '#DC2626', boubouLength: 30, walkCycle: 3, hasBag: false },
      { x: 180, yRatio: 0.75, speed: 1.0, direction: 1, scale: 0.78, garmentColor: '#7C3AED', boubouLength: 28, walkCycle: 5, hasBag: true },
      { x: 560, yRatio: 0.74, speed: 0.8, direction: -1, scale: 0.72, garmentColor: '#EA580C', boubouLength: 26, walkCycle: 0.5, hasBag: false },
    ];

    let time = 0;

    // ─────────────────────────────────────────────────────────────
    // ANIMATION RENDER LOOP
    // ─────────────────────────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.05;

      const speedMultiplier = isActive ? 1.0 : 0.4;

      if (type === 'transport') {
        // ───────────────────────────────────────────────────────────
        // DRAW TRANSPORT : ROADS, HEADLIGHT CONES & REAL DRIVING VEHICLES
        // ───────────────────────────────────────────────────────────
        const roadBaseY = height * 0.78;

        // Draw Road Asphalt Surface
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, roadBaseY - 60, width, height - (roadBaseY - 60));

        // Draw Dashed Highway Lane Lines
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([20, 25]);
        ctx.beginPath();
        ctx.moveTo(0, roadBaseY - 10);
        ctx.lineTo(width, roadBaseY - 10);
        ctx.moveTo(0, roadBaseY + 35);
        ctx.lineTo(width, roadBaseY + 35);
        ctx.stroke();
        ctx.setLineDash([]);

        // Render each vehicle driving
        vehicles.forEach((v) => {
          v.x += v.speed * speedMultiplier;
          v.wheelRotation += 0.2 * speedMultiplier;

          // Wrap around screen seamlessly
          if (v.x > width + 150) {
            v.x = -150;
          }

          const laneOffsets = [45, 10, -35];
          const y = roadBaseY + laneOffsets[v.lane];
          const s = v.scale;

          ctx.save();
          ctx.translate(v.x, y);

          // 1. Headlight Light Beam Cone (Projecting forward onto the road)
          const beamLength = 160 * s;
          const beamWidth = 45 * s;
          const lightGrad = ctx.createLinearGradient(60 * s, 0, 60 * s + beamLength, 0);
          lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
          lightGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.25)');
          lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

          ctx.fillStyle = lightGrad;
          ctx.beginPath();
          ctx.moveTo(35 * s, -5 * s);
          ctx.lineTo(35 * s + beamLength, -beamWidth);
          ctx.lineTo(35 * s + beamLength, beamWidth);
          ctx.closePath();
          ctx.fill();

          // 2. Vehicle Body Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.ellipse(0, 14 * s, 45 * s, 6 * s, 0, 0, Math.PI * 2);
          ctx.fill();

          // 3. Draw Vehicle Models
          if (v.type === 'scooter') {
            // Delivery Scooter & Driver
            // Wheels
            ctx.fillStyle = '#0F172A';
            ctx.beginPath();
            ctx.arc(-22 * s, 8 * s, 7 * s, 0, Math.PI * 2);
            ctx.arc(22 * s, 8 * s, 7 * s, 0, Math.PI * 2);
            ctx.fill();
            // Scooter Chassis
            ctx.fillStyle = v.color;
            ctx.beginPath();
            ctx.roundRect(-24 * s, -3 * s, 48 * s, 8 * s, 3 * s);
            ctx.fill();
            // Cargo Box on the back (NovaSen Parcel Box)
            ctx.fillStyle = '#1C3049';
            ctx.strokeStyle = '#3874B0';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(-24 * s, -22 * s, 16 * s, 18 * s, 2 * s);
            ctx.fill();
            ctx.stroke();
            // Driver Silhouette with Helmet
            ctx.fillStyle = '#1E293B';
            ctx.beginPath();
            ctx.arc(4 * s, -26 * s, 6 * s, 0, Math.PI * 2); // Helmet
            ctx.fill();
            ctx.roundRect(-4 * s, -20 * s, 14 * s, 15 * s, 3 * s); // Body
            ctx.fill();
            // Front Headlight
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(24 * s, -2 * s, 3 * s, 0, Math.PI * 2);
            ctx.fill();
            // Rear Tail Light
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(-24 * s, -2 * s, 2.5 * s, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Car / Taxi / Truck Body
            ctx.fillStyle = v.color;
            ctx.beginPath();
            // Lower chassis
            ctx.roundRect(-42 * s, -6 * s, 84 * s, 16 * s, 4 * s);
            ctx.fill();
            // Cabin & Windows
            ctx.fillStyle = v.type === 'taxi' ? '#EAB308' : v.color;
            ctx.beginPath();
            ctx.roundRect(-24 * s, -22 * s, 46 * s, 17 * s, [8 * s, 12 * s, 0, 0]);
            ctx.fill();

            // Glass Windshield
            ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
            ctx.beginPath();
            ctx.roundRect(-20 * s, -19 * s, 40 * s, 12 * s, 3 * s);
            ctx.fill();

            // Taxi Roof Sign if Taxi
            if (v.type === 'taxi') {
              ctx.fillStyle = '#FEF08A';
              ctx.beginPath();
              ctx.roundRect(-6 * s, -26 * s, 12 * s, 5 * s, 2 * s);
              ctx.fill();
            }

            // Wheels with Spokes
            [-26, 26].forEach((wheelX) => {
              ctx.fillStyle = '#0F172A';
              ctx.beginPath();
              ctx.arc(wheelX * s, 10 * s, 8.5 * s, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#94A3B8';
              ctx.beginPath();
              ctx.arc(wheelX * s, 10 * s, 4 * s, 0, Math.PI * 2);
              ctx.fill();
            });

            // Headlight & Tail light
            ctx.fillStyle = v.lightsColor;
            ctx.beginPath();
            ctx.arc(42 * s, 0, 4 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(-42 * s, 0, 3.5 * s, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      } else {
        // ───────────────────────────────────────────────────────────
        // DRAW MARKET : REAL PEOPLE WALKING, BROWSING & MOVING
        // ───────────────────────────────────────────────────────────
        const sidewalkY = height * 0.82;

        // Draw Cobblestone / Street pavement
        ctx.fillStyle = 'rgba(61, 34, 17, 0.45)';
        ctx.fillRect(0, sidewalkY - 20, width, height - (sidewalkY - 20));

        people.forEach((p) => {
          p.x += p.speed * p.direction * speedMultiplier;
          p.walkCycle += 0.12 * speedMultiplier;

          // Wrap around screen seamlessly
          if (p.direction === 1 && p.x > width + 60) p.x = -60;
          if (p.direction === -1 && p.x < -60) p.x = width + 60;

          const y = height * p.yRatio;
          const s = p.scale;

          ctx.save();
          ctx.translate(p.x, y);

          // Footstep bobbing and leg stride cycle
          const legSwing = Math.sin(p.walkCycle) * 10 * s;
          const bodyBob = Math.abs(Math.cos(p.walkCycle)) * 2 * s;

          // Ground shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.ellipse(0, 2 * s, 14 * s, 4 * s, 0, 0, Math.PI * 2);
          ctx.fill();

          // 1. Legs / Feet walking
          ctx.fillStyle = '#3E2723';
          // Back Leg
          ctx.beginPath();
          ctx.roundRect(-4 * s - legSwing * 0.5, -12 * s, 4 * s, 14 * s, 2 * s);
          ctx.fill();
          // Front Leg
          ctx.beginPath();
          ctx.roundRect(1 * s + legSwing * 0.5, -12 * s, 4 * s, 14 * s, 2 * s);
          ctx.fill();

          // 2. Traditional African Grand Boubou / Garment
          ctx.fillStyle = p.garmentColor;
          ctx.beginPath();
          // Flowing Boubou shape
          ctx.moveTo(-10 * s, -p.boubouLength * s - bodyBob);
          ctx.lineTo(10 * s, -p.boubouLength * s - bodyBob);
          ctx.lineTo(14 * s + legSwing * 0.2, -4 * s);
          ctx.lineTo(-14 * s - legSwing * 0.2, -4 * s);
          ctx.closePath();
          ctx.fill();

          // 3. Torso and Head
          ctx.fillStyle = '#2A1B0E'; // Skin tone
          ctx.beginPath();
          ctx.arc(0, -p.boubouLength * s - 10 * s - bodyBob, 6 * s, 0, Math.PI * 2); // Head
          ctx.fill();

          // Traditional Headwrap / Foulard or Hat
          ctx.fillStyle = p.garmentColor;
          ctx.beginPath();
          ctx.arc(0, -p.boubouLength * s - 13 * s - bodyBob, 5 * s, 0, Math.PI);
          ctx.fill();

          // 4. Arms & Shopping Bag
          const armSwing = -legSwing * 0.6;
          ctx.fillStyle = '#2A1B0E';
          ctx.beginPath();
          ctx.roundRect(8 * s * p.direction + armSwing, -p.boubouLength * s + 10 * s - bodyBob, 3 * s, 16 * s, 1.5 * s);
          ctx.fill();

          if (p.hasBag) {
            // Market Shopping Basket / NovaSen Bag
            ctx.fillStyle = '#C9A882';
            ctx.strokeStyle = '#7A5133';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(7 * s * p.direction + armSwing, -p.boubouLength * s + 22 * s - bodyBob, 8 * s, 10 * s, 2 * s);
            ctx.fill();
            ctx.stroke();
          }

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-65'
      }`}
    />
  );
}
