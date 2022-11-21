const jwt = require('jsonwebtoken');
const { getUserByUserId } = require('../models/userDao');

const validateAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization');
    const secretKey = process.env.SECRET_KEY;
    const payLoad = jwt.verify(accessToken, secretKey);
    const userId = payLoad['user_id'];

    const [user] = await getUserByUserId(userId);
    req.body.userId = user.id;

    if (!user) {
      return res.status(401).json('Invalid AccessToken');
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validateAccessToken };
