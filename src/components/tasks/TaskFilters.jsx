import { PHASES } from '../../data/planTemplates';
import { STATUSES } from '../../data/taskOptions';
import Button from '../ui/Button';

function TaskFilters({ filters, owners, onChange, onClear }) {
  // One handler for all four controls, using each control's `name`
  function handleChange(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="task-filters">
      <input
        className="input"
        type="search"
        name="search"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={handleChange}
      />

      <select className="input" name="phase" value={filters.phase} onChange={handleChange}>
        <option value="All">All phases</option>
        {PHASES.map((phase) => (
          <option key={phase} value={phase}>{phase}</option>
        ))}
      </select>

      <select className="input" name="status" value={filters.status} onChange={handleChange}>
        <option value="All">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <select className="input" name="owner" value={filters.owner} onChange={handleChange}>
        <option value="All">All owners</option>
        <option value="Unassigned">Unassigned</option>
        {owners.map((owner) => (
          <option key={owner} value={owner}>{owner}</option>
        ))}
      </select>

      <Button variant="secondary" onClick={onClear}>Clear</Button>
    </div>
  );
}

export default TaskFilters;