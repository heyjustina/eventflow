import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { formatCurrency } from '../utils/format';
import '../styles/forms.css';
import '../styles/services.css';

const EVENT_TYPES = ['Wedding', 'Corporate', 'Birthday', 'Conference', 'Fundraiser', 'Retreat', 'Community'];

function Planner() {
  const [values, setValues] = useState({ eventType: 'Corporate', guests: '', budget: '', preferences: '' });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError('');
    if (!values.guests || !values.budget) {
      setError('Please enter the number of guests and your budget.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch('/ai/recommend-service', {
        method: 'POST',
        body: JSON.stringify({
          eventType: values.eventType,
          guests: Number(values.guests),
          budget: Number(values.budget),
          preferences: values.preferences,
        }),
      });
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Event Service Planner</h1>
          <p>Tell us what you're planning and get suggestions from our real service catalog.</p>
        </div>
      </div>

      <Card className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-grid">
            <FormField label="Event type" htmlFor="eventType">
              <select id="eventType" name="eventType" className="input" value={values.eventType} onChange={handleChange}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Guests" htmlFor="guests">
              <input id="guests" name="guests" type="number" min="1" className="input" value={values.guests} onChange={handleChange} />
            </FormField>
            <FormField label="Total budget ($)" htmlFor="budget">
              <input id="budget" name="budget" type="number" min="1" className="input" value={values.budget} onChange={handleChange} />
            </FormField>
            <div className="form-field--full">
              <FormField label={`Preferences (optional, ${values.preferences.length}/500)`} htmlFor="preferences">
                <textarea id="preferences" name="preferences" className="input" rows="3" maxLength={500}
                  placeholder="e.g. outdoor, live music, vegetarian food"
                  value={values.preferences} onChange={handleChange} />
              </FormField>
            </div>
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Planning...' : 'Get my plan'}</Button>
        </form>
      </Card>

      {plan && (
        <div style={{ marginTop: '24px' }}>
          <Card title="Your suggested plan">
            <p>{plan.summary}</p>
            <div className="event-grid">
              {plan.recommendations.map((r) => (
                <Card key={r.serviceId} className="event-card">
                  <div className="event-card-top">
                    <Badge tone="info">{r.category}</Badge>
                    <strong>{formatCurrency(r.price)}</strong>
                  </div>
                  <h3 className="event-card-name">
                    <Link to={`/services/${r.serviceId}`} className="event-card-link">{r.name}</Link>
                  </h3>
                  <p className="service-provider">{r.provider}</p>
                  <p className="service-duration">{r.reason}</p>
                </Card>
              ))}
            </div>
          </Card>

          <br />
          <Card title="Draft budget">
            <p>Your budget: <strong>{formatCurrency(plan.budget.yourBudget)}</strong></p>
            <p>Estimated total: <strong>{formatCurrency(plan.budget.estimatedTotal)}</strong></p>
            <p>
              {plan.budget.withinBudget
                ? <Badge tone="success">{formatCurrency(plan.budget.difference)} under budget</Badge>
                : <Badge tone="danger">{formatCurrency(Math.abs(plan.budget.difference))} over budget</Badge>}
            </p>
          </Card>

          <br />
          <Card title="Planning checklist (general guidance)">
            <ul>
              {plan.checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Card>

          <p className="service-provider" style={{ marginTop: '16px' }}>{plan.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

export default Planner;