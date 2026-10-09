import { Epic, Feature, TaskCard, TeamMember, Sprint, GitHubIssue, GitHubCommit, GitHubPullRequest, MemberContribution } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'James Godinez',
    role: 'Project Lead & Full-Stack Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    email: 'godinezjames14@gmail.com',
    assignedHours: 32,
    capacityHours: 35,
    githubUsername: 'jgodinez',
    tasksCount: 4,
  },
  {
    id: 'mem-2',
    name: 'Maria Santos',
    role: 'Frontend UI/UX Specialist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    email: 'maria.santos@watchers.edu.ph',
    assignedHours: 30,
    capacityHours: 35,
    githubUsername: 'msantos-dev',
    tasksCount: 4,
  },
  {
    id: 'mem-3',
    name: 'Carlos Reyes',
    role: 'Backend & Data Services Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    email: 'carlos.reyes@watchers.edu.ph',
    assignedHours: 34,
    capacityHours: 35,
    githubUsername: 'creyes-ph',
    tasksCount: 4,
  },
  {
    id: 'mem-4',
    name: 'Althea Cruz',
    role: 'QA & Assessment Logic Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    email: 'althea.cruz@watchers.edu.ph',
    assignedHours: 28,
    capacityHours: 35,
    githubUsername: 'altheacruz-qa',
    tasksCount: 3,
  },
  {
    id: 'mem-5',
    name: 'David Tan',
    role: 'Security & Context Telemetry Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    email: 'david.tan@watchers.edu.ph',
    assignedHours: 26,
    capacityHours: 35,
    githubUsername: 'dtan-cyber',
    tasksCount: 3,
  },
];

export const epics: Epic[] = [
  {
    id: 'epic-1',
    code: 'EPIC-01',
    title: 'Role-Based Access & Identity Management',
    description: 'Secure authentication, role assignment (Teacher, Student, Academic Coordinator), and institution tenant isolation.',
    color: 'from-blue-600 to-indigo-600',
    featuresCount: 3,
    completedFeaturesCount: 2,
  },
  {
    id: 'epic-2',
    code: 'EPIC-02',
    title: 'Classroom & AI Tool Usage Policy Management',
    description: 'Class scheduling, student enrollment, and explicit teacher-defined guidelines for permitted AI tools.',
    color: 'from-emerald-600 to-teal-600',
    featuresCount: 3,
    completedFeaturesCount: 1,
  },
  {
    id: 'epic-3',
    code: 'EPIC-03',
    title: 'Assignment Submission & AI Disclosure Workflow',
    description: 'Multi-modal assignment upload, student AI disclosure statements, and assignment-to-concept tagging.',
    color: 'from-amber-600 to-orange-600',
    featuresCount: 3,
    completedFeaturesCount: 1,
  },
  {
    id: 'epic-4',
    code: 'EPIC-04',
    title: 'Independent Follow-Up Assessment Engine & Context Telemetry',
    description: 'Adaptive short follow-up quizzes/explanations and ethical browser focus event monitoring during testing.',
    color: 'from-purple-600 to-pink-600',
    featuresCount: 4,
    completedFeaturesCount: 1,
  },
  {
    id: 'epic-5',
    code: 'EPIC-05',
    title: 'Learning Integrity Analytics & Teacher Gap Reports',
    description: 'Comparing submitted assignment quality with independent demonstration to identify support areas without unfair accusation.',
    color: 'from-cyan-600 to-blue-700',
    featuresCount: 3,
    completedFeaturesCount: 0,
  },
];

