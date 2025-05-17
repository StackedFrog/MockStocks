import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/Landing.jsx';
import TradingPage from './pages/logged-in/TradingPage.jsx';
import DashboardPage from "./pages/logged-in/Dashboard.jsx";
import NotFound from './pages/public/NotFound.jsx';
import RecentTrades from './components/trading/RecentTrades.jsx';
import Authentication from './pages/public/Authentication.jsx';
import SideNav from './components/layout/SideNav.jsx';
import DisplayProfile from './pages/logged-in/Account.jsx';
import AdminPage from './pages/logged-in/admin/AdminPage.jsx';
import DisplayName from "./components/layout/ProfileDisplay.jsx"
import DisplayBalance from "./components/layout/DisplayBalance.jsx";
import { useEffect, useState } from "react";
import { useApi } from './hooks/useApi.jsx';
import About from './pages/public/About.jsx';
import { FiMenu } from "react-icons/fi";


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
        const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
        const [sidebarOpen, setSidebarOpen] = useState(false);

        useEffect(() => {
                if (isMobile && sidebarOpen) {
                        document.body.classList.add('overflow-hidden');
                } else {
                        document.body.classList.remove('overflow-hidden');
                }

                return () => {
                        document.body.classList.remove('overflow-hidden');
                };
        }, [isMobile, sidebarOpen]);

        const fetchUserInfo = async () => {
                console.log("fetching")
                const res = await apiFetch("api/user/info", { method: "GET" }, false);
                if (res) {
                        const data = await res.json();
                        setUserInfo(data);
                }
        };

        useEffect(() => {
                fetchUserInfo();
                const handleResize = () => setIsMobile(window.innerWidth < 1024);
                window.addEventListener("resize", handleResize);
                return () => window.removeEventListener("resize", handleResize);
        }, []);

        return (
                <div className="min-h-screen bg-background text-text font-text">
                {userInfo ? (
                        <>
                        {isMobile && (
                                <>
                                <div className="h-16 flex sticky top-0 w-full items-center bg-background border-b border-gray-200 dark:border-gray-700">
                                <button onClick={() => setSidebarOpen(true)} className="text-primary text-2xl ml-2 mb-1">
                                <FiMenu/>
                                </button>
                                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                                <h1 className="text-primary text-3xl font-heading">Mock</h1>
                                <h1 className="text-secondary text-3xl font-heading">Stocks</h1>
                                </div>
                                {sidebarOpen && (
                                        <>
                                        <div className="fixed inset-0 z-100 bg-opacity-0" onClick={() => setSidebarOpen(false)}/>
                                        <div className="fixed inset-y-0 left-0 z-150 w-64 bg-background border-r border-gray-700 flex flex-col">
                                        <SideNav userInfo={userInfo} onLogoutInfo={setUserInfo} setSidebarOpen={setSidebarOpen} />
                                        </div>
                                        </>
                                )}
                                </div>
                                <div className="flex my-4 items-center justify-center gap-4" style={{margin: "10px"}}>
                                <DisplayName name={userInfo.username}/>
                                <DisplayBalance cash={userInfo.balance}/> 
                                </div>
                                </>
                        )}
                        <div className="flex ">
                        {!isMobile && (
                                <SideNav userInfo={userInfo} onLogoutInfo={setUserInfo} setSidebarOpen={setSidebarOpen} />
                        )}
                        <main className="flex-1 p-6 bg-background text-gray-900 dark:text-white transition-colors">
                        <Routes>
                        <Route path="/trade" element={<TradingPage hideChart={isMobile && sidebarOpen}/>} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/recent" element={<RecentTrades />} />
                        <Route path="/account" element={<DisplayProfile user={userInfo}/>} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                        </Routes>
                        </main>
                        </div>
                        </>
                ) : (
                        <div className="flex items-center justify-center h-screen text-lg bg-background">Loadingggg...</div>
                )}
                </div>
        );
}

export default App;
