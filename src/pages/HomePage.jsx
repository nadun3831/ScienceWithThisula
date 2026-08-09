import React from 'react';
import ThreeHeroBackground from '../components/ThreeHeroBackground';
import ThreeLecturerCard from '../components/ThreeLecturerCard';
import CourseCard from '../components/CourseCard';
import { LECTURER_INFO, COURSES, TESTIMONIALS } from '../data/mockData';
import { 
  Sparkles, 
  Atom, 
  Award, 
  BookOpen, 
  ArrowRight, 
  PlayCircle, 
  GraduationCap,
  Star,
  ShieldCheck
} from 'lucide-react';

export default function HomePage({ onSelectCourse, setActivePage }) {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section with Ambient Background & Lecturer Photo */}
      <section className="relative bg-slate-900 text-white min-h-[600px] pt-12 pb-20 flex items-center overflow-hidden">
        <ThreeHeroBackground />

        {/* Ambient Gradient Lighting */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Intro */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Sri Lanka's #1 Motion Science LMS Platform</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Master O/L & A/L Science with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">Interactive Motion</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
              Experience Biology, Chemistry, and Physics like never before. Designed by <strong className="text-white font-semibold">{LECTURER_INFO.name}</strong> to transform abstract concepts into vivid spatial models and guaranteed exam results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActivePage('courses')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-600/30 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Science Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCourse(COURSES[3])} // Free Past Paper course
                className="bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 backdrop-blur-md flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5 text-emerald-400" />
                <span>Try Free Past Paper Masterclass</span>
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="text-2xl font-extrabold text-white font-heading">{LECTURER_INFO.studentsTaught}</div>
                <div className="text-xs text-slate-400">Enrolled Students</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-400 font-heading">{LECTURER_INFO.passRate}</div>
                <div className="text-xs text-slate-400">Exam Pass Rate</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white font-heading">{LECTURER_INFO.experience}</div>
                <div className="text-xs text-slate-400">Teaching Experience</div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Lecturer Photo portrait (No box) */}
          <div className="lg:col-span-5">
            <ThreeLecturerCard />
          </div>

        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <Atom className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Spatial Science Visuals
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inspect cellular organelle functions, electron shell orbitals, and light ray refractions with interactive visual models.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Instant Auto-Graded Quizzes
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Test your understanding after every module with timed quizzes, detailed explanations, and immediate feedback.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
              Printable Certified Diplomas
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Earn official certificates upon 100% course completion signed by Lecturer Thisula with unique verification codes.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Curated Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
              Featured Science Modules
            </h2>
          </div>

          <button
            onClick={() => setActivePage('courses')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))}
        </div>
      </section>

      {/* Lecturer Profile Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={LECTURER_INFO.photo}
                  alt="Lecturer Thisula"
                  className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl object-cover border-4 border-emerald-500 shadow-2xl"
                />
                <div className="absolute -bottom-3 bg-emerald-600 text-white text-xs font-bold font-mono px-4 py-1 rounded-full shadow-lg">
                  Head Lecturer
                </div>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mt-6">{LECTURER_INFO.name}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-1">{LECTURER_INFO.qualifications}</p>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Meet Your Instructor
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Dedicated to Making Science Easy, Visual & High-Scoring
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {LECTURER_INFO.bio}
              </p>

              <div className="space-y-2.5 pt-2">
                {LECTURER_INFO.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setActivePage('courses')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <span>Enroll in Lecturer Thisula's Classes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Student Success Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
            What Our Island Top Achievers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed font-sans">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-700">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-heading">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.school}</p>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">{t.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
