import React, { useState } from 'react';
import { LECTURER_INFO, COURSES } from '../data/mockData';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Award, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Video,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function InstructorDashboardPage({ onSelectCourse }) {
  const [coursesList, setCoursesList] = useState(COURSES);
  
  // Add Course state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Biology');
  const [newGrade, setNewGrade] = useState('Grade 11 O/L');
  const [newPrice, setNewPrice] = useState(3500);

  // Edit Course Modal state
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeEditTab, setActiveEditTab] = useState('general'); // 'general' | 'curriculum'
  
  // Edit Form Fields
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('Biology');
  const [editGrade, setEditGrade] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editIsFree, setEditIsFree] = useState(false);
  const [editDuration, setEditDuration] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  // Edit Curriculum Sections (Deep cloned)
  const [editSections, setEditSections] = useState([]);
  
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Open Edit Modal
  const handleStartEdit = (course) => {
    setEditingCourse(course);
    setActiveEditTab('general');
    setEditTitle(course.title);
    setEditSubject(course.subject);
    setEditGrade(course.grade || 'Grade 11 O/L');
    setEditPrice(course.price || 0);
    setEditIsFree(!!course.isFree);
    setEditDuration(course.duration || '15 Hours');
    setEditBadge(course.badge || 'MUST LEARN');
    setEditDescription(course.description || '');
    
    // Deep clone sections for curriculum editing
    setEditSections(JSON.parse(JSON.stringify(course.sections || [])));
  };

  // Save Edit Course
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCourse || !editTitle.trim()) return;

    setCoursesList(prev => prev.map(c => {
      if (c.id === editingCourse.id) {
        return {
          ...c,
          title: editTitle,
          subject: editSubject,
          grade: editGrade,
          price: Number(editPrice),
          isFree: editIsFree,
          duration: editDuration,
          badge: editBadge,
          description: editDescription,
          sections: editSections
        };
      }
      return c;
    }));

    setEditingCourse(null);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  // Curriculum Helpers
  const handleUpdateSectionTitle = (sectionId, title) => {
    setEditSections(prev => prev.map(sec => sec.id === sectionId ? { ...sec, title } : sec));
  };

  const handleAddSection = () => {
    const newSec = {
      id: `sec-${Date.now()}`,
      title: `New Module Section ${editSections.length + 1}`,
      lessons: [
        {
          id: `les-${Date.now()}`,
          title: 'Lesson 1: Introduction Video',
          duration: '15 min',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          summary: 'Overview video summary.'
        }
      ]
    };
    setEditSections([...editSections, newSec]);
  };

  const handleDeleteSection = (sectionId) => {
    setEditSections(prev => prev.filter(sec => sec.id !== sectionId));
  };

  const handleUpdateLesson = (sectionId, lessonId, field, value) => {
    setEditSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lessons: sec.lessons.map(les => les.id === lessonId ? { ...les, [field]: value } : les)
        };
      }
      return sec;
    }));
  };

  const handleAddLesson = (sectionId) => {
    setEditSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        const newLes = {
          id: `les-${Date.now()}`,
          title: `New Lesson ${sec.lessons.length + 1}`,
          duration: '20 min',
          type: 'video',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          summary: 'Detailed explanation video.'
        };
        return { ...sec, lessons: [...sec.lessons, newLes] };
      }
      return sec;
    }));
  };

  const handleDeleteLesson = (sectionId, lessonId) => {
    setEditSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          lessons: sec.lessons.filter(les => les.id !== lessonId)
        };
      }
      return sec;
    }));
  };

  const handleAddOrToggleQuiz = (sectionId) => {
    setEditSections(prev => prev.map(sec => {
      if (sec.id === sectionId) {
        if (sec.quiz) {
          // Remove quiz
          const { quiz, ...rest } = sec;
          return rest;
        } else {
          // Add default quiz
          return {
            ...sec,
            quiz: {
              id: `quiz-${Date.now()}`,
              title: `${sec.title} Module Assessment Quiz`,
              timeLimit: 10,
              passingScore: 70,
              questions: [
                {
                  id: `q-${Date.now()}`,
                  question: 'Sample Assessment Question 1?',
                  options: ['Option A', 'Option B', 'Option C', 'Option D'],
                  correctIndex: 0,
                  explanation: 'Correct explanation for option A.'
                }
              ]
            }
          };
        }
      }
      return sec;
    }));
  };

  const handleUpdateQuizQuestion = (sectionId, qIndex, field, value) => {
    setEditSections(prev => prev.map(sec => {
      if (sec.id === sectionId && sec.quiz) {
        const updatedQuestions = [...sec.quiz.questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
        return {
          ...sec,
          quiz: { ...sec.quiz, questions: updatedQuestions }
        };
      }
      return sec;
    }));
  };

  // Delete Course
  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to remove this course from Lecturer Thisula's catalog?")) {
      setCoursesList(prev => prev.filter(c => c.id !== courseId));
    }
  };

  // Create Course
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newC = {
      id: `course-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      subject: newSubject,
      grade: newGrade,
      level: 'Intermediate',
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 0,
      duration: '12 Hours',
      lessonsCount: 6,
      price: Number(newPrice),
      isFree: newPrice === 0,
      badge: 'NEW',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      description: 'Newly published G.C.E. O/L science module by Lecturer Thisula.',
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: 'Section 1: Core Fundamentals',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: '1.1 Introduction Video Lesson',
              duration: '20 min',
              type: 'video',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              summary: 'Introductory visual model presentation.'
            }
          ]
        }
      ]
    };

    setCoursesList([newC, ...coursesList]);
    setNewTitle('');
    setShowAddCourseModal(false);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Notification */}
      {showSuccessNotification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold font-mono animate-bounce">
          <Check className="w-4 h-4" />
          <span>Course & Video Modules Updated Successfully!</span>
        </div>
      )}

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
                Verified Lecturer
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
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              Manage Lecturer Thisula's Courses
            </h2>
            <p className="text-xs text-slate-500">Edit course details, video URLs, quizzes, or preview player</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Showing {coursesList.length} Courses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-mono">
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Modules</th>
                <th className="py-3 px-4 text-right">Manage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
              {coursesList.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold flex items-center gap-3">
                    <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <span className="block font-heading">{c.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.duration} • {c.badge}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                      {c.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{c.grade}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                    {c.isFree ? 'FREE' : `LKR ${c.price?.toLocaleString()}`}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    {c.sections?.length || 0} Sections
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(c)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1"
                        title="Edit course details, video links & quizzes"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Course & Modules</span>
                      </button>

                      {/* Preview Button */}
                      <button
                        onClick={() => onSelectCourse(c)}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        title="Preview student course player"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE COURSE & MODULE EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-3xl space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest">
                  Course Management Studio
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  Edit: {editingCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
              <button
                onClick={() => setActiveEditTab('general')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeEditTab === 'general'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                1. General Settings & Info
              </button>
              <button
                onClick={() => setActiveEditTab('curriculum')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeEditTab === 'curriculum'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Modules, Videos & Quizzes ({editSections.length})</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              {/* TAB 1: GENERAL INFO */}
              {activeEditTab === 'general' && (
                <div className="space-y-4">
                  
                  {/* Title */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Subject & Grade */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject Category</label>
                      <select
                        value={editSubject}
                        onChange={e => setEditSubject(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Biology">Biology</option>
                        <option value="Past Paper Discussion">Past Paper Discussion</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Grade Level</label>
                      <input
                        type="text"
                        value={editGrade}
                        onChange={e => setEditGrade(e.target.value)}
                        placeholder="e.g., Grade 11 O/L"
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Price & Free Access */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Course Fee (LKR)</label>
                      <input
                        type="number"
                        disabled={editIsFree}
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isFreeCheck"
                        checked={editIsFree}
                        onChange={e => {
                          setEditIsFree(e.target.checked);
                          if (e.target.checked) setEditPrice(0);
                        }}
                        className="w-4 h-4 rounded text-emerald-600"
                      />
                      <label htmlFor="isFreeCheck" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        Offer as Free Course
                      </label>
                    </div>
                  </div>

                  {/* Duration & Badge */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration</label>
                      <input
                        type="text"
                        value={editDuration}
                        onChange={e => setEditDuration(e.target.value)}
                        placeholder="e.g., 18 Hours"
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Tag</label>
                      <select
                        value={editBadge}
                        onChange={e => setEditBadge(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="POPULAR">POPULAR</option>
                        <option value="MUST LEARN">MUST LEARN</option>
                        <option value="HIGH SCORING">HIGH SCORING</option>
                        <option value="FREE ACCESS">FREE ACCESS</option>
                        <option value="NEW">NEW</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: CURRICULUM, VIDEOS & QUIZZES */}
              {activeEditTab === 'curriculum' && (
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Course Curriculum & Videos</h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Add sections, edit lesson video URLs, and create interactive quizzes.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow"
                    >
                      <Plus className="w-4 h-4" /> Add Section
                    </button>
                  </div>

                  {/* Sections List */}
                  <div className="space-y-5">
                    {editSections.map((sec, secIdx) => (
                      <div key={sec.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-4 bg-slate-50/50 dark:bg-slate-850">
                        
                        {/* Section Header */}
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => handleUpdateSectionTitle(sec.id, e.target.value)}
                            className="font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 w-full max-w-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteSection(sec.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Lessons List in Section */}
                        <div className="space-y-3 pl-2 border-l-2 border-emerald-500/30">
                          {sec.lessons.map((les, lesIdx) => (
                            <div key={les.id} className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                                  <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Lesson {lesIdx + 1}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(sec.id, les.id)}
                                  className="text-slate-400 hover:text-rose-500 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Lesson Title</label>
                                  <input
                                    type="text"
                                    value={les.title}
                                    onChange={(e) => handleUpdateLesson(sec.id, les.id, 'title', e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Video Stream URL (.mp4 / HLS link)</label>
                                  <input
                                    type="text"
                                    value={les.videoUrl}
                                    onChange={(e) => handleUpdateLesson(sec.id, les.id, 'videoUrl', e.target.value)}
                                    placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px] text-emerald-600"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddLesson(sec.id)}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Lesson to Section
                          </button>
                        </div>

                        {/* Quiz Editor for Section */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                          {sec.quiz ? (
                            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                  <HelpCircle className="w-4 h-4" /> Section Quiz Configured ({sec.quiz.questions?.length || 0} Questions)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddOrToggleQuiz(sec.id)}
                                  className="text-xs text-rose-500 hover:underline font-bold"
                                >
                                  Remove Quiz
                                </button>
                              </div>

                              {/* Question 1 Edit */}
                              {sec.quiz.questions?.[0] && (
                                <div className="space-y-2 pt-1">
                                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Sample Question Text</label>
                                  <input
                                    type="text"
                                    value={sec.quiz.questions[0].question}
                                    onChange={(e) => handleUpdateQuizQuestion(sec.id, 0, 'question', e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-amber-300 rounded-lg text-xs"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddOrToggleQuiz(sec.id)}
                              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Attach Timed Quiz to Section
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Modal Save Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">
                  {editSections.length} Sections • {editSections.reduce((acc, s) => acc + s.lessons.length, 0)} Total Videos
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 font-bold text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-1.5 text-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Course & Modules</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
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
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="Past Paper Discussion">Past Paper Discussion</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Fee (LKR)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
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
