const authService = require('../services/authService');

const signUp = async (req, res) => {
  try {
    const { name, email, profileImage, password } = req.body;

    if (!name || !email || !profileImage || !password) {
      return res.status(400).json({ message: 'INPUT ALL INFORMATION' });
    }

    await authService.signUp(name, email, profileImage, password);
    return res.status(201).json({ message: 'SIGNUP SUCCESS' });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'INPUT EMAIL & PASSWORD' });
    }
    const jwtToken = await authService.signIn(email, password);
    return res.status(200).json({ accessToken: jwtToken });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = { signUp, signIn };
