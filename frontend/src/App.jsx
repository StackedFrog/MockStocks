import { Routes, Route, useLocation } from 'react-router-dom';
import SideNav from './components/SideNav.jsx'
import LangingPage from './pages/LangingPage';
import TradingPage from './pages/TradingPage.jsx'
import NotFound from './pages/NotFound';

function App() {
  
  const location = useLocation()
  const defaultNavPaths = ["/", "/login", "/register"]

  const isDefaultPath = defaultNavPaths.includes(location.pathname);
  

  return (
    <div>.

      {/* conditionally render nav bar */}
      {isDefaultPath ? null : <SideNav></SideNav> }  
      <Routes>
        <Route path="/" element={<LangingPage />} />
        <Route path="/account" element={<TradingPage />} />
        <Route path="/dashboard" element={<TradingPage />} />
        <Route path="/trade" element={<TradingPage />} />
        <Route path="/recent" element={<TradingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
