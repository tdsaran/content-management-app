const express = require('express');
const { check } = require('express-validator');

const blogsControllers = require('../controllers/blogs-controllers');

const router = express.Router();

router.get('/', blogsControllers.getBlogs);

router.get('/:bid', blogsControllers.getBlogById);

router.get('/user/:uid', blogsControllers.getBlogsByUserId);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  blogsControllers.createBlog
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  blogsControllers.updateBlog
);

router.delete('/:bid', blogsControllers.deleteBlog);

module.exports = router;
