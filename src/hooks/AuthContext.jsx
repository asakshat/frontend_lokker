import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
	const [authToken, setAuthToken] = useState(
		localStorage.getItem('authToken') || null
	);
	const [username, setUsername] = useState(
		localStorage.getItem('username') || null
	);
	const [email, setEmail] = useState(localStorage.getItem('email') || null);
	const [user_id, setUser_id] = useState(
		localStorage.getItem('user_id') || null
	);

	const setUser = (user) => {
		setUsername(user.username);
		setEmail(user.email);
		setUser_id(user.user_id);
		localStorage.setItem('username', user.username);
		localStorage.setItem('email', user.email);
		localStorage.setItem('user_id', user.user_id);
	};

	useEffect(() => {
		console.log('username in AuthContext:', username);
	}, [username]);

	return (
		<AuthContext.Provider
			value={{ authToken, setAuthToken, username, email, user_id, setUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};
