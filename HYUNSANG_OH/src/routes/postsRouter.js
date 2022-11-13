//게시글 관련 엔드포인트 (헬스체크는 덤)
const express = require("express");

const postsRouter = express.Router();

const postsController = require("../controllers/postsController");
const validity = require("../middlewares/token");

postsRouter.post("/new", validity.validToken, postsController.createPost);
postsRouter.get("/", postsController.posts);
postsRouter.get("/:userId", postsController.postsByUser);
postsRouter.delete("/:postId", validity.validToken, postsController.deletePost);
postsRouter.patch(
  "/edit/:postId",
  validity.validToken,
  postsController.editPost
);

module.exports = { postsRouter };
