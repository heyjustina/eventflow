import Service from '../models/Service.js';
import { askGemini } from './geminiService.js';

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

const DISCLAIMER =
  'Recommendations are informational and based on catalog data. Review each service before booking. Availability is confirmed only when you book.';

// The server calculates money from real prices. A model never does.
function buildBudget(budget, picks) {
  const total = picks.reduce((sum, s) => sum + s.price, 0);
  return {
    yourBudget: budget,
    estimatedTotal: total,
    difference: budget - total,
    withinBudget: total <= budget,
  };
}

function toRecommendation(service, reason) {
  return {
    serviceId: service._id,
    name: service.name,
    category: service.category,
    provider: service.provider,
    price: service.price,
    reason,
  };
}

// Version 1: rules only. Used when the AI is unavailable.
function buildRulesPlan({ eventType, guests, budget, preferences }, allServices) {
  const categories = EVENT_CATEGORIES[eventType];
  const words = preferences
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);

  const picks = [];
  let remaining = budget;
  for (const category of categories) {
    const options = allServices.filter((s) => s.category === category);
    if (options.length === 0) continue;

    const scored = options
      .map((s) => {
        const haystack = `${s.name} ${s.description}`.toLowerCase();
        let score = 0;
        words.forEach((w) => {
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

  return {
    source: 'rules',
    notice: 'The AI assistant was unavailable, so this plan uses our built-in planning rules.',
    summary: `Based on your ${eventType.toLowerCase()} for ${guests} guests, these services from our catalog may fit.`,
    recommendations: picks.map((s) =>
      toRecommendation(s, `Covers the ${s.category.toLowerCase()} need for your ${eventType.toLowerCase()}.`)
    ),
    budget: buildBudget(budget, picks),
    diyItems: [],
    checklist: CHECKLIST,
    disclaimer: DISCLAIMER,
  };
}

function cleanStrings(list, maxItems, maxLength) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => item.trim().slice(0, maxLength))
    .slice(0, maxItems);
}

// Version 2: ask Gemini, then verify everything against the database.
export async function buildPlan(input) {
  const allServices = await Service.find({ isActive: true }).lean();

  try {
    const aiResult = await askGemini({ ...input, services: allServices });

    const byId = new Map(allServices.map((s) => [String(s._id), s]));
    const seen = new Set();
    const picks = [];
    const recommendations = [];

    for (const item of aiResult.recommendations) {
      const id = typeof item?.serviceId === 'string' ? item.serviceId : '';
      const service = byId.get(id); // unknown or invented IDs are dropped here
      if (!service || seen.has(id)) continue;
      seen.add(id);
      picks.push(service);
      const reason =
        typeof item.reason === 'string' && item.reason.trim()
          ? item.reason.trim().slice(0, 200)
          : `A ${service.category.toLowerCase()} option from our catalog.`;
      recommendations.push(toRecommendation(service, reason));
      if (recommendations.length === 8) break;
    }

    if (recommendations.length === 0) {
      throw new Error('AI_NO_VALID_SERVICES');
    }

    const checklist = cleanStrings(aiResult.checklist, 10, 200);

    return {
      source: 'ai',
      notice: '',
      summary:
        typeof aiResult.summary === 'string' && aiResult.summary.trim()
          ? aiResult.summary.trim().slice(0, 300)
          : `Here are services from our catalog that may fit your ${input.eventType.toLowerCase()}.`,
      recommendations,
      budget: buildBudget(input.budget, picks),
      diyItems: cleanStrings(aiResult.diyItems, 8, 200),
      checklist: checklist.length > 0 ? checklist : CHECKLIST,
      disclaimer: `AI-assisted suggestions based only on our catalog. ${DISCLAIMER}`,
    };
  } catch (error) {
    console.error('Planner fell back to rules:', error.message);
    return buildRulesPlan(input, allServices);
  }
}