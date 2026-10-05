import { useOutletContext } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Button from '../components/ui/Button';
import { formatDate, formatCurrency, formatTime } from '../utils/format';
import { getEventMetrics, getRisks } from '../utils/metrics';
import { PHASES } from '../data/planTemplates';
import '../styles/print.css';

function EventPrint() {
  const { event } = useOutletContext();
  const { tasks, budgetItems, scheduleItems } = useEvents();

  const eventTasks = tasks.filter((t) => t.eventId === event.id);
  const items = budgetItems.filter((b) => b.eventId === event.id);
  const schedule = scheduleItems
    .filter((s) => s.eventId === event.id)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const metrics = getEventMetrics(event, eventTasks, items);
  const risks = getRisks(event, eventTasks, items, schedule);

  return (
    <div className="print-sheet">
      <div className="no-print print-actions">
        <Button onClick={() => window.print()}>🖨️ Print / Save as PDF</Button>
      </div>

      <h2>{event.name}</h2>
      <p>
        {event.type} · {formatDate(event.date)} · {event.location} · {event.guests} guests ·
        Budget {formatCurrency(event.budget)}
      </p>
      <p>
        <strong>Readiness:</strong> {metrics.readiness}% ({metrics.done} of {metrics.total} tasks
        done, {metrics.overdue} overdue) · <strong>Status:</strong> {event.status}
      </p>

      <h3>Risks</h3>
      {risks.length === 0 ? (
        <p>No risks detected.</p>
      ) : (
        <ul>
          {risks.map((risk) => (
            <li key={risk.message}>{risk.message}</li>
          ))}
        </ul>
      )}

      <h3>Tasks</h3>
      {PHASES.map((phase) => {
        const phaseTasks = eventTasks
          .filter((t) => t.phase === phase)
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        if (phaseTasks.length === 0) return null;
        return (
          <div key={phase} className="print-block">
            <h4>{phase}</h4>
            <table className="print-table">
              <tbody>
                {phaseTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="col-check">{task.status === 'Done' ? '☑' : '☐'}</td>
                    <td>{task.title}</td>
                    <td>{task.owner || 'Unassigned'}</td>
                    <td>{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <h3>Budget</h3>
      <table className="print-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Estimated</th>
            <th>Actual</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{formatCurrency(Number(item.estimated || 0))}</td>
              <td>{formatCurrency(Number(item.actual || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Run of show</h3>
      {schedule.length === 0 ? (
        <p>No schedule items yet.</p>
      ) : (
        <table className="print-table">
          <tbody>
            {schedule.map((s) => (
              <tr key={s.id}>
                <td>
                  {formatTime(s.startTime)} – {formatTime(s.endTime)}
                </td>
                <td>{s.title}</td>
                <td>{s.owner || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EventPrint;