export const features: Feature[] = [
  // EPIC 1
  {
    id: 'feat-1',
    epicId: 'epic-1',
    code: 'AUTH-01',
    title: 'User Authentication & Role Distinction',
    userStory: 'As a user (Teacher/Student), I want to log into the Watchers portal using institutional credentials so that my workspace is tailored to my educational role.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 12,
    acceptanceCriteria: [
      'Users can log in with email/password and institutional SSO.',
      'Role privileges (Teacher, Student, Coordinator) are strictly enforced in routing and API middleware.',
      'JWT session expires after 8 hours with automatic refresh token support.',
    ],
    dependencies: [],
    tasks: [],
  },
  {
    id: 'feat-2',
    epicId: 'epic-1',
    code: 'AUTH-02',
    title: 'User Profile & Institution Onboarding',
    userStory: 'As a school administrator or teacher, I want to configure school metadata and classroom cohorts so that student groups are isolated and protected.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 8,
    acceptanceCriteria: [
      'Institution profile includes school ID, DepEd/CHED region, and data retention policy.',
      'Teacher can invite co-instructors and academic coordinators.',
      'Philippine Data Privacy Act (RA 10173) consent banner is acknowledged upon first login.',
    ],
    dependencies: ['AUTH-01'],
    tasks: [],
  },
  {
    id: 'feat-3',
    epicId: 'epic-1',
    code: 'AUTH-03',
    title: 'Password Recovery & Session Audit Logs',
    userStory: 'As a system user, I want secure password recovery and login audit trails so that my account credentials remain uncompromised.',
    priority: 'Should Have',
    isMvp: false,
    estimatedHours: 6,
    acceptanceCriteria: [
      'Password reset emails send cryptographic tokens valid for 15 minutes.',
      'Audit log tracks IP address, timestamp, and device user-agent on login.',
    ],
    dependencies: ['AUTH-01'],
    tasks: [],
  },

  // EPIC 2
  {
    id: 'feat-4',
    epicId: 'epic-2',
    code: 'CLAS-01',
    title: 'Classroom & Subject Creation',
    userStory: 'As a teacher, I want to create subjects (e.g., Computer Science, Literature) and student rosters so that I can organize instructional units.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 10,
    acceptanceCriteria: [
      'Teacher can create class with Subject Code, Section, Academic Term, and Enrollment Code.',
      'Students can join via 6-character alpha-numeric code or roster upload.',
      'Student list displays enrollment status and active submissions.',
    ],
    dependencies: ['AUTH-01'],
    tasks: [],
  },
  {
    id: 'feat-5',
    epicId: 'epic-2',
    code: 'CLAS-02',
    title: 'Teacher AI Policy Rule Engine',
    userStory: 'As a teacher, I want to configure transparent rules explaining when and how AI assistants may be used so that students have unequivocal expectations.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 12,
    acceptanceCriteria: [
      'Policy choices: AI Prohibited, AI Allowed for Ideation/Brainstorming, AI Allowed with Full Citation, AI Open Exploration.',
      'Custom instruction text area allowing teachers to specify permitted prompts and prompt logs.',
      'Policy is pinned to student assignment view and requires student agreement checkbox prior to upload.',
    ],
    dependencies: ['CLAS-01'],
    tasks: [],
  },
  {
    id: 'feat-6',
    epicId: 'epic-2',
    code: 'CLAS-03',
    title: 'Assignment Rubric & Concept Taxonomy Mapping',
    userStory: 'As a teacher, I want to associate core competency tags (e.g., "Recursion", "Thesis Defense") with assignments so that follow-up assessments target exact syllabus objectives.',
    priority: 'Should Have',
    isMvp: false,
    estimatedHours: 8,
    acceptanceCriteria: [
      'Teacher can select 2 to 6 syllabus competencies per assignment.',
      'Rubric weights calculate both submission score and follow-up concept mastery score.',
    ],
    dependencies: ['CLAS-02'],
    tasks: [],
  },

  // EPIC 3
  {
    id: 'feat-7',
    epicId: 'epic-3',
    code: 'SUBM-01',
    title: 'Student Assignment Upload & AI Disclosure Form',
    userStory: 'As a student, I want to submit my assignment document or source code along with a transparent disclosure of tools utilized so that I practice academic honesty without fear of unjustified penalty.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 14,
    acceptanceCriteria: [
      'Accepts PDF, DOCX, TXT, and ZIP code submissions up to 25MB.',
      'Mandatory AI disclosure modal: Tools used (ChatGPT, Claude, Gemini, None), role of tools (Brainstorming, Syntax check, Drafting), and student reflection note.',
      'Generates unique Submission Hash and immutable submission receipt timestamp.',
    ],
    dependencies: ['CLAS-02'],
    tasks: [],
  },
  {
    id: 'feat-8',
    epicId: 'epic-3',
    code: 'SUBM-02',
    title: 'Submission Versioning & Resubmission Buffer',
    userStory: 'As a student, I want to replace a draft before the final deadline so that I can submit corrected work with updated disclosure logs.',
    priority: 'Could Have',
    isMvp: false,
    estimatedHours: 6,
    acceptanceCriteria: [
      'Teacher can enable/disable resubmissions.',
      'Previous versions are archived with timestamped diff summary.',
    ],
    dependencies: ['SUBM-01'],
    tasks: [],
  },
  {
    id: 'feat-9',
    epicId: 'epic-3',
    code: 'SUBM-03',
    title: 'Submission Concept Parser & Key Term Extractor',
    userStory: 'As a system backend, I want to parse key terms and structural arguments from submissions so that follow-up assessments are grounded directly in the student submitted material.',
    priority: 'Should Have',
    isMvp: true,
    estimatedHours: 12,
    acceptanceCriteria: [
      'Extracts 3-5 focal conceptual claims or algorithmic blocks from submission.',
      'Flags core arguments for verification question alignment.',
    ],
    dependencies: ['SUBM-01'],
    tasks: [],
  },

  // EPIC 4
  {
    id: 'feat-10',
    epicId: 'epic-4',
    code: 'EVAL-01',
    title: 'Independent Follow-Up Assessment Engine',
    userStory: 'As a teacher, I want the system to assign short (3-5 min) independent follow-up questions directly derived from the submitted concepts so that I can verify student independent understanding.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 16,
    acceptanceCriteria: [
      'Generates 3 rapid concept verification prompts (e.g., explain line 15, rephrase paragraph 2 thesis, solve a near-transfer problem).',
      'Timed assessment window (5-10 minutes) with countdown timer and automatic auto-save.',
      'Students cannot copy/paste pre-written text into response inputs.',
    ],
    dependencies: ['SUBM-03'],
    tasks: [],
  },
  {
    id: 'feat-11',
    epicId: 'epic-4',
    code: 'EVAL-02',
    title: 'Contextual Browser Event Telemetry (Focus Logger)',
    userStory: 'As an educational evaluator, I want to record non-intrusive contextual browser signals (e.g., loss of window focus, tab switching) during designated assessments as supportive context rather than conclusive proof of cheating.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 10,
    acceptanceCriteria: [
      'Logs `window.onblur`, `visibilitychange`, and clipboard attempt events strictly during the active assessment session.',
      'Displays a clear, transparent disclaimer informing the student of recorded signals.',
      'Signals are flagged as contextual indicators only, explicitly preventing automatic accusation or automated penalties.',
    ],
    dependencies: ['EVAL-01'],
    tasks: [],
  },
  {
    id: 'feat-12',
    epicId: 'epic-4',
    code: 'EVAL-03',
    title: 'Oral Defense & Live Practical Check Schedule',
    userStory: 'As a teacher, I want to flag complex submissions for a 2-minute live oral check so that students can verbally explain their methodology.',
    priority: 'Should Have',
    isMvp: false,
    estimatedHours: 8,
    acceptanceCriteria: [
      'One-click slot scheduler for 2-minute teacher-student check-in.',
      'Rubric for oral defense notes and instant grade sync.',
    ],
    dependencies: ['EVAL-01'],
    tasks: [],
  },
  {
    id: 'feat-13',
    epicId: 'epic-4',
    code: 'EVAL-04',
    title: 'Offline-Resilient Assessment Buffer',
    userStory: 'As a student in regions with unstable connectivity, I want local caching of my answers so that brief network interruptions do not cause lost test data.',
    priority: 'Could Have',
    isMvp: false,
    estimatedHours: 8,
    acceptanceCriteria: [
      'IndexedDB buffer persists in-flight answers every 10 seconds.',
      'Syncs payload once connection is restored with tamper validation.',
    ],
    dependencies: ['EVAL-01'],
    tasks: [],
  },

  // EPIC 5
  {
    id: 'feat-14',
    epicId: 'epic-5',
    code: 'REPT-01',
    title: 'Demonstrated Understanding vs Submission Gap Report',
    userStory: 'As a teacher, I want a side-by-side comparative report of assignment quality vs independent assessment mastery so that I can identify learning gaps and provide targeted instructional support.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 14,
    acceptanceCriteria: [
      'Calculates Gap Delta score: [Assisted Submission Quality] minus [Independent Demonstration Score].',
      'Flags categorized status: "Demonstrated Mastery", "Minor Concept Gap", or "Substantial Gap Needing Review".',
      'Presents evidence breakdown with teacher actionable recommendations (e.g., schedule tutoring, review concept X).',
    ],
    dependencies: ['EVAL-01', 'EVAL-02'],
    tasks: [],
  },
  {
    id: 'feat-15',
    epicId: 'epic-5',
    code: 'REPT-02',
    title: 'Student Fairness Dialogue & Explanation Portal',
    userStory: 'As a student, I want a formal, fair channel to explain anomalies or context on my report so that my teacher understands my perspective before academic decisions are finalized.',
    priority: 'Must Have',
    isMvp: true,
    estimatedHours: 10,
    acceptanceCriteria: [
      'Student can view their feedback report and submit a structured clarification note.',
      'Teacher can review student explanation, annotate evidence, and adjust the assessment flag.',
      'Full audit trail preserves notes to uphold student rights and Philippine Startup Challenge SDG 4 fairness goals.',
    ],
    dependencies: ['REPT-01'],
    tasks: [],
  },
  {
    id: 'feat-16',
    epicId: 'epic-5',
    code: 'REPT-03',
    title: 'Cohort Learning Analytics & Institutional Export',
    userStory: 'As an academic coordinator, I want aggregate department charts on AI tool adoption and concept retention trends so that our institution can calibrate curriculum standards.',
    priority: 'Could Have',
    isMvp: false,
    estimatedHours: 12,
    acceptanceCriteria: [
      'Classroom-wide radar charts displaying concept mastery distributions.',
      'Exportable CSV and PDF summary report for faculty review.',
    ],
    dependencies: ['REPT-01'],
    tasks: [],
  },
];

