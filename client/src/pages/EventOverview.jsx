import { useOutletContext } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { formatDate, formatCurrency } from '../utils/format';
import { getEventMetrics, getRisks } from '../utils/metrics';
import { PHASES } from '../data/planTemplates';
import '../styles/overview.css';

const riskLabel = { danger: 'High', warning: 'Medium', info: 'Note' };

function EventOverview() {
  const { event } = useOutletContext(); // handed down by EventLayout
  const { tasks, budgetItems, scheduleItems } = useEvents();

  // Only this event's data
  const eventTasks = tasks.filter((t) => t.eventId === event.id);
  const eventBudget = budgetItems.filter((b) => b.eventId === event.id);
  const eventSchedule = scheduleItems.filter((s) => s.eventId === event.id);

  const metrics = getEventMetrics(event, eventTasks, eventBudget);
  const risks = getRisks(event, eventTasks, eventBudget, eventSchedule);

  let countdown = `${metrics.days} days to go`;
  if (metrics.days === 0) countdown = 'Today!';
  if (metrics.days < 0) countdown = 'Event has passed';

  const stats = [
    { label: 'Date', value: formatDate(event.date) },
    { label: 'Location', value: event.location },
    { label: 'Guests', value: event.guests },
    { label: 'Budget', value: formatCurrency(event.budget) },
    { label: 'Countdown', value: countdown },
  ];

  return (
    <div>
      <div className="stat-grid">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="two-col">
        <Card title="Readiness score">
          <ProgressBar value={metrics.readiness} label="Overall readiness" />
          <ul className="breakdown">
            <li>
              <span>Tasks done</span>
              <span>{metrics.done} of {metrics.total} ({metrics.completion}%)</span>
            </li>
            <li>
              <span>Overdue penalty</span>
              <span>−{metrics.overduePenalty}</span>
            </li>
            <li>
              <span>Budget penalty</span>
              <span>−{metrics.budgetPenalty}</span>
            </li>
          </ul>
        </Card>

        <Card title="Risk flags">
          {risks.length === 0 ? (
            <p>✅ No risks detected. Nice work.</p>
          ) : (
            <ul className="risk-list">
              {risks.map((risk) => (
                <li key={risk.message} className="risk-item">
                  <Badge tone={risk.tone}>{riskLabel[risk.tone]}</Badge>
                  <span>{risk.message}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Progress by phase">
        <ul className="budget-list">
          {PHASES.map((phase) => {
            const phaseTasks = eventTasks.filter((t) => t.phase === phase);
            const phaseDone = phaseTasks.filter((t) => t.status === 'Done').length;
            return (
              <li key={phase} className="budget-row">
                <span>{phase}</span>
                <span className="phase-count">
                  {phaseDone} / {phaseTasks.length} done
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

export default EventOverview;