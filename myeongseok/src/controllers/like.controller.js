const likeService = require('../services/like.service');

const addLike = async (req, res) => {
  try {
    const accessToken = req.header('Authorization');

    const { postId } = req.body;

    await likeService.createLike(accessToken, postId);

    res.status(201).json({ message: 'LIKE ADDED' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const cancelLike = async (req, res) => {
  try {
    const accessToken = req.header('Authorization');

    const { postId } = req.body;

    await likeService.deleteLike(accessToken, postId);

    res.status(200).json({ message: 'LIKE CANCELED' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = { addLike, cancelLike };
