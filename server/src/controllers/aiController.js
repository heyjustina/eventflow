import { buildPlan, EVENT_TYPES } from '../services/plannerService.js';

export async function recommendServices(req, res) {
  const { eventType, guests, budget, preferences } = req.body;
  const details = [];

  if (!EVENT_TYPES.includes(eventType)) {
    details.push({ field: 'eventType', message: 'Choose a valid event type' });
  }
  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 1000) {
    details.push({ field: 'guests', message: 'Guests must be between 1 and 1000' });
  }
  const budgetAmount = Number(budget);
  if (!Number.isFinite(budgetAmount) || budgetAmount < 1 || budgetAmount > 1000000) {
    details.push({ field: 'budget', message: 'Budget must be between 1 and 1,000,000' });
  }
  if (preferences !== undefined && (typeof preferences !== 'string' || preferences.length > 500)) {
    details.push({ field: 'preferences', message: 'Preferences must be 500 characters or fewer' });
  }
  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const plan = await buildPlan({
    eventType,
    guests: guestCount,
    budget: budgetAmount,
    preferences: typeof preferences === 'string' ? preferences.trim() : '',
  });
  res.json(plan);
}