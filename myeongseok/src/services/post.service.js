const postDao = require('../models/post.dao');

const { validateToken } = require('../utils/validators');

const createPost = async (title, postImageUrl, content, accessToken) => {
  const userId = validateToken(accessToken);

  if (!userId) {
    const err = new Error('INVALID USER');
    err.statusCode = 400;
    throw err;
  }
  return postDao.createPost(title, postImageUrl, content, userId);
};

const readPosts = async () => {
  const posts = await postDao.readPosts();
  return posts;
};

const readUserPost = async (accessToken) => {
  const userId = validateToken(accessToken);
  if (!userId) {
    const err = new Error('INVALID USER');
    err.statusCode = 400;
    throw err;
  }
  const userPost = await postDao.readUserPost(userId);

  return userPost;
};

const updateUserPost = async (
  id,
  title,
  postImageUrl,
  content,
  accessToken
) => {
  const userId = validateToken(accessToken);
  if (!userId) {
    const err = new Error('INVALID USER');
    err.statusCode = 400;
    throw err;
  }
  return await postDao.updateUserPost(id, title, postImageUrl, content, userId);
};

const deleteUserPost = async (accessToken, postId) => {
  const userId = validateToken(accessToken);

  if (!userId) {
    const err = new Error('INVALID USER');
    err.statusCode = 400;
    throw err;
  }

  const { affectedRows } = await postDao.deleteUserPost(userId, postId);

  if (affectedRows === 0) {
    const err = new Error('INVALID POST ID');
    err.statusCode = 400;
    throw err;
  }
};

module.exports = {
  createPost,
  readPosts,
  readUserPost,
  updateUserPost,
  deleteUserPost,
};
