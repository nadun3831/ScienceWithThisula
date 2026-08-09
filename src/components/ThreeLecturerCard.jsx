import React, { useState, useRef } from 'react';
import { LECTURER_INFO } from '../data/mockData';
import { Sparkles, ShieldCheck, Award, Zap } from 'lucide-react';

export default function ThreeLecturerCard() {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 3D Tilt calculations
    const rotateX = ((y - centerY) / centerY) * -14; // tilt up/down
    const rotateY = ((x - centerX) / centerX) * 14;  // tilt left/right

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlareStyle({
      opacity: 0.35,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center py-4">
      
      {/* Interactive 3D Parallax Tilt Photo Card Container */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transformStyle,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl cursor-pointer group select-none border border-emerald-500/20 bg-slate-900"
      >
        {/* Dynamic 3D Glare Lighting Effect Layer */}
        <div 
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-3xl"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`,
          }}
        />

        {/* Ambient Glowing Background Layer in 3D Depth */}
        <div 
          style={{ transform: 'translateZ(-20px)' }}
          className="absolute inset-0 bg-gradient-to-tr from-emerald-600/40 via-teal-500/20 to-blue-600/30 rounded-3xl blur-xl scale-105" 
        />

        {/* Lecturer Photo Image with 3D Depth */}
        <div style={{ transform: 'translateZ(10px)' }} className="relative overflow-hidden rounded-3xl">
          <img
            src={LECTURER_INFO.photo}
            alt={LECTURER_INFO.name}
            className="w-full h-[430px] sm:h-[470px] object-cover object-center rounded-3xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        </div>

        {/* Top Badges with 3D Elevation */}
        <div 
          style={{ transform: 'translateZ(40px)' }} 
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>Interactive Science Educator</span>
        </div>

        <div 
          style={{ transform: 'translateZ(40px)' }} 
          className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>98.4% Pass Rate</span>
        </div>

        {/* Bottom Lecturer Bio Card Overlay with High 3D Floating Elevation */}
        <div 
          style={{ transform: 'translateZ(50px)' }} 
          className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              {LECTURER_INFO.name}
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
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
