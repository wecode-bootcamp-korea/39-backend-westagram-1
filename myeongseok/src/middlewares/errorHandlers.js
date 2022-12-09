const asyncErrHandler = (err, req, res, next) => {
  if (err.message === 'DUPLICATED EMAIL') {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
  next();
};

module.exports = { asyncErrHandler };
