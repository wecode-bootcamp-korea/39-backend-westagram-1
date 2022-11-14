const express = require('express');

const { authRouter } = require('./auth.router');
const { postRouter } = require('./post.router');
const { likeRouter } = require('./like.router');

const routes = express.Router();

routes.use('/auth', authRouter);
routes.use('/api', postRouter);
routes.use('/likes', likeRouter);

module.exports = { routes };
