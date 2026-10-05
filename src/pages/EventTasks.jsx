import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import { PHASES } from '../data/planTemplates';
import '../styles/tasks.css';

const defaultFilters = { search: '', phase: 'All', status: 'All', owner: 'All' };

const blankTask = {
  title: '',
  phase: 'Planning',
  owner: '',
  dueDate: '',
  priority: 'Medium',
  status: 'To Do',
};

function EventTasks() {
  const { event } = useOutletContext();
  const { tasks, addTask, updateTask, deleteTask } = useEvents();

  const [filters, setFilters] = useState(defaultFilters);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // 1. This event's tasks only
  const eventTasks = tasks.filter((t) => t.eventId === event.id);

  // 2. Unique owner names for the dropdown
  const owners = [...new Set(eventTasks.map((t) => t.owner).filter(Boolean))].sort();

  // 3. Apply search + filters, then sort by due date
  const visibleTasks = eventTasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPhase = filters.phase === 'All' || task.phase === filters.phase;
      const matchesStatus = filters.status === 'All' || task.status === filters.status;
      const matchesOwner =
        filters.owner === 'All' ||
        (filters.owner === 'Unassigned' ? !task.owner : task.owner === filters.owner);
      return matchesSearch && matchesPhase && matchesStatus && matchesOwner;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const doneCount = eventTasks.filter((t) => t.status === 'Done').length;

  /* ---------- Actions ---------- */
  function handleToggle(task) {
    updateTask(task.id, { status: task.status === 'Done' ? 'To Do' : 'Done' });
  }

  function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  }

  function handleAdd(values) {
    addTask({ ...values, eventId: event.id });
    setShowAddForm(false);
  }

  function handleEditSave(values) {
    updateTask(editingTask.id, values);
    setEditingTask(null);
  }

  function startEdit(task) {
    setShowAddForm(false);
    setEditingTask(task);
  }

  function startAdd() {
    setEditingTask(null);
    setShowAddForm(true);
  }

  return (
    <div>
      <div className="tasks-toolbar">
        <p className="tasks-summary">
          <strong>{doneCount}</strong> of {eventTasks.length} done · showing{' '}
          {visibleTasks.length}
        </p>
        <Button onClick={startAdd}>+ Add task</Button>
      </div>

      {showAddForm && (
        <Card title="New task" className="task-form-card">
          <TaskForm
            key="new"
            initialValues={blankTask}
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            submitLabel="Add task"
          />
        </Card>
      )}

      {editingTask && (
        <Card title="Edit task" className="task-form-card">
          <TaskForm
            key={editingTask.id}
            initialValues={editingTask}
            onSave={handleEditSave}
            onCancel={() => setEditingTask(null)}
            submitLabel="Save changes"
          />
        </Card>
      )}

      <Card className="task-filters-card">
        <TaskFilters
          filters={filters}
          owners={owners}
          onChange={setFilters}
          onClear={() => setFilters(defaultFilters)}
        />
      </Card>

      {visibleTasks.length === 0 ? (
        <EmptyState
          title={eventTasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          message={
            eventTasks.length === 0
              ? 'Add your first task to start the plan.'
              : 'Try clearing the filters or changing your search.'
          }
          action={
            eventTasks.length === 0 ? (
              <Button onClick={startAdd}>+ Add task</Button>
            ) : (
              <Button variant="secondary" onClick={() => setFilters(defaultFilters)}>
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <Card>
          {PHASES.map((phase) => {
            const phaseTasks = visibleTasks.filter((t) => t.phase === phase);
            if (phaseTasks.length === 0) return null; // skip empty phases

            return (
              <div key={phase} className="phase">
                <h4 className="phase-title">
                  {phase} <span className="phase-count">{phaseTasks.length}</span>
                </h4>
                <ul className="tasks-list">
                  {phaseTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

export default EventTasks;