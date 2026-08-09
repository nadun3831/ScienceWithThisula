import React, { useState } from 'react';
import { LECTURER_INFO, COURSES } from '../data/mockData';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Award, 
  Plus
} from 'lucide-react';

export default function InstructorDashboardPage({ onSelectCourse }) {
  const [coursesList, setCoursesList] = useState(COURSES);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Biology');

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newC = {
      id: `course-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      subject: newSubject,
      grade: 'Grade 11 O/L',
      level: 'Intermediate',
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 0,
      duration: '10 Hours',
      lessonsCount: 5,
      price: 3500,
      isFree: false,
      badge: 'NEW',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      description: 'Newly created science module by Lecturer Thisula.',
      sections: []
    };

    setCoursesList([newC, ...coursesList]);
    setNewTitle('');
    setShowAddCourseModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Lecturer Welcome Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img 
            src={LECTURER_INFO.photo} 
            alt="Lecturer Thisula" 
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-heading">{LECTURER_INFO.name} Panel</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                Verified Instructor
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {LECTURER_INFO.title} • {LECTURER_INFO.qualifications}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddCourseModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Science Course</span>
        </button>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Total Students</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">45,890</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-mono font-semibold">+1,240 this month</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 font-sans">Active Courses</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">{coursesList.length}</div>
          <p className="text-[11px] text-blue-600 mt-1 font-mono font-semibold">100% Published</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 font-sans">A-Pass Rate</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">98.4%</div>
          <p className="text-[11px] text-amber-600 mt-1 font-mono font-semibold">Top Sri Lankan Rank</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 font-sans">LMS Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">LKR 14.8M</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-mono font-semibold">Processed securely</p>
        </div>
      </div>

      {/* Course Management Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
            Manage Lecturer Thisula's Courses
          </h2>
          <span className="text-xs text-slate-500 font-mono">Showing {coursesList.length} Courses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-mono">
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
              {coursesList.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold flex items-center gap-3">
                    <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <span>{c.title}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                      {c.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{c.grade}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{c.studentsCount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-amber-500 font-bold">★ {c.rating}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectCourse(c)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow"
                    >
                      Manage & Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">Create New Science Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., Chemistry: Organic Reactions"
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Category</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Combined Science">Combined Science</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
