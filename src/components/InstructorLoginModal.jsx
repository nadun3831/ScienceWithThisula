import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, X, Sparkles } from 'lucide-react';
import { LECTURER_INFO } from '../data/mockData';

export default function InstructorLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lecturer Passcode Verification
    if (passcode.trim() === 'thisula123' || passcode.trim() === 'admin') {
      setErrorMsg('');
      onLoginSuccess();
    } else {
      setErrorMsg('Incorrect passcode. Access is restricted exclusively to Lecturer Thisula.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lecturer Avatar Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <img
              src={LECTURER_INFO.photo}
              alt="Lecturer Thisula"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 mx-auto shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 p-1.5 rounded-full text-white shadow">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1">
              <Sparkles className="w-3 h-3" /> Restricted Access
            </div>
            <h3 className="text-xl font-bold font-heading">Lecturer Portal Login</h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Enter Lecturer Thisula's secure PIN or password to manage LMS courses.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Lecturer Passcode / Security PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setErrorMsg(''); }}
                placeholder="Enter passcode (Hint: thisula123)"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <span>Authenticate & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center font-mono">
          Default Instructor PIN: <span className="text-emerald-400 font-bold">thisula123</span>
        </div>

      </div>
    </div>
  );
}
