// The five phases, in order
export const PHASES = ['Concept', 'Planning', 'Pre-Event', 'Event Day', 'Post-Event'];

// Tasks every event gets
export const commonTasks = [
  { title: 'Define event goals and success metrics', phase: 'Concept', daysBefore: 90, priority: 'High' },
  { title: 'Confirm total budget and approvals', phase: 'Concept', daysBefore: 85, priority: 'High' },
  { title: 'Book venue', phase: 'Planning', daysBefore: 75, priority: 'High' },
  { title: 'Create marketing and promotion plan', phase: 'Planning', daysBefore: 60, priority: 'Medium' },
  { title: 'Open registration or ticketing', phase: 'Pre-Event', daysBefore: 45, priority: 'Medium' },
  { title: 'Send reminder to guests', phase: 'Pre-Event', daysBefore: 7, priority: 'Medium' },
  { title: 'Confirm final headcount with vendors', phase: 'Pre-Event', daysBefore: 5, priority: 'High' },
  { title: 'Finalize run-of-show document', phase: 'Pre-Event', daysBefore: 3, priority: 'High' },
  { title: 'Set up venue', phase: 'Event Day', daysBefore: 0, priority: 'High' },
  { title: 'Welcome and check in guests', phase: 'Event Day', daysBefore: 0, priority: 'High' },
  { title: 'Teardown and venue handover', phase: 'Event Day', daysBefore: 0, priority: 'Medium' },
  { title: 'Send thank-you emails', phase: 'Post-Event', daysBefore: -2, priority: 'Low' },
  { title: 'Send feedback survey', phase: 'Post-Event', daysBefore: -3, priority: 'Medium' },
  { title: 'Reconcile final budget', phase: 'Post-Event', daysBefore: -7, priority: 'Medium' },
];

// Extra tasks that depend on the event type
export const typeTasks = {
  Workshop: [
    { title: 'Book instructor or facilitator', phase: 'Planning', daysBefore: 70, priority: 'High' },
    { title: 'Source materials and supplies', phase: 'Pre-Event', daysBefore: 14, priority: 'Medium' },
  ],
  'Pop-up': [
    { title: 'Recruit and confirm vendors', phase: 'Planning', daysBefore: 65, priority: 'High' },
    { title: 'Apply for permits', phase: 'Planning', daysBefore: 55, priority: 'High' },
    { title: 'Design booth and floor layout', phase: 'Pre-Event', daysBefore: 20, priority: 'Medium' },
  ],
  Retreat: [
    { title: 'Arrange accommodation', phase: 'Planning', daysBefore: 80, priority: 'High' },
    { title: 'Plan transportation', phase: 'Planning', daysBefore: 50, priority: 'Medium' },
    { title: 'Collect dietary needs and waivers', phase: 'Pre-Event', daysBefore: 21, priority: 'High' },
  ],
  Launch: [
    { title: 'Build press and influencer list', phase: 'Planning', daysBefore: 50, priority: 'Medium' },
    { title: 'Plan product demo', phase: 'Pre-Event', daysBefore: 21, priority: 'High' },
    { title: 'Arrange audio and visual equipment', phase: 'Pre-Event', daysBefore: 14, priority: 'Medium' },
  ],
  Conference: [
    { title: 'Book speakers', phase: 'Planning', daysBefore: 80, priority: 'High' },
    { title: 'Build the agenda', phase: 'Planning', daysBefore: 60, priority: 'High' },
    { title: 'Arrange audio and visual equipment', phase: 'Pre-Event', daysBefore: 14, priority: 'Medium' },
  ],
};

// Extra tasks added when the guest count is large
export const largeEventTasks = [
  { title: 'Hire security', phase: 'Planning', daysBefore: 40, priority: 'High' },
  { title: 'Arrange event staffing', phase: 'Planning', daysBefore: 35, priority: 'High' },
  { title: 'Plan crowd flow and capacity', phase: 'Pre-Event', daysBefore: 14, priority: 'Medium' },
];

// Suggested budget split (percent of total)
export const budgetSplit = [
  { category: 'Venue', percent: 30 },
  { category: 'Catering', percent: 25 },
  { category: 'Marketing', percent: 15 },
  { category: 'Staffing', percent: 10 },
  { category: 'Supplies & equipment', percent: 10 },
  { category: 'Contingency', percent: 10 },
];