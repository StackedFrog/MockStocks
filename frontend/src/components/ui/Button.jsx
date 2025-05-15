import { Link } from "react-router-dom";

const Button = ({ text, to, onClick, type = "button", className = "" }) => {

	if (to) {
		return (
			<Link
				type={type}
				to={to}
				className={`h-15 lg:w-[20vw] px-5 py-3 lg:m-2.5 mx-0 my-2.5 rounded-lg font-heading text-text 
                    flex items-center justify-center bg-accent hover:bg-primary active:bg-primary hover:cursor-pointer
                    transition-colors duration-200 ${className}`}
			>
				{text}
			</Link>
		);
	}
    
	return (
		<button
			type={type}
			onClick={onClick}
			className={`h-15 lg:w-[20vw] px-5 py-3 mx-0 my-2.5 rounded-lg font-heading text-text bg-accent
                hover:bg-primary active:bg-primary hover:cursor-pointer transition-colors duration-200 ${className}`}
		>
			{text}
		</button>
	);
};

export default Button;