import { useApi } from '../../hooks/useApi.jsx';

  const { apiFetch } = useApi();

  export const  fetchTrades = async () => {
    try {
      	console.log("geting data")
	const response = await apiFetch(
        `/api/stocks_api/range?symbol=${encodeURIComponent(searchParams.get('symbol'))}&range=12h&interval=15m`
      )
      if (!response.ok) throw new Error("Response is not ok: " + response.statusText)


      const data = await response.json()
      const formatted = data.quotes.map(q => ({
        time: q.timestamp,
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close
      }))
      return formatted
    } catch (err) {
      console.error(`Fetch error in TradingChart component: ${err}`)
    }
    return
  }
