import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.jsx';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';



export const TradingChart = ({ symbol, colors }) => {
  const { apiFetch } = useApi();
  const [stockName, setStockName] = useState(null);
  const [stockData, setStockData] = useState([]);
  const stockDataRef = useRef([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const updateTrades = useCallback(async () => {
    const data = await fetchTrades()

    const lastTradeAPI = data.slice(-1)[0]
    const lastTradeData = stockDataRef.current.slice(-1)[0]

    const dataDate = new Date(lastTradeData.time * 1000)
    const dataMinute = dataDate.getMinutes() % 10

    const apiDate = new Date(lastTradeAPI.time * 1000)
    const apiMinute = apiDate.getMinutes() % 10

    // same minute?
    if (dataMinute === apiMinute) {
      // UPDATE the last trade
      const newData = [
        ...stockDataRef.current.slice(0, -1),
        lastTradeAPI
      ]

      setStockData(newData)
      stockDataRef.current = newData
    } else {
      // ADD new Trade
      const newData = [
        ...stockDataRef.current,
        lastTradeAPI
      ]
      setStockData(newData)
      stockDataRef.current = newData
    }

  }, [stockData])

  const fetchTrades = async () => {
    try {
      	console.log("geting data")
	const response = await apiFetch(
        `/api/stocks_api/range?symbol=${encodeURIComponent(searchParams.get('symbol'))}&range=12h&interval=15m`
      )
      if (!response.ok) throw new Error("Response is not ok: " + response.statusText)


      const data = await response.json()
      const formatted = data.quotes.map(q => ({
        time: q.timestamp,
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close
      }))
      return formatted
    } catch (err) {
      console.error(`Fetch error in TradingChart component: ${err}`)
    }
    return
  }


  useEffect(() => {
  // initial fetch
  (async () => {
    const data = await fetchTrades();
    setStockData(data);
    stockDataRef.current = data

  })();

    // fetches trading data every 300ms
    const fetchLoop = setInterval(() => {
      updateTrades()
    }, 10000);

    // cleanUp fetchLoop on unmount
    return () => clearInterval(fetchLoop)
  }, [])

  return <TradingviewApiChart data={stockData} colors={colors} />;
};


const TradingviewApiChart = ({ data, colors = {} }) => {
  const {
    backgroundColor = 'rgb(15,15,15)',
    textColor       = 'white',
  } = colors;

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    // 1. Create chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    // 2. Add candlestick series
    const series = chart.addSeries(CandlestickSeries, {
      upColor:         '#4fff44',
      borderUpColor:   '#4fff44',
      wickUpColor:     '#4fff44',
      downColor:       '#ff4976',
      borderDownColor: '#ff4976',
      wickDownColor:   '#ff4976',
    });

    // 3. Save refs
    chartRef.current = chart;
    seriesRef.current = series;

    // 4. Initial fitContent once
    chart.timeScale().fitContent();

    // 5. Resize handler
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    // 6. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [backgroundColor, textColor]);

  // Update only series data — does not affect chart scroll/center
  useEffect(() => {
    if (seriesRef.current && data?.length) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
};
