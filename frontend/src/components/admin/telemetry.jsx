import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';

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
	src="/auth/grafana/d/gateway-metrics/telemetry?kiosk"
			width="100%"
		height="1200"
		frameBorder="0">
	</iframe>
	: <span> Leading </ span>}

	</div>)
}



export default Telemetry
