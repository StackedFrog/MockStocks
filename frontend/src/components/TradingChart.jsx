import { CandlestickSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const TradingChart = (props) => {
    const {
        data, 
        colors: {
            backgroundColor = 'rgb(15,15,15)',
            lineColor = '#2962FF',
            textColor = 'white',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        // Initialize the chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        });
        chart.timeScale().fitContent();

        // Add a Candlestick series
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#4fff44', // Color for up candles (bullish)
            borderUpColor: '#4fff44',
            wickUpColor: '#4fff44',
            downColor: '#ff4976', // Color for down candles (bearish)
            borderDownColor: '#ff4976',
            wickDownColor: '#ff4976',
        });

        // Set the data for the candlestick chart
        candlestickSeries.setData(data);

        // Resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, textColor, lineColor, areaTopColor, areaBottomColor]);

    return <div ref={chartContainerRef} />;
};
