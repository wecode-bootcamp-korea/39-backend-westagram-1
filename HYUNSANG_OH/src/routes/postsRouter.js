//게시글 관련 엔드포인트 (헬스체크는 덤)
const express = require("express");

const postsRouter = express.Router();

const postsController = require("../controllers/postsController");
const validity = require("../middlewares/token");

postsRouter.post(
  "/createpost",
  validity.validToken,
  postsController.createPost
);
postsRouter.get("/posts", postsController.posts);
postsRouter.get("/posts/:userId", postsController.postsByUser);
postsRouter.delete(
  "/posts/:userId",
  validity.validToken,
  postsController.deletePost
);

module.exports = { postsRouter };
