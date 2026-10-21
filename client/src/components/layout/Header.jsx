import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        Event<span>Flow</span>
      </Link>
      <Link to="/events/new" className="header-cta">
        + New Event
      </Link>
    </header>
  );
}

export default Header;