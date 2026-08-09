import React from 'react';
import { LECTURER_INFO } from '../data/mockData';
import { Sparkles, ShieldCheck, Award, Zap } from 'lucide-react';

export default function ThreeLecturerCard() {
  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      
      {/* Lecturer Photo Container - Clean portrait without 3D box frame */}
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl group transition-all duration-300">
        
        {/* Subtle Background Glow behind image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-blue-600/20 rounded-3xl -z-10 blur-xl scale-105" />

        {/* Clean Lecturer Photo */}
        <img
          src={LECTURER_INFO.photo}
          alt={LECTURER_INFO.name}
          className="w-full h-[420px] sm:h-[460px] object-cover object-center rounded-3xl transition-transform duration-500 group-hover:scale-102"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Science Educator</span>
        </div>

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>98.4% Pass Rate</span>
        </div>

        {/* Bottom Lecturer Bio Card Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl text-white shadow-2xl">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              {LECTURER_INFO.name}
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold px-2 py-0.5 rounded">
              Head Lecturer
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-1 mb-2 font-sans">
            {LECTURER_INFO.title}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3 h-3" /> {LECTURER_INFO.experience}
            </span>
            <span>•</span>
            <span>{LECTURER_INFO.studentsTaught} Students</span>
          </div>
        </div>

      </div>

    </div>
  );
}
