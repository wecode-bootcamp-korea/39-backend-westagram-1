const express = require('express');

const postController = require('../controllers/post.controller');

const postRouter = express.Router();

postRouter.post('/posts', postController.addPost);

postRouter.get('/posts', postController.viewPosts);

postRouter.get('/posts/user', postController.viewUserPost);

postRouter.patch('/posts/user', postController.editUserPost);

postRouter.delete('/posts/user/:postId', postController.removeUserPost);

module.exports = { postRouter };