export const initialTasks: TaskCard[] = [
  // DONE TASKS (with complete traceability!)
  {
    id: 'AUTH-01',
    featureId: 'feat-1',
    epicId: 'epic-1',
    title: 'Implement user login & role-based route guard',
    description: 'Build JWT authentication API endpoints, student/teacher login interfaces, and role protection middleware.',
    userStory: 'As a user (Teacher/Student), I want to log into the Watchers portal using institutional credentials so that my workspace is tailored to my educational role.',
    status: 'Done',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-1', // James Godinez
    reviewerId: 'mem-3', // Carlos Reyes
    estimateHours: 12,
    actualHours: 11,
    deadline: '2026-10-12',
    dependencies: [],
    inSprint: true,
    tags: ['Auth', 'Security', 'MVP', 'Traceable'],
    githubIssueNumber: 12,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/12',
    githubBranch: 'feature/12-user-login',
    githubPrNumber: 14,
    githubPrUrl: 'https://github.com/watchers-project/watchers-web/pull/14',
    commitHash: 'a7b89f2',
    checklist: [
      { id: 'c1', text: 'Create mock auth provider & token generator', completed: true },
      { id: 'c2', text: 'Implement Login modal with Teacher/Student toggles', completed: true },
      { id: 'c3', text: 'Protect routes based on JWT claims and session state', completed: true },
      { id: 'c4', text: 'Add unit tests for token expiration and unauthorized redirection', completed: true },
    ],
    acceptanceCriteria: [
      { id: 'ac1', text: 'Users can authenticate as Teacher or Student with email/password', completed: true },
      { id: 'ac2', text: 'Protected routes redirect unauthorized users to login screen', completed: true },
      { id: 'ac3', text: 'Session tokens persist in secure HTTP-only cookies/storage', completed: true },
    ],
    verificationEvidence: {
      verifiedBy: 'Carlos Reyes (Backend Lead)',
      verifiedAt: '2026-10-10 16:45 PST',
      testPassed: true,
      notes: 'Peer review completed on PR #14. All 14 automated unit tests passed. Role switches tested successfully across Teacher and Student portals. Verified no secret leakage.',
      testSuiteRun: 'npm test -- --grep "auth" -> 14 passed (100% coverage)',
      artifactUrl: 'https://github.com/watchers-project/watchers-web/actions/runs/849201',
    },
  },
  {
    id: 'CLAS-01',
    featureId: 'feat-4',
    epicId: 'epic-2',
    title: 'Classroom creation and student enrollment roster',
    description: 'Develop teacher class management dashboard, section generation, and student enrollment via class code.',
    userStory: 'As a teacher, I want to create subjects and student rosters so that I can organize instructional units.',
    status: 'Done',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-2', // Maria Santos
    reviewerId: 'mem-1', // James Godinez
    estimateHours: 10,
    actualHours: 9,
    deadline: '2026-10-13',
    dependencies: ['AUTH-01'],
    inSprint: true,
    tags: ['Classroom', 'Frontend', 'MVP'],
    githubIssueNumber: 15,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/15',
    githubBranch: 'feature/15-classroom-roster',
    githubPrNumber: 16,
    githubPrUrl: 'https://github.com/watchers-project/watchers-web/pull/16',
    commitHash: '3c81e9d',
    checklist: [
      { id: 'c5', text: 'Design Class Card and Subject List components', completed: true },
      { id: 'c6', text: 'Implement 6-character unique join code generator', completed: true },
      { id: 'c7', text: 'Add student roster table with active status badges', completed: true },
    ],
    acceptanceCriteria: [
      { id: 'ac4', text: 'Teacher can create class with title, code, and semester', completed: true },
      { id: 'ac5', text: 'Student can join class by entering code', completed: true },
      { id: 'ac6', text: 'Class roster lists enrolled students with submission counts', completed: true },
    ],
    verificationEvidence: {
      verifiedBy: 'James Godinez (Project Lead)',
      verifiedAt: '2026-10-11 11:20 PST',
      testPassed: true,
      notes: 'Verified UI responsiveness and join code collision handling. PR #16 merged cleanly into main.',
      testSuiteRun: 'npm test -- --grep "classroom" -> 8 passed',
      artifactUrl: 'https://github.com/watchers-project/watchers-web/actions/runs/849410',
    },
  },

  // TESTING TASK (Traceable Feature #2!)
  {
    id: 'EVAL-01',
    featureId: 'feat-10',
    epicId: 'epic-4',
    title: 'Short independent follow-up assessment quiz engine',
    description: 'Build adaptive assessment generator that selects 3 concept verification questions targeting student submitted work.',
    userStory: 'As a teacher, I want the system to assign short (3-5 min) independent follow-up questions directly derived from the submitted concepts so that I can verify student independent understanding.',
    status: 'Testing',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-4', // Althea Cruz
    reviewerId: 'mem-1', // James Godinez
    estimateHours: 16,
    actualHours: 15,
    deadline: '2026-10-14',
    dependencies: ['SUBM-01'],
    inSprint: true,
    tags: ['Assessment', 'Core-Differentiator', 'MVP', 'Traceable'],
    githubIssueNumber: 18,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/18',
    githubBranch: 'feature/18-followup-quiz-engine',
    githubPrNumber: 21,
    githubPrUrl: 'https://github.com/watchers-project/watchers-web/pull/21',
    commitHash: '8e4f102',
    checklist: [
      { id: 'c8', text: 'Implement question bank and prompt generator interface', completed: true },
      { id: 'c9', text: 'Build student timed assessment UI with live countdown', completed: true },
      { id: 'c10', text: 'Hook auto-save on answer change into localStorage', completed: true },
      { id: 'c11', text: 'Integrate scoring engine and rubric evaluator', completed: false },
    ],
    acceptanceCriteria: [
      { id: 'ac7', text: 'Generates 3 rapid concept verification prompts based on assignment topic', completed: true },
      { id: 'ac8', text: 'Assessment runs on a 5-minute strict countdown timer with auto-submit', completed: true },
      { id: 'ac9', text: 'Answers submitted are scored against rubric key and stored for teacher review', completed: true },
    ],
    verificationEvidence: {
      verifiedBy: 'Althea Cruz (QA Lead)',
      verifiedAt: '2026-10-12 09:30 PST',
      testPassed: true,
      notes: 'PR #21 under active integration testing. Timer auto-submit and state retention tested across network throttling. Verification evidence recorded in test logs.',
      testSuiteRun: 'npm test -- --grep "assessmentEngine" -> 11 passed, 1 pending',
      artifactUrl: 'https://github.com/watchers-project/watchers-web/actions/runs/850123',
    },
  },

  // FOR REVIEW
  {
    id: 'CLAS-02',
    featureId: 'feat-5',
    epicId: 'epic-2',
    title: 'Teacher AI policy rule engine & student agreement',
    description: 'Allow teachers to designate permitted AI use levels (Prohibited, Ideation Only, Allowed with Citation) and attach policy to assignments.',
    userStory: 'As a teacher, I want to configure transparent rules explaining when and how AI assistants may be used so that students have unequivocal expectations.',
    status: 'For Review',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-3', // Carlos Reyes
    reviewerId: 'mem-5', // David Tan
    estimateHours: 12,
    actualHours: 11,
    deadline: '2026-10-14',
    dependencies: ['CLAS-01'],
    inSprint: true,
    tags: ['Policy', 'AI-Ethics', 'MVP'],
    githubIssueNumber: 19,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/19',
    githubBranch: 'feature/19-ai-policy-engine',
    githubPrNumber: 22,
    githubPrUrl: 'https://github.com/watchers-project/watchers-web/pull/22',
    commitHash: '9d2011b',
    checklist: [
      { id: 'c12', text: 'Create AI Policy selection widget with 4 standard preset tiers', completed: true },
      { id: 'c13', text: 'Add student acknowledgment modal with required checkbox', completed: true },
      { id: 'c14', text: 'Store policy metadata on assignment records', completed: true },
    ],
    acceptanceCriteria: [
      { id: 'ac10', text: 'Teachers can choose between 4 AI policy tiers and write custom prompt guidelines', completed: true },
      { id: 'ac11', text: 'Students must acknowledge policy before submitting their assignment', completed: true },
    ],
  },

  // IN PROGRESS
  {
    id: 'EVAL-02',
    featureId: 'feat-11',
    epicId: 'epic-4',
    title: 'Contextual browser focus event telemetry logger',
    description: 'Record browser focus loss, tab blur, and clipboard interaction as ethical contextual signals without auto-penalizing students.',
    userStory: 'As an educational evaluator, I want to record non-intrusive contextual browser signals during designated assessments as supportive context rather than conclusive proof of cheating.',
    status: 'In Progress',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-5', // David Tan
    reviewerId: 'mem-4', // Althea Cruz
    estimateHours: 10,
    deadline: '2026-10-15',
    dependencies: ['EVAL-01'],
    inSprint: true,
    tags: ['Telemetry', 'Privacy', 'MVP'],
    githubIssueNumber: 20,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/20',
    githubBranch: 'feature/20-telemetry-focus-logger',
    commitHash: '4f88e1a',
    checklist: [
      { id: 'c15', text: 'Hook window blur and visibilitychange event listeners', completed: true },
      { id: 'c16', text: 'Display clear contextual warning banner regarding logged events', completed: true },
      { id: 'c17', text: 'Transmit telemetry batch on assessment submission', completed: false },
    ],
    acceptanceCriteria: [
      { id: 'ac12', text: 'Logs timestamp, blur duration, and blur count during assessment session', completed: true },
      { id: 'ac13', text: 'Banner explicitly states signals are contextual and never trigger automated penalties', completed: true },
      { id: 'ac14', text: 'Telemetry ceases immediately upon assessment completion', completed: false },
    ],
  },
  {
    id: 'SUBM-01',
    featureId: 'feat-7',
    epicId: 'epic-3',
    title: 'Assignment submission upload & AI disclosure dialog',
    description: 'Build student assignment upload interface with mandatory tool disclosure (ChatGPT, Claude, Gemini, or None) and student methodology reflections.',
    userStory: 'As a student, I want to submit my assignment document or source code along with a transparent disclosure of tools utilized so that I practice academic honesty without fear of unjustified penalty.',
    status: 'In Progress',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-2', // Maria Santos
    reviewerId: 'mem-1', // James Godinez
    estimateHours: 14,
    deadline: '2026-10-15',
    dependencies: ['CLAS-02'],
    inSprint: true,
    tags: ['Submission', 'AI-Disclosure', 'MVP'],
    githubIssueNumber: 23,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/23',
    githubBranch: 'feature/23-submission-disclosure',
    checklist: [
      { id: 'c18', text: 'Create drag-and-drop file upload component (PDF, DOCX, Code)', completed: true },
      { id: 'c19', text: 'Implement multi-select AI tool disclosure form with purpose tags', completed: true },
      { id: 'c20', text: 'Attach timestamped receipt and hash upon successful submission', completed: false },
    ],
    acceptanceCriteria: [
      { id: 'ac15', text: 'Supports files up to 25MB with instant client-side format validation', completed: true },
      { id: 'ac16', text: 'Requires completed disclosure questionnaire before upload is enabled', completed: true },
      { id: 'ac17', text: 'Emits event to schedule follow-up assessment prompt', completed: false },
    ],
  },

  // TO DO (In Sprint 1)
  {
    id: 'REPT-01',
    featureId: 'feat-14',
    epicId: 'epic-5',
    title: 'Demonstrated Understanding vs Submission Gap Report UI',
    description: 'Design comparative teacher report displaying submission quality vs independent test score, flagging areas where student requires support.',
    userStory: 'As a teacher, I want a side-by-side comparative report of assignment quality vs independent assessment mastery so that I can identify learning gaps and provide targeted instructional support.',
    status: 'To Do',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-1', // James Godinez
    reviewerId: 'mem-3', // Carlos Reyes
    estimateHours: 14,
    deadline: '2026-10-16',
    dependencies: ['EVAL-01', 'EVAL-02'],
    inSprint: true,
    tags: ['Report', 'Analytics', 'MVP'],
    githubIssueNumber: 25,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/25',
    checklist: [
      { id: 'c21', text: 'Design dual bar/radar comparison chart for submission vs independent demo', completed: false },
      { id: 'c22', text: 'Calculate Learning Gap Delta formula', completed: false },
      { id: 'c23', text: 'Provide teacher action buttons: "Approve Understanding", "Schedule 2-min Check-in", "Provide Tutoring Material"', completed: false },
    ],
    acceptanceCriteria: [
      { id: 'ac18', text: 'Displays clear gap metric without accusing language or punitive labels', completed: false },
      { id: 'ac19', text: 'Highlights specific concepts where independent demonstration lagged', completed: false },
    ],
  },
  {
    id: 'REPT-02',
    featureId: 'feat-15',
    epicId: 'epic-5',
    title: 'Student fairness explanation and dialogue channel',
    description: 'Create a student portal interface allowing students to view report feedback and submit explanatory context or appeal flagged gaps.',
    userStory: 'As a student, I want a formal, fair channel to explain anomalies or context on my report so that my teacher understands my perspective before academic decisions are finalized.',
    status: 'To Do',
    priority: 'Must Have',
    isMvp: true,
    assigneeId: 'mem-4', // Althea Cruz
    reviewerId: 'mem-2', // Maria Santos
    estimateHours: 10,
    deadline: '2026-10-16',
    dependencies: ['REPT-01'],
    inSprint: true,
    tags: ['Fairness', 'Student-Voice', 'MVP'],
    githubIssueNumber: 26,
    githubIssueUrl: 'https://github.com/watchers-project/watchers-web/issues/26',
    checklist: [
      { id: 'c24', text: 'Build student report review modal with explanation textarea', completed: false },
      { id: 'c25', text: 'Create teacher inbox for student clarification notes', completed: false },
    ],
    acceptanceCriteria: [
      { id: 'ac20', text: 'Student can submit explanatory note regarding environmental factors (e.g., connectivity loss)', completed: false },
      { id: 'ac21', text: 'Teacher receives notification and can update assessment resolution', completed: false },
    ],
  },

  // BACKLOG TASKS (Future Sprints / Post-MVP)
  {
    id: 'AUTH-02',
    featureId: 'feat-2',
    epicId: 'epic-1',
    title: 'Institution onboarding & Philippine Data Privacy Act compliance',
    description: 'Configure institutional tenant setup, data retention schedules, and NPC (National Privacy Commission) compliance disclosures.',
    userStory: 'As a school administrator or teacher, I want to configure school metadata and classroom cohorts so that student groups are isolated and protected.',
    status: 'Backlog',
    priority: 'Must Have',
    isMvp: true,
    estimateHours: 8,
    deadline: '2026-10-22',
    dependencies: ['AUTH-01'],
    inSprint: false,
    tags: ['Compliance', 'Privacy'],
    checklist: [
      { id: 'c26', text: 'Draft NPC RA 10173 data handling agreement modal', completed: false },
      { id: 'c27', text: 'Configure automated 90-day telemetry retention cleanup job', completed: false },
    ],
    acceptanceCriteria: [
      { id: 'ac22', text: 'School administrators can specify retention windows for telemetry data', completed: false },
    ],
  },
  {
    id: 'CLAS-03',
    featureId: 'feat-6',
    epicId: 'epic-2',
    title: 'Assignment rubric & competency taxonomy mapping',
    description: 'Provide teachers with predefined taxonomy tags aligned with DepEd / CHED curriculum standards.',
    userStory: 'As a teacher, I want to associate core competency tags with assignments so that follow-up assessments target exact syllabus objectives.',
    status: 'Backlog',
    priority: 'Should Have',
    isMvp: false,
    estimateHours: 8,
    deadline: '2026-10-24',
    dependencies: ['CLAS-02'],
    inSprint: false,
    tags: ['Curriculum', 'Rubric'],
    checklist: [],
    acceptanceCriteria: [
      { id: 'ac23', text: 'Support custom competency creation and predefined standard tags', completed: false },
    ],
  },
  {
    id: 'SUBM-03',
    featureId: 'feat-9',
    epicId: 'epic-3',
    title: 'Submission concept parser & key argument extractor',
    description: 'Analyze student submissions using lightweight NLP to extract key conceptual claims for tailored follow-up quizzes.',
    userStory: 'As a system backend, I want to parse key terms and structural arguments from submissions so that follow-up assessments are grounded directly in the student submitted material.',
    status: 'Backlog',
    priority: 'Should Have',
    isMvp: true,
    estimateHours: 12,
    deadline: '2026-10-25',
    dependencies: ['SUBM-01'],
    inSprint: false,
    tags: ['NLP', 'Concept-Extraction'],
    checklist: [],
    acceptanceCriteria: [
      { id: 'ac24', text: 'Extracts 3 focal concept sentences from student essays or function declarations from code', completed: false },
    ],
  },
  {
    id: 'EVAL-03',
    featureId: 'feat-12',
    epicId: 'epic-4',
    title: 'Oral defense & live practical check scheduler',
    description: 'Allow teachers to book 2-minute quick check-ins directly inside the app for flagged concept divergences.',
    userStory: 'As a teacher, I want to flag complex submissions for a 2-minute live oral check so that students can verbally explain their methodology.',
    status: 'Backlog',
    priority: 'Should Have',
    isMvp: false,
    estimateHours: 8,
    deadline: '2026-10-28',
    dependencies: ['EVAL-01'],
    inSprint: false,
    tags: ['Oral-Defense', 'Calendar'],
    checklist: [],
    acceptanceCriteria: [
      { id: 'ac25', text: 'Calendar integration for 2-minute oral check slot booking', completed: false },
    ],
  },
  {
    id: 'EVAL-04',
    featureId: 'feat-13',
    epicId: 'epic-4',
    title: 'Offline-resilient assessment buffer with IndexedDB',
    description: 'Buffer student follow-up responses in browser storage to handle sporadic provincial internet disruptions.',
    userStory: 'As a student in regions with unstable connectivity, I want local caching of my answers so that brief network interruptions do not cause lost test data.',
    status: 'Backlog',
    priority: 'Could Have',
    isMvp: false,
    estimateHours: 8,
    deadline: '2026-10-29',
    dependencies: ['EVAL-01'],
    inSprint: false,
    tags: ['Offline', 'PWA'],
    checklist: [],
    acceptanceCriteria: [
      { id: 'ac26', text: 'Test responses survive browser refresh or wifi drop without loss', completed: false },
    ],
  },
  {
    id: 'REPT-03',
    featureId: 'feat-16',
    epicId: 'epic-5',
    title: 'Cohort learning analytics & institutional accreditation export',
    description: 'Generate institutional reports showing overall AI policy adoption rates, student mastery averages, and curriculum health.',
    userStory: 'As an academic coordinator, I want aggregate department charts on AI tool adoption and concept retention trends so that our institution can calibrate curriculum standards.',
    status: 'Backlog',
    priority: 'Could Have',
    isMvp: false,
    estimateHours: 12,
    deadline: '2026-10-30',
    dependencies: ['REPT-01'],
    inSprint: false,
    tags: ['Institutional', 'Analytics'],
    checklist: [],
    acceptanceCriteria: [
      { id: 'ac27', text: 'Export anonymized department summary PDF for academic review boards', completed: false },
    ],
  },
];

