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

// 회원가입(과제2)
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

// 글 등록(과제3)
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

// 글 보기(과제4)
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

// 유저가 작성한 글 보기(과제5)
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
    console.log("유저가 존재하지 않습니다.");
  }
});

// 특정 글 내용 수정(과제6)
app.patch("/post/update", async (req, res) => {
  const { updatedContent } = req.body;

  await myDataSource.query(
    `UPDATE posts
      SET content="${updatedContent}"
      WHERE posts.id=1`
  );

  const showDB = await myDataSource.query(
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

  res.status(201).json({ data: showDB });
});

// 특정 글 삭제(과제7)
app.delete("/post/delete", async (req, res) => {
  const { post_id } = req.body;

  await myDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${post_id}`,
    () => {
      res.status(200).json({ message: "postDeleted" });
    }
  );
});

// 좋아요 추가(과제8)
app.post("/post/likes", async (req, res) => {
  const { user_id, post_id } = req.body;
  const key = `IF(\n EXISTS(\n SELECT\n user_id\n          FROM likes\n          WHERE likes.user_id=${user_id}), 1, 0)`;
  const ifExists = await myDataSource.query(
    `SELECT
      IF(
        EXISTS(
          SELECT
            user_id
          FROM likes
          WHERE likes.user_id=${user_id}), 1, 0);
    `
  );
  // 같은 유저가 같은 글에 좋아요를 눌렀을 때 좋아요 삭제
  if (ifExists[0][key] == 0) {
    await myDataSource.query(
      `INSERT INTO likes(
        user_id,
        post_id
      ) VALUE (?, ?);
      `,
      [user_id, post_id]
    );
    res.status(201).json({ message: "likeCreated" });
  } else if (ifExists[0][key] == 1) {
    await myDataSource.query(
      `DELETE FROM likes
        WHERE user_id=${user_id} AND post_id=${post_id};`
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
