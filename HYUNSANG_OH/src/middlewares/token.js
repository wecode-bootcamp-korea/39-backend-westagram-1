const jwt = require("jsonwebtoken");

const validToken = async (req, res, next) => {
  try {
    const userToken = req.headers.authorization;

    if (!userToken) {
      return res.status(400).json({ message: "Not Allowed" });
    }

    await jwt.verify(userToken, process.env.SECRET_KEY);

    return next();
  } catch (error) {
    return res.status(400).json({ message: "Token Is Not Existed" });
  }
};

module.exports = { validToken };
