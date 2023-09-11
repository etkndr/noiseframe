import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css"

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    if (user) {
    const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };
    }

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = "demo@aa.io"
    const password = "password"
    const data = dispatch(login(email, password))
  };

  const ulClassName = `profile-dropdown` + (showMenu ? "" : ` hidden`);
  const closeMenu = () => setShowMenu(false);

  return (
    <>
    {user && (
    <div>
      <button onClick={openMenu}>
        {user?.username}
      </button>
      <ul className={ulClassName} ref={ulRef}>
          <>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </>
          </ul>
        </div>
        )}
        {!user && (
          <div>
           <>
             <OpenModalButton
               buttonText="log in"
               onItemClick={closeMenu}
               modalComponent={<LoginFormModal />}
             />

            <OpenModalButton
               buttonText="sign up"
               onItemClick={closeMenu}
               modalComponent={<SignupFormModal />}
             />
             <button onClick={(e) => handleLogin(e)}>demo login</button>
           </>
      </div>
         )}
    </>
  );
}

export default ProfileButton;
