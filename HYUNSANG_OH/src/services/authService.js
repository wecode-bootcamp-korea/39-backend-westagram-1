//회원가입 Main 로진
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userDao = require("../models/userDao");
const { validateEmail } = require("../utils/validators");

const signUp = async (name, email, password, profile_image) => {
  validateEmail(email);

  const user = await userDao.getUserByEmail(email);

  if (user) {
    const err = new Error("중복된 이메일 입니다.");
    err.statusCode = 400;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  await userDao.createUser(name, email, hashedPassword, profile_image);
};

const signIn = async (email, password) => {
  const user = await userDao.getUserByEmail(email);

  if (!user) {
    const err = new Error("가입되어 있지 않습니다.");
    err.statusCode = 404;
    throw err;
  }
  const hashedPassword = user.user_password;

  const check = await bcrypt.compare(password, hashedPassword);

  if (!check) {
    const err = new Error("Invalid Password");
    err.statusCode = 401;
    throw err;
  }
  return jwt.sign({ sub: user.id }, process.env.SECRET_KEY);
};

module.exports = { signUp, signIn };
