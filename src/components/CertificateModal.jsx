import React from 'react';
import { Award, ShieldCheck, Printer, X, Atom } from 'lucide-react';
import { LECTURER_INFO } from '../data/mockData';

export default function CertificateModal({ course, studentName = "Nipuni Fernando", certificateCode = "SWT-2026-THISULA-9841", onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl transition-all my-8">
        
        {/* Header Modal Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-heading font-bold text-sm">Official ScienceWithThisula Certificate</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 bg-emerald-950/5 relative overflow-hidden" id="certificate-print-area">
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-emerald-600" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-emerald-600" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-emerald-600" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-emerald-600" />

          {/* Background Watermark */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
            <Atom className="w-96 h-96 text-emerald-900" />
          </div>

          <div className="relative z-10 text-center border-4 border-double border-emerald-700/40 p-8 rounded-2xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-md">
            
            {/* Header Brand */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <Atom className="w-7 h-7 text-emerald-600 animate-spin-slow" />
              <span className="font-heading font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                ScienceWith<span className="text-emerald-600">Thisula</span>
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-mono font-bold mb-6">
              Certified Science Education Academy
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif italic text-slate-900 dark:text-white font-bold mb-2">
              Certificate of Excellence
            </h2>
            <p className="text-xs text-slate-500 font-sans uppercase tracking-wider mb-6">
              This certificate is proudly awarded to
            </p>

            {/* Student Name */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading border-b-2 border-emerald-500 inline-block px-8 pb-2 mb-6">
              {studentName}
            </h3>

            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
              for successfully completing all interactive motion modules, assessments, and practical paper discussions in the course:
            </p>

            {/* Course Title */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 max-w-lg mx-auto mb-8 shadow-sm">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                {course.title}
              </h4>
              <span className="text-xs text-emerald-600 font-mono font-semibold">
                Grade: {course.grade} • {course.subject}
              </span>
            </div>

            {/* Signatures & Stamps */}
            <div className="grid grid-cols-2 gap-8 items-end max-w-md mx-auto pt-6 border-t border-slate-200 dark:border-slate-800">
              
              {/* Lecturer Signature */}
              <div className="text-center">
                <div className="h-10 flex items-center justify-center font-serif text-lg italic text-slate-800 dark:text-slate-200 font-bold border-b border-slate-400">
                  {LECTURER_INFO.name}
                </div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white mt-1">
                  {LECTURER_INFO.name}
                </p>
                <p className="text-[10px] text-slate-500">Head Science Educator</p>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-[10px] p-2 text-center border-2 border-emerald-500 shadow-md">
                  QR VERIFIED <br /> SWT-2026
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1">Code: {certificateCode}</span>
              </div>

            </div>

            {/* Issued Date */}
            <div className="mt-8 text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Issued on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
