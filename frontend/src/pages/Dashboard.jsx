import React, { useEffect, useState } from "react";
import { useApi } from "../api_wrapper.jsx";
import StockCard from "../components/StockCard.jsx";

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
                        if (data.length < 1){ // to be removed :-)
                                setUserHoldings([
                                        {
                                                "user_id": "2b1a027e-e047-4fd2-a438-08f786e229b8",
                                                "symbol": "AAPL",
                                                "quantity": "0.2057164613826031792680556118",
                                                "last_updated": "2025-05-13T13:32:44.751754Z"
                                        },
                                        {
                                                "user_id": "2b1a027e-e047-4fd2-a438-08f786e229b8",
                                                "symbol": "MSFT",
                                                "quantity": "0.0043625383157004248818095491",
                                                "last_updated": "2025-05-13T13:34:21.257960Z"
                                        },
                                        {
                                                "user_id": "2b1a027e-e047-4fd2-a438-08f786e229b8",
                                                "symbol": "GOOG",
                                                "quantity": "15.164919014933582157465672891",
                                                "last_updated": "2025-05-13T13:41:56.110685Z"
                                        },
                                        {
                                                "user_id": "2b1a027e-e047-4fd2-a438-08f786e229b8",
                                                "symbol": "AMZN",
                                                "quantity": "5.6183719000819214019632024083",
                                                "last_updated": "2025-05-13T13:42:50.411527Z"
                                        },
                                        {
                                                "user_id": "2b1a027e-e047-4fd2-a438-08f786e229b8",
                                                "symbol": "META",
                                                "quantity": "0.0000392128730043053045414790",
                                                "last_updated": "2025-05-13T13:46:39.469774Z"
                                        }
                                ])
                        }
                        // setUserHoldings(data);
                }
                fetchTrending();
                fetchHoldings();
        }, [])

        return (
                <div className="grid grid-cols-14 auto-rows-auto">
                <div className="col-span-2"></div>
                <h1 className="row-start-3 col-start-3 col-span-12">Your Holdings</h1>
                {userHoldings &&
                        userHoldings.map((holding, index) => {
                                const colStart = 4 + (index % 5) * 2;
                                const rowStart = 4 + Math.floor(index / 5);
                                return (
                                        <div
                                        key={holding.symbol + holding.user_id}
                                        style={{ gridColumnStart: colStart, gridRowStart: rowStart }}
                                        className="col-span-2"
                                        >
                                        <StockCard symbol={holding.symbol} share={holding.quantity} />
                                        </div>
                                );
                        })}
                <h1 className="row-start-6 col-start-3 col-span-12">Trending Stocks</h1>

                {trendingData &&
                        trendingData.map((stock, i) => {
                                const index = i;
                                const colStart = 4 + (index % 5) * 2;
                                const rowStart = 7 + Math.floor(index / 5);
                                return (
                                        <div
                                        key={stock}
                                        style={{ gridColumnStart: colStart, gridRowStart: rowStart }}
                                        className="col-span-2"
                                        >
                                        <StockCard symbol={stock} share={0} />
                                        </div>
                                );
                        })}
                </div>
        );
}

export default DashboardPage;
