import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../styles/layout.css';
import '../../styles/ui.css';

function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;