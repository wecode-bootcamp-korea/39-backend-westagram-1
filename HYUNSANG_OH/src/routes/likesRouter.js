//게시글 관련 엔드포인트 (헬스체크는 덤)
const express = require("express");

const likesRouter = express.Router();

const likesController = require("../controllers/likesController");
const validity = require("../middlewares/token");

likesRouter.post("/", validity.validToken, likesController.createLikes);

module.exports = { likesRouter };
