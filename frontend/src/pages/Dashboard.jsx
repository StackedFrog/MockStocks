import React, { useEffect, useState } from "react";
import { useApi } from "../api_wrapper.jsx";
import StockCard from "../components/StockCard.jsx";

function DashboardPage () {
        const {apiFetch} = useApi();
        const [trendingData, setTrendingData] = useState(null);

        useEffect(() => {
                const fetchTrending = async () => {
                        try {
                                const response = await apiFetch("/api/stocks_api/trending") ;
                                const data = await response.json();
                                setTrendingData(data.slice(0, 10));
                        } catch (error){
                                console.error("Could not fetch trending stocks.", error);
                        }
                }
                fetchTrending();
        }, [])

        return (
                <div>
                {trendingData ? (
                        trendingData.map((stock) => ( <StockCard key={stock} symbol={stock} /> ))
                ) : (
                        <p></p>
                )}
                </div>
        );
}

export default DashboardPage;
