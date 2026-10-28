import { Link } from 'react-router-dom';
import '../styles/home.css';

const AUDIENCES = [
  { title: 'Personal', text: 'Birthdays, graduations, baby showers, and celebrations at home.', color: 'var(--color-coral)' },
  { title: 'Business', text: 'Galas, client appreciation, brunches, and launch events.', color: 'var(--color-accent)' },
  { title: 'Corporate', text: 'Conferences, festivals, trade shows, and large gatherings.', color: 'var(--color-teal)' },
];

const CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Entertainment',
  'AV & Production', 'Decor', 'Staffing', 'Rentals', 'Wellness',
];

function Home() {
  return (
    <div>
      <section className="hero">
        <p className="hero-eyebrow">EVENT PLANNING AND BOOKING</p>
        <h1>Plan it. Book it. Pull it off.</h1>
        <p className="hero-sub">
          Tell the planner what you're organizing. Get a service plan, a draft budget,
          and a checklist, then book the pros you need.
        </p>
        <div className="hero-actions">
          <Link to="/planner" className="hero-btn hero-btn-primary">Start planning</Link>
          <Link to="/services" className="hero-btn hero-btn-light">Browse services</Link>
        </div>
        <div className="hero-stats">
          <span><strong>16</strong> services</span>
          <span><strong>9</strong> categories</span>
          <span><strong>AI</strong> planner</span>
        </div>
      </section>

      <h2 className="home-heading">Built for every kind of event</h2>
      <div className="audience-grid">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="audience-card" style={{ borderTopColor: a.color }}>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        ))}
      </div>

      <h2 className="home-heading">Everything your event needs</h2>
      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <Link key={c} to="/services" className="chip">{c}</Link>
        ))}
      </div>

      <h2 className="home-heading">How it works</h2>
      <div className="audience-grid">
        <div className="step-box"><span className="step-num">1</span><strong>Describe</strong><p>Event type, guests, budget, and preferences.</p></div>
        <div className="step-box"><span className="step-num">2</span><strong>Get your plan</strong><p>Suggested services from our catalog, a budget, and a checklist.</p></div>
        <div className="step-box"><span className="step-num">3</span><strong>Book</strong><p>Pick a time and manage everything in My Bookings.</p></div>
      </div>
    </div>
  );
}

export default Home;