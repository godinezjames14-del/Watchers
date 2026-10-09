import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, CourseSubject, AssessmentItem } from '../types';
import { mockCourses } from '../data/studyData';
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
  const [assessmentFilter, setAssessmentFilter] = useState<'all' | 'quiz' | 'activity' | 'major_exam'>('all');

  const handleEnrollSuccess = (newCourse: CourseSubject) => {
    setCourses((prev) => [newCourse, ...prev]);
    setSelectedCourse(newCourse);
    setIsEnrollModalOpen(false);
  };

  // Calculations for overall student summary
  const totalEarnedOverall = courses.reduce((sum, c) => {
    return sum + (c.assessments?.reduce((s, a) => s + a.score, 0) || 0);
  }, 0);
  const totalMaxOverall = courses.reduce((sum, c) => {
    return sum + (c.assessments?.reduce((s, a) => s + a.maxScore, 0) || 0);
  }, 0);
  const overallAvg = totalMaxOverall > 0 ? (totalEarnedOverall / totalMaxOverall) * 100 : 88.5;

  // If a subject is selected, render the dedicated Subject Detail Full Page view
  if (selectedCourse) {
    const assessments = selectedCourse.assessments || [];
    const totalEarned = assessments.reduce((acc, item) => acc + item.score, 0);
    const totalMax = assessments.reduce((acc, item) => acc + item.maxScore, 0);
    const overallPercentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

    // Percentile calculation
    const classAvg = selectedCourse.classAveragePercentage || 78;
    const deltaFromAvg = overallPercentage - classAvg;
    let percentileRank = 50 + Math.round(deltaFromAvg * 2.8);
    percentileRank = Math.min(99, Math.max(15, percentileRank));

    const filteredItems = assessments.filter((item) => {
      if (assessmentFilter !== 'all' && item.type !== assessmentFilter) return false;
      return true;
    });

    const formatType = (t: string) => {
      switch (t) {
        case 'quiz': return 'Quiz';
        case 'activity': return 'Activity';
        case 'major_exam': return 'Major Exam';
        default: return t;
      }
    };

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Return Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <button
            onClick={() => setSelectedCourse(null)}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Subjects</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            Join Code: <strong className="text-amber-400">{selectedCourse.joinCode}</strong>
          </span>
        </div>

        {/* Subject Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-amber-400 font-semibold">{selectedCourse.code}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedCourse.section}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedCourse.instructor}</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-100 mt-1">
            {selectedCourse.title}
          </h1>
        </div>

        {/* Percentile, Percentage, and Score Sum AT THE TOP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Total Score Sum
            </span>
            <span className="text-xl font-semibold text-slate-100 tabular-nums">
              {totalEarned} / {totalMax} <span className="text-xs font-normal text-slate-400">pts</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Overall Percentage
            </span>
            <span className="text-xl font-semibold text-slate-100 tabular-nums">
              {overallPercentage.toFixed(1)}%
            </span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
              Class Percentile
            </span>
            <span className="text-xl font-semibold text-amber-400 tabular-nums">
              {percentileRank}th Percentile
            </span>
          </div>
        </div>

        {/* Minimal Category Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 text-xs pt-2">
          <div className="flex items-center gap-5">
            {(['all', 'quiz', 'activity', 'major_exam'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setAssessmentFilter(cat)}
                className={`pb-3 font-medium transition-colors ${
                  assessmentFilter === cat
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all'
                  ? `All Items (${assessments.length})`
                  : cat === 'quiz'
                  ? `Quizzes (${assessments.filter((a) => a.type === 'quiz').length})`
                  : cat === 'activity'
                  ? `Activities (${assessments.filter((a) => a.type === 'activity').length})`
                  : `Major Exams (${assessments.filter((a) => a.type === 'major_exam').length})`}
              </button>
            ))}
          </div>

          <span className="text-slate-500 text-[11px]">
            {filteredItems.length} records shown
          </span>
        </div>

        {/* Assessments List Table */}
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/30">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-medium">Assessment Title</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Date</th>
                <th className="py-2.5 px-4 font-medium text-right">Score Earned</th>
                <th className="py-2.5 px-4 font-medium text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No assessments recorded in this category.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const pct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {formatType(item.type)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {item.dateSubmitted || 'Completed'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-200 tabular-nums">
                        {item.score} / {item.maxScore}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                        {pct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Primary Subjects Roster View (when no subject is actively open)
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
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

      {/* Summary Bar */}
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
          <span>Click any subject to open its full gradebook & assessment records</span>
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
