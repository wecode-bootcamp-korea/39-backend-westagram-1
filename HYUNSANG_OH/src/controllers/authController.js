//회원가입 메인 함수
const authService = require("../services/authService");

const signUp = async (req, res) => {
  try {
    const { name, email, password, profile_image } = req.body;

    await authService.signUp(name, email, password, profile_image);

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    res.status(err.statuscode || 400).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const accessToken = await authService.signIn(email, password);
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    res.status(err.statusCode || 401).json({ message: err.message });
  }
};

module.exports = { signUp, signIn };
