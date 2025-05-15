import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

function AdminPage() {
  return (
  <div className="flex flex-col items-center gap-3 p-4">
    <h1 className="text-xl font-bold">Admin Panel!</h1>
    <iframe
					// src="http://localhost:3000/d-solo/opentelemetry-apm/opentelemetry-apm?orgId=1&var-app=otelcol-contrib&var-route=$__all&refresh=30s&panelId=2&__feature.dashboardSceneSolo"
		src="http://localhost:3000/public-dashboards/65cfae64beaf4f188b753c56c0a15753"
		width="100%"
		height="800"
		frameBorder="0">
	</iframe>
    <p className="">Trade stocks with real time stock graphs and don't loose real money!</p>
    <Link className="mt-4 p-2 border rounded underline hover:bg-black hover:text-white hover:no-underline" to="/trade">Start Trading!</Link>
  </div>
  )
}

export default AdminPage
