import { useApi } from "../../hooks/useApi.jsx"
import { useNavigate } from 'react-router-dom'

function LogoutEveryWhere() {
	const navigate = useNavigate()
	const {apiUnAuth} = useApi()

	const onLogout = async () => {
		await apiUnAuth("/auth/user/logout_all")
		navigate("/")
	}

        return (
		<button
			type= "button"
			onClick={onLogout}
			className={`h-15 lg:w-[20vw] px-5 py-3 mx-0 my-2.5 rounded-lg font-heading text-text bg-accent flex items-center justify-center
                hover:bg-primary active:bg-primary hover:cursor-pointer transition-colors duration-200`}
		>
			<span>Log out all devices</span>
		</button>
	)
}

export default LogoutEveryWhere
