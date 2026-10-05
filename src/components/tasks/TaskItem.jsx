import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDate } from '../../utils/format';
import { todayISO } from '../../utils/metrics';

const priorityTone = { High: 'danger', Medium: 'warning', Low: 'neutral' };
const statusTone = { 'To Do': 'neutral', 'In Progress': 'info', Done: 'success' };

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const isDone = task.status === 'Done';
  const isOverdue = !isDone && task.dueDate < todayISO();

  return (
    <li className="task-item">
      <input
        type="checkbox"
        className="task-check"
        checked={isDone}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as done`}
      />

      <div className="task-main">
        <p className={isDone ? 'task-name done' : 'task-name'}>{task.title}</p>
        <div className="task-tags">
          <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
          <Badge tone={statusTone[task.status]}>{task.status}</Badge>
          {isOverdue && <Badge tone="danger">Overdue</Badge>}
          <span className="task-owner">
            {task.owner ? `👤 ${task.owner}` : 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="task-side">
        <span className={isOverdue ? 'task-due overdue' : 'task-due'}>
          {formatDate(task.dueDate)}
        </span>
        <Button size="sm" variant="secondary" onClick={() => onEdit(task)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(task)}>Delete</Button>
      </div>
    </li>
  );
}

export default TaskItem;