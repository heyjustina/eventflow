import { NavLink } from 'react-router-dom';

function getLinkClass({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link';
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/services" className={getLinkClass}>
          Services
        </NavLink>
        <NavLink to="/" end className={getLinkClass}>
          Planner (local)
        </NavLink>
        <NavLink to="/events/new" className={getLinkClass}>
          New Event
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;