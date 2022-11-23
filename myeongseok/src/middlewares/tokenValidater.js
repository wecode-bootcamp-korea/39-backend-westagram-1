const jwt = require('jsonwebtoken');
const { getUserByUserId } = require('../models/userDao');

const validateAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization');
    const secretKey = process.env.SECRET_KEY;
    const payLoad = jwt.verify(accessToken, secretKey);
    const userId = payLoad.userId;

    const [user] = await getUserByUserId(userId);

    if (user.id !== userId) {
      return res.status(401).json('Invalid AccessToken');
    }

    req.decoded = userId;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateAccessToken };
