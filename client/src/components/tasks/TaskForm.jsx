import { useState } from 'react';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import { PHASES } from '../../data/planTemplates';
import { STATUSES, PRIORITIES } from '../../data/taskOptions';
import '../../styles/forms.css';

function TaskForm({ initialValues, onSave, onCancel, submitLabel = 'Save task' }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const found = {};
    if (values.title.trim().length < 3) {
      found.title = 'Please enter a task title (at least 3 characters).';
    }
    if (!values.dueDate) {
      found.dueDate = 'Please choose a due date.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSave({
      ...values,
      title: values.title.trim(),
      owner: values.owner.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field--full">
          <FormField label="Task title" htmlFor="task-title" error={errors.title}>
            <input
              id="task-title"
              name="title"
              className={`input ${errors.title ? 'input-error' : ''}`}
              value={values.title}
              onChange={handleChange}
              placeholder="e.g. Confirm tea supplier"
            />
          </FormField>
        </div>

        <FormField label="Phase" htmlFor="task-phase">
          <select id="task-phase" name="phase" className="input" value={values.phase} onChange={handleChange}>
            {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </FormField>

        <FormField label="Due date" htmlFor="task-due" error={errors.dueDate}>
          <input
            id="task-due"
            name="dueDate"
            type="date"
            className={`input ${errors.dueDate ? 'input-error' : ''}`}
            value={values.dueDate}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="Owner" htmlFor="task-owner">
          <input
            id="task-owner"
            name="owner"
            className="input"
            value={values.owner}
            onChange={handleChange}
            placeholder="e.g. Maya"
          />
        </FormField>

        <FormField label="Priority" htmlFor="task-priority">
          <select id="task-priority" name="priority" className="input" value={values.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </FormField>

        <FormField label="Status" htmlFor="task-status">
          <select id="task-status" name="status" className="input" value={values.status} onChange={handleChange}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>

      <div className="form-actions">
        <Button type="submit">{submitLabel}</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default TaskForm;