import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import Register from "../components/Register.jsx";
import Login  from "../components/Login.jsx";


function LandingPage() {
  return (
  <div className="flex flex-col items-center gap-3 p-4">
    <h1 className="text-pastel_red text-xl font-bold">Welcome to StackedStocks!</h1>
    <Login></Login>
    <Register></Register>
    <p className="">Trade stocks with real time stock graphs and don't loose real money!</p>
    <Link className="mt-4 p-2 border rounded underline hover:bg-black hover:text-white hover:no-underline" to="/trade">Start Trading!</Link>
  </div>
  )
}

export default LandingPage
