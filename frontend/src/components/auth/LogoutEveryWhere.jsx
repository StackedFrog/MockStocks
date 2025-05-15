import { useApi } from "../../api_wrapper.jsx"
import { useNavigate } from 'react-router-dom'


function LogoutButtonEveryWhere(){

	const navigate = useNavigate()
	const {apiUnAuth} = useApi()

	const onLogout = async () => {
		await apiUnAuth("/auth/user/logout_all")
		navigate("/")
	}

        return <button
          onClick={onLogout}
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-600 text-white font-bold py-2 px-4 m-2 rounded"
        >
          Logout of all Devices
	</button>
}

export default LogoutButtonEveryWhere
