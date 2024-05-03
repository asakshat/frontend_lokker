import { ModalComponent } from './pages/Modal';
import Error404 from './components/Error404';
import { AuthProvider } from './hooks/AuthContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainChat from './pages/MainChat';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
	{
		path: '/',
		element: <ModalComponent />,
		errorElement: <Error404 />,
	},
	{
		path: '/home',
		element: (
			<PrivateRoute>
				<MainChat />
			</PrivateRoute>
		),
	},
]);

function App() {
	return (
		<>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
			<ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
		</>
	);
}

export default App;
