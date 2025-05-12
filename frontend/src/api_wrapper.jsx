import { useAuth } from "./auth_context.jsx";
import { useNavigate } from 'react-router-dom'

	// const apiCall = async (url, options = {}) => {
	// 	const headers = {
	// 		...options.headers,
	// 		...(accessToken ? { Authorization: `Bearer ${accessToken}` }: {}),
	// 		"Content-Type": 'application/json',
	// 	}
	//
	// 	let res = await fetch(url, {
	// 		...options,
	// 		headers
	// 	})
	// 	return res
	// 	}

	// const apiFetch = async (url, options = {}) => {
	//
	// 	const res = apiCall(url, options)
	//
	// 	if (res.status === 401){
	// 		await refreshAccessToken()
	//
	// 		res = apiCall(url, options)
	// 	}
	// 	return res;
	// }
	//



export const useApi = () => {

	const { accessToken, refreshAccessToken, setAccessToken} = useAuth()
	const navigate = useNavigate()

	const apiFetch = async (url, options = {}) => {
		const headers = {
			...options.headers,
			...(accessToken ? { Authorization: `Bearer ${accessToken}` }: {}),
			"Content-Type": 'application/json',
		}

		let res = await fetch(url, {
			...options,
			headers
		})

		if (res.status === 403){
			console.log("missing privilige")
			navigate("/")
		}

		else if (res.status === 401){
			await refreshAccessToken()
			const retryHeaders = {
				...options.headers,
				...(accessToken ? { Authorization: `Bearer ${accessToken}` }: {}),
				"Content-Type": 'application/json',
			}

			res = await fetch(url, {
				...options,
				headers: retryHeaders
			})
			if (res.status === 401){
				console.log("redirecting ")
				navigate("/")
			}
		}


		return res;
	}

	const authenticate = async (url, payload) => {
		try {
			const res = await apiFetch(url, { //change port later!!!!!
				method: "POST",
				body: payload,
			})
			if (res.ok){
				const data = await res.json()
				setAccessToken(data.token)
				navigate("/trade")
			}

		} catch(err) {
			console.error(err)
			alert("Something went wrong.")
		}

	}

	const logout  = async () => {
		try {
			const res = await apiFetch("/auth/user/logout", { //change port later!!!!!
				method: "POST",
				credentials: "include"
			})
			setAccessToken(null)

		} catch(err) {
			console.error(err)
			alert("Something went wrong.")
		}
	}


	return { apiFetch, logout, authenticate }
}
