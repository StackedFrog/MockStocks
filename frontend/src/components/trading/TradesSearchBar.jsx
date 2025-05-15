export default function TradesSearchBar() {

  return (
    <div className="flex justify-center items-center flex-col p-4 text-white">
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
  )
}
