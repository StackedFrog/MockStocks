import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import { useNavigate } from 'react-router-dom';

function Register( { setLogin }) {
        useEffect(() => {
                document.title = "Register"
        }, [])

        const navigate = useNavigate()
        const { apiAuth} = useApi()
        const [name, setName] = useState("")
        const [email, setEmail] = useState("")
        const [pwd, setPassword] = useState("")

        const handleRegister = async (e) => {
                e.preventDefault()

                try {
                        const res = await apiAuth("/auth/register", JSON.stringify({email, name ,pwd}) )
                        if (res.ok){
                                navigate("/trade")
                        }


                } catch(err) {
                        console.error(err)
                        alert("Something went wrong.")
                }


        }

        return (
                <div className="min-h-screen flex items-center justify-center bg-white text-black">
                <div className="w-full max-w-sm p-6 border border-black rounded-lg">
                <h1 className="text-xl font-semibold text-center mb-6">Register</h1>
                <form className="space-y-4" onSubmit={handleRegister}>
                <input
                type="text"
                placeholder="Name"
                onChange={(e)=>{setName(e.target.value)}}
                className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
                />
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
                Register
                </button>
                </form>
                <p className="text-sm text-center mt-4">
                Already have an account? <span onClick={ () => setLogin(true) }>Login</span>
                </p>
                </div>
                </div>
        )
}

export default Register
