import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

const ACTIVE = ['pending', 'confirmed'];

function parseDate(value) {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function validationError(res, field, message) {
  return res.status(400).json({
    error: 'Validation failed',
    details: [{ field, message }],
  });
}

// True if another active booking for this service overlaps the time window
async function hasConflict(serviceId, start, end, excludeId) {
  const filter = {
    service: serviceId,
    status: { $in: ACTIVE },
    appointmentAt: { $lt: end },
    endsAt: { $gt: start },
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return Boolean(await Booking.exists(filter));
}

// Loads a booking and checks that the logged-in user owns it (or is admin)
async function loadOwnedBooking(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: 'Invalid booking id' });
    return null;
  }
  const booking = await Booking.findById(id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return null;
  }
  const isOwner = booking.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403).json({ error: 'You do not have access to this booking' });
    return null;
  }
  return booking;
}

export async function createBooking(req, res) {
  const { serviceId, appointmentAt, notes } = req.body;

  if (typeof serviceId !== 'string' || !mongoose.isValidObjectId(serviceId)) {
    return validationError(res, 'serviceId', 'A valid service is required');
  }
  const start = parseDate(appointmentAt);
  if (!start) return validationError(res, 'appointmentAt', 'A valid date and time is required');
  if (start <= new Date()) return validationError(res, 'appointmentAt', 'Choose a date in the future');
  if (notes !== undefined && (typeof notes !== 'string' || notes.length > 500)) {
    return validationError(res, 'notes', 'Notes must be 500 characters or fewer');
  }

  const service = await Service.findOne({ _id: serviceId, isActive: true });
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const end = new Date(start.getTime() + service.durationMinutes * 60000);
  if (await hasConflict(service._id, start, end)) {
    return res.status(409).json({ error: 'That time is already booked for this service. Try another time.' });
  }

  // user comes from the verified token; price and duration come from the database
  const booking = await Booking.create({
    user: req.user._id,
    service: service._id,
    serviceName: service.name,
    price: service.price,
    durationMinutes: service.durationMinutes,
    appointmentAt: start,
    endsAt: end,
    notes: (notes || '').trim(),
  });

  res.status(201).json(booking);
}

export async function listMyBookings(req, res) {
  const bookings = await Booking.find({ user: req.user._id }).sort({ appointmentAt: 1 });
  res.json(bookings);
}

export async function getBooking(req, res) {
  const booking = await loadOwnedBooking(req, res);
  if (booking) res.json(booking);
}

export async function updateBooking(req, res) {
  const booking = await loadOwnedBooking(req, res);
  if (!booking) return;

  if (!ACTIVE.includes(booking.status)) {
    return res.status(409).json({ error: `A ${booking.status} booking cannot be changed` });
  }

  // Only these two fields can be edited. Status, price, and user cannot.
  const { appointmentAt, notes } = req.body;

  if (appointmentAt !== undefined) {
    const start = parseDate(appointmentAt);
    if (!start) return validationError(res, 'appointmentAt', 'A valid date and time is required');
    if (start <= new Date()) return validationError(res, 'appointmentAt', 'Choose a date in the future');
    const end = new Date(start.getTime() + booking.durationMinutes * 60000);
    if (await hasConflict(booking.service, start, end, booking._id)) {
      return res.status(409).json({ error: 'That time is already booked for this service. Try another time.' });
    }
    booking.appointmentAt = start;
    booking.endsAt = end;
  }

  if (notes !== undefined) {
    if (typeof notes !== 'string' || notes.length > 500) {
      return validationError(res, 'notes', 'Notes must be 500 characters or fewer');
    }
    booking.notes = notes.trim();
  }

  await booking.save();
  res.json(booking);
}

// "Delete" means cancel: the record stays, the status changes
export async function cancelBooking(req, res) {
  const booking = await loadOwnedBooking(req, res);
  if (!booking) return;

  if (!ACTIVE.includes(booking.status)) {
    return res.status(409).json({ error: `A ${booking.status} booking cannot be cancelled` });
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
}