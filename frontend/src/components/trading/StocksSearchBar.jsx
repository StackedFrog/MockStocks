import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi.jsx';

export function StocksSearchBar({ onSelect }) {
	const { apiFetch } = useApi();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const divRef = useRef(null);

	// EVENTLISTENER FOR CLICK OUTSIDE DIV
	useEffect(() => {
		// Define the click event handler
		const handleClickOutside = (event) => {
			if (divRef.current && !divRef.current.contains(event.target)) {
				setSearchTerm("")
			}}
		document.addEventListener('click', handleClickOutside);

		// Cleanup the event listener when the component unmounts
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	// FETCH STOCK NAMES
	useEffect(() => {
		if (!searchTerm) {
			setSearchResults([]);
			return;
		}

		const fetchStocks = async () => {
			try {
				const response = await apiFetch(
					`/api/stocks_api/ticker?symbol=${encodeURIComponent(searchTerm)}`
				);
				if (!response.ok) throw new Error('Network response was not ok');
				const results = await response.json();
				setSearchResults(results);
			} catch (err) {
				console.error('Error fetching stock names:', err);
				setSearchResults([]);
			}
		};

		const timeout = setTimeout(fetchStocks, 300);
		return () => clearTimeout(timeout);
	}, [searchTerm]);

	const handleChange = e => setSearchTerm(e.target.value);

	const handleSelect = (symbol, name) => {
		// triggers FETCH STOCK NAMES
		setSearchTerm('');
		setSearchResults([]);
		onSelect(symbol, name);
	};

	return (
		<div ref={divRef} className="flex justify-center items-center flex-col text-white w-full pt-2">
			<input
				type="text"
				placeholder="Search for symbols or companies..."
				value={searchTerm}
				onChange={handleChange}
				className="w-full px-3 py-2 rounded outline-none focus:ring-4 focus:ring-accent bg-text text-gray-700"
			/>
			{searchResults.length > 0 && (
				<section className="z-10 w-full bg-[#1f1f1f] mt-1 border border-gray-700 rounded-md">
					{searchResults.map(stock => (
						<button
							key={stock.symbol}
							onClick={() => handleSelect(stock.symbol, stock.name)}
							onBlur={() => {setSearchTerm("")}}
							className="w-full text-left p-2 hover:bg-gray-600 text-text"
						>
							{stock.name} ({stock.symbol})
						</button>
					))}
				</section>
			)}
		</div>
	);
}

