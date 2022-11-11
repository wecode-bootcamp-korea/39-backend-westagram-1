//어디든 들어갈 수 있는 함수?
const validateEmail = (email) => {
  const re = new RegExp(
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
  );

  if (!re.test(email)) {
    const err = new Error("invalid email");
    err.statusCode = 400;
    throw err;
  }
};

module.exports = { validateEmail };
