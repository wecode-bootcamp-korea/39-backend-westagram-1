const postService = require('../services/postService');

const addPost = async (req, res) => {
  try {
    const { title, postImageUrl, content, userId } = req.body;
    console.log(userId);
    if (!title || !postImageUrl || !content) {
      return res
        .status(400)
        .json({ message: 'INPUT TITLE & POST IMAGE URL & CONTENT' });
    }
    await postService.createPost(title, postImageUrl, content, userId);

    return res.status(201).json({ message: 'POST CREATED' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const viewPosts = async (req, res) => {
  const posts = await postService.readPosts();
  return res.status(200).json({
    data: posts,
  });
};

const viewUserPost = async (req, res) => {
  try {
    const { userId } = req.body;

    const userPost = await postService.readUserPost(userId);

    return res.status(200).json({ data: userPost });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const editUserPost = async (req, res) => {
  try {
    const { id, title, postImageUrl, content, userId } = req.body;

    const result = await postService.updateUserPost(
      id,
      title,
      postImageUrl,
      content,
      userId
    );

    return res.status(201).json({
      message: 'success',
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const removeUserPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    await postService.deleteUserPost(userId, postId);

    return res.status(200).json({ message: 'POSTING DELETED' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = {
  addPost,
  viewPosts,
  viewUserPost,
  editUserPost,
  removeUserPost,
};
