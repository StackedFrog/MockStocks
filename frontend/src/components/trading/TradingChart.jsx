import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

const CandleChart = ({ data, colors = {} }) => {
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

export const TradingChart = ({ data, symbol, colors, hideChart}) => {
        if (hideChart.hideChart) return null;
        return <CandleChart data={data} colors={colors} />;
};

export default TradingChart;
