//회원가입 Main 로진
const likesDao = require("../models/likesDao");

const createLikes = async (userId, postId) => {
  const likes = await likesDao.check(userId, postId);
  if (likes[0].LIKED == 0) {
    await likesDao.createLikes(userId, postId);
  }
};

module.exports = { createLikes };
