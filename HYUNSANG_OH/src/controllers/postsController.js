//게시글 관련 코드

const postsService = require("../services/postsService");

const createPost = async (req, res) => {
  const { title, content, image_url, userId } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ message: "KEY ERROR" });
    }

    await postsService.createPost(title, content, image_url, userId);

    return res.status(201).json({ message: "postCreated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const posts = async (req, res) => {
  try {
    const posts = await postsService.posts();

    res.status(200).json({ data: posts });
  } catch (err) {
    return res.status(200).json({ message: "There are no available contents" });
  }
};

const postsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const userPost = await postsService.postsByUser(userId);
    res.status(200).json({ data: userPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { postId } = req.body;
    await postsService.deletePost(userId, postId);
    return res.status(204).json({ message: "Delete Successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, posts, postsByUser, deletePost };
