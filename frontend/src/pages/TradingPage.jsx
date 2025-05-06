import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { TradingChart } from '../components/TradingChart.jsx'


function TradingPage() {
  const candlestickData = [
    { time: 1628497200000, open: 35200, high: 35700, low: 35000, close: 35600 },
    { time: 1628500800000, open: 35600, high: 36000, low: 35300, close: 35900 },
    { time: 1628504400000, open: 35900, high: 36100, low: 35500, close: 35800 },
    { time: 1628508000000, open: 35800, high: 35950, low: 35350, close: 35500 },
    { time: 1628511600000, open: 35500, high: 35800, low: 35200, close: 35650 },
    { time: 1628515200000, open: 35650, high: 36050, low: 35350, close: 35950 },
    { time: 1628518800000, open: 35950, high: 36200, low: 35600, close: 36000 },
    { time: 1628522400000, open: 36000, high: 36300, low: 35700, close: 36200 },
    { time: 1628526000000, open: 36200, high: 36400, low: 35850, close: 36350 },
    { time: 1628529600000, open: 36350, high: 36700, low: 36200, close: 36550 },
    { time: 1628533200000, open: 36550, high: 36800, low: 36400, close: 36700 },
    { time: 1628536800000, open: 36700, high: 37000, low: 36500, close: 36850 },
    { time: 1628540400000, open: 36850, high: 37100, low: 36650, close: 37000 },
    { time: 1628544000000, open: 37000, high: 37300, low: 36800, close: 37150 },
    { time: 1628547600000, open: 37150, high: 37400, low: 37000, close: 37250 },
    { time: 1628551200000, open: 37250, high: 37500, low: 37050, close: 37400 },
    { time: 1628554800000, open: 37400, high: 37800, low: 37300, close: 37650 },
    { time: 1628558400000, open: 37650, high: 37900, low: 37500, close: 37800 },
    { time: 1628562000000, open: 37800, high: 38000, low: 37700, close: 37950 },
    { time: 1628565600000, open: 37950, high: 38200, low: 37800, close: 38000 },
    { time: 1628569200000, open: 38000, high: 38300, low: 37900, close: 38150 },
  ];

  // mock function to buy and sell
  const buy = () => {}
  const sell = () => {}

  return (
    <div className="bg-[#141414] min-h-screen p-4">

      <nav className="flex justify-end gap-4 font-bold ">
        <Link className="mb-4 text-white underline hover:no-underline" to="/">Home</Link>
      </nav>

      <TradingChart
        data={candlestickData}
        colors={{
          backgroundColor: '#000',
          lineColor: '#00ff00',
          textColor: '#fff',
          areaTopColor: 'rgba(0, 255, 0, 0.4)',
          areaBottomColor: 'rgba(0, 255, 0, 0.1)'
        }}
      />
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
    </div>
  );
}

export default TradingPage
