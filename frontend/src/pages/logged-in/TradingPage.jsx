import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TradingChart } from '../../components/trading/TradingChart.jsx';
import BuyingAndSelling from '../../components/trading/BuyingAndSelling.jsx';
import { StocksSearchBar } from '../../components/trading/StocksSearchBar.jsx';
import { useApi } from '../../hooks/useApi.jsx';

function TradingPage( {hideChart} ) {
  const { apiFetch } = useApi();
  const [stockSymbol, setStockSymbol] = useState(null);
  const [stockName, setStockName] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [lastPrice, setLastPrice] = useState(null)

  // FETCH STOCK DATA
  const handleSelectStock = (symbol, name) => {
    setStockSymbol(symbol); 
    setStockName(name);
    setSearchParams({ symbol });
  }

        useEffect(() => {
		const symbol = searchParams.get("symbol");
		if (symbol && (symbol !== stockSymbol)) {

			const fetchStockInfoAndSelect = async () => {
				try {
					const response = await apiFetch(`/api/stocks_api/ticker?symbol=${encodeURIComponent(symbol)}`);
					if (!response.ok) throw new Error('Stock not found');
					const results = await response.json();

					const stock = results.find(s => s.symbol === symbol);
					if (stock) {
						handleSelectStock(stock.symbol, stock.name);
					}
				} catch (err) {
					console.error('Error fetching stock info from symbol param:', err);
				}
			};

			fetchStockInfoAndSelect();
		}
	}, [searchParams]);


  return (
    <div className="bg-background min-h-screen w-full">
    <h1 className="flex justify-start text-secondary text-3xl font-heading my-4" >Trading Overview</h1>
      
      {searchParams?.size === 0 ? (
        
        // DISPLAY ONLY SERACH BAR

        <div className="flex w-full justify-start">
          <StocksSearchBar onSelect={handleSelectStock} />
        </div>

      ) : (

        // DISPLAY SEARCH BAR AND GRAPH

          <div>
            <div className="w-full">
              <StocksSearchBar onSelect={handleSelectStock} />
            </div>

            <h2 className="text-3xl text-secondary font-heading my-4">
              {stockName}
            </h2>
            <TradingChart
              symbol={stockSymbol}
              colors={{ backgroundColor: '#0b0d0b', textColor: '#eaecea' }}
              hideChart={hideChart}
              onPriceUpdate={setLastPrice}
            />
            <BuyingAndSelling price={lastPrice} symbol={stockSymbol}/>
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
