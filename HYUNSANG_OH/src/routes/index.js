const express = require("express");

const { authRouter } = require("./authRouter");
const { postsRouter } = require("./postsRouter");
const { likesRouter } = require("./likesRouter");

const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/posts", postsRouter);
routes.use("/likes", likesRouter);

module.exports = { routes };
