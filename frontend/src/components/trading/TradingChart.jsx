import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.jsx';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';



export const TradingChart = ({ symbol, colors }) => {
  const { apiFetch } = useApi();
  const [stockName, setStockName] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await apiFetch(
          `/api/stocks_api/range?symbol=${encodeURIComponent(searchParams.get('symbol'))}&range=10h&interval=10m`
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
        console.log(formatted)
        setStockData(formatted)
      } catch (err) {
        console.error(`Fetch error in TradingChart component: ${err}`)
      }
    }

    // fetches trading data every 300ms
    const fetchLoop = setInterval(() => {
      fetchTrades()
    }, 1000);

    // cleanUp fetchLoop on unmount
    return () => clearInterval(fetchLoop)
  }, [])

  return <TradingviewApiChart data={stockData} colors={colors} />;
};


const TradingviewApiChart = ({ data, colors = {} }) => {
  const {
    backgroundColor = 'rgb(15,15,15)',
    textColor         = 'white',
  } = colors;

  const chartContainerRef = useRef(null);

  useEffect(() => {
    // 1. Create chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },  // docs: use createChart to set background :contentReference[oaicite:0]{index=0}
        textColor,
      },
      width:  chartContainerRef.current.clientWidth,
      height: 300,
    });

    // 2. Add candlestick series via addSeries(CandlestickSeries, …)
    const series = chart.addSeries(CandlestickSeries, {
      upColor:        '#4fff44',
      borderUpColor:  '#4fff44',
      wickUpColor:    '#4fff44',
      downColor:      '#ff4976',
      borderDownColor:'#ff4976',
      wickDownColor:  '#ff4976',
    });  // per v4+ API use addSeries(CandlestickSeries, options) :contentReference[oaicite:1]{index=1}

    series.setData(data);
    chart.timeScale().fitContent();

    // 3. Make chart responsive
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, textColor]);

  return <div ref={chartContainerRef} />;
};

