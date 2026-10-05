import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { formatDate, formatCurrency } from '../../utils/format';

const statusTone = {
  'On Track': 'success',
  'At Risk': 'warning',
  Planning: 'info',
};

function EventCard({ event }) {
  return (
    <Card className="event-card">
      <div className="event-card-top">
        <Badge tone="neutral">{event.type}</Badge>
        <Badge tone={statusTone[event.status] || 'neutral'}>{event.status}</Badge>
      </div>

      <h3 className="event-card-name">
        <Link to={`/events/${event.id}`} className="event-card-link">
          {event.name}
        </Link>
      </h3>

      <ul className="event-card-meta">
        <li>📅 {formatDate(event.date)}</li>
        <li>📍 {event.location}</li>
        <li>👥 {event.guests} guests</li>
        <li>💰 {formatCurrency(event.budget)}</li>
      </ul>

      <ProgressBar value={event.progress} label="Readiness" />
    </Card>
  );
}

export default EventCard;