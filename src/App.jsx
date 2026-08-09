import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowseCoursesPage from './pages/BrowseCoursesPage';
import LearningCoursePage from './pages/LearningCoursePage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import CertificatesPage from './pages/CertificatesPage';
import { COURSES } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'courses' | 'learning' | 'my-learning' | 'certificates' | 'instructor'
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [activeRole, setActiveRole] = useState('student');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setActivePage('learning');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
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

        {activePage === 'certificates' && (
          <CertificatesPage />
        )}

        {activePage === 'instructor' && (
          <InstructorDashboardPage
            onSelectCourse={handleSelectCourse}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
