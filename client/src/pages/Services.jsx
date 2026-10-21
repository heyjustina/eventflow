import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/format';
import '../styles/dashboard.css';
import '../styles/services.css';

const CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Entertainment',
  'AV & Production', 'Decor', 'Staffing', 'Rentals', 'Wellness',
];

function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController(); // cancels stale requests
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search.trim()) params.set('q', search.trim());
      try {
        const data = await apiFetch(`/services?${params}`, { signal: controller.signal });
        setServices(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300); // wait 300ms after typing stops

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [category, search]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Event Services</h1>
          <p>Browse venues, catering, entertainment, and more.</p>
        </div>
      </div>

      <div className="service-filters">
        <input
          className="search-input"
          type="search"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading services...</p>}

      {error && !loading && (
        <EmptyState title="Couldn't load services" message={error} />
      )}

      {!loading && !error && services.length === 0 && (
        <EmptyState title="No services found" message="Try a different search or category." />
      )}

      {!loading && !error && services.length > 0 && (
        <div className="event-grid">
          {services.map((service) => (
            <Card key={service._id} className="event-card">
              <div className="event-card-top">
                <Badge tone="info">{service.category}</Badge>
                <strong>{formatCurrency(service.price)}</strong>
              </div>
              <h3 className="event-card-name">
                <Link to={`/services/${service._id}`} className="event-card-link">
                  {service.name}
                </Link>
              </h3>
              <p className="service-provider">{service.provider}</p>
              <p className="service-duration">⏱ {service.durationMinutes} min</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;