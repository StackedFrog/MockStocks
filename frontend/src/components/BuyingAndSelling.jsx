
function OngoingTrade() {
  // mock function to buy and sell
  const buy = () => {}
  const sell = () => {}

  return (
      <div className="flex justify-center gap-4 mt-5">

        <button
          type="button"
          onClick={buy}
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-600 text-white font-bold py-2 px-4 m-2 rounded"
        >
          Buy
        </button>
        <button
          type="button"
          onClick={sell}
          className="bg-red-500 hover:bg-red-700 active:bg-red-600 text-white font-bold py-2 px-4 m-2 rounded"
        >
          Sell
        </button>
      </div>
  )
}

export default OngoingTrade
