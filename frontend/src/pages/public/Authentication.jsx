import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Register from "../../components/auth/Register.jsx";
import Login  from "../../components/auth/Login.jsx";
import Button from '../../components/ui/Button.jsx';


function Authentication() {
	const [login, setLogin] = useState(true);



	return (
		<div>
		 {login ? <Login setLogin={setLogin}/> : <Register setLogin={setLogin}/>}
		</div>
	)
}

export default Authentication;
