import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi.jsx";
import ReactApexChart from "react-apexcharts";


const Chart = () => {
  const { apiFetch } = useApi();
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
	const response = await apiFetch(
        `/api/stocks_api/range?symbol=${encodeURIComponent(searchParams.get("symbol"))}&range=12h&interval=15m`
      )
      if (!response.ok) throw new Error("Response is not ok: " + response.statusText)


      const data = await response.json()
return data.quotes.map(q => ({
        x: new Date(q.timestamp * 1000).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year:"numeric",  hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "").toString(),
        y: [q.open, q.high, q.low, q.close]
      }));
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

        return <CandleChart data={stockData} />;
};

const CandleChart = ({ data }) => {
        const [zoomRange, setZoomRange] = useState(null);
const chartOptions = useMemo(() => ({
  chart: {
    type: "candlestick",
    height: 400,
    background: "#0b0d0b",
    toolbar: { show: false },
    events: {
      zoomed: (chartContext, { xaxis }) => {
        setZoomRange({ min: xaxis.min, max: xaxis.max });
      },
      scrolled: (chartContext, { xaxis }) => {
        setZoomRange({ min: xaxis.min, max: xaxis.max });
      }
    }
  },
  xaxis: {
    type: "category",
    min: zoomRange?.min,
    max: zoomRange?.max,
    labels: {
      style: { colors: "#eaecea" },
      formatter: (text) => text ? text.split(" ")[1] : ""
    },
  },
  yaxis: {
    tooltip: { enabled: true },
    labels: {
      style: { colors: "#eaecea" },
      formatter: (val) => val.toFixed(2)
    },
  },
  tooltip: {
    theme: "dark",
    custom: ({ seriesIndex, dataPointIndex, w }) => {
      const dataPoint = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
      return `<div style="padding:5px; color:#eaecea;">
        <div><strong>Open:</strong> ${dataPoint.y[0]}</div>
        <div><strong>High:</strong> ${dataPoint.y[1]}</div>
        <div><strong>Low:</strong> ${dataPoint.y[2]}</div>
        <div><strong>Close:</strong> ${dataPoint.y[3]}</div>
        <div><strong>Date:</strong> ${dataPoint.x}</div>
      </div>`;
    }
  }
}), [zoomRange]);

  const series = [{ data }];

  return (
    <div id="chart">
      <ReactApexChart options={chartOptions} series={series} type="candlestick" height={400} />
    </div>
  );
};

export const TradingChart = ({hideChart}) => {
        if (hideChart) return null;
        return <Chart/>;
};

export default TradingChart;
