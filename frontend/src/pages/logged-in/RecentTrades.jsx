import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import HoldingsTable from '../../components/trading/HoldingsTable.jsx';

function RecentTrades () {
	const {apiFetch} = useApi();
	const [userTransactions, setUserTransactions] = useState(null);
	
	const mockTransactions = [
		{
			symbol: "AAPL",
			amount: 500.00,
			price: 172.35,
			quantity: 2.901,
			transaction_type: "purchase",
			date: "2025-05-14T15:30:00Z",
		},
		{
			symbol: "GOOGL",
			amount: 1200.00,
			price: 133.40,
			quantity: 8.996,
			transaction_type: "purchase",
			date: "2025-05-13T10:45:00Z",
		},
		{
			symbol: "MSFT",
			amount: 750.00,
			price: 309.15,
			quantity: 2.425,
			transaction_type: "purchase",
			date: "2025-05-12T09:15:00Z",
		},
		{
			symbol: "TSLA",
			amount: 400.00,
			price: 187.50,
			quantity: 2.133,
			transaction_type: "sale",
			date: "2025-05-11T13:20:00Z",
		},
		{
			symbol: "AMZN",
			amount: 950.00,
			price: 117.00,
			quantity: 8.120,
			transaction_type: "purchase",
			date: "2025-05-10T14:05:00Z",
		},
		{
			symbol: "NVDA",
			amount: 1100.00,
			price: 950.00,
			quantity: 1.157,
			transaction_type: "sale",
			date: "2025-05-09T11:55:00Z",
		},
	];


	useEffect(() => {
		const fetchTransactions = async () => {
			//const response = await apiFetch("/api/user/transactions");
			//const data = await response.json();
			const parsedData = mockTransactions.map(t => ({
				date: t.date,
				symbol: t.symbol,
				amount: t.amount,
				price: t.price,
				quantity: t.quantity,
				transaction_type: t.transaction_type
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