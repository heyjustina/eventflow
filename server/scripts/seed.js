import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/db.js';
import Service from '../src/models/Service.js';
import User from '../src/models/User.js';

// Fictional demo data: all providers and prices are made up
const services = [
  // Venues
  { name: 'Garden Terrace Rental', category: 'Venue', provider: 'Willow Grove Venues', price: 1800, durationMinutes: 240, description: 'Outdoor terrace with seating for up to 80 guests, string lighting, and a covered bar area. Suits weddings, birthdays, and receptions.' },
  { name: 'Downtown Loft Space', category: 'Venue', provider: 'Brick & Beam Events', price: 2600, durationMinutes: 300, description: 'Industrial loft with exposed brick, a built-in stage, and a sound system for up to 120 guests. Suits launches, parties, and fundraisers.' },
  { name: 'Convention Hall Rental', category: 'Venue', provider: 'Metro Event Center', price: 5500, durationMinutes: 480, description: 'Large hall for up to 300 guests with breakout rooms, registration area, and loading dock. Suits conferences and expos.' },

  // Catering
  { name: 'Full-Service Buffet Catering', category: 'Catering', provider: 'Harvest Fork Catering', price: 2200, durationMinutes: 240, description: 'Hot and cold buffet with vegetarian options, staff, and setup for up to 100 guests.' },
  { name: 'Cocktail Reception Catering', category: 'Catering', provider: 'Salt & Citrus Events', price: 1600, durationMinutes: 180, description: 'Passed appetizers and a two-station bar for up to 60 guests. Suits networking events and receptions.' },
  { name: 'Food Truck Package', category: 'Catering', provider: 'Street Eats Collective', price: 1100, durationMinutes: 180, description: 'Two food trucks serving casual menus for up to 80 guests. Suits community festivals and casual parties.' },

  // Photography and video
  { name: 'Event Photography (3 hours)', category: 'Photography', provider: 'Lumen Studio', price: 650, durationMinutes: 180, description: 'Candid and group photos with 50 edited images delivered online.' },
  { name: 'Highlight Video Package', category: 'Photography', provider: 'Frame by Frame Films', price: 1400, durationMinutes: 240, description: 'On-site videographer and a three-minute edited highlight reel delivered within two weeks.' },

  // Entertainment
  { name: 'DJ and Dance Floor Package', category: 'Entertainment', provider: 'Pulse Sound Co.', price: 950, durationMinutes: 240, description: 'Professional DJ, speakers, dance floor lighting, and a custom playlist consultation.' },
  { name: 'Live Acoustic Duo', category: 'Entertainment', provider: 'Quiet Rooms Music', price: 700, durationMinutes: 120, description: 'Two-piece acoustic set suited to receptions, dinners, and launches.' },
  { name: 'Professional Emcee and Host', category: 'Entertainment', provider: 'Center Stage Hosts', price: 500, durationMinutes: 180, description: 'Experienced host to run the program, introduce speakers, and keep the schedule on time.' },

  // AV and production
  { name: 'Sound, Lighting and Projection Kit', category: 'AV & Production', provider: 'Bright Signal AV', price: 1300, durationMinutes: 300, description: 'Microphones, projector and screen, stage lighting, and a technician on site for presentations and panels.' },

  // Decor
  { name: 'Floral and Table Decor Package', category: 'Decor', provider: 'Fern & Fable', price: 900, durationMinutes: 120, description: 'Seasonal centerpieces, table runners, and entrance florals installed before doors open.' },

  // Staffing
  { name: 'Event Staff Team (4 people)', category: 'Staffing', provider: 'Ready Hands Staffing', price: 800, durationMinutes: 300, description: 'Four trained staff for check-in, guest direction, and setup help.' },

  // Rentals
  { name: 'Tables, Chairs and Linens (100 guests)', category: 'Rentals', provider: 'Everything Rentals', price: 750, durationMinutes: 120, description: 'Round tables, chairs, and linens for up to 100 guests, delivered and collected.' },

  // Wellness
  { name: 'Guided Group Wellness Session', category: 'Wellness', provider: 'Sunrise Flow Collective', price: 400, durationMinutes: 60, description: 'Beginner-friendly group yoga or stretch session led by a certified instructor, mats included. Suits retreats and team events.' },
];

async function seed() {
  console.log('WARNING: this deletes ALL existing services and replaces them.');
  await connectDB();

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`Seeded ${services.length} services`);

  // Admin account: password comes from the environment, never from source code
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    await User.deleteOne({ email: adminEmail.toLowerCase() });
    await User.create({
      name: 'Site Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'admin',
    });
    console.log('Admin account created');
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set: skipped admin account');
  }

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});