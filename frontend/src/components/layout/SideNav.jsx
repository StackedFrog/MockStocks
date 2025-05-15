import { NavLink } from "react-router-dom";

// Sidebar.tsx
import { FiLogOut, FiUser } from "react-icons/fi";
import { AiOutlinePieChart, AiOutlineStock } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { LuClock } from "react-icons/lu";
import { useNavigate } from 'react-router-dom'
import { useApi } from "../../hooks/useApi.jsx"

const navItems = [
  { name: "Account", icon: FiUser, href: "/account" },
  { name: "Dashboard", icon:AiOutlinePieChart ,href: "/dashboard" },
  { name: "Trade", icon: AiOutlineStock, href: "/trade" },
  { name: "Recent", icon: LuClock, href: "/recent" },
  // { name: "Admin", icon:MdOutlineAdminPanelSettings, href: "/admin" },
];

function SideNav( {userInfo} ) {
	const { apiUnAuth } = useApi()

	const navigate = useNavigate()
	const onLogout = async () => {
		await apiUnAuth("/auth/user/logout")
		navigate("/")
	}

	return (<aside className="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 text-2xl font-bold text-gray-800 dark:text-white">{userInfo.username}</div>

      {/* Top nav links */}
      <nav className="px-2 space-y-1 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.name} to={item.href} icon={item.icon} label={item.name} />
        ))}

	{userInfo.role === "Admin"? <NavItem key={"Admin"} to={"/admin"} icon={ MdOutlineAdminPanelSettings} label={"Admin"} />:null}
	</nav>

      {/* Bottom nav and logout */}
      <div className="px-2 space-y-3">
        <NavItem to="/about" icon={BsInfoCircle} label="About us" />
        <button onClick={onLogout} className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600">
          <FiLogOut className="w-4 h-4"  />
          Logout
        </button>
      </div>
    </aside>)
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
}

export default SideNav

 // return(
 //        <>
 //            <div class="flex">
 //                <nav class = "flex flex-col justify-around items-end bg-dark_green">
 //                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/account">Account</Link>
 //                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/dashboard">Dashboard</Link>
 //                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/trade">Trading</Link>
 //                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/recent">Recent Trades</Link>
 //                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/admin">Admin</Link>
 //                </nav>
 //            </div>
 //        </>
 //    )
