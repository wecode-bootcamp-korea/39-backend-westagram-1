const express = require('express');

const postController = require('../controllers/postController');
const { validateAccessToken } = require('../middlewares/tokenValidater');

const postRouter = express.Router();

postRouter.post('/posts', validateAccessToken, postController.addPost);

postRouter.get('/posts', postController.viewPosts);

postRouter.get('/posts/user', postController.viewUserPost);

postRouter.patch(
  '/posts/user',
  validateAccessToken,
  postController.editUserPost
);

postRouter.delete(
  '/posts/user/:postId',
  validateAccessToken,
  postController.removeUserPost
);

module.exports = { postRouter };
