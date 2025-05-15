import { useApi } from "../../hooks/useApi.jsx";

function OAuthButton(){

	const { apiAuth} = useApi()
	const onRedirect = async () => {
		try {
			const res = await apiAuth("/auth/google")
			// if (res.ok){
			// 	const data = await res.json()
			// 	window.location.href = data.url
			// }
		} catch(err) {
			console.error(err)
			alert("Something went wrong.")
		}
	}


        return <button
          onClick={onRedirect}
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-600 text-white font-bold py-2 px-4 m-2 rounded"
        >
      	Login with Google
	</button>
}

export default OAuthButton
