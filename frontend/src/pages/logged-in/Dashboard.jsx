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

                <div className="px-4 py-6 bg-background">
                <h1 className="font-heading text-secondary text-3xl my-6">Your Holdings</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {userHoldings && userHoldings.map((holding) => (
                        <div key={holding.symbol + holding.user_id} className="col-span-1">
                        <StockCard symbol={holding.symbol} />
                        </div>
                ))}
                </div>

                <h1 className="font-heading text-secondary text-3xl my-6 mt-12">Trending Stocks</h1>
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
