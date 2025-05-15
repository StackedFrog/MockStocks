import React, { useState } from 'react';
import Button from '../../components/ui/Button.jsx';


function Landing() {
	// const [login, setLogin] = useState(true);

	return (
	// <div className="flex flex-col items-center gap-3 p-4">
	// 	<h1 className="text-pastel_red text-xl font-bold">Welcome to StackedStocks!</h1>
	// 	<p className="">Trade stocks with real time stock graphs and don't loose real money!</p>
	// 	<Link className="mt-4 p-2 border rounded underline hover:bg-black hover:text-white hover:no-underline" to="/trade">Start Trading!</Link>
	// 	{/* {login ? <Login setLogin={setLogin}/> : <Register setLogin={setLogin}/>} */}
	// </div>

		<div className='min-h-screen bg-background flex flex-col items-center gap-5 py-10 lg:py-20'>
			<div className='py-0 lg:py-17 w-[70%] px-0 lg:px-[7vw]'>
				<p className='font-text text-text text-2xl lg:text-4xl'>Welcome to</p>
				<h1 className='font-heading text-primary text-5xl sm:text-7xl lg:text-9xl'>MOCK</h1>
				<h1 className='font-heading text-secondary text-5xl sm:text-7xl lg:text-9xl text-right'>STOCKS</h1>
			</div>
			<div className='w-[90%] lg:w-full max-w-3/4 flex lg:flex flex-col lg:flex-row lg:justify-between p-0 lg:px-20'>
				<div className='bg-primary w-full lg:w-3/5 rounded-2xl p-5'>
					<p className='font-text text-background p-3 text-justify'>
						<span className='font-heading'>MOCK STOCKS</span> is a hands-on platform where you can practice trading stocks 
                                                with real-time market data — no real money involved. It’s built to help you learn how the stock market works, 
                                                experiment with strategies, and get comfortable before jumping into actual trading. 
                                                Whether you’re new or just want to sharpen your skills, our website makes it simple and risk-free.
					</p>
				</div>
				<div className='flex flex-col justify-center w-full lg:w-1/3 pt-2.5 lg:pt-0'>
					<Button text="Start Trading" to="/login" className='sm:w-full'></Button>
					<Button text="About Us" to="/about"></Button>
				</div>
			</div>
		</div>
	)
}

export default Landing;