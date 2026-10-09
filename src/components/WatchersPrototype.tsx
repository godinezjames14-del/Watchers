import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  UserCheck, 
  MessageSquare,
  HelpCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';

export const WatchersPrototype: React.FC = () => {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [activeStep, setActiveStep] = useState<'policy' | 'submit' | 'quiz' | 'report'>('policy');

  // Teacher AI Policy State
  const [aiPolicyTier, setAiPolicyTier] = useState<'brainstorming' | 'prohibited' | 'citation' | 'open'>('brainstorming');
  const [customInstructions, setCustomInstructions] = useState(
    'AI assistants (ChatGPT/Claude/Gemini) are permitted solely for initial concept brainstorming and outline ideation. All text and code must be authored by the student. Mandatory follow-up concept verification task is required upon submission.'
  );

  // Student Submission State
  const [submissionTitle, setSubmissionTitle] = useState('Comparative Analysis of Recursive vs Iterative Tree Traversal');
  const [submissionText, setSubmissionText] = useState(
    `In modern computational graph analysis, recursive tree traversal offers elegant divide-and-conquer abstractions. For Depth-First Search (DFS), recursive approaches naturally maintain the execution state on the program call stack, yielding clean O(V + E) time complexity with O(h) auxiliary memory space proportional to the maximum tree depth. However, iterative alternatives leveraging explicit heap-allocated stacks protect against deep-stack overflow vulnerabilities when encountering degenerate skewed trees.`
  );
  const [declaredTools, setDeclaredTools] = useState<string[]>(['ChatGPT', 'Claude']);
  const [declaredPurpose, setDeclaredPurpose] = useState('Brainstormed edge-case boundary conditions and compared memory tradeoffs');
  const [policyAgreed, setPolicyAgreed] = useState(true);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({
    'q1': 'Recursive traversal uses the runtime call stack which consumes memory proportional to recursion depth O(h), whereas iterative traversal uses a heap stack avoiding stack overflows.',
    'q2': 'A degenerate unbalanced tree with depth exceeding call stack limits (e.g., 10,000 nodes in single branch) triggers stack overflow errors in recursion.',
    'q3': 'I would switch to an iterative traversal with an explicit queue for BFS or Morris traversal for O(1) auxiliary space.',
  });
  const [timeRemaining, setTimeRemaining] = useState(285); // 5 minutes timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [blurCount, setBlurCount] = useState(0);
  const [lastBlurTimestamp, setLastBlurTimestamp] = useState<string | null>(null);
  const [telemetryAlert, setTelemetryAlert] = useState<string | null>(null);

  // Student Clarification / Appeal
  const [studentExplanation, setStudentExplanation] = useState('');
  const [explanationSubmitted, setExplanationSubmitted] = useState(false);

  // Real browser focus event listeners during quiz!
  useEffect(() => {
    if (activeStep !== 'quiz') return;

    setIsTimerRunning(true);
    const handleBlur = () => {
      setBlurCount((prev) => prev + 1);
      const timeStr = new Date().toLocaleTimeString();
      setLastBlurTimestamp(timeStr);
      setTelemetryAlert(`Contextual event logged: Browser lost focus at ${timeStr}. (Note: Contextual signal only, not proof of misconduct).`);
      setTimeout(() => setTelemetryAlert(null), 5000);
    };

    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [activeStep]);

  // Quiz timer
  useEffect(() => {
    if (!isTimerRunning || activeStep !== 'quiz') return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveStep('report');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, activeStep]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartQuiz = () => {
    setActiveStep('quiz');
    setTimeRemaining(300);
    setBlurCount(0);
    setTelemetryAlert(null);
  };

  const handleFinishQuiz = () => {
    setIsTimerRunning(false);
    setActiveStep('report');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header & Role Switcher */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              Live Product Prototype
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">WATCHERS Working Simulator</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Interactive Learning Integrity Workflow
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Test drive the full Watchers flow: Configure AI policies, submit work with mandatory disclosure, execute the 3-question follow-up verification quiz with live focus telemetry, and review the Demonstrated Understanding Gap Report.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setRole('teacher')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              role === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher Portal</span>
          </button>
          <button
            onClick={() => setRole('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              role === 'student'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Student Portal</span>
          </button>
        </div>
      </div>

      {/* Workflow Step Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {[
          { id: 'policy', label: '1. Teacher AI Policy Rules', active: activeStep === 'policy', done: true },
          { id: 'submit', label: '2. Student Submission & Disclosure', active: activeStep === 'submit', done: activeStep !== 'policy' },
          { id: 'quiz', label: '3. Independent Verification Quiz', active: activeStep === 'quiz', done: activeStep === 'report' },
          { id: 'report', label: '4. Integrity Gap Report', active: activeStep === 'report', done: activeStep === 'report' },
        ].map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id as any)}
            className={`p-3.5 rounded-xl border text-left transition font-semibold flex items-center justify-between ${
              step.active
                ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="truncate">{step.label}</span>
            <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
          </button>
        ))}
      </div>

      {/* Contextual Telemetry Alert Toast */}
      {telemetryAlert && (
        <div className="bg-amber-950/80 border border-amber-500/80 p-4 rounded-xl text-amber-200 text-xs flex items-center gap-3 shadow-xl animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong>Contextual Telemetry Event:</strong> {telemetryAlert}
          </div>
        </div>
      )}

      {/* STEP 1: TEACHER AI POLICY CONFIGURATION */}
      {activeStep === 'policy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Teacher Assignment Policy Builder (Feature CLAS-02)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure clear expectations for students. AI tool use is guided transparently rather than subject to arbitrary penalties.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Class: CS 101 - Algorithms & Data Structures
            </span>
          </div>

          {/* 4 AI Policy Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              {
                id: 'brainstorming',
                title: 'Brainstorming Only',
                desc: 'Permitted for ideation, outline structuring, and debugging guidance. Drafting must be original.',
                badge: 'Recommended',
              },
              {
                id: 'citation',
                title: 'Allowed with Citation',
                desc: 'AI text or code permitted if student explicitly discloses prompt transcripts and citations.',
                badge: 'Transparent',
              },
              {
                id: 'prohibited',
                title: 'AI Prohibited',
                desc: 'Strict manual authoring required for this fundamental concept baseline exercise.',
                badge: 'Strict',
              },
              {
                id: 'open',
                title: 'Open AI Exploration',
                desc: 'Full tool freedom. Evaluation focuses entirely on independent defense in follow-up task.',
                badge: 'Advanced',
              },
            ].map((preset) => (
              <div
                key={preset.id}
                onClick={() => setAiPolicyTier(preset.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  aiPolicyTier === preset.id
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{preset.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-indigo-300 font-mono">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{preset.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Teacher Guidelines */}
          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-300 block">
              Custom Teacher Instructions & Student Acknowledgment Clause
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setRole('student');
                setActiveStep('submit');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <span>Save Policy & Proceed to Student Submission</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: STUDENT ASSIGNMENT SUBMISSION & AI DISCLOSURE */}
      {activeStep === 'submit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Student Assignment Submission Portal (Feature SUBM-01)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review the instructor's AI policy, paste/upload your deliverable, and complete the mandatory AI disclosure form.
              </p>
            </div>
            <span className="text-xs text-purple-300 font-mono bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-800">
              Student: James Godinez
            </span>
          </div>

          {/* Teacher Policy Banner */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-indigo-300 font-bold">
              <span>Active Course Policy: {aiPolicyTier.toUpperCase()}</span>
              <span>CS 101 Assignment 2</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              "{customInstructions}"
            </p>
          </div>

          {/* Submission Text Editor */}
          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-300 block">
              Assignment Deliverable (Essay or Code Implementation)
            </label>
            <input
              type="text"
              value={submissionTitle}
              onChange={(e) => setSubmissionTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none mb-2"
            />
            <textarea
              rows={6}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Mandatory AI Disclosure Dialog */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Mandatory AI Tool Disclosure Form</span>
            </div>

            <div className="space-y-2">
              <span className="text-slate-400 text-[11px] block">
                Select AI assistants or digital tools consulted:
              </span>
              <div className="flex flex-wrap gap-2">
                {['ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'Perplexity', 'None (100% Unassisted)'].map((tool) => {
                  const isChecked = declaredTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => {
                        if (tool === 'None (100% Unassisted)') {
                          setDeclaredTools(['None']);
                        } else {
                          const withoutNone = declaredTools.filter((t) => t !== 'None');
                          setDeclaredTools(
                            isChecked ? withoutNone.filter((t) => t !== tool) : [...withoutNone, tool]
                          );
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                        isChecked
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] block">
                Explain role of AI tools used:
              </span>
              <input
                type="text"
                value={declaredPurpose}
                onChange={(e) => setDeclaredPurpose(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs"
              />
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span>
                I certify that I can independently explain, justify, and defend all concepts presented in this work during the follow-up verification task.
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartQuiz}
              disabled={!policyAgreed}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <span>Submit & Begin Independent Verification Quiz (5 Min)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INDEPENDENT VERIFICATION QUIZ & LIVE FOCUS TELEMETRY */}
      {activeStep === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Quiz Header with Timer & Focus Telemetry Indicator */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Independent Follow-Up Assessment (Feature EVAL-01 & EVAL-02)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Concept verification covering your submission: "{submissionTitle}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Telemetry Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                <span className={`w-2 h-2 rounded-full ${blurCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                <span className="text-slate-300">
                  Focus Loss Events: <strong className="font-mono text-white">{blurCount}</strong>
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-950/80 border border-purple-800 text-purple-300 rounded-xl text-xs font-mono font-bold">
                <Clock className="w-4 h-4 text-purple-400 animate-spin" />
                <span>{formatTimer(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Ethical Disclaimer Callout */}
          <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-[11px] text-indigo-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Ethical Telemetry Active:</strong> Browser focus changes are recorded strictly as contextual indicators. The system will never make automatic cheating accusations.
            </span>
          </div>

          {/* 3 Rapid Verification Questions */}
          <div className="space-y-5 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-white block">
                1. Concept Defense: Explain the runtime tradeoff between recursive call-stack allocations and iterative heap buffers.
              </label>
              <textarea
                rows={3}
                value={quizAnswers['q1']}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, q1: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-white block">
                2. Boundary Conditions: What specific tree morphology triggers catastrophic failure in the recursive model?
              </label>
              <textarea
                rows={3}
                value={quizAnswers['q2']}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, q2: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-white block">
                3. Architectural Transfer: How would you restructure traversal if memory constraints dropped to O(1)?
              </label>
              <textarea
                rows={3}
                value={quizAnswers['q3']}
                onChange={(e) => setQuizAnswers({ ...quizAnswers, q3: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                // Simulate blur test for demonstration
                setBlurCount((p) => p + 1);
                setTelemetryAlert('Simulated browser tab focus loss recorded at ' + new Date().toLocaleTimeString());
                setTimeout(() => setTelemetryAlert(null), 4000);
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition border border-slate-700"
            >
              Simulate Tab Switch (Test Telemetry)
            </button>

            <button
              onClick={handleFinishQuiz}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <span>Submit Assessment & Generate Gap Report</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DEMONSTRATED UNDERSTANDING GAP REPORT & FAIR DIALOGUE */}
      {activeStep === 'report' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Teacher Feedback & Analytics
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-300 text-xs">Feature REPT-01 & REPT-02</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">
                Demonstrated Understanding vs. Submission Report
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl font-bold text-xs">
                Status: Demonstrated Mastery
              </span>
            </div>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Submission Quality */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Submitted Work Quality
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">92%</span>
                <span className="text-slate-400">Rubric Score</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Covers asymptotic analysis, memory stack diagrams, and edge cases.
              </p>
            </div>

            {/* Independent Demonstration */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Independent Demonstration
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">88%</span>
                <span className="text-slate-400">Quiz Score</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Verified conceptual understanding of memory and morphology boundaries.
              </p>
            </div>

            {/* Integrity Delta */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Understanding Gap Delta
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-400 font-mono">4%</span>
                <span className="text-slate-400">Negligible Gap</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                High alignment between declared assistance and independent mastery.
              </p>
            </div>
          </div>

          {/* Contextual Telemetry Summary */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
              Contextual Telemetry Summary (Non-Accusatory)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-400">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span>Focus Loss Events: </span>
                <strong className="text-white font-mono">{blurCount}</strong>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span>Copy/Paste Intercepts: </span>
                <strong className="text-white font-mono">0</strong>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span>Declared AI Tools: </span>
                <strong className="text-white font-mono">{declaredTools.join(', ')}</strong>
              </div>
            </div>
          </div>

          {/* Teacher Recommendations */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Pedagogical Guidance & Restorative Action
            </span>
            <p className="text-slate-200 leading-relaxed">
              Student demonstrates genuine grasp of algorithmic tradeoffs. AI assistance was utilized transparently for ideation as permitted by course policy. No intervention or oral defense re-examination required.
            </p>
          </div>

          {/* Student Fairness Dialogue (Feature REPT-02) */}
          <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Student Fairness Dialogue Channel
              </span>
              {explanationSubmitted && (
                <span className="text-emerald-400 text-[10px] font-bold">Explanation Submitted</span>
              )}
            </div>

            <p className="text-slate-400">
              If any anomalies or connectivity issues occurred during your assessment, record a note for your instructor:
            </p>

            <textarea
              rows={2}
              placeholder="e.g., Note on brief focus loss: Checked assignment PDF in separate window to verify exact question constraint..."
              value={studentExplanation}
              onChange={(e) => setStudentExplanation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setExplanationSubmitted(true)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Send Clarification Note to Teacher
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => {
                setActiveStep('policy');
                setRole('teacher');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restart Workflow Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
