import React, { useState } from 'react';
import { initialTasks } from './data/mockData';
import { defaultUsers } from './data/studyData';
import { TaskCard, UserAccount } from './types';
import { Navbar, ActiveTab } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { BacklogView } from './components/BacklogView';
import { GithubExplorer } from './components/GithubExplorer';
import { TraceabilityMatrix } from './components/TraceabilityMatrix';
import { SprintPlanningView } from './components/SprintPlanningView';
import { SubmissionDossier } from './components/SubmissionDossier';
import { WatchersPrototype } from './components/WatchersPrototype';
import { CardDetailModal } from './components/CardDetailModal';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { StudyArea } from './components/StudyArea';
import { AdminConsole } from './components/AdminConsole';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function App() {
  // Start as Student by default (or user can toggle in header to Admin)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(defaultUsers[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks);
  const [modalCard, setModalCard] = useState<TaskCard | null>(null);

  // Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const doneCardsCount = tasks.filter((t) => t.status === 'Done').length;
  const totalCardsCount = tasks.length;
  const isAdmin = currentUser?.role === 'admin';

  const handleUpdateCard = (updated: TaskCard) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (modalCard && modalCard.id === updated.id) {
      setModalCard(updated);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (user.role === 'admin') {
      setActiveTab('admin_overview');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin_overview');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    setAuthModalMode('login');
  };

  // Check if current tab is restricted to admin only
  const isWorkspaceTab = [
    'admin_overview',
    'kanban',
    'backlog',
    'github',
    'traceability',
    'sprint',
    'submission',
  ].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        doneCardsCount={doneCardsCount}
        totalCardsCount={totalCardsCount}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
        {/* If non-admin attempts to view restricted lab workspace tabs */}
        {isWorkspaceTab && !isAdmin ? (
          <div className="p-8 my-12 max-w-md mx-auto text-center space-y-4 bg-slate-900 border-2 border-red-900/60 rounded-3xl shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Access Restricted: Admin Only</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Software Project Development Laboratory Workspace (Kanban board, GitHub traceability, sprint planning, and backlog) is restricted exclusively to the <strong>Admin</strong> role. Students and Professors cannot access this area.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleSwitchUser(defaultUsers[3] || {
                  id: 'user-admin-1',
                  name: 'Lead Admin & Workspace Manager',
                  email: 'admin@watchers.edu.ph',
                  role: 'admin',
                  institution: 'Watchers DevTeam / SPD Lab Evaluation',
                  studentOrFacultyId: 'ADM-2026-LEAD',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
                  enrolledCoursesCount: 6,
                  verifiedConceptsCount: 140,
                  joinedDate: 'October 2026',
                })}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition mx-auto shadow-lg"
              >
                <span>Switch to Admin Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Student, Teacher, or Admin Dashboard */}
            {activeTab === 'dashboard' && (
              currentUser ? (
                currentUser.role === 'teacher' ? (
                  <TeacherDashboard
                    onNavigateToAppDemo={() => setActiveTab('prototype')}
                  />
                ) : currentUser.role === 'admin' ? (
                  <AdminConsole
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onSwitchUser={handleSwitchUser}
                  />
                ) : (
                  <DashboardView
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    onOpenAuthModal={() => handleOpenAuth('login')}
                    onNavigateToWorkspace={() => {
                      if (isAdmin) setActiveTab('kanban');
                      else alert('Access Restricted: Software Project Development Workspace is Admin only.');
                    }}
                    onNavigateToAppDemo={() => setActiveTab('prototype')}
                  />
                )
              ) : (
                <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-xl">
                    W
                  </div>
                  <h2 className="text-xl font-bold text-white">Sign in to Access Your Account</h2>
                  <p className="text-xs text-slate-400">
                    Register or log in to view your dashboard, study area, or administrator console.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => handleOpenAuth('login')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                    >
                      Register Account
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Dedicated Study Area Tab for Students/Professors */}
            {activeTab === 'study' && (
              <div className="p-4 sm:p-6">
                <StudyArea onStartOfficialAssessment={() => setActiveTab('prototype')} />
              </div>
            )}

            {/* Assessment & Submission Simulator (for Students & Professors) */}
            {activeTab === 'prototype' && (
              <WatchersPrototype />
            )}

            {/* ADMIN ONLY TABS */}
            {isAdmin && activeTab === 'admin_overview' && (
              <AdminConsole
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSwitchUser={handleSwitchUser}
              />
            )}

            {isAdmin && activeTab === 'kanban' && (
              <KanbanBoard
                tasks={tasks}
                onUpdateTasks={setTasks}
                onSelectTraceCard={(card) => {
                  setActiveTab('traceability');
                }}
              />
            )}

            {isAdmin && activeTab === 'backlog' && (
              <BacklogView
                tasks={tasks}
                onOpenCard={(task) => setModalCard(task)}
              />
            )}

            {isAdmin && activeTab === 'github' && (
              <GithubExplorer />
            )}

            {isAdmin && activeTab === 'traceability' && (
              <TraceabilityMatrix
                tasks={tasks}
                onOpenCard={(card) => setModalCard(card)}
              />
            )}

            {isAdmin && activeTab === 'sprint' && (
              <SprintPlanningView
                tasks={tasks}
                onOpenCard={(task) => setModalCard(task)}
              />
            )}

            {isAdmin && activeTab === 'submission' && (
              <SubmissionDossier
                tasks={tasks}
              />
            )}
          </>
        )}
      </main>

      {/* Global Card Detail Modal when opened from Backlog, Traceability, or Sprint */}
      {modalCard && (
        <CardDetailModal
          card={modalCard}
          onClose={() => setModalCard(null)}
          onUpdateCard={handleUpdateCard}
          onMoveStatus={(card, newStatus) => {
            const updated = { ...card, status: newStatus };
            handleUpdateCard(updated);
          }}
        />
      )}

      {/* Global Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
