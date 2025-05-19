import ReactApexChart from "react-apexcharts";
import React, { useState, useMemo } from "react";

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
				formatter: (text) => text ? text.split(" ")[1] + "  " : ""
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

export default CandleChart;
