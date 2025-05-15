import React, { useState, useEffect } from 'react';
import { useApi } from '../api_wrapper.jsx';

export function StocksSearchBar({ onSelect, initialSymbol }) {
  const { apiFetch } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
    setSearchTerm('');
    setSearchResults([]);
    onSelect(symbol, name);
  };

  return (
    <div className="flex justify-center items-center flex-col mt-4 p-4 text-white"
        onBlur={() => {console.log("Heolo")}}
    >
      <input
        type="text"
        placeholder="Apple..."
        value={searchTerm}
        onChange={handleChange}
        className="z-1 w-full p-3 bg-[#1a1a1a] text-white border border-gray-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
      />
      {searchResults.length > 0 && (
        <section className="z-10 w-full bg-[#1f1f1f] mt-1 border border-gray-700 rounded-md">
          {searchResults.map(stock => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol, stock.name)}
              className="w-full text-left p-2 hover:bg-gray-600 text-white"
            >
              {stock.name} ({stock.symbol})
            </button>
          ))}
        </section>
      )}
    </div>
  );
}

