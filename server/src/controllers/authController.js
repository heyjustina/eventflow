import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

// Only safe fields ever leave the server
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  const details = [];
  if (name.length < 2) details.push({ field: 'name', message: 'Name must be at least 2 characters' });
  if (!EMAIL_PATTERN.test(email)) details.push({ field: 'email', message: 'Enter a valid email' });
  if (password.length < 8) details.push({ field: 'password', message: 'Password must be at least 8 characters' });
  if (details.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  // role is NOT read from the request: public signups are always customers
  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
}

export async function login(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    // Same message either way, so attackers can't learn which emails exist
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}