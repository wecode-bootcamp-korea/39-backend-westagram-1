const postsDao = require("../models/postsDao");

const createPost = async (title, content, image_url, userId) => {
  const post = await postsDao.creatingPost(title, content, image_url, userId);
  return post;
};

const posts = async () => {
  const posts = await postsDao.posts();
  console.log(posts);
  return posts;
};

const postsByUser = async (userId) => {
  const postsByUser = await postsDao.postsByUser(userId);
  return postsByUser;
};

const deletePost = async (userId, postId) => {
  const checkPost = await postsDao.checkPost(postId);
  console.log(checkPost);
  const deletePost = await postsDao.deletePost(userId, postId);
  return deletePost;
};

module.exports = { createPost, posts, postsByUser, deletePost };
