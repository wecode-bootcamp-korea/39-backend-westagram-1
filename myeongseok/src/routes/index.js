const express = require('express');

const { authRouter } = require('./authRouter');
const { postRouter } = require('./postRouter');
const { likeRouter } = require('./likeRouter');
const { validateAccessToken } = require('../middlewares/tokenValidater');

const routes = express.Router();

routes.use('/auth', authRouter);
routes.use('/api', postRouter);
routes.use('/likes', validateAccessToken, likeRouter);

module.exports = { routes };
