import Service from '../models/Service.js';

// Which categories to suggest for each event type, in priority order
const EVENT_CATEGORIES = {
  Wedding: ['Venue', 'Catering', 'Photography', 'Decor', 'Entertainment', 'Rentals'],
  Corporate: ['Venue', 'Catering', 'AV & Production', 'Staffing', 'Photography'],
  Birthday: ['Venue', 'Catering', 'Entertainment', 'Decor', 'Photography'],
  Conference: ['Venue', 'Catering', 'AV & Production', 'Staffing', 'Rentals'],
  Fundraiser: ['Venue', 'Catering', 'Entertainment', 'AV & Production', 'Photography'],
  Retreat: ['Venue', 'Wellness', 'Catering', 'Photography'],
  Community: ['Venue', 'Catering', 'Entertainment', 'Staffing', 'Rentals'],
};

export const EVENT_TYPES = Object.keys(EVENT_CATEGORIES);

const CHECKLIST = [
  'Confirm your date, guest count, and budget',
  'Book the venue first, since it limits every other choice',
  'Book catering and entertainment once the venue is confirmed',
  'Send invitations about 4 to 6 weeks ahead',
  'Confirm final headcount with vendors one week before',
  'Prepare a run-of-show timeline for the event day',
  'Plan a thank-you message and feedback request afterward',
];

export async function buildPlan({ eventType, guests, budget, preferences }) {
  const categories = EVENT_CATEGORIES[eventType];
  const services = await Service.find({ isActive: true, category: { $in: categories } });

  const text = preferences.toLowerCase();

  // Pick the best-fitting service per category: affordable, and matching preference words
  const picks = [];
  let remaining = budget;
  for (const category of categories) {
    const options = services.filter((s) => s.category === category);
    if (options.length === 0) continue;

    const scored = options
      .map((s) => {
        let score = 0;
        const haystack = `${s.name} ${s.description}`.toLowerCase();
        text
          .split(/\W+/)
          .filter((w) => w.length > 3)
          .forEach((w) => {
            if (haystack.includes(w)) score += 2;
          });
        if (s.price <= remaining) score += 3;
        return { service: s, score };
      })
      .sort((a, b) => b.score - a.score || a.service.price - b.service.price);

    const best = scored[0].service;
    picks.push(best);
    remaining -= best.price;
  }

  // Totals are calculated by the server from real prices, never by a model
  const total = picks.reduce((sum, s) => sum + s.price, 0);

  return {
    source: 'rules',
    summary: `Based on your ${eventType.toLowerCase()} for ${guests} guests, these services from our catalog may fit.`,
    recommendations: picks.map((s) => ({
      serviceId: s._id,
      name: s.name,
      category: s.category,
      provider: s.provider,
      price: s.price,
      reason: `Covers the ${s.category.toLowerCase()} need for your ${eventType.toLowerCase()}.`,
    })),
    budget: {
      yourBudget: budget,
      estimatedTotal: total,
      difference: budget - total,
      withinBudget: total <= budget,
    },
    checklist: CHECKLIST,
    disclaimer:
      'Recommendations are informational and based on catalog data. Review each service before booking. Availability is confirmed only when you book.',
  };
}