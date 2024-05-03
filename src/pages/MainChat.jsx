import Nav from '../components/Nav.jsx';
import { Tabs } from 'flowbite-react';
import { IoMdChatbubbles } from 'react-icons/io';
import { MdGroups } from 'react-icons/md';
import Inbox from '../components/Inbox.jsx';
import Groups from '../components/Groups.jsx';
const MainChat = () => {
	return (
		<>
			<div>
				<Nav />
				<Tabs aria-label="Default tabs" style="default">
					<Tabs.Item activ title="Inbox" icon={IoMdChatbubbles}>
						<Inbox />
					</Tabs.Item>
					<Tabs.Item title="Groups" icon={MdGroups}>
						<Groups />
					</Tabs.Item>
				</Tabs>
			</div>
		</>
	);
};

export default MainChat;
