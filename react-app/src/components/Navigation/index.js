import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const logo = "noiseframe".split("")

	return (
		<div className='nav'>
			<h1 className='logo-full'>
					<span className='logo-wrap'>
					{logo.map((letter,idx) => {
						return <span className='logo-letter' key={idx}>{letter}</span>
					})}
					</span>
			</h1>
			{isLoaded && (
				<li className='profile'>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</div>
	);
}

export default Navigation;