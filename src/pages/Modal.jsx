import { Modal } from 'flowbite-react';
import { useState } from 'react';
import LoginForm from '../components/LogIn';
import SignUp from '../components/SignUp';
import { toast } from 'react-toastify';

export function ModalComponent() {
	const [openModal, setOpenModal] = useState(true);
	const [activeButton, setActiveButton] = useState('login');

	return (
		<>
			<Modal
				size="lg"
				show={openModal}
				onClose={() => {
					setOpenModal(true);
					toast.error(`Cant close the modal`);
				}}
			>
				<div className="flex gap-4 absolute right-2 transform translate-x-28 rotate-90 top-36">
					<p
						onClick={() => setActiveButton('login')}
						className={`${
							activeButton === 'login' ? 'bg-white' : 'bg-gray-300'
						} text-black font-bold py-2 px-4 cursor-pointer`}
					>
						Login
					</p>
					<p
						onClick={() => setActiveButton('signup')}
						className={`${
							activeButton === 'signup' ? 'bg-white' : 'bg-gray-300'
						} text-black font-bold py-2 px-4 rounded cursor-pointer`}
					>
						Signup
					</p>
				</div>
				<Modal.Header>
					<span>
						{activeButton === 'login' ? 'Welcome Back!' : 'Sign Up Now!'}
					</span>
				</Modal.Header>

				<Modal.Body>
					{activeButton === 'login' ? <LoginForm /> : <SignUp />}
				</Modal.Body>
			</Modal>
		</>
	);
}
