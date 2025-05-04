import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-sm p-6 border border-black rounded-lg">
        <h1 className="text-xl font-semibold text-center mb-6">Register</h1>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
