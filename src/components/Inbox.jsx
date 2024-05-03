import { TextInput } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';
import { useState, useEffect, useRef, useContext } from 'react';
import Avatar from 'react-avatar';
import ChatBox from './ChatBox';
import { AuthContext } from '../hooks/AuthContext';

const Inbox = () => {
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);
	const searchRef = useRef(null);
	const [isFocused, setIsFocused] = useState(false);
	const [blurTimeoutId, setBlurTimeoutId] = useState(null);
	const [clickedUser, setClickedUser] = useState(null);
	const { user_id } = useContext(AuthContext);
	const [userInDiv, setUserInDiv] = useState([]);

	useEffect(() => {
		if (searchRef.current) {
			clearTimeout(searchRef.current);
		}

		searchRef.current = setTimeout(() => {
			findUsers(search);
		}, 500);
	}, [search]);

	useEffect(() => {
		fetchMessagedUsers();
	}, []);

	const fetchMessagedUsers = async () => {
		try {
			const response = await fetch(
				`https://locker-4eff66da6769.herokuapp.com/api/directmessage/get/${user_id}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			);
			const data = await response.json();
			setUserInDiv(data);
		} catch (error) {
			console.error('Fetch messaged users failed:', error);
		}
	};

	const handleChange = (e) => {
		setSearch(e.target.value);
	};

	const findUsers = async (search) => {
		if (search === '') {
			setUsers([]);
		} else {
			try {
				const searchTerm = encodeURIComponent(
					search
						.split(' ')
						.map((word) => `${word}%`)
						.join(' ')
				);

				const response = await fetch(
					`https://locker-4eff66da6769.herokuapp.com/api/user/search/${searchTerm}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
						},
					}
				);
				const data = await response.json();
				setUsers(data || []);
			} catch (error) {
				console.log('Search failed:', error);
			}
		}
	};
	useEffect(() => {
		if (userInDiv.length > 0) {
			setClickedUser(userInDiv[userInDiv.length - 1]);
		}
	}, [userInDiv]);

	return (
		<div className="bg-gradient-to-r from-slate-900 to-slate-700 h-[75vh] p-2 m-0 flex gap-2 rounded-none">
			<div className="bg-slate-600 w-[40vw] overflow-auto">
				<TextInput
					className="border-none bg-slate-600 text-white w-full p-2 rounded-3xl"
					id="search"
					type="Text"
					placeholder="Search User"
					icon={FaSearch}
					onChange={handleChange}
					onFocus={() => {
						clearTimeout(blurTimeoutId);
						setIsFocused(true);
					}}
					onBlur={() => {
						const timeoutId = setTimeout(() => {
							setIsFocused(false);
						}, 200);
						setBlurTimeoutId(timeoutId);
					}}
				/>

				{isFocused && users && users.length > 0 && (
					<div className=" top-0 left-0 w-full backdrop-blur-md h-[75vh]">
						{users.map((user, index) => (
							<div key={index}>
								<div
									className="flex w-full text-gray-400 p-2 gap-2  bg-zinc-800 hover:bg-zinc-700 hover:cursor-pointer "
									onClick={(e) => {
										e.preventDefault;
										setUserInDiv((prevUsers) => {
											if (
												Array.isArray(prevUsers) &&
												!prevUsers.some(
													(prevUser) => prevUser.username === user.username
												)
											) {
												setClickedUser(user);
												return [...prevUsers, user];
											}
											return prevUsers;
										});
									}}
								>
									<Avatar
										name={user.username.charAt(0).toUpperCase()}
										size="40"
										round={true}
										color="teal"
									/>
									<p className="">{user.username}</p>
								</div>
							</div>
						))}
					</div>
				)}
				<div>
					{userInDiv &&
						userInDiv.length > 0 &&
						userInDiv.map((user, index) => (
							<div
								key={index}
								className={`flex items-center gap-2 p-2 hover:cursor-pointer ${
									clickedUser && clickedUser.username === user.username
										? 'bg-blue-500'
										: 'bg-slate-700'
								}`}
								onClick={() => {
									setClickedUser(user);
								}}
							>
								<Avatar
									name={user.username.charAt(0).toUpperCase()}
									size="40"
									round={true}
									color="teal"
								/>
								<p className="text-white">{user.username}</p>
							</div>
						))}
				</div>
			</div>
			<div className="w-full bg-slate-500 text-white relative ">
				{clickedUser && <ChatBox clickedUser={clickedUser} />}
			</div>
			<div className="bg-slate-600 w-[40vw] text-sm p-4 font-mono text-white">
				<h2>Instructions:- </h2>
				<ol className="list-disc">
					<li>
						Search for a user by their username. Can use username
						<span className="text-cyan-600">{` 'retrosax' `}</span> for testing
						purposes
					</li>
					<li>Click on the user to start a conversation.</li>
					<li>You can also text yourself {` (It's a feature. I swear.) `}</li>
				</ol>
			</div>
		</div>
	);
};

export default Inbox;
