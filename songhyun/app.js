import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("db conneted");
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Health Check
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.post("/join", async (req, res) => {
  const { name, password, email } = req.body;
  const makeHash = async (unHashedPassword, saltRounds) => {
    return await bcrypt.hash(unHashedPassword, saltRounds);
  };

  const hash = await makeHash(password, 5);
  await myDataSource.query(
    `INSERT INTO users(
      name,
      password,
      email
    ) VALUES (?, ?, ?);
    `,
    [name, hash, email]
  );
  res.status(201).json({ message: "user created" });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const hashedPassword = await myDataSource.query(
    `SELECT 
      users.password,
      users.id
    FROM users
    WHERE users.name="${name}";
    `
  );
  const dbPassword = hashedPassword[0].password;
  const userId = hashedPassword[0].id;
  const check = await bcrypt.compare(password, dbPassword);
  if (!check) {
    res.json({ message: "Invalid User" });
  }

  const send = { userId: userId };
  const jwtToken = jwt.sign(send, process.env.secretKey);
  res.json({ accessToken: jwtToken });
});

app.post("/post", async (req, res) => {
  const { title, content } = req.body;
  const token = req.headers.token;
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    if (decoded) {
      await myDataSource.query(
        `INSERT INTO posts(
          title,
          content,
          user_id
        ) VALUES (?, ?, ?);`,
        [title, content, decoded.userId]
      );
      res.status(201).json({ message: "postCreated" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid Access Token" });
  }
});

app.get("/posts", async (req, res) => {
  await myDataSource.query(
    `SELECT
      posts.user_id AS userId,
      posts.id AS postingId,
      posts.imageUrl AS postingImageUrl,
      posts.content AS postingContent,
      users.userProfileImage
    FROM posts
    INNER JOIN users ON posts.user_id = users.id`,
    (err, rows) => {
      res.status(200).json({ data: rows });
    }
  );
});

app.get("/users", async (req, res) => {
  const { userId } = req.body;
  const userInfo = await myDataSource.query(
    `SELECT
      users.id AS userId,
      users.userProfileImage
    FROM users
    WHERE users.id=${userId}`
  );

  const posting = await myDataSource.query(
    `SELECT
      posts.id AS postingId,
      posts.imageUrl AS postingImageUrl,
      posts.content AS postingContent
    FROM posts, users
    WHERE posts.user_id=users.id`
  );
  userInfo[0]["postings"] = posting;
  res.status(200).json({ data: userInfo });
});

app.patch("/post/update", async (req, res) => {
  const { postId, updatedContent } = req.body;

  await myDataSource.query(
    `UPDATE posts
      SET content="${updatedContent}"
      WHERE posts.id=${postId}`
  );

  const posts = await myDataSource.query(
    `SELECT
      users.id AS userId,
      users.name AS userName,
      posts.id AS postingId,
      posts.title AS postingTitle,
      posts.content AS postingContent
    FROM users
    INNER JOIN posts
    ON users.id = posts.user_id`
  );

  res.status(201).json({ data: posts });
});

app.delete("/post/delete", async (req, res) => {
  const { postId } = req.body;

  await myDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}`,
    () => {
      res.status(200).json({ message: "postDeleted" });
    }
  );
});

app.post("/post/likes", async (req, res) => {
  const { userId, postId } = req.body;
  const [postLike] = await myDataSource.query(
    `SELECT
      user_id
    FROM likes
    WHERE likes.user_id=${userId}`
  );

  if (!postLike) {
    await myDataSource.query(
      `INSERT INTO likes(
        user_id,
        post_id
      ) VALUE (?, ?);
      `,
      [userId, postId]
    );
    res.status(201).json({ message: "likeCreated" });
  } else if (postLike) {
    await myDataSource.query(
      `DELETE FROM likes
        WHERE user_id=${userId} AND post_id=${postId};`
    );
    res.status(201).json({ message: "likeDeleted" });
  }
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () =>
    console.log(`server is listening on localhost ${PORT}`)
  );
};

start();
