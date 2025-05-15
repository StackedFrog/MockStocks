import { useApi } from "./../api_wrapper.jsx"
import React from 'react';
import { FaGoogle } from 'react-icons/fa';


function OAuthButton(){

	const { apiAuth} = useApi()
	const onRedirect = async () => {
		try {
			const res = await apiAuth("/auth/google")
		} catch(err) {
			console.error(err)
			alert("Something went wrong.")
		}
	}

//
  return (
    <button
      onClick={onRedirect}
      className="flex items-center justify-center w-full px-4 py-2 mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
    >
      <FaGoogle className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
};


export default OAuthButton
