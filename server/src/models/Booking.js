import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    // Snapshot: copied at booking time so later price changes don't rewrite history
    serviceName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 15 },
    appointmentAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
    status: { type: String, enum: BOOKING_STATUSES, default: 'pending' },
  },
  { timestamps: true }
);

// Dashboard query: my bookings, soonest first
bookingSchema.index({ user: 1, appointmentAt: 1 });
// Overlap check: bookings for one service around a time
bookingSchema.index({ service: 1, appointmentAt: 1 });

export default mongoose.model('Booking', bookingSchema);