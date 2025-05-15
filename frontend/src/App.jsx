import { Routes, Route, useLocation } from 'react-router-dom';
import SideNav from './components/layout/SideNav.jsx'
import LandingPage from './pages/public/Landing.jsx';
import TradingPage from './pages/TradingPage.jsx';
import DashboardPage from "./pages/Dashboard.jsx";
import AdminPage from './pages/logged-in/admin/AdminPage.jsx'
import NotFound from './pages/public/NotFound.jsx';
import { useAuth } from './components/contexts/AuthContext.jsx';
import UserNavBar from './components/layout/UserNavBar.jsx';
import RecentTrades from './components/trading/RecentTrades.jsx';
import About from './pages/public/About.jsx';
import Authentication from './pages/public/Authentication.jsx';

function App() {
	const { accessToken } = useAuth()
	const location = useLocation()
	const defaultNavPaths = ["/", "/login", "/about"]

	const isDefaultPath = defaultNavPaths.includes(location.pathname);


	return (
		<div>
			{/* conditionally render nav bar */}
			{/* {isDefaultPath ? <SideNav /> : null} */}
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Authentication />} />
				<Route path="/about" element={<About />} />
				<Route path="/trade" element={<TradingPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/recent" element={<RecentTrades />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
