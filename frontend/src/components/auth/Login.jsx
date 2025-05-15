import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi.jsx"
import OAuthButton from "./oAuthButton.jsx";
import { useNavigate } from 'react-router-dom'

function Login( { setLogin }) {
useEffect(() => {
        document.title = "Login"
}, [])

const navigate = useNavigate()
const { apiAuth} = useApi()
const [email, setEmail] = useState("")
const [pwd, setPassword] = useState("")
const [loginFailed, setLoginFailed] = useState(false);

const handleLogin = async (e) => {
        e.preventDefault()

        try {
                const res = await apiAuth("/auth/login", JSON.stringify({ email, pwd }))
                if (res.ok){
                        navigate("/trade")
                }

                else {
                        setLoginFailed(true);
                        setTimeout(() => {
                                setLoginFailed(false);
                        }, 1500);

                }
        } catch(err) {
                console.error(err)
                // alert("Something went wrong.")
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
        className={`w-full border ${ loginFailed ? "text-red-500 animate-pulse" : "border-black"} px-3 py-2 rounded outline-none focus:ring-0`}
        />
        <input
        type="password"
        placeholder="Password"
        onChange={(e)=>{setPassword(e.target.value)}}
        className={`w-full border ${ loginFailed ? "text-red-500 animate-pulse" : "border-black"} px-3 py-2 rounded outline-none focus:ring-0`}
        />
        <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
        >
        Login
        </button>
        </form>
        < OAuthButton  />
        <p 
        className={`text-sm text-center mt-4 transition-all duration-300 ${
                loginFailed ? "text-red-500 animate-pulse" : "text-gray-700"
        }`}
        >
        No account? <span onClick={ () => setLogin(false) }>Register</span>
        </p>
        </div>
        </div>
)
}

export default Login
