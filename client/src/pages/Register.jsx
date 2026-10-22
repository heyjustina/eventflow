import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import '../styles/forms.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    // Quick checks for a nicer experience; the server checks again
    const found = {};
    if (values.name.trim().length < 2) found.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) found.email = 'Enter a valid email.';
    if (values.password.length < 8) found.password = 'Password must be at least 8 characters.';
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await register(values.name, values.email, values.password);
      navigate('/services', { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Create account</h1>
          <p>Register to book event services.</p>
        </div>
      </div>
      <Card className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <FormField label="Name" htmlFor="name" error={errors.name}>
            <input id="name" name="name" className={`input ${errors.name ? 'input-error' : ''}`}
              autoComplete="name" value={values.name} onChange={handleChange} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email}>
            <input id="email" name="email" type="email" className={`input ${errors.email ? 'input-error' : ''}`}
              autoComplete="email" value={values.email} onChange={handleChange} />
          </FormField>
          <FormField label="Password (8+ characters)" htmlFor="password" error={errors.password}>
            <input id="password" name="password" type="password" className={`input ${errors.password ? 'input-error' : ''}`}
              autoComplete="new-password" value={values.password} onChange={handleChange} />
          </FormField>
          <div className="form-actions">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
          <p style={{ marginTop: '16px' }}>
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default Register;