const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const generateJwtToken = async (data) => {
  return jwt.sign(data, 'secret', { expiresIn: '1h' });
}

const verifyJwtToken = async (token) => {
  return jwt.verify(token, 'secret');
}

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const token = await generateJwtToken(req.body);
  const createdUser = new User({
    name,
    email,
    password,
    token,
    blogs: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({ 
    user: createdUser.toObject({ getters: true }),
    token
  });
};

const login = async (req, res, next) => {
  const { email, password, isAdmin } = await verifyJwtToken(req.body.token);
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({
    message: 'Logged in!',
    user: existingUser.toObject({ getters: true }),
    token: req.body.token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
