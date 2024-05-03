/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, useRef } from 'react';
import { MdSend } from 'react-icons/md';
import { AuthContext } from '../hooks/AuthContext';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';

const ChatBox = ({ clickedUser }) => {
	const { user_id } = useContext(AuthContext);
	const [messages, setMessages] = useState([]);
	const [postMessage, setPostMessage] = useState('');
	const chatBoxRef = useRef();

	const handleDeleteMessage = async (messageId) => {
		await fetch(
			`https://locker-4eff66da6769.herokuapp.com/api/directmessage/delete/${user_id}/${messageId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			}
		).then(() => fetchMessages());
	};

	const fetchMessages = async () => {
		if (!clickedUser) return;

		const response = await fetch(
			`https://locker-4eff66da6769.herokuapp.com/api/directmessage/get/${user_id}/${clickedUser.user_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			}
		);
		const data = await response.json();
		setMessages([...data]);
	};

	useEffect(() => {
		fetchMessages();
	}, [clickedUser]);

	const sendMessage = async () => {
		try {
			const response = await fetch(
				`https://locker-4eff66da6769.herokuapp.com/api/directmessage/send/${user_id}/${clickedUser.user_id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
					body: JSON.stringify({
						message: postMessage,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(`Server responded with an error: ${errorData}`);
			}

			setPostMessage('');
			fetchMessages();
		} catch (error) {
			console.error('Send message failed:', error);
		}
	};

	useEffect(() => {
		const chatBox = chatBoxRef.current;
		chatBox.scrollTop = chatBox.scrollHeight;
	}, [messages]);

	const handleSubmit = (e) => {
		e.preventDefault();
		sendMessage();
		setPostMessage('');
		toast.success('Message sent', {
			autoClose: 500,
		});
	};

	return (
		<div className="p-2 overflow-auto h-[62vh] " ref={chatBoxRef}>
			{messages.map((message, index) => (
				<div key={index} className=" relative ">
					<div
						className={
							message.sender_id === user_id
								? 'flex justify-end items-start group'
								: 'flex justify-start items-start group'
						}
					>
						{message.sender_id === user_id && (
							<button
								className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-black text-2xl mr-2 mt-2 hover:cursor-pointer"
								onClick={() => handleDeleteMessage(message.id)}
							>
								<MdDelete />
							</button>
						)}
						<p
							className={
								message.sender_id === user_id
									? 'text-right p-2'
									: 'text-left p-2'
							}
						>
							<span
								className={
									message.sender_id === user_id
										? 'bg-blue-600 p-2 rounded-lg'
										: 'text-white bg-zinc-800 p-2 rounded-lg transform rotate-45 origin-bottom-right h-4'
								}
							>
								{message.message}
							</span>
						</p>
					</div>
				</div>
			))}

			<div className="flex gap-2 justify-center absolute bottom-0 left-0 right-0">
				<form className="flex gap-2" onSubmit={handleSubmit}>
					<input
						className="w-96 text-black"
						type="text"
						placeholder="Type a message"
						value={postMessage}
						onChange={(e) => setPostMessage(e.target.value)}
					/>

					<button type="submit" className="text-2xl">
						<MdSend />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatBox;