export const currentSprint: Sprint = {
  id: 'sprint-1',
  name: 'Sprint 1: Core Integrity MVP & Traceable Workflow',
  goal: 'Deliver Watchers MVP Core: Institutional Role Auth, AI Usage Policy Configuration, Independent Verification Quiz Engine with Focus Telemetry, and Initial Gap Report.',
  startDate: '2026-10-09',
  endDate: '2026-10-16',
  totalEstimatedHours: 88,
  completedHours: 35,
  blockers: [
    {
      id: 'blk-1',
      description: 'Browser visibilitychange event triggers when system screensaver activates; need threshold debounce to prevent false focus-loss flag.',
      owner: 'David Tan',
      status: 'active',
    },
    {
      id: 'blk-2',
      description: 'Clarifying Philippine Startup Challenge SDG 4 alignment criteria for fair assessment evidence.',
      owner: 'James Godinez',
      status: 'resolved',
    },
  ],
};

export const gitHubIssues: GitHubIssue[] = [
  {
    number: 12,
    title: 'Implement login interface and role-based route guard',
    cardId: 'AUTH-01',
    author: 'jgodinez',
    state: 'closed',
    labels: ['feature', 'auth', 'mvp', 'traceable'],
    createdAt: '2026-10-09 09:15 PST',
    body: `### Description
Implement secure authentication flow for Watchers web application. Must support Teacher, Student, and Academic Coordinator roles with proper session management.

### Acceptance Criteria
- [x] Login with email/password and role selection
- [x] JWT token generated and verified on protected routes
- [x] Redirect unauthorized users with feedback toast
- [x] Unit test suite covering invalid credentials & expiration

### Linked Card
Trello/ClickUp Board Card: AUTH-01`,
    assignees: ['jgodinez'],
  },
  {
    number: 18,
    title: 'Implement follow-up assessment quiz and question generator',
    cardId: 'EVAL-01',
    author: 'altheacruz-qa',
    state: 'open',
    labels: ['feature', 'assessment', 'differentiator', 'traceable'],
    createdAt: '2026-10-10 14:30 PST',
    body: `### Description
Build the core independent verification assessment engine. Generates 3 rapid concept verification prompts based on the student's submitted assignment.

### Acceptance Criteria
- [x] Render 3 concept questions targeting core competencies
- [x] 5-minute strict countdown timer with auto-submit
- [x] Disable copy-paste inside prompt responses
- [ ] Connect submission output to Teacher Gap Report

### Linked Card
Trello/ClickUp Board Card: EVAL-01`,
    assignees: ['altheacruz-qa'],
  },
  {
    number: 19,
    title: 'Build AI usage policy selector and student acknowledgment modal',
    cardId: 'CLAS-02',
    author: 'creyes-ph',
    state: 'open',
    labels: ['feature', 'policy', 'ethics'],
    createdAt: '2026-10-11 10:00 PST',
    body: `### Description
Teachers must be able to specify the permitted AI usage level for each assignment (Prohibited, Ideation Only, Allowed with Citation, Open Exploration).

### Linked Card
Trello/ClickUp Board Card: CLAS-02`,
    assignees: ['creyes-ph'],
  },
  {
    number: 20,
    title: 'Contextual browser focus event telemetry logger',
    cardId: 'EVAL-02',
    author: 'dtan-cyber',
    state: 'open',
    labels: ['feature', 'telemetry', 'privacy'],
    createdAt: '2026-10-11 16:45 PST',
    body: `### Description
Capture window blur, tab switching, and focus loss during the 5-minute independent assessment as non-punitive contextual signals.

### Linked Card
Trello/ClickUp Board Card: EVAL-02`,
    assignees: ['dtan-cyber'],
  },
];

