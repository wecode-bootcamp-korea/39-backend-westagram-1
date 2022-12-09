const express = require('express');

const likeController = require('../controllers/likeController');

const likeRouter = express.Router();

likeRouter.post('/', likeController.addLike);

likeRouter.delete('/', likeController.cancelLike);

module.exports = { likeRouter };
