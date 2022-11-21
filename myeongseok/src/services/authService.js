const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userDao = require('../models/userDao');
const { validateEmail } = require('../utils/validators');

const signUp = async (name, email, profileImage, password) => {
  validateEmail(email);
  const user = await userDao.getUserByEmail(email);

  if (user) {
    const err = new Error('DUPLICATED EMAIL');
    err.statusCode = 400;
    throw err;
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await userDao.createUser(name, email, profileImage, hashedPassword);
};

const signIn = async (email, password) => {
  const user = await userDao.getUserByEmail(email);

  if (!user) {
    const err = new Error('INVALID EMAIL');
    err.statusCode = 400;
    throw err;
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    const err = new Error('INVALID PASSWORD');
    err.statusCode = 400;
    throw err;
  }

  const now = new Date();
  const payLoad = {
    iss: 'admin',
    sub: 'loginJwtToken',
    exp: now.setDate(now.getDate() + 1),
    user_id: user.id,
  };

  const secretKey = process.env.SECRET_KEY;
  const jwtToken = jwt.sign(payLoad, secretKey);
  return jwtToken;
};

module.exports = { signUp, signIn };
