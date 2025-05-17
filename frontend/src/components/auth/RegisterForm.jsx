import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import { useNavigate } from 'react-router-dom';
import Button from "../ui/Button.jsx";

function RegisterForm({ setLogin }) {
	useEffect(() => {
		document.title = "Register";
	}, []);

	const navigate = useNavigate();
	const { apiAuth } = useApi();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [pwd, setPassword] = useState("");
	const [confirmPwd, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const validatePassword = (password) => {
		return password.length >= 8;
	};

	const handleRegister = async (e) => {
		e.preventDefault();

		if (pwd !== confirmPwd) {
			setError("Passwords do not match");
			return;
		}

		if (!validatePassword(pwd)) {
			setError("Password must be at least 8 characters long");
			return;
		}

		try {
			const res = await apiAuth("/auth/register", JSON.stringify({ email, name, pwd }));
			if (res.ok) {
				navigate("/trade");
			} else {
				setError("Registration failed");
			}
		} catch (err) {
			console.error(err);
			setError("Something went wrong.");
		}
	};

	return (
		<div className="flex items-center justify-center bg-background text-text font-text">
			<div className="w-full max-w-sm p-6 rounded-2xl bg-secondary">
				<h1 className="text-2xl font-heading text-center mb-6 text-text">Register</h1>
				<form className="space-y-4" onSubmit={handleRegister}>
					<input
						type="text"
						placeholder="Name"
						onChange={(e) => setName(e.target.value)}
						className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
						required
					/>
					<input
						type="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
						required
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
						required
					/>

					{error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}

					<Button type="submit" text="Register" className="w-full lg:w-full"></Button>
				</form>
				<p className="text-sm text-center mt-4">
          Already have an account?{" "}
					<span
						onClick={() => setLogin(true)}
						className="text-primary underline cursor-pointer hover:text-accent active:text-accent"
					>
            Login
					</span>
				</p>
			</div>
		</div>
	);
}

export default RegisterForm;



























// import React, { useState, useEffect } from "react";
// import { useApi } from "../../hooks/useApi.jsx";
// import { useNavigate } from 'react-router-dom';
//
// function Register( { setLogin }) {
//         useEffect(() => {
//                 document.title = "Register"
//         }, [])
//
//         const navigate = useNavigate()
//         const { apiAuth} = useApi()
//         const [name, setName] = useState("")
//         const [email, setEmail] = useState("")
//         const [pwd, setPassword] = useState("")
// 	const [confirmPwd, setConfirmPassword] = useState("");
//         const [error, setError] = useState("");
//
//   const validatePassword = (password) => {
//     return password.length >= 8;
//     // Optionally add more checks:
//     // /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)
//   };
//
//         const handleRegister = async (e) => {
//                 e.preventDefault()
// 		console.log("here")
//
// 	    if (pwd !== confirmPwd) {
// 	      setError("Passwords do not match");
// 	      return;
// 	    }
//
// 	    if (!validatePassword(pwd)) {
// 	      setError("Password must be at least 8 characters long");
// 	      return;
// 	    }
//
//
//                 try {
//                         const res = await apiAuth("/auth/register", JSON.stringify({email, name ,pwd}) )
//                         if (res.ok){
//                                 navigate("/trade")
//                         } else {
//         			setError("Registration failed");
//       			}
//
//
//                 } catch(err) {
//                         console.error(err)
//                         alert("Something went wrong.")
//                 }
//         }
//
//         return (
//                 <div className="min-h-screen flex items-center justify-center bg-white text-black">
//                 <div className="w-full max-w-sm p-6 border border-black rounded-lg">
//                 <h1 className="text-xl font-semibold text-center mb-6">Register</h1>
//                 <form className="space-y-4" onSubmit={handleRegister}>
//                 <input
//                 type="text"
//                 placeholder="Name"
//                 onChange={(e)=>{setName(e.target.value)}}
//                 className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
// 		required
//                 />
//                 <input
//                 type="email"
//                 placeholder="Email"
//                 onChange={(e)=>{setEmail(e.target.value)}}
//                 className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
//                 required
// 		/>
//                 <input
//                 type="password"
//                 placeholder="Password"
//                 onChange={(e)=>{setPassword(e.target.value)}}
//                 className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
//                 required
// 		/>
// 		  <input
// 		    type="password"
// 		    placeholder="Confirm Password"
// 		    onChange={(e) => setConfirmPassword(e.target.value)}
// 		    className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
// 		    required
// 		  />
//         {error && <p className="text-red-600 text-sm">{error}</p>}
//                 <button
//                 type="submit"
//                 className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
//                 >
//                 Register
//                 </button>
//                 </form>
//                 <p className="text-sm text-center mt-4">
//                 Already have an account? <span onClick={ () => setLogin(true) }>Login</span>
//                 </p>
//                 </div>
//                 </div>
//         )
// }
//
// export default Register
