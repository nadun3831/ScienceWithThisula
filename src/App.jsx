import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowseCoursesPage from './pages/BrowseCoursesPage';
import LearningCoursePage from './pages/LearningCoursePage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import InstructorLoginModal from './components/InstructorLoginModal';
import { COURSES, LECTURER_INFO } from './data/mockData';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'courses' | 'learning' | 'my-learning' | 'instructor'
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [activeRole, setActiveRole] = useState('student');
  const [isLoggedInAsLecturer, setIsLoggedInAsLecturer] = useState(false);
  const [showInstructorLoginModal, setShowInstructorLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActivePage('learning');
  };

  const handleLecturerLoginSuccess = () => {
    setIsLoggedInAsLecturer(true);
    setActiveRole('instructor');
    setShowInstructorLoginModal(false);
    setActivePage('instructor');
  };

  const handleLecturerLogout = () => {
    setIsLoggedInAsLecturer(false);
    setActiveRole('student');
    if (activePage === 'instructor') {
      setActivePage('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        activeRole={activeRole}
        isLoggedInAsLecturer={isLoggedInAsLecturer}
        onOpenInstructorLogin={() => setShowInstructorLoginModal(true)}
        onLecturerLogout={handleLecturerLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page View Content */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage
            onSelectCourse={handleSelectCourse}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'courses' && (
          <BrowseCoursesPage
            onSelectCourse={handleSelectCourse}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activePage === 'learning' && selectedCourse && (
          <LearningCoursePage
            course={selectedCourse}
            onBack={() => setActivePage('courses')}
          />
        )}

        {activePage === 'my-learning' && (
          <BrowseCoursesPage
            onSelectCourse={handleSelectCourse}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Instructor Panel Guarded Route */}
        {activePage === 'instructor' && (
          isLoggedInAsLecturer ? (
            <InstructorDashboardPage
              onSelectCourse={handleSelectCourse}
            />
          ) : (
            <div className="max-w-xl mx-auto my-16 px-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-xl">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
                  <Lock className="w-8 h-8" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    Lecturer Access Required
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    This section contains course publishing controls and student analytics reserved exclusively for <strong>{LECTURER_INFO.name}</strong>. Students cannot view or edit this panel.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setShowInstructorLoginModal(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Enter Lecturer Passcode</span>
                  </button>
                  
                  <button
                    onClick={() => setActivePage('home')}
                    className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Lecturer Authentication Modal */}
      <InstructorLoginModal
        isOpen={showInstructorLoginModal}
        onClose={() => setShowInstructorLoginModal(false)}
        onLoginSuccess={handleLecturerLoginSuccess}
      />

    </div>
  );
}
