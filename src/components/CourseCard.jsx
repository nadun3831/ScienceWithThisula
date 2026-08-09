import React from 'react';
import { Star, Clock, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function CourseCard({ course, onSelectCourse }) {
  return (
    <div 
      onClick={() => onSelectCourse(course)}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Subject & Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-emerald-600/90 text-white font-mono text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
            {course.subject}
          </span>
          {course.badge && (
            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {course.badge}
            </span>
          )}
        </div>

        {/* Grade Level */}
        <div className="absolute top-3 right-3">
          <span className="bg-slate-900/80 text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-slate-700">
            {course.grade}
          </span>
        </div>

        {/* Lessons count overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs text-white/90">
          <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> {course.lessonsCount} Lessons
          </span>
          <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {course.duration}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 font-sans">
            {course.description}
          </p>
        </div>

        {/* Rating & Student Stats */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
            <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1 font-medium text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.studentsCount.toLocaleString()} Enrolled</span>
          </div>
        </div>

        {/* Price & CTA Button */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {course.isFree ? (
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                FREE
              </span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-400">LKR</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {course.price.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <button className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 group-hover:bg-emerald-600 group-hover:text-white">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
