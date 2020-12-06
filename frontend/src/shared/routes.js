const BASE_URL = 'http://localhost:5000/api';

const ROUTES = {
  ROOT: '/',
  AUTH: '/auth',
  BLOGS: '/blogs',
  BLOGS_NEW: '/blogs/new',
  BLOGS_BY_ID: '/blogs/:blogId',
  BLOGY_BY_USERID: '/user/:userId/blogs'
}

const SERVICE_ROUTES = {
  ROOT: BASE_URL + '/',
  USERS: BASE_URL + '/users',
  SIGNUP: BASE_URL + '/users/signup',
  LOGIN: BASE_URL + '/users/login', 
  BLOGS: BASE_URL + '/blogs',
  USER_BLOGS: BASE_URL + '/blogs/user',
  ERROR: BASE_URL + '/error'
};

export { ROUTES, SERVICE_ROUTES };
