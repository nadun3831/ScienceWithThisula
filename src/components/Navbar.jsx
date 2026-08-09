import React, { useState } from 'react';
import { 
  Atom, 
  Search, 
  Bell, 
  Award, 
  BookOpen, 
  User, 
  Sparkles, 
  LayoutDashboard, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';
import { LECTURER_INFO } from '../data/mockData';

export default function Navbar({ activePage, setActivePage, activeRole, setActiveRole, searchQuery, setSearchQuery }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsList = [
    { id: 1, text: "New Cell Biology Quiz added!", time: "10 mins ago", unread: true },
    { id: 2, text: "Certificate issued for Past Paper Masterclass", time: "2 hours ago", unread: true },
    { id: 3, text: "Lecturer Thisula updated Physics Snell's Law video", time: "1 day ago", unread: false }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group transition-transform hover:scale-105">
              <Atom className="w-6 h-6 animate-spin-slow group-hover:rotate-180 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  ScienceWith<span className="text-emerald-600 dark:text-emerald-400">Thisula</span>
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans hidden sm:block">
                Master G.C.E. O/L Science with Motion
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActivePage('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activePage === 'home'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Home
            </button>

            <button
              onClick={() => setActivePage('courses')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activePage === 'courses'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Browse Courses
            </button>

            <button
              onClick={() => setActivePage('my-learning')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activePage === 'my-learning'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> My Learning
            </button>

            <button
              onClick={() => setActivePage('certificates')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activePage === 'certificates'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" /> Certificates
            </button>

            <button
              onClick={() => setActivePage('instructor')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activePage === 'instructor'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Instructor Panel
            </button>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'courses') setActivePage('courses');
                }}
                placeholder="Search courses..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full w-48 focus:w-60 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                    <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto">
                    {notificationsList.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{n.text}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setActiveRole(activeRole === 'student' ? 'instructor' : 'student')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              title="Toggle between Student view & Instructor Lecturer View"
            >
              <User className="w-3.5 h-3.5" />
              <span>Role: {activeRole === 'student' ? 'Student' : 'Lecturer Thisula'}</span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <img
                src={LECTURER_INFO.photo}
                alt="Lecturer Thisula"
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 cursor-pointer shadow"
                onClick={() => setActivePage('instructor')}
              />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActivePage('home'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => { setActivePage('courses'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Browse Courses
          </button>
          <button
            onClick={() => { setActivePage('my-learning'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            My Learning
          </button>
          <button
            onClick={() => { setActivePage('certificates'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Certificates
          </button>
          <button
            onClick={() => { setActivePage('instructor'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            Instructor Panel
          </button>
        </div>
      )}
    </nav>
  );
}
