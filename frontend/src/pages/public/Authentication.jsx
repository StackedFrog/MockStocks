import React, { useState } from 'react';
import RegisterForm from "../../components/auth/RegisterForm.jsx";
import LoginForm from "../../components/auth/LoginForm.jsx";
import Button from '../../components/ui/Button.jsx';

function Authentication() {
	const [login, setLogin] = useState(true);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-text font-text">
			{login ? <LoginForm setLogin={setLogin} /> : <RegisterForm setLogin={setLogin} />}
			<Button text="Back to Home" to="/" className='sm:w-[40%] max-w-[300px]'></Button>
		</div>
	);
}

export default Authentication;

