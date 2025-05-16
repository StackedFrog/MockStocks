import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/public/Landing.jsx';
import TradingPage from './pages/logged-in/TradingPage.jsx';
import DashboardPage from "./pages/logged-in/Dashboard.jsx";
import NotFound from './pages/public/NotFound.jsx';
import RecentTrades from './components/trading/RecentTrades.jsx';
import Authentication from './pages/public/Authentication.jsx';
import SideNav from './components/layout/SideNav.jsx';
import DisplayProfile from './pages/logged-in/Account.jsx';
import AdminPage from './pages/logged-in/admin/AdminPage.jsx';
import { useEffect, useState } from "react";
import { useApi } from './hooks/useApi.jsx';
import About from './pages/public/About.jsx';


function App() {

	const [userInfo, setUserInfo] = useState(null);
	return (
		<Routes>
			{/* Route with no layout (e.g. Login, Register, Landing) */}
			<Route path="/" element={<LandingPage />} />
			<Route path="/login" element={<Authentication />} />
			{userInfo ? <></> : <Route path="/about" element={<About />}/>}

			{/* Authenticated Routes with layout */}
			<Route path="/*" element={<AppLayout userInfo={userInfo} setUserInfo={setUserInfo} />} />
		</Routes>
	);
}


function AppLayout({userInfo, setUserInfo}) {
	const { apiFetch } = useApi();

	const fetchUserInfo = async () => {
		console.log("fetching")
		const res = await apiFetch("api/user/info", { method: "GET" });
		if (res.ok) {
			const data = await res.json();
			setUserInfo(data);
		}
	};

	useEffect(() => {
		fetchUserInfo();
	}, []);

	return (
		<div className="min-h-screen bg-background text-text font-text">
			{userInfo ? (
				<div className="flex min-h-screen">
					<SideNav userInfo={userInfo} />
					<main className="flex-1 p-6 bg-background text-gray-900 dark:text-white transition-colors">
						<Routes>
							<Route path="/trade" element={<TradingPage />} />
							<Route path="/dashboard" element={<DashboardPage />} />
							<Route path="/recent" element={<RecentTrades />} />
							<Route path="/account" element={<DisplayProfile />} />
							<Route path="/admin" element={<AdminPage />} />
							<Route path="/about" element={<About />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
				</div>
			) : (
				<div className="flex items-center justify-center h-screen text-lg">Loadingggg...</div>
			)}
		</div>
	);
}

export default App;
