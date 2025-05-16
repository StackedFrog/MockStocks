import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TradingChart } from '../../components/trading/TradingChart.jsx';
import BuyingAndSelling from '../../components/trading/BuyingAndSelling.jsx';
import { StocksSearchBar } from '../../components/trading/StocksSearchBar.jsx';
import { useApi } from '../../hooks/useApi.jsx';

function TradingPage() {
  const { apiFetch } = useApi();
  const [stockSymbol, setStockSymbol] = useState(null);
  const [stockName, setStockName] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // FETCH STOCK DATA
  const handleSelectStock = async (symbol, name) => {
    setStockSymbol(symbol);
    setStockName(name);
    setSearchParams({ symbol });

    try {
      const response = await apiFetch(
        `/api/stocks_api/range?symbol=${encodeURIComponent(symbol)}&range=12h&interval=15m`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const formatted = data.quotes.map(q => ({
        time: q.timestamp,
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close
      }));
      setStockData(formatted);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setStockData([]);
    }
  };

  // Load from URL param
  useEffect(() => {
    const fetchStocks = () => {
      const symbolParam = searchParams.get('symbol');
      if (symbolParam && symbolParam !== stockSymbol) {
        (async () => {
          try {
            const res = await apiFetch(
              `/api/stocks_api/ticker?symbol=${encodeURIComponent(symbolParam)}`
            );
            if (!res.ok) throw new Error('Stock not found');
            const results = await res.json();
            // check if stock symbol is valid
            const stock = results.find(s => s.symbol === symbolParam);
            if (stock) handleSelectStock(stock.symbol, stock.name);
          } catch (err) {
            console.error('Error loading stock from URL:', err);
          }
        })();
      }
    }
    const debounceTimeout = setTimeout(fetchStocks, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchParams, stockSymbol]);

  return (
    <div className="bg-[#141414] min-h-screen p-4">

    // NAV
    <nav className="flex justify-end gap-4 font-bold">
    <Link className="text-text underline hover:no-underline" to="/">
    Home
    </Link>
    <button
    className="text-text underline hover:no-underline hover:cursor-pointer"
    onClick={() => setSearchParams()}
    >
    Search
    </button>
    </nav>

    {searchParams?.size === 0 ? (

      <div className="">
        <h1 className="flex justify-center text-text text-6xl font-bold m-3" >Search for a stock</h1>
        <StocksSearchBar onSelect={handleSelectStock} />
      </div>

    ) : (

      <div>
        <div className="z-20 absolute top-1 left-1 w-[50%]">
          <StocksSearchBar onSelect={handleSelectStock} />
        </div>
          <h2 className="text-center text-xl text-white font-bold mt-20">
          {stockName}
        </h2>
        <TradingChart
          data={stockData}
          symbol={stockSymbol}
          colors={{ backgroundColor: '#141414', textColor: '#fff' }}
        />
        <BuyingAndSelling />
      </div>

    )}
    </div>

  );
}

export default TradingPage;
