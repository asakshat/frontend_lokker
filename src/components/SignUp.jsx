import { Button, TextInput } from 'flowbite-react';
import { HiMail } from 'react-icons/hi';
import { FaRegUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useState, useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { login } from './auth';

export default function SignUp() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		email: '',
		username: '',
		password: '',
	});

	const { setAuthToken, setUser } = useContext(AuthContext);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const signup = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				'https://locker-4eff66da6769.herokuapp.com/api/user/signup',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form),
				}
			);
			const data = await response.json();
			if (response.status !== 200) {
				console.error('Signup failed:', data.error);
				toast.error(`Signup failed: ${data.error}`);
			}
			if (response.status === 200) {
				const loginData = await login(form);
				if (loginData) {
					localStorage.setItem('accessToken', loginData.accessToken);
					setAuthToken(loginData.accessToken);
					setUser(loginData);
					navigate('/home');
				}
			}
		} catch (error) {
			console.error('Signup failed:', error);
			toast.error(`Signup failed: ${error.message}`);
		}
	};

	return (
		<>
			<form className="flex max-w-md flex-col gap-4" onSubmit={signup}>
				<div>
					<TextInput
						id="email1"
						type="email"
						icon={HiMail}
						placeholder="john@doe.com"
						required
						name="email"
						value={form.email}
						onChange={handleChange}
					/>
				</div>
				<label>
					<p>Lowercase and numbers only</p>
					<TextInput
						id="username1"
						placeholder="Username (lowercase & numbers only)"
						icon={FaRegUser}
						required
						name="username"
						value={form.username}
						pattern="[a-z0-9]+"
						onChange={handleChange}
					/>
				</label>

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
