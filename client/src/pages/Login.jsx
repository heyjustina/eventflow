import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import '../styles/forms.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/services';

  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // block double clicks
    setError('');
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Log in</h1>
          <p>Welcome back. Log in to book services.</p>
        </div>
      </div>
      <Card className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {error && <p className="form-error" role="alert">{error}</p>}
          <FormField label="Email" htmlFor="email">
            <input id="email" name="email" type="email" className="input" autoComplete="email"
              value={values.email} onChange={handleChange} />
          </FormField>
          <FormField label="Password" htmlFor="password">
            <input id="password" name="password" type="password" className="input" autoComplete="current-password"
              value={values.password} onChange={handleChange} />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </Button>
          </div>
          <p style={{ marginTop: '16px' }}>
            No account? <Link to="/register">Register</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default Login;