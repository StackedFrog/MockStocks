import { Link } from 'react-router-dom'

function NavBar() {
  return (
  <>
    <nav>
      <Link className="text-2xl font-bold underline" to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  </>
  )
}

export default NavBar
