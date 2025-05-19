import Button from "../general/Button";
import { useEffect } from "react";

const SummaryModal = ({ trade, onConfirm, onCancel }) => {
	useEffect(() => {
		if (trade) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}

		return () => {
			document.body.classList.remove('overflow-hidden');
		};
	}, [trade]);

	if (!trade) return null;

	return (
		<div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
			<div className="bg-secondary p-6 rounded-lg w-80 shadow-xl lg:w-[30%]">
				<h2 className="text-xl text-text font-bold mb-4">Trade Summary</h2>
				<p><strong>Action:</strong> {trade.action}</p>
				<p><strong>Stock:</strong> {trade.name} ({trade.symbol})</p>
				<p><strong>Amount:</strong> ${trade.amount}</p>
				{/* Add any other info you want */}
        
				<div className="mt-6 flex justify-between gap-5">
					<Button text="Cancel" onClick={onCancel}></Button>
					<Button text="Confirm" onClick={onConfirm}></Button>
				</div>
			</div>
		</div>
	);
};

export default SummaryModal;
