import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle, 
  Clock, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import { epics, features } from '../data/mockData';
import { TaskCard, Priority } from '../types';

interface BacklogViewProps {
  tasks: TaskCard[];
  onOpenCard?: (task: TaskCard) => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({ tasks, onOpenCard }) => {
  const [selectedEpicId, setSelectedEpicId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>('feat-1');

  const filteredFeatures = features.filter((feat) => {
    if (selectedEpicId !== 'all' && feat.epicId !== selectedEpicId) return false;
    if (selectedPriority !== 'all' && feat.priority !== selectedPriority) return false;
    return true;
  });

  const mvpFeaturesCount = features.filter((f) => f.isMvp).length;
  const totalHours = features.reduce((acc, f) => acc + f.estimatedHours, 0);

  const exportMarkdownSummary = () => {
    let md = `# Watchers Feature Backlog & MoSCoW Prioritization Matrix\n`;
    md += `Generated for Philippine Startup Challenge XI / Lab Manual Deliverable\n\n`;
    md += `## Summary Metrics\n`;
    md += `- Total Epics: ${epics.length}\n`;
    md += `- Total Features: ${features.length} (${mvpFeaturesCount} Essential MVP Scope)\n`;
    md += `- Total Estimated Implementation Hours: ${totalHours}h\n\n`;

    epics.forEach((ep) => {
      md += `### ${ep.code}: ${ep.title}\n`;
      md += `${ep.description}\n\n`;

      const epicFeats = features.filter((f) => f.epicId === ep.id);
      epicFeats.forEach((f) => {
        md += `#### [${f.code}] ${f.title} (${f.priority}${f.isMvp ? ' - MVP' : ''})\n`;
        md += `**User Story:** ${f.userStory}\n\n`;
        md += `**Acceptance Criteria:**\n`;
        f.acceptanceCriteria.forEach((ac) => {
          md += `- ${ac}\n`;
        });
        if (f.dependencies.length > 0) {
          md += `\n**Dependencies:** ${f.dependencies.join(', ')}\n`;
        }
        md += `\n---\n`;
      });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watchers_feature_backlog.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header & Purpose Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-xs">
              Lab Manual Section 1
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">5 Epics & 16 Features Decomposed</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Project Analysis & Feature Backlog
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            Watchers: Web-based learning integrity platform verifying independent student demonstration of knowledge with MoSCoW prioritization, acceptance criteria, and MVP scope.
          </p>
        </div>

        <button
          onClick={exportMarkdownSummary}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          Export Backlog (.md)
        </button>
      </div>

      {/* 5 Epics Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {epics.map((ep) => {
          const isSelected = selectedEpicId === ep.id;
          const epicTasks = tasks.filter((t) => t.epicId === ep.id);
          const doneEpicTasks = epicTasks.filter((t) => t.status === 'Done');

          return (
            <div
              key={ep.id}
              onClick={() => setSelectedEpicId(isSelected ? 'all' : ep.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-indigo-500 shadow-lg ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-800 text-indigo-300 rounded border border-slate-700">
                    {ep.code}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {ep.featuresCount} Features
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                  {ep.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {ep.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Tasks Completed</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {doneEpicTasks.length}/{epicTasks.length}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${(doneEpicTasks.length / (epicTasks.length || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Filter By MoSCoW:</span>
          {['all', 'Must Have', 'Should Have', 'Could Have', "Won't Have"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedPriority === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p === 'all' ? 'All (16)' : p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
          <span>
            Total MVP Scope: <strong className="text-emerald-400">{mvpFeaturesCount} Features</strong>
          </span>
          <span>•</span>
          <span>
            Estimated Effort: <strong className="text-indigo-400">{totalHours} Hours</strong>
          </span>
        </div>
      </div>

      {/* Features Accordion List */}
      <div className="space-y-4">
        {filteredFeatures.map((feat) => {
          const isExpanded = expandedFeatureId === feat.id;
          const associatedTasks = tasks.filter((t) => t.featureId === feat.id);
          const epic = epics.find((e) => e.id === feat.epicId);

          const priorityBadge =
            feat.priority === 'Must Have'
              ? 'bg-red-500/10 text-red-300 border-red-500/20'
              : feat.priority === 'Should Have'
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              : feat.priority === 'Could Have'
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={feat.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                isExpanded ? 'border-indigo-600/60 shadow-xl ring-1 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Feature Header Row */}
              <div
                onClick={() => setExpandedFeatureId(isExpanded ? null : feat.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none bg-slate-900 hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-indigo-950/80 text-indigo-300 border border-indigo-900 rounded-lg">
                    {feat.code}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {feat.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        ({epic?.code})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                      "{feat.userStory}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  {feat.isMvp && (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg">
                      ★ MVP Scope
                    </span>
                  )}
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${priorityBadge}`}>
                    {feat.priority}
                  </span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    {feat.estimatedHours}h
                  </span>
                  <button className="p-1 text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-5 text-xs text-slate-300">
                  {/* User Story Specification */}
                  <div className="p-4 bg-indigo-950/30 border border-indigo-900/40 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Agile User Story
                    </span>
                    <p className="text-slate-200 text-sm italic leading-relaxed">
                      "{feat.userStory}"
                    </p>
                  </div>

                  {/* Acceptance Criteria */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Acceptance Criteria (Testable Definition of Done)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {feat.acceptanceCriteria.map((ac, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-2.5"
                        >
                          <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300 leading-relaxed">{ac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dependencies & Actionable Tasks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Dependencies */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Feature Dependencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {feat.dependencies.length === 0 ? (
                          <span className="text-slate-500 italic">None (Foundation feature)</span>
                        ) : (
                          feat.dependencies.map((dep) => (
                            <span
                              key={dep}
                              className="px-2.5 py-1 bg-slate-900 text-slate-300 font-mono text-xs rounded-lg border border-slate-700"
                            >
                              Requires {dep}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Actionable Tasks */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Actionable Task Cards on Board ({associatedTasks.length})
                      </span>
                      <div className="space-y-1.5">
                        {associatedTasks.length === 0 ? (
                          <span className="text-slate-500 italic">No tasks currently mapped</span>
                        ) : (
                          associatedTasks.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => onOpenCard && onOpenCard(t)}
                              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg flex items-center justify-between cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-indigo-400">
                                  {t.id}
                                </span>
                                <span className="text-slate-300 group-hover:text-white transition">
                                  {t.title}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                                {t.status}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
