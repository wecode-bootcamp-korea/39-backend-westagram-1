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

    return res.status(200).json({ data: posts });
  } catch (err) {
    return res.status(200).json({ message: "There are no available contents" });
  }
};

const postsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const userPost = await postsService.postsByUser(userId);
    return res.status(200).json({ data: userPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await postsService.deletePost(postId);
    return res.status(200).json({ message: "Delete Successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, image_url } = req.body;

  const editedPost = await postsService.editPost(
    postId,
    title,
    content,
    image_url
  );
  return res.status(201).json({ data: editedPost });
};

module.exports = { createPost, posts, postsByUser, deletePost, editPost };
