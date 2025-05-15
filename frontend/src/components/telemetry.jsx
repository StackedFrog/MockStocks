import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';


function Telemetry() {

	const { apiFetch} = useApi()

	const [ready, setReady] = useState(false)

	let fetchDashCookie= async () => {
		console.log("----aaaa----")
		let res = await apiFetch("/auth/admin/grafana", {method: "GET"})
	}

	useEffect(() => {
		async function firstFetch(){
			await fetchDashCookie()
			setReady(true)
		}
		firstFetch()
		const interval = setInterval(fetchDashCookie, 60000);
		return () => clearInterval(interval)
        }, []);


return (<div>
{ ready ? <iframe

	src="/auth/grafana/public-dashboards/b8ea8cc1326b468e9484d70488ec9ddf"
			width="100%"
		height="1200"
		frameBorder="0">
	</iframe>
	: <span> Leading </ span>}

	</div>)
}



export default Telemetry
