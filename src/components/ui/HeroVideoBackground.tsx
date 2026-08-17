'use client';

import React, { useRef, useEffect } from 'react';

interface HeroVideoBackgroundProps {
  src: string;
  poster: string;
  isActive: boolean;
  type: 'market' | 'transport';
}

export function HeroVideoBackground({ src, poster, isActive, type }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* 1. Static Still Image (Displayed when NOT hovered) */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
          isActive ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{ backgroundImage: `url('${poster}')` }}
      />

      {/* 2. Real MP4 Video (Fades in and plays instantly WHEN hovered) */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
          isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
        }`}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* 3. Cinematic Color Grading & Ambient Glow Overlays */}
      {type === 'market' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D2211]/90 via-[#573721]/60 to-[#7A5133]/40 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/25" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1320]/90 via-[#13223A]/70 to-[#1C3049]/45 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/45 via-transparent to-black/25" />
        </>
      )}
    </div>
  );
}
