import React from "react";
import Button from "./Button";

function Modal({isOpen, onClose, onConfirm, title, message}){
	if (!isOpen) return null;

	return(
		<div className="fixed inset-0 z-10 bg-opacity-50 bg-background flex items-center justify-center w-full">
			<div className="bg-accent flex flex-col justify-center items-center text-center tracking-tighter rounded-lg p-4 w-[80%] sm:w-[80%] lg:w-[40%] text-text font-heading ">
				<h2>{title}</h2>
				<p>{message}</p>
				<Button className="bg-secondary"onClick={onClose} text ="cancel"></Button>
				<Button className="bg-accent2" onClick={onConfirm} text ="confirm"></Button>
			</div>
		</div>
	)
}

export default Modal 