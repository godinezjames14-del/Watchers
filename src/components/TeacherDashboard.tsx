import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Copy, 
  Users, 
  BarChart3, 
  X,
  Edit2,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { CourseSubject, StudentSubmission, AssessmentItem, AssessmentType, StudentExamTelemetry } from '../types';
import { mockTeacherSections, mockStudentSubmissions } from '../data/teacherData';
import { generateSubmissionsForAssessment, allStudentProfiles } from '../data/studentRoster';
import { mockExamTelemetryRecords } from '../data/telemetryData';
import { GradeSubmissionModal } from './GradeSubmissionModal';
import { CreateAssessmentModal } from './CreateAssessmentModal';
import { RAGTestGeneratorModal } from './RAGTestGeneratorModal';
import { TelemetryAnalyticsDrawer } from './TelemetryAnalyticsDrawer';

interface TeacherDashboardProps {
  onNavigateToAppDemo?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = () => {
  const [sections, setSections] = useState<CourseSubject[]>(mockTeacherSections);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(mockStudentSubmissions);
  const [selectedSection, setSelectedSection] = useState<CourseSubject | null>(null);
  const [sectionTab, setSectionTab] = useState<'assessments' | 'grading'>('assessments');

  // Currently inspected quiz for student scores
  const [selectedAssessmentForScores, setSelectedAssessmentForScores] = useState<AssessmentItem | null>(null);

  // Smart filter for live test assessment roster: 'all' | 'needs_watching' | 'clean'
  const [rosterRiskFilter, setRosterRiskFilter] = useState<'all' | 'needs_watching' | 'clean'>('all');

  // Modals & Drawers
  const [gradingSubmission, setGradingSubmission] = useState<StudentSubmission | null>(null);
  const [isCreateAssessmentOpen, setIsCreateAssessmentOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isRAGModalOpen, setIsRAGModalOpen] = useState(false);
  const [selectedTelemetry, setSelectedTelemetry] = useState<StudentExamTelemetry | null>(null);
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
      aiPolicyDescription: 'AI brainstorming permitted with declaration',
      activeTopic: 'Introduction & Foundations',
      competencyProgress: 65,
      color: 'amber',
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

  // When teacher clicks a quiz, ensure submissions exist for all enrolled students
  const handleOpenAssessmentScores = (ass: AssessmentItem) => {
    if (!selectedSection) return;

    // Check existing submissions for this assessment
    const existing = submissions.filter(
      (s) => s.assessmentId === ass.id || s.assessmentTitle === ass.title
    );

    if (existing.length === 0) {
      // Generate realistic distributed scores for enrolled students
      const generated = generateSubmissionsForAssessment(
        ass.id,
        ass.title,
        ass.type,
        selectedSection.code,
        ass.maxScore
      );
      setSubmissions((prev) => [...generated, ...prev]);
    }

    setSelectedAssessmentForScores(ass);
    setRosterRiskFilter('all');
  };

  // Submissions for the currently inspected quiz
  const currentAssessmentSubmissions = selectedAssessmentForScores && selectedSection
    ? submissions.filter(
        (s) =>
          (s.assessmentId === selectedAssessmentForScores.id ||
            s.assessmentTitle === selectedAssessmentForScores.title) &&
          (s.subjectCode === selectedSection.code || !s.subjectCode)
      )
    : [];

  // Summary stats for the currently inspected quiz
  const gradedAssessmentSubmissions = currentAssessmentSubmissions.filter(
    (s) => s.scoreEarned !== null && s.scoreEarned !== undefined
  );
  const avgQuizScore =
    gradedAssessmentSubmissions.length > 0
      ? gradedAssessmentSubmissions.reduce((sum, s) => sum + (s.scoreEarned || 0), 0) /
        gradedAssessmentSubmissions.length
      : 0;
  const avgQuizPercent =
    selectedAssessmentForScores && selectedAssessmentForScores.maxScore > 0
      ? (avgQuizScore / selectedAssessmentForScores.maxScore) * 100
      : 0;

  const highestScore = gradedAssessmentSubmissions.length > 0
    ? Math.max(...gradedAssessmentSubmissions.map((s) => s.scoreEarned || 0))
    : 0;
  const lowestScore = gradedAssessmentSubmissions.length > 0
    ? Math.min(...gradedAssessmentSubmissions.map((s) => s.scoreEarned || 0))
    : 0;

  // Retrieve or synthesize telemetry record for any student in this quiz
  const getStudentTelemetry = (sub: StudentSubmission): StudentExamTelemetry => {
    const quizKey = selectedAssessmentForScores?.id || 'cs-q1';
    const existingRecords = mockExamTelemetryRecords[quizKey] || mockExamTelemetryRecords['cs-q1'] || [];
    const found = existingRecords.find((r) => r.studentId === sub.studentId);

    if (found) return found;

    // Deterministic synthesized telemetry based on student ID hash
    const isFlagged = sub.studentId.endsWith('18-MN') || sub.studentId.endsWith('94-MN');
    const away = isFlagged ? 8.2 : 0;
    const switches = isFlagged ? 2 : 0;
    const score = isFlagged ? 68 : 8;

    return {
      studentId: sub.studentId,
      studentName: sub.studentName,
      studentAvatar: sub.studentAvatar,
      assessmentId: quizKey,
      assessmentTitle: sub.assessmentTitle,
      totalAwaySeconds: away,
      tabSwitchCount: switches,
      fleetingAbsencesCount: 1,
      pasteFloodDetected: isFlagged,
      riskScore: score,
      riskTier: isFlagged ? 'Needs Watching' : 'Clean',
      eventsLog: [
        {
          id: `ev-${sub.studentId}-1`,
          timestamp: '10:00:15 AM',
          type: 'question_start',
          description: 'Exam started cleanly with active window focus',
          riskWeight: 0,
        },
        ...(isFlagged
          ? [
              {
                id: `ev-${sub.studentId}-2`,
                timestamp: '10:02:40 AM',
                type: 'tab_switch' as const,
                durationSeconds: away,
                description: `Prolonged absence detected (${away}s away from test window)`,
                riskWeight: 35,
              },
            ]
          : []),
      ],
      questionTiming: [
        {
          questionId: 'q1',
          questionPrompt: 'Asymptotic Definition & Big-O Invariants',
          difficulty: 'Easy',
          timeSpentSeconds: 32,
          anomalousSpeed: false,
        },
        {
          questionId: 'q2',
          questionPrompt: 'Amortized Array Doubling Cost Analysis',
          difficulty: 'Medium',
          timeSpentSeconds: 54,
          anomalousSpeed: false,
        },
        {
          questionId: 'q3',
          questionPrompt: 'Iterative Heap Stack Traversal Implementation',
          difficulty: 'Hard',
          timeSpentSeconds: isFlagged ? 3.6 : 82,
          anomalousSpeed: isFlagged,
        },
      ],
      microDefenseTriggered: isFlagged,
      microDefenseQuestion: isFlagged
        ? 'Could you explain how your heap stack avoids OS stack memory limits in your own words?'
        : undefined,
      microDefenseAnswer: isFlagged
        ? 'Heap memory is dynamically managed by the runtime and limited only by available system RAM rather than fixed 8MB thread stacks.'
        : undefined,
      microDefenseVerified: isFlagged,
    };
  };

  // Filter student submissions by telemetry risk tier
  const filteredSubmissions = currentAssessmentSubmissions.filter((sub) => {
    if (rosterRiskFilter === 'all') return true;
    const tel = getStudentTelemetry(sub);
    if (rosterRiskFilter === 'needs_watching') return tel.riskTier === 'Needs Watching';
    if (rosterRiskFilter === 'clean') return tel.riskTier === 'Clean';
    return true;
  });

  const needsWatchingCount = currentAssessmentSubmissions.filter(
    (s) => getStudentTelemetry(s).riskTier === 'Needs Watching'
  ).length;
  const cleanCount = currentAssessmentSubmissions.length - needsWatchingCount;

  const sectionSubmissions = selectedSection
    ? submissions.filter((s) => s.subjectCode === selectedSection.code)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-150">
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
              <span>Click a section to manage assessments & view student scores</span>
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
              {sections.map((sec) => {
                const pendingCount = submissions.filter(
                  (s) => s.subjectCode === sec.code && s.status === 'needs_grading'
                ).length;
                const enrolledCount = allStudentProfiles.filter((s) =>
                  s.enrolledSubjectCodes.includes(sec.code)
                ).length;

                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setSelectedSection(sec);
                      setSelectedAssessmentForScores(null);
                    }}
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
                        <span>{enrolledCount || sec.classTotalStudents} Enrolled Students</span>
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
      ) : selectedAssessmentForScores ? (
        /* View 3: Specific Quiz Student Scorebook & Telemetry Roster */
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <button
              onClick={() => setSelectedAssessmentForScores(null)}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Assessments List</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Subject: <strong className="text-amber-400">{selectedSection.code}</strong> · {selectedSection.section}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-semibold uppercase">
                {selectedAssessmentForScores.type.replace('_', ' ')}
              </span>
              <span aria-hidden="true">·</span>
              <span>Max Score: {selectedAssessmentForScores.maxScore} pts</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{selectedAssessmentForScores.date || 'Active Assessment'}</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-100 mt-1">
              {selectedAssessmentForScores.title} — Student Scorebook
            </h1>
          </div>

          {/* Top Summary Bar for this Quiz */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div>
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Submissions
              </span>
              <span className="text-lg font-semibold text-slate-100 tabular-nums">
                {currentAssessmentSubmissions.length} Students
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Class Average
              </span>
              <span className="text-lg font-semibold text-amber-400 tabular-nums">
                {avgQuizScore.toFixed(1)} / {selectedAssessmentForScores.maxScore} pts
              </span>
              <span className="block text-[11px] text-slate-400">
                ({avgQuizPercent.toFixed(1)}%)
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Telemetry Risk
              </span>
              <span className="text-lg font-semibold text-amber-400 tabular-nums">
                {needsWatchingCount} Flagged
              </span>
              <span className="block text-[11px] text-slate-400">
                {cleanCount} verified clean
              </span>
            </div>

            <div>
              <span className="block text-[11px] text-slate-500 font-mono uppercase tracking-wider">
                Score Range
              </span>
              <span className="text-lg font-semibold text-emerald-400 tabular-nums">
                {lowestScore} – {highestScore} pts
              </span>
            </div>
          </div>

          {/* Smart Filters: Clean vs Needs Watching */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-medium">Filter Roster:</span>
              <button
                onClick={() => setRosterRiskFilter('all')}
                className={`transition-colors ${
                  rosterRiskFilter === 'all'
                    ? 'text-amber-400 font-semibold underline underline-offset-4'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Students ({currentAssessmentSubmissions.length})
              </button>
              <button
                onClick={() => setRosterRiskFilter('needs_watching')}
                className={`transition-colors flex items-center gap-1.5 ${
                  rosterRiskFilter === 'needs_watching'
                    ? 'text-amber-400 font-semibold underline underline-offset-4'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Needs Watching ({needsWatchingCount})</span>
              </button>
              <button
                onClick={() => setRosterRiskFilter('clean')}
                className={`transition-colors ${
                  rosterRiskFilter === 'clean'
                    ? 'text-emerald-400 font-semibold underline underline-offset-4'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Clean ({cleanCount})
              </button>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
              Smart Grace Period Active (Fleeting &lt;3s ignored)
            </span>
          </div>

          {/* Student Scores Table with Telemetry Alerts & Drawer trigger */}
          <div className="space-y-3">
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Student Name</th>
                    <th className="py-3 px-4 font-medium">Student ID</th>
                    <th className="py-3 px-4 font-medium">Behavioral Risk</th>
                    <th className="py-3 px-4 font-medium">Submission Time</th>
                    <th className="py-3 px-4 font-medium text-right">Score Earned</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No students in this filter view.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const tel = getStudentTelemetry(sub);
                      const isNeedsWatching = tel.riskTier === 'Needs Watching';
                      const score = sub.scoreEarned;
                      const max = sub.maxScore;
                      const pct = score !== null ? (score / max) * 100 : 0;
                      const isGraded = sub.status === 'graded';

                      return (
                        <tr key={sub.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-200">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={sub.studentAvatar}
                                alt={sub.studentName}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                              />
                              <span>{sub.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {sub.studentId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isNeedsWatching
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              }`}>
                                {tel.riskTier}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {tel.tabSwitchCount > 0
                                  ? `${tel.tabSwitchCount} switches (${tel.totalAwaySeconds}s)`
                                  : '0 absences'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {sub.submittedAt}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-slate-200 tabular-nums">
                            {isGraded ? `${score} / ${max} pts (${pct.toFixed(0)}%)` : 'Needs Grading'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedTelemetry(tel)}
                                className="px-2.5 py-1 rounded text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-800/50 hover:bg-amber-950/30 transition flex items-center gap-1"
                                title="View Time vs Difficulty Chart & Activity Timeline"
                              >
                                <BarChart3 className="w-3 h-3" />
                                <span>Analytics</span>
                              </button>
                              <button
                                onClick={() => setGradingSubmission(sub)}
                                className="px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition"
                              >
                                {isGraded ? 'Edit Grade' : 'Grade'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* View 2: Section Workspace (Assessments & Submissions tabs) */
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
              <span>
                {allStudentProfiles.filter((s) => s.enrolledSubjectCodes.includes(selectedSection.code)).length ||
                  selectedSection.classTotalStudents}{' '}
                Students Enrolled
              </span>
            </div>
            <h1 className="text-xl font-semibold text-slate-100 mt-1">
              {selectedSection.title}
            </h1>
          </div>

          {/* Minimal 2-Tab Navigation with RAG Generator Action */}
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
              <div className="flex items-center gap-2 -mt-2">
                <button
                  onClick={() => setIsRAGModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 rounded-md text-xs font-semibold transition"
                  title="Generate quiz grounded in uploaded syllabus/notes"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Test Gen (RAG)</span>
                </button>

                <button
                  onClick={() => setIsCreateAssessmentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Assessment</span>
                </button>
              </div>
            )}
          </div>

          {/* Assessments Tab */}
          {sectionTab === 'assessments' && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                <span>Assessments Roster</span>
                <span className="text-amber-400">Click any quiz to view individual student scores & telemetry</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Title</th>
                      <th className="py-2.5 px-4 font-medium">Type</th>
                      <th className="py-2.5 px-4 font-medium">Date</th>
                      <th className="py-2.5 px-4 font-medium text-right">Max Points</th>
                      <th className="py-2.5 px-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {(selectedSection.assessments || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No assessments added yet. Click &ldquo;Add Assessment&rdquo; or &ldquo;AI Test Gen (RAG)&rdquo; to generate a quiz.
                        </td>
                      </tr>
                    ) : (
                      (selectedSection.assessments || []).map((ass) => (
                        <tr
                          key={ass.id}
                          onClick={() => handleOpenAssessmentScores(ass)}
                          className="hover:bg-slate-800/30 cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-medium text-slate-200 group-hover:text-amber-300 transition">
                            <div className="flex items-center gap-2">
                              <span>{ass.title}</span>
                              <span className="text-[10px] text-amber-400/90 font-mono px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 opacity-0 group-hover:opacity-100 transition">
                                View Scores →
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 capitalize">
                            {ass.type.replace('_', ' ')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {ass.date || ass.dateSubmitted || 'Upcoming'}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-slate-200 tabular-nums">
                            {ass.maxScore} pts
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-amber-400 font-medium inline-flex items-center gap-1">
                              <span>Scores</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submissions & Grading Tab */}
          {sectionTab === 'grading' && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
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

      {/* RAG Test Generator Modal */}
      {selectedSection && (
        <RAGTestGeneratorModal
          isOpen={isRAGModalOpen}
          onClose={() => setIsRAGModalOpen(false)}
          sectionCode={selectedSection.code}
          sectionTitle={selectedSection.title}
          onPublishQuiz={handleAddAssessment}
        />
      )}

      {/* Telemetry Analytics Drawer (Time vs Difficulty Line Chart + Activity Timeline) */}
      <TelemetryAnalyticsDrawer
        isOpen={Boolean(selectedTelemetry)}
        onClose={() => setSelectedTelemetry(null)}
        telemetry={selectedTelemetry}
      />

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
