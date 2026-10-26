import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/format';
import '../styles/overview.css';
import '../styles/bookings.css';

const statusTone = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'neutral',
  cancelled: 'danger',
};

function formatWhen(iso) {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

// Converts an ISO date into the format a datetime-local input expects (local time)
function toLocalInput(iso) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    apiFetch('/bookings/mine', { signal: controller.signal })
      .then(setBookings)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function replaceBooking(updated) {
    setBookings((current) => current.map((b) => (b._id === updated._id ? updated : b)));
  }

  async function handleCancel(booking) {
    if (!window.confirm(`Cancel "${booking.serviceName}"?`)) return;
    setMessage('');
    setError('');
    try {
      replaceBooking(await apiFetch(`/bookings/${booking._id}`, { method: 'DELETE' }));
      setMessage('Booking cancelled.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReschedule(booking) {
    setMessage('');
    setError('');
    if (!editValue) {
      setError('Please choose a new date and time.');
      return;
    }
    try {
      const updated = await apiFetch(`/bookings/${booking._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ appointmentAt: new Date(editValue).toISOString() }),
      });
      replaceBooking(updated);
      setEditingId(null);
      setMessage('Booking rescheduled.');
    } catch (err) {
      setError(err.message);
    }
  }

  const active = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const upcoming = active.filter((b) => new Date(b.appointmentAt) > new Date());
  const totalSpend = active.reduce((sum, b) => sum + b.price, 0);
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Bookings</h1>
          <p>Everything you have booked, in one place.</p>
        </div>
        <Link to="/services" className="header-cta">+ Book a service</Link>
      </div>

      {message && <div className="alert alert-success" role="status">{message}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="stat-grid">
        <Card className="stat-card">
          <p className="stat-label">Upcoming</p>
          <p className="stat-value">{upcoming.length}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Active total</p>
          <p className="stat-value">{formatCurrency(totalSpend)}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Cancelled</p>
          <p className="stat-value">{cancelled}</p>
        </Card>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          message="Browse the catalog and book your first service."
          action={<Link to="/services" className="header-cta">Browse services</Link>}
        />
      ) : (
        <Card title="All bookings">
          <ul className="booking-list">
            {bookings.map((b) => {
              const canChange = b.status === 'pending' || b.status === 'confirmed';
              return (
                <li key={b._id} className="booking-item">
                  <div className="booking-main">
                    <p className="booking-name">
                      <Link to={`/services/${b.service}`}>{b.serviceName}</Link>
                    </p>
                    <p className="booking-meta">
                      📅 {formatWhen(b.appointmentAt)} · ⏱ {b.durationMinutes} min · {formatCurrency(b.price)}
                    </p>
                    {b.notes && <p className="booking-meta">📝 {b.notes}</p>}
                    {editingId === b._id && (
                      <div className="booking-edit">
                        <input
                          type="datetime-local"
                          className="input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          aria-label="New date and time"
                        />
                        <Button size="sm" onClick={() => handleReschedule(b)}>Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Close</Button>
                      </div>
                    )}
                  </div>
                  <div className="booking-side">
                    <Badge tone={statusTone[b.status]}>{b.status}</Badge>
                    {canChange && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingId(b._id);
                            setEditValue(toLocalInput(b.appointmentAt));
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleCancel(b)}>Cancel</Button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}

export default MyBookings;