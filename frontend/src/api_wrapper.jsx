import { useAuth } from "./auth_context.jsx";

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

	const { accessToken, refreshAccessToken} = useAuth()

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

		if (res.status === 401){
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
		}


		return res;
	}



	return { apiFetch }
}