export const gitHubCommits: GitHubCommit[] = [
  {
    hash: 'a7b89f2',
    message: 'feat(auth): implement login form and role-based route guard (#12)',
    author: 'James Godinez <godinezjames14@gmail.com>',
    date: '2026-10-10 14:12 PST',
    branch: 'feature/12-user-login',
    issueRef: 12,
  },
  {
    hash: '3c81e9d',
    message: 'feat(classroom): add class creation and 6-char enrollment code (#15)',
    author: 'Maria Santos <maria.santos@watchers.edu.ph>',
    date: '2026-10-11 10:45 PST',
    branch: 'feature/15-classroom-roster',
    issueRef: 15,
  },
  {
    hash: '8e4f102',
    message: 'feat(eval): add independent verification quiz generator & timer (#18)',
    author: 'Althea Cruz <althea.cruz@watchers.edu.ph>',
    date: '2026-10-11 17:30 PST',
    branch: 'feature/18-followup-quiz-engine',
    issueRef: 18,
  },
  {
    hash: '9d2011b',
    message: 'feat(policy): implement 4-tier AI usage policy builder and student terms modal (#19)',
    author: 'Carlos Reyes <carlos.reyes@watchers.edu.ph>',
    date: '2026-10-12 11:15 PST',
    branch: 'feature/19-ai-policy-engine',
    issueRef: 19,
  },
  {
    hash: '4f88e1a',
    message: 'feat(telemetry): wire ethical browser focus loss listener with student disclosure banner (#20)',
    author: 'David Tan <david.tan@watchers.edu.ph>',
    date: '2026-10-12 15:40 PST',
    branch: 'feature/20-telemetry-focus-logger',
    issueRef: 20,
  },
];

