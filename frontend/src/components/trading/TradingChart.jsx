import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi.jsx";
import CandleChart from "./CandleChart.jsx";
import AreaChart from "./AreaChart.jsx";
import Button from "../general/Button.jsx";


const Chart = () => {
	const { apiFetch } = useApi();
	const [stockData, setStockData] = useState([]);
	const stockDataRef = useRef([]);
	const [searchParams] = useSearchParams();
	const [chartType, setChartType] = useState("area");

	const symbol = searchParams.get("symbol");

	const updateTrades = useCallback(async (symbol) => {
		const data = await fetchTrades(symbol)

		const lastTradeAPI = data.slice(-1)[0]
		const lastTradeData = stockDataRef.current.slice(-1)[0]

		const dataDate = new Date(lastTradeData.time * 1000)
		const dataMinute = dataDate.getMinutes() % 10

		const apiDate = new Date(lastTradeAPI.time * 1000)
		const apiMinute = apiDate.getMinutes() % 10

		// same minute?
		if (dataMinute === apiMinute) {
			// UPDATE the last trade
			const newData = [
				...stockDataRef.current.slice(0, -1),
				lastTradeAPI
			]

			setStockData(newData)
			stockDataRef.current = newData
		} else {
			// ADD new Trade
			const newData = [
				...stockDataRef.current,
				lastTradeAPI
			]
			setStockData(newData)
			stockDataRef.current = newData
		}

	}, [stockData])

	const fetchTrades = async (symbol) => {
		try {
			const response = await apiFetch(
				`/api/stocks_api/range?symbol=${encodeURIComponent(symbol)}&range=12h&interval=15m`
			)
			if (!response.ok) throw new Error("Response is not ok: " + response.statusText)


			const data = await response.json()
			if (data){
				return data.quotes.map(q => ({
					x: new Date(q.timestamp * 1000).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year:"numeric",  hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "").toString(),
					y: [q.open, q.high, q.low, q.close]
				}));
			}
		} catch (err) {
			console.error(`Fetch error in TradingChart component: ${err}`)
		}
		return
	}

	useEffect(() => {
		if (!symbol) return;
		// initial fetch
		(async () => {
			const data = await fetchTrades(symbol);
			setStockData(data);
			stockDataRef.current = data
		})();

		// fetches trading data every 300ms
		const fetchLoop = setInterval(() => {
			updateTrades(symbol)
		}, 10000);

		// cleanUp fetchLoop on unmount
		return () => clearInterval(fetchLoop)
	}, [searchParams])

	return (

		<div>
			<div className="flex items-center mb-2 gap-4">
				<Button
					text="Area Chart"
					onClick={() => setChartType("area")}
					className="lg:w-auto"
				/>
				<Button
					text="Candlestick"
					onClick={() => setChartType("candle")}
					className="lg:w-auto"                />
			</div>
			{chartType === "area" ? (
				<AreaChart key="area" data={stockData} />
			) : (
				<CandleChart key="candle" data={stockData} />
			)}
		</div>
	);
};

export const TradingChart = ({hideChart}) => {
	if (hideChart) return null;
	return <Chart/>;
};

export default TradingChart;
