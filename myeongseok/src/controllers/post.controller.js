const postService = require('../services/post.service');

const addPost = async (req, res) => {
  try {
    const { title, postImageUrl, content } = req.body;
    const accessToken = req.header('Authorization');

    if (!title || !postImageUrl || !content) {
      return res
        .status(400)
        .json({ message: 'INPUT TITLE & POST IMAGE URL & CONTENT' });
    }
    await postService.createPost(title, postImageUrl, content, accessToken);

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
    const accessToken = req.header('Authorization');

    const userPost = await postService.readUserPost(accessToken);

    return res.status(200).json({ data: userPost });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const editUserPost = async (req, res) => {
  try {
    const accessToken = req.header('Authorization');

    const { id, title, postImageUrl, content } = req.body;

    const result = await postService.updateUserPost(
      id,
      title,
      postImageUrl,
      content,
      accessToken
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
    const accessToken = req.header('Authorization');

    const { postId } = req.params;

    await postService.deleteUserPost(accessToken, postId);

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
