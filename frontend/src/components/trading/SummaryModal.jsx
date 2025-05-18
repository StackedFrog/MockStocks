import Button from "../ui/Button";

const SummaryModal = ({ trade, onConfirm, onCancel }) => {
	if (!trade) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-secondary p-6 rounded-lg w-80 shadow-xl">
				<h2 className="text-xl text-text font-bold mb-4">Trade Summary</h2>
				<p><strong>Action:</strong> {trade.action}</p>
				<p><strong>Stock:</strong> {trade.name} ({trade.symbol})</p>
				<p><strong>Amount:</strong> ${trade.amount}</p>
				{/* Add any other info you want */}
        
				<div className="mt-6 flex justify-between">
					<Button text="Cancel" onClick={onCancel}></Button>
					<Button text="Confirm" onClick={onConfirm}></Button>
				</div>
			</div>
		</div>
	);
};

export default SummaryModal;
