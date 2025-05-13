import { useApi } from "./../api_wrapper.jsx"

function ChangePwd(){

	const { apiFetch } = useApi()

  	const [old_pwd, setOldPassword] = useState("")
  	const [new_pwd, setNewPassword] = useState("")
  	const [new_pwd_repeat, setNewPasswordReapeat ] = useState("")

	const handleChange = async (e) => {
	    e.preventDefault()

	    if(new_pwd === new_pwd_repeat){
	    	try {
			await apiFetch("/auth/user/change_pwd", JSON.stringify({ old_pwd, new_pwd }))

		} catch(err) {
		      console.error(err)
		      alert("Something went wrong.")
		    }
		}
	  }


 	return <div className="w-full max-w-sm p-6 border border-black rounded-lg">
        <h1 className="text-xl font-semibold text-center mb-6">Change Password</h1>
        <form id="change-pwd-form" className="space-y-4" onSubmit={handleChange}>
          <input
            type="password"
            placeholder="Old Password"
            onChange={(e)=>{setOldPassword(e.target.value)}}
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
         <input
            type="password"
            placeholder="New Password"
            onChange={(e)=>{setNewPassword(e.target.value)}}
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
 	<input
            type="password"
            placeholder="New Password Repeat"
            onChange={(e)=>{setNewPasswordReapeat(e.target.value)}}
            className="w-full border border-black px-3 py-2 rounded outline-none focus:ring-0"
          />
	<button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
          >
           Change
          </button>
        </form>
      </div>
}


export default ChangePwd
