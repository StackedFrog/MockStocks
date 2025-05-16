import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import StockCard from "../../components/trading/StockCard.jsx";

function DashboardPage () {
	const {apiFetch} = useApi();
	const [trendingData, setTrendingData] = useState(null);
	const [userHoldings, setUserHoldings] = useState(null);

	useEffect(() => {
		const fetchTrending = async () => {
			try {
				const response = await apiFetch("/api/stocks_api/trending");
				const data = await response.json();
				setTrendingData(data.slice(0, 10));
			} catch (error){
				console.error("Could not fetch trending stocks.", error);
			}
		}

		const fetchHoldings = async () => {
			const response = await apiFetch("/api/user/holdings");
			const data = await response.json();
			setUserHoldings(data);
		}
		fetchTrending();
		fetchHoldings();
	}, [])

	return (
		<div className="grid grid-cols-12 auto-rows-auto bg-background gap-4">
			<div className="col-span-2"></div>
			<h1 className="font-heading text-secondary row-start-3 col-start-2 col-span-10 text-3xl my-10">Your Holdings</h1>
			{userHoldings &&
                        userHoldings.map((holding, index) => {
                        	const colStart = 2 + (index % 5) * 2;
                        	const rowStart = 4 + Math.floor(index / 5);
                        	return (
                        		<div
                        			key={holding.symbol + holding.user_id}
                        			style={{ gridColumnStart: colStart, gridRowStart: rowStart }}
                        			className="col-span-2"
                        		>
                        			<StockCard symbol={holding.symbol}/>
                        		</div>
                        	);
                        })}
			<h1 className="font-heading text-secondary row-start-6 col-start-2 col-span-10 text-3xl my-10">Trending Stocks</h1>

			{trendingData &&
                        trendingData.map((stock, i) => {
                        	const index = i;
                        	const colStart = 2 + (index % 5) * 2;
                        	const rowStart = 7 + Math.floor(index / 5);
                        	return (
                        		<div
                        			key={stock}
                        			style={{ gridColumnStart: colStart, gridRowStart: rowStart }}
                        			className="col-span-2"
                        		>
                        			<StockCard symbol={stock}/>
                        		</div>
                        	);
                        })}
		</div>
	);
}

export default DashboardPage;
