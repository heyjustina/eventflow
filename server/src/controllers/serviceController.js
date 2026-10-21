import mongoose from 'mongoose';
import Service, { CATEGORIES } from '../models/Service.js';

// Makes user text safe to use in a search pattern
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listServices(req, res) {
  const filter = { isActive: true }; // customers only ever see active services
  const { category, q } = req.query;

  if (typeof category === 'string' && category) {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: [{ field: 'category', message: 'Unknown category' }],
      });
    }
    filter.category = category;
  }

  if (typeof q === 'string' && q.trim()) {
    filter.name = { $regex: escapeRegex(q.trim().slice(0, 60)), $options: 'i' };
  }

  const services = await Service.find(filter).sort({ category: 1, name: 1 });
  res.json(services);
}

export async function getService(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid service id' });
  }
  const service = await Service.findOne({ _id: id, isActive: true });
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
}