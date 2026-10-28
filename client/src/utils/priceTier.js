// Turns a price into an affordability label
export function getPriceTier(price) {
  if (price < 700) return { symbol: '$', label: 'Budget-friendly', tone: 'success' };
  if (price < 1500) return { symbol: '$$', label: 'Moderate', tone: 'warning' };
  return { symbol: '$$$', label: 'Premium', tone: 'info' };
}