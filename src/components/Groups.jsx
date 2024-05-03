/* eslint-disable no-unused-vars */
import { AuthContext } from '../hooks/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TextInput } from 'flowbite-react';
import { IoIosAddCircle } from 'react-icons/io';
import { createGroup } from './createGroup';
import GroupChatBox from './GroupChatBox';

import Avatar from 'react-avatar';
import { toast } from 'react-toastify';

const Groups = () => {
	const { user_id } = useContext(AuthContext);
	const [joinedGroup, setJoinedGroup] = useState([]);
	const [searchResults, setSearchResults] = useState('');
	const [clickedGroup, setClickedGroup] = useState(null);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		fetchGroups();
	});
	const handleGroupChange = (e) => {
		setSearchResults(e.target.value);
	};

	const fetchGroups = async () => {
		try {
			const response = await fetch(
				`https://locker-4eff66da6769.herokuapp.com/api/group/list/${user_id}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			);
			const data = await response.json();
			setJoinedGroup(data);
		} catch (error) {
			console.error('Fetch groups failed:', error);
		}
	};

	const createGroupFunction = async (e) => {
		e.preventDefault();
		try {
			const response = await createGroup(user_id, searchResults);
			if (!response.ok) {
				const errorText = await response.text();
				if (
					response.status === 400 &&
					errorText === 'Group name already exists'
				) {
					toast.error('Group name already exists');
				} else {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			} else {
				const data = await response.json();
				setJoinedGroup([...joinedGroup, data]);
				setSearchResults('');
				toast.success('Group created successfully');
				await fetchGroups();
			}
		} catch (error) {
			console.error('Create group failed:', error);
		}
	};
	useEffect(() => {
		console.log('clickedGroup:', clickedGroup?.group_id);
	}, [clickedGroup]);

	const getMembers = async (group_id) => {
		const response = await fetch(
			`https://locker-4eff66da6769.herokuapp.com/api/group/members/${group_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			}
		);
		const data = await response.json();
		setMembers([...data]);
	};
	useEffect(() => {
		if (clickedGroup) {
			getMembers(clickedGroup.group_id);
		}
	}, [clickedGroup]);

	return (
		<>
			<div className="bg-gradient-to-r from-slate-900 to-slate-700 h-[75vh] p-2 m-0 flex gap-2 rounded-none">
				<div className="bg-slate-600 w-[40vw] overflow-auto relative ">
					<TextInput
						className="border-none bg-slate-600 text-white w-full p-2 rounded-3xl"
						id="search1"
						type="Text"
						placeholder="CREATE OR SEARCH GROUP"
						icon={FaSearch}
						onChange={handleGroupChange}
					/>
					<div
						onClick={createGroupFunction}
						className="absolute bg-white bac w-full hover:bg-blue-400 hover:cursor-pointer"
					>
						{searchResults.length > 0 ? (
							<div className="flex items-center gap-2 p-2 hover:cursor-pointer">
								<Avatar
									name={searchResults?.charAt(0).toUpperCase() || ''}
									size="40"
									round={true}
									color="teal"
								/>
								<p>{searchResults}</p>
								<IoIosAddCircle className="text-black font-extrabold  text-lg" />
							</div>
						) : (
							''
						)}
					</div>
					<div>
						{joinedGroup.map((group, index) => (
							<div
								key={index}
								className={`flex items-center gap-2 p-2 hover:cursor-pointer ${
									clickedGroup && clickedGroup.group_id === group.group_id
										? 'bg-blue-500'
										: 'bg-slate-700'
								}`}
								onClick={() => {
									setClickedGroup(group);
								}}
							>
								<Avatar
									name={group.group_name?.charAt(0)?.toUpperCase() || ''}
									size="40"
									round={true}
									color="teal"
								/>
								<p className="text-white">{group.group_name}</p>
							</div>
						))}
					</div>
				</div>
				<div className="w-full bg-slate-500 text-white relative ">
					{clickedGroup && <GroupChatBox clickedGroup={clickedGroup} />}
				</div>
				<div className="bg-slate-600 w-[40vw] text-sm p-4 font-mono text-white">
					<p className="text-lg my-2 ml-2">Members :- </p>
					<hr />

					{members.map((member, index) => [
						<div key={index} className="flex items-center gap-2 mt-2">
							<Avatar
								name={member.username.charAt(0).toUpperCase()}
								size="40"
								round={true}
								color="teal"
							/>
							<p>{member.username}</p>
						</div>,
					])}
				</div>
			</div>
		</>
	);
};

export default Groups;
