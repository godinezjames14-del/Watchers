import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Check, 
  ChevronRight,
  Copy,
  Clock,
  X
} from 'lucide-react';
import { CourseSubject, StudentSubmission, AssessmentItem, AssessmentType } from '../types';
import { mockTeacherSections, mockStudentSubmissions } from '../data/teacherData';
import { GradeSubmissionModal } from './GradeSubmissionModal';
import { CreateAssessmentModal } from './CreateAssessmentModal';

interface TeacherDashboardProps {
  onNavigateToAppDemo?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = () => {
  const [sections, setSections] = useState<CourseSubject[]>(mockTeacherSections);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(mockStudentSubmissions);
  const [selectedSection, setSelectedSection] = useState<CourseSubject | null>(null);
  const [sectionTab, setSectionTab] = useState<'assessments' | 'grading'>('assessments');

  // Modals
  const [gradingSubmission, setGradingSubmission] = useState<StudentSubmission | null>(null);
  const [isCreateAssessmentOpen, setIsCreateAssessmentOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New section form
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSection, setNewSection] = useState('');
  const [newJoinCode, setNewJoinCode] = useState('');

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSaveGrade = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              scoreEarned: score,
              teacherFeedback: feedback,
              status: 'graded',
            }
          : sub
      )
    );
  };

  const handleAddAssessment = (newAssessment: AssessmentItem) => {
    if (!selectedSection) return;
    const updated: CourseSubject = {
      ...selectedSection,
      assessments: [newAssessment, ...(selectedSection.assessments || [])],
    };
    setSections((prev) => prev.map((s) => (s.id === selectedSection.id ? updated : s)));
    setSelectedSection(updated);
  };

  const handleCreateSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;
    const created: CourseSubject = {
      id: `sec-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      instructor: 'Prof. Elena Ramirez',
      section: newSection.trim() || 'Section A',
      joinCode: newJoinCode.trim().toUpperCase() || `SEC${Math.floor(1000 + Math.random() * 9000)}`,
      aiPolicyTier: 'brainstorming',
      verifiedConceptsCount: 0,
      totalConceptsCount: 15,
      classTotalStudents: 30,
      classAveragePercentage: 80,
      assessments: [],
    };
    setSections((prev) => [created, ...prev]);
    setIsCreateSectionOpen(false);
    setNewCode('');
    setNewTitle('');
    setNewSection('');
    setNewJoinCode('');
  };

  const sectionSubmissions = selectedSection
    ? submissions.filter((s) => s.subjectCode === selectedSection.code)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* View 1: Sections Roster */}
      {!selectedSection ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
                Teaching Sections
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Prof. Elena Ramirez</span>
                <span aria-hidden="true">·</span>
                <span>College of Computer Studies</span>
                <span aria-hidden="true">·</span>
                <span>{sections.length} active courses</span>
              </div>
            </div>

            <button
              onClick={() => setIsCreateSectionOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold transition self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject / Section</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Assigned Roster</span>
              <span>Click a section to manage assessments & grade submissions</span>
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
              {sections.map((sec) => {
                const pendingCount = submissions.filter(
                  (s) => s.subjectCode === sec.code && s.status === 'needs_grading'
                ).length;

                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSection(sec)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 cursor-pointer transition group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-amber-400">
                          {sec.code}
                        </span>
                        <span className="text-slate-500 text-xs">·</span>
                        <h2 className="text-sm font-medium text-slate-100 group-hover:text-amber-300 transition">
                          {sec.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{sec.section}</span>
                        <span aria-hidden="true">·</span>
                        <span>{sec.classTotalStudents} Enrolled</span>
                        <span aria-hidden="true">·</span>
                        <button
                          onClick={(e) => handleCopyCode(sec.joinCode, e)}
                          className="font-mono text-slate-400 hover:text-amber-300 transition inline-flex items-center gap-1"
                          title="Click to copy student join code"
                        >
                          Code: {sec.joinCode}
                          {copiedCode === sec.joinCode ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto text-xs">
                      {pendingCount > 0 ? (
                        <span className="text-amber-400 font-medium tabular-nums">
                          {pendingCount} to grade
                        </span>
                      ) : (
                        <span className="text-slate-500">Grading up to date</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* View 2: Section Workspace */
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <button
              onClick={() => setSelectedSection(null)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all sections</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Join Code: <strong className="text-amber-400">{selectedSection.joinCode}</strong>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-semibold">{selectedSection.code}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedSection.section}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedSection.classTotalStudents} Students</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-100 mt-1">
              {selectedSection.title}
            </h1>
          </div>

          {/* Minimal 2-Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-800 text-xs">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSectionTab('assessments')}
                className={`pb-3 font-medium transition-colors ${
                  sectionTab === 'assessments'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Assessments & Quizzes ({selectedSection.assessments?.length || 0})
              </button>
              <button
                onClick={() => setSectionTab('grading')}
                className={`pb-3 font-medium transition-colors ${
                  sectionTab === 'grading'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Student Submissions ({sectionSubmissions.length})
              </button>
            </div>

            {sectionTab === 'assessments' && (
              <button
                onClick={() => setIsCreateAssessmentOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md text-xs font-semibold transition -mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Assessment</span>
              </button>
            )}
          </div>

          {/* Assessments Tab */}
          {sectionTab === 'assessments' && (
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Title</th>
                    <th className="py-2.5 px-4 font-medium">Type</th>
                    <th className="py-2.5 px-4 font-medium">Due Date</th>
                    <th className="py-2.5 px-4 font-medium text-right">Max Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {(selectedSection.assessments || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No assessments added yet. Click &ldquo;Add Assessment&rdquo; to create a quiz, activity, or major exam.
                      </td>
                    </tr>
                  ) : (
                    (selectedSection.assessments || []).map((ass) => (
                      <tr key={ass.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-200">
                          {ass.title}
                        </td>
                        <td className="py-3 px-4 text-slate-400 capitalize">
                          {ass.type.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {ass.dateSubmitted || 'Upcoming'}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-slate-200 tabular-nums">
                          {ass.maxScore} pts
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Submissions & Grading Tab */}
          {sectionTab === 'grading' && (
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Student</th>
                    <th className="py-2.5 px-4 font-medium">Assessment</th>
                    <th className="py-2.5 px-4 font-medium">Submitted</th>
                    <th className="py-2.5 px-4 font-medium text-right">Score</th>
                    <th className="py-2.5 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {sectionSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No submissions in this section yet.
                      </td>
                    </tr>
                  ) : (
                    sectionSubmissions.map((sub) => {
                      const isGraded = sub.status === 'graded';
                      return (
                        <tr key={sub.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-200 block">{sub.studentName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{sub.studentId}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {sub.assessmentTitle}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {sub.submittedAt}
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                            {isGraded ? `${sub.scoreEarned} / ${sub.maxScore}` : '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setGradingSubmission(sub)}
                              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                                isGraded
                                  ? 'text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
                              }`}
                            >
                              {isGraded ? 'Edit Grade' : 'Grade'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <GradeSubmissionModal
          submission={gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          onSaveGrade={handleSaveGrade}
        />
      )}

      {/* Create Assessment Modal */}
      {selectedSection && (
        <CreateAssessmentModal
          isOpen={isCreateAssessmentOpen}
          onClose={() => setIsCreateAssessmentOpen(false)}
          sectionCode={selectedSection.code}
          sectionName={selectedSection.section}
          onAddAssessment={handleAddAssessment}
        />
      )}

      {/* New Section Modal */}
      {isCreateSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-100">
                Create Subject / Section
              </h2>
              <button
                onClick={() => setIsCreateSectionOpen(false)}
                className="text-slate-500 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS 103"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Subject Title</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Section</label>
                  <input
                    type="text"
                    placeholder="e.g. Section B"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Join Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS103B"
                    value={newJoinCode}
                    onChange={(e) => setNewJoinCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateSectionOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
