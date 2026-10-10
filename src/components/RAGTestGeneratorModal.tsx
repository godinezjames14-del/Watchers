import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Layers, 
  Send,
  Loader2
} from 'lucide-react';
import { AssessmentItem, RAGQuizQuestion } from '../types';

interface RAGTestGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionCode: string;
  sectionTitle: string;
  onPublishQuiz: (newAssessment: AssessmentItem) => void;
}

export const RAGTestGeneratorModal: React.FC<RAGTestGeneratorModalProps> = ({
  isOpen,
  onClose,
  sectionCode,
  sectionTitle,
  onPublishQuiz,
}) => {
  if (!isOpen) return null;

  const sampleNotes = `Algorithms and Data Structures: Tree Traversals & Asymptotic Behavior.
Binary Trees consist of nodes with at most two children: left and right. 
Depth-First Search (DFS) traversals include In-Order (Left, Root, Right), Pre-Order (Root, Left, Right), and Post-Order (Left, Right, Root). 
Recursive DFS operates with O(V + E) runtime and consumes O(h) auxiliary stack space, where h is the tree height. In balanced trees, h = O(log n); in degenerate skewed trees, h = O(n), introducing potential call stack overflow risks.
Iterative tree traversal addresses this by explicitly managing an allocated stack in heap memory rather than relying on limited OS execution call frames.
Morris Traversal achieves O(1) auxiliary space by temporarily modifying tree pointers to create threaded binary trees, restoring the original structure before returning.`;

  const [syllabusText, setSyllabusText] = useState(sampleNotes);
  const [quizTitle, setQuizTitle] = useState(`${sectionCode} Verified RAG Quiz`);
  const [numQuestions, setNumQuestions] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<RAGQuizQuestion[] | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText,
          numQuestions,
          subjectTitle: `${sectionCode}: ${sectionTitle}`,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate quiz questions.');
      }

      setGeneratedQuestions(data.data.questions || []);
      if (data.data.quizTitle) {
        setQuizTitle(data.data.quizTitle);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI test generator.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    if (!generatedQuestions || generatedQuestions.length === 0) return;

    const totalMax = generatedQuestions.length * 10;
    const newAssessment: AssessmentItem = {
      id: `rag-quiz-${Date.now()}`,
      title: quizTitle,
      type: 'quiz',
      categoryName: 'Quiz',
      score: 0,
      maxScore: totalMax,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'pending',
      notes: `Context-grounded RAG quiz generated strictly from syllabus notes (${generatedQuestions.length} questions).`,
    };

    onPublishQuiz(newAssessment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-semibold">{sectionCode}</span>
              <span aria-hidden="true">·</span>
              <span>Context-Grounded RAG Engine</span>
            </div>
            <h2 className="text-base font-semibold text-slate-100 mt-1">
              AI Test Generator from Syllabus / Notes
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-900/60 text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!generatedQuestions ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-medium">
                    Lecture Notes / Syllabus Content
                  </label>
                  <button
                    type="button"
                    onClick={() => setSyllabusText(sampleNotes)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-mono"
                  >
                    Load Sample Notes
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  placeholder="Paste teacher notes, syllabus outline, or lecture text..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none font-mono leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  The model generates questions strictly grounded in this text without outside hallucination.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Generated Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Number of Questions</label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value={3}>3 Questions (Easy, Medium, Hard)</option>
                    <option value={5}>5 Questions</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Grounded Questions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Quiz (RAG)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Questions Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">{quizTitle}</span>
                  <span className="text-slate-400 text-[11px]">
                    {generatedQuestions.length} Questions Generated with Difficulty Tiers
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setGeneratedQuestions(null)}
                  className="text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  Edit Input Text
                </button>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {generatedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-slate-200">
                        {idx + 1}. {q.prompt}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`text-[11px] p-1.5 rounded flex items-center gap-2 ${
                            optIdx === q.correctAnswerIndex
                              ? 'bg-amber-950/30 text-amber-300 font-medium border border-amber-800/30'
                              : 'text-slate-400'
                          }`}
                        >
                          <span className="font-mono text-slate-500">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                          {optIdx === q.correctAnswerIndex && (
                            <span className="text-[10px] text-amber-400 font-mono ml-auto">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGeneratedQuestions(null)}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to {sectionCode} Syllabus</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
