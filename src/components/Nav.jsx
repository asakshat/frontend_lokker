import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {
	Dropdown,
	DropdownDivider,
	DropdownHeader,
	DropdownItem,
	Navbar,
	NavbarBrand,
	NavbarToggle,
} from 'flowbite-react';
import Avatar from 'react-avatar';
import { AuthContext } from '../hooks/AuthContext';

const Nav = () => {
	const { username, email } = useContext(AuthContext);
	const navigate = useNavigate();
	const logout = () => {
		localStorage.removeItem('accessToken');
		navigate('/');
	};
	return (
		<>
			<Navbar fluid rounded className="font-mono ">
				<NavbarBrand>
					<span className="self-center whitespace-nowrap text-xl font-semibold text-teal-600">
						Chat App
					</span>
				</NavbarBrand>
				<div className="flex md:order-2 ">
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar
								name={username.charAt(0).toUpperCase()}
								size="40"
								round={true}
								color="#000000"
								textColor="#ffffff"
							/>
						}
					>
						<DropdownHeader>
							<span className="block text-sm">Username : {username}</span>
							<DropdownDivider />
							<span className="block truncate text-sm font-medium">
								Email: {email}
							</span>
						</DropdownHeader>

						<DropdownItem onClick={logout}>Sign out</DropdownItem>
					</Dropdown>
					<NavbarToggle />
				</div>
			</Navbar>
		</>
	);
};

export default Nav;
