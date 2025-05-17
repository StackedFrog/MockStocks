import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import HoldingsTable from '../../components/trading/HoldingsTable.jsx';

function RecentTrades () {
	const {apiFetch} = useApi();
	const [userTransactions, setUserTransactions] = useState(null);
	const mockTransactions = [
		{
			date: "2024-05-13T14:32:00Z",
			symbol: "AAPL",
			quantity: 10,
			price: 172.34,
			transaction_type: "BUY"
		},
		{
			date: "2024-05-14T09:45:00Z",
			symbol: "GOOGL",
			quantity: 5,
			price: 2820.67,
			transaction_type: "BUY"
		},
		{
			date: "2024-05-14T15:20:00Z",
			symbol: "TSLA",
			quantity: 2,
			price: 720.12,
			transaction_type: "SELL"
		},
		{
			date: "2024-05-15T11:10:00Z",
			symbol: "MSFT",
			quantity: 7,
			price: 310.55,
			transaction_type: "BUY"
		},
		{
			date: "2024-05-16T16:05:00Z",
			symbol: "NVDA",
			quantity: 3,
			price: 910.90,
			transaction_type: "SELL"
		}
	];

	useEffect(() => {
		const fetchTransactions = async () => {
			//const response = await apiFetch("/api/user/transactions");
			//const data = await response.json();
			const parsedData = mockTransactions.map(t => ({
				date: t.date,
				symbol: t.symbol,
				quantity: t.quantity
			}));
			setUserTransactions(parsedData);
		}
		fetchTransactions();
	}, []);


	return (
		<div>
			<HoldingsTable data={userTransactions}/>
		</div>
	);
}

export default RecentTrades;