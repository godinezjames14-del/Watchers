import React, { useState } from 'react';
import { 
  Plus, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { UserAccount, CourseSubject } from '../types';
import { mockCourses } from '../data/studyData';
import { SubjectDetailView } from './SubjectDetailView';
import { EnrollCourseModal } from './EnrollCourseModal';

interface DashboardViewProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onNavigateToWorkspace: () => void;
  onNavigateToAppDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
}) => {
  const [courses, setCourses] = useState<CourseSubject[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<CourseSubject | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const handleEnrollSuccess = (newCourse: CourseSubject) => {
    setCourses((prev) => [newCourse, ...prev]);
    // Directly navigate to the newly enrolled course in full page view
    setSelectedCourse(newCourse);
    setIsEnrollModalOpen(false);
  };

  // Calculate overall student metrics
  const totalEarnedOverall = courses.reduce((sum, c) => {
    return sum + (c.assessments?.reduce((s, a) => s + a.score, 0) || 0);
  }, 0);
  const totalMaxOverall = courses.reduce((sum, c) => {
    return sum + (c.assessments?.reduce((s, a) => s + a.maxScore, 0) || 0);
  }, 0);
  const overallAvg = totalMaxOverall > 0 ? (totalEarnedOverall / totalMaxOverall) * 100 : 88.5;

  // If a subject is selected, replace the whole page with the full SubjectDetailView
  if (selectedCourse) {
    return (
      <SubjectDetailView
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
            Enrolled Subjects
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{currentUser.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">ID {currentUser.studentOrFacultyId}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.institution}</span>
          </div>
        </div>

        <button
          onClick={() => setIsEnrollModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll with Code</span>
        </button>
      </div>

      {/* Quiet Academic Summary Bar */}
      <div className="grid grid-cols-3 gap-4 py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400">
        <div>
          <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-mono">Enrolled</span>
          <span className="text-base font-semibold text-slate-200 tabular-nums">{courses.length} subjects</span>
        </div>
        <div>
          <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-mono">Overall Average</span>
          <span className="text-base font-semibold text-slate-200 tabular-nums">{overallAvg.toFixed(1)}%</span>
        </div>
        <div>
          <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-mono">Class Percentile</span>
          <span className="text-base font-semibold text-amber-400 tabular-nums">87th Percentile</span>
        </div>
      </div>

      {/* Subjects Roster */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
          <span>Current Term Courses</span>
          <span>Click any subject to view quizzes, activities & exams</span>
        </div>

        <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
          {courses.map((course) => {
            const assessments = course.assessments || [];
            const earned = assessments.reduce((acc, a) => acc + a.score, 0);
            const max = assessments.reduce((acc, a) => acc + a.maxScore, 0);
            const pct = max > 0 ? (earned / max) * 100 : 0;
            const classAvg = course.classAveragePercentage || 78;
            const delta = pct - classAvg;
            const percentile = Math.min(99, Math.max(15, 50 + Math.round(delta * 2.8)));

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 cursor-pointer transition group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-amber-400">
                      {course.code}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <h2 className="text-sm font-medium text-slate-100 group-hover:text-amber-300 transition">
                      {course.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{course.instructor}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.section}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">Code: {course.joinCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto text-xs">
                  <div className="text-right">
                    <div className="font-semibold text-slate-200 tabular-nums">
                      {earned} / {max} pts
                    </div>
                    <div className="text-[11px] text-slate-400 tabular-nums">
                      {pct.toFixed(1)}% · {percentile}th percentile
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enroll Course Modal */}
      <EnrollCourseModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        enrolledCourseCodes={courses.map((c) => c.code)}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  );
};
