import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import RecentsTable from '../../components/trading/RecentsTable.jsx';

function RecentTrades () {
	const {apiFetch} = useApi();
	const [userTransactions, setUserTransactions] = useState(null);

	useEffect(() => {
		const fetchTransactions = async () => {
			const response = await apiFetch("/api/user/transactions");
			const data = await response.json();

			const parsedData = data.map(t => ({
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