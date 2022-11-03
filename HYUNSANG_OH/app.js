const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { DataSource } = require("typeorm");

dotenv.config();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource
  .initialize()

  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//health check
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/allPosts", async (req, res) => {
  const posts = await appDataSource.query(
    `
        SELECT
            u.id as userId,
            u.profile_image as userProfileImage,
            p.user_id as postingId,
            p.image_url as postingImageUrl,
            p.content as postingContent
        FROM users u
        JOIN posts p ON u.id = p.user_id;
        `
  );
  res.status(200).json({ data: posts });
});

app.get("/userPost/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await appDataSource.query(
    `
        SELECT
            users.id as userId,
            users.profile_image as userProfileImage
        FROM users
        WHERE users.id = ${userId};
        `
  );
  const userPost = await appDataSource.query(
    `
        SELECT
            posts.id as postingId,
            posts.image_url as postingImageUrl,
            posts.content as postingContent
        FROM posts
        WHERE posts.user_id = ${userId};
        `
  );
  user[0].posting = userPost;
  const result = user[0];
  res.status(200).json({ data: result });
});

app.post("/signup", async (req, res, next) => {
  const { name, email, password, profile_image } = req.body;
  await appDataSource.query(
    `
    INSERT INTO users(
        user_name,
        email,
        user_password,
        profile_image
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, password, profile_image]
  );
  res.status(201).json({ message: "userCreated" });
});

app.post("/post", async (req, res, next) => {
  const { title, content, image_url, user_id } = req.body;
  await appDataSource.query(
    `
    INSERT INTO posts(
        title,
        content,
        image_url,
        user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, image_url, user_id]
  );
  res.status(201).json({ message: "postCreated" });
});

app.patch("/update/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  const { title, content, image_url } = req.body;
  await appDataSource.query(
    `
        UPDATE posts SET
        title = ?,
        content = ?,
        image_url = ?
        WHERE posts.id = ${postId}
        `,
    [title, content, image_url]
  );
  const editedPost = await appDataSource.query(
    `
        SELECT
            users.id as userId,
            users.user_name as userName,
            posts.id as postingId,
            posts.title as postingTitle,
            posts.content as postingContent
        FROM users
        JOIN posts ON users.id = posts.user_id
        WHERE posts.id = ${postId}`
  );
  res.status(202).json({ data: editedPost });
});

app.delete("/delete/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  const { postId } = req.body;
  await appDataSource.query(
    `
        DELETE
        FROM posts
        WHERE posts.user_id = ${userId} and posts.id =${postId}
    `,
    [postId]
  );
  res.status(202).json({ message: "postingDeleted" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
