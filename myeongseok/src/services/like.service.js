const likeDao = require('../models/like.dao');
const { validateToken } = require('../utils/validators');

const createLike = async (accessToken, postId) => {
  const userId = validateToken(accessToken);
  if (!userId) {
    const err = new Error('INVALID USER');
    err.statusCode = 400;
    throw err;
  }

  await likeDao.createLike(userId, postId);
};

const deleteLike = async (accessToken, postId) => {
  const userId = validateToken(accessToken);

  if (!userId) {
    const err = new Error('INVALID USER');
    err.statusCode = 400;
    throw err;
  }
  await likeDao.deleteLike(userId, postId);
};

module.exports = {
  createLike,
  deleteLike,
};
