import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import FormField from '../components/ui/FormField';
import { formatCurrency } from '../utils/format';
import '../styles/overview.css';
import '../styles/forms.css';
import '../styles/services.css';

function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [when, setWhen] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(`/services/${id}`, { signal: controller.signal })
      .then(setService)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    if (!when) {
      setFormError('Please choose a date and time.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          appointmentAt: new Date(when).toISOString(),
          notes,
        }),
      });
      navigate('/dashboard'); // only after the server confirms
    } catch (err) {
      setFormError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading service...</p>;

  if (error || !service) {
    return (
      <EmptyState
        title="Service not found"
        message={error || 'This service does not exist.'}
        action={<Link to="/services" className="header-cta">Back to services</Link>}
      />
    );
  }

  return (
    <div>
      <Link to="/services" className="back-link">← All services</Link>
      <div className="page-header">
        <div>
          <h1>{service.name}</h1>
          <Badge tone="info">{service.category}</Badge>
        </div>
      </div>

      <div className="stat-grid">
        <Card className="stat-card">
          <p className="stat-label">Price</p>
          <p className="stat-value">{formatCurrency(service.price)}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Duration</p>
          <p className="stat-value">{service.durationMinutes} min</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Provider</p>
          <p className="stat-value">{service.provider}</p>
        </Card>
      </div>

      <Card title="About this service">
        <p>{service.description}</p>
      </Card>

      <br />

      <Card title="Book this service" className="form-card">
        {!user ? (
          <p>
            Please <Link to="/login" state={{ from: `/services/${service._id}` }}>log in</Link> or{' '}
            <Link to="/register">register</Link> to book.
          </p>
        ) : (
          <form onSubmit={handleBook} noValidate>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <FormField label="Date and time" htmlFor="when">
              <input
                id="when"
                type="datetime-local"
                className="input"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
              />
            </FormField>
            <FormField label="Notes (optional)" htmlFor="notes">
              <textarea
                id="notes"
                className="input"
                rows="3"
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormField>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Booking...' : 'Request booking'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default ServiceDetail;