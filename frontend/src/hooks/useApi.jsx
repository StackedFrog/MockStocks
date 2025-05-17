import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from 'react-router-dom'

const apiCall = async (url, options = {}, token) => {

	const headers = {
		...options.headers,
		...({ Authorization: `Bearer ${token}` }),
		"Content-Type": 'application/json',
	}

	let res = await fetch(url, {
		...options,
		headers
	})
	return res
}

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
//
//



export const useApi = () => {

	const {tokenRef, accessToken, refreshAccessToken, setAccessToken} = useAuth()
	const navigate = useNavigate()



	const getToken = async () => {
		let token = tokenRef.current

		if (!token){
			token = await refreshAccessToken()
		}

		return token

	}


	const apiFetch = async (url, options = {}, redirect = true) => {

		let token = await getToken()

		if (!token){
			console.log("could not get token")
			redirect && navigate("/")
			return
		}

		let res = await apiCall(url, options, token)


		if (res.status === 403){
			console.log("missing privilige")
			navigate("/")
			return
		}

		if (res.status === 401){
			console.log("stail token")

			token = await refreshAccessToken()

			if (!token){
				redirect && navigate("/")
				return
			}

			res = await apiCall(url, options, token)

			if(res.status === 401){
				console.log("un auth")
			        redirect && navigate("/")
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
				tokenRef.current = data.token
				setAccessToken(data.token)
			}
		}
		return res
	}

	const apiUnAuth = async (url) => {
		try {
			 await apiFetch( url, {
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
