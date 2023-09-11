import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	useEffect(() => {
		if ((email.includes("@") && email.includes(".")) && password.length >= 6 && password === confirmPassword) {
			setErrors([])
		}
	}, [email, password, confirmPassword])

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email.includes("@") || !email.includes(".")) {
			setErrors([
				...errors,
				"Please enter a valid email address"
			])
		}
		else if (password.length < 6) {
			setErrors([
				...errors,
				"Password must be at least six characters"
			]);
		}
		else if (password !== confirmPassword) {
			setErrors([
				...errors,
				"Passwords must match"
			]);
		}
		else {
			const data = await dispatch(signUp(username, email, password))
			.then(() => closeModal())
		}
	};

	return (
		<>
		<div className="auth-form">
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<div className="auth-fields">
				<label>
					Email
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				</div>
				<button type="submit">Sign Up</button>
			</form>
			</div>
		</>
	);
}

export default SignupFormModal;