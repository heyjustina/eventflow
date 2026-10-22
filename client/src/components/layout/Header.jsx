import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        Event<span>Flow</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="sidebar-link">Log in</Link>
            <Link to="/register" className="header-cta">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;