import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import FormField from '../components/ui/FormField';
import { formatCurrency } from '../utils/format';
import '../styles/forms.css';
import '../styles/budget.css';

function EventBudget() {
  const { event } = useOutletContext();
  const { budgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useEvents();

  const [newItem, setNewItem] = useState({ category: '', estimated: '' });
  const [errors, setErrors] = useState({});

  // This event's budget lines only
  const items = budgetItems.filter((b) => b.eventId === event.id);

  // reduce() adds everything up into one number
  const estimatedTotal = items.reduce((sum, i) => sum + Number(i.estimated || 0), 0);
  const spent = items.reduce((sum, i) => sum + Number(i.actual || 0), 0);
  const remaining = event.budget - spent;
  const percentSpent = event.budget > 0 ? Math.round((spent / event.budget) * 100) : 0;

  function handleNewChange(e) {
    const { name, value } = e.target;
    setNewItem((current) => ({ ...current, [name]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();

    const found = {};
    if (newItem.category.trim().length < 2) {
      found.category = 'Please enter a category name.';
    }
    if (newItem.estimated === '' || Number(newItem.estimated) < 0) {
      found.estimated = 'Enter an estimate of 0 or more.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    addBudgetItem({
      eventId: event.id,
      category: newItem.category.trim(),
      estimated: Number(newItem.estimated),
      actual: 0,
    });
    setNewItem({ category: '', estimated: '' });
  }

  function handleNumber(item, field, value) {
    // An empty box counts as 0, and negatives are not allowed
    const number = value === '' ? 0 : Math.max(0, Number(value));
    updateBudgetItem(item.id, { [field]: number });
  }

  function handleDelete(item) {
    if (window.confirm(`Delete the "${item.category}" budget line?`)) {
      deleteBudgetItem(item.id);
    }
  }

  return (
    <div>
      {spent > event.budget && (
        <div className="alert alert-danger">
          🚨 Spending is {formatCurrency(spent - event.budget)} over your total budget.
        </div>
      )}
      {estimatedTotal > event.budget && (
        <div className="alert alert-warning">
          ⚠️ Your estimates add up to {formatCurrency(estimatedTotal)}, which is more than the{' '}
          {formatCurrency(event.budget)} budget.
        </div>
      )}

      <div className="stat-grid">
        <Card className="stat-card">
          <p className="stat-label">Total budget</p>
          <p className="stat-value">{formatCurrency(event.budget)}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Estimated</p>
          <p className="stat-value">{formatCurrency(estimatedTotal)}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Spent so far</p>
          <p className="stat-value">{formatCurrency(spent)}</p>
        </Card>
        <Card className="stat-card">
          <p className="stat-label">Remaining</p>
          <p className={remaining < 0 ? 'stat-value text-danger' : 'stat-value'}>
            {formatCurrency(remaining)}
          </p>
        </Card>
      </div>

      <Card title={`Budget used: ${percentSpent}%`}>
        <div className="spend-track">
          <div
            className={percentSpent > 100 ? 'spend-fill over' : 'spend-fill'}
            style={{ width: `${Math.min(100, percentSpent)}%` }}
          />
        </div>
      </Card>

      <br />

      {items.length === 0 ? (
        <EmptyState
          title="No budget lines yet"
          message="Add a category below to start tracking costs."
        />
      ) : (
        <Card title="Budget lines">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Estimated ($)</th>
                  <th>Actual ($)</th>
                  <th>Difference</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const actual = Number(item.actual || 0);
                  const estimated = Number(item.estimated || 0);
                  const difference = actual - estimated;

                  let badge = <Badge tone="neutral">Not spent</Badge>;
                  if (actual > estimated) badge = <Badge tone="danger">Over</Badge>;
                  else if (actual > 0) badge = <Badge tone="success">On budget</Badge>;

                  return (
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>
                        <input
                          className="input cell-input"
                          type="number"
                          min="0"
                          value={estimated === 0 ? '' : estimated}
                          placeholder="0"
                          onChange={(e) => handleNumber(item, 'estimated', e.target.value)}
                          aria-label={`${item.category} estimated cost`}
                        />
                      </td>
                      <td>
                        <input
                          className="input cell-input"
                          type="number"
                          min="0"
                          value={actual === 0 ? '' : actual}
                          placeholder="0"
                          onChange={(e) => handleNumber(item, 'actual', e.target.value)}
                          aria-label={`${item.category} actual cost`}
                        />
                      </td>
                      <td className={difference > 0 ? 'text-danger' : ''}>
                        {difference > 0 ? '+' : ''}
                        {formatCurrency(difference)}
                      </td>
                      <td>{badge}</td>
                      <td>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <br />

      <Card title="Add a budget line" className="form-card">
        <form onSubmit={handleAdd} noValidate>
          <div className="form-grid">
            <FormField label="Category" htmlFor="b-category" error={errors.category}>
              <input
                id="b-category"
                name="category"
                className={`input ${errors.category ? 'input-error' : ''}`}
                value={newItem.category}
                onChange={handleNewChange}
                placeholder="e.g. Photography"
              />
            </FormField>
            <FormField label="Estimated cost ($)" htmlFor="b-estimated" error={errors.estimated}>
              <input
                id="b-estimated"
                name="estimated"
                type="number"
                min="0"
                className={`input ${errors.estimated ? 'input-error' : ''}`}
                value={newItem.estimated}
                onChange={handleNewChange}
              />
            </FormField>
          </div>
          <Button type="submit">Add line</Button>
        </form>
      </Card>
    </div>
  );
}

export default EventBudget;