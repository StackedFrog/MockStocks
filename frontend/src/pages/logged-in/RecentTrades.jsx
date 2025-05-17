import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import RecentsTable from '../../components/trading/RecentsTable.jsx';
import { parsePath } from "react-router-dom";

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
            
			// sort by date (latest to oldest)
			mockTransactions.sort((a, b) => new Date(a.date) + new Date(b.date));

			const parsedData = mockTransactions.map(t => ({
				date: new Date(t.date).toLocaleString('en-GB', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',', ''),
				symbol: t.symbol,
				amount: new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(t.amount),
				price: new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(t.price),
				quantity: t.quantity.toFixed(5),
				transaction_type: t.transaction_type
			}));
			setUserTransactions(parsedData);
		}
		fetchTransactions();
	}, []);

	return (
		<div className='px-4 py-6 bg-background'>
			<h1 className="font-heading text-secondary text-3xl mb-6">Recent Transactions</h1>
			<RecentsTable data={userTransactions}/>
		</div>
	);
}

export default RecentTrades;