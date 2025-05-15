import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TradingChart } from '../components/trading/TradingChart.jsx';
import BuyingAndSelling from '../components/trading/BuyingAndSelling.jsx';
import { useApi } from "./../hooks/useApi.jsx";
import { useSearchParams } from 'react-router-dom';

function TradingPage() {
	// TRADING PAGE LOGIC

	const {apiFetch} = useApi()
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [stockSymbol, setStockSymbol] = useState(null);
	const [stockName, setStockName] = useState(null);
	const [stockData, setStockData] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams()
	useEffect(() => {
		if (!searchTerm) {
			setSearchResults([]);
			return;
		}

		const fetchStocks = async () => {
			try {
				// api endpoint = get stock by name
				const response = await apiFetch(`/api/stocks_api/ticker?symbol=${encodeURIComponent(searchTerm)}`);
				if (!response.ok) throw new Error('Network response was not ok');
				const results = await response.json();
				setSearchResults(results);
			} catch (err) {
				console.error('Fetch error while trying to fetch stock names:', err);
				setSearchResults([]);
			}
		};

		// fetch every 300ms
		const debounceTimeout = setTimeout(fetchStocks, 300);
		return () => clearTimeout(debounceTimeout);
	}, [searchTerm]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSelectStock = async (symbol, name) => {
		setStockSymbol(symbol);
		setStockName(name);
		setSearchResults([]);
		setSearchTerm('');
		setSearchParams({ symbol })
		try {
			// api endpoint = get trading data by symbol with 5h range and 10m interval
			const response = await apiFetch(`/api/stocks_api/range?symbol=${encodeURIComponent(symbol)}&range=12h&interval=15m`);
			if (!response.ok) { throw new Error("Network was not ok.")}
			const data = await response.json()
			const formatedData = data?.quotes.map(elt => ({
				time: elt.timestamp,
				open: elt.open,
				high: elt.high,
				low: elt.low,
				close: elt.close
			}))
			setStockData(formatedData)
		} catch (err) {
			console.error("Fetch error: " + err)
			setStockData([])
		}
	};

	useEffect(() => {
		const symbol = searchParams.get("symbol");
		if (symbol && symbol !== stockSymbol) {

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
	}, [searchParams, stockSymbol]);

	return (

	// TRADING PAGE CONTENT

		<div className="bg-[#141414] min-h-screen p-4">
			<nav className="flex justify-end gap-4 font-bold">
				<Link className="text-white underline hover:no-underline" to="/">
          Home
				</Link>
				<a className="text-white underline hover:no-underline hover:cursor-pointer" onClick={() => {setStockSymbol(null)}}>Search</a>
			</nav>

			{stockSymbol ?
				(
			// STOCK CHART
					<>

          // SEARCH BAR
						<div className="absolute flex justify-center top-4 left-4 items-start flex-col p-4 text-white">
							<h1
								className="relative align-left mb-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white transition-all duration-500 hover:from-pink-500 hover:via-yellow-500 hover:to-blue-500 before:absolute before:inset-0 before:rounded before:content-[''] before:opacity-0 before:filter before:blur-2xl before:bg-gradient-to-r before:from-pink-500 before:via-yellow-500 before:to-blue-500 before:transition-opacity before:duration-500 hover:before:opacity-60"
							>
              Search for a stock
							</h1>

							<input
								type="text"
								placeholder="Apple..."
								value={searchTerm}
								onChange={handleSearchChange}
								className="z-1 w-[90%] p-3 bg-[#1a1a1a] text-white border border-gray-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
								//              className="w-full p-2 bg-[#141414] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>

							{searchResults.length > 0 && (
								<section className="w-full p-2 border border-gray-300 rounded-md mt-2 bg-[#1f1f1f]">
									{searchResults.map((stock) => (
										<button
											key={stock.symbol}
											onClick={() => handleSelectStock(stock.symbol, stock.name)}
											className="w-full block p-2 text-left hover:underline text-white"
										>
											{stock.name} ({stock.symbol})
										</button>
									))}
								</section>
							)}
						</div>

						<h2 className="flex justify-center m-2 text-xl text-white font-bold">{stockName}</h2>
						<TradingChart
							data={stockData}
							symbol={stockSymbol}
							colors={{
								backgroundColor: '#141414',
								textColor:       '#fff',
							}}
						/>
						<BuyingAndSelling />
					</>

				) : (

			// SEARCH BAR
					<div className="flex justify-center items-center flex-col mt-4 p-4 text-white">
						<h1
							className="relative mb-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white transition-all duration-500 hover:from-pink-500 hover:via-yellow-500 hover:to-blue-500 before:absolute before:inset-0 before:rounded before:content-[''] before:opacity-0 before:filter before:blur-2xl before:bg-gradient-to-r before:from-pink-500 before:via-yellow-500 before:to-blue-500 before:transition-opacity before:duration-500 hover:before:opacity-60"
						>
              Search for a stock
						</h1>

						<input
							type="text"
							placeholder="Apple..."
							value={searchTerm}
							onChange={handleSearchChange}
							className="z-1 w-full p-3 bg-[#1a1a1a] text-white border border-gray-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
							//              className="w-full p-2 bg-[#141414] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						{searchResults.length > 0 && (
							<section className="w-full p-2 border border-gray-300 rounded-md mt-2 bg-[#1f1f1f]">
								{searchResults.map((stock) => (
									<button
										key={stock.symbol}
										onClick={() => handleSelectStock(stock.symbol, stock.name)}
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
