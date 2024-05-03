import { Button, TextInput } from 'flowbite-react';
import { FaRegUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useState, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { login } from './auth';

export default function LogIn() {
	// eslint-disable-next-line no-unused-vars
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const { setAuthToken, setUser } = useContext(AuthContext);

	const handleChange = (e) => {
		const value =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		setForm({
			...form,
			[e.target.name]: value,
		});
	};

	const loginAndNavigate = async (e) => {
		e.preventDefault();
		const data = await login(form);
		if (data) {
			localStorage.setItem('accessToken', data.accessToken);
			setAuthToken(data.accessToken);
			setUser(data);
			navigate('/home');
		}
	};

	return (
		<>
			<form
				className="flex max-w-md flex-col gap-4"
				onSubmit={loginAndNavigate}
			>
				<div>
					<TextInput
						id="email2"
						placeholder="Email"
						icon={FaRegUser}
						required
						name="email"
						value={form.email}
						onChange={handleChange}
					/>
				</div>
				<div>
					<TextInput
						id="password1"
						type="password"
						required
						icon={RiLockPasswordFill}
						name="password"
						value={form.password}
						onChange={handleChange}
						placeholder="Enter password"
					/>
				</div>

				<Button type="submit">Submit</Button>
			</form>
		</>
	);
}
