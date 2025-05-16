import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,Title, Tooltip, Filler } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

function StockCard({ symbol }) {
        const { apiFetch } = useApi();
        const [chartData, setChartData] = useState(null);
        const [stockInfo, setStockInfo] = useState(null);

        let navigate = useNavigate(); 
        const routeChange = () => {
                let path = `/trade?symbol=${symbol}`; 
                navigate(path);
        }

        useEffect(() => {
                const fetchStockData = async () => {
                        try {
                                const response = await apiFetch(
                                        `/api/stocks_api/range?symbol=${symbol}&range=2d&interval=1h`
                                );
                                const stockData = await response.json();
                                const info = { 
                                        increase: stockData.quotes[stockData.quotes.length - 1].close  - stockData.quotes[0].close,
                                        percentage: (stockData.quotes[stockData.quotes.length - 1].close  - stockData.quotes[0].close) / stockData.quotes[0].close * 100,
                                        current: stockData.quotes[stockData.quotes.length - 1].close
                                }
                                setStockInfo(info);
                                const labels = stockData.quotes.map((entry) => new Date(entry.timestamp * 1000).toLocaleString());
                                let colour = {};
                                if (info.increase > 0) {
                                        colour.border = "#4d7d2d";
                                        colour.backgroundStrong = "rgba(77, 125, 45, 0.7)";
                                        colour.backgroundWeak = "rgba(77, 125, 45, 0.2)";
                                } else {
                                        colour.border = "#691919";
                                        colour.backgroundStrong = "rgba(105, 25, 25, 0.7)";
                                        colour.backgroundWeak = "rgba(105, 25, 25, 0.2)";
                                }
                                const data = {
                                        labels,
                                        datasets: [
                                                {
                                                        fill: true,
                                                        label: symbol,
                                                        data: stockData.quotes.map((entry) => entry.close),
                                                        borderColor: colour.border,
                                                        backgroundColor: (context) => {
                                                                const { ctx, chartArea } = context.chart;
                                                                if (!chartArea) return null;
                                                                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                                                                gradient.addColorStop(0, colour.backgroundStrong);
                                                                gradient.addColorStop(1, colour.backgroundWeak);
                                                                return gradient;
                                                        },
                                                },
                                        ],
                                };
                                setChartData(data);
                        } catch (error) {
                                console.error("Could not fetch stock data.", error);
                        }
                };

                fetchStockData();
        }, [symbol]);

        const options = {
                responsive: true,
                scales: {
                        x: {
                                display: false,
                        },
                        y: {
                                display: false,
                        },
                },
        };

        return (
                <div 
                onClick={routeChange}
                className={"border border-black px-3 py-2 rounded outline-none focus:ring-0 flex flex-col items-center bg-primary rounded-lg cursor-pointer"}
                >
                <span className="font-heading text-secondary">{symbol}</span>
                { stockInfo ? (<span className="text-secondary">{stockInfo.current.toFixed(2)} USD</span>) : ( <span></span> )}
                <div className="flex items-center w-full">
                { stockInfo ? (<span className={`${stockInfo.increase >= 0 ? "text-stock-positive" : "text-stock-negative"} flex-1 text-end pr-1`}>{stockInfo.increase >= 0 ? "+" : ""}{stockInfo.increase.toFixed(2)}</span>) : ( <span></span> )}
                <span className="px-1 text-secondary">|</span>
                { stockInfo ? (<span className={`${stockInfo.percentage >= 0 ? "text-stock-positive" : "text-stock-negative"} flex-1 text-start pl-1`}>{stockInfo.increase >= 0 ? "+" : ""}{stockInfo.percentage.toFixed(2)}%</span>) : ( <span></span> )}
                </div>
                { chartData ? ( <Line options={options} data={chartData} /> ) : ( <p></p> )}
                </div>
        );
}

export default StockCard;

