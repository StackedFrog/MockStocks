import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Login() {
  useEffect(() => {
    document.title = "Login"
  }, [])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:8000/login", { //change port later!!!!!
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      console.log(data)

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
