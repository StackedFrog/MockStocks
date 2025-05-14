import { Routes, Route, useLocation } from 'react-router-dom';
import SideNav from './components/SideNav.jsx'
import LandingPage from './pages/LandingPage.jsx';
import TradingPage from './pages/TradingPage.jsx';
import DashboardPage from "./pages/Dashboard.jsx";
import AdminPage from './pages/AdminPage.jsx'
import NotFound from './pages/NotFound';
//import { useAuth } from './auth_context.jsx'
import UserNavBar from './components/UserNavBar.jsx';
import RecentTrades from './components/RecentTrades.jsx';

function App() {
	//const { accessToken } = useAuth()
	const location = useLocation()
	const defaultNavPaths = ["/", "/login", "/register"]

	const isDefaultPath = defaultNavPaths.includes(location.pathname);


	return (
		<div>
			{/* conditionally render nav bar */}
			{isDefaultPath ? <SideNav /> : null}
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/trade" element={<TradingPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/recent" element={<RecentTrades />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
