import { Link  } from 'react-router-dom'
import LogoutButton from '../auth/LogoutButton'

function UserNavBar() {
  return (
  <>
    <nav className="flex justify-end gap-1 font-bold ">
      <Link className="p-2 m-1 rounded hover:bg-black hover:text-white"to="/admin">Admin</Link>
      <Link className="p-2 m-1 rounded hover:bg-black hover:text-white" to="/trade">Trade</Link>
      <Link className="p-2 m-1 rounded hover:bg-black hover:text-white"to="/profile">Profile</Link>
      <LogoutButton />
    </nav>
  </>
  )
}



export default UserNavBar
