import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";

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

// 테스트
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// 회원가입
app.post("/join", async (req, res) => {
  const { name, password, email } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
      name,
      password,
      email
    ) VALUES (?, ?, ?);
    `,
    [name, password, email]
  );
  res.status(201).json({ message: "user created" });
});

// 글 등록
app.post("/post", async (req, res) => {
  const { title, content, user_id } = req.body;

  await myDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      user_id
    ) VALUES (?, ?, ?);
    `,
    [title, content, user_id]
  );
  res.status(201).json({ message: "postCreated" });
});

// 글 보기
app.get("/post/view", async (req, res) => {
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

// 유저가 작성한 글 보기
app.get("/user/view", async (req, res) => {
  try {
    const { user_id } = req.body;
    const userInfo = await myDataSource.query(
      `SELECT
        users.id AS userId,
        users.userProfileImage
      FROM users
      WHERE users.id=${user_id}`
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
  } catch (err) {
    console.log("error: " + err);
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
