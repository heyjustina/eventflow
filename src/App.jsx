import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventLayout from './pages/EventLayout';
import EventOverview from './pages/EventOverview';
import EventTasks from './pages/EventTasks';
import EventBudget from './pages/EventBudget';
import EventRunOfShow from './pages/EventRunOfShow';
import EventPrint from './pages/EventPrint';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events/new" element={<CreateEvent />} />

        <Route path="/events/:id" element={<EventLayout />}>
          <Route index element={<EventOverview />} />
          <Route path="tasks" element={<EventTasks />} />
          <Route path="budget" element={<EventBudget />} />
          <Route path="run-of-show" element={<EventRunOfShow />} />
          <Route path="print" element={<EventPrint />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;