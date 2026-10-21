import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import FormField from '../components/ui/FormField';
import { formatTime } from '../utils/format';
import '../styles/forms.css';
import '../styles/budget.css';

const blankItem = { startTime: '', endTime: '', title: '', owner: '' };

function EventRunOfShow() {
  const { event } = useOutletContext();
  const { scheduleItems, addScheduleItem, deleteScheduleItem } = useEvents();

  const [values, setValues] = useState(blankItem);
  const [errors, setErrors] = useState({});

  // This event's items, sorted by start time ("08:00" sorts correctly as text)
  const items = scheduleItems
    .filter((s) => s.eventId === event.id)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();

    const found = {};
    if (values.title.trim().length < 3) {
      found.title = 'Please enter what happens (at least 3 characters).';
    }
    if (!values.startTime) found.startTime = 'Choose a start time.';
    if (!values.endTime) found.endTime = 'Choose an end time.';
    if (values.startTime && values.endTime && values.endTime <= values.startTime) {
      found.endTime = 'End time must be after the start time.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    addScheduleItem({
      eventId: event.id,
      startTime: values.startTime,
      endTime: values.endTime,
      title: values.title.trim(),
      owner: values.owner.trim(),
    });
    setValues(blankItem);
  }

  function handleDelete(item) {
    if (window.confirm(`Remove "${item.title}" from the schedule?`)) {
      deleteScheduleItem(item.id);
    }
  }

  return (
    <div>
      {items.length === 0 ? (
        <EmptyState
          title="No run-of-show yet"
          message="Add your first item below, for example setup, doors open, or the main program."
        />
      ) : (
        <Card title={`Event-day timeline (${items.length} items)`}>
          <ol className="timeline">
            {items.map((item, index) => {
              // Overlap: this item starts before the previous one ends
              const previous = items[index - 1];
              const overlaps = previous && item.startTime < previous.endTime;

              return (
                <li key={item.id} className="timeline-item">
                  <div className="timeline-time">
                    <strong>{formatTime(item.startTime)}</strong>
                    <span>{formatTime(item.endTime)}</span>
                  </div>
                  <div className="timeline-body">
                    <p className="timeline-title">{item.title}</p>
                    <div className="timeline-tags">
                      <span className="task-owner">
                        {item.owner ? `👤 ${item.owner}` : 'No owner'}
                      </span>
                      {overlaps && <Badge tone="warning">Overlaps previous</Badge>}
                    </div>
                  </div>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>
                    Delete
                  </Button>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      <br />

      <Card title="Add a schedule item" className="form-card">
        <form onSubmit={handleAdd} noValidate>
          <div className="form-grid">
            <div className="form-field--full">
              <FormField label="What happens" htmlFor="s-title" error={errors.title}>
                <input
                  id="s-title"
                  name="title"
                  className={`input ${errors.title ? 'input-error' : ''}`}
                  value={values.title}
                  onChange={handleChange}
                  placeholder="e.g. Doors open"
                />
              </FormField>
            </div>
            <FormField label="Start" htmlFor="s-start" error={errors.startTime}>
              <input
                id="s-start"
                name="startTime"
                type="time"
                className={`input ${errors.startTime ? 'input-error' : ''}`}
                value={values.startTime}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="End" htmlFor="s-end" error={errors.endTime}>
              <input
                id="s-end"
                name="endTime"
                type="time"
                className={`input ${errors.endTime ? 'input-error' : ''}`}
                value={values.endTime}
                onChange={handleChange}
              />
            </FormField>
            <div className="form-field--full">
              <FormField label="Owner (optional)" htmlFor="s-owner">
                <input
                  id="s-owner"
                  name="owner"
                  className="input"
                  value={values.owner}
                  onChange={handleChange}
                  placeholder="e.g. Production"
                />
              </FormField>
            </div>
          </div>
          <Button type="submit">Add item</Button>
        </form>
      </Card>
    </div>
  );
}

export default EventRunOfShow;