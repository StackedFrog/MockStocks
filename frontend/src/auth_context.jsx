import React, { createContext, useContext, useEffect, useState} from "react";
// import jwtDecode  from "jwt-decode";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState(null);

	const refreshAccessToken = async () => {
		try {
			const res = await fetch("/auth/refresh", {
				method: "POST",
				credentials: "include"
			})

			if (res.ok) {
				const data = await res.json()
				console.log("new token ", data.token)
				setAccessToken(data.token)

				// const decoded = jwtDecode(data.token);
				// console.log(decoded)
			}else{
				setAccessToken(null)
				console.log("failed to get accessToken")
				// maybe redirect user somewhere?
			}
		}
		catch(err){
			setAccessToken(null)
			console.log("error refreshing token", err)
		}
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
