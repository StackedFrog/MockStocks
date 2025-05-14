import { Routes, Route, useLocation } from 'react-router-dom';
import SideNav from './components/SideNav.jsx'
import LangingPage from './pages/LangingPage';
import TradingPage from './pages/TradingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import NotFound from './pages/NotFound';
import { useAuth } from './auth_context.jsx'
import UserNavBar from './components/UserNavBar.jsx';

function App() {
  const { accessToken } = useAuth()
  const location = useLocation()
  const defaultNavPaths = ["/", "/login", "/register"]

  const isDefaultPath = defaultNavPaths.includes(location.pathname);


  return (
    <div>
      {/* conditionally render nav bar */}
      {!accessToken ? <NavBar /> : <UserNavBar />}
      <Routes>
        <Route path="/" element={<LangingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trade" element={<TradingPage />} />
        <Route path="/recent" element={<TradingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
