import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from "../../assets/logo.png"

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className='nav'>
				<NavLink exact to="/"><img src={logo} alt='logo' className="logo" /></NavLink>
			{isLoaded && (
				<li className='profile'>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</div>
	);
}

export default Navigation;