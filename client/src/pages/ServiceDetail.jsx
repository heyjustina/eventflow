import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/format';
import '../styles/overview.css';
import '../styles/services.css';

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        <Button disabled>Booking opens after login (next block)</Button>
      </Card>
    </div>
  );
}

export default ServiceDetail;