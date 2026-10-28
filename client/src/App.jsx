import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventLayout from './pages/EventLayout';
import EventOverview from './pages/EventOverview';
import EventTasks from './pages/EventTasks';
import EventBudget from './pages/EventBudget';
import EventRunOfShow from './pages/EventRunOfShow';
import EventPrint from './pages/EventPrint';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import MyBookings from './pages/MyBookings';
import Planner from './pages/Planner';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MyBookings />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/events/new" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventLayout />}>
            <Route index element={<EventOverview />} />
            <Route path="tasks" element={<EventTasks />} />
            <Route path="budget" element={<EventBudget />} />
            <Route path="run-of-show" element={<EventRunOfShow />} />
            <Route path="print" element={<EventPrint />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;