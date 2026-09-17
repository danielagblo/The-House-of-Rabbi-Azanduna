import React from 'react';
import type { FragranceNote } from '../types';
import { Wind, Clock, Sparkles } from 'lucide-react';

interface Props {
  notes: FragranceNote[];
  longevity?: string;
  sillage?: string;
  concentration?: string;
}

export const ScentPyramid: React.FC<Props> = ({
  notes,
  longevity = '14+ Hours',
  sillage = 'Strong',
  concentration = 'Pure Perfume Oil',
}) => {
  const topNotes = notes.filter((n) => n.layer === 'top');
  const heartNotes = notes.filter((n) => n.layer === 'heart');
  const baseNotes = notes.filter((n) => n.layer === 'base');

  return (
    <div className="bg-[#0e0e13] border border-amber-500/20 rounded-xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
            Olfactory Architecture
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            The multi-stage harmonic evolution of notes on skin
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-full font-medium">
          <Sparkles size={12} />
          {concentration}
        </span>
      </div>

      {/* Pyramid Graphic Layers */}
      <div className="flex flex-col gap-4 max-w-2xl mx-auto my-6">
        {/* Top Notes Layer */}
        <div className="relative bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/30 rounded-lg p-5 text-center transform hover:scale-[1.01] transition-transform">
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold mb-1">
            Top Notes (Initial Impression • First 30 Mins)
          </div>
          <div className="font-serif text-base sm:text-lg text-white font-semibold">
            {topNotes.length > 0 ? topNotes.map((n) => n.noteName).join(' • ') : 'Citrus Sparkle, Rare Spices'}
          </div>
        </div>

        {/* Heart Notes Layer */}
        <div className="relative bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-amber-950/60 border border-amber-500/40 rounded-lg p-6 text-center transform hover:scale-[1.01] transition-transform">
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold mb-1">
            Heart Notes (The Soul • 2 to 6 Hours)
          </div>
          <div className="font-serif text-lg sm:text-xl text-amber-100 font-bold">
            {heartNotes.length > 0 ? heartNotes.map((n) => n.noteName).join(' • ') : 'Aged Cambodian Agarwood, Damask Rose'}
          </div>
        </div>

        {/* Base Notes Layer */}
        <div className="relative bg-gradient-to-r from-amber-950/80 via-amber-900/50 to-amber-950/80 border border-amber-500/50 rounded-lg p-7 text-center transform hover:scale-[1.01] transition-transform shadow-xl shadow-black">
          <div className="text-[10px] uppercase tracking-[0.25em] text-amber-200 font-bold mb-1">
            Base Notes (The Deep Anchor • 8 to 24+ Hours)
          </div>
          <div className="font-serif text-xl sm:text-2xl text-amber-300 font-bold">
            {baseNotes.length > 0 ? baseNotes.map((n) => n.noteName).join(' • ') : 'Black Ambergris, Smoked Leather, Bourbon Vanilla'}
          </div>
        </div>
      </div>

      {/* Performance Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-4 bg-zinc-900/60 p-4 rounded-lg border border-white/5">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider block">Longevity</span>
            <span className="font-serif text-sm sm:text-base font-bold text-white">{longevity}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-zinc-900/60 p-4 rounded-lg border border-white/5">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Wind size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider block">Sillage & Projection</span>
            <span className="font-serif text-sm sm:text-base font-bold text-white">{sillage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
