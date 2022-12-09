const likeService = require('../services/likeService');

const addLike = async (req, res) => {
  try {
    const userId = req.body.userId;

    const { postId } = req.body;

    await likeService.createLike(userId, postId);

    res.status(201).json({ message: 'LIKE ADDED' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const cancelLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.body.userId;

    await likeService.deleteLike(userId, postId);

    res.status(200).json({ message: 'LIKE CANCELED' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = { addLike, cancelLike };
