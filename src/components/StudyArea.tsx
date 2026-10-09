import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  Save, 
  Layers,
  Award
} from 'lucide-react';
import { CourseSubject, StudyConceptCard, PracticeQuizQuestion } from '../types';
import { mockCourses, mockStudyConcepts, practiceQuestions } from '../data/studyData';

interface StudyAreaProps {
  onStartOfficialAssessment?: () => void;
}

export const StudyArea: React.FC<StudyAreaProps> = ({ onStartOfficialAssessment }) => {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('all');
  const [activeStudyTab, setActiveStudyTab] = useState<'concepts' | 'mock_defense' | 'pomodoro' | 'policies'>('concepts');

  // Concept Cards state
  const [concepts, setConcepts] = useState<StudyConceptCard[]>(mockStudyConcepts);
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>('concept-1');

  // Mock Defense Quiz State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [mockTimeRemaining, setMockTimeRemaining] = useState(180);
  const [isMockTimerRunning, setIsMockTimerRunning] = useState(false);

  // Focus / Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [studyNotes, setStudyNotes] = useState(() => {
    return localStorage.getItem('watchers_study_notes') || 
      'Key takeaway for CS 101: Recursive tree traversal creates O(h) call-stack frames; iterative queue BFS avoids stack overflow on skewed trees.\n\nENG 202: When synthesizing sources, identify contrasting methodologies instead of just paraphrasing.';
  });
  const [notesSaved, setNotesSaved] = useState(false);

  const currentPracticeQ = practiceQuestions[activeQuestionIndex];

  // Pomodoro timer effect
  useEffect(() => {
    if (!isPomodoroRunning) return;
    const interval = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setIsPomodoroRunning(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPomodoroRunning]);

  // Mock quiz timer effect
  useEffect(() => {
    if (!isMockTimerRunning) return;
    const interval = setInterval(() => {
      setMockTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsMockTimerRunning(false);
          setShowAnswerFeedback(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isMockTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSaveNotes = () => {
    localStorage.setItem('watchers_study_notes', studyNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleToggleMastery = (conceptId: string) => {
    setConcepts((prev) =>
      prev.map((c) =>
        c.id === conceptId
          ? {
              ...c,
              masteryStatus: c.masteryStatus === 'verified' ? 'review_needed' : 'verified',
            }
          : c
      )
    );
  };

  const filteredConcepts = concepts.filter((c) => {
    if (selectedSubjectCode !== 'all' && c.subjectCode !== selectedSubjectCode) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Study Area Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-indigo-800/40 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              Student Knowledge Hub
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">Self-Paced Mastery & Defense Prep</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Study Area & Concept Defense Practice
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Review foundational concepts, run mock 3-minute self-check defenses before submitting work, and track where you can independently explain your reasoning.
          </p>
        </div>

        {/* Focus Timer Mini Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Focus Session</div>
            <div className="text-base font-black font-mono text-indigo-400">{formatTime(pomodoroSeconds)}</div>
          </div>
          <button
            onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow"
            title={isPomodoroRunning ? 'Pause' : 'Start Focus Session'}
          >
            {isPomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'concepts', label: 'Concept Review Cards', icon: BookOpen, badge: `${concepts.length}` },
            { id: 'mock_defense', label: 'Mock Defense Self-Check', icon: Brain, badge: 'Interactive' },
            { id: 'pomodoro', label: 'Focus Mode & Study Scratchpad', icon: Clock, badge: '25m' },
            { id: 'policies', label: 'AI Policies Reference', icon: ShieldCheck, badge: '4 Subjects' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStudyTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudyTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subject Filter (For Concepts) */}
        {activeStudyTab === 'concepts' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Subject:</span>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Subjects (4)</option>
              {mockCourses.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: CONCEPT REVIEW CARDS */}
      {activeStudyTab === 'concepts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {filteredConcepts.length} core competencies. Click to expand independent defense guides.
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Verified ({concepts.filter(c => c.masteryStatus === 'verified').length})
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Needs Review ({concepts.filter(c => c.masteryStatus === 'review_needed').length})
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredConcepts.map((concept) => {
              const isExpanded = expandedConceptId === concept.id;
              const isVerified = concept.masteryStatus === 'verified';

              return (
                <div
                  key={concept.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'border-indigo-500 shadow-xl ring-1 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header Row */}
                  <div
                    onClick={() => setExpandedConceptId(isExpanded ? null : concept.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none bg-slate-900 hover:bg-slate-850"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-indigo-950/80 text-indigo-300 border border-indigo-900 rounded-lg">
                        {concept.subjectCode}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {concept.conceptTitle}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {concept.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                          isVerified
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800'
                        }`}
                      >
                        {isVerified ? 'Verified Mastery' : 'Review Needed'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMastery(concept.id);
                        }}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg border border-slate-700"
                        title="Toggle verification flag"
                      >
                        {isVerified ? 'Mark Needs Review' : 'Mark Verified'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800 bg-slate-950/70 space-y-4 text-xs">
                      {/* Defense Question */}
                      <div className="p-4 bg-indigo-950/30 border border-indigo-900/40 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          Independent Verification Question (Teacher Check)
                        </span>
                        <p className="text-slate-200 font-semibold text-sm leading-relaxed">
                          "{concept.keyQuestion}"
                        </p>
                      </div>

                      {/* Sample Independent Explanation */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Model Independent Answer (Demonstrated Knowledge)
                        </span>
                        <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed font-mono">
                          {concept.sampleIndependentAnswer}
                        </p>
                      </div>

                      {/* AI Disclosure Guidance */}
                      <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-amber-200 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          AI Disclosure Policy Guidance
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {concept.aiDisclosureGuidance}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MOCK DEFENSE SELF-CHECK (INTERACTIVE VERIFICATION QUIZ PREP) */}
      {activeStudyTab === 'mock_defense' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                  Exam Simulation
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-300 text-xs">Question {activeQuestionIndex + 1} of {practiceQuestions.length}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                Mock Concept Verification Defense
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl font-mono text-xs font-bold">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{formatTime(mockTimeRemaining)}</span>
              </div>

              <button
                onClick={() => {
                  setIsMockTimerRunning(!isMockTimerRunning);
                  if (!isMockTimerRunning && mockTimeRemaining === 0) setMockTimeRemaining(180);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
              >
                {isMockTimerRunning ? 'Pause Timer' : 'Start 3-Min Timer'}
              </button>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Concept Focus: {currentPracticeQ.concept}
            </span>
            <p className="text-white text-sm font-semibold leading-relaxed">
              {currentPracticeQ.prompt}
            </p>
          </div>

          {/* Student Answer Scratchpad */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">
                Draft your independent defense (simulate follow-up quiz response):
              </label>
              <span className="text-slate-500">{practiceAnswer.length} characters</span>
            </div>
            <textarea
              rows={4}
              value={practiceAnswer}
              onChange={(e) => setPracticeAnswer(e.target.value)}
              placeholder="Type your explanation here from memory without relying on AI..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
            />
          </div>

          {/* Feedback & Rubric Reveal */}
          {showAnswerFeedback && (
            <div className="p-5 bg-slate-950 border border-emerald-900/50 rounded-2xl space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>Self-Assessment Evaluation & Rubric Check</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Model Expected Answer:
                </span>
                <p className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed">
                  {currentPracticeQ.sampleExpectedAnswer}
                </p>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-indigo-200 space-y-1">
                <span className="font-bold text-[11px] uppercase tracking-wider">Teacher Rubric Hint:</span>
                <p className="text-slate-300">{currentPracticeQ.rubricHint}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowAnswerFeedback(!showAnswerFeedback)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              {showAnswerFeedback ? 'Hide Model Answer' : 'Check Against Model Answer'}
            </button>

            <div className="flex gap-2">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => {
                  setActiveQuestionIndex((prev) => prev - 1);
                  setPracticeAnswer('');
                  setShowAnswerFeedback(false);
                  setMockTimeRemaining(180);
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium disabled:opacity-40"
              >
                Previous Question
              </button>
              <button
                disabled={activeQuestionIndex >= practiceQuestions.length - 1}
                onClick={() => {
                  setActiveQuestionIndex((prev) => prev + 1);
                  setPracticeAnswer('');
                  setShowAnswerFeedback(false);
                  setMockTimeRemaining(180);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FOCUS MODE & POMODORO TIMER SCRATCHPAD */}
      {activeStudyTab === 'pomodoro' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between items-center text-center">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                Distraction-Free Focus
              </span>
              <h3 className="text-lg font-bold text-white">Pomodoro Study Block</h3>
              <p className="text-xs text-slate-400">
                25 minutes of unassisted reading and problem-solving without AI reliance.
              </p>
            </div>

            <div className="w-48 h-48 rounded-full border-4 border-indigo-600/30 flex flex-col items-center justify-center bg-slate-950 shadow-inner">
              <span className="text-4xl font-black font-mono text-white tracking-wider">
                {formatTime(pomodoroSeconds)}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                {isPomodoroRunning ? 'Deep Focus Active' : 'Paused'}
              </span>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {isPomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPomodoroRunning ? 'Pause' : 'Start Focus'}</span>
              </button>
              <button
                onClick={() => {
                  setIsPomodoroRunning(false);
                  setPomodoroSeconds(25 * 60);
                }}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                title="Reset to 25m"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Study Scratchpad */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Personal Study Notes & Defense Cheatsheet
                </h3>
                <p className="text-xs text-slate-400">
                  Notes are stored locally in your browser session for quick reference.
                </p>
              </div>

              <button
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{notesSaved ? 'Saved!' : 'Save Notes'}</span>
              </button>
            </div>

            <textarea
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              rows={12}
              placeholder="Jot down notes, formulas, and conceptual explanations in your own words..."
              className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* TAB 4: SUBJECT AI POLICIES REFERENCE */}
      {activeStudyTab === 'policies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Explicit guidelines established by your course instructors under the Watchers Rule Engine.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCourses.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
                    {c.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    c.aiPolicyTier === 'brainstorming'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : c.aiPolicyTier === 'citation'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : c.aiPolicyTier === 'prohibited'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {c.aiPolicyTier.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Instructor: {c.instructor} • {c.section}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {c.aiPolicyDescription}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Next Due: <strong className="text-slate-200">{c.nextAssignmentDue}</strong></span>
                  <span className="text-emerald-400 font-semibold">{c.competencyProgress}% Progress</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
