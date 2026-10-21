import { formatCurrency } from './format';

// Today as "2026-10-05"
export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

// Days from today until a date (negative = in the past)
export function daysUntil(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate + 'T00:00:00');
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

// READINESS = tasks completed %, minus penalties for overdue tasks and budget trouble
export function getEventMetrics(event, tasks, budgetItems) {
  const today = todayISO();
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Done').length;
  const overdue = tasks.filter((t) => t.status !== 'Done' && t.dueDate < today).length;
  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  const spent = budgetItems.reduce((sum, i) => sum + Number(i.actual || 0), 0);
  const overItems = budgetItems.filter(
    (i) => Number(i.actual || 0) > Number(i.estimated || 0)
  ).length;

  const overduePenalty = Math.min(30, overdue * 3);
  const budgetPenalty = Math.min(20, overItems * 10 + (spent > event.budget ? 10 : 0));
  const readiness = Math.max(0, Math.min(100, completion - overduePenalty - budgetPenalty));

  const days = daysUntil(event.date);

  let status = 'On Track';
  if (days < 0) status = 'Completed';
  else if (overdue >= 2 || spent > event.budget || overItems >= 2) status = 'At Risk';
  else if (completion < 20) status = 'Planning';

  return {
    total, done, overdue, completion, spent, overItems,
    overduePenalty, budgetPenalty, readiness, status, days,
  };
}

// RISK FLAGS: a list of { tone, message } warnings
export function getRisks(event, tasks, budgetItems, scheduleItems) {
  const metrics = getEventMetrics(event, tasks, budgetItems);

  if (metrics.days < 0) {
    return [{ tone: 'info', message: 'This event has already taken place.' }];
  }

  const risks = [];
  const open = tasks.filter((t) => t.status !== 'Done');
  const dueSoon = open.filter((t) => {
    const d = daysUntil(t.dueDate);
    return d >= 0 && d <= 7;
  });

  if (metrics.overdue > 0) {
    risks.push({ tone: 'danger', message: `${plural(metrics.overdue, 'task')} overdue` });
  }
  if (dueSoon.length > 0) {
    risks.push({ tone: 'warning', message: `${plural(dueSoon.length, 'task')} due in the next 7 days` });
  }
  if (metrics.spent > event.budget) {
    risks.push({
      tone: 'danger',
      message: `Spending is ${formatCurrency(metrics.spent - event.budget)} over the total budget`,
    });
  }
  budgetItems
    .filter((i) => Number(i.actual || 0) > Number(i.estimated || 0))
    .forEach((i) => {
      risks.push({
        tone: 'warning',
        message: `${i.category} is ${formatCurrency(i.actual - i.estimated)} over its estimate`,
      });
    });
  if (scheduleItems.length === 0) {
    risks.push({ tone: 'warning', message: 'No run-of-show items for event day yet' });
  }
  if (metrics.days <= 14 && metrics.completion < 70) {
    risks.push({ tone: 'danger', message: 'Event is under 2 weeks away and less than 70% of tasks are done' });
  }

  return risks;
}