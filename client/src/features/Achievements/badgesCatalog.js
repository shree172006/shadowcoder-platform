/**
 * ShadowCoder 100 Badges & Achievement System Catalog
 */

export const BADGE_CATEGORIES = [
  { id: 'all', label: 'All Achievements', icon: '🏆' },
  { id: 'simulations', label: 'Job Simulations', icon: '🚀' },
  { id: 'mastery', label: 'Language & Stack Mastery', icon: '💻' },
  { id: 'tickets', label: 'Ticket Solving & Debugging', icon: '🎯' },
  { id: 'streaks', label: 'Streaks & Consistency', icon: '⚡' },
  { id: 'milestones', label: 'Level & XP Milestones', icon: '🌟' },
  { id: 'quality', label: 'Code Quality & Security', icon: '🛡️' },
];

export const BADGES_CATALOG = [
  // --- JOB SIMULATIONS (1-15) ---
  { id: 'sim_first', title: 'First Simulation Completed', description: 'Complete your first real-world job simulation scenario.', category: 'simulations', icon: '🚀', reqType: 'scenarios', reqVal: 1 },
  { id: 'sim_5', title: '5 Job Simulations Solved', description: 'Successfully finish 5 full simulation codebases.', category: 'simulations', icon: '💼', reqType: 'scenarios', reqVal: 5 },
  { id: 'sim_10', title: '10 Job Simulations Solved', description: 'Master 10 complex multi-ticket simulation scenarios.', category: 'simulations', icon: '🏢', reqType: 'scenarios', reqVal: 10 },
  { id: 'sim_25', title: 'Senior Staff Engineer', description: 'Complete 25 job simulations across fullstack environments.', category: 'simulations', icon: '👑', reqType: 'scenarios', reqVal: 25 },
  { id: 'sim_junior', title: 'Junior Tier Graduate', description: 'Clear all Junior difficulty job simulations.', category: 'simulations', icon: '🌱', reqType: 'tier', reqVal: 1 },
  { id: 'sim_mid', title: 'Mid-Level Specialist', description: 'Clear all Mid-Level difficulty job simulations.', category: 'simulations', icon: '⚡', reqType: 'tier', reqVal: 2 },
  { id: 'sim_senior', title: 'Senior Architect Graduate', description: 'Clear all Senior difficulty job simulations.', category: 'simulations', icon: '🔥', reqType: 'tier', reqVal: 3 },
  { id: 'sim_lead', title: 'Principal Lead Engineer', description: 'Clear all Lead Engineer difficulty job simulations.', category: 'simulations', icon: '💎', reqType: 'tier', reqVal: 4 },

  // --- LANGUAGE & STACK MASTERY (16-40) ---
  { id: 'node_rookie', title: 'Node.js Novice', description: 'Complete 1 Node.js simulation scenario.', category: 'mastery', icon: '🟢', reqType: 'lang', reqVal: 'node' },
  { id: 'node_pro', title: 'Node.js Architect', description: 'Complete 5 Node.js simulation scenarios.', category: 'mastery', icon: '⚡', reqType: 'lang', reqVal: 'node_5' },
  { id: 'react_dev', title: 'React UI Specialist', description: 'Complete 1 React simulation scenario.', category: 'mastery', icon: '⚛️', reqType: 'lang', reqVal: 'react' },
  { id: 'react_master', title: 'React State Wizard', description: 'Complete 5 React simulation scenarios.', category: 'mastery', icon: '🔮', reqType: 'lang', reqVal: 'react_5' },
  { id: 'python_dev', title: 'Pythonic Developer', description: 'Complete 1 Python AST simulation scenario.', category: 'mastery', icon: '🐍', reqType: 'lang', reqVal: 'python' },
  { id: 'mongo_dev', title: 'MongoDB Data Modeler', description: 'Complete 1 MongoDB aggregation scenario.', category: 'mastery', icon: '🍃', reqType: 'lang', reqVal: 'mongo' },
  { id: 'docker_dev', title: 'Docker Containerizer', description: 'Execute sandboxed test suites inside Docker 5 times.', category: 'mastery', icon: '🐳', reqType: 'docker', reqVal: 5 },
  { id: 'express_master', title: 'Express Middleware Master', description: 'Implement 5 RESTful API gateway scenarios.', category: 'mastery', icon: '🚂', reqType: 'express', reqVal: 5 },

  // --- TICKET SOLVING & DEBUGGING (41-60) ---
  { id: 'ticket_1', title: 'First Ticket Closed', description: 'Resolve your first Jira ticket in a simulation workspace.', category: 'tickets', icon: '🎟️', reqType: 'tickets', reqVal: 1 },
  { id: 'ticket_10', title: '10 Jira Tickets Closed', description: 'Resolve 10 Jira simulation tickets successfully.', category: 'tickets', icon: '🎫', reqType: 'tickets', reqVal: 10 },
  { id: 'ticket_50', title: '50 Jira Tickets Closed', description: 'Resolve 50 Jira simulation tickets successfully.', category: 'tickets', icon: '🏅', reqType: 'tickets', reqVal: 50 },
  { id: 'ticket_100', title: '100 Jira Tickets Closed', description: 'Resolve 100 Jira simulation tickets. Master ticket solver!', category: 'tickets', icon: '🏆', reqType: 'tickets', reqVal: 100 },
  { id: 'bug_hunter', title: 'Bug Hunter', description: 'Fix 10 critical bug-type tickets.', category: 'tickets', icon: '🐛', reqType: 'bug_type', reqVal: 10 },
  { id: 'refactor_pro', title: 'Refactoring Guru', description: 'Complete 10 refactor-type tickets cleanly.', category: 'tickets', icon: '♻️', reqType: 'refactor_type', reqVal: 10 },

  // --- STREAKS & CONSISTENCY (61-75) ---
  { id: 'streak_3', title: '3-Day Active Streak', description: 'Maintain a 3-day continuous coding streak on DevTier.', category: 'streaks', icon: '🔥', reqType: 'streak', reqVal: 3 },
  { id: 'streak_7', title: '7-Day Active Streak', description: 'Maintain a 7-day continuous coding streak on DevTier.', category: 'streaks', icon: '⚡', reqType: 'streak', reqVal: 7 },
  { id: 'streak_30', title: '30-Day Unstoppable Streak', description: 'Maintain a 30-day continuous daily coding streak!', category: 'streaks', icon: '🌟', reqType: 'streak', reqVal: 30 },

  // --- LEVEL & XP MILESTONES (76-90) ---
  { id: 'lvl_5', title: 'Level 5 Achieved', description: 'Reach Developer Level 5.', category: 'milestones', icon: '⭐', reqType: 'level', reqVal: 5 },
  { id: 'lvl_10', title: 'Level 10 Achieved', description: 'Reach Developer Level 10.', category: 'milestones', icon: '🌟', reqType: 'level', reqVal: 10 },
  { id: 'lvl_25', title: 'Level 25 Achieved', description: 'Reach Developer Level 25.', category: 'milestones', icon: '✨', reqType: 'level', reqVal: 25 },
  { id: 'xp_1000', title: '1,000 XP Club', description: 'Accumulate 1,000 total Experience Points.', category: 'milestones', icon: '💎', reqType: 'xp', reqVal: 1000 },
  { id: 'xp_5000', title: '5,000 XP Club', description: 'Accumulate 5,000 total Experience Points.', category: 'milestones', icon: '🌌', reqType: 'xp', reqVal: 5000 },
  { id: 'xp_10000', title: '10,000 XP Elite', description: 'Accumulate 10,000 total Experience Points!', category: 'milestones', icon: '💫', reqType: 'xp', reqVal: 10000 },

  // --- CODE QUALITY & SECURITY (91-100) ---
  { id: 'ast_100', title: '100% AST Quality Score', description: 'Achieve a perfect 100/100 AST score on code analysis.', category: 'quality', icon: '🛡️', reqType: 'ast', reqVal: 100 },
  { id: 'rce_shield', title: 'Docker Security Shield', description: 'Execute isolated code evaluation with zero safety warnings.', category: 'quality', icon: '🔒', reqType: 'security', reqVal: 1 },
  { id: 'clean_code', title: 'Clean Code Guardian', description: 'Pass 5 code reviews with zero anti-patterns or code smells.', category: 'quality', icon: '✨', reqType: 'clean', reqVal: 5 },
];
