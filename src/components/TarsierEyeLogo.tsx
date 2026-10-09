import React from 'react';

interface TarsierEyeLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  subtitle?: string;
}

/**
 * Minimalist vector emblem of the iconic nocturnal eye of the endangered
 * Philippine Tarsier (Carlito syrichta). Known for having the largest eye-to-body
 * ratio of any mammal, symbolizing vigilance, clarity, and learning integrity.
 */
export const TarsierEyeLogo: React.FC<TarsierEyeLogoProps> = ({
  className = '',
  size = 32,
  showText = false,
  subtitle = 'LEARNING INTEGRITY',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none transition-transform hover:scale-105 duration-200"
        aria-label="Philippine Tarsier Eye Emblem"
      >
        <defs>
          {/* Subtle warm eye ambient glow */}
          <radialGradient id="tarsierGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#d97706" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
          </radialGradient>

          {/* Luminous Golden-Amber Tarsier Iris */}
          <radialGradient id="tarsierIrisGrad" cx="44%" cy="42%" r="52%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#d97706" />
            <stop offset="90%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          {/* Deep Midnight Dilated Pupil */}
          <radialGradient id="tarsierPupilGrad" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="55%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Specular Catchlight Highlights */}
          <linearGradient id="tarsierCatchlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient Halo */}
        <circle cx="50" cy="50" r="48" fill="url(#tarsierGlow)" />

        {/* Outer Minimal Contour */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#090d16"
          stroke="#1e293b"
          strokeWidth="1.5"
        />

        {/* Golden-Amber Iris */}
        <circle
          cx="50"
          cy="50"
          r="39"
          fill="url(#tarsierIrisGrad)"
          stroke="#b45309"
          strokeWidth="1"
        />

        {/* Fine Radial Iris Striations (Tarsier distinctive optical fibers) */}
        <g stroke="#78350f" strokeWidth="0.75" opacity="0.35">
          <line x1="50" y1="13" x2="50" y2="22" />
          <line x1="50" y1="78" x2="50" y2="87" />
          <line x1="13" y1="50" x2="22" y2="50" />
          <line x1="78" y1="50" x2="87" y2="50" />
          <line x1="24" y1="24" x2="31" y2="31" />
          <line x1="76" y1="76" x2="69" y2="69" />
          <line x1="24" y1="76" x2="31" y2="69" />
          <line x1="76" y1="24" x2="69" y2="31" />
          <line x1="36" y1="16" x2="40" y2="24" />
          <line x1="64" y1="84" x2="60" y2="76" />
          <line x1="16" y1="64" x2="24" y2="60" />
          <line x1="84" y1="36" x2="76" y2="40" />
        </g>

        {/* Inner Luminous Limbal Ring */}
        <circle
          cx="50"
          cy="50"
          r="26"
          fill="none"
          stroke="#fef08a"
          strokeWidth="0.75"
          opacity="0.5"
        />

        {/* Enormous Nocturnal Pupil */}
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="url(#tarsierPupilGrad)"
        />

        {/* Primary Crescent Specular Glint (Corneal Catchlight) */}
        <ellipse
          cx="42"
          cy="39"
          rx="5.5"
          ry="3.8"
          transform="rotate(-25 42 39)"
          fill="url(#tarsierCatchlight)"
        />

        {/* Secondary Delicate Micro-glint */}
        <circle
          cx="59"
          cy="58"
          r="1.8"
          fill="#ffffff"
          opacity="0.65"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-wider text-slate-100 uppercase font-sans">
            Watchers
          </span>
          <span className="text-[10px] text-amber-400/90 tracking-widest font-mono">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};