export const gitHubPullRequests: GitHubPullRequest[] = [
  {
    number: 14,
    title: 'Add user login interface and role protection — references #12',
    branch: 'feature/12-user-login',
    base: 'main',
    issueNumber: 12,
    cardId: 'AUTH-01',
    author: 'jgodinez',
    reviewer: 'creyes-ph',
    status: 'merged',
    createdAt: '2026-10-10 14:30 PST',
    mergedAt: '2026-10-10 17:00 PST',
    diffStats: { additions: 342, deletions: 18, filesChanged: 6 },
    description: `## Summary
Closes #12. Implements institutional authentication supporting Teacher and Student login states, persistent JWT storage, and role-protected layout guards.

## Testing & Verification
- Unit test suite passed: 14 tests in auth.test.ts
- Manual QA verified role switching between Teacher dashboard and Student portal.
- Checked compliance with lab manual requirement: Never commit real secrets. All env tokens loaded via .env.example.`,
    reviewFindings: [
      {
        reviewer: 'Carlos Reyes (Backend Lead)',
        status: 'APPROVED',
        comment: 'Code review approved. Clean separation of concerns between AuthService and React router middleware. JWT token expiry handling verified. No hardcoded credentials detected.',
        reviewedAt: '2026-10-10 16:40 PST',
      },
    ],
  },
  {
    number: 21,
    title: 'Add follow-up quiz engine & browser telemetry hooks — references #18',
    branch: 'feature/18-followup-quiz-engine',
    base: 'main',
    issueNumber: 18,
    cardId: 'EVAL-01',
    author: 'altheacruz-qa',
    reviewer: 'jgodinez',
    status: 'in_review',
    createdAt: '2026-10-11 18:00 PST',
    diffStats: { additions: 420, deletions: 12, filesChanged: 8 },
    description: `## Summary
Resolves #18. Introduces the core differentiator of the Watchers platform: the independent follow-up verification assessment.
- Selects 3 rapid concept verification prompts based on the submitted work.
- Includes a 5-minute strict countdown timer with client auto-save.
- Disables copy/paste into response areas to encourage genuine student explanation.`,
    reviewFindings: [
      {
        reviewer: 'James Godinez (Project Lead)',
        status: 'COMMENT',
        comment: 'Great work Althea! Please ensure the student cannot accidentally lose answers if they switch browser tabs to check the assignment document. The local storage buffer works nicely.',
        reviewedAt: '2026-10-12 08:30 PST',
      },
      {
        reviewer: 'David Tan (Security Lead)',
        status: 'APPROVED',
        comment: 'Focus telemetry integration looks ethical and clean. The student banner properly discloses what browser events are logged. Approved for staging testing.',
        reviewedAt: '2026-10-12 09:15 PST',
      },
    ],
  },
];

export const contributionMatrix: MemberContribution[] = [
  {
    name: 'James Godinez',
    role: 'Project Lead & Full-Stack Architect',
    primaryTasks: ['AUTH-01 (Login Architecture)', 'REPT-01 (Gap Report Lead)', 'GitHub Repo & CI Setup'],
    tasksOwnedCount: 4,
    prCount: 2,
    reviewsCount: 3,
    estimatedHours: 32,
    actualHours: 31,
    accountabilityScore: 98,
  },
  {
    name: 'Maria Santos',
    role: 'Frontend UI/UX Specialist',
    primaryTasks: ['CLAS-01 (Classroom UI)', 'SUBM-01 (Submission & AI Disclosure Modal)', 'Responsive Design'],
    tasksOwnedCount: 4,
    prCount: 2,
    reviewsCount: 2,
    estimatedHours: 30,
    actualHours: 29,
    accountabilityScore: 96,
  },
  {
    name: 'Carlos Reyes',
    role: 'Backend & Data Services Engineer',
    primaryTasks: ['CLAS-02 (AI Policy Rules)', 'Database Schemas', 'PR #14 Code Reviewer'],
    tasksOwnedCount: 4,
    prCount: 1,
    reviewsCount: 3,
    estimatedHours: 34,
    actualHours: 32,
    accountabilityScore: 97,
  },
  {
    name: 'Althea Cruz',
    role: 'QA & Assessment Logic Engineer',
    primaryTasks: ['EVAL-01 (Follow-Up Quiz Engine)', 'REPT-02 (Fairness Portal)', 'Test Suites'],
    tasksOwnedCount: 3,
    prCount: 1,
    reviewsCount: 2,
    estimatedHours: 28,
    actualHours: 27,
    accountabilityScore: 95,
  },
  {
    name: 'David Tan',
    role: 'Security & Context Telemetry Engineer',
    primaryTasks: ['EVAL-02 (Browser Focus Telemetry)', 'Data Privacy Act Compliance', 'Security Auditing'],
    tasksOwnedCount: 3,
    prCount: 1,
    reviewsCount: 2,
    estimatedHours: 26,
    actualHours: 24,
    accountabilityScore: 94,
  },
];

