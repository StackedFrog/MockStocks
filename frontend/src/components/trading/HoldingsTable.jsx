import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Table = ({ data }) => {
	const navigate = useNavigate();
    
	if (!data || data.length === 0) {
		return (
			<div className='flex flex-col items-center'>
				<p className="text-text font-text">You have no holdings to display</p>
				<Button text="Start trading" to="/trade"></Button>
			</div>
		);
	}

	const headers = Object.keys(data[0]);

	return (
		<div className="w-[90%] rounded-lg overflow-hidden">
			<div className='overflow-auto'>
				<table className="min-w-full">
					<thead>
						<tr className="bg-secondary text-text font-heading">
							{headers.map((header) => (
								<th key={header} className="py-2 w-[30%]">
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr key={index}
								onClick={() => navigate(`../trade?symbol=${row.symbol}`)}
								className="odd:bg-primary even:bg-white text-background font-text cursor-pointer hover:bg-accent active:bg-accent
                                    transition-colors duration-150">
								{headers.map((header) => (
									<td key={header} className="px-4 py-2">
										{row[header]}
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

export default Table;