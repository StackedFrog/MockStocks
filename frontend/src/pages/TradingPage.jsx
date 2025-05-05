import React, { useEffect, useState } from 'react';
import { TradingChart } from '../components/TradingChart.jsx'


function TradingPage() {
  const [trades, setTrades] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY

  //DISPLAYING DATA INTO CHART IS STILL BUGY
  const fetchFinnhubData = async () => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
    });

    // Listen for messages
  socket.addEventListener('message', (event) => {
    try {
      const response = JSON.parse(event.data);
      setTrades(prevTrades => [
        ...prevTrades,
        ...response.data.map(candle => ({ time: Date.now() / 1000, value: candle.p }))
      ]);
      console.log("Parsed data:", response.data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  });

    // cleanup WebSocket
    return () => {
      socket.send(JSON.stringify({ type: 'unsubscribe', symbol: 'AAPL' }));
      socket.close();
    }
  }
  useEffect(()=>{fetchFinnhubData()}, [])

return (
  <div className="bg-[#141414] min-h-screen p-4">
    <TradingChart data={trades} />
  </div>
);
}

export default TradingPage
