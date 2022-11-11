const express = require("express");

const { authRouter } = require("./authRouter");
const { postsRouter } = require("./postsRouter");

const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/posts", postsRouter);

module.exports = { routes };
