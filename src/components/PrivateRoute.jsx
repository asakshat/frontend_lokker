import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	const verifyToken = async () => {
		const accessToken = localStorage.getItem('accessToken');
		const response = await fetch(
			'https://locker-4eff66da6769.herokuapp.com/verifytoken',
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error('Token verification failed');
		}

		setIsAuthenticated(true);
	};

	useEffect(() => {
		verifyToken().catch(() => setIsAuthenticated(false));
	}, []);

	if (isAuthenticated === null) {
		return null;
	}

	return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
