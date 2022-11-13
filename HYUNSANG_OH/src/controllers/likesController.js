const likesService = require("../services/likesService");

const createLikes = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    await likesService.createLikes(userId, postId);
    res.status(201).json({ message: "likeCreated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLikes };
