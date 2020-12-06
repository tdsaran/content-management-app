const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Blog = require('../models/blog');
const User = require('../models/user');

const getBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find({}).populate('blogs');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find blogs.',
      500
    );
    return next(error);
  }

  if (!blogs) {
    const error = new HttpError(
      'Could not find blogs for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ blogs });
};

const getBlogById = async (req, res, next) => {
  const blogId = req.params.bid;

  let blog;
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    const error = new HttpError(
      'Fetching blog failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!blog) {
    return next(
      new HttpError('Could not find blog for the provided id.', 404)
    );
  }

  res.json({ blog });
};

const getBlogsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate('blogs');
  } catch (err) {
    const error = new HttpError(
      'Fetching blogs failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userBlogs) {
    return next(
      new HttpError('Could not find blogs for the provided user id.', 404)
    );
  }

  res.json({ blogs: userBlogs.blogs.map(blog => blog.toObject({ getters: true })) });
};

const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, creator } = req.body;

  const createdBlog = new Blog({
    title,
    description,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating blog failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find blog for provided user id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBlog.save(); 
    user.blogs.push(createdBlog); 
    await user.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating blog failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

const updateBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const blogId = req.params.pid;

  let blog;
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update blog.',
      500
    );
    return next(error);
  }

  blog.title = title;
  blog.description = description;

  try {
    await blog.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update blog.',
      500
    );
    return next(error);
  }

  res.status(200).json({ blog: blog.toObject({ getters: true }) });
};

const deleteBlog = async (req, res, next) => {
  const blogId = req.params.bid;

  let blog;
  try {
    blog = await Blog.findById(blogId).populate('creator');
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete blog.',
      500
    );
    return next(error);
  }

  if (!blog) {
    const error = new HttpError('Could not find blog for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await blog.remove();
    blog.creator.blogs.pull(blog);
    await blog.creator.save();
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete blog.',
      500
    );
    return next(error);
  }
  
  res.status(200).json({ message: 'Deleted blog.' });
};

exports.getBlogs = getBlogs;
exports.getBlogById = getBlogById;
exports.getBlogsByUserId = getBlogsByUserId;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
