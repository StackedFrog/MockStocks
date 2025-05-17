import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import StockCard from "../../components/trading/StockCard.jsx";
import HoldingsTable from "../../components/trading/HoldingsTable.jsx"

function DashboardPage () {
        const {apiFetch} = useApi();
        const [trendingData, setTrendingData] = useState(null);
        const [userHoldings, setUserHoldings] = useState(null);

        useEffect(() => {
                const fetchTrending = async () => {
                        try {
                                const response = await apiFetch("/api/stocks_api/trending");
                                const data = await response.json();
                                setTrendingData(data.slice(0, 12));
                        } catch (error){
                                console.error("Could not fetch trending stocks.", error);
                        }
                }

                const fetchHoldings = async () => {
                        const response = await apiFetch("/api/user/holdings");
                        const data = await response.json();
                        const processedData = data.map(({ holding, performance, value }) => ({
                                symbol: holding.symbol,
                                quantity: parseFloat(holding.quantity).toFixed(5),
                                updated: new Date(holding.last_updated).toLocaleString('en-GB', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',', ''),
                                performance: (parseFloat(performance) >= 0 ? "+" : "") + parseFloat(performance).toFixed(5) + "%",
                                value: parseFloat(value).toFixed(2) + " USD",
                        }));
                        setUserHoldings(processedData);
                }
                fetchTrending();
                fetchHoldings();
        }, [])

        return (

                <div className="px-4 py-6 bg-background">
                <h2 className="font-heading text-secondary text-3xl mb-6">Your Holdings</h2>
                <HoldingsTable data={userHoldings}/>

                <h2 className="font-heading text-secondary text-3xl my-6 mt-12">Trending Stocks</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {trendingData && trendingData.map((stock) => (
                        <div key={stock} className="col-span-1">
                        <StockCard symbol={stock} />
                        </div>
                ))}
                </div>
                </div>

        );
}

export default DashboardPage;
