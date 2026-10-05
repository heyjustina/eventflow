import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import '../styles/forms.css';

const EVENT_TYPES = ['Workshop', 'Pop-up', 'Retreat', 'Launch', 'Conference'];

const emptyForm = {
  name: '',
  type: 'Workshop',
  date: '',
  location: '',
  guests: '',
  budget: '',
};

// Returns an object of error messages. Empty object = no errors.
function validate(values) {
  const errors = {};

  if (values.name.trim().length < 3) {
    errors.name = 'Please enter an event name (at least 3 characters).';
  }
  if (!values.date) {
    errors.date = 'Please choose a date.';
  }
  if (!values.location.trim()) {
    errors.location = 'Please enter a location.';
  }
  if (!values.guests || Number(values.guests) < 1) {
    errors.guests = 'Guest count must be at least 1.';
  }
  if (!values.budget || Number(values.budget) < 1) {
    errors.budget = 'Budget must be greater than 0.';
  }

  return errors;
}

function CreateEvent() {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // One handler for every input. The input's `name` says which key to update.
  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page

    const foundErrors = validate(values);
    setErrors(foundErrors);

    // If there is at least one error, stop here
    if (Object.keys(foundErrors).length > 0) {
      return;
    }

    const newId = addEvent({
      ...values,
      name: values.name.trim(),
      location: values.location.trim(),
      guests: Number(values.guests),
      budget: Number(values.budget),
    });

    navigate(`/events/${newId}`); // open the new event's plan
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Create Event</h1>
          <p>Enter your concept. We'll turn it into a plan in a later step.</p>
        </div>
      </div>

      <Card className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field--full">
              <FormField label="Event name" htmlFor="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g. Oolong Tasting Evening"
                />
              </FormField>
            </div>

            <FormField label="Event type" htmlFor="type">
              <select
                id="type"
                name="type"
                className="input"
                value={values.type}
                onChange={handleChange}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Date" htmlFor="date" error={errors.date}>
              <input
                id="date"
                name="date"
                type="date"
                className={`input ${errors.date ? 'input-error' : ''}`}
                value={values.date}
                onChange={handleChange}
              />
            </FormField>

            <div className="form-field--full">
              <FormField label="Location" htmlFor="location" error={errors.location}>
                <input
                  id="location"
                  name="location"
                  className={`input ${errors.location ? 'input-error' : ''}`}
                  value={values.location}
                  onChange={handleChange}
                  placeholder="e.g. Dallas, TX"
                />
              </FormField>
            </div>

            <FormField label="Expected guests" htmlFor="guests" error={errors.guests}>
              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                className={`input ${errors.guests ? 'input-error' : ''}`}
                value={values.guests}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Total budget ($)" htmlFor="budget" error={errors.budget}>
              <input
                id="budget"
                name="budget"
                type="number"
                min="1"
                className={`input ${errors.budget ? 'input-error' : ''}`}
                value={values.budget}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <div className="form-actions">
            <Button type="submit">Create event</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateEvent;