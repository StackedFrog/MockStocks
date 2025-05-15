import { useApi } from "./../api_wrapper.jsx";

function OngoingTrade() {
  const {apiFetch} = useApi()
  
  const buy = () => {}
  const sell = () => {}

  async function sellStock(symbol, amount) {
    const response = await apiFetch('/api/sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol, balance: amount }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Sale failed: ${err}`);
    }
    console.log('Sale successful');
  }

  async function purchaseStock(symbol, amount) {
    const response = await apiFetch('/api/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // assume auth header is injected elsewhere
      },
      body: JSON.stringify({ symbol, balance: amount }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Purchase failed: ${err}`);
    }
    console.log('Purchase successful');
  }

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
