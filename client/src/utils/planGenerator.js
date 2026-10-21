import { commonTasks, typeTasks, largeEventTasks, budgetSplit } from '../data/planTemplates';

// Subtracts days from a "2026-11-14" style date and returns the same style.
// Negative days move the date forward (used for post-event tasks).
function subtractDays(isoDate, days) {
  const date = new Date(isoDate + 'T00:00:00');
  date.setDate(date.getDate() - days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generatePlan(event) {
  // RULE 1: common tasks + tasks for this event type
  let templates = [...commonTasks, ...(typeTasks[event.type] || [])];

  // RULE 2: more than 100 guests adds security and staffing tasks
  if (event.guests > 100) {
    templates = [...templates, ...largeEventTasks];
  }

  // Turn each template into a real task for this event
  return templates.map((template, index) => ({
    id: `${event.id}-${index}`,
    eventId: event.id,
    title: template.title,
    phase: template.phase,
    priority: template.priority,
    dueDate: subtractDays(event.date, template.daysBefore),
    status: 'To Do',
    owner: '',
  }));
}

export function generateBudget(event) {
  return budgetSplit.map((item) => ({
    category: item.category,
    percent: item.percent,
    amount: Math.round((event.budget * item.percent) / 100),
  }));
}