export const virtualRepoFiles: { path: string; name: string; type: 'file' | 'folder'; content?: string; language: string }[] = [
  {
    path: 'README.md',
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# Watchers: Web-Based Learning Integrity Platform
> **Philippine Startup Challenge XI Entry & Software Project Development Laboratory Submission**
> Team: Watchers DevTeam | Lead: James Godinez | Institution: Philippine Academic Network

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![SDG Priority](https://img.shields.io/badge/SDG%204-Quality%20Education-orange)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](#)

---

## 1. Project Summary & Problem Statement
With generative AI assistants (ChatGPT, Claude, Gemini) widely accessible, students can easily produce articulate, polished submissions without actually mastering the underlying concepts. Current "AI detector" software produces notoriously unreliable scores and unfairly accuses honest students. 

**Watchers** solves this without automatic accusations. Rather than treating tool use as misconduct, Watchers:
1. Gives teachers tools to set clear, transparent **AI usage policies** (e.g., permitted brainstorming vs. prohibited code-generation).
2. Mandates student **AI disclosure declarations** upon submission.
3. Automatically assigns a **short independent follow-up verification task** (3–5 min quiz or code explanation) covering the exact concepts of the submission.
4. Generates an evidence-backed **Demonstrated Understanding vs. Submission Report**, highlighting specific learning gaps for teacher support.

---

## 2. Target Users & Stakeholders
- **Teachers & Instructors:** Gain clear evidence of whether a student can explain their work independently; save review time.
- **Students:** Receive fair, transparent expectations; practice responsible AI tool use without fearing false accusations; granted formal channels to explain their work.
- **Academic Coordinators & Schools:** Align with Philippine Data Privacy Act (RA 10173) and SDG 4 (Quality Education) benchmarks.

---

## 3. Core Features & Epics
- **EPIC-01: Role-Based Access & Identity:** Granular permissions for Teachers, Students, and Administrators.
- **EPIC-02: Classroom & AI Policy Rules:** Flexible policies per assignment (Prohibited, Brainstorming Only, Full Citation Required).
- **EPIC-03: Assignment Submission & Disclosure:** Drag-and-drop submission with transparent tool declaration.
- **EPIC-04: Independent Follow-Up Assessment Engine:** 5-minute concept checks with ethical contextual focus telemetry.
- **EPIC-05: Learning Integrity Analytics & Teacher Gap Reports:** Side-by-side comparative reports for restorative academic guidance.
- **EPIC-06: Student Fairness Dialogue:** Opportunity for students to explain anomalies or edge cases.

---

## 4. Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend Services:** Node.js, Express, RESTful APIs, JWT Authentication
- **Data & Telemetry:** PostgreSQL / Cloud SQL, IndexedDB client caching
- **CI/CD & Collaboration:** GitHub Actions, Trello/ClickUp Agile Board, Semantic Versioning

---

## 5. Team Members & Roles
| Name | Role | GitHub | Contact |
|---|---|---|---|
| **James Godinez** | Project Lead & Full-Stack Architect | @jgodinez | godinezjames14@gmail.com |
| **Maria Santos** | Frontend UI/UX Specialist | @msantos-dev | maria.santos@watchers.edu.ph |
| **Carlos Reyes** | Backend & Database Lead | @creyes-ph | carlos.reyes@watchers.edu.ph |
| **Althea Cruz** | QA & Assessment Logic Engineer | @altheacruz-qa | althea.cruz@watchers.edu.ph |
| **David Tan** | Security & Telemetry Specialist | @dtan-cyber | david.tan@watchers.edu.ph |

---

## 6. Local Setup Steps
\`\`\`bash
# 1. Clone the repository
git clone https://github.com/watchers-project/watchers-web.git
cd watchers-web

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run development server (Port 3000)
npm run dev

# 5. Execute test suite
npm test
\`\`\`

---

## 7. Collaborative Task Board
- **Live Agile Board:** [Watchers Project Management Board](https://watchers-workspace.internal/board)
- **Status Workflow:** Backlog → To Do → In Progress → For Review → Testing → Done
`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    type: 'file',
    language: 'ignore',
    content: `# Dependencies
node_modules/
.pnp
.pnp.js

# Production build artifacts
dist/
build/
*.tsbuildinfo

# Environment variables & secrets (NEVER COMMIT REAL SECRETS)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# Editor & OS files
.DS_Store
Thumbs.db
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`,
  },
  {
    path: '.env.example',
    name: '.env.example',
    type: 'file',
    language: 'shell',
    content: `# Watchers Application Environment Variables Template
# Copy this file to .env.local and populate with your staging credentials.
# WARNING: NEVER commit actual secrets, private keys, or passwords.

# App Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# JWT Authentication
JWT_SECRET=replace_with_secure_random_hex_string_in_production
JWT_EXPIRATION=8h
JWT_REFRESH_EXPIRATION=7d

# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://watchers_user:your_password@localhost:5432/watchers_db

# Security & Telemetry Settings
TELEMETRY_RETENTION_DAYS=90
ENFORCE_HTTPS=true
CORS_ORIGIN=http://localhost:3000
`,
  },
  {
    path: 'CONTRIBUTING.md',
    name: 'CONTRIBUTING.md',
    type: 'file',
    language: 'markdown',
    content: `# Contributing to Watchers
Thank you for contributing to the Watchers Learning Integrity Platform. This guide enforces the development and collaboration standards defined in the Software Project Development Laboratory Manual.

---

## 1. Branching Strategy
We follow a strict Git feature-branch workflow branched directly off \`main\`:

- **Main branch (\`main\`):** Protected. Contains only stable, reviewed, and tested code. Direct pushes are blocked.
- **Feature branches:** \`feature/<issue-number>-<short-descriptive-name>\`
  - *Example:* \`feature/12-user-login\`
  - *Example:* \`feature/18-followup-quiz-engine\`
- **Bug fix branches:** \`fix/<issue-number>-<short-descriptive-name>\`
  - *Example:* \`fix/24-timer-overflow\`
- **Documentation branches:** \`docs/<issue-number>-<short-name>\`

---

## 2. Commit Message Conventions
All commit messages must adhere to the Conventional Commits specification:
\`\`\`text
<type>(<scope>): <short description in present imperative> (#<issue-number>)
\`\`\`

### Valid Types:
- \`feat\`: A new feature implementation
- \`fix\`: A bug fix
- \`docs\`: Documentation changes
- \`refactor\`: Code restructuring without behavioral change
- \`test\`: Adding or correcting test suites
- \`chore\`: Build process or tooling updates

### Examples:
- \`feat(auth): implement user login form and JWT state (#12)\`
- \`feat(eval): add 5-minute countdown timer with auto-submit (#18)\`
- \`fix(telemetry): debounce blur events during window resize (#20)\`

---

## 3. Pull Request & Peer Review Rules
1. Every Pull Request must link to an existing GitHub Issue using keywords: \`Resolves #<issue>\` or \`References #<issue>\`.
2. Must have **at least one approving peer review** before merging.
3. All automated tests in CI must pass.
4. Tasks cannot enter \`Done\` on the project board without documented review findings and verification evidence!
5. Protect \`main\`. Never bypass branch protection or force-push to \`main\`.
`,
  },
  {
    path: 'docs/requirements.md',
    name: 'docs/requirements.md',
    type: 'file',
    language: 'markdown',
    content: `# Software Requirements Specification (SRS) - Watchers Platform
**Philippine Startup Challenge XI | Department of Information and Communications Technology**

## 1. Introduction & Vision
Watchers is a web-based learning integrity platform designed to help secondary schools, colleges, and universities understand whether students can independently demonstrate the knowledge behind their submitted assignments in an era of ubiquitous AI assistance.

Instead of making automated accusations of misconduct using flawed statistical AI detectors, Watchers creates an evidence-based pedagogical bridge between student submissions and independent demonstrations of understanding.

---

## 2. MoSCoW Feature Backlog Breakdown

### Must Have (Essential MVP Scope)
1. **AUTH-01:** Role-Based Access for Teachers, Students, and Academic Coordinators.
2. **CLAS-01:** Subject & Class Management with 6-character enrollment join codes.
3. **CLAS-02:** Teacher-Defined AI Tool Usage Rules (Prohibited, Ideation Only, Full Citation Required).
4. **SUBM-01:** Assignment submission upload with mandatory AI tool disclosure declarations.
5. **EVAL-01:** Short independent follow-up assessment engine (3 rapid concept check prompts).
6. **EVAL-02:** Contextual browser focus event telemetry (loss of page focus, window blur).
7. **REPT-01:** Demonstrated Understanding vs. Submission Quality Gap Report.
8. **REPT-02:** Student fairness explanation & dialogue portal.

### Should Have (Phase 2 Prototype)
9. **AUTH-03:** Password recovery & session audit log trails.
10. **CLAS-03:** Assignment rubric and competency taxonomy mapping (DepEd/CHED aligned).
11. **SUBM-03:** NLP-assisted key concept extractor for targeted question alignment.
12. **EVAL-03:** 2-minute live oral check appointment scheduler for teachers.

### Could Have (Post-MVP Enhancements)
13. **SUBM-02:** Multi-version draft revision history and diff comparison.
14. **EVAL-04:** Offline-resilient IndexedDB assessment caching for low-bandwidth schools.
15. **REPT-03:** Institutional aggregate analytics and accreditation reporting.

### Won't Have (Excluded by Design)
16. Automated cheating verdicts or algorithm-imposed academic penalties.
17. Invasive biometric video webcam proctoring or keystroke spyware.

---

## 3. Non-Functional Requirements
- **NFR-01 (Privacy Compliance):** Strict adherence to Philippine Republic Act 10173 (Data Privacy Act). Student telemetry data is encrypted at rest and purged after 90 days.
- **NFR-02 (Performance):** Follow-up quiz prompts must generate in under 1.5 seconds.
- **NFR-03 (Reliability):** 99.5% uptime during standard academic examination hours (7:00 AM – 8:00 PM PST).
- **NFR-04 (Usability):** Intuitive mobile-first responsive design usable across Chromebooks, tablets, and mobile smartphones.
`,
  },
  {
    path: 'docs/architecture.md',
    name: 'docs/architecture.md',
    type: 'file',
    language: 'markdown',
    content: `# System Architecture & Data Flow - Watchers Platform

## 1. High-Level Architecture Diagram
\`\`\`
+--------------------------------------------------------------+
|                    Client Layer (React SPA)                  |
|  [Teacher Portal]      [Student Assessment]     [Admin Hub]  |
+--------------------------------------------------------------+
                               |
                   HTTPS / REST API + WebSocket
                               v
+--------------------------------------------------------------+
|                     Application Server                       |
|   +-------------------+  +--------------------------------+  |
|   | Auth & RBAC Guard |  | AI Policy Enforcement Service |  |
|   +-------------------+  +--------------------------------+  |
|   +-------------------+  +--------------------------------+  |
|   | Assessment Engine |  | Contextual Telemetry Logger    |  |
|   +-------------------+  +--------------------------------+  |
|   +-------------------------------------------------------+  |
|   |       Demonstrated Understanding Gap Analyzer         |  |
|   +-------------------------------------------------------+  |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                      Persistence Layer                       |
|  - Users & Institutions (PostgreSQL)                         |
|  - Assignments & AI Policy Rules (PostgreSQL)                |
|  - Follow-up Assessments & Responses (PostgreSQL)            |
|  - Contextual Focus Event Telemetry (Timeseries Buffer)      |
+--------------------------------------------------------------+
\`\`\`

---

## 2. Core Integrity Verification Data Flow
1. **Assignment Submission:** Student submits work and fills out mandatory AI disclosure form (declaring tools used and self-reflection).
2. **Follow-Up Trigger:** Watchers schedules a 3-question independent follow-up verification quiz covering the key concepts.
3. **Assessment Execution & Telemetry:** 
   - Student completes questions within a 5-minute strict countdown timer.
   - Non-intrusive event listeners capture window blur / tab focus changes as contextual telemetry.
4. **Gap Analysis Generation:**
   - Teacher dashboard compiles **Demonstrated Understanding vs. Submitted Work** comparison.
   - Computes Concept Gap Delta score and suggests constructive pedagogical actions (e.g. Schedule Oral Check, Peer Tutoring).
5. **Student Fair Dialogue:** Student can view feedback and submit clarification notes before any grade is finalized.
`,
  },
  {
    path: 'docs/team-roles.md',
    name: 'docs/team-roles.md',
    type: 'file',
    language: 'markdown',
    content: `# Team Roles & RACI Responsibility Matrix
**Software Project Development Laboratory Manual - Exercise 1**

## Team Structure
- **James Godinez** - Project Lead & Full-Stack Architect
- **Maria Santos** - Frontend UI/UX Specialist
- **Carlos Reyes** - Backend & Database Lead
- **Althea Cruz** - QA & Assessment Logic Engineer
- **David Tan** - Security & Telemetry Specialist

---

## RACI Matrix (Responsible, Accountable, Consulted, Informed)

| Milestone / Deliverable | James Godinez | Maria Santos | Carlos Reyes | Althea Cruz | David Tan |
|---|:---:|:---:|:---:|:---:|:---:|
| Project Setup & Repo Config | **A / R** | C | C | I | C |
| Kanban Board & Traceability Setup | **A / R** | C | C | R | I |
| EPIC-01: Auth & User Roles | **A** | C | **R** | I | C |
| EPIC-02: Classroom & AI Policies | C | **R** | **A / R** | I | I |
| EPIC-03: Submission & Disclosure | C | **A / R** | C | I | I |
| EPIC-04: Follow-up Quiz Engine | C | C | C | **A / R** | I |
| EPIC-04: Focus Telemetry Hook | C | I | I | C | **A / R** |
| EPIC-05: Gap Reports & Dialogue | **A / R** | C | C | R | I |
| Sprint Planning & Accountability | **A / R** | R | R | R | R |

*Legend: R = Responsible for doing; A = Accountable for completion; C = Consulted; I = Informed.*
`,
  },
  {
    path: 'src/services/auth.ts',
    name: 'src/services/auth.ts',
    type: 'file',
    language: 'typescript',
    content: `/**
 * @license
 * Watchers Platform - Authentication Service
 * Implements JWT authentication and Role-Based Access Control (RBAC).
 */

export interface UserSession {
  userId: string;
  email: string;
  role: 'teacher' | 'student' | 'coordinator';
  institutionId: string;
  name: string;
  token: string;
}

export class AuthService {
  private static STORAGE_KEY = 'watchers_user_session';

  public static async login(email: string, role: 'teacher' | 'student'): Promise<UserSession> {
    // Simulated token generation for development prototype
    const session: UserSession = {
      userId: role === 'teacher' ? 'usr-teacher-01' : 'usr-student-01',
      email,
      role,
      institutionId: 'inst-ph-diliman-01',
      name: role === 'teacher' ? 'Prof. Elena Ramirez' : 'James Godinez',
      token: 'jwt_mock_' + Math.random().toString(36).substring(2),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  public static getCurrentUser(): UserSession | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  public static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
`,
  },
  {
    path: 'src/services/assessmentEngine.ts',
    name: 'src/services/assessmentEngine.ts',
    type: 'file',
    language: 'typescript',
    content: `/**
 * @license
 * Watchers Platform - Assessment Engine
 * Generates short independent verification tasks and evaluates concept understanding.
 */

export interface ConceptQuestion {
  id: string;
  concept: string;
  question: string;
  expectedKeywords: string[];
  timeLimitSeconds: number;
}

export class AssessmentEngine {
  public static generateVerificationQuestions(assignmentTopic: string): ConceptQuestion[] {
    return [
      {
        id: 'q-1',
        concept: 'Algorithm Complexity & Strategy',
        question: 'Explain why your submitted solution chose this specific algorithmic approach over an iterative fallback, and describe its time complexity.',
        expectedKeywords: ['time complexity', 'O(n)', 'memory', 'tradeoff'],
        timeLimitSeconds: 120,
      },
      {
        id: 'q-2',
        concept: 'Edge Case & Error Handling',
        question: 'What boundary condition or invalid input could break your implementation, and how would you adapt your logic to defend against it?',
        expectedKeywords: ['null', 'boundary', 'exception', 'validation'],
        timeLimitSeconds: 90,
      },
      {
        id: 'q-3',
        concept: 'Conceptual Defense & Transfer',
        question: 'If the input constraints doubled in scale or real-time streaming was introduced, what core change would you make to your submitted architecture?',
        expectedKeywords: ['scale', 'batch', 'queue', 'concurrency'],
        timeLimitSeconds: 90,
      },
    ];
  }

  public static calculateUnderstandingScore(answers: Record<string, string>): number {
    const totalQuestions = Object.keys(answers).length;
    if (totalQuestions === 0) return 0;

    let score = 0;
    Object.values(answers).forEach((ans) => {
      if (ans.trim().length > 40) score += 33.3;
      else if (ans.trim().length > 15) score += 20;
    });

    return Math.min(100, Math.round(score));
  }
}
`,
  },
  {
    path: 'tests/assessment.test.ts',
    name: 'tests/assessment.test.ts',
    type: 'file',
    language: 'typescript',
    content: `/**
 * Test Suite: Watchers Independent Follow-Up Assessment Engine
 * Validates question generation, time limits, and score calculation.
 */

import { describe, it, expect } from 'vitest';
import { AssessmentEngine } from '../src/services/assessmentEngine';

describe('AssessmentEngine Suite', () => {
  it('should generate 3 distinct concept verification questions', () => {
    const questions = AssessmentEngine.generateVerificationQuestions('Data Structures');
    expect(questions).toHaveLength(3);
    expect(questions[0].concept).toBeDefined();
    expect(questions[0].timeLimitSeconds).toBeGreaterThan(0);
  });

  it('should compute appropriate score for substantive answers', () => {
    const answers = {
      'q-1': 'The time complexity is O(n log n) because we implemented a divide-and-conquer merge procedure which optimizes heap memory.',
      'q-2': 'Null pointers and empty array boundaries are caught using explicit precondition guards.',
      'q-3': 'We would partition streams into consumer queues to balance worker memory.',
    };

    const score = AssessmentEngine.calculateUnderstandingScore(answers);
    expect(score).toBeGreaterThanOrEqual(95);
  });

  it('should return 0 for empty answers', () => {
    const score = AssessmentEngine.calculateUnderstandingScore({});
    expect(score).toBe(0);
  });
});
`,
  },
];
