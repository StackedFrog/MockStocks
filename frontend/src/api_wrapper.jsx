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

		let token = accessToken

		if (!token){
			token = await refreshAccessToken()
			if (!token){
				navigate("/")
				return
			}
		}

		const headers = {
			...options.headers,
			...({ Authorization: `Bearer ${token}` }),
			"Content-Type": 'application/json',
		}

		let res = await fetch(url, {
			...options,
			headers
		})

		if (res.status === 403){
			console.log("missing privilige")
			navigate("/")
			return
		}

		if (res.status === 401){
			token = await refreshAccessToken()
			if (!token){
				navigate("/")
				return
			}
			const headers = {
				...options.headers,
				...({ Authorization: `Bearer ${token}` }),
				"Content-Type": 'application/json',
			}

			let res = await fetch(url, {
				...options,
				headers
			})

			if(res.status === 401){
				navigate("/")
				return
			}
		}
		return res;
	}

	const apiAuth = async (url, payload = {}) => {
		const headers = {
			"Content-Type": 'application/json',
		}

		let res = await fetch(url, {
			headers,
			method: "POST",
			body: payload,
		})

		if (res.ok){
			const data = await res.json()
			if(data.url){

				window.location.href = data.url
			}else{
				setAccessToken(data.token)
			}
		}
		return res
	}

	const apiUnAuth = async (url) => {
		try {
			await apiFetch( url, { //change port later!!!!!
				method: "POST",
				credentials: "include"
			})
			setAccessToken(null)
		} catch(err) {
			console.error(err)
			alert("Something went wrong.")
		}
	}
	return { apiFetch, apiUnAuth , apiAuth}
}
