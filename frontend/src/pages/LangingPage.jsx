import React from 'react';
import { Link } from "react-router-dom";

function LandingPage() {
  return (
  <div className="flex flex-col items-center gap-3 p-4">
    <h1 className="text-xl font-bold">Welcome to StackedStocks!</h1>
    <p className="">This app is a stock trading simulator using real time stock graphs and allowing you to trade without of loosing real money.</p>
    <Link className="mt-4 p-2 border rounded underline hover:bg-black hover:text-white hover:no-underline" to="/trade">Start Trading!</Link>
  </div>
  )
}

export default LandingPage
