import React, { createContext, useContext, useEffect, useRef, useState} from "react";

const AuthContext = createContext();

let refreshPromise = null

export const AuthProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState(null);
	const tokenRef = useRef(null)

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
					setAccessToken(data.token)
					tokenRef.current = data.token
					return data.token
				}else{
					setAccessToken(null)
					tokenRef.current = null
					console.log("failed to get accessToken")

					// maybe redirect user somewhere?
					return null
				}
			}
			catch(err){
				setAccessToken(null)
				tokenRef.current = null
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
		<AuthContext.Provider value={{accessToken, setAccessToken, refreshAccessToken, tokenRef}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const ctx = useContext(AuthContext)
	return ctx
}
