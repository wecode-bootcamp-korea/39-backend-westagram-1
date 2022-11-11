//인증 관련 엔드포인트 (헬스체크는 덤)
const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/authController");
const healthCheck = require("../controllers/pong");

authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.signIn);
authRouter.get("/ping", healthCheck.pong);

module.exports = { authRouter };
