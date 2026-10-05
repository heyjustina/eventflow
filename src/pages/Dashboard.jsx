import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EmptyState from '../components/ui/EmptyState';
import '../styles/dashboard.css';
import Button from '../components/ui/Button';

function Dashboard() {
  const { events, resetDemoData } = useEvents();
  const [search, setSearch] = useState('');

  const visibleEvents = events.filter((event) => {
    const text = search.toLowerCase();
    return (
      event.name.toLowerCase().includes(text) ||
      event.location.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Your Events</h1>
          <p>{events.length} events in progress</p>
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {visibleEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          message="Try a different search, or create a new event."
          action={
            <Link to="/events/new" className="header-cta">
              + New Event
            </Link>
          }
        />
      ) : (
        <div className="event-grid">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (window.confirm('Reset all data back to the demo events?')) resetDemoData();
          }}
        >
          Reset demo data
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;