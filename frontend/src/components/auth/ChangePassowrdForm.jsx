import React, { useState } from "react";
import { useApi } from "../../hooks/useApi.jsx";
import Button from "../general/Button.jsx";

function ChangePasswordForm( {editClick} ) {
	const { apiFetch } = useApi();

	const [oldPwd, setOldPassword] = useState("");
	const [newPwd, setNewPassword] = useState("");
	const [confirmNewPwd, setConfirmNewPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const validatePassword = (password) => password.length >= 8;

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (newPwd !== confirmNewPwd) {
			setError("New passwords do not match.");
			return;
		}

		if (!validatePassword(newPwd)) {
			setError("New password must be at least 8 characters long.");
			return;
		}

		try {

			const res = await apiFetch("/auth/user/change_pwd", {
				method: "POST", 
				body: JSON.stringify({
					old_pwd: oldPwd,
					new_pwd: newPwd
				})});

			if (res.ok) {
				setSuccess("Password changed successfully.");
				setOldPassword("");
				setNewPassword("");
				setConfirmNewPassword("");
				editClick();
			} else {
				setError("Make sure your current password is correct.");
			}
		} catch (err) {
			console.error(err);
			setError("Something went wrong.");
		}
	};

	return (
		<>
			<h2 className="text-lg font-heading text-secondary mb-4">Change Password</h2>
			<form className="space-y-3" onSubmit={handleChangePassword}>
				<input
					type="password"
					placeholder="Old Password"
					value={oldPwd}
					onChange={(e) => setOldPassword(e.target.value)}
					className=" px-3 py-2 rounded outline-none focus:ring-2 focus:ring-accent bg-text text-background"
					required
				/>
				<input
					type="password"
					placeholder="New Password"
					value={newPwd}
					onChange={(e) => setNewPassword(e.target.value)}
					className="px-3 py-2 rounded outline-none focus:ring-2 focus:ring-accent bg-text font-text text-background"
					required
				/>
				<input
					type="password"
					placeholder="Confirm New Password"
					value={confirmNewPwd}
					onChange={(e) => setConfirmNewPassword(e.target.value)}
					className="px-3 py-2 rounded outline-none focus:ring-2 focus:ring-accent bg-text text-background"
					required
				/>

				{error && <p className="text-stock-negative text-sm animate-pulse">{error}</p>}
				{success && <p className="text-stock-positive text-sm">{success}</p>}
				<Button type="submit" text="Update Password" className="text-sm w-[75%] lg:w-[55%]" />
				<Button text="Cancel"  onClick={editClick} className="text-sm w-[75%] lg:w-[55%]"/>
			</form>
		</>
	);
}

export default ChangePasswordForm;

