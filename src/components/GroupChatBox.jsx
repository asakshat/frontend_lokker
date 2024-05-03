/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { MdDelete } from 'react-icons/md';
import { MdSend } from 'react-icons/md';

const GroupChatBox = ({ clickedGroup }) => {
	const { user_id } = useContext(AuthContext);
	const [groupMessage, setGroupMessage] = useState([]);
	const [groupPostMessage, setGroupPostMessage] = useState('');

	const handleGetMessage = async (group_id) => {
		const response = await fetch(
			`https://locker-4eff66da6769.herokuapp.com/api/group/messages/${group_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			}
		);
		const data = await response.json();
		setGroupMessage([...data]);
	};
	useEffect(() => {
		if (clickedGroup) {
			handleGetMessage(clickedGroup.group_id);
		}
	}, [clickedGroup]);
	const sendGroupMessage = async (e) => {
		e.preventDefault();
		if (!clickedGroup) {
			console.error('clickedGroup is not defined');
			return;
		}
		try {
			const response = await fetch(
				`https://locker-4eff66da6769.herokuapp.com/api/group/postmessage/${user_id}/${clickedGroup.group_id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
					body: JSON.stringify({
						message: groupPostMessage,
					}),
				}
			);
			const data = await response.json();
			setGroupMessage([...data]);
		} catch (error) {
			console.error('Send group message failed:', error);
		}
	};

	return (
		<>
			<div className="p-2 overflow-auto h-[62vh] ">
				{groupMessage.map((message, index) => (
					<div key={index} className=" relative ">
						<div
							className={
								message.user_id === user_id
									? 'flex justify-end items-start group'
									: 'flex justify-start items-start group'
							}
						>
							{message.user_id === user_id && (
								<button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-black text-2xl mr-2 mt-2 hover:cursor-pointer">
									<MdDelete />
								</button>
							)}
							<p
								className={
									message.user_id === user_id
										? 'text-right p-2'
										: 'text-left p-2'
								}
							>
								<span
									className={
										message.user_id === user_id
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
					<form className="flex gap-2" onSubmit={sendGroupMessage}>
						<input
							className="w-96 text-black"
							type="text"
							placeholder="Type a message"
							value={groupPostMessage}
							onChange={(e) => setGroupPostMessage(e.target.value)}
						/>

						<button type="submit" className="text-2xl">
							<MdSend />
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default GroupChatBox;
