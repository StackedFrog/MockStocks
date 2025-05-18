import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({ data }) => {
	if (data){
		const closePriceData = useMemo(() => {
			const seen = new Set();
			if (!data) return null;
			return data
				.filter(point => {
					if (seen.has(point.x)) return false;
					seen.add(point.x);
					return true;
				})
				.map(point => ({
					x: point.x,
					y: point.y[3],
				}));
		}, [data]);

		const trendColor = useMemo(() => {
			if (closePriceData.length < 2) return "#00BFFF";
			const first = closePriceData[0].y;
			const last = closePriceData[closePriceData.length - 1].y;
			return last >= first ? "#4d7d2d" : "#691919";
		}, [closePriceData]);

		const chartOptions = useMemo(() => ({
			chart: {
				type: "area",
				height: 400,
				background: "#0b0d0b",
				toolbar: { show: false },
				zoom: { enabled: false }
			},
			dataLabels: { enabled: false },
			xaxis: {
				type: "category",
				labels: { show: false },
				axisTicks: { show: false },
				axisBorder: { show: false }
			},
			yaxis: {
				labels: {
					style: { colors: "#eaecea" },
					formatter: (val) => val.toFixed(2)
				}
			},
			tooltip: {
				theme: "dark",
				x: { format: "HH:mm" }
			},
			stroke: {
				curve: "smooth",
				width: 2
			},
			colors: [trendColor],
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.2,
					stops: [0, 100]
				}
			}
		}), [trendColor]);

		const series = useMemo(() => [{
			name: "Close Price",
			data: closePriceData ?? []
		}], [closePriceData]);
		return (
			<div id="chart">
				{ data ? (
					<>
						<ReactApexChart
							key={closePriceData.length}
							options={chartOptions}
							series={series}
							type="area"
							height={400}
						/>
					</>
				): null }
			</div>
		);

	}

	return <div className="text-font text-primary">Cant fetch data about stock :-(</div>;

};

export default AreaChart;
