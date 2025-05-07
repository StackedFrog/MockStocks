import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TradingChart } from '../components/TradingChart.jsx';
import OngoingTrade from '../components/OngoingTrade.jsx';

function TradingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stockSymbol, setStockSymbol] = useState(null);
  const [stockData, setStockData] = useState([]);


  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const fetchStocks = async () => {
      try {
        const response = await fetch(`http://localhost:4003/ticker?symbol=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const results = await response.json();
        setSearchResults(results);
      } catch (err) {
        console.error('Fetch error:', err);
        //temp 
        setSearchResults([{"symbol":"AP","name":"Ampco-Pittsburgh Corporation","exchange":"NYQ"},{"symbol":"AAPL","name":"Apple Inc.","exchange":"NMS"},{"symbol":"AMAT","name":"Applied Materials, Inc.","exchange":"NMS"},{"symbol":"AAOI","name":"Applied Optoelectronics, Inc.","exchange":"NGM"},{"symbol":"APA","name":"APA Corporation","exchange":"NMS"},{"symbol":"APP","name":"AppLovin Corporation","exchange":"NMS"},{"symbol":"APYX","name":"Apyx Medical Corporation","exchange":"NMS"}]);
        // setSearchResults([]);
      }
    };

    // fetch every 300ms
    const debounceTimeout = setTimeout(fetchStocks, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectStock = async (symbol) => {
    setStockSymbol(symbol);
    setSearchResults([]);
    setSearchTerm('');

    try {
      const endDate = new Date().toISOString();
      const response = await fetch( `http://localhost:4003/history?symbol=${encodeURIComponent(symbol)}&start=2025-01-01T00:00:00Z&end=${encodeURIComponent(endDate)}`);
      if (!response.ok) { throw new Error("Network was not ok.")}
      const data = await response.json()
      setStockData(data)
    
    } catch (err) {
      console.error("Fetch error: " + err)
      setStockData([
        { time: '2022-01-01', open: 100, high: 110, low: 90, close: 105 },
        { time: '2022-01-02', open: 105, high: 115, low: 95, close: 100 }, ])
    }
  };

  return (
    <div className="bg-[#141414] min-h-screen p-4">
      <nav className="flex justify-end gap-4 font-bold">
        <Link className="mb-4 text-white underline hover:no-underline" to="/">
          Home
        </Link>
      </nav>

      {stockSymbol ? (
        // STOCK CHART
        <>
        <TradingChart
          data={stockData}
          symbol={stockSymbol}
          colors={{
            backgroundColor: '#000',
            textColor:       '#fff',
          }}
        />
          <OngoingTrade />
        </>
      ) : (
        // SEARCH BAR
        <div className="flex justify-center items-center flex-col p-4 text-white">
          <h1
            className="relative mb-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white transition-all duration-500 hover:from-pink-500 hover:via-yellow-500 hover:to-blue-500 before:absolute before:inset-0 before:rounded before:content-[''] before:opacity-0 before:filter before:blur-2xl before:bg-gradient-to-r before:from-pink-500 before:via-yellow-500 before:to-blue-500 before:transition-opacity before:duration-500 hover:before:opacity-60"
          >
            Search for a stock
          </h1>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 bg-[#141414] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {searchResults.length > 0 && (
            <section className="w-full p-2 border border-gray-300 rounded-md mt-2 bg-[#1f1f1f]">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock.symbol)}
                  className="w-full block p-2 text-left hover:underline text-white"
                >
                  {stock.name} ({stock.symbol})
                </button>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default TradingPage;
