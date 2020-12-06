import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import { ROUTES } from '../../routes'
import './NavLinks.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={ROUTES.BLOGS}>{ !auth.isAdmin ? 'MY ' : 'ALL ' } BLOGS</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to={ROUTES.AUTH}>AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
