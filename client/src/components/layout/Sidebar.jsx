import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function getLinkClass({ isActive }) {
  return isActive ? 'sidebar-link active' : 'sidebar-link';
}

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" end className={getLinkClass}>Home</NavLink>
        <NavLink to="/services" className={getLinkClass}>Services</NavLink>
        {user && <NavLink to="/planner" className={getLinkClass}>AI Planner</NavLink>}
        {user && <NavLink to="/dashboard" className={getLinkClass}>My Bookings</NavLink>}
      </nav>
    </aside>
  );
}

export default Sidebar;