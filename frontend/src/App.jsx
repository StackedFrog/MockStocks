import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar'
import LangingPage from './pages/LangingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import TradingPage from './pages/TradingPage.jsx'
import NotFound from './pages/NotFound';

function App() {
  
  const location = useLocation()
  const defaultNavPaths = ["/", "/login", "/register"]

  const isDefaultPath = defaultNavPaths.includes(location.pathname);
  

  return (
    <div>

      {/* conditionally render nav bar */}
      {isDefaultPath ? <NavBar /> : null}
      <Routes>
        <Route path="/" element={<LangingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trade" element={<TradingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
