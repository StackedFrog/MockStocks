import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import Register from "../components/Register.jsx";
import Login  from "../components/Login.jsx";
import SideNav from '../components/SideNav.jsx';


function LandingPage() {
  return (
  <div className="grid grid-cols-14 grid-rows-10 gap-8 w-full">
    <SideNav></SideNav>
    <h1 className="col-start-1 col-end-15 row-start-1 row-end-2 text-pastel_red text-xl font-bold">Welcome to StackedStocks!</h1>
    <div className="flex justify-center">
      <Login className = "flex col-start-3 col-end-6 row-start-4 row-end-8"></Login>
      <Register className = "flex col-start-9 col-end-12 row-start-4 row-end-8"></Register>
    </div>
    <p className="col-start-3 col-end-8 row-start-10 row-end-11">Trade stocks with real time stock graphs and don't loose real money!</p>
    <Link className="col-start-12 col-end-14 row-start-10 row-end-11 mt-4 p-2 border rounded underline hover:bg-black hover:text-white hover:no-underline" to="/trade">Start Trading!</Link>
  </div>
  )
}

export default LandingPage

