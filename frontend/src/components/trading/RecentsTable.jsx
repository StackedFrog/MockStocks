import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const RecentsTable = ({ data, hidden = false}) => {
	const navigate = useNavigate();

	if (!data || data.length === 0) {
		return (
			<div className='flex flex-col items-center'>
				<p className="text-text font-text">You have no transactions to display</p>

				{hidden? <></> :<Button text="Start trading" to="/trade"></Button>}
			</div>
		);
	}

	const headers = Object.keys(data[0]);

	return (
		<div className="w-full">
			{/* Mobile layout */}
			<div className="grid grid-cols-1 gap-4 sm:hidden">
				{data.map((row, index) => (
					<div
						key={index}
						onClick={() => navigate(`../trade?symbol=${row.symbol}`)}
						className="mb-4 bg-primary p-4 rounded-lg shadow cursor-pointer font-text hover:bg-accent transition"
					>
						{headers
							.filter(header => header !== 'transaction_type')
							.map((header) => (
								<div key={header} className="flex justify-between py-1">
									<span className="font-heading text-xs text-secondary capitalize">{header}</span>
									<span className={`font-text text-sm ${
										header === 'amount'
											? row.transaction_type === 'Purchase'
												? 'text-stock-positive'
												: row.transaction_type === 'Sale'
													? 'text-stock-negative'
									    : 'text-background'
											: 'text-background'
									}`}>
										{header === 'amount'
											? (row.transaction_type === 'Purchase'
										    ? '+'
										    : row.transaction_type === 'Sale'
													? '-'
													: '') + row[header]
											: row[header]}
									</span>
								</div>
							))}
					</div>
				))}
			</div>

			{/* Desktop layout */}
			<div className="hidden sm:block">
				<table className="min-w-full rounded-lg overflow-hidden">
					<thead>
						<tr className="bg-secondary text-text font-heading">
							{headers
								.filter(header => header !== 'transaction_type')
								.map((header) => (
									<th key={header} className="py-2 w-[20%] text-sm">
										{header}
									</th>
								))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr
								key={index}
								onClick={() => navigate(`../trade?symbol=${row.symbol}`)}
								className="odd:bg-primary even:bg-white text-background font-text cursor-pointer hover:bg-accent active:bg-accent transition-colors duration-150"
							>
								{headers
									.filter(header => header !== 'transaction_type')
									.map((header) => (
										<td
											key={header}
											className={`px-2 py-2 text-center text-sm ${
												header === 'amount'
													? row.transaction_type === 'Purchase'
														? 'text-stock-positive'
														: row.transaction_type === 'Sale'
															? 'text-stock-negative'
									    : 'text-background'
													: 'text-background'
											}`}
										>
											{header === 'amount'
												? (row.transaction_type === 'Purchase'
										    ? '+'
										    : row.transaction_type === 'Sale'
														? '-'
														: '') + row[header]
												: row[header]}
										</td>
									))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>

	);
};

export default RecentsTable;
