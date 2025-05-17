// Sidebar.tsx
import { FiLogOut, FiUser } from "react-icons/fi";
import { AiOutlinePieChart, AiOutlineStock } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { LuClock } from "react-icons/lu";
import { NavLink, useNavigate } from 'react-router-dom';
import { useApi } from "../../hooks/useApi.jsx";

const navItems = [
  { name: "Account", icon: FiUser, href: "/account" },
  { name: "Dashboard", icon: AiOutlinePieChart, href: "/dashboard" },
  { name: "Trade", icon: AiOutlineStock, href: "/trade" },
  { name: "Recent", icon: LuClock, href: "/recent" },
];

function SideNav({ userInfo, onLogoutInfo ,setSidebarOpen }) {
  const { apiUnAuth } = useApi();
  const navigate = useNavigate();

  const onLogout = async () => {
    await apiUnAuth("/auth/user/logout");
    onLogoutInfo(null)
    navigate("/");
  };

  return (
    <aside className="z-50 w-64 bg-background text-text border-r border-gray-300 dark:border-gray-700 flex flex-col font-text sticky top-0 h-screen">
      {/* Header */}

	<div className="p-6 text-xl font-heading text-primary border-b border-gray-200 dark:border-gray-700 items-center flex flex-col">
        <>
        <img
        src="/mockstocks-round.png"
        alt="Mockstocks logo"
        className="hidden lg:block"
        />
        <img
        src="/mockstocks-round-mobile.png"
        alt="Mockstocks logo"
        className="block lg:hidden"
        />
        </>
        {userInfo.username}
      </div>

      {/* Top nav links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.name} to={item.href} icon={item.icon} label={item.name} setSidebarOpen={setSidebarOpen} />
        ))}
        {userInfo.role === "Admin" && (
          <NavItem to="/admin" icon={MdOutlineAdminPanelSettings} label="Admin" setSidebarOpen={setSidebarOpen}/>
        )}
      </nav>

      {/* Bottom nav and logout */}
      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
        <NavItem to="/about" icon={BsInfoCircle} label="About us" setSidebarOpen={setSidebarOpen} />
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ to, icon: Icon, label, setSidebarOpen }) {
  return (
    <NavLink
      to={to}
      onClick={() => {setSidebarOpen(false)}}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${
          isActive
            ? "bg-gray-200 dark:bg-gray-700 text-primary"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      <Icon className="w-5 h-5 text-accent" />
      {label}
    </NavLink>
  );
}

export default SideNav;
