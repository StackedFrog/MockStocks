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
  const handleSelectStock = (symbol, name) => {
    setStockSymbol(symbol); 
    setStockName(name);
    setSearchParams({ symbol });
  }

  return (
    <div className="bg-background min-h-screen p-4">
      
      {searchParams?.size === 0 ? (
        
        // DISPLAY ONLY SERACH BAR

        <div className="">
          <h1 className="flex justify-start text-secondary text-3xl font-heading m-3" >Trading Overview</h1>
          <StocksSearchBar onSelect={handleSelectStock} />
        </div>

      ) : (

        // DISPLAY SEARCH BAR AND GRAPH

          <div>
            <div className="z-20 top-1 left-1 w-[50%]">
              <StocksSearchBar onSelect={handleSelectStock} />
            </div>

            <h2 className="text-3xl text-secondary font-heading p-5">
              {stockName}
            </h2>
            <TradingChart
              symbol={stockSymbol}
              colors={{ backgroundColor: '#0b0d0b', textColor: '#eaecea' }}
            />
            <BuyingAndSelling />
          </div>

        )}
    </div>

  );
}

// <nav className="flex justify-end gap-4 font-bold">
//   <Link className="font-heading text-secondary underline hover:no-underline" to="/">
//     Home
//   </Link>
//   <button
//     className="underline hover:no-underline hover:cursor-pointer"
//     onClick={() => setSearchParams()}
//   >
//     Search
//   </button>
// </nav>


export default TradingPage;
