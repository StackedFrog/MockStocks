import React, { createContext, useContext, useEffect, useState} from "react";
// import jwtDecode  from "jwt-decode";

const AuthContext = createContext();

let refreshPromise = null

export const AuthProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState(null);
	const refreshAccessToken = async () => {

		if (refreshPromise) return refreshPromise

		refreshPromise = (async () => {
		try {
			const res = await fetch("/auth/refresh", {
				method: "POST",
				credentials: "include"
			})

			if (res.ok) {
				const data = await res.json()
				console.log("new token ", data.token)
				setAccessToken(data.token)
				return data.token
				// const decoded = jwtDecode(data.token);
				// console.log(decoded)
			}else{
				setAccessToken(null)
				console.log("failed to get accessToken")
				// maybe redirect user somewhere?
				return null
			}
		}
		catch(err){
			setAccessToken(null)
			console.log("error refreshing token", err)
			return null
		} finally {
			refreshPromise = null
			}
	})()

		return refreshPromise
	}

	useEffect(() => {
		refreshAccessToken()
	}, []);

	return (
		<AuthContext.Provider value={{accessToken, setAccessToken, refreshAccessToken}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const ctx = useContext(AuthContext)
	return ctx
}
