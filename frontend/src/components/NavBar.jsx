import { Link } from 'react-router-dom'

function NavBar() {
  return (
  <>
    <nav className="flex justify-end gap-1 font-bold ">
      <Link className="p-2 m-1 rounded hover:bg-black hover:text-white" to="/">Home</Link>
      <Link className="p-2 m-1 rounded hover:bg-black hover:text-white" to="/login">Login</Link>
      <Link className="p-2 m-1 rounded hover:bg-black hover:text-white"to="/register">Register</Link>
    </nav>
  </>
  )
}

export default NavBar
