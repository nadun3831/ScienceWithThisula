import React, { useState } from 'react';
import QuizModal from '../components/QuizModal';
import CertificateModal from '../components/CertificateModal';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Download, 
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { LECTURER_INFO } from '../data/mockData';

export default function LearningCoursePage({ course, onBack }) {
  const [activeLesson, setActiveLesson] = useState(course.sections[0]?.lessons[0] || null);
  const [completedLessonIds, setCompletedLessonIds] = useState(['les-1']);
  const [passedQuizIds, setPassedQuizIds] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Total lessons count & calculation
  const totalLessons = course.sections.reduce((acc, sec) => acc + sec.lessons.length, 0);
  const progressPercent = Math.round((completedLessonIds.length / totalLessons) * 100);

  const handleToggleLessonComplete = (lessonId) => {
    if (completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessonIds(prev => [...prev, lessonId]);
    }
  };

  const handleLaunchQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setShowQuizModal(true);
  };

  const handlePassQuiz = (quizId) => {
    if (!passedQuizIds.includes(quizId)) {
      setPassedQuizIds(prev => [...prev, quizId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb & Course Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {course.subject} • {course.grade}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress Badge & Certificate CTA */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-mono">Course Completion</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <span className="text-xs font-bold font-mono text-emerald-600">{progressPercent}%</span>
            </div>
          </div>

          <button
            onClick={() => setShowCertModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Certificate</span>
          </button>
        </div>
      </div>

      {/* Main LMS Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Video / Content Viewer Pane */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Media Player Card */}
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            {activeLesson ? (
              <div>
                {/* Video Player */}
                <div className="aspect-video relative bg-black">
                  <video
                    src={activeLesson.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Video Title & Actions */}
                <div className="p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800 bg-slate-900">
                  <div>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">
                      Lesson Content • {activeLesson.duration}
                    </span>
                    <h2 className="text-lg font-bold font-heading">{activeLesson.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 font-sans">{activeLesson.summary}</p>
                  </div>

                  <button
                    onClick={() => handleToggleLessonComplete(activeLesson.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                      completedLessonIds.includes(activeLesson.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedLessonIds.includes(activeLesson.id) ? 'Completed ✓' : 'Mark as Complete'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                Select a lesson from the module sidebar to begin learning.
              </div>
            )}
          </div>

          {/* Module Notes & Downloadable Resources */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Downloadable Revision Notes & Past Papers</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Module Summary PDF</h4>
                    <span className="text-[10px] text-slate-500">2.4 MB • G.C.E. O/L Standard</span>
                  </div>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">Download</button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Past Paper Diagrams Guide</h4>
                    <span className="text-[10px] text-slate-500">1.8 MB • Lecturer Thisula</span>
                  </div>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">Download</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Modules & Quiz Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Course Curriculum</span>
            </h3>

            {/* Sections Accordion */}
            <div className="space-y-4">
              {course.sections.map((section) => (
                <div key={section.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                  
                  {/* Section Title Header */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{section.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{section.lessons.length} Lessons</span>
                  </div>

                  {/* Lessons List */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {section.lessons.map(les => {
                      const isActive = activeLesson?.id === les.id;
                      const isDone = completedLessonIds.includes(les.id);
                      return (
                        <div
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`p-3.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="line-clamp-1">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{les.duration}</span>
                        </div>
                      );
                    })}

                    {/* Section Quiz Item */}
                    {section.quiz && (
                      <div className="p-3.5 bg-amber-500/10 border-t border-amber-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                          <HelpCircle className="w-4 h-4" />
                          <span>{section.quiz.title}</span>
                        </div>
                        <button
                          onClick={() => handleLaunchQuiz(section.quiz)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-lg transition-colors shadow-sm"
                        >
                          {passedQuizIds.includes(section.quiz.id) ? 'Passed ✓' : 'Take Quiz'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Instructor Bio Box */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex items-center gap-4">
            <img src={LECTURER_INFO.photo} alt="Lecturer Thisula" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
            <div>
              <h4 className="text-xs font-bold font-heading">{LECTURER_INFO.name}</h4>
              <p className="text-[10px] text-emerald-400 font-mono">{LECTURER_INFO.qualifications}</p>
              <p className="text-[10px] text-slate-400 mt-1">Need help? Ask in the live student Q&A forum.</p>
            </div>
          </div>

        </div>

      </div>

      {/* Quiz Modal */}
      {showQuizModal && activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setShowQuizModal(false)}
          onPassQuiz={handlePassQuiz}
        />
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          course={course}
          onClose={() => setShowCertModal(false)}
        />
      )}

    </div>
  );
}
