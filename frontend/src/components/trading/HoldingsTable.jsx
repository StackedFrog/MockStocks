import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

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
                <div className="w-full">
                {/* Mobile layout */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                {data.map((row, index) => (
                        <div
                        key={index}
                        onClick={() => navigate(`../trade?symbol=${row.symbol}`)}
                        className="mb-4 bg-primary p-4 rounded-lg shadow cursor-pointer font-text hover:bg-accent transition"
                        >
                        {headers.map((header) => (
                                <div key={header} className="flex justify-between py-1">
                                <span className="font-heading text-xs text-secondary capitalize">{header}</span>
                                <span className={`font-text text-sm ${header === 'performance'
                                                ? (parseFloat(row[header]) < 0
                                                        ? 'text-stock-negative'
                                                        : 'text-stock-positive')
                                                : 'text-background'}`}>
                                {row[header]}
                                </span>
                                </div>
                        ))}
                        </div>
                ))}
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full rounded-lg overflow-hidden">
                <thead>
                <tr className="bg-secondary text-text font-heading">
                {headers.map((header) => (
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
                        {headers.map((header) => (
                                <td
                                key={header}
                                className={`px-2 py-2 text-center text-sm ${
                                        header === 'performance'
                                                ? parseFloat(row[header]) < 0
                                                ? 'text-stock-negative'
                                                : 'text-stock-positive'
                                                : 'text-background'
                                }`}
                                >
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
