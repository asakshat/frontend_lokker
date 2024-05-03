import { toast } from 'react-toastify';

export async function login(form) {
	try {
		const response = await fetch(
			'https://locker-4eff66da6769.herokuapp.com/api/user/login',
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
			console.error('Login failed:', data.error);
			toast.error(`Login failed : ${data.error}`);
			return null;
		}
		if (response.status === 200) {
			localStorage.setItem('accessToken', data.accessToken);
			console.log(data);
			toast.success('Login successful');
			return data;
		}
	} catch (error) {
		console.error('Signup failed:', error);
		toast.error(`Signup failed: ${error.message}`);
		return null;
	}
}
