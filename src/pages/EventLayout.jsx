import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import '../styles/overview.css';

const statusTone = {
  'On Track': 'success',
  'At Risk': 'warning',
  Planning: 'info',
  Completed: 'neutral',
};

function getTabClass({ isActive }) {
  return isActive ? 'tab active' : 'tab';
}

function EventLayout() {
  const { id } = useParams();
  const { events } = useEvents();
  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <EmptyState
        title="Event not found"
        message="This event doesn't exist. It may have been removed, or the link is wrong."
        action={
          <Link to="/" className="header-cta">
            Back to Dashboard
          </Link>
        }
      />
    );
  }

  const base = `/events/${event.id}`;

  return (
    <div>
      <Link to="/" className="back-link">
        ← All events
      </Link>

      <div className="page-header">
        <div>
          <h1>{event.name}</h1>
          <div className="overview-badges">
            <Badge tone="neutral">{event.type}</Badge>
            <Badge tone={statusTone[event.status] || 'neutral'}>{event.status}</Badge>
          </div>
        </div>
      </div>

      <nav className="tabs">
        <NavLink to={base} end className={getTabClass}>Overview</NavLink>
        <NavLink to={`${base}/tasks`} className={getTabClass}>Tasks</NavLink>
        <NavLink to={`${base}/budget`} className={getTabClass}>Budget</NavLink>
        <NavLink to={`${base}/run-of-show`} className={getTabClass}>Run of Show</NavLink>
        <NavLink to={`${base}/print`} className={getTabClass}>Print Plan</NavLink>
      </nav>

      {/* Child pages render here and receive `event` through context */}
      <Outlet context={{ event }} />
    </div>
  );
}

export default EventLayout;