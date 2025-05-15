import { useApi } from "./../api_wrapper.jsx";
import React, { useEffect, useState } from 'react';

export default function RecentTrades() {
  const {apiFetch} = useApi()
  const [holdings, setHoldings] = useState([])

  const mockData = [
    {type: "buy", profitLoss: 2000, name: "Bitcoin"},
    {type: "sell", profitLoss: -2000, name: "Bitcoin"},
    {type: "buy", profitLoss: -2000, name: "Apple"},
    {type: "buy", profitLoss: 3000, name: "Bitcoin"},
    {type: "sell", profitLoss: 3000, name: "Ada"},
  ]

  const fetchHoldings = async () => {
    try {
      const response = await apiFetch(`/api/user/info`);
      if (!response.ok) throw new Error('Network response was not ok');
      const results = await response.json();
      setHoldings(results)
    } catch (err) {
      console.error('Fetch error while trying to fetch stock names:', err);
      setHoldings([])
    }
  };

  return (
  <div className="text-text bg-background">
      <h1>Your recent trades...</h1>
      {
        mockData.map(trade => (
        <div className="w-[50%] flex flex-cols gap-10 p-3 m-3 bg-primary border rounded border-background hover:border-secondary transition duration-200"
            onClick={() => {fetchStocks()}}
          >

          <div className="flex items-center justify-center h-6 w-6">
            {
              trade.type === "buy" ?
                (
                  <img className="h-4 w-4 object-contain" src="/recent-trades/arrow_up.png" alt="arrow_up"/>
                )
              : 
                (
                  <img className="h-4 w-4 object-contain" src="/recent-trades/arrow_down.png" alt="arrow_down"/>
                )
            }
          </div>

          <h3>{trade.name}</h3>
            {
              trade.profitLoss >= 0 ?
              (
                <h3 className="text-green-600">+{trade.profitLoss}</h3>
              )
              :
              (
                <h3 className="text-red-500">-{Math.abs(trade.profitLoss)}</h3>
              )
            }



        </div>
        ))
      }
    
  </div>
  )
}
