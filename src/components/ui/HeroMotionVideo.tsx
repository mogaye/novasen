'use client';

import React, { useEffect, useRef } from 'react';

interface HeroMotionVideoProps {
  type: 'market' | 'transport';
  isActive: boolean;
}

export function HeroMotionVideo({ type, isActive }: HeroMotionVideoProps) {
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

    // Particles or Light Trails
    const particlesCount = type === 'market' ? 35 : 50;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: type === 'market' ? Math.random() * 3.5 + 1 : Math.random() * 2.5 + 0.8,
      speedX: type === 'market' ? (Math.random() - 0.5) * 0.6 : Math.random() * 3 + 1.5,
      speedY: type === 'market' ? -(Math.random() * 0.8 + 0.2) : (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      color:
        type === 'market'
          ? Math.random() > 0.4
            ? 'rgba(232, 219, 200, '
            : 'rgba(201, 168, 130, '
          : Math.random() > 0.5
          ? 'rgba(56, 116, 176, '
          : 'rgba(100, 200, 255, ',
    }));

    let glowPulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      glowPulse += 0.02;

      // Draw glowing light trails or warm ambiance
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        if (type === 'transport') {
          // Speed trail lines
          const trailLength = p.speedX * 8;
          const grad = ctx.createLinearGradient(p.x - trailLength, p.y, p.x, p.y);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, `${p.color}${isActive ? p.opacity : p.opacity * 0.4})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x - trailLength, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          // Warm floating bokeh orbs
          const alpha = (Math.sin(glowPulse + p.x) * 0.2 + p.opacity) * (isActive ? 1 : 0.4);
          ctx.fillStyle = `${p.color}${Math.max(0.1, alpha)})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

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
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${
        isActive ? 'opacity-90' : 'opacity-30'
      }`}
    />
  );
}
