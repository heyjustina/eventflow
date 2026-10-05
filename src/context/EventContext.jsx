import { createContext, useContext, useMemo } from 'react';
import { events as seedEvents } from '../data/events';
import { sampleSchedule } from '../data/schedule';
import { generatePlan, generateBudget } from '../utils/planGenerator';
import { getEventMetrics } from '../utils/metrics';
import { useLocalStorage } from '../hooks/useLocalStorage';

const EventContext = createContext(null);

/* ---------- Starter (demo) data builders ---------- */

// Plans for the demo events, with the earliest tasks marked Done to match progress
function buildSeedTasks() {
  return seedEvents.flatMap((event) => {
    const plan = generatePlan(event);
    const doneCount = Math.round((plan.length * event.progress) / 100);
    const byDate = [...plan].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const doneIds = new Set(byDate.slice(0, doneCount).map((t) => t.id));
    return plan.map((t) => (doneIds.has(t.id) ? { ...t, status: 'Done' } : t));
  });
}

function buildBudgetItems(event) {
  return generateBudget(event).map((item, index) => ({
    id: `${event.id}-b${index}`,
    eventId: event.id,
    category: item.category,
    estimated: item.amount,
    actual: 0,
  }));
}

function buildSeedBudget() {
  return seedEvents.flatMap((event) =>
    buildBudgetItems(event).map((item) => {
      let actual = Math.round((item.estimated * event.progress) / 100);
      // Demo data: make one category go over budget so warnings are visible
      if (event.id === 2 && item.category === 'Venue') {
        actual = Math.round(item.estimated * 1.2);
      }
      return { ...item, actual };
    })
  );
}

function buildSchedule(eventId) {
  return sampleSchedule.map((item, index) => ({
    ...item,
    id: `${eventId}-s${index}`,
    eventId,
  }));
}

function buildSeedSchedule() {
  return [1, 4].flatMap(buildSchedule);
}

/* ---------- Provider ---------- */

export function EventProvider({ children }) {
  const [rawEvents, setRawEvents] = useLocalStorage('eventflow:events', seedEvents);
  const [tasks, setTasks] = useLocalStorage('eventflow:tasks', buildSeedTasks);
  const [budgetItems, setBudgetItems] = useLocalStorage('eventflow:budget', buildSeedBudget);
  const [scheduleItems, setScheduleItems] = useLocalStorage('eventflow:schedule', buildSeedSchedule);

  // Status and progress are DERIVED from tasks and budget, not stored
  const events = useMemo(
    () =>
      rawEvents.map((event) => {
        const metrics = getEventMetrics(
          event,
          tasks.filter((t) => t.eventId === event.id),
          budgetItems.filter((b) => b.eventId === event.id)
        );
        return { ...event, progress: metrics.readiness, status: metrics.status };
      }),
    [rawEvents, tasks, budgetItems]
  );

  /* Events */
  function addEvent(newEvent) {
    const event = { ...newEvent, id: Date.now(), status: 'Planning', progress: 0 };
    setRawEvents((current) => [event, ...current]);
    setTasks((current) => [...current, ...generatePlan(event)]);
    setBudgetItems((current) => [...current, ...buildBudgetItems(event)]);
    return event.id; // so the form can open the new event
  }

  /* Tasks */
  function addTask(task) {
    setTasks((current) => [...current, { ...task, id: `t-${Date.now()}` }]);
  }
  function updateTask(id, changes) {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }
  function deleteTask(id) {
    setTasks((current) => current.filter((t) => t.id !== id));
  }

  /* Budget */
  function addBudgetItem(item) {
    setBudgetItems((current) => [...current, { ...item, id: `b-${Date.now()}` }]);
  }
  function updateBudgetItem(id, changes) {
    setBudgetItems((current) => current.map((b) => (b.id === id ? { ...b, ...changes } : b)));
  }
  function deleteBudgetItem(id) {
    setBudgetItems((current) => current.filter((b) => b.id !== id));
  }

  /* Run of show */
  function addScheduleItem(item) {
    setScheduleItems((current) => [...current, { ...item, id: `s-${Date.now()}` }]);
  }
  function deleteScheduleItem(id) {
    setScheduleItems((current) => current.filter((s) => s.id !== id));
  }

  /* Demo reset */
  function resetDemoData() {
    setRawEvents(seedEvents);
    setTasks(buildSeedTasks());
    setBudgetItems(buildSeedBudget());
    setScheduleItems(buildSeedSchedule());
  }

  const value = {
    events, tasks, budgetItems, scheduleItems,
    addEvent, addTask, updateTask, deleteTask,
    addBudgetItem, updateBudgetItem, deleteBudgetItem,
    addScheduleItem, deleteScheduleItem,
    resetDemoData,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used inside <EventProvider>');
  }
  return context;
}