import mongoose from 'mongoose';

export const CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Entertainment',
  'AV & Production',
  'Decor',
  'Staffing',
  'Rentals',
  'Wellness',
];

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, enum: CATEGORIES },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    provider: { type: String, required: true, trim: true, maxlength: 120 },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 15 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Speeds up the list page: active services filtered by category
serviceSchema.index({ isActive: 1, category: 1 });

export default mongoose.model('Service', serviceSchema);