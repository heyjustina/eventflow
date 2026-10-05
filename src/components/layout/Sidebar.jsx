import { NavLink } from 'react-router-dom';

// A small helper: NavLink gives us `isActive`, and we use it to pick the CSS class.
function getLinkClass({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link';
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" end className={getLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/events/new" className={getLinkClass}>
          New Event
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;