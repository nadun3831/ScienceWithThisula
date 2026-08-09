import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { COURSES } from '../data/mockData';
import { Filter, Search, Sparkles, BookOpen } from 'lucide-react';

export default function BrowseCoursesPage({ onSelectCourse, searchQuery, setSearchQuery }) {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All'); // 'All', 'Free', 'Paid'

  const subjects = ['All', 'Chemistry', 'Physics', 'Biology', 'Past Paper Discussion'];

  const filteredCourses = COURSES.filter(course => {
    // Subject check
    if (selectedSubject !== 'All' && course.subject !== selectedSubject) return false;

    // Grade check
    if (selectedGrade !== 'All' && !course.grade.includes(selectedGrade)) return false;

    // Price check
    if (priceFilter === 'Free' && !course.isFree) return false;
    if (priceFilter === 'Paid' && course.isFree) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchSubject = course.subject.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> G.C.E. O/L & A/L Science Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Browse Science Courses
          </h1>
          <p className="text-sm text-slate-300 font-sans">
            Filter by Chemistry, Physics, Biology, or Past Paper Discussion revisions guided by Lecturer Thisula.
          </p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        
        {/* Search Bar Mobile/Desktop */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, e.g., Biology, Chemistry, Physics, Past Paper..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
          
          {/* Subject Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {subjects.map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedSubject === subj
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Price Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Access:</span>
            {['All', 'Free', 'Paid'].map(p => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  priceFilter === p
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Courses Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Showing {filteredCourses.length} of {COURSES.length} Courses</span>
        {searchQuery && <span>Filter query: "{searchQuery}"</span>}
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No courses match your filter</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing your search term or switching subject filters.</p>
          <button
            onClick={() => { setSelectedSubject('All'); setPriceFilter('All'); setSearchQuery(''); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
