import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { ROUTES } from './shared/routes'

import Users from './user/pages/Users';
import NewBlog from './blogs/pages/NewBlog';
import UserBlogs from './blogs/pages/userBlogs';
import UpdateBlog from './blogs/pages/UpdateBlog';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import dotenv from 'dotenv'
import path from 'path'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  dotenv.config({ path: path.resolve(__dirname, '/config/dev.env') });

  const login = useCallback(userData => {
    const { userId, isAdmin } = userData;
    setIsLoggedIn(true);
    setUserId(userId);
    setIsAdmin(isAdmin);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setIsAdmin(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path={ROUTES.ROOT} exact>
          <Users />
        </Route>
        <Route path={ROUTES.BLOGS} exact>
          <UserBlogs />
        </Route>
        <Route path={ROUTES.BLOGS_NEW} exact>
          <NewBlog />
        </Route>
        <Route path={ROUTES.BLOGS_BY_ID}>
          <UpdateBlog />
        </Route>
        <Route path={ROUTES.BLOGY_BY_USERID}>
          <UserBlogs />
        </Route>
        <Redirect to={ROUTES.ROOT} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path={ROUTES.ROOT} exact>
          <Users />
        </Route>
        <Route path={ROUTES.BLOGS} exact>
          <UserBlogs />
        </Route>
        <Route path={ROUTES.AUTH}>
          <Auth />
        </Route>
        <Redirect to={ROUTES.AUTH} />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
        isAdmin: isAdmin
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
