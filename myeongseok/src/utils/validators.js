const jwt = require('jsonwebtoken');

const validateEmail = (email) => {
  const re = new RegExp(
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
  );

  if (!re.test(email)) {
    const err = new Error('INVALID EMAIL');
    err.statusCode = 400;
    throw err;
  }
};

const validateToken = (accessToken) => {
  const secretKey = process.env.SECRET_KEY;
  const payLoad = jwt.verify(accessToken, secretKey);

  if (!payLoad) {
    const err = new Error('INVALID ACCESS TOKEN');
    err.statusCode = 400;
    throw err;
  }
  return payLoad.user_id;
};

module.exports = {
  validateEmail,
  validateToken,
};
