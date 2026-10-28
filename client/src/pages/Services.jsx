import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import CategoryBanner from '../components/services/CategoryBanner';
import { formatCurrency } from '../utils/format';
import { getPriceTier } from '../utils/priceTier';
import '../styles/dashboard.css';
import '../styles/services.css';

const CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Entertainment',
  'AV & Production', 'Decor', 'Staffing', 'Rentals', 'Wellness',
];

function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [tier, setTier] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
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
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [category, search]);

  const visible = services.filter((s) => !tier || getPriceTier(s.price).symbol === tier);

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
        <select className="input" value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="">Any price</option>
          <option value="$">$ Budget-friendly</option>
          <option value="$$">$$ Moderate</option>
          <option value="$$$">$$$ Premium</option>
        </select>
      </div>

      {loading && <p>Loading services...</p>}
      {error && !loading && <EmptyState title="Couldn't load services" message={error} />}
      {!loading && !error && visible.length === 0 && (
        <EmptyState title="No services found" message="Try a different search, category, or price." />
      )}
      {!loading && !error && visible.length > 0 && (
        <div className="event-grid">
          {visible.map((service) => {
            const priceTier = getPriceTier(service.price);
            return (
              <Card key={service._id} className="event-card">
                <CategoryBanner category={service.category} />
                <div className="event-card-top">
                  <Badge tone="info">{service.category}</Badge>
                  <Badge tone={priceTier.tone}>{priceTier.symbol} {priceTier.label}</Badge>
                </div>
                <h3 className="event-card-name">
                  <Link to={`/services/${service._id}`} className="event-card-link">
                    {service.name}
                  </Link>
                </h3>
                <p className="service-provider">{service.provider}</p>
                <p className="service-duration">
                  <strong>{formatCurrency(service.price)}</strong> · ⏱ {service.durationMinutes} min
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Services;