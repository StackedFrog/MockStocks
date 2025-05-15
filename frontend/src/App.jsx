import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/public/Landing.jsx';
import TradingPage from './pages/logged-in/TradingPage.jsx';
import DashboardPage from "./pages/logged-in/Dashboard.jsx";
import NotFound from './pages/public/NotFound.jsx';
import { useAuth } from './contexts/AuthContext.jsx'
import RecentTrades from './components/trading/RecentTrades.jsx';
import About from './pages/public/About.jsx';
import Authentication from './pages/public/Authentication.jsx';
import SideNav from './components/layout/SideNav.jsx';
import DisplayProfile from './pages/logged-in/Account.jsx';
import AdminPage from './pages/logged-in/admin/AdminPage.jsx';
import { useEffect, useState } from "react";
import { useApi } from './hooks/useApi.jsx';


function App() {
	const location = useLocation()
	const defaultNavPaths = ["/", "/login", "/about"]

	const isDefaultPath = defaultNavPaths.includes(location.pathname);

  	return (
    	<Routes>
      	{/* Route with no layout (no SideNav) */}
      	<Route path="/" element={<LandingPage />} />
			<Route path="/login" element={<Authentication />} />
			<Route path="/about" element={<About />}></Route>
      	{/* All other routes with layout */}
      	<Route path="/*" element={<AppLayout />} />
    	</Routes>
	);
}


function AppLayout(){

	const [userInfo, setUserInfo] = useState()

	const { apiFetch } = useApi()

	const fetchUserInfo = async () => {
		const res = await apiFetch("api/user/info", {method: "Get"})
		if (res.ok){
			const data = await res.json()
			setUserInfo(data)
		}
	}

	useEffect(() => {
		fetchUserInfo()
	}, [])

	return (
		<div> { userInfo?
			<div className="flex min-h-screen">
				<SideNav userInfo={userInfo}/>
				<main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
					<Routes>
						<Route path="/about" element={<About />} />
						<Route path="/trade" element={<TradingPage />} />
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/recent" element={<RecentTrades />} />
						<Route path="/account" element={<DisplayProfile/>} />
						<Route path="/admin" element={<AdminPage/>} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
			</div>
			:
			<span> Loading </span>
		}
		</div>
	);

}


export default App;
