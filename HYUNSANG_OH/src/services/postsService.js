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

const deletePost = async (postId) => {
  return await postsDao.deletePost(postId);
};

const editPost = async (postId, title, content, image_url) => {
  const check = await postsDao.checkPost(postId);

  if (check[0].postExist == 1) {
    await postsDao.edit(postId, title, content, image_url);
  } else {
    return res.status(404).json({ message: "Non Existing Post" });
  }

  const editedPost = await postsDao.editedPost(postId);
  return editedPost;
};

module.exports = { createPost, posts, postsByUser, deletePost, editPost };
