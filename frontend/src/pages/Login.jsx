import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApi } from "./../api_wrapper.jsx"

function Login() {
  useEffect(() => {
    document.title = "Login"
  }, [])

  const { authenticate } = useApi()
  const [email, setEmail] = useState("")
  const [pwd, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
	await authenticate("/auth/login", JSON.stringify({ email, pwd }))
    } catch(err) {
      console.error(err)
      alert("Something went wrong.")
    }


  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-sm p-6 border border-black rounded-lg">
        <h1 className="text-xl font-semibold text-center mb-6">Login</h1>
        <form id="login-form" className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>{setEmail(e.target.value)}}
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>{setPassword(e.target.value)}}
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          No account? <Link to="/register" className="underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
