import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StocksSearchBar } from './StocksSearchBar.jsx';
import { TradingChart } from './TradingChart.jsx';
import Button from '../general/Button.jsx';
import { useApi } from '../../hooks/useApi.jsx';
import SummaryModal from './SummaryModal.jsx';

const TradeForm = ({ userInfo, fetchUserInfo }) => {
	const [selectedStock, setSelectedStock] = useState(null);
	const [amount, setAmount] = useState('');
	const [action, setAction] = useState('buy');
	const [error, setError] = useState();
	const { apiFetch } = useApi();
	const [tradeSummary, setTradeSummary] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const symbol = searchParams.get("symbol");
		if (symbol && (symbol !== selectedStock?.symbol)) {

			const fetchStockInfoAndSelect = async () => {
				try {
					const response = await apiFetch(`/api/stocks_api/ticker?symbol=${encodeURIComponent(symbol)}`);
					if (!response.ok) throw new Error('Stock not found');
					const results = await response.json();

					const stock = results.find(s => s.symbol === symbol);
					if (stock) {
						handleStockSelect(stock.symbol, stock.name);
					}
				} catch (err) {
					console.error('Error fetching stock info from symbol param:', err);
				}
			};

			fetchStockInfoAndSelect();
		}
	}, [searchParams]);

	const handleStockSelect = (symbol, name) => {
		setSelectedStock({ symbol, name });
		setSearchParams({ symbol });
	};

	const handleClear = () => {
		setAmount('');
		setAction('buy');
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		console.log(userInfo);

		if (!selectedStock) return;

		const amountNumber = parseFloat(amount);

		if (isNaN(amountNumber) || amountNumber <= 0) {
			setError('Please enter a valid amount.');
			return;
		}

		if (action === 'buy') {
			if (amountNumber > userInfo.balance) {
				setError(`You don't have enough funds. Available: $${userInfo.balance}`);
				return;
			}
		}

		if (action === 'sell') {
			// fetch holding by symbol and check value
			const response = await apiFetch(`/api/user/holdings/${selectedStock.symbol}`);

			if (response.status === 404) {
				setError(`You don't own any ${selectedStock.name} (${selectedStock.symbol}) stocks to sell.`);
				return;
			}

			const holding = await response.json();
			if (amountNumber > holding.value) {
				setError(`You can't sell more than $${holding.value} of ${selectedStock.name} (${selectedStock.symbol})`);
				return;
			}
		}

		setTradeSummary({
			symbol: selectedStock.symbol,
			name: selectedStock.name,
			action,
			amount: amountNumber
		});

	};

	return (
		<div className='relative min-h-screen w-full'>

			<form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col">
				<label>Symbol
					<StocksSearchBar onSelect={handleStockSelect} />
				</label>
				

				{selectedStock && (
					<div className="mt-4">
						<h2 className="text-xl text-secondary font-heading mb-2">
							{selectedStock.name} ({selectedStock.symbol})
						</h2>
						<TradingChart
							symbol={selectedStock.symbol}
							colors={{ backgroundColor: '#0b0d0b', textColor: '#eaecea' }}
							hideChart={!selectedStock}
						/>
					</div>
				)}

				<div className={`mt-4 grid gap-4 ${!selectedStock ? 'opacity-100 pointer-events-none' : ''}`}>
					<label className='flex flex-col gap-2'>Amount ($)
						<input
							type="number"
							placeholder="0"
							value={amount}
							onChange={(e) => {
								setAmount(e.target.value);
								setError('');
							}}
							className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
							disabled={!selectedStock}
							required
						/>
						{error && (
							<span className="text-red-500 text-sm">{error}</span>
						)}
					</label>
					
					<label className='flex flex-col gap-2'>Action
						<select
							value={action}
							onChange={(e) => setAction(e.target.value)}
							className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
							disabled={!selectedStock}
						>
							<option value="buy">Buy</option>
							<option value="sell">Sell</option>
						</select>
					</label>

					<div className='flex justify-between lg:justify-center lg:gap-10'>
						<Button text='Clear' onClick={handleClear} disabled={!selectedStock} className='w-[45%] disabled:opacity-50'></Button>
						<Button text='Continue' type='submit' disabled={!selectedStock} className='w-[45%] disabled:opacity-50'></Button>
					</div>
				</div>
			</form>

			<SummaryModal
				trade={tradeSummary}
				onConfirm={async () => {

					const endpoint = action === 'buy' ? "/api/user/purchase" : "/api/user/sale";
					const body = {
						symbol: tradeSummary.symbol,
						amount: tradeSummary.amount
					};

					setTradeSummary(null);

					const response = await apiFetch(endpoint, {
						method: "POST",
						body: JSON.stringify(body)
					});

					if (response.ok) {
						fetchUserInfo(); // refresh balance
					} else {
						setError("Something went wrong while processing your trade.");
					}
				}}
				onCancel={() => setTradeSummary(null)}
			/>

		</div>
	);
}

export default TradeForm;
