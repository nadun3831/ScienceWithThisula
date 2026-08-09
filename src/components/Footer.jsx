import React from 'react';
import { Atom, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Atom className="w-6 h-6 animate-spin-slow" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                ScienceWith<span className="text-emerald-400">Thisula</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sri Lanka's premier LMS platform dedicated to Chemistry, Physics, Biology & Past Paper Discussion excellence with Lecturer Thisula.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Government Registered & Certified Science LMS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-emerald-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('courses')} className="hover:text-emerald-400 transition-colors">
                  Browse Science Courses
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('my-learning')} className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('instructor')} className="hover:text-emerald-400 transition-colors">
                  Instructor Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Subjects Covered */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Subject Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Chemistry</li>
              <li>• Physics</li>
              <li>• Biology</li>
              <li>• Past Paper Discussion</li>
              <li>• Grade 10 & 11 Model Papers</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Lecturer Thisula</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+94 77 123 4567 / Hotline</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@sciencewiththisula.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Colombo & Kandy Science Institutes, Sri Lanka</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ScienceWithThisula LMS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 inline" />
            <span>for Sri Lankan Science Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
