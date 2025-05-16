import React, { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import { useNavigate } from 'react-router-dom';
import Button from "../ui/Button.jsx";

function LoginForm({ setLogin }) {
	useEffect(() => {
		document.title = "Login";
	}, []);

	const navigate = useNavigate();
	const { apiAuth } = useApi();
	const [email, setEmail] = useState("");
	const [pwd, setPassword] = useState("");
	const [loginFailed, setLoginFailed] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const res = await apiAuth("/auth/login", JSON.stringify({ email, pwd }));
			if (res.ok) {
				navigate("/dashboard");
			} else {
				setLoginFailed(true);
				setTimeout(() => setLoginFailed(false), 1500);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const onRedirect = async () => {
		try {
			const res = await apiAuth("/auth/google");
		} catch(err) {
			console.error(err)
			alert("Something went wrong.")
		}
	};

	return (
		<div className="flex items-center justify-center bg-background text-text font-text">
			<div className="w-full max-w-sm p-6 rounded-2xl bg-secondary">
				<h1 className="text-2xl font-heading text-center mb-6 text-text">Login</h1>
				<form id="login-form" className="space-y-4" onSubmit={handleLogin}>
					<input
						type="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
						className={`w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700 ${loginFailed ? "border-red-500 text-red-500 animate-pulse" : "border-border"}`}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						className={`w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700 ${loginFailed ? "border-red-500 text-red-500 animate-pulse" : "border-border"}`}
						required
					/>

					<Button type="submit" text="Login" className="w-full lg:w-full"></Button>
					{/* <button
						type="submit"
						className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
					>
            Login
					</button> */}
				</form>

				  <Button onClick={onRedirect}text="Sign in with Google" 
					icon={<i className="devicon-google-plain"></i>} 
					className="font-text w-full bg-blue-500 hover:!bg-blue-400 active:!bg-blue-400 lg:w-full"></Button>

				<p
					className={`text-sm text-center mt-4 ${
						loginFailed ? "text-red-500 animate-pulse" : "text-text"
					}`}
				>
          No account?{" "}
					<span
						onClick={() => setLogin(false)}
						className="text-primary underline cursor-pointer hover:text-accent active:text-accent"
					>
            Register
					</span>
				</p>
			</div>
		</div>
	);
}

export default LoginForm;
















// import React, { useState, useEffect } from "react";
// import { useApi } from "../../hooks/useApi.jsx"
// import OAuthButton from "./oAuthButton.jsx";
// import { useNavigate } from 'react-router-dom'
//
// function Login( { setLogin }) {
// 	useEffect(() => {
// 		document.title = "Login"
// 	}, [])
//
// 	const navigate = useNavigate()
// 	const { apiAuth} = useApi()
// 	const [email, setEmail] = useState("")
// 	const [pwd, setPassword] = useState("")
// 	const [loginFailed, setLoginFailed] = useState(false);
//
// 	const handleLogin = async (e) => {
// 		e.preventDefault()
//
// 		try {
// 			const res = await apiAuth("/auth/login", JSON.stringify({ email, pwd }))
// 			if (res.ok){
// 				navigate("/dashboard")
// 			}
//
// 			else {
// 				setLoginFailed(true);
// 				setTimeout(() => {
// 					setLoginFailed(false);
// 				}, 1500);
//
// 			}
// 		} catch(err) {
// 			console.error(err)
// 			// alert("Something went wrong.")
// 		}
// 	}
// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-white text-black">
// 			<div className="w-full max-w-sm p-6 border border-black rounded-lg">
// 				<h1 className="text-xl font-semibold text-center mb-6">Login</h1>
// 				<form id="login-form" className="space-y-4" onSubmit={handleLogin}>
// 					<input
// 						type="email"
// 						placeholder="Email"
// 						onChange={(e)=>{setEmail(e.target.value)}}
// 						className={`w-full border ${ loginFailed ? "text-red-500 animate-pulse" : "border-black"} px-3 py-2 rounded outline-none focus:ring-0`}
// 					/>
// 					<input
// 						type="password"
// 						placeholder="Password"
// 						onChange={(e)=>{setPassword(e.target.value)}}
// 						className={`w-full border ${ loginFailed ? "text-red-500 animate-pulse" : "border-black"} px-3 py-2 rounded outline-none focus:ring-0`}
// 					/>
// 					<button
// 						type="submit"
// 						className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
// 					>
//         Login
// 					</button>
// 				</form>
// 				< OAuthButton  />
// 				<p
// 					className={`text-sm text-center mt-4 transition-all duration-300 ${
// 						loginFailed ? "text-red-500 animate-pulse" : "text-gray-700"
// 					}`}
// 				>
//         No account? <span onClick={ () => setLogin(false) }>Register</span>
// 				</p>
// 			</div>
// 		</div>
// 	)
// }
//
// export default Login
